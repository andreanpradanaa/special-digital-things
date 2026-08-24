# Secret Trip Terminal — Product Brief

**Status:** Milestone 0 — product definition only; belum diimplementasikan.  
**Kategori yang direncanakan:** Surprise & Reveals  
**Route yang direncanakan:** `/secret-trip-terminal`

## Product definition

**Secret Trip Terminal** adalah hadiah digital singkat untuk mengungkap satu kejutan perjalanan. Buyer menyiapkan data perjalanan dan tiga petunjuk; recipient memasuki terminal mini yang menunggu satu penumpang, memeriksa tiga luggage clue dalam urutan bebas, lalu mengaktifkan departure board untuk menerima boarding pass personal.

Produk ini bukan situs maskapai, alat booking, atau itinerary. Metafora terminal dipakai sebagai panggung playful untuk membangun antisipasi: informasi yang terasa biasa di terminal—tag bagasi, indikator gate, dan papan keberangkatan—ditahan dan diurutkan agar destination baru hadir sebagai payoff final.

### Buyer, recipient, dan occasion

- **Buyer:** pasangan, teman, atau keluarga yang sudah menyiapkan satu perjalanan dan ingin mengungkapkannya secara personal tanpa perlu mengirim penjelasan panjang.
- **Recipient:** satu orang yang menerima tautan hadiah dan ingin segera mengetahui kejutan, tanpa akun atau instruksi rumit.
- **Occasion:** surprise vacation, anniversary trip, birthday trip, honeymoon surprise, long-distance reunion, atau weekend getaway.

### Product promise

Dalam sekitar 2–3 menit, recipient menemukan bahwa terminal kecil ini telah menunggu mereka, mengumpulkan tiga petunjuk destination, dan menerima satu boarding pass yang mengungkap tujuan perjalanan beserta pesan dari sender.

Destination tidak boleh tampil sebagai teks, singkatan, landmark, flag, atau metadata yang terbaca sebelum fase reveal final.

## Emotional arc

| Beat | Rasa yang diinginkan | Bukti dalam experience |
| --- | --- | --- |
| Curious arrival | “Mengapa terminal ini menungguku?” | Nama recipient pada tanda kedatangan; destination disembunyikan. |
| Playful investigation | “Aku bisa mencari tahu sedikit demi sedikit.” | Tiga koper/tags yang jelas dapat diperiksa dalam urutan bebas. |
| Certainty | “Semua petunjuk sudah terkumpul.” | Tiga status textual completion dan tombol board yang terbuka. |
| Suspense | “Sebentar lagi terbaca.” | Board aktif dengan kode aman/non-destination serta perubahan mekanis singkat. |
| Warm payoff | “Kita akan pergi ke sana—ini dari kamu.” | Boarding pass, destination, tanggal, pesan personal, dan signature. |

## Final proposed journey

Lima phase draft dipertahankan karena cukup jelas, pendek, dan masing-masing mengubah keadaan terminal. Tidak ada mini-game, form, atau tahap tambahan.

1. **Terminal Arrival** — recipient tiba di terminal mini. Copy maksimal dua kalimat memperkenalkan bahwa satu keberangkatan menunggu `[recipientName]`; CTA utama `Mulai check-in` langsung terlihat dalam lima detik.
2. **Check-in** — recipient menekan satu tombol besar bergaya tombol desk/indicator untuk menyalakan desk. Lampu status dan conveyor hidup secara visual; fokus berpindah ke heading clue scanner. Ini satu aksi, bukan pengisian data.
3. **Clue Scanner** — tiga luggage tags tampil sebagai tiga tombol native yang bisa dibuka dalam urutan bebas. Satu aksi membuka satu clue ringkas; tag berubah menjadi status `petunjuk diterima` dengan ikon dan teks, bukan warna saja. Setelah ketiganya unik, board activation tersedia.
4. **Departure Board** — recipient menekan `Aktifkan departure board`. Board terlebih dahulu memperlihatkan status aman seperti `GATE OPEN` dan boarding-pass number; tidak menampilkan destination. Transisi singkat menuju tujuan tetap menjadi satu phase, lalu tombol `Ambil boarding pass` tersedia.
5. **Boarding Pass Reveal** — recipient mengambil boarding pass yang muncul dari slot cetak. Destination, destination short code, travel date, personal message, sender, signature, dan optional travel note kini terbuka. Tersedia replay dan kembali ke collection.

Urutan clue bebas; urutan phase utama tidak bebas. Target waktu: arrival/check-in 15–25 detik, tiga clue 45–90 detik, board/reveal 20–40 detik.

## Personalization MVP

Satu konfigurasi typed per hadiah menjadi sumber tunggal seluruh copy dan data reveal. Validasi dilakukan saat data konfigurasi disiapkan/build-time; prototype tidak menyediakan buyer editor atau input recipient.

| Field | Required | Batas dan validation | Dipakai di | Visibilitas |
| --- | --- | --- | --- | --- |
| `giftId` | Ya | slug unik: 3–64 karakter, huruf kecil, angka, `-`; tidak boleh kosong | identifier internal/configuration | Tidak ditampilkan sebagai copy hadiah. |
| `recipientName` | Ya | 1–48 karakter setelah trim; plain text | arrival sign, boarding pass | Nama boleh terlihat sejak arrival. |
| `senderName` | Ya | 1–48 karakter setelah trim; plain text | label sender pada pass | Final reveal saja. |
| `departureDate` **atau** `travelDate` | Ya, pilih satu nama final (`travelDate` direkomendasikan) | tanggal display-ready 4–40 karakter; harus representasi tanggal valid yang telah diformat, bukan input bebas | boarding pass | Final reveal saja. |
| `originLabel` | Ya | 2–48 karakter; bukan kode maskapai | boarding pass `FROM` | Final reveal saja agar tidak memberi konteks destination terlalu dini. |
| `destinationName` | Ya | 2–64 karakter; plain text | board final dan boarding pass | Tidak boleh dirender sebelum destination-reveal. |
| `destinationShortCode` | Ya | 2–6 karakter uppercase `A–Z`; kode hadiah original, bukan wajib IATA | board final dan boarding pass | Tidak boleh dirender sebelum destination-reveal. |
| `clues` | Ya | tepat 3 item dengan `id` unik (kebab-case 2–32), `label` 2–28, `message` 8–140; isi tidak boleh menyebut destination, code, flag, atau landmark eksplisit | clue scanner | Satu message sesudah tag masing-masing dibuka. |
| `revealHeadline` | Ya | 8–88 karakter | heading boarding-pass | Final reveal saja. |
| `personalMessage` | Ya | 1–420 karakter; whitespace-only invalid | body boarding-pass | Final reveal saja. |
| `signature` | Ya | 1–80 karakter | penutup boarding-pass | Final reveal saja. |
| `boardingPassNumber` | Ya | 4–20 karakter uppercase/numeric/hyphen; unik dalam sample configuration | board safe state dan boarding pass | Boleh muncul pada departure board karena tidak membocorkan destination. |
| `travelNote` | Tidak | bila ada, 1–180 karakter; omit bila kosong | catatan kecil pada boarding pass | Final reveal saja. |

Fallback aman hanya untuk tampilan defensif ketika konfigurasi rusak: `Penumpang`, `Seseorang`, `Perjalanan rahasia`, dan `Pesan perjalanan akan segera tiba`. Fallback tidak boleh mengganti configuration yang invalid secara diam-diam pada test/production build: invalid configuration harus menghasilkan error development yang jelas. Untuk `travelNote`, fallback adalah tidak menampilkan elemen. Tidak ada foto, video, voice note, lagu, upload, atau media eksternal pada MVP.

## Visual identity

Direction yang dipilih adalah **retro-futurist miniature terminal**: sebuah terminal imajiner berukuran kecil yang terasa seperti set mekanis, bukan airport website realistis. Siluet utama menggabungkan canopy terminal melengkung, conveyor pendek, tiga koper bentuk geometris, departure board mekanis, lampu gate bulat, dan slot boarding-pass.

- **Palette:** cream hangat sebagai bidang terang terbatas, sky blue sebagai struktur terminal, tangerine sebagai aksi/indikator, dan charcoal sebagai teks serta mesin. Cream bukan canvas paper dominan; latar memakai pale blue atau charcoal bergantung scene.
- **Material:** enamel painted metal, plastik translucent lembut, rubber conveyor, dan sedikit speckle/grain teknis. Tidak ada scrapbook, surat tulisan tangan, tekstur kertas tua dominan, foto stok, logo maskapai, atau emblem yang menyerupai brand nyata.
- **Typography:** sans system yang tegas untuk signage/board dan sans display lokal/system berkarakter geometris; typed text tetap menjadi sumber informasi, bukan gambar teks.
- **Illustration:** SVG/CSS original yang abstrak. Tidak ada flag, peta, skyline, landmark, atau kode maskapai nyata sebelum reveal.

## Interaction principles

- Satu CTA primer langsung terlihat dan menjelaskan aksi berikutnya.
- Aksi inti memakai native button: menyalakan check-in, membuka tag, mengaktifkan board, dan mengambil pass. Pointer/touch boleh memberi hover/press affordance, tetapi tidak membuka jalur khusus.
- Tiga clue memberikan respons instan dan persistent. Tidak ada drag wajib, swipe tersembunyi, hitung waktu, atau dexterity challenge.
- Copy pendek; visual status dan objek terminal memikul sebagian besar narasi.
- Kejutan ditahan melalui urutan informasi, bukan melalui delay yang panjang atau informasi palsu.

## Originality notes

Perbandingan ini hanya terhadap empat prototype Care & Connect yang disebut dalam brief, bukan klaim originality terhadap seluruh pasar.

| Aspek | Secret Trip Terminal | Tiny Heart Repair Shop | The Things You Left With Me | 11:11 Midnight Radio | The Unsaid Garden |
| --- | --- | --- | --- | --- | --- |
| Metaphor | Terminal keberangkatan mini | Bengkel perbaikan hati | Kantor lost-and-found/kabinet | Radio analog malam | Rumah kaca dan herbarium |
| Silhouette | Canopy, conveyor, koper, flipboard, slot pass | Workbench dan tool | Kabinet/laci dan ticket | Casing radio, dial, grille | Greenhouse, soil bed, flowers |
| Palette | Sky blue, tangerine, cream terbatas, charcoal | Repair-bay/workshop | Dusty teal, walnut, brass, burgundy | Midnight navy dan cream | Forest green, soil, pale glass |
| Interaction | Check-in satu tekan, scan tiga tag, activate board, print pass | Diagnosis dan alat repair | Claim lalu membuka laci | Tuning frekuensi | Pilih, tanam, rawat seed |
| Narrative rhythm | Cepat: investigate → unlock → reveal | Care ritual bertahap | Archive inspection bertahap | Sinyal bertahap dan kontemplatif | Cultivation lambat dan lembut |
| Emotional payoff | Kepastian akan pergi bersama ke satu tujuan | Care certificate | Receipt/hal yang tak bisa dikembalikan | QSL dari broadcast personal | Pressed-flower folio |
| Keepsake form | Printed boarding pass | Certificate | Receipt | QSL card | Herbarium folio |
| Motion signature | Conveyor, scan line, lamp, flipboard, pass print | Tool/heart repair movement | Drawer/inspection | Tuning/dial/signal | Planting/bloom |

Secret Message Machine juga sengaja tidak dijadikan referensi interaction: terminal tidak memiliki coin slot, knob, capsule, gacha loop, atau hasil acak. Hasilnya satu perjalanan yang sudah dipersiapkan buyer dan ditahan hingga reveal.

## MVP boundary

### Included

- Satu surprise trip, tiga clue, satu destination, dan satu boarding pass.
- Pesan personal, replay, dan kembali ke collection.
- Pointer, touch, keyboard, reduced motion, serta layout mobile dan desktop.
- Route-scoped original visual CSS/SVG saat milestone implementasi dimulai.

### Non-goals

- Buyer editor, database, backend, account, payment, RSVP, atau personalized URL management.
- Maps, itinerary builder, booking, live flight information, atau multiple destinations.
- Concert ticket, dinner reservation, physical gift, atau generic surprise di luar perjalanan.
- Photo/video/audio upload, social sharing, download boarding pass, deployment automation, atau perubahan prototype existing.
- Category gallery UI atau category filter pada Milestone 0; gallery integration hanya direncanakan untuk milestone akhir.

## Product-level acceptance criteria

- Recipient dapat menemukan CTA utama dalam lima detik dan menyelesaikan perjalanan 2–3 menit tanpa akun.
- Hanya tiga clue unik diperlukan; clue dapat dibuka dalam urutan mana pun dan duplikat tidak menaikkan progress.
- Board tidak dapat diaktifkan sebelum ketiga clue diterima, dan destination tidak muncul dalam DOM yang user-facing sebelum final reveal.
- Boarding pass final menampilkan seluruh field required yang ditentukan dan `travelNote` hanya bila tersedia.
- Flow selesai dengan pointer, touch, maupun keyboard; tidak ada audio autoplay atau mandatory drag.
- Informasi status tersedia dalam teks/lampu/icon dan tidak hanya warna; destination final dapat dibaca tanpa menunggu animation.
- Di 320px tidak ada horizontal overflow, focus terlihat, dan replay menghasilkan state awal deterministik.
- Tidak ada asset eksternal/copyrighted, logo airline nyata, flag/landmark spoiler, atau change pada prototype lain.

## Assumptions to validate

- Tiga clue berisi tema/indra/aktivitas yang cukup menggoda tanpa secara tidak sengaja menyebut destination; content review perlu memeriksa spoiler secara manual.
- Recipient memahami bahwa tag bagasi adalah kontrol interaktif dari label dan affordance tombol, tanpa onboarding tambahan.
- `destinationShortCode` yang original/gift-specific terasa sebagai detail terminal tanpa mengesankan kode penerbangan nyata.
- Printed boarding pass cukup terasa sebagai keepsake digital tanpa kebutuhan download atau share.
- Tidak ada pertanyaan blocking untuk Milestone 0. Contoh destination, tanggal, dan gaya pesan dapat dipilih saat Milestone 1 karena konfigurasi serta guard spoiler telah ditentukan.
