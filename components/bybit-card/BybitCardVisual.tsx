'use client'

import { useRef, useEffect } from 'react'

interface BybitCardVisualProps {
  onOpenModal: () => void
  variant:     'eu' | 'global'
}

export default function BybitCardVisual({ onOpenModal, variant }: BybitCardVisualProps) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card  = cardRef.current
    const shine = shineRef.current
    if (!card || !shine) return
    const MAX = 14

    function onMouseMove(e: MouseEvent) {
      const r  = card!.getBoundingClientRect()
      const x  = (e.clientX - r.left) / r.width  - 0.5
      const y  = (e.clientY - r.top)  / r.height - 0.5
      const rx = y * -MAX
      const ry = x *  MAX
      card!.style.transform  = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`
      shine!.style.opacity   = '1'
      shine!.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,.25) 0%, transparent 60%)`
    }

    function onMouseLeave() {
      card!.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
      shine!.style.opacity  = '0'
    }

    card.addEventListener('mousemove',  onMouseMove)
    card.addEventListener('mouseleave', onMouseLeave)
    return () => {
      card.removeEventListener('mousemove',  onMouseMove)
      card.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div className="bcard" ref={cardRef} onClick={onOpenModal}>
      <div className="bcard-shine" ref={shineRef} />
      {/* Wave arcs */}
      <div className="bc-arc1" />
      <div className="bc-arc2" />
      <div className="bc-arc3" />
      <div className="bc-arc4" />
      <div className="bc-arc5" />
      <div className="bc-arc6" />
      {/* BYBIT logo + region */}
      <div className="bc-logo">
        <span className="bc-logo-by">BYB</span>
        <span className="bc-logo-i" />
        <span className="bc-logo-t">T</span>
        <span
          style={{
            fontSize: '.58em', fontWeight: 700, letterSpacing: '.08em',
            color: 'rgba(0,0,0,.3)', marginLeft: '4px',
            alignSelf: 'flex-end', paddingBottom: '.05em',
          }}
        >
          {variant === 'eu' ? 'EU' : 'Global'}
        </span>
      </div>
      {/* Mastercard logo + Debit label — bottom right */}
      <div className="bc-card-label">
        <div className="bc-card-label-t">Debit</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 618" width="52" height="32" style={{ display: 'block' }}>
          <path fill="#EB001B" d="m308,0a309,309 0 1,0 2,0z"/>
          <path fill="#F79E1B" d="m690,0a309,309 0 1,0 2,0z"/>
          <path fill="#FF5F00" d="m500,66a309,309 0 0,0 0,486 309,309 0 0,0 0-486"/>
        </svg>
      </div>
      {/* Stars */}
      <div className="bc-dots">★ ★ ★ ★</div>
    </div>
  )
}
