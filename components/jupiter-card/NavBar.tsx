'use client'

interface NavBarProps {
  countdown: string | null
  onOpenModal: () => void
}

export default function NavBar({ countdown, onOpenModal }: NavBarProps) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        background: 'rgba(2,14,20,.92)',
        borderBottom: '1px solid rgba(0,230,207,.08)',
        backdropFilter: 'blur(14px)',
        zIndex: 10,
        position: 'relative',
        height: '52px',
      }}
    >
      <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 700, fontSize: '1rem' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://jupiter.global/images/jup-logo.svg" width={24} height={24} alt="Jupiter" />
        <span>Jupiter Card</span>
      </div>

      <div
        style={{
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
          background: 'rgba(0,230,207,.13)', color: '#00e6cf',
          border: '1px solid rgba(0,230,207,.2)', borderRadius: '99px', padding: '2px 10px',
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
        className="nav-pill-desktop"
      >
        Jupiter Global Cashback Calculator
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
        {countdown && (
          <a
            href="https://x.com/JupiterExchange/status/2038634728149201140?s=20"
            target="_blank"
            rel="noopener"
            style={{
              display: 'flex', alignItems: 'center', gap: '.45rem',
              background: 'var(--ev2)', border: '1px solid var(--ev3)',
              borderRadius: '99px', padding: '4px 12px',
              fontSize: '.65rem', fontWeight: 700, color: 'var(--ev)',
              whiteSpace: 'nowrap', textDecoration: 'none', cursor: 'pointer',
            }}
          >
            <span className="nav-event-dot" />
            2× Rewards Event · ends in{' '}
            <span className="nav-event-countdown" style={{ fontWeight: 500, color: 'rgba(199,242,132,.75)', marginLeft: 2 }}>
              {countdown}
            </span>
          </a>
        )}
        <button
          onClick={onOpenModal}
          style={{
            background: '#00e6cf', color: '#020e14', fontWeight: 700, fontSize: '.8rem',
            border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer',
            textDecoration: 'none', transition: 'background .15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#00c9b4')}
          onMouseLeave={e => (e.currentTarget.style.background = '#00e6cf')}
        >
          Get the Card →
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-pill-desktop { display: none !important; }
        }
        body.light nav {
          background: rgba(232,248,246,.95) !important;
          border-bottom-color: rgba(0,230,207,.2) !important;
        }
      `}</style>
    </nav>
  )
}
