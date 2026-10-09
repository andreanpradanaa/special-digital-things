import { BoxLid } from './BoxLid'
import { BoxTray } from './BoxTray'
import { GiftItems } from './GiftItems'
import { RibbonLid } from './Ribbon'
import type { BoxTheme, GiftItemData } from './types'

export type GoodieBoxProps = {
  color?: string
  theme?: BoxTheme
  open: boolean
  items: GiftItemData[]
  recipientName: string
  innerNote?: string
  onToggle?: () => void
  ribbon?: boolean
  selectedId?: string | null
  onSelectItem?: (id: string | null) => void
}

export function GoodieBox({ color = '#D3C3B8', theme = 'botanical', open, items, recipientName, innerNote = '', onToggle, ribbon = false, selectedId, onSelectItem }: GoodieBoxProps) {
  return <group scale={1.18}>
    <BoxTray theme={theme} color={color} />
    <GiftItems items={items} open={open} color={color} selectedId={selectedId} onSelect={onSelectItem} />
    <BoxLid theme={theme} color={color} open={open} recipientName={recipientName} innerNote={innerNote} onToggle={onToggle} showRibbon={ribbon} />
  </group>
}
