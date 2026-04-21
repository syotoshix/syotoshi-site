'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Image from 'next/image'
import type { KastCardDef } from '@/lib/kast-card'

interface KastCardWheelProps {
  cards:         KastCardDef[]
  selectedIndex: number
  onSelect:      (index: number) => void
  onOpenModal:   () => void
}

// ── Slot positions — desktop stage 300px ─────────────────────────────────────
const SLOT_STYLES: Record<number, { transform: string; opacity: number; zIndex: number }> = {
  [-2]: { transform: 'translateX(-362px) translateZ(-172px) rotateY(52deg)  scale(0.66)', opacity: 0.35, zIndex: 1 },
  [-1]: { transform: 'translateX(-228px) translateZ(-60px)  rotateY(38deg)  scale(0.83)', opacity: 0.62, zIndex: 2 },
  [ 0]: { transform: 'translateX(0)      translateZ(55px)   rotateY(0deg)   scale(1)',    opacity: 1,    zIndex: 4 },
  [ 1]: { transform: 'translateX(228px)  translateZ(-60px)  rotateY(-38deg) scale(0.83)', opacity: 0.62, zIndex: 2 },
  [ 2]: { transform: 'translateX(362px)  translateZ(-172px) rotateY(-52deg) scale(0.66)', opacity: 0.35, zIndex: 1 },
}

// ── Mobile slot positions — stage 260px ───────────────────────────────────────
const SLOT_STYLES_MOBILE: Record<number, { transform: string; opacity: number; zIndex: number }> = {
  [-2]: { transform: 'translateX(-295px) translateZ(-95px)  rotateY(38deg)  scale(0.65)', opacity: 0,    zIndex: 1 },
  [-1]: { transform: 'translateX(-130px) translateZ(-20px)  rotateY(18deg)  scale(0.87)', opacity: 0.88, zIndex: 2 },
  [ 0]: { transform: 'translateX(0)      translateZ(45px)   rotateY(0deg)   scale(1)',    opacity: 1,    zIndex: 4 },
  [ 1]: { transform: 'translateX(130px)  translateZ(-20px)  rotateY(-18deg) scale(0.87)', opacity: 0.88, zIndex: 2 },
  [ 2]: { transform: 'translateX(295px)  translateZ(-95px)  rotateY(-38deg) scale(0.65)', opacity: 0,    zIndex: 1 },
}

// ── Wheel ────────────────────────────────────────────────────────────────────

export default function KastCardWheel({
  cards,
  selectedIndex,
  onSelect,
  onOpenModal,
}: KastCardWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollLock   = useRef(false)
  const n    = cards.length
  const half = Math.floor(n / 2)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const slotStyles = isMobile ? SLOT_STYLES_MOBILE : SLOT_STYLES

  const next = useCallback(() => onSelect((selectedIndex + 1) % n), [selectedIndex, onSelect, n])
  const prev = useCallback(() => onSelect((selectedIndex + n - 1) % n), [selectedIndex, onSelect, n])

  // Scroll & keyboard
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (scrollLock.current) return
      scrollLock.current = true
      setTimeout(() => { scrollLock.current = false }, 500)
      if (e.deltaY > 0 || e.deltaX > 0) next()
      else prev()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev() }
    }
    const el = containerRef.current
    el?.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      el?.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [next, prev])

  // Touch swipe
  const touchStart = useRef(0)
  function onTouchStart(e: React.TouchEvent) { touchStart.current = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStart.current - e.changedTouches[0].clientX
    if (dx > 40) next()
    else if (dx < -40) prev()
  }

  return (
    <div
      ref={containerRef}
      className="kast-wheel-wrap"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="kast-wheel-stage">
        {cards.map((card, i) => {
          let pos = i - selectedIndex
          if (pos >  half) pos -= n
          if (pos < -half) pos += n
          const s        = slotStyles[pos] ?? { transform: 'scale(0)', opacity: 0, zIndex: 0 }
          const isCenter = pos === 0

          return (
            <div
              key={card.id}
              className="kast-wheel-slot"
              style={{ transform: s.transform, opacity: s.opacity, zIndex: s.zIndex, cursor: 'pointer' }}
              onClick={() => isCenter ? onOpenModal() : onSelect(i)}
            >
              <div className="kast-wheel-card-face">
                <Image
                  src={card.img}
                  alt={card.name}
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  draggable={false}
                  priority={isCenter}
                />
              </div>
            </div>
          )
        })}
      </div>

      <style suppressHydrationWarning>{`
        .kast-wheel-wrap {
          display: flex; flex-direction: column; align-items: center;
          margin-top: 0; margin-bottom: 0;
          flex-shrink: 0; user-select: none; width: 100%; overflow: visible;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .kast-wheel-stage {
          position: relative; width: 300px; height: 189px;
          perspective: 1600px; transform-style: preserve-3d; overflow: visible;
        }
        .kast-wheel-slot {
          position: absolute; top: 0; left: 0; width: 300px;
          transition: transform .55s cubic-bezier(.23,1,.32,1), opacity .4s ease;
          transform-style: preserve-3d;
        }
        .kast-wheel-card-face {
          width: 300px; border-radius: 18px; position: relative; overflow: visible;
          aspect-ratio: 1.586; transform-style: preserve-3d; cursor: pointer;
          background: transparent;
        }

        @media (max-width: 900px) {
          .kast-wheel-wrap {
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%);
          }
          .kast-wheel-stage { width: 260px; height: 164px; }
          .kast-wheel-slot  { width: 260px; }
          .kast-wheel-card-face { width: 260px; }
        }
        @media (max-width: 480px) {
          .kast-wheel-stage { width: 220px; height: 139px; }
          .kast-wheel-slot  { width: 220px; }
          .kast-wheel-card-face { width: 220px; }
        }
      `}</style>
    </div>
  )
}
