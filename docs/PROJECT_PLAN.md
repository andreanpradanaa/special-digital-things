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
2. **Global design foundation dan theme gallery — implemented, awaiting visual review.** Gallery menggunakan komposisi keepsake shelf dengan tiga preview object original.
3. **Tiny Heart Repair Shop** — pengalaman pertama end-to-end.
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
