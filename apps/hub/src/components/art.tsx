import type { CSSProperties, ReactNode } from 'react'
import type { ProductIcon as ProductIconName } from '../data/products'
import s from './art.module.css'

type FrameProps = {
  ratio?: 'wide' | 'hero' | 'teaser' | 'square'
  rounded?: boolean | 'lg'
  tone?: 'joy' | 'plain'
  className?: string
}

const ratioClass = { wide: s.ratioWide, hero: s.ratioHero, teaser: s.ratioTeaser, square: s.ratioSquare }

function frameClass({ ratio = 'wide', rounded, tone, className }: FrameProps) {
  return [
    s.frame,
    ratioClass[ratio],
    rounded === 'lg' ? s.roundedLg : rounded ? s.rounded : '',
    tone === 'joy' ? s.toneJoy : '',
    className ?? '',
  ].join(' ')
}

type GiftArtProps = FrameProps & {
  /** Animasi buka kotak + confetti. Mati otomatis bila prefers-reduced-motion. */
  animated?: boolean
  /** Catatan tulisan tangan yang menempel di ilustrasi */
  note?: ReactNode
}

/**
 * Ilustrasi kotak hadiah yang SEDANG TERBUKA: tutup terangkat, isi mengintip
 * (amplop, polaroid, kartu musik), confetti jatuh. Semua warna lewat token CSS.
 */
export function GiftArt({ animated = false, note, tone = 'joy', ...frame }: GiftArtProps) {
  return (
    <div className={frameClass({ ...frame, tone })}>
      <svg
        className={[s.gift, animated ? s.animated : ''].join(' ')}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Kotak hadiah terbuka berisi surat, foto polaroid, dan kartu musik"
      >
        {/* confetti */}
        <g className={s.confetti} aria-hidden="true">
          <rect
            className={`${s.c} ${s.cJoy}`}
            x="70"
            y="40"
            width="9"
            height="5"
            rx="1.5"
            style={{ '--d': '0s', '--x': '-10px' } as CSSProperties}
          />
          <circle className={`${s.c} ${s.cSun}`} cx="120" cy="22" r="4" style={{ '--d': '1.2s', '--x': '8px' } as CSSProperties} />
          <rect
            className={`${s.c} ${s.cSage}`}
            x="300"
            y="30"
            width="8"
            height="5"
            rx="1.5"
            style={{ '--d': '0.6s', '--x': '12px' } as CSSProperties}
          />
          <circle className={`${s.c} ${s.cRose}`} cx="335" cy="70" r="3.5" style={{ '--d': '2s', '--x': '-6px' } as CSSProperties} />
          <rect
            className={`${s.c} ${s.cSun}`}
            x="250"
            y="12"
            width="7"
            height="7"
            rx="1.5"
            style={{ '--d': '2.8s', '--x': '-14px' } as CSSProperties}
          />
          <circle className={`${s.c} ${s.cJoy}`} cx="60" cy="110" r="3" style={{ '--d': '3.4s', '--x': '10px' } as CSSProperties} />
          <rect
            className={`${s.c} ${s.cRose}`}
            x="160"
            y="8"
            width="8"
            height="4"
            rx="1.5"
            style={{ '--d': '4.1s', '--x': '6px' } as CSSProperties}
          />
          <circle className={`${s.c} ${s.cSky}`} cx="345" cy="140" r="3" style={{ '--d': '1.7s', '--x': '-8px' } as CSSProperties} />
        </g>

        {/* bayangan */}
        <ellipse className={s.shadow} cx="200" cy="268" rx="122" ry="13" />

        {/* isi yang mengintip (di belakang badan kotak) */}
        <g transform="translate(0 -18)">
          <g className={`${s.item} ${s.item1}`}>
            <g transform="rotate(-14 150 150)">
              <rect className={s.envelope} x="112" y="112" width="84" height="58" rx="4" />
              <path className={s.envelopeFlap} d="M112 116 L154 146 L196 116" />
              <circle className={s.seal} cx="154" cy="146" r="7" />
            </g>
          </g>
        </g>
        <g transform="translate(0 -22)">
          <g className={`${s.item} ${s.item2}`}>
            <g transform="rotate(8 230 140)">
              <rect className={s.polaroid} x="194" y="84" width="70" height="82" rx="3" />
              <rect className={s.photo} x="201" y="91" width="56" height="52" rx="2" />
              <circle className={s.photoSun} cx="242" cy="105" r="7" />
              <path className={s.photoHill} d="M201 143 L222 118 L236 131 L246 122 L257 143 Z" />
            </g>
          </g>
        </g>
        <g transform="translate(0 -14)">
          <g className={`${s.item} ${s.item3}`}>
            <g transform="rotate(18 272 160)">
              <rect className={s.music} x="246" y="124" width="56" height="44" rx="6" />
              <path className={s.note} d="M266 156 V136 L284 132 V150" />
              <circle className={s.note} cx="262" cy="156" r="4.5" />
              <circle className={s.note} cx="280" cy="150" r="4.5" />
            </g>
          </g>
        </g>

        {/* badan kotak */}
        <g>
          <rect className={s.boxBody} x="96" y="158" width="208" height="104" rx="10" />
          <rect className={s.boxFront} x="96" y="158" width="208" height="20" rx="6" />
          <rect className={s.ribbon} x="188" y="158" width="24" height="104" />
          <path className={s.boxShine} d="M110 176 Q140 172 150 250" />
        </g>

        {/* tutup terangkat + pita */}
        <g className={s.lid}>
          <rect className={s.lidTop} x="84" y="112" width="232" height="34" rx="8" />
          <rect className={s.ribbon} x="186" y="112" width="28" height="34" />
          <g className={s.bow}>
            <path className={s.bowLoop} d="M200 112 C170 78 140 96 160 114 C170 122 188 116 200 112 Z" />
            <path className={s.bowLoop} d="M200 112 C230 78 260 96 240 114 C230 122 212 116 200 112 Z" />
            <circle className={s.bowKnot} cx="200" cy="112" r="9" />
          </g>
        </g>
      </svg>
      {note && <div className={s.note2}>{note}</div>}
    </div>
  )
}

/** Ilustrasi kartu produk yang belum rilis: ikon garis satu warna di atas latar lembut. */
export function TeaserArt({ icon, color, ...frame }: FrameProps & { icon?: ProductIconName; color?: string }) {
  const style = { '--art-bg': color ?? 'var(--bg-paper)' } as CSSProperties
  return (
    <div className={frameClass({ ratio: 'teaser', ...frame, tone: 'plain' })} style={style} aria-hidden="true">
      <div className={s.iconWrap}>{icon ? <ProductIcon name={icon} /> : null}</div>
    </div>
  )
}

/** Ikon garis per produk. Satu warna (currentColor). */
export function ProductIcon({ name }: { name: ProductIconName }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: s.icon,
  }
  switch (name) {
    case 'ticket':
      return (
        <svg {...common}>
          <path d="M6 16a4 4 0 0 0 0 8v8h36v-8a4 4 0 0 1 0-8V8H6z" transform="translate(0 4)" />
          <path d="M30 12v28" strokeDasharray="3 3" />
          <path d="M14 22l3 3 6-6" />
        </svg>
      )
    case 'radio':
      return (
        <svg {...common}>
          <rect x="6" y="16" width="36" height="24" rx="4" />
          <circle cx="17" cy="28" r="6" />
          <path d="M29 24h8M29 29h8M29 34h5M14 16 34 6" />
        </svg>
      )
    case 'lock-envelope':
      return (
        <svg {...common}>
          <rect x="6" y="12" width="30" height="22" rx="3" />
          <path d="m6 14 15 11 15-11" />
          <rect x="30" y="28" width="12" height="11" rx="2" />
          <path d="M33 28v-3a3 3 0 0 1 6 0v3" />
        </svg>
      )
    case 'heart-plaster':
      return (
        <svg {...common}>
          <path d="M24 40S7 30 7 18a8.5 8.5 0 0 1 17-2 8.5 8.5 0 0 1 17 2c0 12-17 22-17 22z" />
          <rect x="16" y="20" width="16" height="8" rx="4" transform="rotate(-35 24 24)" />
          <path d="M23 23h.01M26 25h.01" />
        </svg>
      )
    case 'sprout':
      return (
        <svg {...common}>
          <path d="M24 42V22" />
          <path d="M24 26c0-8-6-12-14-12 0 8 6 12 14 12z" />
          <path d="M24 22c0-7 5-11 12-11 0 7-5 11-12 11z" />
          <path d="M14 42h20" />
        </svg>
      )
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="17" />
          <path d="m30 18-4 9-9 4 4-9z" />
          <path d="M24 7v3M24 38v3M7 24h3M38 24h3" />
        </svg>
      )
  }
}
