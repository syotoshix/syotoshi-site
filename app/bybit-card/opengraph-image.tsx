import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

const TIERS = [
  { name: 'Base',     rate: '2%'  },
  { name: 'Alpha',    rate: '4%'  },
  { name: 'Omega',    rate: '8%'  },
  { name: 'Infinite', rate: '10%' },
]

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          background: '#0e0800',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: -180, left: -80, width: 650, height: 650, borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,166,0,.18) 0%, transparent 65%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -200, right: -50, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,166,0,.07) 0%, transparent 65%)', display: 'flex' }} />

        {/* ── Left: Card visual ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 520, height: 630, paddingLeft: 72, flexShrink: 0 }}>
          <div style={{
            width: 345, height: 217,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #eaeaea 50%, #dcdcdc 100%)',
            borderRadius: 22,
            border: '1px solid rgba(247,166,0,.3)',
            boxShadow: '0 28px 80px rgba(0,0,0,.75), 0 0 0 1px rgba(247,166,0,.12)',
            position: 'relative',
            display: 'flex',
            overflow: 'hidden',
          }}>
            {/* Wave arcs */}
            <div style={{ position: 'absolute', bottom: -36, left: -12,  width: 235, height: 235, borderRadius: '50%', border: '1px solid rgba(150,150,150,.3)',  display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: -62, left:  34,  width: 290, height: 290, borderRadius: '50%', border: '1px solid rgba(150,150,150,.22)', display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: -92, left:  78,  width: 348, height: 348, borderRadius: '50%', border: '1px solid rgba(150,150,150,.15)', display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: -124, left: 124, width: 405, height: 405, borderRadius: '50%', border: '1px solid rgba(150,150,150,.09)', display: 'flex' }} />

            {/* BYBIT logo — top left */}
            <div style={{ position: 'absolute', top: 17, left: 17, display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a', letterSpacing: -0.5 }}>BYB</span>
              <div style={{ width: 3.5, height: 20, background: '#f7a600', borderRadius: 2, margin: '0 2px', display: 'flex' }} />
              <span style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a', letterSpacing: -0.5 }}>T</span>
              <span style={{ fontWeight: 700, fontSize: 10, color: 'rgba(0,0,0,.3)', marginLeft: 5 }}>EU</span>
            </div>

            {/* Stars — bottom left */}
            <div style={{ position: 'absolute', bottom: 16, left: 17, display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0,1,2,3].map(i => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24">
                  <path fill="rgba(0,0,0,.22)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>

            {/* Debit + Mastercard — bottom right */}
            <div style={{ position: 'absolute', bottom: 14, right: 17, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1.2 }}>Debit</span>
              <div style={{ display: 'flex' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EB001B', display: 'flex' }} />
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F79E1B', display: 'flex', marginLeft: -14 }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Text ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 80, paddingLeft: 16 }}>

          {/* Badge */}
          <div style={{ display: 'flex', marginBottom: 22 }}>
            <div style={{ background: 'rgba(247,166,0,.13)', border: '1px solid rgba(247,166,0,.28)', borderRadius: 99, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#f7a600', letterSpacing: 1.6, textTransform: 'uppercase', display: 'flex' }}>
              Free Calculator
            </div>
          </div>

          {/* BYBIT wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontWeight: 800, fontSize: 42, color: '#ffffff', letterSpacing: -1.5 }}>BYB</span>
            <div style={{ width: 7, height: 42, background: '#f7a600', borderRadius: 3, margin: '0 3.5px', display: 'flex' }} />
            <span style={{ fontWeight: 800, fontSize: 42, color: '#ffffff', letterSpacing: -1.5 }}>T</span>
            <span style={{ fontWeight: 500, fontSize: 24, color: '#a8bdd4', marginLeft: 12 }}>Card</span>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 18 }}>
            <span style={{ fontSize: 54, fontWeight: 900, color: '#ffffff', letterSpacing: -2, lineHeight: 1.05 }}>Cashback</span>
            <span style={{ fontSize: 54, fontWeight: 900, color: '#ffffff', letterSpacing: -2, lineHeight: 1.05 }}>Calculator</span>
          </div>

          {/* Sub */}
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 21, color: '#a8bdd4', marginBottom: 30 }}>
            <span>Earn up to</span>
            <span style={{ color: '#f7a600', fontWeight: 800, margin: '0 7px' }}>10% back</span>
            <span>in USDT</span>
          </div>

          {/* Tier chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {TIERS.map(t => (
              <div key={t.name} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '6px 13px', display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#a8bdd4' }}>{t.name}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#f7a600' }}>{t.rate}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: '#5d7a96' }}>
            <span>EU &amp; Global</span>
            <span style={{ color: 'rgba(255,255,255,.15)' }}>·</span>
            <span>syotoshi.com</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
