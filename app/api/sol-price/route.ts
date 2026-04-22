import { NextResponse } from 'next/server'

export const revalidate = 60 // cache for 60 seconds

export async function GET() {
  const apiKey = process.env.COINGECKO_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
  }

  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=solana',
      {
        headers: { 'x-cg-demo-api-key': apiKey },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      throw new Error(`CoinGecko responded with ${res.status}`)
    }

    const data = await res.json()
    const price: number | undefined = data?.solana?.usd

    if (price === undefined) {
      throw new Error('Unexpected response shape')
    }

    return NextResponse.json({ price })
  } catch (err) {
    console.error('[sol-price]', err)
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 502 })
  }
}
