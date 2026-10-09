# apps/hub

Hub pemilihan produk untuk **Special Digital Things**: customer melihat katalog produk digital, memilih satu, lalu diarahkan ke halaman produk itu sendiri. **Builder dan pembayaran tidak ada di sini**, melainkan di masing-masing produk (mis. [apps/goodiebox](../goodiebox)).

Stack: React 18 + Vite 6 + TypeScript, CSS Modules, react-router. Desain sumber: file Figma "Special Digital Things" (halaman _Hub — Mobile 390_ dan _Hub — Desktop 1280_).

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # cek hasil build
```

## Environment

Salin `.env.example` ke `.env`:

| Variable             | Default      | Keterangan                                                                                             |
| -------------------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| `VITE_GOODIEBOX_URL` | `/goodiebox` | Link keluar ke halaman Goodiebox (CTA "Buka Goodiebox →")                                              |
| `VITE_WAITLIST_URL`  | kosong       | Endpoint `POST {email, product}` untuk "Kabari saya". Kosong = disimpan di `localStorage` (mode lokal) |

## Struktur

```
src/
  data/products.ts     katalog produk (live / coming-soon), harga, FAQ, langkah
  data/occasions.ts    momen (ulang tahun, romantis, …) untuk filter + landing
  lib/waitlist.ts      pendaftaran "Kabari saya"
  styles/global.css    style global (token dari @sdt/design di packages/design)
  components/          ui (Button/Chip/Badge), cards, layout (Header/Footer/FilterRow), EmailCapture, Faq, art
  pages/               HomePage, ProductPage (live + coming soon), OccasionPage, NotFoundPage
```

## Rute

| Path               | Halaman                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `/`                | Katalog: hero, filter momen, "Tersedia sekarang", "Segera hadir"                            |
| `/produk/:slug`    | Detail produk. Produk live → CTA keluar ke halaman produk; coming soon → form "Kabari saya" |
| `/untuk/:occasion` | Landing per momen, mis. `/untuk/ulang-tahun`                                                |

## Menambah produk baru

Tambahkan satu entri di `src/data/products.ts`. `status: 'coming-soon'` otomatis tampil sebagai teaser dengan form email; ubah ke `'live'` plus `href`, `priceIdr`, `steps`, `faq` saat produk rilis. Tidak perlu mengubah layout.

## Deploy

Hasil `npm run build` adalah file statis di `dist/`. Semua rute harus di-rewrite ke `index.html` (SPA). Contoh nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Yang masih placeholder

- Ilustrasi produk (`components/art.tsx`) masih SVG sederhana. Ganti dengan render Goodiebox asli.
- "Kabari saya" belum punya backend; lihat `VITE_WAITLIST_URL`.
- Link Instagram/WhatsApp/kontak di footer masih contoh.
