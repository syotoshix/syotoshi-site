'use client';

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  float t = uTime * 0.16;

  // Mouse: push field away from cursor
  vec2 m = (vec2(uMouse.x, uResolution.y - uMouse.y) / uResolution - 0.5)
         * vec2(uResolution.x / uResolution.y, 1.0) * 2.0;
  float md = length(uv - m);
  uv += (md > 0.001 ? normalize(uv - m) : vec2(0.0)) * exp(-md * 6.0) * 0.28;

  vec2 p = uv;

  // ── Domain warp: smooth sine only, no noise ──────────────────────────────
  // Pass 1: low-frequency, large amplitude — creates the main organic drift
  vec2 pw = p;
  pw += vec2(
    0.28 * sin(p.y * 2.6 + t * 0.90) + 0.14 * cos(p.x * 2.0 + t * 0.65),
    0.28 * cos(p.x * 2.6 + t * 0.80) + 0.14 * sin(p.y * 2.0 + t * 0.70)
  );

  // Pass 2: higher frequency, smaller amplitude — adds surface micro-curvature
  pw += vec2(
    0.10 * sin(pw.y * 5.2 + t * 1.20) + 0.06 * cos(pw.x * 4.0 + t * 0.85),
    0.10 * cos(pw.x * 5.2 + t * 1.05) + 0.06 * sin(pw.y * 4.0 + t * 1.15)
  );

  // ── Scalar height field ────────────────────────────────────────────────────
  // Product of two perpendicular waves = saddle/hill topology after warping
  float h  = sin(pw.x * 2.1 + t * 0.42) * cos(pw.y * 1.9 + t * 0.36);
  // Add diagonal harmonics for richer surface detail
  h += 0.42 * sin(pw.x * 1.4 + pw.y * 2.3 + t * 0.50);
  h += 0.30 * cos(pw.x * 2.6 - pw.y * 1.4 + t * 0.44);

  // ── Soft Gaussian envelope: isolates blob, keeps rest black ───────────────
  float env = exp(-dot(p, p) * 0.75);
  env = clamp(env * 1.85, 0.0, 1.0);

  // ── Contour lines ─────────────────────────────────────────────────────────
  float v     = sin(h * 34.0 - t * 2.0);
  float lines = smoothstep(0.90, 1.0, abs(v)) * env;

  // ── Neon purple: base wire + soft glow + bright core ─────────────────────
  vec3 col  = vec3(0.48, 0.06, 0.82) * lines;
  col      += vec3(0.70, 0.20, 0.96) * pow(lines, 2.0) * 0.62;
  col      += vec3(0.93, 0.68, 1.00) * pow(lines, 7.0) * 0.24;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef<[number, number]>([0, 0]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
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
    const uMouse      = gl.getUniformLocation(program, 'uMouse');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => { mouseRef.current = [e.clientX, e.clientY]; };
    window.addEventListener('mousemove', onMouse);

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
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
