import type { Metadata } from 'next'
import BybitCardClient from '@/components/bybit-card/BybitCardClient'

const TITLE       = 'Bybit Card Cashback Calculator — Earn Up to 10% Back'
const DESCRIPTION = 'Free Bybit Debit Card cashback calculator. See exactly how much USDT you earn per month across all 6 reward tiers (Base to Infinite), plus real-time Mastercard FX fees for 30+ countries. EU & Global card supported.'
const URL         = 'https://www.syotoshi.com/bybit-card'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Bybit card cashback calculator',
    'Bybit debit card rewards',
    'Bybit card tiers',
    'Bybit card EU',
    'Bybit card cashback',
    'crypto debit card cashback',
    'USDT cashback card',
    'Bybit card FX fee',
    'Bybit Infinite tier',
  ],
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: URL,
  },
  openGraph: {
    type:        'website',
    siteName:    'Syotoshi',
    title:       TITLE,
    description: DESCRIPTION,
    url:         URL,
  },
  twitter: {
    card:    'summary_large_image',
    site:    '@SyotoshiX',
    creator: '@SyotoshiX',
    title:   TITLE,
    description: DESCRIPTION,
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bybit Card Cashback Calculator',
    description: DESCRIPTION,
    url: URL,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',       item: 'https://www.syotoshi.com' },
      { '@type': 'ListItem', position: 2, name: 'Bybit Card', item: URL },
    ],
  },
]

export default function BybitCardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BybitCardClient />
    </>
  )
}
