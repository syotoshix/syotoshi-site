'use client'

import { useEffect, useState } from 'react'

interface GetCardModalProps {
  open: boolean
  onClose: () => void
  signupBonusAmount: number
  isEventActive: boolean
}

export default function GetCardModal({
  open,
  onClose,
  signupBonusAmount,
  isEventActive,
}: GetCardModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    if (open) (window as any).umami?.track('jupiter-modal-open')
  }, [open])

  function copyCode() {
    navigator.clipboard.writeText('Z8V7RG2N').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      ;(window as any).umami?.track('jupiter-copy-code')
    })
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(2,14,20,.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
        transition: 'opacity .2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--b0)', border: '1px solid rgba(0,230,207,.2)',
          borderRadius: '18px', padding: '2rem 2rem 1.75rem',
          width: 'min(420px, 92vw)', position: 'relative',
          transform: open ? 'translateY(0)' : 'translateY(12px)',
          transition: 'transform .25s ease',
          boxShadow: '0 24px 64px rgba(0,0,0,.6)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '.9rem', right: '.9rem',
            background: 'rgba(255,255,255,.06)', border: 'none', color: 'var(--n4)',
            width: 26, height: 26, borderRadius: '99px', cursor: 'pointer',
            fontSize: '.7rem', lineHeight: 1, transition: 'background .15s, color .15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,.12)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,.06)'
            e.currentTarget.style.color = 'var(--n4)'
          }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.6rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://jupiter.global/images/jup-logo.svg" width={32} height={32} alt="Jupiter" />
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--w)' }}>
            Get the Jupiter Card
          </span>
        </div>

        <p style={{ fontSize: '.75rem', color: 'var(--n4)', lineHeight: 1.55, marginBottom: '1.2rem' }}>
          Download the app, enter referral code, and start earning cashback on every purchase.
        </p>

        <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <a
            href="https://apps.apple.com/nl/app/jupiter-mobile-solana-wallet/id6484069059"
            target="_blank"
            rel="noopener"
            data-umami-event="jupiter-click-appstore"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '.55rem',
              background: 'var(--b2)', border: '1px solid rgba(0,230,207,.12)',
              borderRadius: '10px', padding: '.6rem .9rem', textDecoration: 'none',
              color: 'var(--w)', transition: 'background .15s, border-color .15s',
              minWidth: '140px',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--b3)'
              el.style.borderColor = 'rgba(0,230,207,.3)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--b2)'
              el.style.borderColor = 'rgba(0,230,207,.12)'
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '.55rem', color: 'var(--n4)' }}>Download on the</span>
              <span style={{ fontSize: '.82rem', fontWeight: 700 }}>App Store</span>
            </div>
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=ag.jup.jupiter.android"
            target="_blank"
            rel="noopener"
            data-umami-event="jupiter-click-playstore"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '.55rem',
              background: 'var(--b2)', border: '1px solid rgba(0,230,207,.12)',
              borderRadius: '10px', padding: '.6rem .9rem', textDecoration: 'none',
              color: 'var(--w)', transition: 'background .15s, border-color .15s',
              minWidth: '140px',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--b3)'
              el.style.borderColor = 'rgba(0,230,207,.3)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--b2)'
              el.style.borderColor = 'rgba(0,230,207,.12)'
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l15 8.5c.6.35.6 1.25 0 1.6l-15 8.5c-.66.5-1.6.03-1.6-.8z" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '.55rem', color: 'var(--n4)' }}>Get it on</span>
              <span style={{ fontSize: '.82rem', fontWeight: 700 }}>Google Play</span>
            </div>
          </a>
        </div>

        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '.6rem',
            fontSize: '.6rem', color: 'var(--n5)', textTransform: 'uppercase', letterSpacing: '.08em',
            marginBottom: '1rem',
          }}
        >
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.07)' }} />
          <span>then enter referral code during sign-up</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.07)' }} />
        </div>

        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '.6rem',
            background: 'rgba(0,230,207,.13)', border: '1px solid rgba(0,230,207,.25)',
            borderRadius: '10px', padding: '.65rem 1rem', marginBottom: '.65rem',
          }}
        >
          <div style={{ flex: 1, fontSize: '1.6rem', fontWeight: 900, letterSpacing: '.2em', color: 'var(--w)' }}>
            Z8V7RG2N
          </div>
          <button
            onClick={copyCode}
            style={{
              background: copied ? '#4ade80' : '#00e6cf',
              color: '#020e14', fontWeight: 700, fontSize: '.65rem',
              border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer',
              transition: 'background .15s, transform .1s', whiteSpace: 'nowrap', flexShrink: 0,
              transform: copied ? 'scale(.97)' : 'scale(1)',
              fontFamily: 'inherit',
            }}
          >
            {copied ? 'Copied!' : 'Copy code'}
          </button>
        </div>

        <div style={{ fontSize: '.68rem', color: 'var(--n4)', lineHeight: 1.55, textAlign: 'center' }}>
          Spend <strong style={{ color: 'var(--n3)' }}>$1,000 within 30 days</strong> to unlock a sign-up bonus of{' '}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', verticalAlign: 'middle' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--pri)' }}>
              ${signupBonusAmount}
            </span>
            {isEventActive && (
              <span
                style={{
                  fontSize: '.62rem', background: 'var(--ev2)', color: 'var(--ev)',
                  border: '1px solid var(--ev3)', borderRadius: '99px',
                  padding: '2px 7px', fontWeight: 700,
                }}
              >
                2× event
              </span>
            )}
          </span>
        </div>
      </div>

      <style>{`
        body.light .modal-inner { background: #e8f8f6 !important; border-color: rgba(0,180,160,.2) !important; }
      `}</style>
    </div>
  )
}
