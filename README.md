# Special Digital Things

Monorepo studio hadiah digital: hub katalog, produk-produk digital, dan backend bersama.

| Path                               | Isi                                                                                           |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| [apps/hub](apps/hub)               | Katalog produk (`specialdigitalthings.com`) — memilih produk lalu diarahkan ke link produknya |
| [apps/goodiebox](apps/goodiebox)   | Goodiebox: kotak hadiah 3D, checkout Midtrans, halaman penerima                               |
| [services/api](services/api)       | Backend Go: order, pembayaran, gift, upload                                                   |
| [packages/design](packages/design) | Token desain bersama                                                                          |
| [docs](docs/README.md)             | Spec, kontrak API, skema DB, Postman, progress                                                |

## Menjalankan

```bash
npm install            # semua app frontend (npm workspaces)
npm run dev:hub        # http://localhost:5173
npm run dev:goodiebox  # Goodiebox
cd services/api && make run   # API :8080 (butuh Docker untuk Postgres)
```

Test & build: `npm test` · `npm run build` · `npm run api:test` · `npm run api:build`.

Env: salin `.env.example` di tiap app/service. File `.env*` lain tidak ikut repo.

## Menambah produk baru

1. Buat `apps/<produk>` (Vite + React + TS), tambahkan `"@sdt/design": "*"` untuk token.
2. Tambah entri di `apps/hub/src/data/products.ts` (`status: 'coming-soon'` dulu, ubah ke `'live'` + `href` saat rilis).
3. Backend: perluas `services/api` (lihat `docs/db/gap-analysis.md`).
4. Tambah workflow CI dengan filter path `apps/<produk>/**`.

Kerja dengan Claude Code: lihat [CLAUDE.md](CLAUDE.md) dan [docs/claude-setup.md](docs/claude-setup.md).
