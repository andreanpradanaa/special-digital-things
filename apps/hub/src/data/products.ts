import type { OccasionId } from './occasions'

export type ProductStatus = 'live' | 'coming-soon'

export type Product = {
  slug: string
  name: string
  status: ProductStatus
  /** Satu kalimat janji produk, dipakai di kartu */
  tagline: string
  /** Paragraf pendek untuk halaman detail */
  description: string
  /** Baris script kecil di halaman detail */
  script: string
  priceIdr?: number
  /** Hal-hal yang diisi pengirim (chips) */
  items: string[]
  occasions: OccasionId[]
  /** Warna latar ilustrasi placeholder */
  color: string
  /** Link ke halaman produk itu sendiri. Builder + checkout ada di sana, bukan di hub. */
  href?: string
  steps?: { title: string; description: string }[]
  faq?: { q: string; a: string }[]
}

const GOODIEBOX_URL = import.meta.env.VITE_GOODIEBOX_URL ?? '/goodiebox'

export const products: Product[] = [
  {
    slug: 'goodiebox',
    name: 'Goodiebox',
    status: 'live',
    tagline: 'Kotak hadiah 3D yang dibuka lewat link',
    description:
      'Kotak hadiah 3D yang kamu isi sendiri, lalu dia buka lewat satu link. Pita ditarik, tutup terbuka, isinya muncul satu per satu. Tanpa aplikasi, tanpa ongkir.',
    script: 'satu kotak, satu link, satu orang',
    priceIdr: 20000,
    items: ['Surat / amplop', 'Foto polaroid', 'Kartu musik', 'Kupon janji', 'Voice note', 'Video kenangan'],
    occasions: ['ulang-tahun', 'romantis', 'terima-kasih', 'persahabatan', 'semangat'],
    color: '#f2d9cd',
    href: GOODIEBOX_URL,
    steps: [
      { title: 'Dia menerima link kejutan dari kamu', description: 'Lewat WhatsApp, DM, atau cara apa pun. Tidak perlu akun.' },
      { title: 'Membuka kotak 3D di browser', description: 'Tanpa install aplikasi. Pita ditarik, tutup terbuka.' },
      { title: 'Menemukan isi yang kamu siapkan', description: 'Surat, foto, voice note, sampai kupon janji — satu per satu.' },
    ],
    faq: [
      {
        q: 'Berapa lama link aktif?',
        a: 'Link aktif 30 hari sejak pembayaran berhasil. Penerima bisa membukanya berkali-kali selama itu.',
      },
      {
        q: 'Bisa diedit setelah bayar?',
        a: 'Isi kotak dikunci saat pembayaran berhasil supaya kejutannya utuh. Cek lagi lewat pratinjau sebelum membayar.',
      },
      {
        q: 'Metode pembayaran apa saja?',
        a: 'QRIS, GoPay, transfer bank, dan kartu Visa/Mastercard lewat Midtrans.',
      },
    ],
  },
  {
    slug: 'heart-repair',
    name: 'Heart Repair',
    status: 'coming-soon',
    tagline: 'Ruang kecil untuk memperbaiki hati yang patah',
    description:
      'Sebuah ruang tenang yang kamu siapkan untuk seseorang yang sedang patah hati. Ia menyusun kembali kepingan-kepingannya satu per satu, ditemani kata-kata darimu.',
    script: 'pelan-pelan, satu keping demi satu keping',
    items: ['Pesan penguat', 'Lagu penenang', 'Janji kecil'],
    occasions: ['semangat', 'persahabatan'],
    color: '#f3d6da',
  },
  {
    slug: 'lost-and-found',
    name: 'Lost & Found',
    status: 'coming-soon',
    tagline: 'Kenang-kenangan yang ditemukan kembali',
    description:
      'Loker barang hilang berisi kenangan kalian berdua. Dia membuka satu per satu laci dan menemukan foto, catatan, dan benda kecil yang pernah kalian bagi.',
    script: 'ternyata masih tersimpan',
    items: ['Foto lama', 'Catatan', 'Benda kenangan'],
    occasions: ['persahabatan', 'romantis'],
    color: '#e4e6d9',
  },
  {
    slug: 'midnight-radio',
    name: 'Midnight Radio',
    status: 'coming-soon',
    tagline: 'Siaran radio jam 11:11 khusus untuk satu orang',
    description:
      'Sebuah stasiun radio pribadi yang mengudara tepat jam 11:11. Kamu rekam pesannya, pilih lagunya, dan dia mendengar siaran itu seolah dibuat hanya untuknya.',
    script: 'siaran jam 11:11 untuk satu orang',
    items: ['Pesan suara', 'Lagu pilihan', 'Dedikasi'],
    occasions: ['ulang-tahun', 'romantis'],
    color: '#d9dce8',
  },
  {
    slug: 'secret-message-machine',
    name: 'Secret Message Machine',
    status: 'coming-soon',
    tagline: 'Mesin pesan rahasia yang hanya dia bisa buka',
    description: 'Mesin tua dengan tuas dan kode. Dia memutar kodenya, dan pesan rahasiamu keluar selembar demi selembar.',
    script: 'hanya dia yang tahu kodenya',
    items: ['Pesan rahasia', 'Kode pembuka', 'Teka-teki'],
    occasions: ['romantis', 'persahabatan'],
    color: '#e8e0d0',
  },
  {
    slug: 'unsaid-garden',
    name: 'Unsaid Garden',
    status: 'coming-soon',
    tagline: 'Taman untuk kata-kata yang belum sempat diucapkan',
    description:
      'Taman kecil yang tumbuh dari kata-kata yang belum pernah kamu sampaikan. Setiap kalimat jadi satu bunga yang bisa dia petik.',
    script: 'yang belum sempat terucap',
    items: ['Kata-kata', 'Bunga pilihan', 'Surat panjang'],
    occasions: ['terima-kasih', 'romantis'],
    color: '#dce8dc',
  },
  {
    slug: 'secret-trip-terminal',
    name: 'Secret Trip Terminal',
    status: 'coming-soon',
    tagline: 'Tiket perjalanan kejutan ke tempat impian',
    description: 'Terminal keberangkatan dengan satu tiket atas namanya. Tujuannya rahasia sampai dia membuka boarding pass-nya.',
    script: 'boarding pass menuju kejutan',
    items: ['Tiket', 'Tujuan rahasia', 'Itinerary'],
    occasions: ['ulang-tahun', 'romantis'],
    color: '#f0e4d0',
  },
]

export const liveProducts = products.filter((p) => p.status === 'live')
export const comingSoonProducts = products.filter((p) => p.status === 'coming-soon')

export function findProduct(slug: string | undefined): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function formatIdr(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID')
}
