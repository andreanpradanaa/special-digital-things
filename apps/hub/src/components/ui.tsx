import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import s from './ui.module.css'

type ButtonProps = {
  children: ReactNode
  /** joy = CTA ceria (Goodiebox), primary = terakota, secondary = garis, ghost = teks */
  variant?: 'joy' | 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'small' | 'large'
  full?: boolean
  /** Tambahkan panah "→" yang bergeser saat hover (dekoratif, tidak dibacakan) */
  arrow?: boolean
  /** Link internal (react-router) */
  to?: string
  /** Link eksternal — dipakai untuk keluar dari hub ke halaman produk */
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

const sizeClass = { default: '', small: s.small, large: s.large }

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  full,
  arrow,
  to,
  href,
  type = 'button',
  disabled,
  onClick,
  className,
}: ButtonProps) {
  const cls = [s.button, s[variant], sizeClass[size], full ? s.full : '', className ?? ''].join(' ')
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className={s.arrow} aria-hidden="true">
          →
        </span>
      )}
    </>
  )
  if (href) {
    return (
      <a className={cls} href={href}>
        {content}
      </a>
    )
  }
  if (to) {
    return (
      <Link className={cls} to={to}>
        {content}
      </Link>
    )
  }
  return (
    <button className={cls} type={type} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  )
}

type ChipProps = { children: ReactNode; active?: boolean; to?: string }

export function Chip({ children, active, to }: ChipProps) {
  const cls = [s.chip, active ? s.chipActive : '', to ? s.chipLink : ''].join(' ')
  if (to) {
    return (
      <Link className={cls} to={to} aria-current={active ? 'page' : undefined}>
        {children}
      </Link>
    )
  }
  return <span className={cls}>{children}</span>
}

type BadgeProps = { children: ReactNode; tone?: 'joy' | 'sage' | 'amber' | 'rose' | 'plum' }

export function Badge({ children, tone = 'plum' }: BadgeProps) {
  return <span className={[s.badge, s[tone]].join(' ')}>{children}</span>
}
