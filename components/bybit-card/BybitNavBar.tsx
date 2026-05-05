'use client'

export type CardVariant = 'eu' | 'global'

interface BybitNavBarProps {
  onOpenModal:     () => void
  variant:         CardVariant
  onVariantChange: (v: CardVariant) => void
}

export default function BybitNavBar({ onOpenModal, variant, onVariantChange }: BybitNavBarProps) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        background: 'rgba(14,8,0,.92)',
        borderBottom: '1px solid rgba(247,166,0,.08)',
        backdropFilter: 'blur(14px)',
        zIndex: 10,
        position: 'relative',
        height: '52px',
      }}
    >
      <div
        className="nav-logo"
        style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 800, fontSize: '1rem' }}
      >
        <span className="bc-wordmark" style={{ display: 'flex', alignItems: 'center', letterSpacing: '-0.01em' }}>
          <span className="bc-wordmark-text" style={{ color: '#ffffff' }}>BYB</span>
          <span
            style={{
              display: 'inline-block', width: '3.5px', height: '1em',
              background: '#f7a600', borderRadius: '2px', margin: '0 1.5px', flexShrink: 0,
            }}
          />
          <span className="bc-wordmark-text" style={{ color: '#ffffff' }}>T</span>
        </span>
        <span className="bc-wordmark-sub" style={{ color: '#a8bdd4', fontWeight: 500, fontSize: '.85rem' }}>Card</span>

        {/* EU / US variant toggle */}
        <div
          style={{
            display: 'flex', gap: 0,
            background: 'rgba(255,255,255,.06)',
            borderRadius: '99px', padding: '2px',
            border: '1px solid rgba(255,255,255,.08)',
            marginLeft: '.35rem',
          }}
        >
          {(['eu', 'global'] as const).map(v => (
            <button
              key={v}
              onClick={() => onVariantChange(v)}
              style={{
                background: variant === v ? '#f7a600' : 'transparent',
                color: variant === v ? '#0e0800' : 'var(--n4)',
                border: 'none', borderRadius: '99px',
                padding: '2px 9px', fontSize: '.62rem', fontWeight: 700,
                letterSpacing: '.06em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background .15s, color .15s',
              }}
            >
              {v === 'eu' ? '🇪🇺' : '🌐'} {v === 'eu' ? 'EU' : 'Global'}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
          background: 'rgba(247,166,0,.13)', color: '#f7a600',
          border: '1px solid rgba(247,166,0,.2)', borderRadius: '99px', padding: '2px 10px',
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
        className="nav-pill-desktop"
      >
        Bybit Card Cashback Calculator
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
        <button
          onClick={onOpenModal}
          style={{
            background: '#f7a600', color: '#0e0800', fontWeight: 700, fontSize: '.8rem',
            border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer',
            textDecoration: 'none', transition: 'background .15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#d4900a')}
          onMouseLeave={e => (e.currentTarget.style.background = '#f7a600')}
        >
          Get the Card →
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-pill-desktop { display: none !important; }
        }
        body.light nav {
          background: rgba(255,248,230,.95) !important;
          border-bottom-color: rgba(247,166,0,.2) !important;
        }
      `}</style>
    </nav>
  )
}
