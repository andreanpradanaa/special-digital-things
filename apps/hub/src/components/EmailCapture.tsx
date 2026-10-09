import { useId, useState, type FormEvent } from 'react'
import { isValidEmail, subscribe } from '../lib/waitlist'
import { Button } from './ui'
import s from './EmailCapture.module.css'

type Props = {
  productSlug: string
  productName: string
  /** Versi ringkas untuk kartu di katalog */
  compact?: boolean
  showLabel?: boolean
  showHint?: boolean
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function EmailCapture({ productSlug, productName, compact, showLabel = !compact, showHint = !compact }: Props) {
  const inputId = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Masukkan alamat email yang valid.')
      return
    }
    setError(null)
    setStatus('loading')
    try {
      await subscribe(email.trim(), productSlug)
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Belum berhasil. Coba lagi sebentar.')
    }
  }

  if (status === 'success') {
    return (
      <div className={[s.form, compact ? s.compact : ''].join(' ')} role="status">
        <div className={s.success}>
          <span className={s.successTitle}>✓ Kamu akan kami kabari</span>
          <span className={s.successBody}>
            Email terkirim ke {email.trim()} saat {productName} rilis.
          </span>
        </div>
      </div>
    )
  }

  return (
    <form className={[s.form, compact ? s.compact : ''].join(' ')} onSubmit={onSubmit} noValidate>
      {showLabel && (
        <label className={s.label} htmlFor={inputId}>
          Kabari saya kalau sudah siap
        </label>
      )}
      <div className={s.row}>
        <input
          id={inputId}
          className={s.input}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email kamu"
          aria-label={showLabel ? undefined : `Email untuk kabar rilis ${productName}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
        />
        <Button
          type="submit"
          variant={compact ? 'secondary' : 'primary'}
          size={compact ? 'small' : 'default'}
          full={!compact}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Mengirim…' : 'Kabari saya'}
        </Button>
      </div>
      {error && <p className={s.error}>{error}</p>}
      {showHint && <p className={s.hint}>Kami cuma kirim satu email saat produk ini rilis. Tanpa spam.</p>}
    </form>
  )
}
