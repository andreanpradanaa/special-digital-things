import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { BoxColorSelector } from './BoxColorSelector'
import { availableItems, getItemSummary } from './itemCatalog'
import type { AudioGiftItem, GiftItemData, GiftItemType, GiftMood, GoodieBoxBuilderState, VideoGiftItem } from './types'
import type { CheckoutState } from '../api'

const MAX_VIDEO_SECONDS = 30
const MAX_VIDEO_BYTES = 20 * 1024 * 1024
const PHOTO_MAX_DIMENSION = 1600
const PHOTO_QUALITY = 0.82

// Resize + convert foto ke WebP di browser (canvas) supaya ukuran yang dikirim
// ke server jauh lebih kecil daripada file asli dari kamera.
async function toWebpDataUrl(file: File, maxDimension: number, quality: number): Promise<string> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return canvas.toDataURL('image/webp', quality)
}

// Kolom wajib yang masih kosong — dasar peringatan "wajib diisi".
// Kolom di luar daftar ini dianggap opsional (tanda tangan, caption, kode, dst.).
function getMissingFields(item: GiftItemData): string[] {
  switch (item.type) {
    case 'letter': return item.message.trim() ? [] : ['message']
    case 'photo': return item.imageUrl ? [] : ['imageUrl']
    case 'music': return item.url.trim() ? [] : ['url']
    case 'voucher': return item.description.trim() ? [] : ['description']
    case 'audio': return item.audioUrl ? [] : ['audioUrl']
    case 'video': return item.videoUrl || item.url.trim() ? [] : ['url']
  }
}

function TextField({ label, value, onChange, placeholder, maxLength = 60, required, error }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; maxLength?: number; required?: boolean; error?: boolean }) {
  return <label className="builder-field"><span>{label}{required ? ' *' : ''}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} className={error ? 'input-error' : undefined} />{error && <small className="field-error">Wajib diisi</small>}</label>
}

function TextAreaField({ label, value, onChange, placeholder, maxLength, required, error }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; maxLength?: number; required?: boolean; error?: boolean }) {
  return <label className="builder-field"><span>{label}{required ? ' *' : ''}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} rows={4} className={error ? 'input-error' : undefined} />{error && <small className="field-error">Wajib diisi</small>}{maxLength && <small>{value.length} / {maxLength}</small>}</label>
}

// Editor voice note: rekam dari mikrofon atau unggah file; pemutar di preview
// membaca audioUrl + duration yang dihasilkan di sini.
function AudioEditor({ item, onUpdate, submitted }: { item: AudioGiftItem; onUpdate: (item: GiftItemData) => void; submitted: boolean }) {
  // Simpan referensi terbaru agar callback MediaRecorder tidak memakai state basi.
  const latest = useRef({ item, onUpdate })
  latest.current = { item, onUpdate }
  const update = (patch: Partial<AudioGiftItem>) => onUpdate({ ...latest.current.item, ...patch } as GiftItemData)

  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [micError, setMicError] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const secondsRef = useRef(0)
  const tickRef = useRef<number | null>(null)

  const stopTimer = () => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current)
      tickRef.current = null
    }
  }

  // Lepaskan mikrofon bila editor ditutup saat masih merekam.
  useEffect(() => () => {
    stopTimer()
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    recorderRef.current?.stream.getTracks().forEach((track) => track.stop())
  }, [])

  const formatDuration = (total: number) => `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`

  const startRecording = async () => {
    setMicError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((type) => MediaRecorder.isTypeSupported(type))
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []
      secondsRef.current = 0
      setElapsed(0)
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        update({ audioUrl: URL.createObjectURL(blob), duration: `${formatDuration(secondsRef.current)} detik` })
      }
      recorder.start()
      recorderRef.current = recorder
      tickRef.current = window.setInterval(() => {
        secondsRef.current += 1
        setElapsed(secondsRef.current)
      }, 1000)
      setRecording(true)
    } catch {
      setMicError('Mikrofon tidak bisa diakses — cek izin browser, atau unggah file saja.')
    }
  }

  const stopRecording = () => {
    stopTimer()
    recorderRef.current?.stop()
    setRecording(false)
  }

  const chooseAudio = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const audioUrl = URL.createObjectURL(file)
    const audio = document.createElement('audio')
    audio.onloadedmetadata = () => {
      // Webm hasil perekam bisa tanpa header durasi — biarkan kosong daripada "Infinity:NaN".
      if (isFinite(audio.duration)) update({ duration: `${formatDuration(Math.round(audio.duration))} detik` })
    }
    audio.src = audioUrl
    update({ audioUrl })
  }

  const missingAudio = submitted && !item.audioUrl
  return <div className="item-editor">
    <TextField label="Judul" value={item.title} onChange={(title) => update({ title })} placeholder="Pesan suara untukmu" />
    {!recording
      ? <button type="button" className={`record-button${missingAudio ? ' record-button--error' : ''}`} onClick={startRecording}><span className="record-button__dot" aria-hidden="true" />Rekam suara</button>
      : <button type="button" className="record-button record-button--active" onClick={stopRecording}><span className="record-button__dot" aria-hidden="true" />Berhenti · {formatDuration(elapsed)}</button>}
    {recording && <p className="record-note">Sedang merekam dari mikrofon…</p>}
    {micError && <p className="file-summary">{micError}</p>}
    <label className="builder-field"><span>Audio (opsional)</span><input className={`file-input${missingAudio ? ' file-input--error' : ''}`} type="file" accept="audio/*" onChange={chooseAudio} /></label>
    {missingAudio && <p className="field-error">Wajib diisi — rekam atau unggah audio.</p>}
    {item.duration && <p className="file-summary">Durasi: {item.duration}</p>}
  </div>
}

// Editor video: unggah file (maks 30 detik) atau tempel link; file yang sudah
// terpasang menang atas link di preview.
function VideoEditor({ item, onUpdate, submitted }: { item: VideoGiftItem; onUpdate: (item: GiftItemData) => void; submitted: boolean }) {
  const latest = useRef({ item, onUpdate })
  latest.current = { item, onUpdate }
  const update = (patch: Partial<VideoGiftItem>) => onUpdate({ ...latest.current.item, ...patch } as GiftItemData)
  const [fileNote, setFileNote] = useState('')

  const chooseVideoFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > MAX_VIDEO_BYTES) {
      setFileNote(`Video ${(file.size / (1024 * 1024)).toFixed(1)} MB — maksimal ${MAX_VIDEO_BYTES / (1024 * 1024)} MB. Kompres dulu, atau tempel link saja.`)
      event.target.value = ''
      return
    }
    const videoUrl = URL.createObjectURL(file)
    const probe = document.createElement('video')
    probe.preload = 'metadata'
    const decide = (duration: number) => {
      if (duration > MAX_VIDEO_SECONDS) {
        setFileNote(`Video ${Math.round(duration)} detik — maksimal ${MAX_VIDEO_SECONDS} detik. Potong dulu, ya.`)
        return
      }
      setFileNote(`Video terpasang · ${Math.round(duration)} detik.`)
      update({ videoUrl })
    }
    probe.onloadedmetadata = () => {
      if (isFinite(probe.duration) && probe.duration > 0) {
        decide(probe.duration)
        return
      }
      // Webm hasil perekam browser kerap tanpa header durasi; paksa terisi dengan
      // seek ke ujung file, lalu tunggu metadata akhirnya siap.
      probe.ontimeupdate = () => {
        probe.ontimeupdate = null
        let attempts = 0
        const poll = () => {
          if (isFinite(probe.duration) && probe.duration > 0) {
            decide(probe.duration)
            return
          }
          if (attempts++ > 20) {
            setFileNote('Durasi video tidak terbaca — coba format mp4 atau webm.')
            return
          }
          window.setTimeout(poll, 120)
        }
        poll()
      }
      probe.currentTime = 1e101
    }
    probe.onerror = () => setFileNote('File video tidak bisa dibaca browser — coba format mp4 atau webm.')
    probe.src = videoUrl
  }

  const missingVideo = submitted && !item.videoUrl && !item.url.trim()
  return <div className="item-editor">
    <TextField label="Judul" value={item.title} onChange={(title) => update({ title })} placeholder="Video kenangan kita" />
    <label className="builder-field"><span>Unggah video (maks {MAX_VIDEO_SECONDS} detik)</span><input className={`file-input${missingVideo ? ' file-input--error' : ''}`} type="file" accept="video/mp4,video/webm,video/*" onChange={chooseVideoFile} /></label>
    {fileNote && <p className="file-summary">{fileNote}</p>}
    <TextField label="Video URL" value={item.url} onChange={(url) => update({ url })} placeholder="https://..." maxLength={240} />
    {missingVideo && <p className="field-error">Wajib diisi — unggah video atau tempel link.</p>}
  </div>
}

function ItemEditor({ item, onUpdate, submitted }: { item: GiftItemData; onUpdate: (item: GiftItemData) => void; submitted: boolean }) {
  const update = (patch: Partial<GiftItemData>) => onUpdate({ ...item, ...patch } as GiftItemData)
  const [photoNote, setPhotoNote] = useState('')
  const chooseImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setPhotoNote('Memproses foto…')
    try {
      const imageUrl = await toWebpDataUrl(file, PHOTO_MAX_DIMENSION, PHOTO_QUALITY)
      const sizeKb = Math.round((imageUrl.length * 0.75) / 1024)
      setPhotoNote(`Foto terpasang · ~${sizeKb} KB (WebP).`)
      update({ imageUrl } as Partial<GiftItemData>)
    } catch {
      setPhotoNote('Gagal memproses foto — coba file lain.')
      event.target.value = ''
    }
  }

  switch (item.type) {
    case 'letter': return <div className="item-editor">
      <TextField label="Judul" value={item.title} onChange={(title) => update({ title })} placeholder="Untuk kamu" />
      <TextAreaField label="Pesan" value={item.message} onChange={(message) => update({ message })} placeholder="Tulis suratmu..." required error={submitted && !item.message.trim()} />
      <TextField label="Tanda tangan" value={item.signature} onChange={(signature) => update({ signature })} placeholder="Dari Andrean" maxLength={60} />
    </div>
    case 'photo': {
      const missingImage = submitted && !item.imageUrl
      return <div className="item-editor">
        <label className="builder-field"><span>Foto *</span><input className={`file-input${missingImage ? ' file-input--error' : ''}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} /></label>
        <small className="builder-intro">Format: JPG, PNG, atau WebP. File akan di-convert ke WebP otomatis.</small>
        {photoNote && <p className="file-summary">{photoNote}</p>}
        {missingImage && <p className="field-error">Wajib diisi — pilih foto dulu.</p>}
        <TextField label="Caption" value={item.title} onChange={(title) => update({ title })} placeholder="Sunset di taman kemarin" maxLength={80} />
      </div>
    }
    case 'music': return <div className="item-editor">
      <TextField label="Judul playlist" value={item.title} onChange={(title) => update({ title })} placeholder="Playlist untukmu" />
      <TextField label="Artist / subtitle" value={item.subtitle} onChange={(subtitle) => update({ subtitle })} placeholder="Lagu yang mengingatkanku padamu" maxLength={100} />
      <TextField label="Link musik" value={item.url} onChange={(url) => update({ url })} placeholder="https://..." maxLength={240} required error={submitted && !item.url.trim()} />
    </div>
    case 'voucher': return <div className="item-editor">
      <TextField label="Judul" value={item.title} onChange={(title) => update({ title })} placeholder="Kupon janji" />
      <TextField label="Deskripsi" value={item.description} onChange={(description) => update({ description })} placeholder="Pelukan gratis" maxLength={100} required error={submitted && !item.description.trim()} />
      <TextField label="Kode (opsional)" value={item.code} onChange={(code) => update({ code })} placeholder="LOVE2026" maxLength={40} />
    </div>
    case 'audio': return <AudioEditor item={item} onUpdate={onUpdate} submitted={submitted} />
    case 'video': return <VideoEditor item={item} onUpdate={onUpdate} submitted={submitted} />
  }
}

type ContentView = { type: 'list' } | { type: 'add' } | { type: 'edit'; itemId: string; isNew?: boolean }

function BackToList({ onClick }: { onClick: () => void }) {
  return <button className="content-back" onClick={onClick}>‹ Isi kotak</button>
}

function SelectedItemsView({ items, onEdit, onAdd, onRemove }: { items: GiftItemData[]; onEdit: (id: string) => void; onAdd: () => void; onRemove: (id: string) => void }) {
  const atMaximum = items.length >= 6
  const incomplete = items.filter((item) => getMissingFields(item).length > 0).length
  return <section className="content-view">
    <div className="content-heading"><div><h2>Isi kotak</h2><p>Pilih dan atur isi kotakmu.</p></div><strong>{items.length}/6</strong></div>
    {items.length === 0 ? <div className="content-empty"><p>Belum ada item di kotakmu.</p><small>Tambahkan kenangan kecil untuk membuat kirimanmu lebih spesial.</small></div> : <div className="content-item-list">{items.map((item) => {
      const details = availableItems.find((available) => available.type === item.type)!
      const missingCount = getMissingFields(item).length
      return <div className="content-item-card-wrap" key={item.id}><button className="content-item-card" onClick={() => onEdit(item.id)} aria-label={`Atur ${details.label}`}><span className="item-row__icon" aria-hidden="true">{details.icon}</span><span className="content-item-copy"><strong>{details.label}</strong><small>{getItemSummary(item)}</small>{missingCount > 0 && <span className="item-incomplete">Belum lengkap — wajib diisi</span>}</span><span className="content-chevron" aria-hidden="true">›</span></button><button className="content-item-remove" onClick={() => onRemove(item.id)} aria-label={`Hapus ${details.label}`}>×</button></div>
    })}</div>}
    {incomplete > 0 && <p className="content-limit">{incomplete === 1 ? '1 item belum lengkap' : `${incomplete} item belum lengkap`} — buka untuk melengkapinya.</p>}
    <button className={`add-item-cta${atMaximum ? ' add-item-cta--disabled' : ''}`} onClick={onAdd} disabled={atMaximum}>+ Tambahkan item</button>
    {atMaximum && <p className="content-limit">Maksimal 6 item sudah dipilih.</p>}
  </section>
}

function AddItemView({ items, onBack, onSelect }: { items: GiftItemData[]; onBack: () => void; onSelect: (type: GiftItemType) => void }) {
  const choices = availableItems.filter((available) => !items.some((item) => item.type === available.type))
  return <section className="content-view"><BackToList onClick={onBack} /><div className="content-editor-heading content-editor-heading--plain"><h2>Tambahkan item</h2><p>Pilih sesuatu untuk dimasukkan ke kotakmu. Kolom bertanda * wajib diisi.</p></div><div className="add-item-grid">{choices.map((available) => <button className="add-item-card" key={available.type} onClick={() => onSelect(available.type)}><span className="add-item-card__icon">{available.icon}</span><strong>{available.label}</strong><small>Tambahkan ke kotak</small></button>)}</div></section>
}

function ItemEditorView({ item, onBack, onUpdate, onDelete, isNew }: { item: GiftItemData; onBack: () => void; onUpdate: (item: GiftItemData) => void; onDelete: () => void; isNew?: boolean }) {
  const [submitted, setSubmitted] = useState(false)
  const missing = getMissingFields(item)
  const details = availableItems.find((available) => available.type === item.type)!
  return <section className="content-view"><BackToList onClick={onBack} /><div className="content-editor-heading"><span className="item-row__icon" aria-hidden="true">{details.icon}</span><div><h2>{details.label}</h2><p>Atur detail {details.label.toLocaleLowerCase('id-ID')}mu. Tanda * wajib diisi.</p></div></div><ItemEditor item={item} onUpdate={onUpdate} submitted={submitted} />{submitted && missing.length > 0 && <p className="editor-warning">Masih ada {missing.length === 1 ? '1 kolom' : `${missing.length} kolom`} wajib yang belum diisi.</p>}<button className={`editor-done-button${missing.length ? ' editor-done-button--warn' : ''}`} onClick={() => { if (missing.length > 0) { setSubmitted(true); return } onBack() }}>{isNew ? 'Tambahkan ke kotak' : 'Selesai'}</button><p className="editor-live-note">Preview diperbarui otomatis.</p><div className="editor-danger"><button onClick={onDelete}>Hapus {details.label.toLocaleLowerCase('id-ID')}</button></div></section>
}

function ContentForm({ builder, onAdd, onRemove, onUpdateItem }: Pick<Props, 'builder' | 'onAdd' | 'onRemove' | 'onUpdateItem'>) {
  const [view, setView] = useState<ContentView>({ type: 'list' })
  // Di ponsel (scene sticky di atas), pastikan tampilan form baru selalu terlihat
  // dari atasnya setiap kali berganti — bukan tersembunyi di bawah posisi scroll.
  useEffect(() => {
    if (!window.matchMedia('(max-width: 760px)').matches) return
    document.querySelector('.item-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [view])
  if (view.type === 'add') return <AddItemView items={builder.items} onBack={() => setView({ type: 'list' })} onSelect={(type) => {
    const added = onAdd(type)
    if (added) setView({ type: 'edit', itemId: added.id, isNew: true })
  }} />
  if (view.type === 'edit') {
    const item = builder.items.find((candidate) => candidate.id === view.itemId)
    if (item) return <ItemEditorView item={item} onUpdate={onUpdateItem} onBack={() => setView({ type: 'list' })} onDelete={() => { onRemove(item.id); setView({ type: 'list' }) }} isNew={view.isNew} />
  }
  return <SelectedItemsView items={builder.items} onEdit={(itemId) => setView({ type: 'edit', itemId })} onAdd={() => setView({ type: 'add' })} onRemove={onRemove} />
}

type Props = {
  builder: GoodieBoxBuilderState
  onChange: (patch: Partial<GoodieBoxBuilderState>) => void
  onAdd: (type: GiftItemType) => GiftItemData | null
  onRemove: (id: string) => void
  onUpdateItem: (item: GiftItemData) => void
  onPreview: () => void
  checkout: CheckoutState
  onCheckout: (email: string) => void
  onRetryCheck: () => void
  // previewed/agreed dimiliki App agar bar konfirmasi tetap tampil setelah
  // kembali dari halaman preview (BuilderPanel ikut unmount saat preview).
  previewed: boolean
  agreed: boolean
  onAgree: () => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CHECKOUT_BUSY: CheckoutState['status'][] = ['creating', 'paying', 'verifying']

// Kartu status alur checkout: dari membuat pesanan sampai tautan kejutan siap.
function CheckoutStatus({ checkout, onRetryCheck }: { checkout: CheckoutState; onRetryCheck: () => void }) {
  const [copied, setCopied] = useState(false)
  if (checkout.status === 'idle') return null
  const copyLink = () => {
    if (checkout.status !== 'success') return
    void navigator.clipboard?.writeText(checkout.giftUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }
  if (checkout.status === 'success') {
    return <div className="checkout-status checkout-status--success">
      <strong>🎉 Pembayaran berhasil!</strong>
      <p>Tautan kejutanmu siap — kirim ke penerima:</p>
      <div className="checkout-link-row">
        <input readOnly value={checkout.giftUrl} onFocus={(event) => event.currentTarget.select()} aria-label="Tautan kejutan" />
        <button type="button" onClick={copyLink}>{copied ? 'Tersalin!' : 'Salin'}</button>
      </div>
      <a className="checkout-open-link" href={checkout.giftUrl} target="_blank" rel="noreferrer">Buka halaman penerima ↗</a>
      <div className="checkout-email-note">
        <p><strong>📧 Email tautan juga sudah dikirim</strong></p>
        <small>Jika email belum masuk, cek folder spam atau folder email lainnya. Tautan kejutan juga tersedia di atas untuk dibagikan secara manual.</small>
      </div>
    </div>
  }
  if (checkout.status === 'pending') {
    return <div className="checkout-status checkout-status--pending">
      <strong>Pembayaran sedang diproses.</strong>
      <p>Tautan kejutan aktif otomatis setelah pembayaran terkonfirmasi server.</p>
      <button type="button" onClick={onRetryCheck}>Periksa lagi</button>
    </div>
  }
  if (checkout.status === 'error') {
    return <div className="checkout-status checkout-status--error"><strong>Checkout gagal.</strong><p>{checkout.message}</p></div>
  }
  const note = checkout.status === 'creating' ? 'Membuat pesanan…'
    : checkout.status === 'paying' ? 'Selesaikan pembayaran di jendela Midtrans yang terbuka…'
    : 'Memeriksa status pembayaran…'
  return <div className="checkout-status"><p>{note}</p></div>
}

export function BuilderPanel({ builder, onChange, onAdd, onRemove, onUpdateItem, onPreview, checkout, onCheckout, onRetryCheck, previewed, agreed, onAgree }: Props) {
  const [email, setEmail] = useState('')
  const [mobileTab, setMobileTab] = useState<'nama' | 'desain' | 'isi'>('nama')
  const incompleteCount = builder.items.filter((item) => getMissingFields(item).length > 0).length
  const emailValid = EMAIL_PATTERN.test(email)
  const checkoutBusy = CHECKOUT_BUSY.includes(checkout.status)
  // Di ponsel: saat tab berganti, tarik panel ke posisi tepat di bawah scene sticky.
  useEffect(() => {
    if (!window.matchMedia('(max-width: 760px)').matches) return
    document.querySelector('.item-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [mobileTab])
  return <aside className="item-panel builder-panel" aria-label="Lengkapi kotakmu">
    <header className="item-panel__header"><h1>Lengkapi kotakmu</h1><p>Pilih kenangan kecil yang ingin kamu sisipkan.</p></header>
    <nav className="builder-tabs" role="tablist" aria-label="Bagian form builder">
      <button type="button" role="tab" aria-selected={mobileTab === 'nama'} className={`builder-tab${mobileTab === 'nama' ? ' builder-tab--active' : ''}`} onClick={() => setMobileTab('nama')}>Personalisasi</button>
      <button type="button" role="tab" aria-selected={mobileTab === 'desain'} className={`builder-tab${mobileTab === 'desain' ? ' builder-tab--active' : ''}`} onClick={() => setMobileTab('desain')}>Desain Box</button>
      <button type="button" role="tab" aria-selected={mobileTab === 'isi'} className={`builder-tab${mobileTab === 'isi' ? ' builder-tab--active' : ''}`} onClick={() => setMobileTab('isi')}>Isi Kotak</button>
    </nav>
    <div className="builder-content">
      <div className="builder-columns" data-mobile-tab={mobileTab}><div className="left-builder-column">
      <div className="builder-group builder-group--nama">
      <section className="builder-section"><TextField label="Nama penerima" value={builder.recipientName} onChange={(recipientName) => onChange({ recipientName })} placeholder="Contoh: Gustee" maxLength={40} /><TextField label="Nama pengirim" value={builder.senderName} onChange={(senderName) => onChange({ senderName })} placeholder="Contoh: Andrean" maxLength={40} /></section>
      <section className="builder-section"><TextField label="Tulisan dalam box" value={builder.innerNote} onChange={(innerNote) => onChange({ innerNote })} placeholder={`Special Gift For You ${builder.recipientName || 'Gustee'}`} maxLength={60} /><p className="builder-intro">Tampil di bagian dalam tutup (font tulisan tangan) saat kotak dibuka. Kosongkan untuk memakai teks bawaan.</p></section>
      </div>
      <div className="builder-group builder-group--desain">
      <section className="builder-section box-color-section"><BoxColorSelector value={builder.boxColor} theme={builder.boxTheme ?? 'botanical'} onChange={(boxColor) => onChange({ boxColor })} onThemeChange={(boxTheme) => onChange({ boxTheme })} /></section>
      </div></div><div className="right-builder-column builder-group--isi"><ContentForm builder={builder} onAdd={onAdd} onRemove={onRemove} onUpdateItem={onUpdateItem} /></div></div>
    </div>{previewed && !agreed && <div className="preview-confirmation"><span>Preview siap. Sudah sesuai?</span><button type="button" onClick={onAgree}>Setuju</button></div>}{incompleteCount > 0 && <p className="preview-blocked-note">Lengkapi dulu {incompleteCount === 1 ? '1 item' : `${incompleteCount} item`} yang belum lengkap untuk membuka Preview.</p>}
    {agreed && <section className="checkout-section" aria-label="Checkout">
      <label className="builder-field"><span>Email kamu *</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" maxLength={120} autoComplete="email" /><small>Untuk struk pembayaran dan info pesanan.</small></label>
      <p className="checkout-note">1 GoodieBox digital · pembayaran aman via Midtrans Snap</p>
    </section>}
    <div className="builder-actions"><button className="preview-button" type="button" disabled={builder.items.length === 0} onClick={onPreview}><span aria-hidden="true">◉</span> Preview</button><button className="surprise-link-cta" type="button" disabled={!agreed || !emailValid || checkoutBusy} onClick={() => onCheckout(email)}><span aria-hidden="true">↗</span> Buat tautan kejutan</button></div>
    <CheckoutStatus checkout={checkout} onRetryCheck={onRetryCheck} />
  </aside>
}