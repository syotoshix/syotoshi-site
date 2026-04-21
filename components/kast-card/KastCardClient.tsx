'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import KastNavBar from './KastNavBar'
import KastPhoneMockup from './KastPhoneMockup'
import KastGetCardModal from './KastGetCardModal'
import KastCardWheel from './KastCardWheel'
import '../../styles/card.css'
import {
  KAST_TIERS,
  KAST_CARDS_BY_TIER,
  KAST_POINT_VALUE,
  KAST_FRIEND_POINTS,
  KAST_FRIEND_CARD_DISCOUNT,
  EXAMPLES,
  CATEGORIES,

  fmt,
  fmtI,
  pct,
} from '@/lib/kast-card'

type PanelMode = 'examples' | 'custom'

function getSliderFillWidth(container: HTMLElement | null, min: number, max: number, val: number) {
  if (!container) return 10
  const w = container.offsetWidth
  const p = (val - min) / (max - min)
  return Math.round(10 + p * (w - 20))
}

export default function KastCardClient() {
  // ── Tier tab + per-tab card selection ──
  const [activeTierIdx,    setActiveTierIdx]    = useState(0)   // 0 Standard | 1 Premium | 2 Luxe
  const [selectedCardInTab, setSelectedCardInTab] = useState(0)

  // Reset wheel position when the user switches tabs
  useEffect(() => { setSelectedCardInTab(0) }, [activeTierIdx])

  // Derived: active card + tier + theme
  const activeCards    = KAST_CARDS_BY_TIER[activeTierIdx]
  const safeCardIdx    = Math.min(selectedCardInTab, activeCards.length - 1)
  const card           = activeCards[safeCardIdx]
  const tier           = KAST_TIERS[activeTierIdx]
  const th             = card.theme

  // ── Calculator state ──
  const [spend,         setSpend]         = useState(1500)
  const [refs,          setRefs]          = useState(0)
  const [paidRefs,      setPaidRefs]      = useState(0)
  const [isNonUsd,      setIsNonUsd]      = useState(true)
  const fxRate = isNonUsd ? 0.0175 : 0   // 0.5–1.75% for non-USD; 0 for USD
  const [mode,          setMode]          = useState<PanelMode>('examples')
  const [exIdx,         setExIdx]         = useState(0)
  const [customCatIdx,  setCustomCatIdx]  = useState(0)
  const [customAmount,  setCustomAmount]  = useState(200)
  const [isLight,       setIsLight]       = useState(false)
  const [modalOpen,     setModalOpen]     = useState(false)
  const [movePrice,     setMovePrice]     = useState<number | null>(null)
  const [copiedCoupon,  setCopiedCoupon]  = useState(false)
  const [refTooltip,    setRefTooltip]    = useState(false)
  const [feeTooltip,    setFeeTooltip]    = useState(false)
  const [paidTooltip,   setPaidTooltip]   = useState(false)

  // ── Phone mockup state ──
  const [phoneTime,   setPhoneTime]   = useState('')
  const [phoneDate,   setPhoneDate]   = useState('')
  const [purchaseIn,  setPurchaseIn]  = useState(false)
  const [cashbackIn,  setCashbackIn]  = useState(false)

  // ── Refs ──
  const notifTimerRef    = useRef<ReturnType<typeof setTimeout>   | null>(null)
  const cashbackTimerRef = useRef<ReturnType<typeof setTimeout>   | null>(null)
  const cycleTimerRef    = useRef<ReturnType<typeof setInterval>  | null>(null)

  const spendFillRef = useRef<HTMLDivElement>(null)
  const spendWrapRef = useRef<HTMLDivElement>(null)
  const refsFillRef    = useRef<HTMLDivElement>(null)
  const refsWrapRef    = useRef<HTMLDivElement>(null)
  const paidFillRef    = useRef<HTMLDivElement>(null)
  const paidWrapRef    = useRef<HTMLDivElement>(null)

  // ── Derived calculator state ──
  const kastUsd       = spend * card.kastRate                           // monthly KAST value in USD
  const kastPoints    = Math.round(kastUsd / KAST_POINT_VALUE)         // KAST points earned/month
  const moveUsd       = spend * card.moveRate                           // monthly MOVE value in USD
  const moveTokens    = movePrice !== null ? moveUsd / movePrice : null // MOVE tokens earned/month
  const totalUsd      = kastUsd + moveUsd                               // combined monthly value
  const annualUsd     = totalUsd * 12
  const fee           = spend * fxRate
  const eff           = spend > 0 ? (totalUsd - fee) / spend : 0
  const clampedPaid    = Math.min(paidRefs, refs)
  const standardRefs   = refs - clampedPaid
  const totalRefPoints = standardRefs * 200 + clampedPaid * 5000
  const totalRefUsd    = totalRefPoints * KAST_POINT_VALUE

  // ── Phone notification content ──
  const currentEx  = EXAMPLES[exIdx]
  const currentCat = CATEGORIES[customCatIdx]
  const countrySuffix = ''

  let notifIcon:   string
  let notifMsg:    string
  let notifEarned: string

  if (mode === 'examples') {
    const exTotal    = currentEx.items.reduce((s, i) => s + i.price, 0)
    const exFee      = exTotal * fxRate
    const exKastUsd  = exTotal * card.kastRate
    const exMoveUsd  = exTotal * card.moveRate
    notifIcon   = currentEx.icon
    notifMsg    = `You spent <span class="hi">${fmt(exTotal + exFee)}</span> at ${currentEx.name}${countrySuffix}.`
    notifEarned = `${fmt(exKastUsd)} KAST + ${fmt(exMoveUsd)} MOVE`
  } else {
    const amount     = Math.max(0, customAmount)
    const feeAmt     = amount * fxRate
    const cbKast     = amount * card.kastRate
    const cbMove     = amount * card.moveRate
    notifIcon   = currentCat.icon
    notifMsg    = `You spent <span class="hi">${fmt(amount + feeAmt)}</span> on ${currentCat.name}${countrySuffix}.`
    notifEarned = `${fmt(cbKast)} KAST + ${fmt(cbMove)} MOVE`
  }

  // ── Trigger notification animation ──
  const triggerNotif = useCallback(() => {
    setPurchaseIn(false)
    setCashbackIn(false)
    if (notifTimerRef.current)    clearTimeout(notifTimerRef.current)
    if (cashbackTimerRef.current) clearTimeout(cashbackTimerRef.current)
    notifTimerRef.current    = setTimeout(() => setPurchaseIn(true),  80)
    cashbackTimerRef.current = setTimeout(() => setCashbackIn(true), 900)
  }, [])

  // ── Cycle examples ──
  const startCycle = useCallback(() => {
    cycleTimerRef.current = setInterval(() => {
      setExIdx(prev => (prev + 1) % EXAMPLES.length)
    }, 4000)
  }, [])

  const resetCycle = useCallback(() => {
    if (cycleTimerRef.current) clearInterval(cycleTimerRef.current)
    startCycle()
  }, [startCycle])

  // ── Phone time ──
  function updatePhoneTime() {
    const now  = new Date()
    const h    = now.getHours().toString().padStart(2, '0')
    const m    = now.getMinutes().toString().padStart(2, '0')
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const mons = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    setPhoneTime(h + ':' + m)
    setPhoneDate(days[now.getDay()] + ', ' + now.getDate() + ' ' + mons[now.getMonth()])
  }

  // ── MOVE price ──
  useEffect(() => {
    async function fetchMovePrice() {
      try {
        const res  = await fetch('/api/move-price')
        const data = await res.json()
        if (typeof data.price === 'number') setMovePrice(data.price)
      } catch {
        // leave null — UI shows fallback
      }
    }
    fetchMovePrice()
    const priceInterval = setInterval(fetchMovePrice, 60_000)
    return () => clearInterval(priceInterval)
  }, [])

  // ── Init ──
  useEffect(() => {
    updatePhoneTime()
    const timeInterval = setInterval(updatePhoneTime, 10000)
    triggerNotif()
    startCycle()
    return () => {
      clearInterval(timeInterval)
      if (cycleTimerRef.current)    clearInterval(cycleTimerRef.current)
      if (notifTimerRef.current)    clearTimeout(notifTimerRef.current)
      if (cashbackTimerRef.current) clearTimeout(cashbackTimerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Trigger notif on example cycle ──
  useEffect(() => {
    if (mode === 'examples') triggerNotif()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exIdx])

  // ── Theme ──
  useEffect(() => {
    if (isLight) document.body.classList.add('light')
    else         document.body.classList.remove('light')
  }, [isLight])

  // ── Slider fills ──
  const updateFills = useCallback(() => {
    if (spendFillRef.current && spendWrapRef.current)
      spendFillRef.current.style.width   = getSliderFillWidth(spendWrapRef.current, 100, 10000, spend) + 'px'
    if (refsFillRef.current && refsWrapRef.current)
      refsFillRef.current.style.width    = getSliderFillWidth(refsWrapRef.current, 0, 100, refs) + 'px'
    if (paidFillRef.current && paidWrapRef.current)
      paidFillRef.current.style.width    = getSliderFillWidth(paidWrapRef.current, 0, refs || 1, clampedPaid) + 'px'
  }, [spend, refs, clampedPaid])

  useEffect(() => { updateFills() }, [spend, refs, paidRefs, updateFills])

  // ── Mode switch ──
  function handleSetMode(m: PanelMode) {
    setMode(m)
    if (m === 'examples') { resetCycle(); triggerNotif() }
    else {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current)
      triggerNotif()
    }
  }

  // ── Examples panel ──
  function renderExamplesPanel() {
    const ex    = EXAMPLES[exIdx]
    const total = ex.items.reduce((s, i) => s + i.price, 0)
    const kastCb      = total * card.kastRate
    const moveCb      = total * card.moveRate
    const cb          = kastCb + moveCb
    const fee         = total * fxRate
    const net         = cb - fee
    const kastPtsEx   = Math.round(kastCb / KAST_POINT_VALUE)
    const moveToksEx  = movePrice !== null ? moveCb / movePrice : null

    return (
      <div>
        {/* Example nav */}
        <div style={{ display: 'flex', gap: '.4rem', marginBottom: '.75rem' }}>
          {EXAMPLES.map((e, i) => (
            <button
              key={i}
              onClick={() => { setExIdx(i); resetCycle(); triggerNotif() }}
              style={{
                flex: 1, background: i === exIdx ? 'rgba(79,156,249,.13)' : 'var(--b1)',
                border: `1px solid ${i === exIdx ? th.pri : 'rgba(255,255,255,.06)'}`,
                color: i === exIdx ? th.pri : 'var(--n4)',
                borderRadius: '9px', padding: '.42rem .25rem',
                fontSize: '.68rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all .15s', textAlign: 'center', fontFamily: 'inherit',
              }}
            >
              {e.icon} {e.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Merchant row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '.55rem',
          padding: '.6rem .8rem', background: 'var(--b1)',
          borderRadius: '11px', border: '1px solid rgba(255,255,255,.06)', marginBottom: '.5rem',
        }}>
          <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{ex.icon}</div>
          <div>
            <div style={{ fontSize: '.88rem', fontWeight: 700 }}>{ex.name}</div>
            <div style={{ fontSize: '.65rem', color: 'var(--n5)' }}>{ex.cat}</div>
          </div>
        </div>

        {/* Line items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.28rem', marginBottom: '.5rem' }}>
          {ex.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '.73rem', color: 'var(--n4)',
              padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)',
            }}>
              <span>{item.label}</span><span>{fmt(item.price)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', fontWeight: 700, color: 'var(--w)', padding: '.32rem 0' }}>
            <span>Subtotal</span><span>{fmt(total)}</span>
          </div>
          {fxRate > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
              <span>Conversion fee (FX) 1.75%*</span><span>+{fmt(fee)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '.73rem', color: th.pri, padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
            <span>KAST {pct(card.kastRate)}</span>
            <span style={{ textAlign: 'right' }}>
              <span>−{fmt(kastCb)}</span>
              <span style={{ display: 'block', fontSize: '.58rem', color: 'var(--n5)' }}>({kastPtsEx.toLocaleString()} pts @ ${KAST_POINT_VALUE}/pt)</span>
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '.73rem', color: th.pri, padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
            <span>MOVE {pct(card.moveRate)}</span>
            <span style={{ textAlign: 'right' }}>
              <span>−{fmt(moveCb)}</span>
              <span style={{ display: 'block', fontSize: '.58rem', color: 'var(--n5)' }}>
                {moveToksEx !== null
                  ? `(${Math.round(moveToksEx).toLocaleString()} MOVE @ $${movePrice!.toFixed(4)}/MOVE)`
                  : '(price loading…)'}
              </span>
            </span>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '.65rem .9rem', borderRadius: '11px', fontSize: '.82rem', fontWeight: 600,
            background: 'var(--b1)', border: '1px solid rgba(79,156,249,.12)',
          }}>
            <span style={{ color: 'var(--n4)' }}>Net saving (cashback − fees)</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: net >= 0 ? th.pri : '#f87171' }}>
              {(net >= 0 ? '+' : '') + fmt(net)}
            </strong>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '.65rem .9rem', borderRadius: '11px', fontSize: '.82rem', fontWeight: 600,
            background: 'var(--b1)', border: '1px solid rgba(255,255,255,.06)',
          }}>
            <span style={{ color: 'var(--n4)' }}>Effective price paid</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--w)' }}>
              {fmt(total + fee - cb)}
            </strong>
          </div>
        </div>
        {fxRate > 0 && (
          <div style={{ fontSize: '.58rem', color: 'var(--n5)', marginTop: '.2rem' }}>
            * FX fee varies by country (0.5–1.75%)
          </div>
        )}
      </div>
    )
  }

  // ── Custom panel ──
  function renderCustomPanel() {
    const cat       = CATEGORIES[customCatIdx]
    const amount    = Math.max(0, customAmount)
    const kastCb      = amount * card.kastRate
    const moveCb      = amount * card.moveRate
    const cb          = kastCb + moveCb
    const feeAmt      = amount * fxRate
    const net         = cb - feeAmt
    const kastPtsCus  = Math.round(kastCb / KAST_POINT_VALUE)
    const moveToksCus = movePrice !== null ? moveCb / movePrice : null

    return (
      <div>
        {/* Category buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '.35rem', marginBottom: '.75rem' }}>
          {CATEGORIES.map((c, i) => (
            <button
              key={i}
              onClick={() => { setCustomCatIdx(i); triggerNotif() }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                background: i === customCatIdx ? 'rgba(79,156,249,.13)' : 'var(--b1)',
                border: `1px solid ${i === customCatIdx ? 'rgba(79,156,249,.3)' : 'rgba(255,255,255,.06)'}`,
                borderRadius: '9px', padding: '.45rem .2rem', cursor: 'pointer',
                fontSize: '.9rem', fontFamily: 'inherit', transition: 'background .15s, border-color .15s',
              }}
            >
              {c.icon}
              <span style={{ fontSize: '.55rem', color: i === customCatIdx ? th.pri : 'var(--n4)', fontWeight: 600 }}>
                {c.name}
              </span>
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.65rem', gap: '.75rem' }}>
          <div style={{ fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)', whiteSpace: 'nowrap' }}>
            Purchase amount
          </div>
          <div className="custom-amount-input-wrap" style={{
            display: 'flex', alignItems: 'center', gap: '.3rem',
            background: 'var(--b0)', border: '1.5px solid rgba(79,156,249,.3)',
            borderRadius: '8px', padding: '.35rem .65rem',
          }}>
            <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--n4)' }}>$</span>
            <input
              type="number"
              value={customAmount}
              min={1} max={100000}
              onChange={e => { setCustomAmount(Math.max(0, parseFloat(e.target.value) || 0)); triggerNotif() }}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontSize: '.95rem', fontWeight: 700, color: th.pri,
                fontFamily: 'inherit', width: 90, textAlign: 'right', cursor: 'text',
              }}
            />
          </div>
        </div>

        {/* Merchant */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '.55rem',
          padding: '.6rem .8rem', background: 'var(--b1)',
          borderRadius: '11px', border: '1px solid rgba(255,255,255,.06)', marginBottom: '.5rem',
        }}>
          <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{cat.icon}</div>
          <div>
            <div style={{ fontSize: '.88rem', fontWeight: 700 }}>{cat.name}</div>
            <div style={{ fontSize: '.65rem', color: 'var(--n5)' }}>{cat.cat}</div>
          </div>
        </div>

        {/* Line items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.28rem', marginBottom: '.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', fontWeight: 700, color: 'var(--w)', padding: '.32rem 0' }}>
            <span>Purchase total</span><span>{fmt(amount)}</span>
          </div>
          {fxRate > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
              <span>Conversion fee (FX) 1.75%*</span><span>+{fmt(feeAmt)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '.73rem', color: th.pri, padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
            <span>KAST {pct(card.kastRate)}</span>
            <span style={{ textAlign: 'right' }}>
              <span>−{fmt(kastCb)}</span>
              <span style={{ display: 'block', fontSize: '.58rem', color: 'var(--n5)' }}>({kastPtsCus.toLocaleString()} pts @ ${KAST_POINT_VALUE}/pt)</span>
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '.73rem', color: th.pri, padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
            <span>MOVE {pct(card.moveRate)}</span>
            <span style={{ textAlign: 'right' }}>
              <span>−{fmt(moveCb)}</span>
              <span style={{ display: 'block', fontSize: '.58rem', color: 'var(--n5)' }}>
                {moveToksCus !== null
                  ? `(${Math.round(moveToksCus).toLocaleString()} MOVE @ $${movePrice!.toFixed(4)}/MOVE)`
                  : '(price loading…)'}
              </span>
            </span>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '.65rem .9rem', borderRadius: '11px', fontSize: '.82rem', fontWeight: 600,
            background: 'var(--b1)', border: '1px solid rgba(79,156,249,.12)',
          }}>
            <span style={{ color: 'var(--n4)' }}>Net saving (cashback − fees)</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: net >= 0 ? th.pri : '#f87171' }}>
              {(net >= 0 ? '+' : '') + fmt(net)}
            </strong>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '.65rem .9rem', borderRadius: '11px', fontSize: '.82rem', fontWeight: 600,
            background: 'var(--b1)', border: '1px solid rgba(255,255,255,.06)',
          }}>
            <span style={{ color: 'var(--n4)' }}>Effective price paid</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--w)' }}>
              {fmt(amount + feeAmt - cb)}
            </strong>
          </div>
        </div>
        {fxRate > 0 && (
          <div style={{ fontSize: '.58rem', color: 'var(--n5)', marginTop: '.2rem' }}>
            * FX fee varies by country (0.5–1.75%)
          </div>
        )}
      </div>
    )
  }

  // ── Render ──
  return (
    <>
      <div
        style={{
          height: '100vh',
          display: 'grid',
          gridTemplateRows: '52px 1fr',
          overflow: 'hidden',
          ['--pri'  as string]: th.pri,
          ['--prid' as string]: th.prid,
          ['--prig' as string]: `${th.arcClr}0.13)`,
          transition: 'background .5s, color .3s',
        }}
        className="app-shell"
      >
        {/* NAV */}
        <KastNavBar onOpenModal={() => setModalOpen(true)} />

        {/* MAIN */}
        <main
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr clamp(420px, 38vw, 560px) 1fr',
            alignItems: 'center',
            padding: '.6rem 2rem',
            gap: 0,
            overflow: 'hidden',
          }}
          className="main-grid"
        >

          {/* ── LEFT PANEL ── */}
          <div
            style={{
              display: 'flex', flexDirection: 'column',
              padding: '.5rem 1.8rem .5rem 0',
              borderRight: '1px solid rgba(79,156,249,.08)',
              overflow: 'hidden', gap: '.5rem',
            }}
            className="left-panel"
          >
            {/* Mobile badge */}
            <div className="mobile-labels" style={{ display: 'none' }}>
              <div style={{
                fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                background: 'rgba(79,156,249,.13)', color: th.pri,
                border: '1px solid rgba(79,156,249,.2)', borderRadius: '99px', padding: '4px 14px',
              }}>
                KAST Visa Card Cashback Calculator
              </div>
            </div>

            {/* Hero */}
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.2 }}>
                Earn <em style={{ fontStyle: 'normal', color: th.pri }}>real money back</em>
                <br />on every purchase
              </h1>
              <p style={{ fontSize: '.73rem', color: 'var(--n4)', lineHeight: 1.5, marginTop: '.15rem' }}>
                KAST Visa Card · Up to 12% cashback · 170+ countries
              </p>
            </div>

            {/* Monthly Spend Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)' }}>
                  Monthly Spend
                </span>
                <span style={{ fontSize: '.95rem', fontWeight: 800, color: th.pri }}>
                  {fmt(spend).replace('.00', '')}
                </span>
              </div>
              <div className="range-wrap" ref={spendWrapRef}>
                <div className="range-track" />
                <div className="range-fill" ref={spendFillRef} style={{ background: th.pri }} />
                <input type="range" min={100} max={10000} step={50} value={spend} onChange={e => setSpend(parseInt(e.target.value))} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: 'var(--n5)' }}>
                <span>$100</span><span>$10,000</span>
              </div>
            </div>

            {/* Referrals Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  <span style={{ fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)' }}>
                    Referrals
                  </span>
                  <span
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={() => setRefTooltip(true)}
                    onMouseLeave={() => setRefTooltip(false)}
                  >
                    <svg width={13} height={13} viewBox="0 0 14 14" fill="none" style={{ cursor: 'default', opacity: .55, flexShrink: 0 }}>
                      <circle cx={7} cy={7} r={6.5} stroke="currentColor" />
                      <line x1={7} y1={6} x2={7} y2={10.5} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
                      <circle cx={7} cy={4} r={0.8} fill="currentColor" />
                    </svg>
                    {refTooltip && (
                      <div style={{
                        position: 'absolute', left: 0, bottom: 'calc(100% + 6px)',
                        background: 'var(--b3)', border: '1px solid rgba(255,255,255,.1)',
                        borderRadius: '8px', padding: '.5rem .65rem',
                        fontSize: '.63rem', color: 'var(--n4)', lineHeight: 1.5,
                        whiteSpace: 'nowrap', zIndex: 50, pointerEvents: 'none',
                        boxShadow: '0 4px 16px rgba(0,0,0,.4)',
                      }}>
                        Your friends earn <strong style={{ color: 'var(--w)' }}>{KAST_FRIEND_POINTS} KAST points</strong> (≈{fmt(KAST_FRIEND_POINTS * KAST_POINT_VALUE)}) after KYC&nbsp;+&nbsp;$100 spend,
                        <br />plus <strong style={{ color: 'var(--w)' }}>{Math.round(KAST_FRIEND_CARD_DISCOUNT * 100)}% off</strong> any paid card.
                      </div>
                    )}
                  </span>
                </span>
                <span style={{ fontSize: '.95rem', fontWeight: 800, color: th.pri }}>
                  {refs === 1 ? '1 referral' : refs + ' referrals'}
                </span>
              </div>
              <div className="range-wrap" ref={refsWrapRef}>
                <div className="range-track" />
                <div className="range-fill" ref={refsFillRef} style={{ background: th.pri }} />
                <input type="range" min={0} max={100} step={1} value={refs} onChange={e => setRefs(parseInt(e.target.value))} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: 'var(--n5)' }}>
                <span>0</span><span>100</span>
              </div>

              {/* Paid card referrals */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  <span style={{ fontSize: '.6rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)' }}>
                    Amount that got a paid card
                  </span>
                  <span
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={() => setPaidTooltip(true)}
                    onMouseLeave={() => setPaidTooltip(false)}
                  >
                    <svg width={11} height={11} viewBox="0 0 14 14" fill="none" style={{ cursor: 'default', opacity: .5, flexShrink: 0 }}>
                      <circle cx={7} cy={7} r={6.5} stroke="currentColor" />
                      <line x1={7} y1={6} x2={7} y2={10.5} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
                      <circle cx={7} cy={4} r={0.8} fill="currentColor" />
                    </svg>
                    {paidTooltip && (
                      <div style={{
                        position: 'absolute', left: 0, bottom: 'calc(100% + 6px)',
                        background: 'var(--b3)', border: '1px solid rgba(255,255,255,.1)',
                        borderRadius: '8px', padding: '.5rem .65rem',
                        fontSize: '.63rem', color: 'var(--n4)', lineHeight: 1.6,
                        whiteSpace: 'nowrap', zIndex: 50, pointerEvents: 'none',
                        boxShadow: '0 4px 16px rgba(0,0,0,.4)',
                      }}>
                        Referred friends who bought a <strong style={{ color: 'var(--w)' }}>Premium or Luxe card</strong> earn you<br />
                        <strong style={{ color: th.pri }}>5,000 KAST points</strong> (≈{fmt(5000 * KAST_POINT_VALUE)}) per paid referral.
                      </div>
                    )}
                  </span>
                </span>
                <span style={{ fontSize: '.8rem', fontWeight: 800, color: th.pri }}>{clampedPaid}</span>
              </div>
              <div className="range-wrap" ref={paidWrapRef}>
                <div className="range-track" />
                <div className="range-fill" ref={paidFillRef} style={{ background: th.pri }} />
                <input type="range" min={0} max={refs} step={1} value={clampedPaid}
                  onChange={e => setPaidRefs(parseInt(e.target.value))} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: 'var(--n5)' }}>
                <span>0</span>
                <span>{standardRefs} standard · {clampedPaid} paid</span>
                <span>{refs}</span>
              </div>
            </div>

            {/* Active card / tier badge */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '.45rem .8rem',
              background: `${th.arcClr}0.13)`, border: `1px solid ${th.arcClr}0.2)`,
              borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--w)' }}>
                  {card.name} · {tier.label}
                </div>
                <div style={{ fontSize: '.62rem', color: 'var(--n5)' }}>
                  {tier.annualFee === 0 ? '$0/yr' : `${fmtI(tier.annualFee)}/yr`} annual fee
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.75rem', fontWeight: 800, color: th.pri, letterSpacing: '-.01em' }}>
                  {pct(card.kastRate)} KAST
                </div>
                <div style={{ fontSize: '.75rem', fontWeight: 800, color: th.pri, letterSpacing: '-.01em' }}>
                  + {pct(card.moveRate)} MOVE
                </div>
              </div>
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.3rem' }}>

              {/* Total monthly */}
              <div className="metric-hi" style={{
                background: 'linear-gradient(135deg, #030b1a, #020814)',
                border: '1px solid rgba(79,156,249,.2)',
                borderRadius: '12px', padding: '.45rem .7rem', position: 'relative',
              }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  <span className="live-dot" style={{ marginRight: '.35rem' }} />
                  Total / month
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-.03em', color: th.pri }}>
                  ~{fmt(totalUsd)}
                </div>
                <div style={{ fontSize: '.63rem', color: 'var(--n5)', marginTop: '.1rem' }}>KAST + MOVE combined</div>
                <div className="plus-divider" style={{
                  position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)',
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--b3)', border: '1px solid rgba(79,156,249,.2)',
                  color: th.pri, fontSize: '.85rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, flexShrink: 0,
                }}>+</div>
              </div>

              {/* Referral bonuses */}
              <div className="metric-hi" style={{
                background: 'linear-gradient(135deg, #030b1a, #020814)',
                border: '1px solid rgba(79,156,249,.2)',
                borderRadius: '12px', padding: '.45rem .7rem',
              }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  Referral KAST points
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-.03em', color: th.pri }}>
                  {refs === 0 ? '$0' : '~' + fmt(totalRefUsd)}
                </div>
                <div style={{ fontSize: '.63rem', color: 'var(--n5)', marginTop: '.1rem' }}>
                  {refs === 0 ? 'no referrals yet' : `${totalRefPoints.toLocaleString()} pts · ${standardRefs} standard · ${clampedPaid} paid`}
                </div>
              </div>

              {/* KAST Points earned */}
              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.45rem .7rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  KAST Points / month
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-.03em', color: th.pri }}>
                  ~{fmt(kastUsd)}
                </div>
                <div style={{ fontSize: '.58rem', color: 'var(--n5)', marginTop: '.15rem' }}>
                  {kastPoints.toLocaleString()} pts · ${KAST_POINT_VALUE}/pt
                </div>
              </div>

              {/* MOVE / month */}
              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.45rem .7rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  MOVE tokens / month
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-.03em', color: th.pri }}>
                  ~{fmt(moveUsd)}
                </div>
                <div style={{ fontSize: '.58rem', color: 'var(--n5)', marginTop: '.15rem' }}>
                  {movePrice !== null ? (
                    <>
                      {Math.round(moveTokens!).toLocaleString()}{' '}
                      <a href="https://coinmarketcap.com/currencies/movement/" target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dotted rgba(255,255,255,.25)' }}>$MOVE</a>
                      {' '}· ${movePrice.toFixed(4)}/$MOVE
                    </>
                  ) : 'fetching live price…'}
                </div>
              </div>

              {/* Annual total */}
              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.45rem .7rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  Annual rewards <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500, opacity: .6 }}>(Excl. referral rewards)</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-.03em', color: th.pri }}>~{fmtI(annualUsd)}</div>
                <div style={{ fontSize: '.58rem', color: 'var(--n5)', marginTop: '.15rem' }}>KAST + MOVE · 12 months</div>
              </div>

              {/* Annual fee */}
              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.45rem .7rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  Annual card fee
                  <span
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={() => setFeeTooltip(true)}
                    onMouseLeave={() => setFeeTooltip(false)}
                  >
                    <svg width={11} height={11} viewBox="0 0 14 14" fill="none" style={{ cursor: 'default', opacity: .5, flexShrink: 0 }}>
                      <circle cx={7} cy={7} r={6.5} stroke="currentColor" />
                      <line x1={7} y1={6} x2={7} y2={10.5} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
                      <circle cx={7} cy={4} r={0.8} fill="currentColor" />
                    </svg>
                    {feeTooltip && (
                      <div style={{
                        position: 'absolute', right: 0, bottom: 'calc(100% + 6px)',
                        background: 'var(--b3)', border: '1px solid rgba(255,255,255,.1)',
                        borderRadius: '8px', padding: '.5rem .65rem',
                        fontSize: '.63rem', color: 'var(--n4)', lineHeight: 1.5,
                        whiteSpace: 'nowrap', zIndex: 50, pointerEvents: 'none',
                        boxShadow: '0 4px 16px rgba(0,0,0,.4)',
                      }}>
                        <strong style={{ color: 'var(--w)' }}>10,000 KAST points</strong> (up to <strong style={{ color: 'var(--w)' }}>$1,000 value</strong>)<br />
                        for buying your 1st Premium, Limited or Luxe card.
                      </div>
                    )}
                  </span>
                </div>
                {tier.annualFee === 0 ? (
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--w)' }}>$0</div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '.4rem' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--w)' }}>
                        {fmtI(tier.annualFee * 0.8)}
                      </div>
                      <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--n5)', textDecoration: 'line-through' }}>
                        {fmtI(tier.annualFee)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', marginTop: '.3rem' }}>
                      <span style={{ fontSize: '.55rem', fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.25)', borderRadius: '99px', padding: '1px 6px' }}>
                        −20% with coupon
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('AL5HNHMF')
                          setCopiedCoupon(true)
                          setTimeout(() => setCopiedCoupon(false), 2000)
                        }}
                        title="Click to copy"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '.25rem',
                          background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(255,255,255,.2)',
                          borderRadius: '5px', padding: '2px 7px', cursor: 'pointer',
                          fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em',
                          color: copiedCoupon ? '#4ade80' : '#e2e8f0',
                          fontFamily: 'monospace', transition: 'color .2s',
                        }}
                      >
                        {copiedCoupon ? '✓ COPIED' : 'AL5HNHMF'}
                        {!copiedCoupon && (
                          <svg width={9} height={9} viewBox="0 0 12 12" fill="none" style={{ opacity: .5, flexShrink: 0 }}>
                            <rect x={4} y={4} width={7} height={7} rx={1.5} stroke="currentColor" strokeWidth={1.4} />
                            <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>

            {/* KAST points disclaimer */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '.45rem',
              padding: '.4rem .6rem',
              background: 'rgba(251,191,36,.05)', border: '1px solid rgba(251,191,36,.18)',
              borderRadius: '8px', fontSize: '.6rem', color: 'var(--n4)', lineHeight: 1.45,
            }}>
              <svg width={13} height={13} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M7 1.5L12.5 11.5H1.5L7 1.5Z" stroke="#fbbf24" strokeWidth={1.3} strokeLinejoin="round" />
                <line x1={7} y1={6} x2={7} y2={9} stroke="#fbbf24" strokeWidth={1.4} strokeLinecap="round" />
                <circle cx={7} cy={10.5} r={0.75} fill="#fbbf24" />
              </svg>
              <span>
                KAST point values are based on a <strong style={{ color: '#fbbf24' }}>speculative $0.08/pt</strong> valuation defined by KAST for their planned 2026 airdrop. The amount may <strong style={{ color: 'var(--w)' }}>not be fully unlockable at TGE</strong> and may <strong style={{ color: 'var(--w)' }}>fluctuate over time</strong>.
              </span>
            </div>

          </div>

          {/* ── CENTER: wheel + phone ── */}
          <div
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
              padding: '.5rem 0 .5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="center-panel"
          >
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 360, height: 600,
              background: `radial-gradient(ellipse, ${th.glow} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} className="center-glow" />

            {/* Tier tabs — above the card */}
            <div style={{
              display: 'flex', gap: '.2rem', flexShrink: 0,
              background: 'rgba(255,255,255,.05)',
              borderRadius: '7px', padding: '2px',
              border: '1px solid rgba(255,255,255,.09)',
              width: '196px', marginBottom: '.3rem',
            }}>
              {KAST_TIERS.map((t, i) => {
                const active = i === activeTierIdx
                const tabPri = ['#4f9cf9', '#a78bfa', '#fbbf24'][i]
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTierIdx(i)}
                    style={{
                      flex: 1,
                      background: active ? 'rgba(255,255,255,.1)' : 'transparent',
                      border: 'none',
                      color: active ? tabPri : 'var(--n4)',
                      borderRadius: '5px', padding: '.2rem .35rem',
                      fontSize: '.6rem', fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'background .15s, color .15s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                    }}
                  >
                    <span>{t.name}</span>
                    <span style={{ fontSize: '.48rem', fontWeight: 600, opacity: active ? 1 : 0.5 }}>
                      {['5–6%', '8–9%', '10–12%'][i]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Card wheel + card arrows */}
            <div className="kc-wheel-wrapper" style={{ position: 'relative', width: '100%', flexShrink: 0, paddingTop: '.2rem', marginBottom: '.5rem' }}>
              <KastCardWheel
                cards={activeCards}
                selectedIndex={selectedCardInTab}
                onSelect={setSelectedCardInTab}
                onOpenModal={() => setModalOpen(true)}
              />

              {/* Card nav arrows — rendered here, above the 3D context entirely */}
              {activeCards.length > 1 && (
                <button
                  className="kc-arrow kc-arrow-l"
                  onClick={() => setSelectedCardInTab(i => (i - 1 + activeCards.length) % activeCards.length)}
                  aria-label="Previous card"
                  style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: 'rgba(2,8,20,.65)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,.18)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, transition: 'background .15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(2,8,20,.9)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(2,8,20,.65)' }}
                >
                  <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                    <path d="M6.5 2L3 5l3.5 3" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              {activeCards.length > 1 && (
                <button
                  className="kc-arrow kc-arrow-r"
                  onClick={() => setSelectedCardInTab(i => (i + 1) % activeCards.length)}
                  aria-label="Next card"
                  style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: 'rgba(2,8,20,.65)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,.18)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, transition: 'background .15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(2,8,20,.9)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(2,8,20,.65)' }}
                >
                  <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                    <path d="M3.5 2L7 5 3.5 8" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Phone mockup */}
            <KastPhoneMockup
              phoneTime={phoneTime}
              phoneDate={phoneDate}
              notifIcon={notifIcon}
              notifMsg={notifMsg}
              notifEarned={notifEarned}
              purchaseIn={purchaseIn}
              cashbackIn={cashbackIn}
              activeExample={mode === 'examples' ? exIdx : -1}
              accentColor={th.pri}
              onToggleTheme={() => setIsLight(prev => !prev)}
              onOpenModal={() => setModalOpen(true)}
            />
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '.5rem 0 .5rem 1.8rem',
              borderLeft: '1px solid rgba(79,156,249,.08)',
              gap: '.5rem', overflow: 'hidden',
            }}
            className="right-panel"
          >
            {/* Non-USD checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={isNonUsd}
                onChange={e => setIsNonUsd(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: th.pri, cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: '.68rem', fontWeight: 600, color: 'var(--n4)' }}>
                Non-USD payment{' '}
                <span style={{ color: isNonUsd ? '#f87171' : 'var(--n5)', fontWeight: 500 }}>+0.5%–1.75% FX fee*</span>
              </span>
            </label>

            {/* Mode toggle */}
            <div style={{
              display: 'flex', gap: 0, background: 'var(--b2)',
              borderRadius: '10px', padding: '3px', border: '1px solid rgba(255,255,255,.06)',
            }}>
              <button
                onClick={() => handleSetMode('examples')}
                style={{
                  flex: 1, background: mode === 'examples' ? 'var(--b3)' : 'transparent',
                  border: 'none', color: mode === 'examples' ? 'var(--w)' : 'var(--n4)',
                  fontSize: '.72rem', fontWeight: 600, borderRadius: '8px',
                  padding: '.35rem .6rem', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background .15s, color .15s',
                }}
              >
                Examples
              </button>
              <button
                onClick={() => handleSetMode('custom')}
                style={{
                  flex: 1, background: mode === 'custom' ? 'var(--b3)' : 'transparent',
                  border: 'none', color: mode === 'custom' ? 'var(--w)' : 'var(--n4)',
                  fontSize: '.72rem', fontWeight: 600, borderRadius: '8px',
                  padding: '.35rem .6rem', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background .15s, color .15s',
                }}
              >
                Custom{' '}
                {mode !== 'custom' && (
                  <span style={{
                    fontSize: '.52rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em',
                    background: 'rgba(79,156,249,.13)', color: th.pri,
                    borderRadius: '99px', padding: '1px 6px', marginLeft: 4,
                    verticalAlign: 'middle', border: '1px solid rgba(79,156,249,.2)',
                  }}>try it out</span>
                )}
              </button>
            </div>

            {/* Panel content */}
            {mode === 'examples' ? renderExamplesPanel() : renderCustomPanel()}
          </div>
        </main>

        {/* Desktop credit */}
        <div id="credit-desktop" style={{
          position: 'fixed', bottom: '.75rem', right: '1rem',
          fontSize: '.72rem', color: 'var(--n5)', pointerEvents: 'none', zIndex: 10,
        }}>
          Made with 💙 by{' '}
          <a href="https://x.com/SyotoshiX" target="_blank" rel="noopener"
            style={{ color: 'var(--n4)', textDecoration: 'none', pointerEvents: 'all' }}>
            @SyotoshiX
          </a>
        </div>
      </div>

      {/* Mobile footer */}
      <footer id="credit-mobile" style={{
        display: 'none', textAlign: 'center', padding: '.75rem 1rem',
        fontSize: '.72rem', color: 'var(--n5)',
      }}>
        Made with 💙 by{' '}
        <a href="https://x.com/SyotoshiX" target="_blank" rel="noopener"
          style={{ color: 'var(--n4)', textDecoration: 'none' }}>
          @SyotoshiX
        </a>
      </footer>

      {/* Modal */}
      <KastGetCardModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Page styles */}
      <style suppressHydrationWarning>{`
        :root {
          --bg:   #010812;
          --b0:   #071228;
          --b1:   #0a1a3a;
          --b2:   #0d2050;
          --b3:   #102660;
          --pri:  #2563eb;
          --prid: #1d4ed8;
          --prig: rgba(37,99,235,0.13);
          --ev:   #93c5fd;
          --ev2:  rgba(147,197,253,0.15);
          --ev3:  rgba(147,197,253,0.3);
        }
        @media (max-width: 900px) {
          .app-shell {
            display: block !important;
            height: auto !important;
            min-height: 100vh;
            overflow: visible !important;
          }
          html, body { height: auto !important; overflow: auto !important; }
          #credit-desktop { display: none !important; }
          #credit-mobile { display: block !important; }
          nav {
            position: fixed !important;
            top: 0; left: 0; right: 0; z-index: 100;
            padding: 0 1.5rem !important;
            height: 56px !important;
          }
          .main-grid {
            display: flex !important;
            flex-direction: column !important;
            padding: calc(56px + 1.25rem) 1.2rem 2rem !important;
            gap: 2rem !important;
            overflow: visible !important;
          }
          .left-panel {
            padding: 0 !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(79,156,249,.08) !important;
            padding-bottom: 1.5rem !important;
            gap: .9rem !important;
            order: 0;
          }
          .center-panel {
            padding: .5rem 0 !important;
            overflow: visible !important;
            order: 1;
          }
          /* Wheel breaks out of content padding to use full screen width */
          /* flex-direction:column + align-items:center naturally centers a 100vw child */
          .kc-wheel-wrapper {
            width: 100vw !important;
          }
          .center-glow { display: none !important; }
          .right-panel {
            padding: 0 !important;
            border-left: none !important;
            border-top: 1px solid rgba(79,156,249,.08) !important;
            padding-top: 1.5rem !important;
            gap: .75rem !important;
            justify-content: flex-start !important;
            order: 2;
          }
          .mobile-labels { display: flex !important; flex-direction: column; align-items: center; gap: .4rem; }
        }
        @media (max-width: 480px) {
          nav { padding: 0 1rem !important; }
          .main-grid { padding: calc(56px + 1rem) .9rem 2rem !important; gap: 1.5rem !important; }
        }

        /* Card wheel arrows — responsive positioning */
        /* desktop: stage 340px (half=170), arrow half=14 → 184px; stage h=214 (half=107) */
        .kc-arrow {
          position: absolute;
          top: calc(.2rem + 107px);
          transform: translateY(-50%);
          z-index: 20;
        }
        .kc-arrow-l { left:  calc(50% - 184px); }
        .kc-arrow-r { right: calc(50% - 184px); }
        /* ≤900px: stage 260px (half=130), h=164 (half=82) */
        @media (max-width: 900px) {
          .kc-arrow   { top: calc(.2rem + 82px); }
          .kc-arrow-l { left:  calc(50% - 144px); }
          .kc-arrow-r { right: calc(50% - 144px); }
        }
        /* ≤480px: stage 220px (half=110), h=139 (half=70) */
        @media (max-width: 480px) {
          .kc-arrow   { top: calc(.2rem + 70px); }
          .kc-arrow-l { left:  calc(50% - 124px); }
          .kc-arrow-r { right: calc(50% - 124px); }
        }

        /* Kast range slider accent (overrides default teal in card.css) */
        .kast-range input[type='range']::-webkit-slider-thumb {
          background: var(--pri);
          box-shadow: 0 0 0 2px var(--pri), 0 3px 10px rgba(79,156,249,.35);
        }
        .kast-range input[type='range']::-moz-range-thumb {
          background: var(--pri);
          box-shadow: 0 0 0 2px var(--pri), 0 3px 10px rgba(79,156,249,.35);
        }
      `}</style>
    </>
  )
}
