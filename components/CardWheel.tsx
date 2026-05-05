'use client'

import { useEffect, useRef, useCallback } from 'react'
import { CARD_DEFS } from '@/lib/cards'

interface CardWheelProps {
  selectedIndex: number
  onSelect: (index: number) => void
  onOpenModal: () => void
}

/* ── Card faces ── */

function JupiterFace({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="wheel-card-face wheel-card-jupiter" onClick={onOpenModal}>
      <div className="jcard-shine" />
      <div className="jc-arc1" /><div className="jc-arc2" />
      <div className="jc-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://jupiter.global/images/jup-logo.svg" width={15} height={15} alt="Jupiter" />
        Jupiter
      </div>
      <div className="jc-visa"><div className="jc-visa-t">VISA</div><div className="jc-visa-s">Infinite</div></div>
      <div className="jc-dots">★ ★ ★ ★ ★</div>
    </div>
  )
}

function EtherFiFace() {
  return (
    <div className="wheel-card-face wheel-card-etherfi">
      <div className="wc-shine" />
      <div className="wc-grid" />
      <div className="wc-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 12l8 5 8-5L12 2z" fill="rgba(167,139,250,.9)" />
          <path d="M4 12l8 5v5l-8-10z" fill="rgba(167,139,250,.5)" />
          <path d="M20 12l-8 5v5l8-10z" fill="rgba(139,92,246,.7)" />
        </svg>
        <span>ether.fi</span>
      </div>
      <div className="wc-type"><div className="wc-type-t">VISA</div><div className="wc-type-s">Infinite</div></div>
      <div className="wc-dots">**** **** **** ****</div>
    </div>
  )
}

function GnosisPayFace() {
  return (
    <div className="wheel-card-face wheel-card-gnosispay">
      <div className="wc-shine" />
      <div className="wc-grid wc-grid-gno" />
      <div className="wc-logo">
        {/* Gnosis owl-like icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="rgba(0,184,122,.8)" strokeWidth="1.5"/>
          <circle cx="8.5" cy="10.5" r="2" fill="rgba(0,184,122,.9)"/>
          <circle cx="15.5" cy="10.5" r="2" fill="rgba(0,184,122,.9)"/>
          <path d="M9 15.5c0 0 1.5 1.5 3 1.5s3-1.5 3-1.5" stroke="rgba(0,184,122,.8)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span>Gnosis Pay</span>
      </div>
      <div className="wc-type"><div className="wc-type-t">VISA</div><div className="wc-type-s">Debit</div></div>
      <div className="wc-dots">**** **** **** ****</div>
    </div>
  )
}

function BleapFace() {
  return (
    <div className="wheel-card-face wheel-card-bleap">
      <div className="wc-shine" />
      <div className="wc-grid wc-grid-bleap" />
      <div className="wc-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 12 Q8 4 12 12 Q16 20 20 12" stroke="rgba(96,165,250,.9)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <circle cx="4" cy="12" r="1.5" fill="rgba(96,165,250,.9)"/>
          <circle cx="20" cy="12" r="1.5" fill="rgba(96,165,250,.9)"/>
        </svg>
        <span>Bleap</span>
      </div>
      <div className="wc-type"><div className="wc-type-t">VISA</div><div className="wc-type-s">Card</div></div>
      <div className="wc-dots">**** **** **** ****</div>
    </div>
  )
}

function MetaMaskFace() {
  return (
    <div className="wheel-card-face wheel-card-metamask">
      <div className="wc-shine" />
      <div className="wc-grid wc-grid-mm" />
      <div className="wc-logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 3L13.5 8.5 15 5.5 21 3z" fill="#e17726" />
          <path d="M3 3l7.4 5.6L9 5.5 3 3z" fill="#e27625" />
          <path d="M18.5 16.5l-2 3 4.5 1.2 1.3-4.1-3.8-.1z" fill="#e27625" />
          <path d="M2.2 16.6l1.3 4.1 4.5-1.2-2-3-3.8.1z" fill="#e27625" />
          <path d="M7.7 10.8l-1.3 2 4.6.2-.2-5-3.1 2.8z" fill="#e27625" />
          <path d="M16.3 10.8l-3.2-2.9-.1 5 4.6-.2-1.3-1.9z" fill="#e27625" />
          <path d="M8 19.7l2.8-1.3-2.4-1.9-.4 3.2z" fill="#e27625" />
          <path d="M13.2 18.4l2.8 1.3-.5-3.2-2.3 1.9z" fill="#e27625" />
        </svg>
        <span>MetaMask</span>
      </div>
      <div className="wc-type wc-mc">
        <div className="wc-mc-circles">
          <div className="wc-mc-c1" /><div className="wc-mc-c2" />
        </div>
      </div>
      <div className="wc-dots">**** **** **** ****</div>
    </div>
  )
}

const FACES = [
  (props: { onOpenModal: () => void }) => <EtherFiFace />,
  (props: { onOpenModal: () => void }) => <GnosisPayFace />,
  (props: { onOpenModal: () => void }) => <JupiterFace onOpenModal={props.onOpenModal} />,
  (props: { onOpenModal: () => void }) => <BleapFace />,
  (props: { onOpenModal: () => void }) => <MetaMaskFace />,
]

/* ── Position transforms for the 5-slot arc ── */
const SLOT_STYLES: Record<number, { transform: string; opacity: number; zIndex: number }> = {
  [-2]: { transform: 'translateX(-330px) translateZ(-160px) rotateY(52deg) scale(0.66)', opacity: 0.38, zIndex: 1 },
  [-1]: { transform: 'translateX(-210px) translateZ(-55px)  rotateY(36deg) scale(0.84)', opacity: 0.62, zIndex: 2 },
  [0]:  { transform: 'translateX(0)      translateZ(50px)   rotateY(0deg)  scale(1)',    opacity: 1,    zIndex: 4 },
  [1]:  { transform: 'translateX(210px)  translateZ(-55px)  rotateY(-36deg) scale(0.84)', opacity: 0.62, zIndex: 2 },
  [2]:  { transform: 'translateX(330px)  translateZ(-160px) rotateY(-52deg) scale(0.66)', opacity: 0.38, zIndex: 1 },
}

export default function CardWheel({ selectedIndex, onSelect, onOpenModal }: CardWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollLock = useRef(false)
  const n = CARD_DEFS.length

  const next = useCallback(() => onSelect((selectedIndex + 1) % n), [selectedIndex, onSelect, n])
  const prev = useCallback(() => onSelect((selectedIndex + n - 1) % n), [selectedIndex, onSelect, n])

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

  // touch swipe
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
      className="card-wheel-wrap"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="card-wheel-stage">
        {CARD_DEFS.map((card, i) => {
          let pos = i - selectedIndex
          // wrap to range [-2, 2] for 5 cards
          if (pos >  2) pos -= n
          if (pos < -2) pos += n
          const s = SLOT_STYLES[pos] ?? { transform: 'scale(0)', opacity: 0, zIndex: 0 }

          return (
            <div
              key={card.id}
              className="wheel-slot"
              style={{ transform: s.transform, opacity: s.opacity, zIndex: s.zIndex, cursor: pos === 0 ? 'default' : 'pointer' }}
              onClick={() => pos !== 0 && onSelect(i)}
            >
              {FACES[i]({ onOpenModal })}
            </div>
          )
        })}
      </div>

      {/* Nav row */}
      <div className="wheel-nav">
        {/* Mouse scroll icon */}
        <div className="wheel-scroll-icon" aria-hidden="true">
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
            <rect x="1" y="1" width="18" height="26" rx="9" stroke="white" strokeWidth="1.5"/>
            <rect x="8.5" y="5" width="3" height="6" rx="1.5" fill="white" opacity="0.9"/>
          </svg>
        </div>
        {/* Hint row with inline arrows */}
        <div className="wheel-hint-row">
          <button className="wheel-arrow-btn" onClick={prev} aria-label="Previous card">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M6 1L1 5l5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="1" y1="5" x2="15" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <span className="wheel-hint-text">SCROLL TO ROTATE</span>
          <button className="wheel-arrow-btn" onClick={next} aria-label="Next card">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M10 1l5 4-5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="15" y1="5" x2="1" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .card-wheel-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: .75rem;
          margin-bottom: 1.1rem;
          flex-shrink: 0;
          user-select: none;
          width: 100%;
          overflow: visible;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
        }
        .card-wheel-stage {
          position: relative;
          width: 270px;
          height: 170px;
          perspective: 1300px;
          transform-style: preserve-3d;
          overflow: visible;
        }
        .wheel-slot {
          position: absolute;
          top: 0; left: 0;
          width: 270px;
          transition: transform .55s cubic-bezier(.23,1,.32,1), opacity .4s ease;
          transform-style: preserve-3d;
        }

        /* shared card face */
        .wheel-card-face {
          width: 270px;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          aspect-ratio: 1.586;
          box-shadow: 0 16px 52px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06);
          transform-style: preserve-3d;
        }

        /* Jupiter */
        .wheel-card-jupiter {
          background: linear-gradient(135deg, #0a1e2e 0%, #020e14 60%, #031822 100%);
          border: 1px solid rgba(0,230,207,.18);
          cursor: pointer;
        }
        .wheel-card-jupiter:hover {
          box-shadow: 0 24px 70px rgba(0,0,0,.7), 0 0 0 1px rgba(0,230,207,.2), 0 0 30px rgba(0,230,207,.08);
        }

        /* Ether.fi */
        .wheel-card-etherfi {
          background: linear-gradient(135deg, #150d2a 0%, #08050f 60%, #100820 100%);
          border: 1px solid rgba(139,92,246,.2);
        }

        /* Gnosis Pay */
        .wheel-card-gnosispay {
          background: linear-gradient(135deg, #052918 0%, #010f08 60%, #031a0f 100%);
          border: 1px solid rgba(0,184,122,.2);
        }
        .wc-grid-gno {
          background-image:
            linear-gradient(rgba(0,184,122,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,184,122,.06) 1px, transparent 1px) !important;
        }

        /* Bleap */
        .wheel-card-bleap {
          background: linear-gradient(135deg, #07152a 0%, #020814 60%, #04112a 100%);
          border: 1px solid rgba(96,165,250,.2);
        }
        .wc-grid-bleap {
          background-image:
            linear-gradient(rgba(96,165,250,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,.06) 1px, transparent 1px) !important;
        }

        /* MetaMask */
        .wheel-card-metamask {
          background: linear-gradient(135deg, #271400 0%, #0d0700 60%, #1a0d00 100%);
          border: 1px solid rgba(246,133,27,.2);
        }
        .wc-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(139,92,246,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }
        .wc-grid-mm {
          background-image:
            linear-gradient(rgba(246,133,27,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(246,133,27,.06) 1px, transparent 1px) !important;
        }
        .wc-shine {
          position: absolute; inset: 0; border-radius: 18px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.07) 0%, transparent 60%);
          pointer-events: none; z-index: 5;
        }
        .wc-logo {
          position: absolute; top: 15px; left: 18px;
          display: flex; align-items: center; gap: 7px;
          font-weight: 700; font-size: .95rem; color: #fff;
        }
        .wc-type { position: absolute; top: 13px; right: 15px; text-align: right; }
        .wc-type-t { font-size: 1.2rem; font-weight: 800; letter-spacing: -.02em; color: #fff; }
        .wc-type-s { font-size: .56rem; color: rgba(255,255,255,.5); letter-spacing: .05em; }
        .wc-dots {
          position: absolute; bottom: 17px; left: 18px;
          font-size: .85rem; letter-spacing: .18em; color: rgba(255,255,255,.35);
        }
        .wc-mc { top: 12px; right: 14px; }
        .wc-mc-circles { display: flex; }
        .wc-mc-c1 { width: 26px; height: 26px; border-radius: 50%; background: rgba(235,0,27,.75); }
        .wc-mc-c2 { width: 26px; height: 26px; border-radius: 50%; background: rgba(255,163,0,.75); margin-left: -10px; }

        /* Nav row */
        .wheel-nav {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .5rem;
          margin-top: .75rem;
        }
        .wheel-scroll-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
        }
        .wheel-hint-row {
          display: flex;
          align-items: center;
          gap: .55rem;
        }
        .wheel-hint-text {
          font-size: .6rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #fff;
        }
        .wheel-arrow-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          opacity: 0.75;
          transition: opacity .15s;
          flex-shrink: 0;
        }
        .wheel-arrow-btn:hover {
          opacity: 1;
        }

        @media (max-width: 900px) {
          .card-wheel-stage { width: 240px; height: 152px; }
          .wheel-slot { width: 240px; }
          .wheel-card-face { width: 240px; }
        }
        @media (max-width: 480px) {
          .card-wheel-stage { width: 210px; height: 133px; }
          .wheel-slot { width: 210px; }
          .wheel-card-face { width: 210px; }
        }
      `}</style>
    </div>
  )
}
