import type { GiftItemData, GiftItemType } from './types'

export type AvailableGiftItem = {
  type: GiftItemType
  label: string
  icon: string
}

export const availableItems: AvailableGiftItem[] = [
  { type: 'letter', label: 'Surat / Amplop', icon: '✉' },
  { type: 'photo', label: 'Foto Polaroid', icon: '▣' },
  { type: 'music', label: 'Kartu Musik', icon: '♪' },
  { type: 'voucher', label: 'Voucher', icon: '▭' },
  { type: 'audio', label: 'Voice Note / Audio', icon: '◖' },
  { type: 'video', label: 'Video Kenangan', icon: '▶' },
]

export function createGiftItem(type: GiftItemType): GiftItemData {
  const id = `${type}-${Date.now()}`
  switch (type) {
    case 'letter': return { id, type, title: 'Untuk kamu', message: '', signature: '' }
    case 'photo': return { id, type, title: '' }
    case 'music': return { id, type, title: 'Playlist untukmu', subtitle: '', url: '' }
    case 'voucher': return { id, type, title: 'Kupon janji', description: '', code: '' }
    case 'audio': return { id, type, title: 'Pesan suara untukmu', audioUrl: undefined, duration: '' }
    case 'video': return { id, type, title: 'Video kenangan kita', url: '' }
  }
}

export function getItemSummary(item: GiftItemData) {
  switch (item.type) {
    case 'letter': return item.title || 'Surat untukmu'
    case 'photo': return item.title || 'Belum ada caption'
    case 'music': return item.title || 'Playlist untukmu'
    case 'voucher': return item.description || item.title
    case 'audio': return item.duration || item.title
    case 'video': return item.title
  }
}
