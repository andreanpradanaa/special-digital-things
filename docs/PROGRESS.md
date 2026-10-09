# Progress — monorepo Special Digital Things

Diperbarui: 2026-10-09 · Total **44/66 task · 67%**

| Prioritas | Fitur                                              | Progress   | %    | x/y   | Status      |
| --------- | -------------------------------------------------- | ---------- | ---- | ----- | ----------- |
| P0        | Fondasi monorepo (workspaces, tooling, CI, Claude) | ██████████ | 100% | 12/12 | Selesai     |
| P0        | Hub: katalog                                       | ████████░░ | 80%  | 12/15 | Berjalan    |
| P0        | Goodiebox: builder + checkout + penerima           | ████████░░ | 80%  | 8/10  | Berjalan    |
| P0        | API: order, pembayaran, gift, upload               | ███████░░░ | 73%  | 8/11  | Berjalan    |
| P1        | Deploy ke VPS baru                                 | ░░░░░░░░░░ | 0%   | 0/8   | Belum mulai |
| P2        | Multi-produk di API (waitlist, kolom produk)       | ░░░░░░░░░░ | 0%   | 0/4   | Belum mulai |
| P2        | Ilustrasi & aset final                             | ███░░░░░░░ | 25%  | 1/4   | Berjalan    |
| P2        | Hadiahku (riwayat per customer)                    | ░░░░░░░░░░ | 0%   | 0/2   | Belum mulai |

Legenda: ██ selesai · ░░ belum · Status: Belum mulai / Berjalan / Selesai / Terblokir

## Fondasi monorepo — 12/12

- [x] Struktur `apps/`, `services/`, `packages/`; npm workspaces + satu lockfile
- [x] `packages/design` (`@sdt/design/tokens.css`) dipakai hub
- [x] Riwayat git lama diarsipkan di `~/Desktop/sdt-git-archive/` (tidak ikut repo)
- [x] `.gitignore` root (env, build, graphify, override Claude)
- [x] ESLint 9 + Prettier (hub), gofmt + go vet (API)
- [x] Vitest + Testing Library + coverage ≥ 80% (hub)
- [x] CI per app dengan filter path: `hub.yml`, `goodiebox.yml`, `api.yml` (deploy API dimatikan sampai `DEPLOY_API_ENABLED`)
- [x] Claude: `CLAUDE.md` root + per app, `.claude/` (ECC React + Go), command `/feature`, `/figma-spec`, `/ui-check`, `/postman`
- [x] Hooks: format otomatis + blokir commit/push, teruji
- [x] Permission: deny baca `.env*` (kecuali `.env.example`)
- [x] `docs/db/schema.sql`, `docs/db/gap-analysis.md`, `docs/postman/`
- [x] Graphify untuk seluruh monorepo

## Hub: katalog — 12/15

- [x] Home: hero, filter momen, "Tersedia sekarang", "Segera hadir", footer
- [x] ProductCard (mobile + wide desktop) dengan CTA keluar ke link produk
- [x] TeaserCard (mobile link, desktop form email)
- [x] Detail produk live: harga, langkah, isi, FAQ, sticky CTA mobile
- [x] Detail produk coming-soon: form "Kabari saya" (idle/loading/sukses/error)
- [x] Landing per momen + empty state
- [x] 404
- [x] Responsif 375 / 900 / 1280
- [x] Aksesibilitas dasar
- [x] Test (33) coverage 96.8%
- [x] Spec `docs/features/katalog-hub/spec.md`
- [x] Dokumentasi API yang dikonsumsi
- [ ] Endpoint waitlist nyata + `VITE_WAITLIST_URL`
- [ ] URL Goodiebox final (`VITE_GOODIEBOX_URL`)
- [ ] `/ui-check` formal setelah ilustrasi final

## Goodiebox — 8/10

- [x] Builder: nama, mood, catatan, warna, tema box, 6 jenis item
- [x] Preview 3D (React Three Fiber), buka/tutup tutup kotak
- [x] Upload foto/video
- [x] Checkout Midtrans Snap + polling status
- [x] Halaman penerima `/gift/:slug`
- [x] Email tautan setelah bayar (via API, SendGrid)
- [x] Build + typecheck lolos di monorepo
- [x] Test layout item (9)
- [ ] Pindah ke base path `/goodiebox` (atau subdomain) agar hub bisa di root
- [ ] Migrasi style ke `@sdt/design` + format prettier

## API — 8/11

- [x] `POST /v1/orders` dengan idempotency key, amount dihitung server
- [x] `GET /v1/orders/:code`
- [x] Webhook Midtrans: signature sha512, dedupe, transaksi atomik
- [x] `GET /v1/gifts/:slug` (terkunci sampai paid)
- [x] `POST /v1/uploads` (foto/video)
- [x] Email SendGrid setelah bayar
- [x] Migrasi otomatis saat startup
- [x] Postman collection 6 request
- [ ] Coverage test naik (sekarang hanya `midtrans` 68% dan `orders` 29%; `api`, `payments`, `storage`, `email` 0%)
- [ ] `gofmt` untuk `cmd/server/main.go` dan `internal/email/service.go`
- [ ] Rate limit endpoint publik (orders, uploads)

## Deploy ke VPS baru — 0/8

- [ ] Ganti secret yang bocor: SendGrid API key, Midtrans server key, password DB
- [ ] PostgreSQL + user baru, restore `~/Desktop/vps-backup/root/goodiebox.sql`
- [ ] User `deploy` terbatas (SSH key khusus CI, sudo hanya untuk restart service)
- [ ] Nginx: hub di root, Goodiebox di `/goodiebox`, API di `/api/`
- [ ] SSL (root, www, api)
- [ ] `.env` API di server dengan secret baru
- [ ] Aktifkan deploy CI (`DEPLOY_API_ENABLED`, secrets `VPS_*`) + job deploy hub/goodiebox
- [ ] Smoke test checkout sandbox end-to-end

## Multi-produk di API — 0/4

- [ ] G1: kolom `product` di `orders` + harga per produk
- [ ] G2: tabel `waitlist` + `POST /v1/waitlist`
- [ ] G4: metadata upload
- [ ] G5: kebijakan retensi data pribadi

## Ilustrasi & aset final — 1/4

- [x] Placeholder SVG di hub
- [ ] Render Goodiebox asli di hub
- [ ] Gambar mood per produk coming-soon
- [ ] Favicon + OG image

## Hadiahku — 0/2 (belum diputuskan)

- [ ] Keputusan produk
- [ ] G3: identitas customer (magic link) + endpoint + halaman
