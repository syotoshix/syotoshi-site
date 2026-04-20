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

// ── Slot positions (supports up to 5 cards: positions -2 … +2) ───────────────
const SLOT_STYLES: Record<number, { transform: string; opacity: number; zIndex: number }> = {
  [-2]: { transform: 'translateX(-330px) translateZ(-160px) rotateY(52deg)  scale(0.66)', opacity: 0.35, zIndex: 1 },
  [-1]: { transform: 'translateX(-215px) translateZ(-55px)  rotateY(38deg)  scale(0.83)', opacity: 0.62, zIndex: 2 },
  [ 0]: { transform: 'translateX(0)      translateZ(50px)   rotateY(0deg)   scale(1)',    opacity: 1,    zIndex: 4 },
  [ 1]: { transform: 'translateX(215px)  translateZ(-55px)  rotateY(-38deg) scale(0.83)', opacity: 0.62, zIndex: 2 },
  [ 2]: { transform: 'translateX(330px)  translateZ(-160px) rotateY(-52deg) scale(0.66)', opacity: 0.35, zIndex: 1 },
}

// ── Mobile slot positions — tighter translations so adjacent cards peek in ───
const SLOT_STYLES_MOBILE: Record<number, { transform: string; opacity: number; zIndex: number }> = {
  [-2]: { transform: 'translateX(-260px) translateZ(-120px) rotateY(45deg)  scale(0.6)',  opacity: 0,    zIndex: 1 },
  [-1]: { transform: 'translateX(-145px) translateZ(-40px)  rotateY(32deg)  scale(0.78)', opacity: 0.7,  zIndex: 2 },
  [ 0]: { transform: 'translateX(0)      translateZ(40px)   rotateY(0deg)   scale(1)',    opacity: 1,    zIndex: 4 },
  [ 1]: { transform: 'translateX(145px)  translateZ(-40px)  rotateY(-32deg) scale(0.78)', opacity: 0.7,  zIndex: 2 },
  [ 2]: { transform: 'translateX(260px)  translateZ(-120px) rotateY(-45deg) scale(0.6)',  opacity: 0,    zIndex: 1 },
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

      {/* Nav row */}
      <div className="kast-wheel-nav">
        <div className="kast-wheel-hint-row">
          <button className="kast-wheel-arrow-btn" onClick={prev} aria-label="Previous card">
            <svg width={16} height={10} viewBox="0 0 16 10" fill="none">
              <path d="M6 1L1 5l5 4" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              <line x1={1} y1={5} x2={15} y2={5} stroke="white" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
          <span className="kast-wheel-hint-text">SCROLL TO ROTATE</span>
          <button className="kast-wheel-arrow-btn" onClick={next} aria-label="Next card">
            <svg width={16} height={10} viewBox="0 0 16 10" fill="none">
              <path d="M10 1l5 4-5 4" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              <line x1={15} y1={5} x2={1} y2={5} stroke="white" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <style suppressHydrationWarning>{`
        .kast-wheel-wrap {
          display: flex; flex-direction: column; align-items: center;
          margin-top: .5rem; margin-bottom: .6rem;
          flex-shrink: 0; user-select: none; width: 100%; overflow: visible;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
        }
        .kast-wheel-stage {
          position: relative; width: 270px; height: 170px;
          perspective: 1300px; transform-style: preserve-3d; overflow: visible;
        }
        .kast-wheel-slot {
          position: absolute; top: 0; left: 0; width: 270px;
          transition: transform .55s cubic-bezier(.23,1,.32,1), opacity .4s ease;
          transform-style: preserve-3d;
        }
        .kast-wheel-card-face {
          width: 270px; border-radius: 18px; position: relative; overflow: visible;
          aspect-ratio: 1.586; transform-style: preserve-3d; cursor: pointer;
          background: transparent;
        }
        .kast-wheel-nav {
          display: flex; flex-direction: column; align-items: center; gap: .45rem; margin-top: .7rem;
        }
        .kast-wheel-scroll-icon { display: flex; align-items: center; justify-content: center; opacity: .85; }
        .kast-wheel-hint-row { display: flex; align-items: center; gap: .55rem; }
        .kast-wheel-hint-text {
          font-size: .6rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #fff;
        }
        .kast-wheel-arrow-btn {
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; padding: 4px; cursor: pointer;
          opacity: .75; transition: opacity .15s; flex-shrink: 0;
        }
        .kast-wheel-arrow-btn:hover { opacity: 1; }

        @media (max-width: 900px) {
          .kast-wheel-wrap {
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
          }
          .kast-wheel-stage { width: 220px; height: 139px; }
          .kast-wheel-slot  { width: 220px; }
          .kast-wheel-card-face { width: 220px; }
        }
        @media (max-width: 480px) {
          .kast-wheel-stage { width: 190px; height: 120px; }
          .kast-wheel-slot  { width: 190px; }
          .kast-wheel-card-face { width: 190px; }
        }
      `}</style>
    </div>
  )
}
