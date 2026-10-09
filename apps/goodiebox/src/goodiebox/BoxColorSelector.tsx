import { useMemo, useState } from 'react'
import { Palette } from '@phosphor-icons/react'
import type { BoxTheme } from './types'
import { BoxThemeSelector } from './BoxThemeSelector'

export const BOX_COLORS = [
  { id: 'porcelain', label: 'Porcelain', color: '#D3C3B8' },
  { id: 'lilac', label: 'Dusty Lilac', color: '#9B8AAC' },
  { id: 'sage', label: 'Sage Mist', color: '#A4AEA0' },
  { id: 'blush', label: 'Blush Clay', color: '#C19096' },
] as const

// iOS Safari belum mendukung <input type="color"> — jika tak didukung,
// panel tetap punya jalur input hex yang selalu berfungsi.
function supportsColorInput() {
  const probe = document.createElement('input')
  probe.type = 'color'
  return probe.type === 'color'
}

export function BoxColorSelector({ value, theme, onChange, onThemeChange }: { value: string; theme: BoxTheme; onChange: (value: string) => void; onThemeChange: (theme: BoxTheme) => void }) {
  const [expanded, setExpanded] = useState(false)
  const colorInputSupported = useMemo(supportsColorInput, [])
  const normalizedValue = value.toUpperCase()
  const customActive = !BOX_COLORS.some((preset) => preset.color === normalizedValue)
  const showPanel = expanded || customActive

  const setHex = (raw: string) => {
    const hex = raw.trim().replace(/^#?/, '#')
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) onChange(hex.toUpperCase())
  }

  return <section className="color-selector" aria-label="Warna box">
    <div className="color-selector__swatches box-color-grid">
      {BOX_COLORS.map((preset) => {
        const selected = preset.color === normalizedValue
        return <button key={preset.id} type="button" className={`color-swatch${selected ? ' color-swatch--selected' : ''}`} onClick={() => onChange(preset.color)} aria-pressed={selected}>
          <span className="color-swatch__fill" style={{ background: preset.color }} />
          <span className="color-swatch__label">{preset.label}</span>
          {selected && <span className="color-swatch__check" aria-hidden="true">✓</span>}
        </button>
      })}
    </div>
    <div className="box-custom-grid">
      <div className="custom-color-column">
        <button type="button" className={`custom-color-toggle${customActive ? ' custom-color-toggle--active' : ''}`} aria-expanded={showPanel} onClick={() => setExpanded((open) => !open)}>
          <span className="custom-control-label"><span>Custom</span><span>Warna</span></span>
          <Palette className="custom-control-icon" size={16} weight="regular" aria-hidden="true" />
        </button>
        {showPanel && <div className={`custom-color-control${colorInputSupported ? '' : ' custom-color-control--no-picker'}`}>
          {colorInputSupported && <input aria-label="Pilih custom warna box" type="color" value={normalizedValue} onChange={(event) => onChange(event.target.value.toUpperCase())} />}
          <input className="custom-color-control__hex" aria-label="Kode warna hex" type="text" autoComplete="off" spellCheck={false} maxLength={7} placeholder="#D3C3B8" value={normalizedValue} onChange={(event) => setHex(event.target.value)} />
        </div>}
      </div>
      <BoxThemeSelector value={theme} color={value} onChange={onThemeChange} />
    </div>
  </section>
}
