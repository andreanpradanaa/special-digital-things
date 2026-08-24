import type { CSSProperties } from 'react'
import type { SignalStatus } from './midnightRadioSignal.ts'

type RadioConsoleProps = {
  frequency: string
  time: string
  status: SignalStatus
  powered: boolean
  privateChannel?: boolean
  onAir?: boolean
  receivedCount: number
}

export function RadioConsole({
  frequency,
  time,
  status,
  powered,
  privateChannel = false,
  onAir = false,
  receivedCount,
}: RadioConsoleProps) {
  const needlePosition = privateChannel
    ? 82
    : Math.min(82, Math.max(8, ((Number(frequency.replace('.', '')) - 880) / 200) * 74 + 8))

  return (
    <div
      className="radio-console"
      data-powered={powered}
      data-status={status}
      data-private={privateChannel}
      style={{ '--needle-position': `${needlePosition}%` } as CSSProperties}
    >
      <svg className="radio-night-svg" viewBox="0 0 620 360" aria-hidden="true" focusable="false">
        <path d="M106 91 270 11" />
        <circle cx="273" cy="10" r="4" />
        <path d="M82 316h434" />
        <path d="M128 307v21m340-21v21" />
        <path d="M92 75h420" />
      </svg>
      <div className="radio-casing">
        <div className="radio-topline"><span>ANDRE’S NIGHT SERVICE</span><span>NO. 111</span></div>
        <div className="radio-window">
          <div className="window-header"><span>FM / PRIVATE</span><time>{time}</time></div>
          <div className="frequency-readout">{privateChannel ? 'PRIVATE 11:11' : `${frequency} FM`}</div>
          <div className="tuner-scale" aria-hidden="true"><span className="needle" /></div>
          <span className="window-status">{privateChannel ? 'PRIVATE CHANNEL' : status}</span>
        </div>
        <div className="radio-lamp" data-on={onAir}><span>ON AIR</span></div>
        <div className="speaker-grille" aria-hidden="true">{Array.from({ length: 24 }, (_, index) => <span key={index} />)}</div>
        <div className="radio-knobs" aria-hidden="true"><span /><span /><span /></div>
        <div className="radio-received" aria-label={`${receivedCount} dari 3 sinyal diterima`}>
          <span>RECEIVED</span>
          {[0, 1, 2].map((index) => <i data-received={index < receivedCount} key={index} />)}
        </div>
      </div>
    </div>
  )
}

export function Waveform({ active = false }: { active?: boolean }) {
  return <svg className="radio-waveform" viewBox="0 0 280 58" aria-hidden="true" focusable="false">
    <path d="M3 29h19l7-12 8 28 11-39 10 46 10-23 10 10h16l8-27 10 35 10-18 11 8h24l9-17 10 24 10-37 9 32 10-19 10 9h19l9-20 10 27 11-15 10 8h26" data-active={active} />
  </svg>
}
