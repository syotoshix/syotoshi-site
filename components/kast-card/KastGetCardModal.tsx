'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface KastGetCardModalProps {
  open:    boolean
  onClose: () => void
}

export default function KastGetCardModal({ open, onClose }: KastGetCardModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) (window as any).umami?.track('kast-modal-open')
  }, [open])

  function copyCode() {
    navigator.clipboard.writeText('AL5HNHMF').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      ;(window as any).umami?.track('kast-copy-coupon')
    })
  }

  const pri = '#4f9cf9'
  const priRgba = 'rgba(79,156,249,'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(2,8,20,.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
        transition: 'opacity .2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--b0)', border: `1px solid ${priRgba}.2)`,
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
          <Image src="/kast-card/logo.png" alt="KAST" width={32} height={32} style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--w)' }}>
            Get the KAST Card
          </span>
        </div>

        <p style={{ fontSize: '.75rem', color: 'var(--n4)', lineHeight: 1.55, marginBottom: '1.4rem' }}>
          Sign up with the link below and start earning cashback rewards on every purchase!
        </p>

        <a
          href="https://go.kast.xyz/VqVO/AL5HNHMF"
          target="_blank"
          rel="noopener"
          data-umami-event="kast-click-signup"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.55rem',
            background: pri, color: '#020814',
            borderRadius: '10px', padding: '.75rem 1rem', marginBottom: '1rem',
            textDecoration: 'none', fontWeight: 800, fontSize: '.9rem',
            transition: 'opacity .15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '.85' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
        >
          Sign-up &amp; Claim Rewards
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '.6rem',
            fontSize: '.6rem', color: 'var(--n5)', textTransform: 'uppercase', letterSpacing: '.08em',
            marginBottom: '1rem',
          }}
        >
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.07)' }} />
          <span>use coupon code for 20% off any paid card</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.07)' }} />
        </div>

        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '.6rem',
            background: `${priRgba}.13)`, border: `1px solid ${priRgba}.25)`,
            borderRadius: '10px', padding: '.65rem 1rem', marginBottom: '1rem',
          }}
        >
          <div style={{ flex: 1, fontSize: '1.6rem', fontWeight: 900, letterSpacing: '.2em', color: 'var(--w)', fontFamily: 'monospace' }}>
            AL5HNHMF
          </div>
          <button
            onClick={copyCode}
            style={{
              background: copied ? '#4ade80' : pri,
              color: '#020814', fontWeight: 700, fontSize: '.65rem',
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
          You&apos;ll earn{' '}
          <span style={{ fontSize: '1rem', fontWeight: 900, color: pri }}>200 KAST Points</span>{' '}
          <span style={{ color: 'var(--n5)' }}>(up to $20 value)</span>{' '}
          after completing <strong style={{ color: 'var(--n3)' }}>KYC &amp; spending $100</strong>.
        </div>
      </div>
    </div>
  )
}
