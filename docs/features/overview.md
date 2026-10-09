# Overview fitur — monorepo Special Digital Things

Figma: https://www.figma.com/design/FIN7tOZUXwIk7Br9Adf1MS · Ekstrak: [docs/figma/sdt-hub-screens.md](../figma/sdt-hub-screens.md) · Tanggal: 2026-10-09

Hub ini adalah **etalase pemilihan produk** Special Digital Things. Ia tidak menjual: customer memilih produk, lalu diarahkan ke halaman produk itu sendiri (Goodiebox di `VITE_GOODIEBOX_URL`). Produk baru ditambahkan sebagai entri data, bukan layout baru.

## Section Figma → screen → area kode

| Section Figma                           | Screen                               | Rute               | Kode                                                                         |
| --------------------------------------- | ------------------------------------ | ------------------ | ---------------------------------------------------------------------------- |
| Hub — Mobile/Desktop · Home             | Katalog                              | `/`                | `pages/HomePage.tsx`, `components/cards.tsx`, `components/layout.tsx`        |
| Home / Empty filter, Occasion           | Landing per momen                    | `/untuk/:occasion` | `pages/OccasionPage.tsx`                                                     |
| Product detail / Goodiebox              | Detail produk live                   | `/produk/:slug`    | `pages/ProductPage.tsx` (`LiveProduct`)                                      |
| Coming soon / Midnight Radio (+Success) | Detail produk segera + "Kabari saya" | `/produk/:slug`    | `pages/ProductPage.tsx` (`ComingSoonProduct`), `components/EmailCapture.tsx` |
| —                                       | 404                                  | `*`                | `pages/NotFoundPage.tsx`                                                     |
| Foundations                             | Token & komponen                     | —                  | `packages/design/tokens.css`, `components/ui.tsx`                                     |

## Peta navigasi

```
/  ──chip momen──▶ /untuk/:occasion ──kartu──▶ /produk/:slug
│                                                 │
├──kartu / "Lihat detail"──▶ /produk/:slug        ├── live: "Buka <Produk> →" ──▶ VITE_GOODIEBOX_URL (keluar hub)
└──"Buka Goodiebox →"──▶ keluar hub               └── coming-soon: form "Kabari saya" (tetap di hub)
```

## Inventaris komponen

| Komponen                                       | File               | Varian / prop                                                                            | Dipakai di                    |
| ---------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------- | ----------------------------- |
| Button                                         | `ui.tsx`           | primary · secondary · ghost; size default/small; full; `href` (keluar) / `to` (internal) | semua                         |
| Chip                                           | `ui.tsx`           | active; `to` → link filter                                                               | FilterRow, daftar isi produk  |
| Badge                                          | `ui.tsx`           | sage Tersedia · amber Segera · rose · plum                                               | kartu, detail                 |
| ProductCard                                    | `cards.tsx`        | `wide` (desktop katalog)                                                                 | Home, Occasion                |
| TeaserCard                                     | `cards.tsx`        | mobile: link ke detail; desktop (≥900px): form email compact                             | Home, Occasion                |
| EmailCapture                                   | `EmailCapture.tsx` | `compact`; state idle/loading/success/error                                              | TeaserCard, ComingSoonProduct |
| Faq                                            | `Faq.tsx`          | `<details>` native, item pertama terbuka                                                 | ProductPage                   |
| Header / Footer / FilterRow / Section / TopBar | `layout.tsx`       | TopBar: back di mobile, breadcrumb di desktop                                            | semua                         |
| GiftArt / TeaserArt                            | `art.tsx`          | placeholder SVG, `ratio`, `rounded`                                                      | kartu, detail                 |

## Design token

Semua warna/font/radius ada di `packages/design/tokens.css` (`@sdt/design`) dan selaras 1:1 dengan Variables Figma `SDT Tokens`. Breakpoint: mobile-first, `900px` untuk layout desktop; container 1120 + gutter 24/80.

## Glosarium

- **Produk live**: `status: 'live'`, punya `href`, `priceIdr`, `steps`, `faq`. CTA keluar dari hub.
- **Produk coming-soon**: `status: 'coming-soon'`, tanpa CTA beli, hanya waitlist.
- **Momen (occasion)**: tag untuk filter dan landing (`ulang-tahun`, `romantis`, `terima-kasih`, `persahabatan`, `semangat`).
- **Waitlist**: pendaftaran email "Kabari saya" per produk.

## State machine entitas utama

Produk: `coming-soon ──rilis (ubah data)──▶ live`. Tidak ada state lain; produk yang dihentikan cukup dihapus dari data.
Form waitlist: `idle ──submit──▶ loading ──▶ success | error ──coba lagi──▶ loading`.

## Endpoint per screen

| Screen                                   | Endpoint                                                     | Status              |
| ---------------------------------------- | ------------------------------------------------------------ | ------------------- |
| Detail coming-soon, kartu teaser desktop | `POST VITE_WAITLIST_URL` ([waitlist.md](../api/waitlist.md)) | butuh konfirmasi BE |
| Lainnya                                  | tidak ada (data statis)                                      | —                   |

## Pertanyaan terbuka

- [ ] URL final Goodiebox setelah hub mengambil alih root domain (`/goodiebox` atau subdomain)?
- [ ] Endpoint waitlist: dibangun di `services/api` (rekomendasi, lihat docs/db/gap-analysis.md G2)?
- [ ] Perlu halaman "Hadiahku" (riwayat hadiah per email) di hub? Kalau ya, butuh identifikasi customer (magic link).
- [ ] Ilustrasi final per produk.

## App lain di monorepo

### apps/goodiebox — produk Goodiebox
| Screen | Rute | Kode | Endpoint |
| --- | --- | --- | --- |
| Builder + checkout | `/` (akan pindah ke `/goodiebox` saat hub mengambil alih root domain) | `src/App.tsx`, `src/goodiebox/BuilderPanel.tsx`, `GoodieBoxScene.tsx` | `POST /v1/uploads`, `POST /v1/orders`, `GET /v1/orders/:code` |
| Halaman penerima | `/gift/:slug` | `src/goodiebox/GiftPage.tsx`, `RecipientView.tsx` | `GET /v1/gifts/:slug` |

Belum ada spec terpisah dan belum ada ekstrak Figma untuk Goodiebox (desain acuan: `apps/goodiebox/new-box-open.png`, `design-qa.md`). Token: belum memakai `@sdt/design`.

### services/api — backend bersama
Katalog endpoint: [docs/api/goodiebox-server.md](../api/goodiebox-server.md) · Postman: `docs/postman/` · Skema: [docs/db/schema.sql](../db/schema.sql) · Gap multi-produk: [docs/db/gap-analysis.md](../db/gap-analysis.md).

| Endpoint | Status | Catatan |
| --- | --- | --- |
| `GET /healthz`, `POST /v1/orders`, `GET /v1/orders/:code`, `POST /v1/payments/notifications`, `GET /v1/gifts/:slug`, `POST /v1/uploads` | ada | dipakai Goodiebox |
| `POST /v1/waitlist` | baru (usulan) | untuk hub "Kabari saya" — G2 |
| kolom `product` + harga per produk | ubah (usulan) | supaya produk berikutnya bisa memakai `orders` yang sama — G1 |

Response code: amplop `{"error":{"code","message"}}`; daftar kode lengkap di Postman collection.
