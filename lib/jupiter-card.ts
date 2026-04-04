export interface Tier {
  name: string
  rate: number
  cap: number
  refsMin: number
  refsMax: number
  refsLabel: string
}

export const TIERS: Tier[] = [
  { name: 'Starter Cashback', rate: 0.04, cap: 100,  refsMin: 0,   refsMax: 19,  refsLabel: 'No referrals needed' },
  { name: 'Level 1 Cashback', rate: 0.05, cap: 200,  refsMin: 20,  refsMax: 49,  refsLabel: '20+ referrals'       },
  { name: 'Level 2 Cashback', rate: 0.08, cap: 500,  refsMin: 50,  refsMax: 99,  refsLabel: '50+ referrals'       },
  { name: 'Level 3 Cashback', rate: 0.10, cap: 1000, refsMin: 100, refsMax: 100, refsLabel: '100+ referrals'      },
]

export interface ExampleItem {
  label: string
  price: number
}

export interface Example {
  icon: string
  name: string
  cat: string
  items: ExampleItem[]
}

export const EXAMPLES: Example[] = [
  {
    icon: '🛒', name: 'Webshop', cat: 'Electronics · Online',
    items: [
      { label: 'Sony WH-1000XM5 Headphones', price: 349.99 },
      { label: 'USB-C Hub 7-in-1',           price:  49.99 },
      { label: 'Phone Case',                 price:  19.99 },
    ],
  },
  {
    icon: '🏨', name: 'Hotel', cat: 'Hotel · 3 Nights',
    items: [
      { label: 'Deluxe Room × 3 nights', price: 540.00 },
      { label: 'Breakfast package',      price:  75.00 },
      { label: 'Parking',                price:  45.00 },
    ],
  },
  {
    icon: '🍽️', name: 'Dinner', cat: 'Fine Dining',
    items: [
      { label: 'Wagyu Beef Entrée × 2', price: 190.00 },
      { label: 'Cocktails × 4',         price:  72.00 },
      { label: 'Dessert platter',        price:  38.00 },
    ],
  },
]

export interface Country {
  fee: number
  label: string
  issuer: string
}

export const COUNTRIES: Record<string, Country> = {
  us: { fee: 0,     label: '0% conversion fee',   issuer: 'USD — no conversion' },
  mx: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  br: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  ar: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  ca: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  gb: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  de: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  fr: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  es: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  it: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  nl: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  za: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  ng: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  ae: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  sa: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  in: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  hk: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer' },
  sg: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer' },
  kr: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer' },
  jp: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer' },
  vn: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer' },
  my: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer' },
  tw: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer' },
  au: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer' },
  th: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer' },
  ph: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer' },
}

export interface Category {
  icon: string
  name: string
  cat: string
}

export const CATEGORIES: Category[] = [
  { icon: '🛒', name: 'Shopping',    cat: 'General retail'        },
  { icon: '🏨', name: 'Hotel',       cat: 'Accommodation'         },
  { icon: '🍽️', name: 'Dining',      cat: 'Restaurants & bars'    },
  { icon: '✈️', name: 'Travel',      cat: 'Flights & transport'   },
  { icon: '⛽', name: 'Fuel',        cat: 'Gas station'           },
  { icon: '🛒', name: 'Groceries',   cat: 'Supermarket'           },
  { icon: '💊', name: 'Health',      cat: 'Pharmacy & wellness'   },
  { icon: '🎮', name: 'Gaming',      cat: 'Games & subscriptions' },
  { icon: '📱', name: 'Electronics', cat: 'Tech & gadgets'        },
  { icon: '🧴', name: 'Beauty',      cat: 'Cosmetics & skincare'  },
]

export const EVENT = {
  active:      true,
  end:         new Date('2026-04-05T23:59:59'),
  label:       '2× Rewards Event',
  refBonus:    50,
  signupBonus: 200,
}

export const BASE = { refBonus: 25, signupBonus: 100 }

export function isEventActive(): boolean {
  return EVENT.active && new Date() <= EVENT.end
}

export function refBonus(): number {
  return isEventActive() ? EVENT.refBonus : BASE.refBonus
}

export function signupBonus(): number {
  return isEventActive() ? EVENT.signupBonus : BASE.signupBonus
}

export function refsToTier(r: number): number {
  if (r >= 100) return 3
  if (r >= 50)  return 2
  if (r >= 20)  return 1
  return 0
}

export function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtI(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export function pct(r: number): string {
  return (r * 100).toFixed(2) + '%'
}

export function formatCountdown(): string | null {
  const ms = EVENT.end.getTime() - Date.now()
  if (ms <= 0) return null
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}
