export interface KastTier {
  id:              string
  name:            string
  label:           string
  annualFee:       number
  refPoints:       number   // KAST points you earn per qualifying referral at this tier
  stakeMultiplier: number   // KAST points per SOL staked per epoch (epoch ≈ 2 days)
}

export const KAST_TIERS: KastTier[] = [
  { id: 'standard', name: 'Standard', label: 'K-Card',       annualFee: 0,      refPoints: 200,  stakeMultiplier: 0.125 },
  { id: 'premium',  name: 'Premium',  label: 'Premium Metal', annualFee: 1000,   refPoints: 5000, stakeMultiplier: 0.25  },
  { id: 'luxe',     name: 'Luxe',     label: 'Luxe Edition',  annualFee: 10000,  refPoints: 5000, stakeMultiplier: 0.5   },
]

// Solana epoch ≈ 2 days → ~15 epochs per month
export const EPOCHS_PER_MONTH = 15

// Value of 1 KAST point in USD
export const KAST_POINT_VALUE = 0.08

// ── Card definitions for the wheel ──
// Each card maps to a cashback tier. Update name/tagline/theme when actual card
// products are confirmed — the tierIdx wires it to the right cashback rate.
export interface KastCardTheme {
  pri:    string  // primary accent colour
  prid:   string  // darker accent (hover states)
  cardBg: string  // card face background gradient
  border: string  // card border colour
  glow:   string  // ambient glow colour
  grid:   string  // grid-line colour on card face
  arcClr: string  // arc decoration rgba prefix (e.g. 'rgba(79,156,249,')
}

export interface KastCardDef {
  id:       string
  name:     string
  tagline:  string
  tierIdx:  number        // index into KAST_TIERS
  theme:    KastCardTheme
  img:      string        // path under /public, e.g. '/kast-card/standard_kast.png'
  kastRate: number        // e.g. 0.02 = 2% of spend paid back as KAST points value
  moveRate: number        // e.g. 0.04 = 4% of spend paid back as MOVE tokens value
}

// ── Cards grouped by tier ─────────────────────────────────────────────────────
// Standard (2%) → 4 cards | Premium (5%) → 4 cards | Luxe (8%) → 2 cards
export const KAST_CARDS_BY_TIER: KastCardDef[][] = [
  // ── Standard — Pengu Black theme (#22d3ee) ────────────────────────────────
  [
    {
      id: 'k-card', name: 'K Card', tagline: 'Standard · Visa', tierIdx: 0,
      img: '/kast-card/standard_kast.png',
      kastRate: 0.01, moveRate: 0.04,
      theme: {
        pri: '#22d3ee', prid: '#06b6d4',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(34,211,238,.07)',
        grid: 'rgba(34,211,238,.05)', arcClr: 'rgba(34,211,238,',
      },
    },
    {
      id: 'solana-card', name: 'Solana Card', tagline: 'Standard · Visa', tierIdx: 0,
      img: '/kast-card/standard_solana.png',
      kastRate: 0.01, moveRate: 0.04,
      theme: {
        pri: '#22d3ee', prid: '#06b6d4',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(34,211,238,.07)',
        grid: 'rgba(34,211,238,.05)', arcClr: 'rgba(34,211,238,',
      },
    },
    {
      id: 'bitcoin-silver', name: 'Bitcoin Silver Card', tagline: 'Standard · Visa', tierIdx: 0,
      img: '/kast-card/standard_bitcoin.png',
      kastRate: 0.01, moveRate: 0.04,
      theme: {
        pri: '#22d3ee', prid: '#06b6d4',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(34,211,238,.07)',
        grid: 'rgba(34,211,238,.05)', arcClr: 'rgba(34,211,238,',
      },
    },
    {
      id: 'pengu-card', name: 'Pengu Card', tagline: 'Standard · Visa', tierIdx: 0,
      img: '/kast-card/standard_pengu.png',
      kastRate: 0.02, moveRate: 0.04,   // Pengu bonus: 2% instead of 1%
      theme: {
        pri: '#22d3ee', prid: '#06b6d4',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(34,211,238,.07)',
        grid: 'rgba(34,211,238,.05)', arcClr: 'rgba(34,211,238,',
      },
    },
  ],

  // ── Premium — Solana Illuma theme (#c084fc) ───────────────────────────────
  [
    {
      id: 'x-card', name: 'X Card', tagline: 'Premium · Visa', tierIdx: 1,
      img: '/kast-card/premium_kast.png',
      kastRate: 0.04, moveRate: 0.04,
      theme: {
        pri: '#c084fc', prid: '#a855f7',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(192,132,252,.07)',
        grid: 'rgba(192,132,252,.05)', arcClr: 'rgba(192,132,252,',
      },
    },
    {
      id: 'solana-illuma', name: 'Solana Illuma Card', tagline: 'Premium · Visa', tierIdx: 1,
      img: '/kast-card/premium_solana.png',
      kastRate: 0.04, moveRate: 0.04,
      theme: {
        pri: '#c084fc', prid: '#a855f7',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(192,132,252,.07)',
        grid: 'rgba(192,132,252,.05)', arcClr: 'rgba(192,132,252,',
      },
    },
    {
      id: 'bitcoin-black', name: 'Bitcoin Black Card', tagline: 'Premium · Visa', tierIdx: 1,
      img: '/kast-card/premium_bitcoin.png',
      kastRate: 0.04, moveRate: 0.04,
      theme: {
        pri: '#c084fc', prid: '#a855f7',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(192,132,252,.07)',
        grid: 'rgba(192,132,252,.05)', arcClr: 'rgba(192,132,252,',
      },
    },
    {
      id: 'pengu-black', name: 'Pengu Black Card', tagline: 'Premium · Visa', tierIdx: 1,
      img: '/kast-card/premium_pengu.png',
      kastRate: 0.05, moveRate: 0.04,   // Pengu bonus: 5% instead of 4%
      theme: {
        pri: '#c084fc', prid: '#a855f7',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(192,132,252,.07)',
        grid: 'rgba(192,132,252,.05)', arcClr: 'rgba(192,132,252,',
      },
    },
  ],

  // ── Luxe — Solana Gold theme (#fbbf24) ────────────────────────────────────
  [
    {
      id: 'solana-gold', name: 'Solana Gold Card', tagline: 'Luxe · Visa', tierIdx: 2,
      img: '/kast-card/luxe_solana.png',
      kastRate: 0.06, moveRate: 0.04,
      theme: {
        pri: '#fbbf24', prid: '#f59e0b',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(251,191,36,.08)',
        grid: 'rgba(251,191,36,.05)', arcClr: 'rgba(251,191,36,',
      },
    },
    {
      id: 'pengu-gold', name: 'Pengu Gold Card', tagline: 'Luxe · Visa', tierIdx: 2,
      img: '/kast-card/luxe_pengu.png',
      kastRate: 0.08, moveRate: 0.04,   // Pengu bonus: 8% instead of 6%
      theme: {
        pri: '#fbbf24', prid: '#f59e0b',
        cardBg: 'transparent',
        border: 'transparent', glow: 'rgba(251,191,36,.08)',
        grid: 'rgba(251,191,36,.05)', arcClr: 'rgba(251,191,36,',
      },
    },
  ],
]

// What referred friends earn (200 KAST points after KYC + $100 spend, plus 20% off paid cards)
export const KAST_FRIEND_POINTS = 200
export const KAST_FRIEND_CARD_DISCOUNT = 0.20

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

export interface Country {
  fee:   number
  label: string
  name:  string
  flag:  string
}

export const COUNTRIES: Record<string, Country> = {
  us: { fee: 0,    label: '0% FX fee',  name: 'United States',   flag: '🇺🇸' },
  // 2% FX fee for all non-USD countries
  gb: { fee: 0.02, label: '2% FX fee',  name: 'United Kingdom',  flag: '🇬🇧' },
  de: { fee: 0.02, label: '2% FX fee',  name: 'Germany',          flag: '🇩🇪' },
  fr: { fee: 0.02, label: '2% FX fee',  name: 'France',           flag: '🇫🇷' },
  es: { fee: 0.02, label: '2% FX fee',  name: 'Spain',            flag: '🇪🇸' },
  it: { fee: 0.02, label: '2% FX fee',  name: 'Italy',            flag: '🇮🇹' },
  nl: { fee: 0.02, label: '2% FX fee',  name: 'Netherlands',      flag: '🇳🇱' },
  ca: { fee: 0.02, label: '2% FX fee',  name: 'Canada',           flag: '🇨🇦' },
  br: { fee: 0.02, label: '2% FX fee',  name: 'Brazil',           flag: '🇧🇷' },
  mx: { fee: 0.02, label: '2% FX fee',  name: 'Mexico',           flag: '🇲🇽' },
  ae: { fee: 0.02, label: '2% FX fee',  name: 'UAE',              flag: '🇦🇪' },
  in: { fee: 0.02, label: '2% FX fee',  name: 'India',            flag: '🇮🇳' },
  ng: { fee: 0.02, label: '2% FX fee',  name: 'Nigeria',          flag: '🇳🇬' },
  za: { fee: 0.02, label: '2% FX fee',  name: 'South Africa',     flag: '🇿🇦' },
  ar: { fee: 0.02, label: '2% FX fee',  name: 'Argentina',        flag: '🇦🇷' },
  co: { fee: 0.02, label: '2% FX fee',  name: 'Colombia',         flag: '🇨🇴' },
  tr: { fee: 0.02, label: '2% FX fee',  name: 'Turkey',           flag: '🇹🇷' },
  sa: { fee: 0.02, label: '2% FX fee',  name: 'Saudi Arabia',     flag: '🇸🇦' },
  au: { fee: 0.02, label: '2% FX fee',  name: 'Australia',        flag: '🇦🇺' },
  jp: { fee: 0.02, label: '2% FX fee',  name: 'Japan',            flag: '🇯🇵' },
  sg: { fee: 0.02, label: '2% FX fee',  name: 'Singapore',        flag: '🇸🇬' },
  kr: { fee: 0.02, label: '2% FX fee',  name: 'South Korea',      flag: '🇰🇷' },
  hk: { fee: 0.02, label: '2% FX fee',  name: 'Hong Kong',        flag: '🇭🇰' },
  nz: { fee: 0.02, label: '2% FX fee',  name: 'New Zealand',      flag: '🇳🇿' },
  my: { fee: 0.02, label: '2% FX fee',  name: 'Malaysia',         flag: '🇲🇾' },
  th: { fee: 0.02, label: '2% FX fee',  name: 'Thailand',         flag: '🇹🇭' },
  ph: { fee: 0.02, label: '2% FX fee',  name: 'Philippines',      flag: '🇵🇭' },
  id: { fee: 0.02, label: '2% FX fee',  name: 'Indonesia',        flag: '🇮🇩' },
  vn: { fee: 0.02, label: '2% FX fee',  name: 'Vietnam',          flag: '🇻🇳' },
  tw: { fee: 0.02, label: '2% FX fee',  name: 'Taiwan',           flag: '🇹🇼' },
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
