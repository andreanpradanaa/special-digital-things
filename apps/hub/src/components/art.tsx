import type { CSSProperties } from 'react'
import s from './art.module.css'

type ArtProps = {
  color?: string
  ratio?: 'wide' | 'hero' | 'teaser'
  rounded?: boolean | 'lg'
  className?: string
}

const ratioClass = { wide: s.ratioWide, hero: s.ratioHero, teaser: s.ratioTeaser }

function frameClass({ ratio = 'wide', rounded, className }: ArtProps) {
  return [s.frame, ratioClass[ratio], rounded === 'lg' ? s.roundedLg : rounded ? s.rounded : '', className ?? ''].join(' ')
}

/** Ilustrasi placeholder kotak hadiah. Nanti diganti render 3D Goodiebox asli. */
export function GiftArt(props: ArtProps) {
  const style = { '--art-bg': props.color ?? '#f2d9cd' } as CSSProperties
  return (
    <div className={frameClass(props)} style={style} aria-hidden="true">
      <svg viewBox="0 0 390 200" preserveAspectRatio="xMidYMid meet">
        <ellipse cx="195" cy="156" rx="118" ry="14" fill="#44394a" opacity="0.12" />
        <rect x="105" y="84" width="180" height="68" rx="6" fill="#e8b7a3" />
        <rect x="94" y="68" width="202" height="22" rx="6" fill="#d99a82" />
        <rect x="184" y="68" width="22" height="84" fill="#c4603a" />
        <ellipse cx="172" cy="60" rx="20" ry="11" fill="#c4603a" />
        <ellipse cx="218" cy="60" rx="20" ry="11" fill="#c4603a" />
        <circle cx="195" cy="62" r="7" fill="#a84e2c" />
      </svg>
    </div>
  )
}

/** Ilustrasi placeholder untuk produk yang belum rilis. */
export function TeaserArt(props: ArtProps) {
  const style = { '--art-bg': props.color ?? '#e4e6d9' } as CSSProperties
  return (
    <div className={frameClass({ ratio: 'teaser', ...props })} style={style} aria-hidden="true">
      <svg viewBox="0 0 390 260" preserveAspectRatio="xMidYMid meet">
        <circle cx="195" cy="130" r="64" fill="#ffffff" opacity="0.55" />
        <circle cx="236" cy="104" r="22" fill="#ffffff" opacity="0.35" />
      </svg>
    </div>
  )
}
