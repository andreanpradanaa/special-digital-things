# Katalog hub (Home, detail produk, landing momen, waitlist)

Sumber: Figma halaman `Hub — Mobile 390` (5:2) & `Hub — Desktop 1280` (5:3) · Ekstrak: docs/figma/sdt-hub-screens.md · Tanggal: 2026-10-09 · Status: **Diimplementasi** (v0.1.0)

## Screen & navigasi

| Screen               | Rute                | Masuk dari                             | Keluar ke                                                       |
| -------------------- | ------------------- | -------------------------------------- | --------------------------------------------------------------- |
| Home                 | `/`                 | langsung, footer, back                 | `/untuk/:occasion`, `/produk/:slug`, `VITE_GOODIEBOX_URL`       |
| Landing momen        | `/untuk/:occasion`  | chip filter, nav "Untuk siapa", footer | `/produk/:slug`, `/`                                            |
| Detail produk live   | `/produk/goodiebox` | kartu, "Lihat detail", footer          | `VITE_GOODIEBOX_URL` (CTA + sticky bar + "Lihat contoh hadiah") |
| Detail produk segera | `/produk/<slug>`    | kartu teaser, "Kabari saya →"          | tetap di halaman (form)                                         |
| 404                  | `*`                 | slug/momen tidak dikenal               | `/`                                                             |

## Komponen

| Elemen di desain                                        | Komponen repo                   | Baru? | Catatan                                     |
| ------------------------------------------------------- | ------------------------------- | ----- | ------------------------------------------- |
| Kartu produk live (mobile vertikal, desktop horizontal) | `ProductCard`                   | tidak | prop `wide` untuk desktop                   |
| Kartu teaser                                            | `TeaserCard`                    | tidak | mobile link ke detail; desktop form compact |
| Filter momen                                            | `FilterRow` + `Chip`            | tidak | scroll horizontal di mobile                 |
| Form Kabari saya + state sukses                         | `EmailCapture`                  | tidak | validasi email klien                        |
| FAQ                                                     | `Faq`                           | tidak | `<details>`                                 |
| Sticky CTA bar (mobile)                                 | di `ProductPage` (`.stickyBar`) | tidak | disembunyikan ≥900px                        |

## State per screen

- Home: default; loading (tidak ada: data statis — skeleton di Figma hanya untuk saat data jadi dinamis); kosong: tidak mungkin di `/` (minimal 1 produk live).
- Landing momen: default; **kosong** bila tidak ada produk untuk momen itu; 404 bila momen tidak dikenal.
- Detail live: default; 404.
- Detail segera: form idle · loading ("Mengirim…", input disabled) · sukses (blok sage) · error (pesan rose, bisa coba lagi).

## Form & validasi klien

| Field | Tipe  | Validasi                                  | Pesan error                           |
| ----- | ----- | ----------------------------------------- | ------------------------------------- |
| Email | email | wajib, regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` | "Masukkan alamat email yang valid."   |
| —     | —     | gagal jaringan / respons non-2xx          | "Belum berhasil. Coba lagi sebentar." |

## Endpoint yang dikonsumsi

| Method | Path                | Sumber kontrak       | Dipakai untuk        | Status                                     |
| ------ | ------------------- | -------------------- | -------------------- | ------------------------------------------ |
| POST   | `VITE_WAITLIST_URL` | docs/api/waitlist.md | daftar "Kabari saya" | butuh konfirmasi BE (mode lokal sementara) |

## Responsif & aksesibilitas

- Breakpoint 900px: hero 2 kolom, kartu live horizontal, grid teaser 3 kolom (mobile 2), nav & breadcrumb tampil, sticky bar hilang.
- Semua CTA ≥ 44px tinggi; fokus `outline 2px accent`; input punya label (atau `aria-label` pada compact); ilustrasi `aria-hidden`; nav utama `aria-label="Navigasi utama"`; chip aktif `aria-current="page"`.

## Copy

Lihat `src/data/products.ts`, `src/data/occasions.ts`, dan komponen — semua bahasa Indonesia, nada hangat (bukan korporat).

## Pertanyaan terbuka

- [ ] Konfirmasi URL Goodiebox final.
- [ ] Endpoint waitlist dari BE.
- [ ] Ilustrasi final menggantikan placeholder SVG.
