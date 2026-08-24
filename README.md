# Special Digital Things

Prototype mobile-first untuk menguji koleksi interactive digital gift dalam satu React application.

## Prasyarat

- Node.js versi modern yang kompatibel dengan versi Vite pada `package.json`.
- npm.

## Setup

```bash
npm install
```

Untuk memasang browser Chromium yang dibutuhkan smoke test:

```bash
npx playwright install chromium
```

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test:unit
npm run test:unit:watch
npm run build
npm run test:e2e -- --project=chromium
npm run preview
```

## Commerce Foundation (Milestone 6A)

Milestone ini hanya menyiapkan fondasi Supabase untuk katalog, akun demo anonim, transaksi demo, dan koleksi pembeli masa depan. Belum ada storefront, checkout, login visual, maupun dashboard pembeli.

Kebutuhan local development:

- Docker Desktop yang sedang berjalan.
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) terpasang.

Salin konfigurasi environment tanpa memasukkan secret ke repository:

```bash
cp .env.example .env.local
```

Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dari output `supabase start`. Publishable key aman dipakai browser; **jangan pernah** memakai `service_role` key pada variabel `VITE_` atau frontend. Jika kedua variabel tidak tersedia, fitur commerce akan mengembalikan error konfigurasi yang jelas dan tidak memakai localStorage sebagai fallback.

Lihat [dokumentasi Supabase](docs/SUPABASE.md) untuk reset database, seed, test RLS, model anonymous user, dan koneksi hosted project.

## Routes

- `/` — gallery koleksi interactive gift.
- `/secret-message-machine` — Secret Message Machine.
- `/unsaid-garden` — The Unsaid Garden.
- `/heart-repair` — Tiny Heart Repair Shop.
- `/lost-and-found` — The Things You Left With Me.
- `/midnight-radio` — 11:11 Midnight Radio.
- Route lain — halaman Not Found.

## Struktur utama

- `src/app` — application shell, router, dan typed theme registry.
- `src/pages` — gallery, lima experience route-scoped, dan Not Found.
- `src/shared` — utilitas global yang sudah mempunyai kebutuhan nyata.
- `src/styles` — reset, tokens, dan global styles.
- `tests/e2e` — Playwright smoke tests.
- `docs/PROJECT_PLAN.md` — scope dan milestone project.
- `supabase/` — konfigurasi local Supabase, migration, seed deterministik, dan test pgTAP Commerce Foundation.

Setiap experience memakai sample sender Andre dan recipient Gusti; seluruh visual dibuat dengan CSS/inline SVG original. Midnight Radio menyediakan ambience Web Audio optional yang default OFF.
