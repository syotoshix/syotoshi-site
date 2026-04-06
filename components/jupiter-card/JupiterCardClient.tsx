'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import NavBar from './NavBar'
import CardVisual from './CardVisual'
import PhoneMockup from './PhoneMockup'
import GetCardModal from './GetCardModal'
import '../../styles/card.css'
import {
  TIERS,
  EXAMPLES,
  COUNTRIES,
  CATEGORIES,
  refsToTier,
  fmt,
  fmtI,
  pct,
  formatCountdown,
  isEventActive,
  refBonus,
  signupBonus,
} from '@/lib/jupiter-card'

type PanelMode = 'examples' | 'custom'

export default function JupiterCardClient() {
  const [spend, setSpend] = useState(1500)
  const [refs, setRefs] = useState(0)
  const [qualPct, setQualPct] = useState(100)
  const [tierIdx, setTierIdx] = useState(0)
  const [fxRate, setFxRate] = useState(0)
  const [country, setCountry] = useState('us')
  const [mode, setMode] = useState<PanelMode>('examples')
  const [exIdx, setExIdx] = useState(0)
  const [customCatIdx, setCustomCatIdx] = useState(0)
  const [customAmount, setCustomAmount] = useState(200)
  const [isLight, setIsLight] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [countdown, setCountdown] = useState<string | null>(null)
  const [eventActive, setEventActive] = useState(false)
  const [currentRefBonus, setCurrentRefBonus] = useState(25)
  const [currentSignupBonus, setCurrentSignupBonus] = useState(100)
  const [phoneTime, setPhoneTime] = useState('')
  const [phoneDate, setPhoneDate] = useState('')
  const [purchaseIn, setPurchaseIn] = useState(false)
  const [cashbackIn, setCashbackIn] = useState(false)
  const [markerPositions, setMarkerPositions] = useState<number[]>([0, 0, 0, 0])

  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cashbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const refsSliderRef = useRef<HTMLDivElement>(null)

  // ── DERIVED STATE ──
  const tier = TIERS[tierIdx]
  const raw = spend * tier.rate
  const earned = Math.min(raw, tier.cap)
  const annual = earned * 12
  const fee = spend * fxRate
  const eff = spend > 0 ? (earned - fee) / spend : 0
  const capped = raw > tier.cap
  const qualifying = Math.round(refs * qualPct / 100)
  const totalRefBonus = qualifying * currentRefBonus

  // Phone notification content
  const currentEx = EXAMPLES[exIdx]
  const currentCat = CATEGORIES[customCatIdx]

  let notifIcon: string
  let notifMsg: string
  let notifEarned: string

  const countryData = COUNTRIES[country]
  const countrySuffix = countryData ? ` in ${countryData.flag} ${countryData.name}` : ''

  if (mode === 'examples') {
    const exTotal = currentEx.items.reduce((s, i) => s + i.price, 0)
    const exFee = exTotal * fxRate
    const exCb = exTotal * tier.rate
    notifIcon = currentEx.icon
    notifMsg = `You spent <span class="hi">${fmt(exTotal + exFee)}</span> at ${currentEx.name}${countrySuffix}.`
    notifEarned = fmt(exCb)
  } else {
    const amount = Math.max(0, customAmount)
    const rawCb = amount * tier.rate
    const cb = Math.min(rawCb, tier.cap)
    const feeAmt = amount * fxRate
    notifIcon = currentCat.icon
    notifMsg = `You spent <span class="hi">${fmt(amount + feeAmt)}</span> on ${currentCat.name}${countrySuffix}.`
    notifEarned = fmt(cb)
  }

  // Slider fill widths (percentages for CSS)
  function getSliderFillWidth(container: HTMLElement | null, min: number, max: number, val: number) {
    if (!container) return 10
    const w = container.offsetWidth
    const p = (val - min) / (max - min)
    return Math.round(10 + p * (w - 20))
  }

  const spendFillRef = useRef<HTMLDivElement>(null)
  const spendWrapRef = useRef<HTMLDivElement>(null)
  const refsFillRef = useRef<HTMLDivElement>(null)
  const refsWrapRef = useRef<HTMLDivElement>(null)
  const qualFillRef = useRef<HTMLDivElement>(null)
  const qualWrapRef = useRef<HTMLDivElement>(null)

  // ── TRIGGER NOTIF ANIMATION ──
  const triggerNotif = useCallback(() => {
    setPurchaseIn(false)
    setCashbackIn(false)
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current)
    if (cashbackTimerRef.current) clearTimeout(cashbackTimerRef.current)
    notifTimerRef.current = setTimeout(() => setPurchaseIn(true), 80)
    cashbackTimerRef.current = setTimeout(() => setCashbackIn(true), 900)
  }, [])

  // ── CYCLE EXAMPLES ──
  const startCycle = useCallback(() => {
    cycleTimerRef.current = setInterval(() => {
      setExIdx(prev => {
        const next = (prev + 1) % EXAMPLES.length
        return next
      })
    }, 4000)
  }, [])

  const resetCycle = useCallback(() => {
    if (cycleTimerRef.current) clearInterval(cycleTimerRef.current)
    startCycle()
  }, [startCycle])

  // ── PHONE TIME ──
  function updatePhoneTime() {
    const now = new Date()
    const h = now.getHours().toString().padStart(2, '0')
    const m = now.getMinutes().toString().padStart(2, '0')
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const mons = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    setPhoneTime(h + ':' + m)
    setPhoneDate(days[now.getDay()] + ', ' + now.getDate() + ' ' + mons[now.getMonth()])
  }

  // ── POSITION TIER MARKERS ──
  const positionMarkers = useCallback(() => {
    const wrap = refsWrapRef.current
    if (!wrap) return
    const w = wrap.offsetWidth
    if (!w) return
    const positions = [0, 20, 50, 100].map(val =>
      Math.round(10 + (val / 100) * (w - 20))
    )
    setMarkerPositions(positions)
  }, [])

  // ── UPDATE SLIDER FILLS ──
  const updateFills = useCallback(() => {
    if (spendFillRef.current && spendWrapRef.current) {
      spendFillRef.current.style.width = getSliderFillWidth(spendWrapRef.current, 100, 10000, spend) + 'px'
    }
    if (refsFillRef.current && refsWrapRef.current) {
      refsFillRef.current.style.width = getSliderFillWidth(refsWrapRef.current, 0, 100, refs) + 'px'
    }
    if (qualFillRef.current && qualWrapRef.current) {
      qualFillRef.current.style.width = getSliderFillWidth(qualWrapRef.current, 0, 100, qualPct) + 'px'
    }
  }, [spend, refs, qualPct])

  // ── INIT ──
  useEffect(() => {
    updatePhoneTime()
    const timeInterval = setInterval(updatePhoneTime, 10000)
    triggerNotif()
    startCycle()
    positionMarkers()
    window.addEventListener('resize', positionMarkers)

    return () => {
      clearInterval(timeInterval)
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current)
      if (notifTimerRef.current) clearTimeout(notifTimerRef.current)
      if (cashbackTimerRef.current) clearTimeout(cashbackTimerRef.current)
      window.removeEventListener('resize', positionMarkers)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── EVENT TICKER ──
  useEffect(() => {
    function tick() {
      const cd = formatCountdown()
      setCountdown(cd)
      setEventActive(isEventActive())
      setCurrentRefBonus(refBonus())
      setCurrentSignupBonus(signupBonus())
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  // ── FILL UPDATES ──
  useEffect(() => {
    updateFills()
  }, [spend, refs, qualPct, updateFills])

  // ── TRIGGER NOTIF ON EXAMPLE CHANGE ──
  useEffect(() => {
    if (mode === 'examples') triggerNotif()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exIdx])

  // ── THEME ──
  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
    }
  }, [isLight])

  // ── MODAL UMAMI ──
  function openModal() {
    setModalOpen(true)
    if (typeof (window as unknown as Record<string, unknown>).umami !== 'undefined') {
      (window as unknown as { umami: { track: (e: string) => void } }).umami.track('referral-popup-open')
    }
  }

  // ── APPLY COUNTRY ──
  function applyCountry(code: string) {
    const c = COUNTRIES[code]
    if (!c) return
    setCountry(code)
    setFxRate(c.fee)
  }

  // ── REFS SLIDER JUMP ──
  function jumpRefs(val: number) {
    setRefs(val)
    setTierIdx(refsToTier(val))
  }

  // ── MODE SWITCH ──
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

  // ── NEXT TIER TEXT ──
  let nextTierText: string
  if (tierIdx === 3) {
    nextTierText = 'Max tier!'
  } else {
    const nextTier = TIERS[tierIdx + 1]
    nextTierText = (nextTier.refsMin - refs) + ' more'
  }

  // ── COUNTRY OPTIONS ──
  const countryOptions = (
    <>
      <optgroup label="🇺🇸 USD (0% conversion fee)">
        <option value="us">🇺🇸 United States</option>
      </optgroup>
      <optgroup label="Rain issuer — 1% conversion fee">
        <option value="ag">🇦🇬 Antigua &amp; Barbuda</option>
        <option value="ar">🇦🇷 Argentina</option>
        <option value="ae">🇦🇪 UAE</option>
        <option value="bb">🇧🇧 Barbados</option>
        <option value="bd">🇧🇩 Bangladesh</option>
        <option value="bo">🇧🇴 Bolivia</option>
        <option value="br">🇧🇷 Brazil</option>
        <option value="bs">🇧🇸 Bahamas</option>
        <option value="bz">🇧🇿 Belize</option>
        <option value="ca">🇨🇦 Canada</option>
        <option value="ci">🇨🇮 Côte d&apos;Ivoire</option>
        <option value="co">🇨🇴 Colombia</option>
        <option value="cr">🇨🇷 Costa Rica</option>
        <option value="de">🇩🇪 Germany</option>
        <option value="dm">🇩🇲 Dominica</option>
        <option value="do">🇩🇴 Dominican Republic</option>
        <option value="ec">🇪🇨 Ecuador</option>
        <option value="eg">🇪🇬 Egypt</option>
        <option value="es">🇪🇸 Spain</option>
        <option value="fr">🇫🇷 France</option>
        <option value="gb">🇬🇧 United Kingdom</option>
        <option value="gd">🇬🇩 Grenada</option>
        <option value="gh">🇬🇭 Ghana</option>
        <option value="gt">🇬🇹 Guatemala</option>
        <option value="gy">🇬🇾 Guyana</option>
        <option value="hk">🇭🇰 Hong Kong</option>
        <option value="hn">🇭🇳 Honduras</option>
        <option value="in">🇮🇳 India</option>
        <option value="it">🇮🇹 Italy</option>
        <option value="ke">🇰🇪 Kenya</option>
        <option value="kn">🇰🇳 Saint Kitts &amp; Nevis</option>
        <option value="ky">🇰🇾 Cayman Islands</option>
        <option value="lc">🇱🇨 Saint Lucia</option>
        <option value="ma">🇲🇦 Morocco</option>
        <option value="mx">🇲🇽 Mexico</option>
        <option value="ng">🇳🇬 Nigeria</option>
        <option value="nl">🇳🇱 Netherlands</option>
        <option value="pa">🇵🇦 Panama</option>
        <option value="pe">🇵🇪 Peru</option>
        <option value="pk">🇵🇰 Pakistan</option>
        <option value="py">🇵🇾 Paraguay</option>
        <option value="sa">🇸🇦 Saudi Arabia</option>
        <option value="sn">🇸🇳 Senegal</option>
        <option value="sr">🇸🇷 Suriname</option>
        <option value="sv">🇸🇻 El Salvador</option>
        <option value="tc">🇹🇨 Turks &amp; Caicos Islands</option>
        <option value="tt">🇹🇹 Trinidad &amp; Tobago</option>
        <option value="ug">🇺🇬 Uganda</option>
        <option value="uy">🇺🇾 Uruguay</option>
        <option value="vc">🇻🇨 Saint Vincent &amp; the Grenadines</option>
        <option value="za">🇿🇦 South Africa</option>
        <option value="zm">🇿🇲 Zambia</option>
      </optgroup>
      <optgroup label="DCS issuer — 1.8% conversion fee">
        <option value="au">🇦🇺 Australia</option>
        <option value="id">🇮🇩 Indonesia</option>
        <option value="jp">🇯🇵 Japan</option>
        <option value="kr">🇰🇷 South Korea</option>
        <option value="my">🇲🇾 Malaysia</option>
        <option value="nz">🇳🇿 New Zealand</option>
        <option value="ph">🇵🇭 Philippines</option>
        <option value="sg">🇸🇬 Singapore</option>
        <option value="th">🇹🇭 Thailand</option>
        <option value="tw">🇹🇼 Taiwan</option>
        <option value="vn">🇻🇳 Vietnam</option>
      </optgroup>
    </>
  )

  const feeBadgeStyle = (warn: boolean): React.CSSProperties => ({
    fontSize: '.65rem', fontWeight: 700, borderRadius: '99px',
    padding: '2px 8px',
    background: warn ? 'rgba(255,80,80,.1)' : 'rgba(0,230,207,.12)',
    border: `1px solid ${warn ? 'rgba(255,80,80,.3)' : 'rgba(0,230,207,.25)'}`,
    color: warn ? '#f87171' : 'var(--pri)',
    transition: 'all .25s',
  })

  // ── EXAMPLES PANEL RENDER ──
  function renderExamplesPanel() {
    const ex = EXAMPLES[exIdx]
    const t = TIERS[tierIdx]
    const total = ex.items.reduce((s, i) => s + i.price, 0)
    const cb = total * t.rate
    const fee = total * fxRate
    const net = cb - fee
    const effPrice = total + fee - cb

    return (
      <div>
        {/* Example nav buttons */}
        <div style={{ display: 'flex', gap: '.4rem', marginBottom: '.75rem' }}>
          {EXAMPLES.map((e, i) => (
            <button
              key={i}
              onClick={() => { setExIdx(i); resetCycle(); triggerNotif() }}
              style={{
                flex: 1, background: i === exIdx ? 'rgba(0,230,207,.13)' : 'var(--b1)',
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

        {/* Merchant */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '.55rem',
            padding: '.6rem .8rem', background: 'var(--b1)',
            borderRadius: '11px', border: '1px solid rgba(255,255,255,.06)',
            marginBottom: '.5rem',
          }}
        >
          <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{ex.icon}</div>
          <div>
            <div style={{ fontSize: '.88rem', fontWeight: 700 }}>{ex.name}</div>
            <div style={{ fontSize: '.65rem', color: 'var(--n5)' }}>{ex.cat}</div>
          </div>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.28rem', marginBottom: '.5rem' }}>
          {ex.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '.73rem', color: 'var(--n4)',
                padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)',
              }}
            >
              <span>{item.label}</span>
              <span>{fmt(item.price)}</span>
            </div>
          ))}
          {/* Subtotal */}
          <div
            style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '.73rem', fontWeight: 700, color: 'var(--w)',
              padding: '.32rem 0',
            }}
          >
            <span>Subtotal</span>
            <span>{fmt(total)}</span>
          </div>
          {/* FX fee */}
          {fxRate > 0 && (
            <div
              style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '.73rem', color: '#f87171',
                padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)',
              }}
            >
              <span>Conversion fee (FX) {pct(fxRate)}</span>
              <span>+{fmt(fee)}</span>
            </div>
          )}
          {/* Cashback */}
          <div
            style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '.73rem', color: 'var(--pri)',
              padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)',
            }}
          >
            <span>Cashback {pct(t.rate)}</span>
            <span>−{fmt(cb)}</span>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '.65rem .9rem', borderRadius: '11px',
              fontSize: '.82rem', fontWeight: 600,
              background: 'var(--b1)', border: '1px solid rgba(0,230,207,.12)',
            }}
          >
            <span style={{ color: 'var(--n4)' }}>Net saving (cashback − fees)</span>
            <strong
              style={{
                fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em',
                color: net >= 0 ? 'var(--pri)' : '#f87171',
              }}
            >
              {(net >= 0 ? '+' : '') + fmt(net)}
            </strong>
          </div>
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '.65rem .9rem', borderRadius: '11px',
              fontSize: '.82rem', fontWeight: 600,
              background: 'var(--b1)', border: '1px solid rgba(255,255,255,.06)',
            }}
          >
            <span style={{ color: 'var(--n4)' }}>Effective price paid</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--w)' }}>
              {fmt(effPrice)}
            </strong>
          </div>
        </div>
      </div>
    )
  }

  // ── CUSTOM PANEL RENDER ──
  function renderCustomPanel() {
    const cat = CATEGORIES[customCatIdx]
    const t = TIERS[tierIdx]
    const amount = Math.max(0, customAmount)
    const rawCb = amount * t.rate
    const cb = Math.min(rawCb, t.cap)
    const cappedCustom = rawCb > t.cap
    const feeAmt = amount * fxRate
    const net = cb - feeAmt
    const effPrice = amount + feeAmt - cb

    return (
      <div>
        {/* Category buttons */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '.35rem',
            marginBottom: '.75rem',
          }}
        >
          {CATEGORIES.map((c, i) => (
            <button
              key={i}
              onClick={() => { setCustomCatIdx(i); triggerNotif() }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                background: i === customCatIdx ? 'rgba(0,230,207,.13)' : 'var(--b1)',
                border: `1px solid ${i === customCatIdx ? 'rgba(0,230,207,.3)' : 'rgba(255,255,255,.06)'}`,
                borderRadius: '9px', padding: '.45rem .2rem', cursor: 'pointer',
                fontSize: '.9rem', fontFamily: 'inherit', transition: 'background .15s, border-color .15s',
              }}
            >
              {c.icon}
              <span
                style={{
                  fontSize: '.55rem',
                  color: i === customCatIdx ? 'var(--pri)' : 'var(--n4)',
                  fontWeight: 600,
                }}
              >
                {c.name}
              </span>
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '.65rem', gap: '.75rem',
          }}
        >
          <div
            style={{
              fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'var(--n4)', whiteSpace: 'nowrap',
            }}
          >
            Purchase amount
          </div>
          <div
            className="custom-amount-input-wrap"
            style={{
              display: 'flex', alignItems: 'center', gap: '.3rem',
              background: 'var(--b0)', border: '1.5px solid rgba(0,230,207,.3)',
              borderRadius: '8px', padding: '.35rem .65rem',
              transition: 'border-color .2s, box-shadow .2s',
            }}
          >
            <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--n4)' }}>$</span>
            <input
              type="number"
              value={customAmount}
              min={1}
              max={100000}
              onChange={e => {
                setCustomAmount(Math.max(0, parseFloat(e.target.value) || 0))
                triggerNotif()
              }}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontSize: '.95rem', fontWeight: 700, color: 'var(--pri)',
                fontFamily: 'inherit', width: 90, textAlign: 'right', cursor: 'text',
              }}
            />
          </div>
        </div>

        {/* Merchant */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '.55rem',
            padding: '.6rem .8rem', background: 'var(--b1)',
            borderRadius: '11px', border: '1px solid rgba(255,255,255,.06)',
            marginBottom: '.5rem',
          }}
        >
          <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{cat.icon}</div>
          <div>
            <div style={{ fontSize: '.88rem', fontWeight: 700 }}>{cat.name}</div>
            <div style={{ fontSize: '.65rem', color: 'var(--n5)' }}>{cat.cat}</div>
          </div>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.28rem', marginBottom: '.5rem' }}>
          <div
            style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '.73rem', fontWeight: 700, color: 'var(--w)',
              padding: '.32rem 0',
            }}
          >
            <span>Purchase total</span>
            <span>{fmt(amount)}</span>
          </div>
          {fxRate > 0 && (
            <div
              style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '.73rem', color: '#f87171',
                padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)',
              }}
            >
              <span>Conversion fee (FX) {pct(fxRate)}</span>
              <span>+{fmt(feeAmt)}</span>
            </div>
          )}
          <div
            style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '.73rem', color: 'var(--pri)',
              padding: '.22rem 0', borderBottom: '1px solid rgba(255,255,255,.03)',
            }}
          >
            <span>
              Cashback {pct(t.rate)}
              {cappedCustom && (
                <span style={{ color: '#f5c542', fontSize: '.6rem' }}> (capped)</span>
              )}
            </span>
            <span>−{fmt(cb)}</span>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '.65rem .9rem', borderRadius: '11px',
              fontSize: '.82rem', fontWeight: 600,
              background: 'var(--b1)', border: '1px solid rgba(0,230,207,.12)',
            }}
          >
            <span style={{ color: 'var(--n4)' }}>Net saving (cashback − fees)</span>
            <strong
              style={{
                fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em',
                color: net >= 0 ? 'var(--pri)' : '#f87171',
              }}
            >
              {(net >= 0 ? '+' : '') + fmt(net)}
            </strong>
          </div>
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '.65rem .9rem', borderRadius: '11px',
              fontSize: '.82rem', fontWeight: 600,
              background: 'var(--b1)', border: '1px solid rgba(255,255,255,.06)',
            }}
          >
            <span style={{ color: 'var(--n4)' }}>Effective price paid</span>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--w)' }}>
              {fmt(effPrice)}
            </strong>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        style={{
          height: '100vh',
          display: 'grid',
          gridTemplateRows: '52px 1fr',
          overflow: 'hidden',
        }}
        className="app-shell"
      >
        {/* NAV */}
        <NavBar countdown={countdown} onOpenModal={openModal} />

        {/* MAIN */}
        <main
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: '1.2rem 4rem',
            gap: 0,
            overflow: 'hidden',
          }}
          className="main-grid"
        >

          {/* ── LEFT PANEL ── */}
          <div
            style={{
              display: 'flex', flexDirection: 'column',
              padding: '1.1rem 1.8rem 1.1rem 0',
              borderRight: '1px solid rgba(0,230,207,.08)',
              overflow: 'hidden', gap: '.8rem',
            }}
            className="left-panel"
          >
            {/* Mobile labels (visible on mobile only) */}
            <div className="mobile-labels" style={{ display: 'none' }}>
              <div
                style={{
                  fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                  background: 'rgba(0,230,207,.13)', color: 'var(--pri)',
                  border: '1px solid rgba(0,230,207,.2)', borderRadius: '99px', padding: '4px 14px',
                }}
              >
                Jupiter Global Cashback Calculator
              </div>
              {countdown && (
                <a
                  href="https://x.com/JupiterExchange/status/2038634728149201140?s=20"
                  target="_blank"
                  rel="noopener"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '.4rem',
                    background: 'var(--ev2)', border: '1px solid var(--ev3)',
                    borderRadius: '99px', padding: '3px 12px',
                    fontSize: '.65rem', fontWeight: 700, color: 'var(--ev)',
                    textDecoration: 'none',
                  }}
                >
                  <span className="nav-event-dot" />
                  2× Rewards Event · ends in <span className="nav-event-countdown">{countdown}</span>
                </a>
              )}
            </div>

            {/* Hero text */}
            <div>
              <h1
                style={{
                  fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.2,
                }}
              >
                Earn <em style={{ fontStyle: 'normal', color: 'var(--pri)' }}>real money back</em>
                <br />on every purchase
              </h1>
              <p style={{ fontSize: '.73rem', color: 'var(--n4)', lineHeight: 1.5, marginTop: '.25rem' }}>
                Jupiter Visa Infinite · Up to 10% cashback · Powered by Solana
              </p>
            </div>

            {/* Monthly Spend Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'var(--n4)',
                  }}
                >
                  Monthly Spend
                </span>
                <span style={{ fontSize: '.95rem', fontWeight: 800, color: 'var(--pri)' }}>
                  {fmt(spend).replace('.00', '')}
                </span>
              </div>
              <div className="range-wrap" ref={spendWrapRef}>
                <div className="range-track" />
                <div className="range-fill" ref={spendFillRef} />
                <input
                  type="range"
                  min={100}
                  max={10000}
                  step={50}
                  value={spend}
                  onChange={e => setSpend(parseInt(e.target.value))}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: 'var(--n5)' }}>
                <span>$100</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Referrals Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'var(--n4)',
                  }}
                >
                  Referrals
                </span>
                <span style={{ fontSize: '.95rem', fontWeight: 800, color: 'var(--pri)' }}>
                  {refs === 1 ? '1 referral' : refs + ' referrals'}
                </span>
              </div>
              <div className="range-wrap" ref={refsWrapRef}>
                <div className="range-track" />
                <div className="range-fill" ref={refsFillRef} />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={refs}
                  onChange={e => {
                    const v = parseInt(e.target.value)
                    setRefs(v)
                    setTierIdx(refsToTier(v))
                  }}
                />
              </div>

              {/* Tier markers */}
              <div className="tier-markers" ref={refsSliderRef} style={{ position: 'relative', height: 44, marginTop: '.15rem' }}>
                {[
                  { val: 0,   label: 'Starter\n4%',  xform: 'translateX(0)'    },
                  { val: 20,  label: 'Level 1\n5%',  xform: 'translateX(-50%)' },
                  { val: 50,  label: 'Level 2\n8%',  xform: 'translateX(-50%)' },
                  { val: 100, label: 'Level 3\n10%', xform: 'translateX(-100%)'},
                ].map((marker, i) => {
                  const reached = i <= tierIdx
                  const current = i === tierIdx
                  return (
                    <div
                      key={i}
                      className={`tm${reached ? ' reached' : ''}${current ? ' current' : ''}`}
                      style={{ left: markerPositions[i] || 0, transform: marker.xform }}
                      onClick={() => jumpRefs(marker.val)}
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

              {/* Qualifying spend % */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.3rem' }}>
                <span
                  style={{
                    fontSize: '.6rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'var(--n4)', display: 'flex', alignItems: 'center', gap: '.3rem',
                  }}
                >
                  % hitting qualifying spend
                  <span className="info-icon" tabIndex={0}>
                    <svg width={12} height={12} viewBox="0 0 14 14" fill="none">
                      <circle cx={7} cy={7} r={6.5} stroke="currentColor" />
                      <line x1={7} y1={6} x2={7} y2={10.5} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
                      <circle cx={7} cy={4} r={0.8} fill="currentColor" />
                    </svg>
                    <span className="info-tip">
                      A referral counts when your friend spends $100 within 30 days of joining. You earn ${currentRefBonus} USDC per successful referral. Use this slider to estimate what % of your friends actually hit that threshold.
                    </span>
                  </span>
                </span>
                <span style={{ fontSize: '.8rem', fontWeight: 800, color: 'var(--pri)' }}>
                  {qualPct}%
                </span>
              </div>
              <div className="range-wrap" ref={qualWrapRef}>
                <div className="range-track" />
                <div className="range-fill" ref={qualFillRef} />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={qualPct}
                  onChange={e => setQualPct(parseInt(e.target.value))}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: 'var(--n5)' }}>
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Mobile country selector */}
            <div className="mobile-country" style={{ display: 'none', flexDirection: 'column', gap: '.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'var(--n4)',
                  }}
                >
                  Spending country
                </span>
                <span style={feeBadgeStyle(fxRate > 0)}>
                  {COUNTRIES[country]?.label || '0% conversion fee'}
                </span>
              </div>
              <div className="country-select-wrap">
                <select
                  value={country}
                  onChange={e => applyCountry(e.target.value)}
                >
                  {countryOptions}
                </select>
              </div>
            </div>

            {/* Active tier badge */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '.6rem .8rem',
                background: 'rgba(0,230,207,.13)', border: '1px solid rgba(0,230,207,.2)',
                borderRadius: '10px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--w)' }}>{tier.name}</div>
                <div style={{ fontSize: '.62rem', color: 'var(--n5)' }}>{tier.refsLabel}</div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pri)', letterSpacing: '-.03em' }}>
                {pct(tier.rate)}
              </div>
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.45rem' }}>
              {/* Monthly earnings */}
              <div
                className="metric-hi"
                style={{
                  background: 'linear-gradient(135deg, #031f30, #020e14)',
                  border: '1px solid rgba(0,230,207,.2)',
                  borderRadius: '12px', padding: '.65rem .8rem',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  <span className="live-dot" style={{ marginRight: '.35rem' }} />
                  You could earn up to
                </div>
                <div
                  style={{
                    fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-.03em',
                    background: 'linear-gradient(90deg, #00e6cf, #00ffee)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {fmt(earned)}
                </div>
                <div style={{ fontSize: '.63rem', color: 'var(--n5)', marginTop: '.1rem' }}>per month in cashback</div>
                {/* Plus divider */}
                <div
                  className="plus-divider"
                  style={{
                    position: 'absolute', right: -14, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--b3)', border: '1px solid rgba(0,230,207,.2)',
                    color: 'var(--pri)', fontSize: '.85rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2, flexShrink: 0,
                  }}
                >
                  +
                </div>
              </div>

              {/* Referral bonuses */}
              <div
                className="metric-hi"
                style={{
                  background: 'linear-gradient(135deg, #031f30, #020e14)',
                  border: '1px solid rgba(0,230,207,.2)',
                  borderRadius: '12px', padding: '.65rem .8rem',
                }}
              >
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  One-time referral bonuses
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-.03em',
                      background: 'linear-gradient(90deg, #00e6cf, #00ffee)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {fmtI(totalRefBonus)}
                  </div>
                  {eventActive && (
                    <a
                      href="https://x.com/JupiterExchange/status/2038634728149201140?s=20"
                      target="_blank"
                      rel="noopener"
                      style={{
                        fontSize: '.52rem', background: 'var(--ev2)', color: 'var(--ev)',
                        border: '1px solid var(--ev3)', borderRadius: '99px',
                        padding: '2px 7px', fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none',
                      }}
                    >
                      2× event
                    </a>
                  )}
                </div>
                <div style={{ fontSize: '.63rem', color: 'var(--n5)', marginTop: '.1rem' }}>
                  {refs === 0 ? 'no referrals yet' : `${qualifying}/${refs} qualifying`}
                </div>
              </div>

              {/* Annual cashback */}
              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.65rem .8rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  Annual cashback earnings
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--pri)' }}>
                  {fmtI(annual)}
                </div>
              </div>

              {/* Effective cashback */}
              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.65rem .8rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  Effective cashback (-fees)
                </div>
                <div
                  style={{
                    fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em',
                    color: eff < 0 ? '#f87171' : 'var(--pri)',
                  }}
                >
                  {pct(eff)}
                </div>
              </div>

              {/* Monthly cap */}
              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.65rem .8rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  Monthly cashback cap
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--w)' }}>
                  {fmtI(tier.cap)}
                </div>
              </div>

              {/* Referrals to next tier */}
              <div style={{ background: 'var(--b1)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '12px', padding: '.65rem .8rem' }}>
                <div style={{ fontSize: '.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--n5)', marginBottom: '.2rem' }}>
                  Referrals to next tier
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--w)' }}>
                  {nextTierText}
                </div>
              </div>
            </div>

            {/* Cap warning */}
            {capped && (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '.45rem',
                  padding: '.45rem .7rem',
                  background: 'rgba(245,197,66,.06)', border: '1px solid rgba(245,197,66,.2)',
                  borderRadius: '8px', fontSize: '.68rem', color: '#f5c542',
                }}
              >
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
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '1rem 2.5rem',
              position: 'relative',
            }}
            className="center-panel"
          >
            <div
              style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 360, height: 600,
                background: 'radial-gradient(ellipse, rgba(0,230,207,.07) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
              className="center-glow"
            />
            <CardVisual onOpenModal={openModal} />
            <PhoneMockup
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
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '1.1rem 0 1.1rem 1.8rem',
              borderLeft: '1px solid rgba(0,230,207,.08)',
              gap: '.75rem', overflow: 'hidden',
            }}
            className="right-panel"
          >
            {/* Country selector (desktop) */}
            <div className="desktop-country" style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'var(--n4)',
                  }}
                >
                  Spending country
                </span>
                <span style={feeBadgeStyle(fxRate > 0)}>
                  {COUNTRIES[country]?.label || '0% conversion fee'}
                </span>
              </div>
              <div className="country-select-wrap">
                <select value={country} onChange={e => applyCountry(e.target.value)}>
                  {countryOptions}
                </select>
              </div>
            </div>

            {/* Mode toggle */}
            <div
              style={{
                display: 'flex', gap: 0, background: 'var(--b2)',
                borderRadius: '10px', padding: '3px', border: '1px solid rgba(255,255,255,.06)',
              }}
            >
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
                  <span
                    style={{
                      fontSize: '.52rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em',
                      background: 'rgba(0,230,207,.13)', color: 'var(--pri)',
                      borderRadius: '99px', padding: '1px 6px', marginLeft: 4,
                      verticalAlign: 'middle', border: '1px solid rgba(0,230,207,.2)',
                    }}
                  >
                    try it out
                  </span>
                )}
              </button>
            </div>

            {/* Panel content */}
            {mode === 'examples' ? renderExamplesPanel() : renderCustomPanel()}

          </div>
        </main>

        {/* Desktop credit */}
        <div
          id="credit-desktop"
          style={{
            position: 'fixed', bottom: '.75rem', right: '1rem',
            fontSize: '.72rem', color: 'var(--n5)', pointerEvents: 'none', zIndex: 10,
          }}
        >
          Made with 💚 by{' '}
          <a
            href="https://x.com/SyotoshiX"
            target="_blank"
            rel="noopener"
            style={{ color: 'var(--n4)', textDecoration: 'none', pointerEvents: 'all' }}
          >
            @SyotoshiX
          </a>
        </div>
      </div>

      {/* Mobile footer */}
      <footer
        id="credit-mobile"
        style={{
          display: 'none', textAlign: 'center', padding: '.75rem 1rem',
          fontSize: '.72rem', color: 'var(--n5)',
        }}
      >
        Made with 💚 by{' '}
        <a
          href="https://x.com/SyotoshiX"
          target="_blank"
          rel="noopener"
          style={{ color: 'var(--n4)', textDecoration: 'none' }}
        >
          @SyotoshiX
        </a>
      </footer>

      {/* Modal */}
      <GetCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        signupBonusAmount={currentSignupBonus}
        isEventActive={eventActive}
      />

      {/* Responsive styles */}
      <style>{`
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
            border-bottom: 1px solid rgba(0,230,207,.08) !important;
            padding-bottom: 1.5rem !important;
            gap: .9rem !important;
            order: 0;
          }
          .center-panel {
            padding: .5rem 0 !important;
            order: 1;
          }
          .center-glow { display: none !important; }
          .right-panel {
            padding: 0 !important;
            border-left: none !important;
            border-top: 1px solid rgba(0,230,207,.08) !important;
            padding-top: 1.5rem !important;
            gap: .75rem !important;
            justify-content: flex-start !important;
            order: 2;
          }
          .mobile-labels { display: flex !important; flex-direction: column; align-items: center; gap: .4rem; order: -1; }
          .mobile-country { display: flex !important; }
          .desktop-country { display: none !important; }
        }
        @media (max-width: 480px) {
          nav { padding: 0 1rem !important; }
          .main-grid { padding: calc(56px + 1rem) .9rem 2rem !important; gap: 1.5rem !important; }
        }
        body.light .left-panel .tier-badge-row-inner .tbr-name-el { color: #111 !important; }
        body.light .tier-badge-row { background: rgba(0,200,180,.1) !important; }
      `}</style>
    </>
  )
}
