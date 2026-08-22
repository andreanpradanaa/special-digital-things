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
3. **Tiny Heart Repair Shop — implemented, awaiting visual review.** Pengalaman pertama end-to-end tersedia pada `/heart-repair`.
4. **The Things You Left With Me** — pengalaman kedua end-to-end.
5. **11:11 Midnight Radio** — pengalaman ketiga termasuk audio controls dan fallback.
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
