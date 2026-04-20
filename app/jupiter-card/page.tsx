import type { Metadata } from 'next'
import JupiterCardClient from '@/components/jupiter-card/JupiterCardClient'

export const metadata: Metadata = {
  title: 'Jupiter Global Visa Card Cashback Calculator — Earn Up to 10% Back',
  description:
    'Calculate your Jupiter Global Visa Infinite card rewards. Estimate cashback earnings across spending tiers, referral bonuses, and cross-border fees. Powered by Solana.',
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://www.syotoshi.com/jupiter-card',
  },
  openGraph: {
    type: 'website',
    siteName: 'Jupiter Global Visa Card Cashback Calculator',
    title: 'Jupiter Global Visa Card Cashback Calculator — Earn Up to 10% Back',
    description:
      'Calculate your Jupiter Global Visa Infinite card rewards. Estimate cashback earnings across spending tiers, referral bonuses, and cross-border fees. Powered by Solana.',
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
    creator: '@SyotoshiX',
    title: 'Jupiter Global Visa Card Cashback Calculator — Earn Up to 10% Back',
    description:
      'Calculate your Jupiter Global Visa Infinite card rewards. Estimate cashback earnings across spending tiers, referral bonuses, and cross-border fees. Powered by Solana.',
    images: ['https://www.syotoshi.com/jupiter-card/og-image.png'],
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
            name: 'Jupiter Global Visa Card Cashback Calculator',
            description:
              'Calculate your Jupiter Global Visa Infinite card rewards. Estimate cashback earnings across spending tiers, referral bonuses, and cross-border fees. Powered by Solana.',
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
