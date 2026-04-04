import type { Metadata } from 'next'
import JupiterCardClient from '@/components/jupiter-card/JupiterCardClient'

export const metadata: Metadata = {
  title: 'Jupiter Card - Cashback Calculator',
  description:
    'Calculate your cashback earnings with the Jupiter Global Visa Infinite card. Estimate rewards across spending tiers, referral bonuses, and cross-border fees.',
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://www.syotoshi.com/jupiter-card',
  },
  openGraph: {
    type: 'website',
    siteName: 'Jupiter Card Calculator',
    title: 'Jupiter Card - Cashback Calculator',
    description:
      'Calculate your cashback earnings with the Jupiter Global Visa Infinite card. Estimate rewards across spending tiers, referral bonuses, and cross-border fees.',
    url: 'https://www.syotoshi.com/jupiter-card',
    images: [
      {
        url: 'https://www.syotoshi.com/jupiter-card/og-image.png',
        width: 1200,
        height: 900,
        alt: 'Jupiter Global Visa Infinite Card',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@JupiterExchange',
    title: 'Jupiter Card - Cashback Calculator',
    description:
      'Calculate your cashback earnings with the Jupiter Global Visa Infinite card. Estimate rewards across spending tiers, referral bonuses, and cross-border fees.',
    images: ['https://www.syotoshi.com/jupiter-card/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/jupiter-card/favicon/favicon.ico', type: 'image/x-icon' },
      { url: '/jupiter-card/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/jupiter-card/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/jupiter-card/favicon/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
}

export default function JupiterCardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Jupiter Card Cashback Calculator',
            description:
              'Calculate your cashback earnings with the Jupiter Global Visa Infinite card. Estimate rewards across spending tiers, referral bonuses, and cross-border fees.',
            url: 'https://www.syotoshi.com/jupiter-card',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            image: 'https://www.syotoshi.com/jupiter-card/og-image.png',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
      <JupiterCardClient />
    </>
  )
}
