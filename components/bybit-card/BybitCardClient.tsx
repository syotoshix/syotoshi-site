'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import BybitNavBar, { type CardVariant } from './BybitNavBar'
import BybitPhoneMockup from './BybitPhoneMockup'
import BybitGetCardModal from './BybitGetCardModal'
import BybitCardVisual from './BybitCardVisual'
import '../../styles/card.css'
import '../../styles/bybit-card.css'
import * as EU from '@/lib/bybit-card'
import * as Global from '@/lib/bybit-card-global'

const BYBIT_THEME = {
  pri:  '#f7a600',
  prid: '#d4900a',
  prig: 'rgba(247,166,0,.13)',
  bg:   '#0e0800',
  b0:   '#1c1200',
  b1:   '#231800',
  b2:   '#2d1e00',
  b3:   '#3a2700',
  lgBg: '#fff8e6',
  lgB0: '#fff3cc',
  lgB1: '#ffedb3',
  lgB2: '#ffe799',
  lgB3: '#f0d080',
}

// Client-side cache so switching countries doesn't re-fetch the same currency
const mcRateCache = new Map<string, number>()

// Group labels for the Global variant country dropdown
const GLOBAL_FEE_LABELS: Record<number, string> = {
  0:     'Home currency — 0% FX',
  0.01:  'Australia / Asia Pacific — 1% FX',
  0.015: 'Brazil — 1.5% FX',
  0.02:  'Mexico / AIFC — 2% FX',
  0.07:  'Argentina — 7% FX',
}

type PanelMode = 'examples' | 'custom'

export default function BybitCardClient() {
  const [variant, setVariant] = useState<CardVariant>('eu')
  const { TIERS, SPEND_MAX, EXAMPLES, COUNTRIES, CATEGORIES, spendToTier, fmt, fmtI, pct, BASE, CRYPTO_FEE } =
    variant === 'eu' ? EU : Global

  const [spend, setSpend]               = useState(1500)
  const [refs, setRefs]                 = useState(0)
  const [qualPct, setQualPct]           = useState(100)
  const [country, setCountry]           = useState('de')
  const [mcRate, setMcRate]             = useState<number | null>(null)
  const [mcLoading, setMcLoading]       = useState(false)
  const [cryptoMode, setCryptoMode]     = useState(false)
  const [mode, setMode]                 = useState<PanelMode>('examples')
  const [exIdx, setExIdx]               = useState(0)
  const [customCatIdx, setCustomCatIdx] = useState(0)
  const [customAmount, setCustomAmount] = useState(200)
  const [isLight, setIsLight]           = useState(false)
  const [modalOpen, setModalOpen]       = useState(false)
  const [phoneTime, setPhoneTime]       = useState('')
  const [phoneDate, setPhoneDate]       = useState('')
  const [purchaseIn, setPurchaseIn]     = useState(false)
  const [cashbackIn, setCashbackIn]     = useState(false)
  const [markerPositions, setMarkerPositions] = useState<number[]>([0, 0, 0, 0, 0])

  const notifTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cashbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cycleTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── DERIVED STATE ──
  // Tier is determined purely by monthly spend
  const tierIdx       = spendToTier(spend)
  const tier          = TIERS[tierIdx]
  const raw           = spend * tier.rate
  const earned        = Math.min(raw, tier.cap)
  const annual        = earned * 12
  const bybitFxRate   = COUNTRIES[country]?.fee ?? 0
  const fxRate        = bybitFxRate + (mcRate ?? 0)
  const effectiveFee  = fxRate + (cryptoMode ? CRYPTO_FEE : 0)
  const fee           = spend * effectiveFee
  const eff           = spend > 0 ? (earned - fee) / spend : 0
  const capped        = raw > tier.cap
  const qualifying    = Math.round(refs * qualPct / 100)
  const totalRefBonus = qualifying * BASE.refBonus

  const currentEx  = EXAMPLES[exIdx]
  const currentCat = CATEGORIES[customCatIdx]

  let notifIcon: string
  let notifMsg:  string
  let notifEarned: string

  const countryData   = COUNTRIES[country]
  const countrySuffix = countryData ? ` in ${countryData.flag} ${countryData.name}` : ''

  if (mode === 'examples') {
    const exTotal = currentEx.items.reduce((s, i) => s + i.price, 0)
    const exFee   = exTotal * effectiveFee
    const exCb    = exTotal * tier.rate
    notifIcon    = currentEx.icon
    notifMsg     = `You spent <span class="hi">${fmt(exTotal + exFee)}</span> at ${currentEx.name}${countrySuffix}.`
    notifEarned  = fmt(exCb)
  } else {
    const amount = Math.max(0, customAmount)
    const rawCb  = amount * tier.rate
    const cb     = Math.min(rawCb, tier.cap)
    const feeAmt = amount * effectiveFee
    notifIcon   = currentCat.icon
    notifMsg    = `You spent <span class="hi">${fmt(amount + feeAmt)}</span> on ${currentCat.name}${countrySuffix}.`
    notifEarned = fmt(cb)
  }

  function getSliderFillWidth(container: HTMLElement | null, min: number, max: number, val: number) {
    if (!container) return 10
    const w = container.offsetWidth
    const p = (val - min) / (max - min)
    return Math.round(10 + p * (w - 20))
  }

  const spendFillRef = useRef<HTMLDivElement>(null)
  const spendWrapRef = useRef<HTMLDivElement>(null)
  const refsFillRef  = useRef<HTMLDivElement>(null)
  const refsWrapRef  = useRef<HTMLDivElement>(null)
  const qualFillRef  = useRef<HTMLDivElement>(null)
  const qualWrapRef  = useRef<HTMLDivElement>(null)

  const triggerNotif = useCallback(() => {
    setPurchaseIn(false)
    setCashbackIn(false)
    if (notifTimerRef.current)    clearTimeout(notifTimerRef.current)
    if (cashbackTimerRef.current) clearTimeout(cashbackTimerRef.current)
    notifTimerRef.current    = setTimeout(() => setPurchaseIn(true), 80)
    cashbackTimerRef.current = setTimeout(() => setCashbackIn(true), 900)
  }, [])

  const startCycle = useCallback(() => {
    cycleTimerRef.current = setInterval(() => {
      setExIdx(prev => (prev + 1) % EXAMPLES.length)
    }, 4000)
  }, [])

  const resetCycle = useCallback(() => {
    if (cycleTimerRef.current) clearInterval(cycleTimerRef.current)
    startCycle()
  }, [startCycle])

  function updatePhoneTime() {
    const now  = new Date()
    const h    = now.getHours().toString().padStart(2, '0')
    const m    = now.getMinutes().toString().padStart(2, '0')
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    const mons = ['January','February','March','April','May','June','July','August','September','October','November','December']
    setPhoneTime(h + ':' + m)
    setPhoneDate(days[now.getDay()] + ', ' + now.getDate() + ' ' + mons[now.getMonth()])
  }

  // Tier markers are positioned on the spend slider at tier thresholds
  const positionMarkers = useCallback(() => {
    const wrap = spendWrapRef.current
    if (!wrap) return
    const w = wrap.offsetWidth
    if (!w) return
    const positions = [500, 3500, 9500, 12500, 25000].map(val =>
      Math.round(10 + (val / SPEND_MAX) * (w - 20))
    )
    setMarkerPositions(positions)
  }, [])

  const updateFills = useCallback(() => {
    if (spendFillRef.current && spendWrapRef.current)
      spendFillRef.current.style.width = getSliderFillWidth(spendWrapRef.current, 0, SPEND_MAX, spend) + 'px'
    if (refsFillRef.current && refsWrapRef.current)
      refsFillRef.current.style.width  = getSliderFillWidth(refsWrapRef.current, 0, 100, refs) + 'px'
    if (qualFillRef.current && qualWrapRef.current)
      qualFillRef.current.style.width  = getSliderFillWidth(qualWrapRef.current, 0, 100, qualPct) + 'px'
  }, [spend, refs, qualPct])

  useEffect(() => {
    updatePhoneTime()
    const timeInterval = setInterval(updatePhoneTime, 10000)
    triggerNotif()
    startCycle()
    positionMarkers()
    window.addEventListener('resize', positionMarkers)
    return () => {
      clearInterval(timeInterval)
      if (cycleTimerRef.current)    clearInterval(cycleTimerRef.current)
      if (notifTimerRef.current)    clearTimeout(notifTimerRef.current)
      if (cashbackTimerRef.current) clearTimeout(cashbackTimerRef.current)
      window.removeEventListener('resize', positionMarkers)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { updateFills() }, [spend, refs, qualPct, updateFills])

  useEffect(() => {
    if (mode === 'examples') triggerNotif()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exIdx])

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
    }
  }, [isLight])

  useEffect(() => {
    setCountry(variant === 'eu' ? 'de' : 'usd')
    setMcRate(null)
  }, [variant])

  useEffect(() => {
    // MC rate lookup is EU-specific (uses bybit.eu API); Global card fees are flat
    if (variant !== 'eu') {
      setMcRate(null)
      setMcLoading(false)
      return
    }
    const c = COUNTRIES[country]
    if (!c || c.currency === 'EUR') {
      setMcRate(null)
      setMcLoading(false)
      return
    }
    if (mcRateCache.has(c.currency)) {
      setMcRate(mcRateCache.get(c.currency)!)
      return
    }
    setMcLoading(true)
    setMcRate(null)
    fetch(`/api/bybit-markup?currency=${c.currency}`)
      .then(r => r.json())
      .then((data: Record<string, unknown>) => {
        console.log('[bybit-markup] response:', data)
        const result = data?.result as Record<string, unknown> | undefined
        const overMc  = result?.overMcMarkupRate  !== undefined ? parseFloat(String(result.overMcMarkupRate))  : NaN
        const overEcb = result?.overEcbMarkupRate !== undefined ? parseFloat(String(result.overEcbMarkupRate)) : NaN
        if (!isNaN(overMc) && !isNaN(overEcb)) {
          // mcRate = MC exchange-rate spread over ECB (total cost = bybitFxRate + mcRate = overEcbMarkupRate)
          const mcSpread = Math.max(0, overEcb - overMc)
          mcRateCache.set(c.currency, mcSpread)
          setMcRate(mcSpread)
        } else {
          setMcRate(null)
        }
      })
      .catch(err => { console.error('[bybit-markup] fetch error:', err); setMcRate(null) })
      .finally(() => setMcLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, variant])

  function openModal() {
    setModalOpen(true)
    ;(window as any).umami?.track('bybit-referral-popup-open')
  }

  function applyCountry(code: string) {
    if (!COUNTRIES[code]) return
    setCountry(code)
  }

  function handleSetMode(m: PanelMode) {
    setMode(m)
    if (m === 'examples') {
      resetCycle()
      triggerNotif()
    } else {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current)
      triggerNotif()
    }
  }

  // "Spend to next tier" helper
  let nextTierText: string
  if (tierIdx === TIERS.length - 1) {
    nextTierText = 'Max tier!'
  } else {
    const nextTier = TIERS[tierIdx + 1]
    const needed   = nextTier.spendMin - spend
    nextTierText   = fmt(needed).replace('.00', '') + ' more'
  }

  let countryOptions: React.ReactNode
  if (variant === 'eu') {
    const freeEntries = Object.entries(COUNTRIES).filter(([, c]) => c.fee === 0)
    const paidEntries = Object.entries(COUNTRIES).filter(([, c]) => c.fee > 0)
    countryOptions = (
      <>
        <optgroup label="Eurozone — 0% conversion fee">
          {freeEntries.map(([code, c]) => <option key={code} value={code}>{c.flag} {c.name}</option>)}
        </optgroup>
        <optgroup label="Non-euro EU — 0.5% Bybit FX fee">
          {paidEntries.filter(([, c]) => c.fee === 0.005 && ['bg','hr','cz','dk','hu','pl','ro','se'].includes(Object.keys(COUNTRIES).find(k => COUNTRIES[k] === c)!)).map(([code, c]) => <option key={code} value={code}>{c.flag} {c.name}</option>)}
        </optgroup>
        <optgroup label="Rest of world — 0.5% Bybit FX fee">
          {paidEntries.filter(([code]) => !['bg','hr','cz','dk','hu','pl','ro','se'].includes(code)).map(([code, c]) => <option key={code} value={code}>{c.flag} {c.name}</option>)}
        </optgroup>
      </>
    )
  } else {
    // Group Global countries by fee level
    const byFee = new Map<number, [string, typeof COUNTRIES[string]][]>()
    Object.entries(COUNTRIES).forEach(([code, c]) => {
      const group = byFee.get(c.fee) ?? []
      group.push([code, c])
      byFee.set(c.fee, group)
    })
    countryOptions = (
      <>
        {Array.from(byFee.entries())
          .sort(([a], [b]) => a - b)
          .map(([fee, entries]) => (
            <optgroup key={fee} label={GLOBAL_FEE_LABELS[fee] ?? `${pct(fee)} FX`}>
              {entries.map(([code, c]) => <option key={code} value={code}>{c.flag} {c.name}</option>)}
            </optgroup>
          ))}
      </>
    )
  }

  const feeBadgeStyle = (warn: boolean): React.CSSProperties => ({
    fontSize: '.65rem', fontWeight: 700, borderRadius: '99px',
    padding: '2px 8px',
    background: warn ? 'rgba(255,80,80,.1)' : 'rgba(247,166,0,.12)',
    border: `1px solid ${warn ? 'rgba(255,80,80,.3)' : 'rgba(247,166,0,.25)'}`,
    color: warn ? '#f87171' : 'var(--pri)',
    transition: 'all .25s',
  })

  const fxBadgeText = variant === 'eu'
    ? (bybitFxRate === 0 ? '0% conversion fee' :
       mcLoading         ? '0.5% + …' :
       mcRate !== null   ? pct(fxRate) + ' total FX' :
                           '0.5% Bybit FX')
    : (COUNTRIES[country]?.label ?? '0% conversion fee')

  const fxNote = bybitFxRate > 0 && (
    <div style={{ fontSize: '.6rem', color: 'var(--n5)', lineHeight: 1.5 }}>
      {variant === 'eu' ? (
        <>
          {mcLoading && 'Fetching Mastercard exchange rate…'}
          {!mcLoading && mcRate === null && (
            <>
              0.5% is Bybit&apos;s fee only. Mastercard&apos;s exchange-rate spread also applies —{' '}
              <a href="https://www.bybit.eu/en-EU/cards/exchangeRate" target="_blank" rel="noopener" style={{ color: 'var(--pri)', textDecoration: 'none' }}>
                check live rates ↗
              </a>
            </>
          )}
          {!mcLoading && mcRate !== null && mcRate > 0 && (
            <>Bybit fee {pct(bybitFxRate)} + MC spread {pct(mcRate)} = <strong style={{ color: 'var(--n4)' }}>{pct(fxRate)} vs ECB rate</strong></>
          )}
          {!mcLoading && mcRate === 0 && (
            <>Bybit fee 0.5% (no Mastercard spread for this currency)</>
          )}
        </>
      ) : (
        <>Applies to transactions in currencies other than your card&apos;s home denomination.</>
      )}
    </div>
  )

  const cryptoToggle = (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '.5rem .7rem', background: cryptoMode ? 'rgba(247,166,0,.08)' : 'var(--b1)',
        borderRadius: '10px', border: `1px solid ${cryptoMode ? 'rgba(247,166,0,.25)' : 'rgba(255,255,255,.06)'}`,
        transition: 'all .2s', cursor: 'pointer',
      }}
      onClick={() => setCryptoMode(p => !p)}
    >
      <span style={{ fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
        Paying from crypto
        <span className="info-icon" tabIndex={0} onClick={e => e.stopPropagation()}>
          <svg width={12} height={12} viewBox="0 0 14 14" fill="none">
            <circle cx={7} cy={7} r={6.5} stroke="currentColor" />
            <line x1={7} y1={6} x2={7} y2={10.5} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
            <circle cx={7} cy={4} r={0.8} fill="currentColor" />
          </svg>
          <span className="info-tip" style={{ width: 220 }}>
            Enable this when your Bybit EU Funding Account holds <strong>crypto assets</strong> (e.g. USDC, BTC) instead of EUR fiat. Bybit converts your crypto to EUR at their one-click sell rate and charges an extra <strong>0.9%</strong> on the converted amount. When paying from a fiat EUR balance, no crypto fee applies.
          </span>
        </span>
      </span>
      {/* Toggle pill */}
      <div style={{ width: 36, height: 20, borderRadius: '99px', background: cryptoMode ? '#f7a600' : 'rgba(255,255,255,.15)', transition: 'background .2s', position: 'relative', flexShrink: 0, marginLeft: '.75rem' }}>
        <div style={{ position: 'absolute', top: 2, left: cryptoMode ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
      </div>
    </div>
  )

  // ── EXAMPLES PANEL ──
  function renderExamplesPanel() {
    const ex           = EXAMPLES[exIdx]
    const t            = TIERS[tierIdx]
    const total        = ex.items.reduce((s, i) => s + i.price, 0)
    const cb           = total * t.rate
    const bybitFeeAmt  = total * bybitFxRate
    const mcFeeAmt     = total * (mcRate ?? 0)
    const cryptoFeeAmt = cryptoMode ? total * CRYPTO_FEE : 0
    const totalFeeAmt  = bybitFeeAmt + mcFeeAmt + cryptoFeeAmt
    const net          = cb - totalFeeAmt
    const effPrice     = total + totalFeeAmt - cb

    return (
      <div>
        <div style={{ display: 'flex', gap: '.4rem', marginBottom: '.75rem' }}>
          {EXAMPLES.map((e, i) => (
            <button
              key={i}
              onClick={() => { setExIdx(i); resetCycle(); triggerNotif() }}
              style={{
                flex: 1, background: i === exIdx ? 'rgba(247,166,0,.13)' : 'var(--b1)',
                border: `1px solid ${i === exIdx ? 'var(--pri)' : 'rgba(255,255,255,.06)'}`,
                color: i === exIdx ? 'var(--pri)' : 'var(--n4)',
                borderRadius: '9px', padding: '.42rem .25rem',
                fontSize: '.68rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all .15s', textAlign: 'center', fontFamily: 'inherit',
              }}
            >
              {e.icon} {e.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem', padding: '.6rem .8rem', background: 'var(--b1)', borderRadius: '11px', border: '1px solid rgba(255,255,255,.06)', marginBottom: '.5rem' }}>
          <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{ex.icon}</div>
          <div>
            <div style={{ fontSize: '.88rem', fontWeight: 700 }}>{ex.name}</div>
            <div style={{ fontSize: '.65rem', color: 'var(--n5)' }}>{ex.cat}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.28rem', marginBottom: '.5rem' }}>
          {ex.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: 'var(--n4)', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
              <span>{item.label}</span><span>{fmt(item.price)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', fontWeight: 700, color: 'var(--w)', padding: '.32rem 0' }}>
            <span>Subtotal</span><span>{fmt(total)}</span>
          </div>
          {variant === 'eu' ? (
            <>
              {bybitFxRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                  <span>Bybit FX fee {pct(bybitFxRate)}</span><span>+{fmt(bybitFeeAmt)}</span>
                </div>
              )}
              {bybitFxRate > 0 && mcLoading && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', opacity: .5, padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                  <span>Mastercard FX fee</span><span>fetching…</span>
                </div>
              )}
              {bybitFxRate > 0 && !mcLoading && mcRate !== null && mcRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                  <span>Mastercard FX fee {pct(mcRate)}</span><span>+{fmt(mcFeeAmt)}</span>
                </div>
              )}
            </>
          ) : (
            bybitFxRate > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                <span>FX fee {pct(bybitFxRate)}</span><span>+{fmt(bybitFeeAmt)}</span>
              </div>
            )
          )}
          {cryptoMode && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
              <span>Crypto conversion fee {pct(CRYPTO_FEE)}</span><span>+{fmt(cryptoFeeAmt)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: 'var(--pri)', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
            <span>Cashback {pct(t.rate)}</span><span>−{fmt(cb)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.65rem .9rem', borderRadius: '11px', fontSize: '.82rem', fontWeight: 600, background: 'var(--b1)', border: '1px solid rgba(247,166,0,.12)' }}>
            <span style={{ color: 'var(--n4)' }}>Net saving (cashback − fees)</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: net >= 0 ? 'var(--pri)' : '#f87171' }}>
              {(net >= 0 ? '+' : '') + fmt(net)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.65rem .9rem', borderRadius: '11px', fontSize: '.82rem', fontWeight: 600, background: 'var(--b1)', border: '1px solid rgba(255,255,255,.06)' }}>
            <span style={{ color: 'var(--n4)' }}>Effective price paid</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--w)' }}>{fmt(effPrice)}</strong>
          </div>
        </div>
      </div>
    )
  }

  // ── CUSTOM PANEL ──
  function renderCustomPanel() {
    const cat          = CATEGORIES[customCatIdx]
    const t            = TIERS[tierIdx]
    const amount       = Math.max(0, customAmount)
    const rawCb        = amount * t.rate
    const cb           = Math.min(rawCb, t.cap)
    const cappedCustom = rawCb > t.cap
    const bybitFeeAmt  = amount * bybitFxRate
    const mcFeeAmt     = amount * (mcRate ?? 0)
    const cryptoFeeAmt = cryptoMode ? amount * CRYPTO_FEE : 0
    const totalFeeAmt  = bybitFeeAmt + mcFeeAmt + cryptoFeeAmt
    const net          = cb - totalFeeAmt
    const effPrice     = amount + totalFeeAmt - cb

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '.35rem', marginBottom: '.75rem' }}>
          {CATEGORIES.map((c, i) => (
            <button
              key={i}
              onClick={() => { setCustomCatIdx(i); triggerNotif() }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                background: i === customCatIdx ? 'rgba(247,166,0,.13)' : 'var(--b1)',
                border: `1px solid ${i === customCatIdx ? 'rgba(247,166,0,.3)' : 'rgba(255,255,255,.06)'}`,
                borderRadius: '9px', padding: '.45rem .2rem', cursor: 'pointer',
                fontSize: '.9rem', fontFamily: 'inherit', transition: 'background .15s, border-color .15s',
              }}
            >
              {c.icon}
              <span style={{ fontSize: '.55rem', color: i === customCatIdx ? 'var(--pri)' : 'var(--n4)', fontWeight: 600 }}>
                {c.name}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.65rem', gap: '.75rem' }}>
          <div style={{ fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)', whiteSpace: 'nowrap' }}>Purchase amount</div>
          <div className="custom-amount-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: '.3rem', background: 'var(--b0)', border: '1.5px solid rgba(247,166,0,.3)', borderRadius: '8px', padding: '.35rem .65rem', transition: 'border-color .2s' }}>
            <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--n4)' }}>€</span>
            <input
              type="number" value={customAmount} min={1} max={100000}
              onChange={e => { setCustomAmount(Math.max(0, parseFloat(e.target.value) || 0)); triggerNotif() }}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '.95rem', fontWeight: 700, color: 'var(--pri)', fontFamily: 'inherit', width: 90, textAlign: 'right', cursor: 'text' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem', padding: '.6rem .8rem', background: 'var(--b1)', borderRadius: '11px', border: '1px solid rgba(255,255,255,.06)', marginBottom: '.5rem' }}>
          <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{cat.icon}</div>
          <div>
            <div style={{ fontSize: '.88rem', fontWeight: 700 }}>{cat.name}</div>
            <div style={{ fontSize: '.65rem', color: 'var(--n5)' }}>{cat.cat}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.28rem', marginBottom: '.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', fontWeight: 700, color: 'var(--w)', padding: '.32rem 0' }}>
            <span>Purchase total</span><span>{fmt(amount)}</span>
          </div>
          {variant === 'eu' ? (
            <>
              {bybitFxRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                  <span>Bybit FX fee {pct(bybitFxRate)}</span><span>+{fmt(bybitFeeAmt)}</span>
                </div>
              )}
              {bybitFxRate > 0 && mcLoading && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', opacity: .5, padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                  <span>Mastercard FX fee</span><span>fetching…</span>
                </div>
              )}
              {bybitFxRate > 0 && !mcLoading && mcRate !== null && mcRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                  <span>Mastercard FX fee {pct(mcRate)}</span><span>+{fmt(mcFeeAmt)}</span>
                </div>
              )}
            </>
          ) : (
            bybitFxRate > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                <span>FX fee {pct(bybitFxRate)}</span><span>+{fmt(bybitFeeAmt)}</span>
              </div>
            )
          )}
          {cryptoMode && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: '#f87171', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
              <span>Crypto conversion fee {pct(CRYPTO_FEE)}</span><span>+{fmt(cryptoFeeAmt)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: 'var(--pri)', padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
            <span>Cashback {pct(t.rate)}{cappedCustom && <span style={{ color: '#f5c542', fontSize: '.6rem' }}> (capped)</span>}</span>
            <span>−{fmt(cb)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.65rem .9rem', borderRadius: '11px', fontSize: '.82rem', fontWeight: 600, background: 'var(--b1)', border: '1px solid rgba(247,166,0,.12)' }}>
            <span style={{ color: 'var(--n4)' }}>Net saving (cashback − fees)</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: net >= 0 ? 'var(--pri)' : '#f87171' }}>
              {(net >= 0 ? '+' : '') + fmt(net)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.65rem .9rem', borderRadius: '11px', fontSize: '.82rem', fontWeight: 600, background: 'var(--b1)', border: '1px solid rgba(255,255,255,.06)' }}>
            <span style={{ color: 'var(--n4)' }}>Effective price paid</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--w)' }}>{fmt(effPrice)}</strong>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="app-shell bybit-page"
        style={{
          height: '100vh',
          display: 'grid',
          gridTemplateRows: '52px 1fr',
          overflow: 'hidden',
          ['--pri'  as string]: BYBIT_THEME.pri,
          ['--prid' as string]: BYBIT_THEME.prid,
          ['--prig' as string]: BYBIT_THEME.prig,
          ['--bg'   as string]: isLight ? BYBIT_THEME.lgBg : BYBIT_THEME.bg,
          ['--b0'   as string]: isLight ? BYBIT_THEME.lgB0 : BYBIT_THEME.b0,
          ['--b1'   as string]: isLight ? BYBIT_THEME.lgB1 : BYBIT_THEME.b1,
          ['--b2'   as string]: isLight ? BYBIT_THEME.lgB2 : BYBIT_THEME.b2,
          ['--b3'   as string]: isLight ? BYBIT_THEME.lgB3 : BYBIT_THEME.b3,
          transition: 'background .5s, color .3s',
        }}
      >
        <BybitNavBar onOpenModal={openModal} variant={variant} onVariantChange={setVariant} />

        <main
          className="main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr clamp(420px, 38vw, 560px) 1fr',
            alignItems: 'center',
            padding: '1.2rem 2rem',
            gap: 0,
            overflow: 'hidden',
          }}
        >
          {/* ── LEFT PANEL ── */}
          <div
            className="left-panel"
            style={{ display: 'flex', flexDirection: 'column', padding: '1.1rem 1.8rem 1.1rem 0', borderRight: '1px solid rgba(247,166,0,.08)', overflow: 'hidden', gap: '.8rem' }}
          >
            {/* Mobile labels */}
            <div className="mobile-labels" style={{ display: 'none' }}>
              <div style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', background: 'rgba(247,166,0,.13)', color: 'var(--pri)', border: '1px solid rgba(247,166,0,.2)', borderRadius: '99px', padding: '4px 14px' }}>
                Bybit EU Card Cashback Calculator
              </div>
            </div>

            {/* Hero */}
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.2 }}>
                Earn <em style={{ fontStyle: 'normal', color: 'var(--pri)' }}>real money back</em>
                <br />on every purchase
              </h1>
              <p style={{ fontSize: '.73rem', color: 'var(--n4)', lineHeight: 1.5, marginTop: '.25rem' }}>
                Bybit EU Debit Card · Up to 10% cashback · Earn in USDT
              </p>
            </div>

            {/* Monthly Spend Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)' }}>Monthly Spend</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem', background: 'var(--b0)', border: '1.5px solid rgba(247,166,0,.3)', borderRadius: '8px', padding: '.25rem .55rem' }}>
                  <span style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--n4)' }}>{fmt(0)[0]}</span>
                  <input
                    type="number"
                    value={spend}
                    min={0}
                    max={SPEND_MAX}
                    step={100}
                    onChange={e => setSpend(Math.min(SPEND_MAX, Math.max(0, parseInt(e.target.value) || 0)))}
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '.9rem', fontWeight: 800, color: 'var(--pri)', fontFamily: 'inherit', width: 72, textAlign: 'right', cursor: 'text' }}
                  />
                </div>
              </div>
              <div className="range-wrap" ref={spendWrapRef}>
                <div className="range-track" />
                <div className="range-fill" ref={spendFillRef} />
                <input type="range" min={0} max={SPEND_MAX} step={100} value={spend} onChange={e => setSpend(parseInt(e.target.value))} />
              </div>

              {/* Tier markers under spend slider */}
              <div className="tier-markers" style={{ position: 'relative', height: 44, marginTop: '.15rem' }}>
                {[
                  { val: 500,   label: 'Beta\n2%',     xform: 'translateX(0)'    },
                  { val: 3500,  label: 'Alpha\n4%',    xform: 'translateX(-50%)' },
                  { val: 9500,  label: 'Apex\n6%',     xform: 'translateX(-50%)' },
                  { val: 12500, label: 'Omega\n8%',    xform: 'translateX(-50%)' },
                  { val: 25000, label: 'Infinite\n10%',xform: 'translateX(-100%)'},
                ].map((marker, i) => {
                  const markerTierIdx = i + 1   // Beta=1, Alpha=2, Apex=3, Omega=4, Infinite=5
                  const reached = tierIdx >= markerTierIdx
                  const current = tierIdx === markerTierIdx
                  return (
                    <div
                      key={i}
                      className={`tm${reached ? ' reached' : ''}${current ? ' current' : ''}`}
                      style={{ left: markerPositions[i] || 0, transform: marker.xform }}
                      onClick={() => setSpend(marker.val)}
                    >
                      <div className="tm-dot" />
                      <div className="tm-label">
                        {marker.label.split('\n').map((line, j) => (
                          <span key={j}>{line}{j === 0 && <br />}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: 'var(--n5)' }}>
                <span>€0</span><span>€30,000</span>
              </div>
            </div>

            {/* Referrals Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)' }}>Referrals</span>
                <span style={{ fontSize: '.95rem', fontWeight: 800, color: 'var(--pri)' }}>
                  {refs === 1 ? '1 referral' : refs + ' referrals'}
                </span>
              </div>
              <div className="range-wrap" ref={refsWrapRef}>
                <div className="range-track" />
                <div className="range-fill" ref={refsFillRef} />
                <input type="range" min={0} max={100} step={1} value={refs} onChange={e => setRefs(parseInt(e.target.value))} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: 'var(--n5)' }}>
                <span>0</span><span>100</span>
              </div>

              {/* % qualifying */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.1rem' }}>
                <span style={{ fontSize: '.6rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  % hitting qualifying spend
                  <span className="info-icon" tabIndex={0}>
                    <svg width={12} height={12} viewBox="0 0 14 14" fill="none">
                      <circle cx={7} cy={7} r={6.5} stroke="currentColor" />
                      <line x1={7} y1={6} x2={7} y2={10.5} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
                      <circle cx={7} cy={4} r={0.8} fill="currentColor" />
                    </svg>
                    <span className="info-tip">
                      A referral earns you €20 when your friend spends €100 within 30 days of joining. Your friend also receives €10. Use this slider to estimate what % of your referrals will hit that threshold.
                    </span>
                  </span>
                </span>
                <span style={{ fontSize: '.8rem', fontWeight: 800, color: 'var(--pri)' }}>{qualPct}%</span>
              </div>
              <div className="range-wrap" ref={qualWrapRef}>
                <div className="range-track" />
                <div className="range-fill" ref={qualFillRef} />
                <input type="range" min={0} max={100} step={1} value={qualPct} onChange={e => setQualPct(parseInt(e.target.value))} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: 'var(--n5)' }}>
                <span>0%</span><span>100%</span>
              </div>
            </div>

            {/* Mobile country selector */}
            <div className="mobile-country" style={{ display: 'none', flexDirection: 'column', gap: '.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)' }}>Spending country</span>
                <span style={feeBadgeStyle(effectiveFee > 0)}>{fxBadgeText}</span>
              </div>
              <div className="country-select-wrap">
                <select value={country} onChange={e => applyCountry(e.target.value)}>{countryOptions}</select>
              </div>
              {fxNote}
              {cryptoToggle}
            </div>

            {/* Active tier badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.6rem .8rem', background: 'rgba(247,166,0,.13)', border: '1px solid rgba(247,166,0,.2)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--w)' }}>{tier.name} Tier</div>
                <div style={{ fontSize: '.62rem', color: 'var(--n5)' }}>{tier.spendLabel}</div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pri)', letterSpacing: '-.03em' }}>
                {pct(tier.rate)}
              </div>
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.45rem' }}>
              <div className="metric-hi" style={{ background: 'linear-gradient(135deg, #1c1200, #0e0800)', border: '1px solid rgba(247,166,0,.2)', borderRadius: '12px', padding: '.65rem .8rem', position: 'relative' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  <span className="live-dot" style={{ marginRight: '.35rem' }} />
                  You could earn up to
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-.03em', background: 'linear-gradient(90deg, #f7a600, #ffcc44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {fmt(earned)}
                </div>
                <div style={{ fontSize: '.63rem', color: 'var(--n5)', marginTop: '.1rem' }}>per month in cashback</div>
                <div className="plus-divider" style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: 'var(--b3)', border: '1px solid rgba(247,166,0,.2)', color: 'var(--pri)', fontSize: '.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, flexShrink: 0 }}>
                  +
                </div>
              </div>

              <div className="metric-hi" style={{ background: 'linear-gradient(135deg, #1c1200, #0e0800)', border: '1px solid rgba(247,166,0,.2)', borderRadius: '12px', padding: '.65rem .8rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  One-time referral bonuses
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-.03em', background: 'linear-gradient(90deg, #f7a600, #ffcc44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {fmtI(totalRefBonus)}
                </div>
                <div style={{ fontSize: '.63rem', color: 'var(--n5)', marginTop: '.1rem' }}>
                  {refs === 0 ? 'no referrals yet' : `${qualifying}/${refs} qualifying`}
                </div>
              </div>

              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.65rem .8rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>Annual cashback earnings</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--pri)' }}>{fmtI(annual)}</div>
              </div>

              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.65rem .8rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>Effective cashback (-fees)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em', color: eff < 0 ? '#f87171' : 'var(--pri)' }}>{pct(eff)}</div>
              </div>

              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.65rem .8rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>Monthly cashback cap</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--w)' }}>{fmtI(tier.cap)}</div>
              </div>

              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.65rem .8rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>Spend to next tier</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--w)' }}>{nextTierText}</div>
              </div>
            </div>

            {/* Cap warning */}
            {capped && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.45rem .7rem', background: 'rgba(245,197,66,.06)', border: '1px solid rgba(245,197,66,.2)', borderRadius: '8px', fontSize: '.68rem', color: '#f5c542' }}>
                <svg width={13} height={13} viewBox="0 0 14 14" fill="none">
                  <path d="M7 2L13 12H1L7 2Z" stroke="#f5c542" strokeWidth={1.2} />
                  <line x1={7} y1={6} x2={7} y2={9} stroke="#f5c542" strokeWidth={1.2} strokeLinecap="round" />
                  <circle cx={7} cy={10.5} r={0.6} fill="#f5c542" />
                </svg>
                Spend exceeds cap — earnings are capped at the tier limit
              </div>
            )}
          </div>

          {/* ── CENTER: phone ── */}
          <div
            className="center-panel"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '1.5rem 0 1rem', position: 'relative', overflow: 'hidden' }}
          >
            <div
              className="center-glow"
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 360, height: 600, background: 'radial-gradient(ellipse, rgba(247,166,0,.07) 0%, transparent 70%)', pointerEvents: 'none' }}
            />
            <BybitCardVisual onOpenModal={openModal} variant={variant} />
            <BybitPhoneMockup
              phoneTime={phoneTime}
              phoneDate={phoneDate}
              notifIcon={notifIcon}
              notifMsg={notifMsg}
              notifEarned={notifEarned}
              purchaseIn={purchaseIn}
              cashbackIn={cashbackIn}
              activeExample={mode === 'examples' ? exIdx : -1}
              onToggleTheme={() => setIsLight(prev => !prev)}
              onOpenModal={openModal}
            />
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            className="right-panel"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.1rem 0 1.1rem 1.8rem', borderLeft: '1px solid rgba(247,166,0,.08)', gap: '.75rem', overflow: 'hidden' }}
          >
            {/* Country selector (desktop) */}
            <div className="desktop-country" style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--n4)' }}>Spending country</span>
                <span style={feeBadgeStyle(effectiveFee > 0)}>{fxBadgeText}</span>
              </div>
              <div className="country-select-wrap">
                <select value={country} onChange={e => applyCountry(e.target.value)}>{countryOptions}</select>
              </div>
              {fxNote}
              {cryptoToggle}
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 0, background: 'var(--b2)', borderRadius: '10px', padding: '3px', border: '1px solid rgba(255,255,255,.06)' }}>
              <button
                onClick={() => handleSetMode('examples')}
                style={{ flex: 1, background: mode === 'examples' ? 'var(--b3)' : 'transparent', border: 'none', color: mode === 'examples' ? 'var(--w)' : 'var(--n4)', fontSize: '.72rem', fontWeight: 600, borderRadius: '8px', padding: '.35rem .6rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s, color .15s' }}
              >
                Examples
              </button>
              <button
                onClick={() => handleSetMode('custom')}
                style={{ flex: 1, background: mode === 'custom' ? 'var(--b3)' : 'transparent', border: 'none', color: mode === 'custom' ? 'var(--w)' : 'var(--n4)', fontSize: '.72rem', fontWeight: 600, borderRadius: '8px', padding: '.35rem .6rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s, color .15s' }}
              >
                Custom{' '}
                {mode !== 'custom' && (
                  <span style={{ fontSize: '.52rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', background: 'rgba(247,166,0,.13)', color: 'var(--pri)', borderRadius: '99px', padding: '1px 6px', marginLeft: 4, verticalAlign: 'middle', border: '1px solid rgba(247,166,0,.2)' }}>
                    try it out
                  </span>
                )}
              </button>
            </div>

            {mode === 'examples' ? renderExamplesPanel() : renderCustomPanel()}
          </div>
        </main>

        <div id="credit-desktop" style={{ position: 'fixed', bottom: '.75rem', right: '1rem', fontSize: '.72rem', color: 'var(--n5)', pointerEvents: 'none', zIndex: 10 }}>
          Made with 🧡 by{' '}
          <a href="https://x.com/SyotoshiX" target="_blank" rel="noopener" style={{ color: 'var(--n4)', textDecoration: 'none', pointerEvents: 'all' }}>
            @SyotoshiX
          </a>
        </div>
      </div>

      <footer id="credit-mobile" style={{ display: 'none', textAlign: 'center', padding: '.75rem 1rem', fontSize: '.72rem', color: 'var(--n5)' }}>
        Made with 🧡 by{' '}
        <a href="https://x.com/SyotoshiX" target="_blank" rel="noopener" style={{ color: 'var(--n4)', textDecoration: 'none' }}>
          @SyotoshiX
        </a>
      </footer>

      <BybitGetCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        signupBonusAmount={BASE.signupBonus}
        variant={variant}
        isLight={isLight}
      />

      <style>{`
        @media (max-width: 900px) {
          .app-shell {
            display: block !important; height: auto !important;
            min-height: 100vh; overflow: visible !important;
          }
          html, body { height: auto !important; overflow: auto !important; }
          #credit-desktop { display: none !important; }
          #credit-mobile { display: block !important; }
          nav {
            position: fixed !important; top: 0; left: 0; right: 0; z-index: 100;
            padding: 0 1.5rem !important; height: 56px !important;
          }
          .main-grid {
            display: flex !important; flex-direction: column !important;
            padding: calc(56px + 1.25rem) 1.2rem 2rem !important;
            gap: 2rem !important; overflow: visible !important;
          }
          .left-panel {
            padding: 0 !important; border-right: none !important;
            border-bottom: 1px solid rgba(247,166,0,.08) !important;
            padding-bottom: 1.5rem !important; gap: .9rem !important; order: 0;
          }
          .center-panel { padding: .5rem 0 !important; order: 1; }
          .center-glow { display: none !important; }
          .right-panel {
            padding: 0 !important; border-left: none !important;
            border-top: 1px solid rgba(247,166,0,.08) !important;
            padding-top: 1.5rem !important; gap: .75rem !important;
            justify-content: flex-start !important; order: 2;
          }
          .mobile-labels { display: flex !important; flex-direction: column; align-items: center; gap: .4rem; order: -1; }
          .mobile-country { display: flex !important; }
          .desktop-country { display: none !important; }
        }
        @media (max-width: 480px) {
          nav { padding: 0 1rem !important; }
          .main-grid { padding: calc(56px + 1rem) .9rem 2rem !important; gap: 1.5rem !important; }
        }
        body.light .bybit-page { background: #fff8e6 !important; }
        body.light .bybit-page nav {
          background: rgba(255,248,230,.95) !important;
          border-bottom-color: rgba(247,166,0,.2) !important;
        }
        body.light .metric-hi {
          background: linear-gradient(135deg, #fff0c0, #ffe89a) !important;
          border-color: rgba(247,166,0,.3) !important;
        }
        body.light .plus-divider { background: #ffd878; border-color: rgba(200,130,0,.3); }
        body.light .custom-amount-input-wrap {
          background: #ffffff !important; border-color: rgba(200,130,0,.4) !important;
        }
      `}</style>
    </>
  )
}
