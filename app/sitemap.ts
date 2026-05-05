import type { MetadataRoute } from 'next'

const BASE = 'https://www.syotoshi.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                      lastModified: new Date(), changeFrequency: 'monthly',  priority: 1.0 },
    { url: `${BASE}/bybit-card`,      lastModified: new Date(), changeFrequency: 'weekly',   priority: 0.9 },
    { url: `${BASE}/kast-card`,       lastModified: new Date(), changeFrequency: 'weekly',   priority: 0.9 },
    { url: `${BASE}/jupiter-card`,    lastModified: new Date(), changeFrequency: 'weekly',   priority: 0.9 },
  ]
}
