import { useEffect, useState } from 'react'
import { fetchGift } from '../api'
import { RecipientView } from './RecipientView'
import type { GoodieBoxBuilderState } from './types'

type GiftState =
  | { status: 'loading' }
  | { status: 'locked' }
  | { status: 'notfound' }
  | { status: 'error'; message: string }
  | { status: 'ready'; state: GoodieBoxBuilderState }

// Halaman publik penerima (/gift/:slug). Isi box baru bisa dibuka
// setelah pembayaran dinyatakan lunas oleh server (403 GIFT_LOCKED).
export function GiftPage({ slug }: { slug: string }) {
  const [gift, setGift] = useState<GiftState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setGift({ status: 'loading' })
    fetchGift(slug)
      .then((state) => { if (!cancelled) setGift({ status: 'ready', state }) })
      .catch((error: { code: number; message: string }) => {
        if (cancelled) return
        if (error.code === 403) setGift({ status: 'locked' })
        else if (error.code === 404) setGift({ status: 'notfound' })
        else setGift({ status: 'error', message: error.message })
      })
    return () => { cancelled = true }
  }, [slug])

  return <main className="gift-preview-page">
    {gift.status === 'loading' && <p className="gift-page-note">Menyiapkan kejutan…</p>}
    {gift.status === 'locked' && <div className="gift-page-card"><h1>Belum bisa dibuka</h1><p>Gift ini terkunci sampai pembayarannya selesai. Coba lagi nanti, ya.</p></div>}
    {gift.status === 'notfound' && <div className="gift-page-card"><h1>Gift tidak ditemukan</h1><p>Tautan ini tidak valid atau sudah dihapus.</p></div>}
    {gift.status === 'error' && <div className="gift-page-card"><h1>Terjadi kendala</h1><p>{gift.message}</p></div>}
    {gift.status === 'ready' && <RecipientView state={gift.state} />}
  </main>
}
