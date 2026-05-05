import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const currency = req.nextUrl.searchParams.get('currency')
  if (!currency || !/^[A-Z]{3}$/.test(currency)) {
    return NextResponse.json({ error: 'Invalid currency' }, { status: 400 })
  }

  try {
    const res = await fetch('https://www.bybit.eu/x-api/fiat/card/info/v1/card/markup', {
      method: 'POST',
      headers: {
        accept:           'application/json',
        'accept-language':'en-EU',
        'content-type':   'application/json',
        lang:             'en-EU',
        platform:         'pc',
        guid:             '2740a06e-deeb-7226-f26d-8c26895b6962',
      },
      body: JSON.stringify({ cardCurrency: 'EUR', txnCurrency: currency }),
      // Don't cache at the fetch level; Next.js route segment config handles that
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ error: `upstream_${res.status}` }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 502 })
  }
}
