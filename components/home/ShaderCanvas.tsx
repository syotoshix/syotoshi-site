'use client';

import { useEffect, useRef } from 'react';

const MAX_TRAIL = 48;
const TRAIL_DURATION = 0.9;

const VERT = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uTrailPos[48];
uniform float uTrailAge[48];

out vec4 fragColor;

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash22(i),           f),
        dot(hash22(i+vec2(1,0)), f-vec2(1,0)), u.x),
    mix(dot(hash22(i+vec2(0,1)), f-vec2(0,1)),
        dot(hash22(i+vec2(1,1)), f-vec2(1,1)), u.x),
    u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.1 + vec2(1.7, 9.2); a *= 0.5; }
  return v * 0.5 + 0.5;
}

void main() {
  vec2 fc = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  float t  = uTime;

  // ── Grid ──────────────────────────────────────────────────────────────────
  float gridH  = 38.0;
  float cellPx = uResolution.y / gridH;
  vec2  cell   = floor(fc / cellPx);
  vec2  cellF  = fract(fc / cellPx);
  vec2  cellCtr= (cell + 0.5) * cellPx;

  float gap  = 0.10;
  float inPx = step(gap, cellF.x) * step(gap, cellF.y)
             * step(cellF.x, 1.0-gap) * step(cellF.y, 1.0-gap);

  vec2 nuv = cell / gridH;

  // ── FBM cloud layers ──────────────────────────────────────────────────────
  float cloud1 = fbm(nuv * 2.2 + vec2(t * 0.10, t * 0.07));
  float cloud2 = fbm(nuv * 4.5 + vec2(t * 0.22, t * 0.17));
  float cloud3 = fbm(nuv * 9.0 + vec2(t * 0.30, t * 0.38));
  float raw = cloud1 * 0.55 + cloud2 * 0.30 + cloud3 * 0.15;

  // ── Energy: true black for most, hard threshold into vivid ───────────────
  // Tiny scattered faint dots in dark regions
  float dimDots  = smoothstep(0.44, 0.52, raw) * 0.06;
  // Hard vivid clusters — narrow ramp for sharp on/off feel
  float clusters = smoothstep(0.54, 0.68, raw);
  float cloudEnergy = clamp(dimDots + clusters, 0.0, 1.0);

  // Separate slow blob layer that independently hits near-white then fades
  float pulseRaw    = fbm(nuv * 2.8 + vec2(t * 0.07, t * 0.05));
  float brightPulse = pow(smoothstep(0.50, 0.72, pulseRaw), 1.2);
  cloudEnergy = clamp(cloudEnergy + brightPulse * 0.95, 0.0, 1.0);

  // ── Cursor trail ──────────────────────────────────────────────────────────
  float trailR = uResolution.y * 0.05;
  float trail  = 0.0;
  for (int i = 0; i < 48; i++) {
    float decay = clamp(1.0 - uTrailAge[i], 0.0, 1.0);
    float prox  = max(0.0, 1.0 - length(cellCtr - uTrailPos[i]) / trailR);
    trail += prox * decay * decay;
  }
  trail = clamp(trail, 0.0, 1.0);

  float energy = clamp(cloudEnergy + trail * 1.5, 0.0, 1.0);

  // ── Hue: large-scale distinct patches ─────────────────────────────────────
  float wLarge = fbm(nuv * 1.8 + vec2(t * 0.05 + 10.0, t * 0.06 + 7.0));
  float wFine  = fbm(nuv * 6.0 + vec2(t * 0.16 + 20.0, t * 0.13 + 14.0));
  float warmth = smoothstep(0.25, 0.75, wLarge * 0.60 + wFine * 0.40);

  // Cool: black → electric blue → bright cyan → white-cyan
  // Jump to vivid fast (short ramp 0→0.15 for black→vivid)
  vec3 coolCol = mix(vec3(0.00, 0.00, 0.04), vec3(0.00, 0.50, 1.00),
                     smoothstep(0.0, 0.15, energy));
  coolCol = mix(coolCol, vec3(0.00, 0.92, 1.00), smoothstep(0.12, 0.55, energy));
  coolCol = mix(coolCol, vec3(0.70, 0.98, 1.00), smoothstep(0.50, 1.00, energy));

  // Warm: black → hot magenta (skip purple) → bright pink → white-pink
  vec3 warmCol = mix(vec3(0.02, 0.00, 0.04), vec3(1.00, 0.00, 0.75),
                     smoothstep(0.0, 0.15, energy));
  warmCol = mix(warmCol, vec3(1.00, 0.20, 0.90), smoothstep(0.12, 0.55, energy));
  warmCol = mix(warmCol, vec3(1.00, 0.72, 1.00), smoothstep(0.50, 1.00, energy));

  vec3 col = mix(coolCol, warmCol, warmth);

  // White-hot core at peak energy
  col = mix(col, vec3(1.0, 0.97, 1.0), pow(energy, 4.5) * 0.92);

  // Trail → bright white-pink
  col = mix(col, vec3(1.0, 0.82, 1.0), trail * 0.65);

  // Glow bleed into gap
  vec3 finalCol = col * inPx + col * (pow(energy, 2.0) * 0.16);

  fragColor = vec4(finalCol, 1.0);
}
`;

type TrailPoint = { x: number; y: number; time: number };

export default function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef  = useRef<TrailPoint[]>([]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error('Shader error:', gl.getShaderInfoLog(shader));
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.error('Program error:', gl.getProgramInfoLog(program));
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
       1, -1,  1,  1, -1,  1,
    ]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime       = gl.getUniformLocation(program, 'uTime');
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uTrailPos   = gl.getUniformLocation(program, 'uTrailPos');
    const uTrailAge   = gl.getUniformLocation(program, 'uTrailAge');

    const posArr = new Float32Array(MAX_TRAIL * 2);
    const ageArr = new Float32Array(MAX_TRAIL).fill(1);

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const pushPoint = (x: number, y: number) =>
      trailRef.current.push({ x, y, time: performance.now() / 1000 });
    const onMouse = (e: MouseEvent) => pushPoint(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++)
        pushPoint(e.touches[i].clientX, e.touches[i].clientY);
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });

    const start = performance.now() / 1000;

    const render = () => {
      const now = performance.now() / 1000;

      trailRef.current = trailRef.current
        .filter(p => now - p.time < TRAIL_DURATION)
        .slice(-MAX_TRAIL);

      posArr.fill(0);
      ageArr.fill(1);
      trailRef.current.forEach((p, i) => {
        posArr[i * 2]     = p.x;
        posArr[i * 2 + 1] = p.y;
        ageArr[i]         = (now - p.time) / TRAIL_DURATION;
      });

      gl.uniform1f(uTime, now - start);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2fv(uTrailPos, posArr);
      gl.uniform1fv(uTrailAge, ageArr);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'block' }}
    />
  );
}
