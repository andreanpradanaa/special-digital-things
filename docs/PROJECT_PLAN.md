# Project Plan

## Goal

Membangun prototype mobile-first berisi tiga interactive digital gifts dalam satu web application. Target pengguna adalah orang yang ingin mengirim hadiah digital yang lucu, romantis, personal, dan lebih berkesan daripada kartu statis.

Sample gift memakai pengirim **Ari** dan penerima **Nara**.

## Tiga tema

1. **Tiny Heart Repair Shop** — penerima memilih kondisi hati dan alat perbaikan sebelum membuka pesan atau kejutan dan menerima care certificate.
2. **The Things You Left With Me** — claim ticket membuka laci-laci berisi benda metaforis dan berakhir pada sesuatu yang tidak dapat dikembalikan: hati pengirim.
3. **11:11 Midnight Radio** — radio analog rahasia membuka pesan pada beberapa frekuensi dan final reveal pada `11:11`.

## Non-goals MVP

- Login dan authentication.
- Backend, database, dan API aplikasi.
- Payment dan dashboard admin.
- CMS dan upload media.
- Personalized URL.
- Spotify atau copyrighted music integration.
- Production deployment.

## Keputusan yang dikunci

- npm sebagai package manager.
- React + TypeScript + Vite.
- React Router declarative mode.
- Motion dengan `MotionConfig reducedMotion="user"`.
- Native CSS, CSS Modules, dan CSS custom properties.
- Nama tema menggunakan Inggris; instruksi dan sample message menggunakan Bahasa Indonesia.
- System/local font tanpa mengambil font eksternal.
- Browser modern, mobile-first dari 320px.
- Seluruh aset visual dan audio harus original atau dibuat khusus.
- Shared abstraction hanya dibuat ketika mempunyai kebutuhan nyata.

## Milestone

1. **Project foundation dan quality harness — completed.** Shell, route, registry, styles dasar, accessibility global, unit test, Playwright, dan dokumentasi tersedia dan tervalidasi.
2. **Global design foundation dan theme gallery — completed.** Gallery menggunakan komposisi keepsake shelf dengan tiga preview object original dan telah melewati review visual Milestone 2.
3. **Tiny Heart Repair Shop — completed.** Pengalaman pertama end-to-end tersedia pada `/heart-repair` dan telah melewati review visual.
4. **The Things You Left With Me — completed.** Pengalaman kedua end-to-end tersedia pada `/lost-and-found` dan telah melewati review visual.
5. **11:11 Midnight Radio — implemented, awaiting visual review.** Pengalaman ketiga end-to-end tersedia pada `/midnight-radio`.
6. **Asset integration dan interaction polish**.
7. **Cross-browser, accessibility, responsive, dan final regression**.

Milestone tidak dilanjutkan sebelum milestone aktif dapat dijalankan, dilihat, diuji, dan direview.

## Keputusan desain gallery Milestone 2

- Working direction: **“A small collection of big feelings.”** Ini bukan final production brand.
- Desktop menggunakan satu keepsake shelf asimetris; mobile menggunakan mini scene vertikal agar objek tidak terlalu kecil.
- Toolbox coral, kabinet dusty teal, dan radio midnight navy mempunyai komponen SVG/CSS terpisah dan siluet berbeda.
- Link tidak memakai panel card, glass effect, stock image, atau generic gradient background.
- Paper grain dibuat melalui CSS dan seluruh ilustrasi dibuat sebagai inline SVG original.
- Motion hanya digunakan untuk entrance singkat serta state hover/focus yang bermakna. Reduced-motion menonaktifkan perpindahan objek.
- Registry menyimpan title, path, description, dan visible action; JSX preview tetap berada di komponen.
- Route tema tetap placeholder dan belum mengandung state, media, audio, atau experience logic.

## Kompromi dan keputusan untuk tema pertama

- Token gallery adalah fondasi visual bersama, bukan skin untuk ketiga experience. Tiny Heart Repair Shop harus menentukan token dan interaction language miliknya sendiri.
- Preview toolbox hanya memberi petunjuk visual; struktur toolbox, heart state, dan repair tools untuk experience belum diputuskan.
- System font dipertahankan untuk MVP. Custom lettering hanya boleh dipertimbangkan jika dibuat original dan tetap mempunyai accessible text equivalent.
- Hosting production kelak membutuhkan SPA fallback untuk direct URL; tetap di luar scope milestone ini.

## Keputusan Tiny Heart Repair Shop Milestone 3

- Experience menggunakan satu repair bay yang berganti artefak kerja—work order, tag pegboard, prescription slip, meja repair, surat, lalu certificate—bukan rangkaian form atau halaman onboarding.
- Model state memakai phase eksplisit `arrival`, `diagnosis`, `prescription`, `repairing`, `reveal`, dan `certificate`. Reducer hanya menerima transition yang valid dan reset selalu kembali ke work order awal.
- Konfigurasi typed `heartConditions` adalah sumber tunggal untuk empat diagnosis. Setiap diagnosis membawa satu prescription, visual outcome, pesan reveal, dan label treatment certificate sehingga tidak ada matrix tool yang ambigu.
- Repair memakai Motion pointer drag menuju target hati, dengan native button `Gunakan [nama alat]` sebagai alternatif keyboard dan assistive technology. Keduanya menjalankan transition reducer yang sama.
- Fokus dipindahkan ke heading scene saat phase berganti; pengumuman ringkas memakai live region. SVG ilustratif disembunyikan dari accessibility tree dan visual state tetap mempunyai teks pendukung.
- Reduced motion menghapus perpindahan scene dan membuka reveal secara langsung setelah repair, tanpa menghilangkan alternatif non-drag atau informasi state.

## Risiko dan kompromi untuk review Milestone 3

- Ilustrasi CSS/SVG dibuat sebagai material workshop MVP; review visual perlu memastikan ukuran tool dan heart tetap nyaman pada perangkat 320px dengan jari pengguna nyata.
- Drag target memakai bounding box dengan padding agar forgiving untuk touch. Jika pengujian perangkat nyata menunjukkan terlalu mudah atau terlalu sulit, radius target adalah penyetelan pertama tanpa mengubah state model.
- Reveal otomatis setelah repair sengaja singkat (760 ms) agar terasa responsif. Timing dan tone motion masih perlu dikonfirmasi pada review visual sebelum milestone berikutnya.

## Artefak visual Milestone 3

- Screenshot disimpan pada `artifacts/milestone-3/`. Angka viewport dalam nama file—misalnya `390x844` dan `1280x800`—menunjukkan viewport yang dipakai saat capture.
- Capture memakai `fullPage`, sehingga dimensi akhir file dapat lebih tinggi daripada angka viewport pada nama file. Screenshot normal dibuat melalui pointer flow yang terisolasi; `heart-skip-link-focus-390x844.png` secara sengaja menunjukkan state focus keyboard skip link.

## Keputusan The Things You Left With Me Milestone 4

- Claim code typed `0427` berada pada `lostAndFoundContent`, bersama empat record kabinet typed: SOUND, SUNDAY, COURAGE, dan HOME. Setiap record memuat label kabinet, accessible name, visual key, dan seluruh copy inspection.
- Reducer memakai phase `arrival`, `claim-ticket`, `verification`, `cabinet`, `inspecting`, `finale`, dan `receipt`. Empty atau wrong claim tidak dapat masuk kabinet; record yang sama tidak dapat menggandakan progress.
- Laci UNRETURNABLE hanya unlock ketika empat ID required telah terbuka. Receipt dapat kembali ke kabinet dengan record final tetap completed.
- Inspection bukan modal: close mengembalikan focus ke handle laci pembuka dengan `useLayoutEffect`; transition scene lain memfokuskan heading setelah mount. Direct route tidak memaksa focus sehingga Tab pertama tetap menuju skip link.
- Visual memakai dusty teal, walnut, aged paper, brass, dan burgundy. Kabinet, stamp ticket, dan inspection counter membentuk satu office scene; tidak memakai heart character atau palette workshop Heart Repair.

## Risiko dan kompromi untuk review Milestone 4

- Artefak dibuat sebagai SVG/CSS original agar prototype tidak membutuhkan media eksternal. Ukuran dan detail visual perlu dikonfirmasi pada perangkat sentuh nyata, terutama drawer handle pada 320px.
- Form verification sengaja tidak memiliki loading state. Stempel benar/salah ditampilkan sebagai text state langsung agar flow tetap cepat dan mudah diakses.
- Receipt kembali ke kabinet mempertahankan record completed, tetapi tidak memutar ulang artifact reveal otomatis; pengguna tetap memilih laci yang ingin diperiksa lagi.

## Artefak visual Milestone 4

- Screenshot disimpan pada `artifacts/milestone-4/`. Angka viewport pada nama file menunjukkan viewport capture, bukan selalu dimensi file, karena screenshot memakai `fullPage`.

## Keputusan 11:11 Midnight Radio Milestone 5

- Radio memakai reducer typed dengan phase `arrival`, `tuning`, `fragment`, `private-unlock`, `final-broadcast`, dan `qsl`. Waktu naratif dihitung murni dari jumlah sinyal unik: `11:08`, `11:09`, `11:10`, lalu `11:11`; tidak bergantung pada jam sistem.
- Frekuensi direpresentasikan sebagai integer tenths (`880` sampai `1080`) agar tampilan dan status sinyal tidak memakai perbandingan floating point. Tiga broadcast typed menjadi sumber tunggal frekuensi, clue, transcript, dan urutan progres.
- Range input native menyediakan `aria-valuetext`, Arrow key, serta tombol perubahan `0.1`; tombol capture hanya tersedia saat status tekstual `SIGNAL LOCKED`. Log received dan lampu konsol menggantikan progress bar.
- Scene radio memakai casing painted navy, jendela kaca frekuensi, grille speaker, knob, dan kartu kertas QSL yang berbeda dari certificate Heart Repair maupun receipt Lost & Found. SVG dekoratif disembunyikan dari accessibility tree.
- Ambience Web Audio bersifat optional dan default OFF. Tombol eksplisit mengaktifkan oscillator volume rendah setelah user gesture; toggle off, replay, kegagalan inisialisasi, dan unmount menghentikan node, memutus koneksi, lalu menutup `AudioContext`. Seluruh pesan tetap tersedia sebagai teks.
- Direct route tidak memaksa focus; scene setelah transition memfokuskan heading. Live region hanya mengumumkan perubahan phase penting, bukan setiap perubahan range.
- Audit contrast private-unlock memakai foreground `#343149` di atas paper cream `#f5e8ca` dengan rasio **10.28:1**. Defect sebelumnya berasal dari reuse `.body` dark-stage `#d7d9df` di atas paper cream (1.16:1), bukan opacity, Motion, overlay, atau grain. Regression E2E memeriksa computed color, opacity `1`, visibility, hit-testing overlay, dan rasio minimal 4.5:1 setelah state stabil. Audit terbatas juga mengubah label QSL menjadi `#59616c` pada cream (5.16:1); fragment/final transcript `#3f3b4c` (8.90:1), QSL closing line `#506b73` (4.68:1), serta body tuning `#d7d9df` di navy `#10182d` (12.50:1) tetap memenuhi target.

## Risiko dan kompromi untuk review Milestone 5

- Ambience adalah tone sintetis ringan, bukan simulasi static audio realistis atau musik. Pengujian perangkat nyata masih perlu memverifikasi volume dan kebijakan autoplay browser yang berbeda; flow tetap lengkap jika Web Audio ditolak.
- Tuning dibuat forgiving dengan toleransi satu integer tenth untuk `SIGNAL LOCKED`; detail ini dapat disetel tanpa mengubah reducer atau copy.
- Screenshot Milestone 5 memakai `fullPage`. Nama seperti `390x844` dan `1280x800` menyatakan viewport capture, sedangkan tinggi file dapat lebih besar.

## Artefak visual Milestone 5

- Screenshot disimpan pada `artifacts/milestone-5/`, termasuk state arrival, powered, locked, fragment, private unlock (`radio-three-received-390x844.png` dan `radio-three-received-1280x800.png`), final broadcast, dan QSL card.

## Definition of done Milestone 1

- Project dapat dijalankan dengan npm.
- Home, tiga theme route, dan Not Found tersedia.
- Direct URL, semantic link, dan browser Back berfungsi.
- Typed theme registry menjadi sumber metadata tema.
- Global focus state, skip link, route announcement, dan reduced-motion tersedia.
- Tidak ada horizontal overflow pada viewport 320px.
- Lint, typecheck, unit test, build, dan Chromium smoke test lulus.
- README dan project instructions tersedia.
- Tidak ada implementasi gallery final atau pengalaman tema.
