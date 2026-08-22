export type SeedId = 'moonflower' | 'bellflower' | 'clover' | 'dandelion' | 'starbloom'
export type SeedVisualKey = SeedId

export type SeedRecord = {
  id: SeedId
  label: string
  accessibleDescription: string
  visualKey: SeedVisualKey
  flowerLabel: string
  message: string
  accent: 'lavender' | 'blush' | 'moss' | 'gold' | 'violet'
}

export const seedIds = [
  'moonflower',
  'bellflower',
  'clover',
  'dandelion',
  'starbloom',
] as const satisfies readonly SeedId[]

export const seedRecords = [
  {
    id: 'moonflower',
    label: 'MOONFLOWER',
    accessibleDescription: 'Pilih benih Moonflower, sebuah kata yang menunggu malam.',
    visualKey: 'moonflower',
    flowerLabel: 'Moonflower specimen',
    message: 'Aku suka versi diriku yang muncul ketika sedang bersamamu.',
    accent: 'lavender',
  },
  {
    id: 'bellflower',
    label: 'BELLFLOWER',
    accessibleDescription: 'Pilih benih Bellflower, sebuah kata untuk hari biasa.',
    visualKey: 'bellflower',
    flowerLabel: 'Bellflower specimen',
    message: 'Kamu membuat hari biasa terasa layak untuk diingat.',
    accent: 'blush',
  },
  {
    id: 'clover',
    label: 'CLOVER',
    accessibleDescription: 'Pilih benih Clover, sebuah kata yang terasa aman.',
    visualKey: 'clover',
    flowerLabel: 'Clover specimen',
    message: 'Aku tidak selalu tahu cara mengatakannya, tetapi aku merasa aman di dekatmu.',
    accent: 'moss',
  },
  {
    id: 'dandelion',
    label: 'DANDELION',
    accessibleDescription: 'Pilih benih Dandelion, sebuah kata untuk saat ragu.',
    visualKey: 'dandelion',
    flowerLabel: 'Dandelion specimen',
    message: 'Jika suatu hari kamu ragu pada dirimu sendiri, pinjam dulu caraku melihatmu.',
    accent: 'gold',
  },
  {
    id: 'starbloom',
    label: 'STARBLOOM',
    accessibleDescription: 'Pilih benih Starbloom, sebuah kata yang memilih pulang.',
    visualKey: 'starbloom',
    flowerLabel: 'Starbloom specimen',
    message: 'Dari semua kemungkinan pulang, aku masih memilih menuju kamu.',
    accent: 'violet',
  },
] as const satisfies readonly SeedRecord[]

export function getSeedRecord(seedId: SeedId): SeedRecord {
  const seed = seedRecords.find((record) => record.id === seedId)
  if (!seed) throw new Error(`Benih tidak ditemukan: ${seedId}`)
  return seed
}
