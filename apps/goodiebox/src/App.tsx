import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { BuilderPanel } from './goodiebox/BuilderPanel'
import { GiftPage } from './goodiebox/GiftPage'
import { RecipientView } from './goodiebox/RecipientView'
import { createGiftItem } from './goodiebox/itemCatalog'
import { GoodieBoxScene } from './goodiebox/GoodieBoxScene'
import type { GiftItemData, GiftItemType, GoodieBoxBuilderState } from './goodiebox/types'
import { getAdaptiveBackdrop } from './goodiebox/boxAppearance'
import { createOrder, getOrderStatus, uploadAsset, type CheckoutState, type OrderCreateResponse } from './api'
import { payWithSnap } from './midtransSnap'
import './styles.css'

const initialBuilder: GoodieBoxBuilderState = {
  recipientName: '', senderName: '', mood: 'warm', innerNote: '', boxColor: '#D3C3B8', boxTheme: 'polkadot', items: [],
}

// Interval polling status pembayaran setelah Snap melaporkan sukses:
// webhook Midtrans bisa menyusul beberapa detik di belakang callback.
const VERIFY_ATTEMPTS = 12
const VERIFY_INTERVAL_MS = 1000
const PAYING_POLL_INTERVAL_MS = 2000

export default function App() {
  const [open, setOpen] = useState(false)
  const [previewPage, setPreviewPage] = useState(false)
  // previewed/agreed hidup di App: BuilderPanel ikut unmount selama preview.
  const [previewed, setPreviewed] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [builder, setBuilder] = useState<GoodieBoxBuilderState>(initialBuilder)
  const [checkout, setCheckout] = useState<CheckoutState>({ status: 'idle' })
  const updateBuilder = (patch: Partial<GoodieBoxBuilderState>) => setBuilder((current) => ({ ...current, ...patch }))
  const addItem = (type: GiftItemType): GiftItemData | null => {
    if (builder.items.length >= 6 || builder.items.some((item) => item.type === type)) return null
    const newItem = createGiftItem(type)
    setBuilder((current) => current.items.length >= 6 || current.items.some((item) => item.type === type) ? current : { ...current, items: [...current.items, newItem] })
    setOpen(true)
    return newItem
  }
  const removeItem = (id: string) => setBuilder((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }))
  const updateItem = (nextItem: GiftItemData) => setBuilder((current) => ({ ...current, items: current.items.map((item) => item.id === nextItem.id ? nextItem : item) }))
  const backdropStyle = getAdaptiveBackdrop(builder.boxColor) as CSSProperties

  // Halaman publik penerima: /gift/:slug (aktif setelah order paid di server).
  const giftSlug = window.location.pathname.match(/^\/gift\/([a-z0-9]+)\/?$/i)?.[1]
  if (giftSlug) return <GiftPage slug={giftSlug} />

  // Setelah Snap melaporkan sukses, polling status order sampai webhook
  // Midtrans diproses server; gagal tercapai → status pending manual.
  const verifyPayment = async (orderCode: string, slug: string) => {
    setCheckout({ status: 'verifying' })
    for (let attempt = 0; attempt < VERIFY_ATTEMPTS; attempt++) {
      try {
        const status = await getOrderStatus(orderCode)
        if (status.payment_status === 'success') {
          setCheckout({ status: 'success', giftUrl: `${window.location.origin}/gift/${slug}` })
          return
        }
      } catch { /* server belum memproses webhook — coba lagi */ }
      await new Promise((resolve) => setTimeout(resolve, VERIFY_INTERVAL_MS))
    }
    setCheckout({ status: 'pending', orderCode, slug })
  }

  // Jaring pengaman saat menunggu pembayaran: callback Snap bisa terlewat
  // (popup ditutup, callback gagal), jadi status order juga dipoll langsung.
  useEffect(() => {
    if (checkout.status !== 'paying') return
    const { orderCode, slug } = checkout
    const timer = window.setInterval(() => {
      void (async () => {
        try {
          const status = await getOrderStatus(orderCode)
          if (status.payment_status === 'success') {
            setCheckout({ status: 'success', giftUrl: `${window.location.origin}/gift/${slug}` })
          }
        } catch { /* server sesaat tidak terjangkau — coba lagi */ }
      })()
    }, PAYING_POLL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [checkout])

  // Convert data URI (base64) ke Blob untuk upload.
  const dataURItoBlob = (dataURI: string): Blob => {
    const arr = dataURI.split(',')
    const mime = (arr[0].match(/:(.*?);/) || [])[1] || 'application/octet-stream'
    const bstr = atob(arr[1])
    const bytes = new Uint8Array(bstr.length)
    for (let i = 0; i < bstr.length; i++) bytes[i] = bstr.charCodeAt(i)
    return new Blob([bytes], { type: mime })
  }

  // Upload semua assets (photo/video) dari items sebelum create order.
  const uploadAssets = async (items: GiftItemData[]): Promise<GiftItemData[]> => {
    const updated = await Promise.all(items.map(async (item) => {
      try {
        if (item.type === 'photo' && item.imageUrl?.startsWith('data:')) {
          const blob = dataURItoBlob(item.imageUrl)
          const url = await uploadAsset(blob, item.id, 'photo')
          return { ...item, imageUrl: url }
        }
        if (item.type === 'video' && item.videoUrl?.startsWith('data:')) {
          const blob = dataURItoBlob(item.videoUrl)
          const url = await uploadAsset(blob, item.id, 'video')
          return { ...item, videoUrl: url }
        }
      } catch (error) {
        throw new Error(`Gagal upload ${item.type === 'photo' ? 'foto' : 'video'} "${item.title}": ${(error as { message: string }).message}`)
      }
      return item
    }))
    return updated
  }

  const handleCheckout = async (email: string) => {
    setCheckout({ status: 'creating' })
    let order: OrderCreateResponse
    try {
      const itemsWithAssets = await uploadAssets(builder.items)
      const builderWithAssets = { ...builder, items: itemsWithAssets }
      order = await createOrder(builderWithAssets, email)
    } catch (error) {
      setCheckout({ status: 'error', message: (error as { message: string }).message })
      return
    }
    setCheckout({ status: 'paying', orderCode: order.order_code, slug: order.public_slug })
    try {
      await payWithSnap({
        token: order.snap_token,
        clientKey: order.client_key,
        onSuccess: () => { void verifyPayment(order.order_code, order.public_slug) },
        onPending: () => setCheckout({ status: 'pending', orderCode: order.order_code, slug: order.public_slug }),
        onError: () => setCheckout({ status: 'error', message: 'Pembayaran gagal diproses Midtrans. Coba lagi.' }),
        // Popup ditutup tanpa bayar: reset hanya jika belum lanjut ke verifikasi.
        onClose: () => setCheckout((current) => current.status === 'paying' ? { status: 'idle' } : current),
      })
    } catch (error) {
      setCheckout({ status: 'error', message: error instanceof Error ? error.message : 'Gagal membuka Midtrans Snap.' })
    }
  }

  const handleRetryCheck = () => {
    if (checkout.status === 'pending') void verifyPayment(checkout.orderCode, checkout.slug)
  }

  if (previewPage) {
    return <main className="gift-preview-page" style={backdropStyle}>
      <RecipientView state={builder} onBack={() => { setPreviewPage(false); setOpen(false) }} />
    </main>
  }
  return <main className="goodiebox-demo" style={backdropStyle}>
    <div className="goodiebox-workspace">
      <header className="builder-mobile-header">
        <h1>Lengkapi kotakmu</h1>
        <p>Pilih kenangan kecil yang ingin kamu sisipkan.</p>
      </header>
      <div className="scene-frame" aria-label="Interactive 3D premium gift box">
        <GoodieBoxScene theme={builder.boxTheme} color={builder.boxColor} open={open} items={builder.items} recipientName={builder.recipientName} innerNote={builder.innerNote} onToggle={() => setOpen((value) => !value)} />
      </div>
      <BuilderPanel builder={builder} onChange={updateBuilder} onAdd={addItem} onRemove={removeItem} onUpdateItem={updateItem} onPreview={() => { setOpen(false); setPreviewed(true); setAgreed(false); setPreviewPage(true) }} checkout={checkout} onCheckout={handleCheckout} onRetryCheck={handleRetryCheck} previewed={previewed} agreed={agreed} onAgree={() => setAgreed(true)} />
    </div>
  </main>
}
