---
description: Sinkronkan Postman collection + environment services/api dari kode (router, DTO, response code). Tanpa data asli atau secret.
argument-hint: [catatan perubahan endpoint, opsional]
---

# /postman $ARGUMENTS

Perbarui `docs/postman/sdt-api.postman_collection.json` (format v2.1) dan `docs/postman/sdt-api.postman_environment.json` agar sama persis dengan kode `services/api`.

## Tahap
1. **Petakan endpoint dari kode** — `graphify query "router endpoint handler"` lalu baca `services/api/internal/api/router.go` (rute), `handlers.go` (struct request/response), `respond.go` (amplop error), `internal/orders/payload.go` (validasi). Catat: method, path, body, response sukses, setiap `writeError(...)` (status + code).
2. **Publik vs ber-auth** — saat ini semua endpoint publik; webhook `/v1/payments/notifications` diverifikasi dengan signature sha512, bukan auth. Tandai di deskripsi request.
3. **Tulis collection** — satu folder per resource (Health, Orders, Payments, Gifts, Uploads). Tiap request:
   - URL memakai `{{baseUrl}}`, variabel path (`{{orderCode}}`, `{{publicSlug}}`);
   - body contoh **fiktif** (nama/email/telepon karangan, tanpa data customer asli dari DB);
   - `response` contoh: satu sukses + satu per kode error yang bisa dikembalikan handler itu;
   - test script kecil yang menyimpan `order_code`/`public_slug` dari respons ke variabel collection.
4. **Environment** — hanya `baseUrl` (`http://localhost:8080`) dan variabel kosong untuk `orderCode`, `publicSlug`, `idempotencyKey`. **Tidak ada** server key Midtrans, password, atau token.
5. **Validasi** — `node -e "JSON.parse(require('fs').readFileSync(...))"` untuk kedua file; pastikan jumlah request = jumlah rute di `router.go`.
6. **Ringkas** — daftar endpoint yang berubah sejak versi sebelumnya; ingatkan user untuk import ulang ke Postman. Jangan commit.
