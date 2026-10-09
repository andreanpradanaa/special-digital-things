# Waitlist "Kabari saya" — **ASUMSI, butuh konfirmasi BE**

Endpoint ini **belum ada** di `services/api`. Kontrak di bawah adalah yang sudah dipakai frontend (`apps/hub/src/lib/waitlist.ts`) supaya BE tinggal mengimplementasikan. Selama `VITE_WAITLIST_URL` kosong, hub menyimpan pendaftaran di `localStorage` (mode lokal).

## POST {VITE_WAITLIST_URL} — usulan: `POST /v1/waitlist`

Auth: tidak ada (publik). Perlu rate limit per IP dan validasi email di server.

Request:

```json
{ "email": "andrean@email.com", "product": "midnight-radio" }
```

- `email`: wajib, format email valid.
- `product`: wajib, slug produk dari `src/data/products.ts` (`heart-repair`, `lost-and-found`, `midnight-radio`, `secret-message-machine`, `unsaid-garden`, `secret-trip-terminal`).

Respons yang diharapkan frontend:

- `2xx` → sukses (body diabaikan). Idempoten: email yang sama untuk produk yang sama tidak boleh error.
- `4xx/5xx` → frontend menampilkan "Belum berhasil. Coba lagi sebentar." dan membiarkan user mencoba lagi.

Dipakai di: `/produk/<slug coming-soon>` (form utama) dan kartu teaser di `/` dan `/untuk/:occasion` pada desktop.

## Pertanyaan untuk BE

- [ ] Simpan di tabel baru `waitlist(email, product, created_at, unique(email, product))`?
- [ ] Kirim email konfirmasi lewat SendGrid, atau cukup simpan?
- [ ] Perlu double opt-in?
