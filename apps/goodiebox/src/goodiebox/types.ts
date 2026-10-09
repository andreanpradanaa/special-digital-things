export type GiftItemType =
  | 'letter'
  | 'photo'
  | 'music'
  | 'voucher'
  | 'audio'
  | 'video'

type BaseGiftItem<T extends GiftItemType> = {
  id: string
  type: T
  title: string
}

export type LetterGiftItem = BaseGiftItem<'letter'> & { message: string; signature: string }
export type PhotoGiftItem = BaseGiftItem<'photo'> & { imageUrl?: string }
export type MusicGiftItem = BaseGiftItem<'music'> & { subtitle: string; url: string }
export type VoucherGiftItem = BaseGiftItem<'voucher'> & { description: string; code: string }
export type AudioGiftItem = BaseGiftItem<'audio'> & { audioUrl?: string; duration: string }
export type VideoGiftItem = BaseGiftItem<'video'> & { url: string; videoUrl?: string }

export type GiftItemData =
  | LetterGiftItem
  | PhotoGiftItem
  | MusicGiftItem
  | VoucherGiftItem
  | AudioGiftItem
  | VideoGiftItem

export type GiftMood = 'warm' | 'romantic' | 'birthday' | 'friendship' | 'thanks' | 'encouragement'
export type BoxTheme = 'plain' | 'polkadot' | 'stripes' | 'botanical'

export type GoodieBoxBuilderState = {
  recipientName: string
  senderName: string
  mood: GiftMood
  innerNote: string
  boxColor: string
  boxTheme?: BoxTheme
  items: GiftItemData[]
}

export type LayoutSlot = {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}
