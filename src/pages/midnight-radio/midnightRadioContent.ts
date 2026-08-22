export const radioFrequencyRange = {
  min: 880,
  max: 1080,
  step: 1,
} as const

export type BroadcastId = 'laugh' | 'way-home' | 'stay'

export type RadioBroadcast = {
  id: BroadcastId
  frequency: number
  callSign: string
  revealHeading: string
  transcript: string
}

export const broadcasts = [
  {
    id: 'laugh',
    frequency: 883,
    callSign: 'THE LAUGH I KEEP',
    revealHeading: 'Suara yang selalu ingin kusimpan.',
    transcript: 'Aku menyimpan tawamu untuk malam-malam yang terlalu sunyi.',
  },
  {
    id: 'way-home',
    frequency: 967,
    callSign: 'THE WAY HOME',
    revealHeading: 'Beberapa orang terdengar seperti arah pulang.',
    transcript:
      'Entah sejauh apa hariku berjalan, memikirkanmu selalu terasa seperti arah pulang.',
  },
  {
    id: 'stay',
    frequency: 1049,
    callSign: 'STAY A LITTLE LONGER',
    revealHeading: 'Ada menit-menit yang ingin kuperlambat.',
    transcript:
      'Kalau waktu bisa dipelankan, aku akan memilih beberapa menit lagi bersamamu.',
  },
] as const satisfies readonly RadioBroadcast[]

export const broadcastIds = broadcasts.map(({ id }) => id) as readonly BroadcastId[]

export function getBroadcast(id: BroadcastId): RadioBroadcast {
  const broadcast = broadcasts.find((item) => item.id === id)

  if (!broadcast) {
    throw new Error(`Broadcast tidak ditemukan: ${id}`)
  }

  return broadcast
}
