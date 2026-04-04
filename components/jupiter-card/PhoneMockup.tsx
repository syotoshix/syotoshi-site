'use client'

interface PhoneMockupProps {
  phoneTime: string
  phoneDate: string
  notifIcon: string
  notifMsg: string
  notifEarned: string
  purchaseIn: boolean
  cashbackIn: boolean
  activeExample: number
  onToggleTheme: () => void
  onOpenModal: () => void
}

export default function PhoneMockup({
  phoneTime,
  phoneDate,
  notifIcon,
  notifMsg,
  notifEarned,
  purchaseIn,
  cashbackIn,
  activeExample,
  onToggleTheme,
  onOpenModal,
}: PhoneMockupProps) {
  return (
    <div className="phone">
      <div className="ph-screen" />
      <div className="ph-bezel" />
      <div className="ph-notch" />
      <div className="ph-status">
        <span>{phoneTime}</span>
        <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <svg className="ph-icon-svg" width={11} height={7} viewBox="0 0 12 8">
            <rect x={0} y={3} width={2} height={5} rx={1} />
            <rect x={3} y={2} width={2} height={6} rx={1} />
            <rect x={6} y={1} width={2} height={7} rx={1} />
            <rect x={9} y={0} width={2} height={8} rx={1} opacity={0.3} />
          </svg>
          <svg className="ph-icon-svg" width={11} height={7} viewBox="0 0 12 8" fill="none">
            <rect x={0.5} y={0.5} width={9} height={7} rx={1.5} stroke="currentColor" />
            <rect x={2} y={2} width={5.5} height={4} rx={0.5} fill="currentColor" />
            <rect x={10} y={2.5} width={1.5} height={3} rx={0.75} fill="currentColor" opacity={0.5} />
          </svg>
        </span>
      </div>
      <div className="ph-time">
        <div className="t">{phoneTime}</div>
        <div className="d">{phoneDate}</div>
      </div>
      <div className="ph-notifs">
        <div className={`pn${purchaseIn ? ' in' : ''}`}>
          <div className="pn-icon">{notifIcon}</div>
          <div className="pn-body">
            <div className="pn-app">Jupiter Mobile</div>
            <div
              className="pn-msg"
              dangerouslySetInnerHTML={{ __html: notifMsg }}
            />
          </div>
          <div className="pn-t">1 min</div>
        </div>
        <div className={`pn${cashbackIn ? ' in' : ''}`}>
          <div className="pn-icon">💸</div>
          <div className="pn-body">
            <div className="pn-app">Jupiter Mobile</div>
            <div className="pn-msg">
              You just earned <span className="hi">{notifEarned}</span> back 💸
            </div>
          </div>
          <div className="pn-t">now</div>
        </div>
      </div>
      <div className="ph-dots">
        <span className={`ph-dot${activeExample === 0 ? ' on' : ''}`} />
        <span className={`ph-dot${activeExample === 1 ? ' on' : ''}`} />
        <span className={`ph-dot${activeExample === 2 ? ' on' : ''}`} />
      </div>
      <div className="ph-btns">
        <div className="ph-btn" onClick={onToggleTheme} title="Toggle light/dark">🔦</div>
        <div className="ph-btn" onClick={onOpenModal} title="Get the Card">💳</div>
      </div>
    </div>
  )
}
