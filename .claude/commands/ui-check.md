---
description: Verifikasi visual screen yang berubah terhadap Figma dan spec — dev server, screenshot tiap state di 375px dan 1280px, aksesibilitas dasar, laporan selisih.
argument-hint: <app: hub | goodiebox> <nama-fitur atau rute, mis. /produk/goodiebox>
---

# /ui-check $ARGUMENTS

Verifikasi tampilan untuk **$ARGUMENTS**. Tidak mengubah kode kecuali diminta; hasilnya laporan selisih yang kemudian dikerjakan lewat `/feature`.

## Tahap
1. **Acuan.** Baca `docs/features/<fitur>/spec.md` (bagian Screen, State, Responsif) dan ekstrak di `docs/figma/sdt-hub-screens.md` untuk screen terkait. Jangan panggil MCP Figma; kalau ekstraknya belum ada, catat sebagai `TODO(figma)`.
2. **Dev server.** Gunakan preview dari `.claude/launch.json` (`hub` port 5173, `goodiebox` port 5174). Kalau sudah jalan, pakai yang ada.
3. **Screenshot per state, dua lebar.** Untuk tiap screen yang berubah, di **375×812** (preset mobile) dan **1280×900**:
   - state default, loading (bila ada), kosong, error, sukses;
   - scroll sampai footer; perhatikan sticky CTA di mobile.
   Gunakan `read_page`/`get_page_text` untuk memastikan teks, screenshot untuk tata letak.
4. **Bandingkan** dengan desain: hierarki tipografi (Playfair/Inter/Caveat), warna token dari `packages/design/tokens.css`, jarak, radius, urutan elemen, copy persis. Catat selisih sebagai tabel: `elemen · di desain · di implementasi · prioritas (tinggi/sedang/rendah)`.
5. **Responsif.** Tidak ada scroll horizontal, teks tidak terpotong, grid teaser 2 kolom di mobile / 3 di desktop, filter row bisa discroll di mobile.
6. **Aksesibilitas dasar.** Semua tombol/link punya nama yang terbaca, input punya label, fokus keyboard terlihat (`Tab` berurutan), kontras teks muted ≥ 4.5:1, gambar dekoratif `aria-hidden`.
7. **Console.** `read_console_messages` tanpa error/warning React.
8. **Laporan.** Ringkas: screen yang dicek, screenshot kunci, tabel selisih, item aksesibilitas, rekomendasi perbaikan. Kembalikan viewport ke preset desktop.
