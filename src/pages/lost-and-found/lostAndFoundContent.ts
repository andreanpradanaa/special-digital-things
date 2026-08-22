export const claimCode = '0427' as const

export type RequiredDrawerId = 'sound' | 'sunday' | 'courage' | 'home'
export type DrawerId = RequiredDrawerId | 'unreturnable'
export type ArtifactVisualKey =
  | 'sound-jar'
  | 'pressed-flower'
  | 'courage-token'
  | 'folded-map'
  | 'heart-locket'

export type DrawerRecord = {
  id: RequiredDrawerId
  cabinetLabel: 'SOUND' | 'SUNDAY' | 'COURAGE' | 'HOME'
  visibleLabel: string
  accessibleLabel: string
  artifactVisualKey: ArtifactVisualKey
  artifactName: string
  eyebrow: string
  heading: string
  body: string
  objectLabel: string
  requiredForFinale: true
}

export const requiredDrawerIds = ['sound', 'sunday', 'courage', 'home'] as const

export const drawerRecords = [
  {
    id: 'sound',
    cabinetLabel: 'SOUND',
    visibleLabel: 'Tawamu',
    accessibleLabel: 'Buka laci SOUND: Tawamu',
    artifactVisualKey: 'sound-jar',
    artifactName: 'Tawamu',
    eyebrow: 'FOUND ITEM 01 / SOUND',
    heading: 'Tawamu ternyata belum hilang.',
    body:
      'Masih tersimpan di percakapan panjang dan hari-hari yang mendadak terasa lebih ringan hanya karena kamu tertawa.',
    objectLabel: 'FRAGILE: LAUGHTER',
    requiredForFinale: true,
  },
  {
    id: 'sunday',
    cabinetLabel: 'SUNDAY',
    visibleLabel: 'Satu Minggu sore',
    accessibleLabel: 'Buka laci SUNDAY: Satu Minggu sore',
    artifactVisualKey: 'pressed-flower',
    artifactName: 'Satu Minggu sore',
    eyebrow: 'FOUND ITEM 02 / SUNDAY',
    heading: 'Minggu sore itu masih ada di sini.',
    body:
      'Kita tidak melakukan sesuatu yang luar biasa. Tetapi entah bagaimana, hari biasa itu menjadi salah satu tempat favoritku.',
    objectLabel: 'FOUND ON AN ORDINARY DAY',
    requiredForFinale: true,
  },
  {
    id: 'courage',
    cabinetLabel: 'COURAGE',
    visibleLabel: 'Keberanian yang pernah kamu pinjamkan',
    accessibleLabel: 'Buka laci COURAGE: Keberanian yang pernah kamu pinjamkan',
    artifactVisualKey: 'courage-token',
    artifactName: 'Keberanian yang pernah kamu pinjamkan',
    eyebrow: 'FOUND ITEM 03 / COURAGE',
    heading: 'Kamu pernah meninggalkan sedikit keberanian.',
    body:
      'Kamu mungkin lupa pernah memberikannya, tetapi aku memakainya berkali-kali saat aku hampir menyerah.',
    objectLabel: 'RETURNED WITH GRATITUDE',
    requiredForFinale: true,
  },
  {
    id: 'home',
    cabinetLabel: 'HOME',
    visibleLabel: 'Cara untuk merasa pulang',
    accessibleLabel: 'Buka laci HOME: Cara untuk merasa pulang',
    artifactVisualKey: 'folded-map',
    artifactName: 'Cara untuk merasa pulang',
    eyebrow: 'FOUND ITEM 04 / HOME',
    heading: 'Ternyata rumah bukan selalu sebuah alamat.',
    body:
      'Kadang rumah adalah seseorang yang membuat kita tidak perlu menjelaskan terlalu banyak atau berpura-pura baik-baik saja.',
    objectLabel: 'NO FIXED ADDRESS',
    requiredForFinale: true,
  },
] as const satisfies readonly DrawerRecord[]

export const unreturnableRecord = {
  id: 'unreturnable' as const,
  cabinetLabel: 'UNRETURNABLE',
  artifactVisualKey: 'heart-locket' as const,
  item: 'Hatiku',
}

export function getDrawerRecord(id: RequiredDrawerId): DrawerRecord {
  const record = drawerRecords.find((drawer) => drawer.id === id)

  if (!record) {
    throw new Error(`Record laci tidak ditemukan: ${id}`)
  }

  return record
}
