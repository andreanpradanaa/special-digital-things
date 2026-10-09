# services/api (goodiebox-server) — endpoint yang ada

Base URL produksi: `https://specialdigitalthings.com/api` (nginx mem-proxy `/api/v1/` → `localhost:8080/v1/`). Semua respons JSON. Tidak ada autentikasi; order diidentifikasi lewat `order_code` dan `public_slug`.

Amplop error (semua endpoint):

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "recipientName wajib diisi" } }
```

## GET /healthz

Cek server hidup. Respons `200 {"status":"ok"}`. Dipakai: monitoring (tidak dipakai hub).

## POST /v1/orders — buat order + Snap token

Header: `Content-Type: application/json`, `Idempotency-Key: <uuid>` (retry dengan key sama mengembalikan order yang sama).

Request (builder state + kontak pembayar):

```json
{
  "recipientName": "Adik",
  "senderName": "Kakak",
  "mood": "warm | romantic | birthday | friendship | thanks | encouragement",
  "innerNote": "Selamat ulang tahun!",
  "boxColor": "#f59e0b",
  "boxTheme": "plain | polkadot | stripes | botanical | \"\"",
  "items": [{ "id": "letter-1", "type": "letter", "title": "Surat", "message": "Hai!", "signature": "Kakak" }],
  "customer": { "name": "Kakak", "email": "kakak@example.com", "phone": "081234567890" }
}
```

Validasi server: `recipientName`, `senderName` wajib; `mood` dan `boxTheme` harus dari daftar; maksimal 6 item; body ≤ 256 KB. Harga **selalu** dihitung server (`BOX_PRICE_IDR`).

Respons `201`:

```json
{
  "order_code": "GBX-260906-K3M8XA",
  "public_slug": "k7bdm2xq9r",
  "status": "pending",
  "amount": 49000,
  "currency": "IDR",
  "snap_token": "…",
  "snap_redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/…",
  "client_key": "SB-Mid-client-…",
  "is_production": false,
  "created_at": "2026-09-06T10:00:00Z"
}
```

Error: `400 VALIDATION_ERROR`, `413` body terlalu besar, `502` Midtrans gagal. Dipakai: `apps/goodiebox` (checkout), bukan hub.

## GET /v1/orders/{order_code} — status order (polling)

Respons `200`:

```json
{
  "order_code": "GBX-…",
  "public_slug": "k7bdm2xq9r",
  "status": "pending | paid | expired | cancelled",
  "amount": 49000,
  "currency": "IDR",
  "payment_status": "pending | success | failed | expired | cancelled | refunded",
  "payment_type": "qris",
  "paid_at": "2026-09-06T10:05:00Z",
  "gift_unlock_path": "/v1/gifts/k7bdm2xq9r"
}
```

Error: `404 ORDER_NOT_FOUND`. Dipakai: `apps/goodiebox` setelah Snap; kandidat untuk fitur "Hadiahku" di hub (butuh identifikasi customer dulu).

## POST /v1/payments/notifications — webhook Midtrans

Hanya dipanggil Midtrans. Verifikasi `sha512(order_id + status_code + gross_amount + server_key)`; `403` bila signature salah. Tidak dipakai frontend mana pun.

## GET /v1/gifts/{public_slug} — isi hadiah untuk penerima

Respons `200` berisi builder state lengkap bila order `paid`; selain itu `403 GIFT_LOCKED`. Dipakai: halaman `/gift/{slug}` di `apps/goodiebox`.

## POST /v1/uploads — unggah foto (multipart)

Respons `200 { "id": "<uuid>", "url": "/uploads/<uuid>.webp" }`. File diserve statis di `/uploads/*`. Dipakai: builder `apps/goodiebox`.
