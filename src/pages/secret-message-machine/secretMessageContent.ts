export const capsuleColors = ['peach', 'mint', 'lavender', 'cream', 'gold'] as const

export type CapsuleColor = (typeof capsuleColors)[number]

export type MessageId =
  | 'tell-you'
  | 'ordinary-day'
  | 'calmer'
  | 'see-yourself'
  | 'matters'
  | 'stay-longer'
  | 'after-your-message'
  | 'return-to-you'

export type SecretMessage = {
  id: MessageId
  message: string
  capsuleColor: CapsuleColor
  tinySymbol: 'spark' | 'flower' | 'cloud' | 'envelope' | 'star' | 'heart' | 'note' | 'speech'
  accessibleLabel: string
}

export const secretMessages = [
  {
    id: 'tell-you',
    message: 'Aku selalu mencari namamu ketika ada sesuatu yang ingin kuceritakan.',
    capsuleColor: 'peach',
    tinySymbol: 'speech',
    accessibleLabel: 'Kapsul peach dengan tanda percakapan',
  },
  {
    id: 'ordinary-day',
    message: 'Kamu membuat hari biasa terasa sedikit lebih layak untuk diingat.',
    capsuleColor: 'mint',
    tinySymbol: 'flower',
    accessibleLabel: 'Kapsul mint dengan tanda bunga',
  },
  {
    id: 'calmer',
    message: 'Aku lebih tenang ketika tahu kamu ada.',
    capsuleColor: 'lavender',
    tinySymbol: 'cloud',
    accessibleLabel: 'Kapsul lavender dengan tanda awan',
  },
  {
    id: 'see-yourself',
    message: 'Aku berharap kamu bisa melihat dirimu seperti caraku melihatmu.',
    capsuleColor: 'cream',
    tinySymbol: 'star',
    accessibleLabel: 'Kapsul cream dengan tanda bintang',
  },
  {
    id: 'matters',
    message: 'Aku tidak selalu pandai mengatakannya, tetapi keberadaanmu sangat berarti.',
    capsuleColor: 'gold',
    tinySymbol: 'heart',
    accessibleLabel: 'Kapsul gold dengan tanda hati',
  },
  {
    id: 'stay-longer',
    message: 'Kalau aku boleh jujur, aku ingin tinggal sedikit lebih lama di dekatmu.',
    capsuleColor: 'peach',
    tinySymbol: 'note',
    accessibleLabel: 'Kapsul peach dengan tanda catatan',
  },
  {
    id: 'after-your-message',
    message: 'Aku masih sering tersenyum beberapa menit setelah membaca pesanmu.',
    capsuleColor: 'mint',
    tinySymbol: 'spark',
    accessibleLabel: 'Kapsul mint dengan tanda kilau',
  },
  {
    id: 'return-to-you',
    message: 'Di antara banyak suara, perhatianku selalu kembali kepadamu.',
    capsuleColor: 'lavender',
    tinySymbol: 'envelope',
    accessibleLabel: 'Kapsul lavender dengan tanda amplop',
  },
] as const satisfies readonly SecretMessage[]

export const secretMessageIds = secretMessages.map(({ id }) => id) as MessageId[]

export function getSecretMessage(id: MessageId): SecretMessage {
  const message = secretMessages.find((item) => item.id === id)

  if (!message) {
    throw new Error(`Pesan rahasia ${id} tidak ditemukan.`)
  }

  return message
}
