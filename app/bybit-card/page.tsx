import type { Metadata } from 'next'
import BybitCardClient from '@/components/bybit-card/BybitCardClient'

export const metadata: Metadata = {
  title: 'Bybit Card Cashback Calculator — Earn Up to 8% Back',
  description:
    'Calculate your Bybit Debit Card rewards. Estimate cashback earnings across spending tiers, referral bonuses, and conversion fees. Earn USDT on every purchase.',
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://www.syotoshi.com/bybit-card',
  },
  openGraph: {
    type: 'website',
    siteName: 'Bybit Card Cashback Calculator',
    title: 'Bybit Card Cashback Calculator — Earn Up to 8% Back',
    description:
      'Calculate your Bybit Debit Card rewards. Estimate cashback earnings across spending tiers, referral bonuses, and conversion fees. Earn USDT on every purchase.',
    url: 'https://www.syotoshi.com/bybit-card',
    images: [
      {
        url: 'https://www.syotoshi.com/bybit-card/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bybit Debit Card Cashback Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Bybit_Official',
    creator: '@SyotoshiX',
    title: 'Bybit Card Cashback Calculator — Earn Up to 8% Back',
    description:
      'Calculate your Bybit Debit Card rewards. Estimate cashback earnings across spending tiers, referral bonuses, and conversion fees. Earn USDT on every purchase.',
    images: ['https://www.syotoshi.com/bybit-card/og-image.png'],
  },
}

export default function BybitCardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Bybit Card Cashback Calculator',
            description:
              'Calculate your Bybit Debit Card rewards. Estimate cashback earnings across spending tiers, referral bonuses, and conversion fees. Earn USDT on every purchase.',
            url: 'https://www.syotoshi.com/bybit-card',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            image: 'https://www.syotoshi.com/bybit-card/og-image.png',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
      <BybitCardClient />
    </>
  )
}
