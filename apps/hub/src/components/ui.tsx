import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import s from './ui.module.css'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'small'
  full?: boolean
  /** Link internal (react-router) */
  to?: string
  /** Link eksternal — dipakai untuk keluar dari hub ke halaman produk */
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  full,
  to,
  href,
  type = 'button',
  disabled,
  onClick,
  className,
}: ButtonProps) {
  const cls = [s.button, s[variant], size === 'small' ? s.small : '', full ? s.full : '', className ?? ''].join(' ')
  if (href) {
    return (
      <a className={cls} href={href}>
        {children}
      </a>
    )
  }
  if (to) {
    return (
      <Link className={cls} to={to}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} type={type} disabled={disabled} onClick={onClick}>
      {children}
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

type BadgeProps = { children: ReactNode; tone?: 'sage' | 'amber' | 'rose' | 'plum' }

export function Badge({ children, tone = 'plum' }: BadgeProps) {
  return <span className={[s.badge, s[tone]].join(' ')}>{children}</span>
}
