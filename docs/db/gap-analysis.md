# Gap analysis database — services/api

Sumber: `docs/db/schema.sql` (dari `services/api/migrations`), kode `services/api/internal`, spec `docs/features/` · Tanggal: 2026-10-09

Legenda: ✅ sudah didukung skema · 🟡 sebagian / perlu penyesuaian · ❌ belum ada

## Kesimpulan

Skema sekarang dibuat khusus **satu produk (Goodiebox)**: kolom `box_payload`, prefix kode `GBX-`, dan harga dari `BOX_PRICE_IDR`. Untuk monorepo multi-produk, gap terbesar adalah **tidak ada kolom produk** di `orders`, **tidak ada tabel waitlist**, dan **tidak ada identitas customer** lintas order.

## Mapping tabel ↔ fitur

| Tabel                   | Fitur                              | Status | Catatan                                                                                                                   |
| ----------------------- | ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `orders`                | Checkout Goodiebox, link hadiah    | ✅     | `box_payload` JSONB menyimpan builder state; `public_slug` untuk `/gift/{slug}`                                           |
| `orders`                | Produk lain (Midnight Radio, dst.) | 🟡     | Bisa menumpang `box_payload` JSONB, tapi tidak ada kolom `product` → laporan & harga per produk tidak bisa dibedakan (G1) |
| `payments`              | Status pembayaran Midtrans         | ✅     | Satu payment per order (`order_id UNIQUE`)                                                                                |
| `payment_notifications` | Audit + dedupe webhook             | ✅     | Unique `(order_code, transaction_id, status_code, gross_amount)`                                                          |
| —                       | Waitlist "Kabari saya" (hub)       | ❌     | Lihat G2 dan `docs/api/waitlist.md`                                                                                       |
| —                       | Hadiahku (riwayat per customer)    | ❌     | Lihat G3                                                                                                                  |
| —                       | Upload foto/video                  | 🟡     | File disimpan di disk (`UPLOAD_DIR`), tidak ada tabel metadata → tidak bisa dibersihkan per order (G4)                    |

## Gap

- **G1 — Kolom produk di `orders`.** Tambah `product TEXT NOT NULL DEFAULT 'goodiebox'` + index; prefix kode per produk (`GBX-`, `MRD-`, …); harga per produk dari konfigurasi, bukan satu `BOX_PRICE_IDR`.
- **G2 — Tabel `waitlist`.** `id UUID PK, email TEXT NOT NULL, product TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now(), UNIQUE (email, product)`. Endpoint `POST /v1/waitlist` (rate limit per IP).
- **G3 — Identitas customer.** Saat ini hanya `sender_email` per order. Untuk "Hadiahku" perlu tabel `customers` atau minimal index `orders(sender_email)` + magic-link token (`login_tokens`).
- **G4 — Metadata upload.** Tabel `uploads(id, order_id NULL, kind, path, size, created_at)` supaya file yatim bisa dibersihkan dan ukuran bisa dibatasi per order.
- **G5 — Data pribadi.** `sender_email`, `sender_phone`, dan isi `box_payload` (surat pribadi) tersimpan polos. Tentukan masa simpan (mis. hapus/anonimkan order `expired` > 30 hari) dan pastikan backup terenkripsi.

## Pertanyaan terbuka

- [ ] Produk berikutnya memakai `services/api` yang sama (rekomendasi) atau backend sendiri?
- [ ] Harga per produk disimpan di DB atau env?
- [ ] Kebijakan retensi data order dan upload?
