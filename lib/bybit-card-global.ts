// Bybit Global (International) card — fees sourced from Bybit help center
export type { Tier, ExampleItem, Example, Country, Category } from './bybit-card'
import type { Tier, Example, Country, Category } from './bybit-card'

export const TIERS: Tier[] = [
  { name: 'Base',     rate: 0.02, cap:   5, spendMin:     0, spendLabel: 'No minimum'        },
  { name: 'Beta',     rate: 0.02, cap:  50, spendMin:   500, spendLabel: '$500+ / month'     },
  { name: 'Alpha',    rate: 0.04, cap: 150, spendMin:  3500, spendLabel: '$3,500+ / month'   },
  { name: 'Apex',     rate: 0.06, cap: 250, spendMin:  9500, spendLabel: '$9,500+ / month'   },
  { name: 'Omega',    rate: 0.08, cap: 400, spendMin: 12500, spendLabel: '$12,500+ / month'  },
  { name: 'Infinite', rate: 0.10, cap: 600, spendMin: 25000, spendLabel: '$25,000+ / month'  },
]

export const SPEND_MAX = 30000

export function spendToTier(spend: number): number {
  if (spend >= 25000) return 5
  if (spend >= 12500) return 4
  if (spend >= 9500)  return 3
  if (spend >= 3500)  return 2
  if (spend >= 500)   return 1
  return 0
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
      { label: 'Wine × 2',              price:  74.00 },
      { label: 'Dessert platter',        price:  38.00 },
    ],
  },
]

export const COUNTRIES: Record<string, Country> = {
  // ── 0% — Home currency (USD-denominated programs) ─────────────────────────
  usd: { fee: 0,     label: '0% conversion fee', name: 'United States (USD)', flag: '🇺🇸', currency: 'USD' },

  // ── 1% FX — Australia & Asia Pacific programs ─────────────────────────────
  au:  { fee: 0.01,  label: '1% FX fee', name: 'Australia',      flag: '🇦🇺', currency: 'AUD' },
  jp:  { fee: 0.01,  label: '1% FX fee', name: 'Japan',          flag: '🇯🇵', currency: 'JPY' },
  kr:  { fee: 0.01,  label: '1% FX fee', name: 'South Korea',    flag: '🇰🇷', currency: 'KRW' },
  sg:  { fee: 0.01,  label: '1% FX fee', name: 'Singapore',      flag: '🇸🇬', currency: 'SGD' },
  hk:  { fee: 0.01,  label: '1% FX fee', name: 'Hong Kong',      flag: '🇭🇰', currency: 'HKD' },
  my:  { fee: 0.01,  label: '1% FX fee', name: 'Malaysia',       flag: '🇲🇾', currency: 'MYR' },
  id:  { fee: 0.01,  label: '1% FX fee', name: 'Indonesia',      flag: '🇮🇩', currency: 'IDR' },
  ph:  { fee: 0.01,  label: '1% FX fee', name: 'Philippines',    flag: '🇵🇭', currency: 'PHP' },
  th:  { fee: 0.01,  label: '1% FX fee', name: 'Thailand',       flag: '🇹🇭', currency: 'THB' },
  vn:  { fee: 0.01,  label: '1% FX fee', name: 'Vietnam',        flag: '🇻🇳', currency: 'VND' },
  tw:  { fee: 0.01,  label: '1% FX fee', name: 'Taiwan',         flag: '🇹🇼', currency: 'TWD' },
  in:  { fee: 0.01,  label: '1% FX fee', name: 'India',          flag: '🇮🇳', currency: 'INR' },
  ge:  { fee: 0.01,  label: '1% FX fee', name: 'Georgia',        flag: '🇬🇪', currency: 'GEL' },
  eu:  { fee: 0.01,  label: '1% FX fee', name: 'Eurozone (EUR)', flag: '🇪🇺', currency: 'EUR' },

  // ── 1.5% FX — Brazil program ──────────────────────────────────────────────
  br:  { fee: 0.015, label: '1.5% FX fee', name: 'Brazil',             flag: '🇧🇷', currency: 'BRL' },

  // ── 2% FX — Mexico & AIFC programs ───────────────────────────────────────
  mx:  { fee: 0.02,  label: '2% FX fee',   name: 'Mexico',             flag: '🇲🇽', currency: 'MXN' },
  kz:  { fee: 0.02,  label: '2% FX fee',   name: 'Kazakhstan (AIFC)',  flag: '🇰🇿', currency: 'KZT' },

  // ── 7% FX — Argentina program ─────────────────────────────────────────────
  ar:  { fee: 0.07,  label: '7% FX fee',   name: 'Argentina',          flag: '🇦🇷', currency: 'ARS' },
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

// TODO: update with real Bybit Global referral amounts when confirmed
export const BASE = { refBonus: 20, signupBonus: 10 }

// 0.9% for most programs; Argentina is 0.5% (not modelled per-country yet)
export const CRYPTO_FEE = 0.009

export function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtI(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export function pct(r: number): string {
  return (r * 100).toFixed(r * 100 % 1 === 0 ? 0 : 2) + '%'
}
