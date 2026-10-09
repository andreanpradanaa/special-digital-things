# apps/hub — katalog Special Digital Things

Aturan umum, workflow, git, dan hemat token ada di `CLAUDE.md` root. File ini hanya detail lokal hub.

Hub **tidak menjual apa pun**: customer memilih produk lalu diarahkan ke link produk itu (`VITE_GOODIEBOX_URL`, dst.).

## Struktur

- `src/pages/` satu file per rute (`/`, `/produk/:slug`, `/untuk/:occasion`, 404); routing di `src/App.tsx`.
- `src/components/` `ui.tsx` (Button/Chip/Badge), `cards.tsx` (ProductCard/TeaserCard), `layout.tsx` (Header/Footer/FilterRow/Section/TopBar), `EmailCapture`, `Faq`, `art.tsx` (ilustrasi placeholder). Style per file `*.module.css`.
- `src/data/products.ts` = satu-satunya sumber katalog; `occasions.ts` = daftar momen. Tambah produk = tambah entri, bukan layout baru.
- `src/lib/waitlist.ts` satu-satunya pemanggilan jaringan (mode lokal bila `VITE_WAITLIST_URL` kosong).
- Token desain dari `@sdt/design/tokens.css` (`packages/design`), diimpor di `src/main.tsx`. Jangan hardcode warna.
- Test helper: `src/test/render.tsx` (`renderAt`, `renderRoute`).

## Spec

`docs/features/katalog-hub/spec.md` · Figma halaman _Hub — Mobile 390_ (5:2) dan _Hub — Desktop 1280_ (5:3), ekstrak `docs/figma/sdt-hub-screens.md`.

## Perintah (dari folder ini)

`npm run dev` · `npm test` · `npm run test:coverage` (ambang 80%) · `npm run typecheck` · `npm run lint` · `npm run format` · `npm run build`
