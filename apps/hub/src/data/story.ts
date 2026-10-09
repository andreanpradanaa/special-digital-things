/**
 * Konten "manusia" di beranda: contoh isi kotak, cara kerja dari dua sisi, dan catatan pembuat.
 * Semua teks di sini bebas diedit tanpa menyentuh layout.
 *
 * PENTING: `letters` adalah CONTOH isi hadiah untuk memberi gambaran, bukan testimoni pelanggan.
 * Jangan diganti dengan klaim/testimoni yang tidak nyata.
 */

export type LetterTone = 'joy' | 'sun' | 'sage' | 'rose'

export type Letter = {
  to: string
  body: string
  from: string
  occasion: string
  tone: LetterTone
}

export const letters: Letter[] = [
  {
    to: 'Untuk Ibu,',
    body: 'yang selalu bangun paling pagi dan tidur paling malam. Hari ini giliran Ibu yang dimanja.',
    from: '— anak bungsumu',
    occasion: 'Ulang tahun',
    tone: 'joy',
  },
  {
    to: 'Buat kamu yang lagi jauh,',
    body: 'aku selipkan foto kita di pantai, lagu yang kita putar sepanjang jalan, dan satu kupon: peluk 10 menit tanpa HP.',
    from: '— dari yang kangen',
    occasion: 'Romantis',
    tone: 'rose',
  },
  {
    to: 'Untuk tim yang begadang bareng,',
    body: 'terima kasih sudah jadi alasan kerja terasa ringan. Voice note di dalam sengaja panjang, dengarkan sampai habis ya.',
    from: '— rekan setimmu',
    occasion: 'Terima kasih',
    tone: 'sage',
  },
]

export type HowStep = { who: 'kamu' | 'dia'; title: string; body: string }

export const howItWorks: HowStep[] = [
  { who: 'kamu', title: 'Isi kotaknya', body: 'Tulis surat, pilih foto, rekam voice note. Atur warna kotaknya sesukamu.' },
  { who: 'kamu', title: 'Kirim satu link', body: 'Bayar sekali, dapat link kejutan. Kirim lewat WhatsApp, DM, atau sisipkan di kartu.' },
  {
    who: 'dia',
    title: 'Dia buka pelan-pelan',
    body: 'Pita ditarik, tutup terbuka, isinya muncul satu per satu. Bisa dibuka lagi kapan pun dia kangen.',
  },
]

/** Catatan dari para pembuat. DRAF — ganti dengan cerita asli kalian. */
export const makerNote = {
  greeting: 'Hai, kami Andrean & Gustee.',
  body: 'Special Digital Things kami bangun berdua supaya kata-kata yang penting tidak tenggelam di antara ratusan chat. Setiap kotak dibuat agar dibuka pelan-pelan, disimpan, lalu dibuka lagi.',
  signoff: 'Selamat bikin seseorang senyum,',
  makers: ['Andrean', 'Gustee'],
}
