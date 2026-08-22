export type ThemeMetadata = {
  id: 'heart-repair' | 'lost-and-found' | 'midnight-radio'
  path: '/heart-repair' | '/lost-and-found' | '/midnight-radio'
  title: string
  summary: string
  placeholderMessage: string
}

export const themeRegistry = [
  {
    id: 'heart-repair',
    path: '/heart-repair',
    title: 'Tiny Heart Repair Shop',
    summary: 'Sebuah bengkel kecil untuk hati yang membutuhkan sedikit perawatan.',
    placeholderMessage:
      'Ruang untuk pengalaman bengkel hati Ari dan Nara sudah tersedia. Pengalaman interaktifnya akan dibuat pada milestone berikutnya.',
  },
  {
    id: 'lost-and-found',
    path: '/lost-and-found',
    title: 'The Things You Left With Me',
    summary: 'Sebuah kantor lost-and-found untuk benda dan kenangan yang tertinggal.',
    placeholderMessage:
      'Ruang untuk claim ticket dan laci-laci kenangan sudah tersedia. Pengalaman interaktifnya belum diimplementasikan.',
  },
  {
    id: 'midnight-radio',
    path: '/midnight-radio',
    title: '11:11 Midnight Radio',
    summary: 'Sebuah radio rahasia yang menunggu pesan pada waktu yang tepat.',
    placeholderMessage:
      'Ruang untuk radio tengah malam sudah tersedia. Dial, frekuensi, dan audio belum diimplementasikan.',
  },
] as const satisfies readonly ThemeMetadata[]

export type ThemeId = (typeof themeRegistry)[number]['id']

export const homeRoute = {
  path: '/',
  title: 'Koleksi Interactive Digital Gifts',
} as const

export const notFoundRoute = {
  title: 'Halaman tidak ditemukan',
} as const

export function getThemeById(themeId: ThemeId): ThemeMetadata {
  const theme = themeRegistry.find(({ id }) => id === themeId)

  if (!theme) {
    throw new Error(`Theme metadata tidak ditemukan: ${themeId}`)
  }

  return theme
}

export function getThemeByPath(pathname: string): ThemeMetadata | undefined {
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  return themeRegistry.find(({ path }) => path === normalizedPath)
}

export function getRouteTitle(pathname: string): string {
  if (pathname === homeRoute.path) {
    return homeRoute.title
  }

  return getThemeByPath(pathname)?.title ?? notFoundRoute.title
}
