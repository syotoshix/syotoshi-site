import type { Metadata } from 'next'
import KastCardClient from '@/components/kast-card/KastCardClient'

export const metadata: Metadata = {
  title: 'KAST Visa Card Cashback Calculator — Earn Up to 12% Back',
  description:
    'Calculate your KAST Visa card rewards. Earn KAST Points + $MOVE tokens on every purchase — up to 12% cashback across Standard, Premium, and Luxe tiers. 170+ countries, live MOVE price.',
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://www.syotoshi.com/kast-card',
  },
  openGraph: {
    type: 'website',
    siteName: 'KAST Visa Card Cashback Calculator',
    title: 'KAST Visa Card Cashback Calculator — Earn Up to 12% Back',
    description:
      'Calculate your KAST Visa card rewards. Earn KAST Points + $MOVE tokens on every purchase — up to 12% cashback across Standard, Premium, and Luxe tiers. 170+ countries, live MOVE price.',
    url: 'https://www.syotoshi.com/kast-card',
    images: [
      {
        url: 'https://www.syotoshi.com/kast-card/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KAST Visa Card Cashback Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@KastApp',
    creator: '@SyotoshiX',
    title: 'KAST Visa Card Cashback Calculator — Earn Up to 12% Back',
    description:
      'Calculate your KAST Visa card rewards. Earn KAST Points + $MOVE tokens on every purchase — up to 12% cashback across Standard, Premium, and Luxe tiers. 170+ countries, live MOVE price.',
    images: ['https://www.syotoshi.com/kast-card/og-image.png'],
  },
}

export default function KastCardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'KAST Visa Card Cashback Calculator',
            description:
              'Calculate your KAST Visa card rewards. Earn KAST Points + $MOVE tokens on every purchase — up to 12% cashback across Standard, Premium, and Luxe tiers. 170+ countries, live MOVE price.',
            url: 'https://www.syotoshi.com/kast-card',
            image: 'https://www.syotoshi.com/kast-card/og-image.png',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
      <KastCardClient />
    </>
  )
}
