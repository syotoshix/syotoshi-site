'use client'

import { useRef, useEffect } from 'react'

interface CardVisualProps {
  onOpenModal: () => void
}

export default function CardVisual({ onOpenModal }: CardVisualProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const shine = shineRef.current
    if (!card || !shine) return
    const MAX = 14

    function onMouseMove(e: MouseEvent) {
      const r = card!.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      const rx = y * -MAX
      const ry = x * MAX
      card!.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`
      shine!.style.opacity = '1'
      shine!.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,.13) 0%, transparent 60%)`
    }

    function onMouseLeave() {
      card!.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
      shine!.style.opacity = '0'
    }

    card.addEventListener('mousemove', onMouseMove)
    card.addEventListener('mouseleave', onMouseLeave)
    return () => {
      card.removeEventListener('mousemove', onMouseMove)
      card.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div className="jcard" ref={cardRef} onClick={onOpenModal}>
      <div className="jcard-shine" ref={shineRef} />
      <div className="jc-arc1" />
      <div className="jc-arc2" />
      <div className="jc-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://jupiter.global/images/jup-logo.svg" width={15} height={15} alt="Jupiter" />
        Jupiter
      </div>
      <div className="jc-visa">
        <div className="jc-visa-t">VISA</div>
        <div className="jc-visa-s">Infinite</div>
      </div>
      <div className="jc-dots">★ ★ ★ ★ ★</div>
    </div>
  )
}
