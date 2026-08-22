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

1. **Project foundation dan quality harness** — shell, route, registry, styles dasar, accessibility global, unit test, Playwright, dan dokumentasi.
2. **Global design foundation dan theme gallery** — gallery final yang bukan generic card grid.
3. **Tiny Heart Repair Shop** — pengalaman pertama end-to-end.
4. **The Things You Left With Me** — pengalaman kedua end-to-end.
5. **11:11 Midnight Radio** — pengalaman ketiga termasuk audio controls dan fallback.
6. **Asset integration dan interaction polish**.
7. **Cross-browser, accessibility, responsive, dan final regression**.

Milestone tidak dilanjutkan sebelum milestone aktif dapat dijalankan, dilihat, diuji, dan direview.

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
