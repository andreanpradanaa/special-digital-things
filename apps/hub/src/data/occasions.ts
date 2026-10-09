export type OccasionId = 'ulang-tahun' | 'romantis' | 'terima-kasih' | 'persahabatan' | 'semangat'

export type Occasion = {
  id: OccasionId
  label: string
  /** Baris script kecil di atas judul landing */
  script: string
  title: string
  subtitle: string
}

export const occasions: Occasion[] = [
  {
    id: 'ulang-tahun',
    label: 'Ulang tahun',
    script: 'untuk hari spesialnya',
    title: 'Hadiah ulang tahun yang dibuka lewat link',
    subtitle: 'Dikirim malam ini, dibuka tepat tengah malam.',
  },
  {
    id: 'romantis',
    label: 'Romantis',
    script: 'untuk yang paling kamu sayang',
    title: 'Hadiah romantis tanpa harus menunggu kurir',
    subtitle: 'Surat, foto, dan pesan suara yang cuma dia yang bisa buka.',
  },
  {
    id: 'terima-kasih',
    label: 'Terima kasih',
    script: 'untuk yang sudah banyak membantu',
    title: 'Ucapan terima kasih yang terasa lebih dari sekadar chat',
    subtitle: 'Kemas rasa terima kasihmu jadi sesuatu yang bisa dia simpan.',
  },
  {
    id: 'persahabatan',
    label: 'Persahabatan',
    script: 'untuk teman seperjalanan',
    title: 'Hadiah kecil untuk sahabat yang jauh',
    subtitle: 'Jarak boleh jauh, kejutannya tetap sampai dalam hitungan detik.',
  },
  {
    id: 'semangat',
    label: 'Semangat',
    script: 'untuk yang sedang berjuang',
    title: 'Kirim semangat yang bisa dibuka kapan pun dia butuh',
    subtitle: 'Pesan penguat yang tersimpan di satu link, siap dibuka berkali-kali.',
  },
]

export function findOccasion(id: string | undefined): Occasion | undefined {
  return occasions.find((o) => o.id === id)
}
