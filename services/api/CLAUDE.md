# services/api — backend Go (goodiebox-server)

Aturan umum, workflow, git, dan hemat token ada di `CLAUDE.md` root. File ini hanya detail lokal.

## Struktur (layered)
- `cmd/server/` entrypoint + graceful shutdown · `internal/config/` env, gagal cepat.
- `internal/api/` router chi (`router.go`) → handler (`handlers.go`) → amplop error (`respond.go`: `{"error":{"code","message"}}`).
- `internal/orders/` domain + service + repo order (payload/validasi, `generate.go` kode order & slug crypto/rand).
- `internal/payments/` webhook Midtrans: verifikasi signature, dedupe, update status dalam satu transaksi.
- `internal/midtrans/` Snap client + signature sha512 · `internal/email/` SendGrid · `internal/storage/` upload ke disk · `internal/db/` pgx pool + migrasi.
- `migrations/` SQL golang-migrate (jalan otomatis saat startup) → disalin ke `docs/db/schema.sql`.

## Aturan penting
- Amount selalu integer IDR, dihitung server; webhook adalah sumber kebenaran status bayar.
- Endpoint berubah → jalankan `/postman` (regenerasi `docs/postman/` lewat `node docs/postman/build-collection.mjs`) dan perbarui `docs/api/goodiebox-server.md`.
- Migrasi baru → perbarui `docs/db/schema.sql` dan `docs/db/gap-analysis.md`; minta review agent `database-reviewer`.
- Jangan baca `.env`; contoh variabel ada di `.env.example`.

## Perintah (dari folder ini)
`make run` (Postgres Docker + server :8080) · `go test ./...` · `go test -cover ./...` · `go vet ./...` · `gofmt -l .` · `go build -o bin/server ./cmd/server`
