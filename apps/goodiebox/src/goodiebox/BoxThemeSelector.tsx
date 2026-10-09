import { useState } from 'react'
import { Check, Shapes } from '@phosphor-icons/react'
import type { BoxTheme } from './types'

export const BOX_THEMES: { id: BoxTheme; label: string }[] = [
  { id: 'polkadot', label: 'Polkadot' },
  { id: 'stripes', label: 'Garis' },
  { id: 'botanical', label: 'Botanical' },
  { id: 'plain', label: 'Polos' },
]

export function BoxThemeSelector({ value, color: _color, onChange }: { value: BoxTheme; color: string; onChange: (theme: BoxTheme) => void }) {
  const [open, setOpen] = useState(false)
  return <div className="box-theme-column">
    <button type="button" className="box-theme-select" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((current) => !current)}>
      <span className="custom-control-label"><span>Custom</span><span>Motif</span></span>
      <Shapes className="custom-control-icon" size={16} weight="regular" aria-hidden="true" />
    </button>
    {open && <div className="box-theme-menu" role="listbox" aria-label="Pilih motif box">
      {BOX_THEMES.map(({ id, label }) => <button key={id} type="button" role="option" aria-selected={value === id} onClick={() => { onChange(id); setOpen(false) }}>
        <span>{label}</span>
        {value === id && <Check size={13} weight="bold" aria-hidden="true" />}
      </button>)}
    </div>}
  </div>
}
