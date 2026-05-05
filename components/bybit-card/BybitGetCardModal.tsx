'use client'

import { useEffect, useState } from 'react'

const REF_CODE = 'ERRJBGX'
const REF_URLS: Record<'eu' | 'global', string> = {
  eu:     'https://www.bybit.eu/cards/?ref=ERRJBGX',
  global: 'https://www.bybit.com/cards/?ref=ERRJBGX',
}

interface BybitGetCardModalProps {
  open:              boolean
  onClose:           () => void
  signupBonusAmount: number
  variant:           'eu' | 'global'
  isLight:           boolean
}

export default function BybitGetCardModal({
  open,
  onClose,
  signupBonusAmount,
  variant,
  isLight,
}: BybitGetCardModalProps) {
  const refUrl = REF_URLS[variant]
  const [copied, setCopied] = useState(false)

  const c = isLight ? {
    overlay:     'rgba(180,120,0,.35)',
    bg:          '#fff8e6',
    border:      'rgba(247,166,0,.35)',
    shadow:      '0 24px 64px rgba(0,0,0,.18)',
    closeBtn:    'rgba(0,0,0,.07)',
    closeBtnH:   'rgba(0,0,0,.14)',
    closeBtnC:   '#333',
    closeBtnCH:  '#000',
    logoText:    '#000',
    title:       '#111',
    body:        '#555',
    dividerLine: 'rgba(0,0,0,.1)',
    dividerText: '#888',
    codeBg:      '#fff3cc',
    codeText:    '#111',
    bonusText:   '#555',
  } : {
    overlay:     'rgba(14,8,0,.75)',
    bg:          '#1c1200',
    border:      'rgba(247,166,0,.2)',
    shadow:      '0 24px 64px rgba(0,0,0,.7)',
    closeBtn:    'rgba(255,255,255,.06)',
    closeBtnH:   'rgba(255,255,255,.12)',
    closeBtnC:   '#a8bdd4',
    closeBtnCH:  '#fff',
    logoText:    '#ffffff',
    title:       '#ffffff',
    body:        '#a8bdd4',
    dividerLine: 'rgba(255,255,255,.07)',
    dividerText: '#5d7a96',
    codeBg:      '#2d1e00',
    codeText:    '#ffffff',
    bonusText:   '#a8bdd4',
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    if (open) (window as any).umami?.track('bybit-modal-open')
  }, [open])

  function copyCode() {
    navigator.clipboard.writeText(REF_CODE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      ;(window as any).umami?.track('bybit-copy-code')
    })
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: c.overlay, backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
        transition: 'opacity .2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: c.bg, border: `1px solid ${c.border}`,
          borderRadius: '18px', padding: '2rem 2rem 1.75rem',
          width: 'min(420px, 92vw)', position: 'relative',
          transform: open ? 'translateY(0)' : 'translateY(12px)',
          transition: 'transform .25s ease',
          boxShadow: c.shadow,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '.9rem', right: '.9rem',
            background: c.closeBtn, border: 'none', color: c.closeBtnC,
            width: 26, height: 26, borderRadius: '99px', cursor: 'pointer',
            fontSize: '.7rem', lineHeight: 1, transition: 'background .15s, color .15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = c.closeBtnH; e.currentTarget.style.color = c.closeBtnCH }}
          onMouseLeave={e => { e.currentTarget.style.background = c.closeBtn;  e.currentTarget.style.color = c.closeBtnC  }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.6rem' }}>
          <span
            style={{
              display: 'flex', alignItems: 'center', fontWeight: 800,
              fontSize: '1.4rem', letterSpacing: '-0.01em',
            }}
          >
            <span style={{ color: c.logoText }}>BYB</span>
            <span
              style={{
                display: 'inline-block', width: '4px', height: '1em',
                background: '#f7a600', borderRadius: '2px', margin: '0 2px', flexShrink: 0,
              }}
            />
            <span style={{ color: c.logoText }}>T</span>
          </span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: c.title }}>
            Get the Bybit Card
          </span>
        </div>

        <p style={{ fontSize: '.78rem', color: c.body, lineHeight: 1.55, marginBottom: '1.4rem' }}>
          Sign up with the link below and start earning cashback rewards on every purchase!
        </p>

        {/* CTA button */}
        <a
          href={refUrl}
          target="_blank"
          rel="noopener"
          data-umami-event="bybit-click-signup"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem',
            width: '100%', background: '#f7a600', color: '#0e0800',
            fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
            borderRadius: '12px', padding: '.85rem 1rem', marginBottom: '1.3rem',
            transition: 'background .15s', boxSizing: 'border-box',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#d4900a')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#f7a600')}
        >
          Sign-up &amp; Claim Rewards →
        </a>

        {/* Divider */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '.6rem',
            fontSize: '.58rem', color: c.dividerText, textTransform: 'uppercase', letterSpacing: '.09em',
            marginBottom: '1rem',
          }}
        >
          <span style={{ flex: 1, height: 1, background: c.dividerLine }} />
          <span>Use referral code during sign-up</span>
          <span style={{ flex: 1, height: 1, background: c.dividerLine }} />
        </div>

        {/* Code box */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '.6rem',
            background: c.codeBg, border: '1px solid rgba(247,166,0,.22)',
            borderRadius: '10px', padding: '.65rem 1rem', marginBottom: '.9rem',
          }}
        >
          <div style={{ flex: 1, fontSize: '1.55rem', fontWeight: 900, letterSpacing: '.22em', color: c.codeText }}>
            {REF_CODE}
          </div>
          <button
            onClick={copyCode}
            style={{
              background: copied ? '#4ade80' : 'rgba(247,166,0,.15)',
              color: copied ? '#0e0800' : '#f7a600',
              fontWeight: 700, fontSize: '.68rem',
              border: '1px solid rgba(247,166,0,.35)', borderRadius: '7px',
              padding: '5px 12px', cursor: 'pointer',
              transition: 'background .15s, color .15s', whiteSpace: 'nowrap', flexShrink: 0,
              fontFamily: 'inherit',
            }}
          >
            {copied ? 'Copied!' : 'Copy code'}
          </button>
        </div>

        {/* Bonus note */}
        <div style={{ fontSize: '.68rem', color: c.bonusText, lineHeight: 1.55, textAlign: 'center' }}>
          You&apos;ll earn a{' '}
          <span style={{ fontWeight: 900, color: '#f7a600' }}>
            ${signupBonusAmount} signup bonus
          </span>{' '}
          after completing KYC &amp; spending $100.
        </div>
      </div>
    </div>
  )
}
