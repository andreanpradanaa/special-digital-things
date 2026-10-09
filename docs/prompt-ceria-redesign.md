# Prompt: Redesign SDT Hub agar lebih ceria dan menarik customer

Kamu bekerja di project `sdt-hub` (React + Vite + CSS Modules, dev server `npm run dev` di port 5174).
Ini landing page toko hadiah digital "Special Digital Things". Produk utama yang sudah live: **Goodiebox**
(kotak hadiah 3D, pita ditarik, tutup terbuka, isi muncul satu per satu, Rp 20.000).
Produk lain masih "Segera hadir": Heart Repair, Lost & Found, Midnight Radio, Secret Message Machine,
Unsaid Garden, Secret Trip Terminal.

## Masalah saat ini

Tone-nya tenang dan melankolis, bukan ceria. Palet full earth-tone pudar, judul serif Playfair di semua tempat,
copy menjelaskan fitur bukan perasaan, ilustrasi hero statis, dan 6 kartu "Segera hadir" bernama sendu
mendominasi 1 produk live. Tidak ada animasi/micro-interaction padahal produknya menjual animasi.

## Tujuan

Pengunjung pertama kali harus merasa: "ini hadiah yang bikin orang senyum", bukan "ini ruang untuk patah hati".
Target emosi: hangat, playful, penuh kejutan. Tetap terasa premium dan buatan studio kecil Indonesia.
Jangan jadi norak: tidak ada neon, tidak ada emoji berlebihan, maksimal 2 warna aksen.

## Kerjakan, urut prioritas

### 1. Perbaiki CTA utama (bug)

`src/data/products.ts` baris ~27: `GOODIEBOX_URL` fallback ke `/goodiebox` yang tidak ada di router sehingga
semua tombol "Buka Goodiebox" jatuh ke 404 saat dev. Buat `.env` dari `.env.example`, dan ubah fallback agar
mengarah ke URL goodiebox lokal (cek port di `../goodiebox-v2`). Pastikan link membuka tab yang sama.

### 2. Token warna baru di `src/styles/tokens.css`

Pertahankan ivory/terakota sebagai basis. Tambahkan:

- `--joy: #ff8a5c` (coral hangat), `--joy-hover: #f0714a`, `--joy-soft: #ffe3d6`
- `--sun: #ffd166`, `--sun-soft: #fff3cf`
- `--gradient-joy: linear-gradient(135deg, #ffe3d6 0%, #ffd1c2 60%, #ffe9a8 100%)`
  Pakai `--joy` untuk tombol primer Goodiebox dan badge "Tersedia". Pakai `--gradient-joy` untuk latar hero dan
  latar gambar kartu Goodiebox (ganti pink pudar `--accent-soft`). `--accent` terakota tetap dipakai untuk
  tautan dan produk reflektif.

### 3. Hero: tunjukkan momen "buka hadiah"

Ganti ilustrasi kotak statis di `HomePage.tsx` / `art.module.css` dengan ilustrasi SVG inline kotak hadiah
**dalam keadaan tutup terbuka**, ada 3 item mengintip (amplop, polaroid, kartu musik) dan 6-8 confetti kecil
warna `--joy`, `--sun`, `--sage`, `--rose`. Animasikan dengan CSS murni:

- Saat load: tutup naik 12px + sedikit rotasi, isi muncul bergantian (stagger 120ms), confetti jatuh pelan loop 6s.
- Hover: pita bergoyang (rotate ±4deg, 600ms).
- Hormati `prefers-reduced-motion`: tampilkan state akhir tanpa animasi.
  Jangan pakai library baru. Jangan pakai GIF.

### 4. Copy hero dan Goodiebox (bahasa Indonesia santai, "kamu/dia")

Ganti di `HomePage.tsx` dan `src/data/products.ts`:

- Script di atas H1: "bikin dia senyum lebar hari ini"
- H1: "Kirim kejutan yang bikin dia buka berkali-kali."
- Sub: "Isi dengan surat, foto, voice note. Dia tinggal klik, pita ditarik, hadiahnya muncul satu per satu. Tanpa aplikasi, tanpa ongkir."
- CTA primer: "Bikin Goodiebox sekarang", sekunder: "Lihat contohnya"
- Di bawah CTA tambahkan 1 baris social proof kecil (ikon bintang + teks). Ambil datanya dari konstanta
  di `products.ts`, misal `socialProof: { count: 0, quote: '...' }`. Kalau count 0, tampilkan kutipan saja.
- Tagline Goodiebox: "Satu link, satu kotak, satu orang yang bakal senyum."

### 5. Font display untuk area ceria

Tambahkan Google Font **Fraunces** (variable, axis `SOFT` 100, `opsz`). Buat token `--font-display-joy`.
Pakai untuk H1 hero, judul "Tersedia sekarang", dan nama produk Goodiebox. Playfair tetap untuk kartu produk
reflektif (Heart Repair, Unsaid Garden, Lost & Found) dan footer. Perbarui `index.html` untuk preload font.

### 6. Kecilkan bobot "Segera hadir"

- Tampilkan maksimal 3 kartu, sisanya di balik tombol "Lihat 3 lagi" (toggle state, tanpa reload).
- Urutan: Secret Trip Terminal, Midnight Radio, Secret Message Machine di depan. Heart Repair, Unsaid Garden,
  Lost & Found paling belakang. Tambahkan field `order` di `products.ts`.
- Ganti lingkaran blur abu-abu dengan ikon SVG inline sederhana per produk (tiket, radio, amplop terkunci,
  plester hati, tunas daun, kompas). Satu warna, pakai warna soft kartu masing-masing.
- Subjudul section: "Masih dimasak. Tinggalkan email, kamu yang pertama tahu."

### 7. Micro-interaction (CSS saja)

- Chip kategori hover: `translateY(-2px)`, latar `--joy-soft`, border `--joy`.
- Tombol primer hover: panah "→" bergeser 4px ke kanan, bayangan lembut warna `--joy` 30%.
- Kartu produk hover: naik 4px, bayangan `--shadow-card` lebih kuat.
- Semua transisi 180-220ms ease-out, hormati `prefers-reduced-motion`.

### 8. Mobile

- Tambahkan tombol primer "Bikin Goodiebox sekarang" langsung di bawah sub hero (sebelum chip kategori).
- Tambahkan CTA sticky di bawah layar (muncul setelah scroll 1 layar, hilang saat footer terlihat),
  tinggi 56px, latar `--joy`, teks "Bikin Goodiebox · Rp 20.000".
- Nav mobile: tampilkan "Produk" dan "Untuk siapa" juga, boleh jadi menu hamburger sederhana.

## Batasan

- Jangan ubah struktur routing, data fetching, atau komponen EmailCapture.
- Jangan tambah dependency npm baru.
- Semua warna lewat token CSS, tidak ada hex hardcode di module CSS.
- Kontras teks minimal WCAG AA (cek teks putih di atas `--joy`; kalau gagal, pakai `--text-primary` di atas `--joy`).
- Pertahankan hierarki tipografi, spacing, chip kategori, dan footer yang sudah ada.

## Verifikasi

Jalankan dev server, buka di browser desktop (1280px) dan mobile (375px). Screenshot hero, kartu Goodiebox,
section "Segera hadir", dan sticky CTA mobile. Pastikan tombol "Bikin Goodiebox" tidak 404, tidak ada error
console, dan animasi mati saat `prefers-reduced-motion: reduce`. Laporkan hasilnya dengan screenshot.
