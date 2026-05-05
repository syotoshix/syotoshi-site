export interface Tier {
  name:       string
  rate:       number
  cap:        number   // monthly EUR cap
  spendMin:   number   // monthly EUR spend to unlock
  spendLabel: string
}

export const TIERS: Tier[] = [
  { name: 'Base',     rate: 0.02, cap:   5, spendMin:     0, spendLabel: 'No minimum'       },
  { name: 'Beta',     rate: 0.02, cap:  50, spendMin:   500, spendLabel: '€500+ / month'    },
  { name: 'Alpha',    rate: 0.04, cap: 150, spendMin:  3500, spendLabel: '€3,500+ / month'  },
  { name: 'Apex',     rate: 0.06, cap: 250, spendMin:  9500, spendLabel: '€9,500+ / month'  },
  { name: 'Omega',    rate: 0.08, cap: 400, spendMin: 12500, spendLabel: '€12,500+ / month' },
  { name: 'Infinite', rate: 0.10, cap: 600, spendMin: 25000, spendLabel: '€25,000+ / month' },
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

export interface ExampleItem {
  label: string
  price: number
}

export interface Example {
  icon:  string
  name:  string
  cat:   string
  items: ExampleItem[]
}

export const EXAMPLES: Example[] = [
  {
    icon: '🛒', name: 'Webshop', cat: 'Electronics · Online',
    items: [
      { label: 'Sony WH-1000XM5 Headphones', price: 319.99 },
      { label: 'USB-C Hub 7-in-1',           price:  44.99 },
      { label: 'Phone Case',                 price:  17.99 },
    ],
  },
  {
    icon: '🏨', name: 'Hotel', cat: 'Hotel · 3 Nights',
    items: [
      { label: 'Deluxe Room × 3 nights', price: 510.00 },
      { label: 'Breakfast package',      price:  69.00 },
      { label: 'Parking',                price:  42.00 },
    ],
  },
  {
    icon: '🍽️', name: 'Dinner', cat: 'Fine Dining',
    items: [
      { label: 'Wagyu Beef Entrée × 2', price: 176.00 },
      { label: 'Wine × 2',              price:  68.00 },
      { label: 'Dessert platter',        price:  36.00 },
    ],
  },
]

export interface Country {
  fee:      number
  label:    string
  name:     string
  flag:     string
  currency: string  // ISO 4217 txnCurrency for Mastercard markup lookup
}

export const COUNTRIES: Record<string, Country> = {
  // Eurozone — 0% conversion fee
  at: { fee: 0, label: '0% conversion fee', name: 'Austria',     flag: '🇦🇹', currency: 'EUR' },
  be: { fee: 0, label: '0% conversion fee', name: 'Belgium',     flag: '🇧🇪', currency: 'EUR' },
  cy: { fee: 0, label: '0% conversion fee', name: 'Cyprus',      flag: '🇨🇾', currency: 'EUR' },
  de: { fee: 0, label: '0% conversion fee', name: 'Germany',     flag: '🇩🇪', currency: 'EUR' },
  ee: { fee: 0, label: '0% conversion fee', name: 'Estonia',     flag: '🇪🇪', currency: 'EUR' },
  es: { fee: 0, label: '0% conversion fee', name: 'Spain',       flag: '🇪🇸', currency: 'EUR' },
  fi: { fee: 0, label: '0% conversion fee', name: 'Finland',     flag: '🇫🇮', currency: 'EUR' },
  fr: { fee: 0, label: '0% conversion fee', name: 'France',      flag: '🇫🇷', currency: 'EUR' },
  gr: { fee: 0, label: '0% conversion fee', name: 'Greece',      flag: '🇬🇷', currency: 'EUR' },
  ie: { fee: 0, label: '0% conversion fee', name: 'Ireland',     flag: '🇮🇪', currency: 'EUR' },
  it: { fee: 0, label: '0% conversion fee', name: 'Italy',       flag: '🇮🇹', currency: 'EUR' },
  lt: { fee: 0, label: '0% conversion fee', name: 'Lithuania',   flag: '🇱🇹', currency: 'EUR' },
  lu: { fee: 0, label: '0% conversion fee', name: 'Luxembourg',  flag: '🇱🇺', currency: 'EUR' },
  lv: { fee: 0, label: '0% conversion fee', name: 'Latvia',      flag: '🇱🇻', currency: 'EUR' },
  mt: { fee: 0, label: '0% conversion fee', name: 'Malta',       flag: '🇲🇹', currency: 'EUR' },
  nl: { fee: 0, label: '0% conversion fee', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR' },
  pt: { fee: 0, label: '0% conversion fee', name: 'Portugal',    flag: '🇵🇹', currency: 'EUR' },
  si: { fee: 0, label: '0% conversion fee', name: 'Slovenia',    flag: '🇸🇮', currency: 'EUR' },
  sk: { fee: 0, label: '0% conversion fee', name: 'Slovakia',    flag: '🇸🇰', currency: 'EUR' },
  // Non-euro EU — 0.5% Bybit FX fee (+ Mastercard's base rate)
  bg: { fee: 0.005, label: '0.5% FX fee', name: 'Bulgaria',       flag: '🇧🇬', currency: 'BGN' },
  hr: { fee: 0.005, label: '0.5% FX fee', name: 'Croatia',        flag: '🇭🇷', currency: 'EUR' },
  cz: { fee: 0.005, label: '0.5% FX fee', name: 'Czech Republic', flag: '🇨🇿', currency: 'CZK' },
  dk: { fee: 0.005, label: '0.5% FX fee', name: 'Denmark',        flag: '🇩🇰', currency: 'DKK' },
  hu: { fee: 0.005, label: '0.5% FX fee', name: 'Hungary',        flag: '🇭🇺', currency: 'HUF' },
  pl: { fee: 0.005, label: '0.5% FX fee', name: 'Poland',         flag: '🇵🇱', currency: 'PLN' },
  ro: { fee: 0.005, label: '0.5% FX fee', name: 'Romania',        flag: '🇷🇴', currency: 'RON' },
  se: { fee: 0.005, label: '0.5% FX fee', name: 'Sweden',         flag: '🇸🇪', currency: 'SEK' },
  // Rest of world — 0.5% Bybit FX fee (+ Mastercard's base rate)
  ae: { fee: 0.005, label: '0.5% FX fee', name: 'UAE',            flag: '🇦🇪', currency: 'AED' },
  au: { fee: 0.005, label: '0.5% FX fee', name: 'Australia',      flag: '🇦🇺', currency: 'AUD' },
  br: { fee: 0.005, label: '0.5% FX fee', name: 'Brazil',         flag: '🇧🇷', currency: 'BRL' },
  ca: { fee: 0.005, label: '0.5% FX fee', name: 'Canada',         flag: '🇨🇦', currency: 'CAD' },
  gb: { fee: 0.005, label: '0.5% FX fee', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  hk: { fee: 0.005, label: '0.5% FX fee', name: 'Hong Kong',      flag: '🇭🇰', currency: 'HKD' },
  id: { fee: 0.005, label: '0.5% FX fee', name: 'Indonesia',      flag: '🇮🇩', currency: 'IDR' },
  in: { fee: 0.005, label: '0.5% FX fee', name: 'India',          flag: '🇮🇳', currency: 'INR' },
  jp: { fee: 0.005, label: '0.5% FX fee', name: 'Japan',          flag: '🇯🇵', currency: 'JPY' },
  kr: { fee: 0.005, label: '0.5% FX fee', name: 'South Korea',    flag: '🇰🇷', currency: 'KRW' },
  my: { fee: 0.005, label: '0.5% FX fee', name: 'Malaysia',       flag: '🇲🇾', currency: 'MYR' },
  mx: { fee: 0.005, label: '0.5% FX fee', name: 'Mexico',         flag: '🇲🇽', currency: 'MXN' },
  ng: { fee: 0.005, label: '0.5% FX fee', name: 'Nigeria',        flag: '🇳🇬', currency: 'NGN' },
  ph: { fee: 0.005, label: '0.5% FX fee', name: 'Philippines',    flag: '🇵🇭', currency: 'PHP' },
  sa: { fee: 0.005, label: '0.5% FX fee', name: 'Saudi Arabia',   flag: '🇸🇦', currency: 'SAR' },
  sg: { fee: 0.005, label: '0.5% FX fee', name: 'Singapore',      flag: '🇸🇬', currency: 'SGD' },
  th: { fee: 0.005, label: '0.5% FX fee', name: 'Thailand',       flag: '🇹🇭', currency: 'THB' },
  tr: { fee: 0.005, label: '0.5% FX fee', name: 'Turkey',         flag: '🇹🇷', currency: 'TRY' },
  tw: { fee: 0.005, label: '0.5% FX fee', name: 'Taiwan',         flag: '🇹🇼', currency: 'TWD' },
  us: { fee: 0.005, label: '0.5% FX fee', name: 'United States',  flag: '🇺🇸', currency: 'USD' },
  vn: { fee: 0.005, label: '0.5% FX fee', name: 'Vietnam',        flag: '🇻🇳', currency: 'VND' },
  za: { fee: 0.005, label: '0.5% FX fee', name: 'South Africa',   flag: '🇿🇦', currency: 'ZAR' },
}

export interface Category {
  icon: string
  name: string
  cat:  string
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

// You earn €20 per qualifying referral; referee earns €10
// Eligible: referee spends €100 in their first 30 days
export const BASE = { refBonus: 20, signupBonus: 10 }

export const CRYPTO_FEE = 0.009

export function fmt(n: number): string {
  return '€' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtI(n: number): string {
  return '€' + Math.round(n).toLocaleString('en-US')
}

export function pct(r: number): string {
  return (r * 100).toFixed(r * 100 % 1 === 0 ? 0 : 2) + '%'
}
