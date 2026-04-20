'use client'

import Image from 'next/image'

interface KastNavBarProps {
  onOpenModal: () => void
}

export default function KastNavBar({ onOpenModal }: KastNavBarProps) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        background: 'rgba(2,8,20,.92)',
        borderBottom: '1px solid rgba(79,156,249,.08)',
        backdropFilter: 'blur(14px)',
        zIndex: 10,
        position: 'relative',
        height: '52px',
      }}
    >
      <div
        className="nav-logo"
        style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 700, fontSize: '1rem' }}
      >
        <Image src="/kast-card/logo.png" alt="KAST" width={22} height={22} style={{ objectFit: 'contain' }} />
        <span>KAST Card</span>
      </div>

      <div
        style={{
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
          background: 'rgba(79,156,249,.13)', color: '#4f9cf9',
          border: '1px solid rgba(79,156,249,.2)', borderRadius: '99px', padding: '2px 10px',
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
        className="nav-pill-desktop"
      >
        KAST Visa Card Cashback Calculator
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
        <button
          onClick={onOpenModal}
          style={{
            background: '#4f9cf9', color: '#020814', fontWeight: 700, fontSize: '.8rem',
            border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer',
            transition: 'background .15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#3b82f6')}
          onMouseLeave={e => (e.currentTarget.style.background = '#4f9cf9')}
        >
          Get the Card →
        </button>
      </div>

      <style suppressHydrationWarning>{`
        @media (max-width: 900px) {
          .nav-pill-desktop { display: none !important; }
        }
        body.light nav {
          background: rgba(232,244,255,.95) !important;
          border-bottom-color: rgba(79,156,249,.2) !important;
        }
      `}</style>
    </nav>
  )
}
