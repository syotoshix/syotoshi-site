import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Jupiter Card - Cashback Calculator',
    template: '%s | Syotoshi',
  },
  description: 'Calculate your cashback earnings with the Jupiter Global Visa Infinite card.',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="4ea69d7b-30e2-44e3-900e-c858899472af"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
