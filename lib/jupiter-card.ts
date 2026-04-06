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
  name: string
  flag: string
}

export const COUNTRIES: Record<string, Country> = {
  us: { fee: 0,     label: '0% conversion fee',   issuer: 'USD — no conversion', name: 'United States',               flag: '🇺🇸' },
  // Rain issuer — 1% conversion fee
  ag: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Antigua & Barbuda',           flag: '🇦🇬' },
  ar: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Argentina',                   flag: '🇦🇷' },
  ae: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'UAE',                         flag: '🇦🇪' },
  bb: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Barbados',                    flag: '🇧🇧' },
  bd: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Bangladesh',                  flag: '🇧🇩' },
  bo: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Bolivia',                     flag: '🇧🇴' },
  br: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Brazil',                      flag: '🇧🇷' },
  bs: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Bahamas',                     flag: '🇧🇸' },
  bz: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Belize',                      flag: '🇧🇿' },
  ca: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Canada',                      flag: '🇨🇦' },
  ci: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: "Côte d'Ivoire",               flag: '🇨🇮' },
  co: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Colombia',                    flag: '🇨🇴' },
  cr: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Costa Rica',                  flag: '🇨🇷' },
  de: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Germany',                     flag: '🇩🇪' },
  dm: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Dominica',                    flag: '🇩🇲' },
  do: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Dominican Republic',          flag: '🇩🇴' },
  ec: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Ecuador',                     flag: '🇪🇨' },
  eg: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Egypt',                       flag: '🇪🇬' },
  es: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Spain',                       flag: '🇪🇸' },
  fr: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'France',                      flag: '🇫🇷' },
  gb: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'United Kingdom',              flag: '🇬🇧' },
  gd: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Grenada',                     flag: '🇬🇩' },
  gh: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Ghana',                       flag: '🇬🇭' },
  gt: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Guatemala',                   flag: '🇬🇹' },
  gy: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Guyana',                      flag: '🇬🇾' },
  hk: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Hong Kong',                   flag: '🇭🇰' },
  hn: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Honduras',                    flag: '🇭🇳' },
  in: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'India',                       flag: '🇮🇳' },
  it: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Italy',                       flag: '🇮🇹' },
  ke: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Kenya',                       flag: '🇰🇪' },
  kn: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Saint Kitts & Nevis',         flag: '🇰🇳' },
  ky: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Cayman Islands',              flag: '🇰🇾' },
  lc: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Saint Lucia',                 flag: '🇱🇨' },
  ma: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Morocco',                     flag: '🇲🇦' },
  mx: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Mexico',                      flag: '🇲🇽' },
  ng: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Nigeria',                     flag: '🇳🇬' },
  nl: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Netherlands',                 flag: '🇳🇱' },
  pa: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Panama',                      flag: '🇵🇦' },
  pe: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Peru',                        flag: '🇵🇪' },
  pk: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Pakistan',                    flag: '🇵🇰' },
  py: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Paraguay',                    flag: '🇵🇾' },
  sa: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Saudi Arabia',                flag: '🇸🇦' },
  sn: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Senegal',                     flag: '🇸🇳' },
  sr: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Suriname',                    flag: '🇸🇷' },
  sv: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'El Salvador',                 flag: '🇸🇻' },
  tc: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Turks & Caicos Islands',      flag: '🇹🇨' },
  tt: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Trinidad & Tobago',           flag: '🇹🇹' },
  ug: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Uganda',                      flag: '🇺🇬' },
  uy: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Uruguay',                     flag: '🇺🇾' },
  vc: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Saint Vincent & Grenadines',  flag: '🇻🇨' },
  za: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'South Africa',                flag: '🇿🇦' },
  zm: { fee: 0.01,  label: '1% conversion fee',   issuer: 'Rain issuer',          name: 'Zambia',                      flag: '🇿🇲' },
  // DCS issuer — 1.8% conversion fee
  au: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'Australia',                   flag: '🇦🇺' },
  id: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'Indonesia',                   flag: '🇮🇩' },
  jp: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'Japan',                       flag: '🇯🇵' },
  kr: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'South Korea',                 flag: '🇰🇷' },
  my: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'Malaysia',                    flag: '🇲🇾' },
  nz: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'New Zealand',                 flag: '🇳🇿' },
  ph: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'Philippines',                 flag: '🇵🇭' },
  sg: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'Singapore',                   flag: '🇸🇬' },
  th: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'Thailand',                    flag: '🇹🇭' },
  tw: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'Taiwan',                      flag: '🇹🇼' },
  vn: { fee: 0.018, label: '1.8% conversion fee', issuer: 'DCS issuer',           name: 'Vietnam',                     flag: '🇻🇳' },
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
