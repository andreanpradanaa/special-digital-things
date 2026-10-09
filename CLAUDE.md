# special-digital-things — monorepo

Studio hadiah digital. **Hub** = etalase katalog (tidak menjual). **Produk** = app terpisah dengan builder + checkout sendiri. **API** = backend Go bersama.

| Path              | Isi                                                                             | Stack                                                       |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `apps/hub`        | Katalog produk, landing momen, waitlist                                         | React 18 + Vite 6 + TS, CSS Modules, react-router 7, Vitest |
| `apps/goodiebox`  | Produk Goodiebox: builder 3D, checkout Midtrans, halaman penerima `/gift/:slug` | React 18 + Vite 6 + TS, three.js / R3F                      |
| `services/api`    | Order, pembayaran Midtrans (webhook), gift, upload                              | Go 1.26, chi, pgx, PostgreSQL 15, golang-migrate            |
| `packages/design` | Token desain bersama (`@sdt/design/tokens.css`)                                 | CSS                                                         |

npm workspaces (`apps/*`, `packages/*`), satu `package-lock.json` di root. Go terpisah di `services/api/go.mod`. Tiap app punya `CLAUDE.md` sendiri untuk detail lokal.
Produk baru = folder baru `apps/<produk>` + entri di `apps/hub/src/data/products.ts`. Backend produk baru menumpang `services/api` (lihat `docs/db/gap-analysis.md` G1).

## Spec fitur

- `docs/features/overview.md` peta semua app, screen, komponen, endpoint. Spec per fitur: `docs/features/<fitur>/spec.md` (lewat `/figma-spec`).
- Figma: https://www.figma.com/design/FIN7tOZUXwIk7Br9Adf1MS · ekstrak mentah `docs/figma/`.
- API: `docs/api/` (kontrak), `docs/postman/` (collection), DB: `docs/db/schema.sql` + `docs/db/gap-analysis.md`.

## Workflow pengerjaan fitur

Setiap fitur baru, perubahan, atau bug fix — meskipun user tidak mengetik command — ikuti `.claude/commands/feature.md`:
plan (spec + `graphify query`) → TDD (`/react-test` untuk app, `/go-test` untuk API), coverage ≥ 80% → typecheck/lint/format/build bersih (`/react-build`, `/go-build`) → review (`/react-review`, `/go-review`; agent `security-reviewer` bila menyentuh pembayaran, input user, upload, data pribadi, storage; `database-reviewer` bila migrasi) → test akhir + `graphify update .` → `/postman` bila endpoint API berubah, `/ui-check` bila tampilan berubah → update `docs/PROGRESS.md`.
Perubahan kecil (copy, satu baris CSS, typo) boleh lewati TDD dan review.

## Hemat token

- `graphify query "<pertanyaan>"` sebelum membaca file; `graphify path`/`explain` untuk relasi lintas app.
- Jangan `cat` file besar; pakai `grep -n`/`sed -n`. Pangkas output (`tail`, `head`, `--stat`).
- Figma dari `docs/figma/` dan spec; MCP Figma hanya lewat `/figma-spec` (kuota Starter kecil).
- Install/test penuh/build berlog panjang lewat subagent atau background.
- Format + cek cepat otomatis lewat hook (`prettier`+`eslint` untuk hub, `gofmt`+`go vet` untuk API). `apps/goodiebox` belum diformat prettier — jangan format massal.

## Git & secret

Jangan pernah `git commit`/`git push` (dijaga hook). User commit manual per fitur; cukup usulkan pesan commit (Conventional Commits, scope = app: `feat(hub): …`, `fix(api): …`).
Jangan membaca atau menulis `.env*` selain `.env.example`. Server key Midtrans, SendGrid, password DB hanya di server/CI.

## Perintah

| Tujuan                    | Perintah (dari root)                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Install                   | `npm install` (semua app) · Go: otomatis via `go`                                                               |
| Dev                       | `npm run dev:hub` (5173) · `npm run dev:goodiebox` · API: `cd services/api && make run` (butuh Docker Postgres) |
| Test                      | `npm test` (semua app) · `npm run test:coverage -w apps/hub` · `npm run api:test`                               |
| Typecheck / lint / format | `npm run typecheck` · `npm run lint` · `npm run format` · `npm run api:vet`                                     |
| Build                     | `npm run build` · `npm run api:build`                                                                           |
| Graph                     | `graphify update .` · `graphify query "..."`                                                                    |
