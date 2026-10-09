# apps/goodiebox — produk Goodiebox

Aturan umum, workflow, git, dan hemat token ada di `CLAUDE.md` root. File ini hanya detail lokal.

Builder kotak hadiah 3D (React Three Fiber) → checkout Midtrans Snap → tautan kejutan `/gift/:slug` untuk penerima. Backend: `services/api` (kontrak di `docs/api/goodiebox-server.md`).

## Struktur
- `src/App.tsx` alur builder + checkout (state `checkout`), deteksi rute `/gift/:slug`.
- `src/api.ts` klien backend (`POST /v1/orders`, `GET /v1/orders/:code`, upload). `src/midtransSnap.ts` loader Snap.
- `src/goodiebox/` scene 3D (`GoodieBoxScene`, `BoxLid`, `BoxTray`, `Ribbon`, `GiftItems`), panel builder (`BuilderPanel`, `ItemPanel`), halaman penerima (`GiftPage`, `RecipientView`), tipe di `types.ts`, katalog item di `itemCatalog.ts`.
- Style di `src/styles.css` (belum memakai `@sdt/design`; migrasi bertahap).

## Catatan
- **Belum diformat prettier** — jangan jalankan format massal; ikuti gaya file yang ada.
- Test baru sedikit (`itemLayouts.test.ts`). Fitur baru tetap TDD; test komponen 3D cukup untuk logika non-render (layout, validasi, state).
- Env: `VITE_API_BASE_URL`, `VITE_MIDTRANS_SNAP_JS_URL` (lihat `.env.example`). Jangan baca `.env.development`/`.env.production`.

## Perintah (dari folder ini)
`npm run dev` · `npm test` · `npm run typecheck` · `npm run build`
