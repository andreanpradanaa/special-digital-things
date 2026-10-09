---
description: Tarik desain dari Figma menjadi docs/features/<fitur>/spec.md. Hemat kuota MCP — cek docs/figma/ dulu, panggil MCP hanya untuk node yang belum ada ekstraknya.
argument-hint: <link-figma-dengan-node-id | nama-screen> <nama-fitur>
---

# /figma-spec $ARGUMENTS

Argumen: `<sumber> <nama-fitur>`. `<sumber>` boleh link Figma dengan `node-id`, atau nama screen yang sudah ada di `docs/figma/`. Hasil: `docs/features/<nama-fitur>/spec.md`.

File Figma proyek ini: **fileKey `FIN7tOZUXwIk7Br9Adf1MS`** (https://www.figma.com/design/FIN7tOZUXwIk7Br9Adf1MS). Halaman: `Foundations & Components` (0:1), `Hub — Mobile 390` (5:2), `Hub — Desktop 1280` (5:3). Daftar node screen ada di `docs/figma/sdt-hub-screens.md`.

## Aturan hemat kuota MCP (plan Starter, kuota kecil per bulan)
1. **Selalu cek `docs/figma/*.md` dulu.** Kalau screen yang diminta sudah ada ekstraknya, jangan panggil MCP sama sekali.
2. Kalau belum ada: `get_metadata` sekali untuk node induk, lalu `get_design_context` **hanya** untuk section yang benar-benar dibutuhkan (maksimal 3 panggilan per screen). `get_variable_defs` hanya jika token berubah.
3. Simpan ekstrak mentah ke `docs/figma/<nama-app>-screens.md` (tambahkan section baru, jangan menimpa) sebelum menulis spec, supaya panggilan berikutnya tidak perlu MCP.
4. Laporkan jumlah panggilan MCP yang dipakai di akhir.
5. Jika `fileKey` belum terisi atau link view-only (MCP gagal), tulis spec dari `docs/figma/` dan tandai bagian yang kurang dengan `TODO(figma)`.

## Tahap
1. Tentukan screen dan node yang dicakup fitur ini (dari argumen atau dari `docs/features/overview.md`).
2. Kumpulkan ekstrak (dari `docs/figma/` atau MCP sesuai aturan di atas).
3. Petakan elemen desain ke komponen yang **sudah ada** di `apps/<app>/src/components/` (Button/Chip/Badge/ProductCard/TeaserCard/EmailCapture/Faq/Section/FilterRow/TopBar). Hanya usulkan komponen baru bila tidak ada yang cocok.
4. Tulis spec memakai template di bawah. Semua teks bahasa Indonesia.
5. Tampilkan ringkasan spec dan pertanyaan terbuka ke user.

## Template `docs/features/<fitur>/spec.md`
```markdown
# <Nama fitur>
Sumber: Figma <link node> · Ekstrak: docs/figma/<file>.md#<section> · Tanggal: <YYYY-MM-DD> · Status: Draft | Disetujui | Diimplementasi

## Screen & navigasi
| Screen | Rute | Masuk dari | Keluar ke |

## Komponen
| Elemen di desain | Komponen repo | Baru? | Catatan (varian, prop) |

## State per screen
loading · kosong · error · sukses · (state khusus fitur)

## Form & validasi klien
| Field | Tipe | Validasi | Pesan error |

## Endpoint yang dikonsumsi
| Method | Path | Sumber kontrak (docs/api/...) | Dipakai untuk | Status kontrak (ada / butuh konfirmasi BE) |

## Responsif & aksesibilitas
Breakpoint 375 / 900 / 1280 · target sentuh ≥ 44px · fokus terlihat · label untuk input · kontras

## Copy
Teks persis dari desain (bahasa Indonesia).

## Pertanyaan terbuka
- [ ] ...
```
