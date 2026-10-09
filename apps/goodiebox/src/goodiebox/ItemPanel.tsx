import type { BoxTheme, GiftItemData, GiftItemType } from './types'
import { availableItems } from './itemCatalog'
import { BoxColorSelector } from './BoxColorSelector'

export function ItemPanel({ color, theme = 'botanical', onColorChange, onThemeChange = () => undefined, items, onAdd, onRemove }: { color: string; theme?: BoxTheme; onColorChange: (color: string) => void; onThemeChange?: (theme: BoxTheme) => void; items: GiftItemData[]; onAdd: (type: GiftItemType) => void; onRemove: (id: string) => void }) {
  const atMaximum = items.length >= 6
  return <aside className="item-panel" aria-label="Atur Isi Box">
    <BoxColorSelector value={color} theme={theme} onChange={onColorChange} onThemeChange={onThemeChange} />
    <header className="item-panel__header">
      <h1>Atur Isi Box</h1>
      <p>Tambah atau hapus item dari box.</p>
    </header>
    <section className="item-panel__section" aria-label="Item tersedia">
      {availableItems.map((available) => {
        const added = items.some((item) => item.type === available.type)
        return <div className="item-row" key={available.type}>
          <span className="item-row__icon" aria-hidden="true">{available.icon}</span>
          <span className="item-row__label">{available.label}</span>
          <button className="item-row__add" onClick={() => onAdd(available.type)} disabled={added || atMaximum}>
            {added ? 'Ditambahkan' : '+ Tambah'}
          </button>
        </div>
      })}
      {atMaximum && <p className="item-panel__limit">Maksimal 6 item</p>}
    </section>
    <section className="item-panel__section item-panel__selected" aria-label="Item terpilih">
      <h2>Item Terpilih <span>({items.length})</span></h2>
      {items.length === 0 ? <p className="item-panel__empty">Belum ada item di dalam box.</p> : <div className="selected-list">
        {items.map((item) => {
          const details = availableItems.find((available) => available.type === item.type)!
          return <div className="selected-row" key={item.id}>
            <span className="item-row__icon" aria-hidden="true">{details.icon}</span>
            <span>{details.label}</span>
            <button className="selected-row__remove" onClick={() => onRemove(item.id)} aria-label={`Hapus ${details.label}`}>Hapus</button>
          </div>
        })}
      </div>}
    </section>
  </aside>
}
