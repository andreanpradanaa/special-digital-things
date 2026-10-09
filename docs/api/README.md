# Kontrak API — services/api

Sumber: kode `services/api` (`internal/api/router.go`, `handlers.go`, `orders/payload.go`) dan `services/api/README.md` · Tanggal: 2026-10-09.

| Dokumen                                    | Isi                                             | Status                           |
| ------------------------------------------ | ----------------------------------------------- | -------------------------------- |
| [goodiebox-server.md](goodiebox-server.md) | Endpoint backend Goodiebox yang sudah ada       | Dari kode, bukan asumsi          |
| [waitlist.md](waitlist.md)                 | Endpoint "Kabari saya" untuk produk coming-soon | **Asumsi — butuh konfirmasi BE** |

Catatan penting: **hub ini sendiri tidak memanggil endpoint Goodiebox**. Builder dan checkout ada di `apps/goodiebox`, dan hub hanya mengarahkan customer ke sana lewat `VITE_GOODIEBOX_URL`. Kontrak Goodiebox didokumentasikan supaya fitur lanjutan (mis. "Hadiahku") tidak menebak-nebak.

Satu-satunya pemanggilan jaringan dari hub saat ini adalah `POST VITE_WAITLIST_URL` (lihat `waitlist.md`).
