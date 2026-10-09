---
description: Kerjakan satu fitur / perubahan / bug fix di monorepo dari spec sampai siap commit — plan, TDD, build & lint, review, verifikasi, dokumen. Tahap bernomor, tidak boleh lompat.
argument-hint: <nama-fitur atau deskripsi bug> [app: hub | goodiebox | api]
---

# /feature $ARGUMENTS

Kerjakan **$ARGUMENTS** mengikuti tahap di bawah secara berurutan. Jangan lompat tahap. Setelah tiap tahap tulis satu baris ringkasan. Jangan pernah `git commit` / `git push`.

## Tahap 1 — Plan
1. Tentukan area yang disentuh: `apps/hub`, `apps/goodiebox`, `services/api`, `packages/design` (bisa lebih dari satu). Baca `CLAUDE.md` app terkait.
2. Baca `docs/features/<fitur>/spec.md` bila ada; kalau tidak ada dan fitur menyangkut tampilan, hentikan dan sarankan `/figma-spec` dulu. Bug fix: tulis langkah reproduksi singkat.
3. `graphify query "<entitas/komponen/endpoint>"` untuk memetakan file terkait; baca hanya file yang muncul (pakai `grep -n`/`sed -n`).
4. Tulis rencana: file diubah/dibuat, komponen/paket yang dipakai ulang, endpoint (`docs/api/`), tabel (`docs/db/`), state per screen. Fullstack: kerjakan **API dulu**, lalu frontend dengan kontrak yang sama. Pertanyaan yang menghambat: tanya user sekali, dalam satu pesan.

## Tahap 2 — TDD
- Frontend: `/react-test` — test RTL (query berbasis role) GAGAL dulu, implementasi minimal, refactor.
- API: `/go-test` — table-driven test GAGAL dulu (`go test ./internal/<paket>/ -run <Test>`), implementasi, refactor.
- Bug fix: test reproduksi harus merah sebelum perbaikan.
- Coverage file yang disentuh ≥ 80%: `npm run test:coverage -w apps/hub` · `cd services/api && go test -cover ./...`.
Perubahan kecil (copy, satu baris CSS) boleh lewati tahap ini.

## Tahap 3 — Build & lint
Hanya untuk area yang disentuh, harus bersih:
- hub: `npm run typecheck -w apps/hub && npm run lint -w apps/hub && npm run format:check -w apps/hub && npm run build -w apps/hub`
- goodiebox: `npm run typecheck -w apps/goodiebox && npm test -w apps/goodiebox && npm run build -w apps/goodiebox`
- api: `cd services/api && go vet ./... && gofmt -l . && go build ./...` (file yang disentuh harus lolos `gofmt`)
Gagal → agent `react-build-resolver` / `go-build-resolver`, perbaiki, ulangi.

## Tahap 4 — Review
1. `/react-review` dan/atau `/go-review` untuk semua file yang berubah.
2. Agent `security-reviewer` bila menyentuh pembayaran/webhook, input user, upload, data pribadi, storage, atau env. Agent `database-reviewer` bila ada migrasi.
3. Terapkan temuan valid, ulangi Tahap 3 bila ada perubahan.

## Tahap 5 — Verifikasi
- Tampilan berubah → `/ui-check <app> <rute>` (375 px dan 1280 px, state loading/kosong/error/sukses).
- Endpoint berubah → `/postman`, perbarui `docs/api/goodiebox-server.md`.
- Migrasi baru → perbarui `docs/db/schema.sql` dan `docs/db/gap-analysis.md`.

## Tahap 6 — Selesai
1. Jalankan ulang test area yang disentuh (semua hijau).
2. Sinkronkan dokumen: spec fitur (tandai yang sudah diimplementasi), `docs/features/overview.md`, `docs/api/`, README app bila ada perintah/env baru.
3. `graphify update .`
4. Update `docs/PROGRESS.md`: centang task, perbarui persen dan status.
5. Ringkas ke user: apa yang berubah per app, hasil test/lint, yang belum selesai.
6. **Jangan commit.** Usulkan pesan commit Conventional Commits dengan scope app, mis. `feat(api): add waitlist endpoint` atau `feat(hub,api): …`.
