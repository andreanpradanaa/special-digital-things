import { useState } from 'react'
import { Plant, Sparkle } from '@phosphor-icons/react'
import { GoodieBoxScene } from './GoodieBoxScene'
import { ItemReveal } from './ItemReveal'
import type { GoodieBoxBuilderState } from './types'

// Tampilan penerima gift: scene box 3D + reveal item.
// Dipakai oleh preview editor dan halaman publik /gift/:slug.
export function RecipientView({ state, onBack }: { state: GoodieBoxBuilderState; onBack?: () => void }) {
  const [open, setOpen] = useState(false)
  const [revealedId, setRevealedId] = useState<string | null>(null)
  const revealedItem = state.items.find((item) => item.id === revealedId) ?? null
  const toggleBox = () => { setOpen((value) => !value); setRevealedId(null) }
  return <>
    {onBack && <button className="preview-back-button" onClick={() => { setOpen(false); setRevealedId(null); onBack() }}>‹ Kembali ke editor</button>}
    <section className="gift-preview-content">
      <div className={`gift-hero${open ? ' gift-hero--hidden' : ''}`} aria-hidden={open}>
        <div className="gift-hero-sprig" aria-hidden="true"><Plant size={20} weight="light" /></div>
        <h1 className="gift-preview-title">Sebuah kejutan untukmu{state.recipientName ? `, ${state.recipientName}` : ''}.</h1>
        <p className="gift-preview-sub">{`${state.senderName || 'Seseorang'} menyiapkan sesuatu yang kecil, khusus untukmu.`}</p>
      </div>
      <div className="gift-preview-box">
        <GoodieBoxScene theme={state.boxTheme} color={state.boxColor} open={open} preview ribbon fitMargin={1.04} items={state.items} recipientName={state.recipientName} innerNote={state.innerNote} selectedId={revealedId} onSelectItem={setRevealedId} onToggle={toggleBox} />
      </div>
      {open && !revealedItem && <p className="gift-preview-hint">Klik hadiah di dalam kotak untuk melihatnya lebih dekat.</p>}
      {open && revealedItem && <ItemReveal item={revealedItem} boxColor={state.boxColor} senderName={state.senderName} recipientName={state.recipientName} onClose={() => setRevealedId(null)} />}
      <button className="gift-preview-link" onClick={toggleBox}><Sparkle size={13} weight="fill" aria-hidden="true" />{open ? 'Tutup hadiah' : 'Buka hadiah'}</button>
    </section>
  </>
}
