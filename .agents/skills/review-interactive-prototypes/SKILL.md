---
name: review-interactive-prototypes
description: Audit, compare, score, and rank interactive digital-gift prototypes from a local repository, locally running app, screenshots, recordings, or Playwright tests and traces. Use when Codex needs a read-only launch-readiness review covering experience flow, responsive behavior, motion, accessibility, robustness, sellability, personalization, evidence-backed findings, and user-test planning.
---

# Review Interactive Prototypes

Lakukan audit read-only terhadap prototype digital gift. Jangan mengubah source code, konfigurasi aplikasi, test, atau aset. Jangan menyatakan skor AI sebagai bukti adanya permintaan pasar.

## Persiapan

1. Baca [references/review-rubric.md](references/review-rubric.md) sepenuhnya sebelum memberi skor.
2. Nyatakan batasan bukti sejak awal: repository, URL live lokal, screenshot, rekaman layar, hasil Playwright, dan/atau trace yang benar-benar tersedia.
3. Inventarisir prototype dan route dari router/registry aplikasi, entry point, serta test yang relevan. Jangan menganggap satu komponen sebagai prototype terpisah tanpa route atau flow yang berbeda.
4. Bila aplikasi dapat dijalankan tanpa mengubah proyek, jalankan dengan perintah yang tersedia di repository. Lakukan inspeksi visual live bila tersedia; gunakan Playwright/test/trace sebagai bukti pelengkap.
5. Bila aplikasi lokal dan Playwright tersedia, usahakan membuat trace atau recording dari flow yang diaudit tanpa mengubah source application. Gunakan artefak itu hanya sebagai bukti review.
6. Jika tidak ada inspeksi visual live, rekaman layar, atau trace yang memperlihatkan animasi, tulis persis `Motion Quality: N/A — insufficient evidence`. Screenshot statis, duration/easing di source, dan test yang hanya membuktikan completion tidak cukup untuk memberi nilai Motion Quality.

## Audit setiap prototype

Telusuri flow dari keadaan awal hingga payoff, termasuk pengulangan bila ada. Periksa desktop dan mobile secara terpisah. Untuk setiap mode yang bisa dinilai, uji atau telusuri:

- kejelasan first impression dan ajakan/interaksi pertama;
- pointer/tap, keyboard, urutan Tab, Enter/Space, Escape bila relevan, serta focus visible;
- error, empty, loading, atau fallback state yang memang dapat dijangkau; jangan mengarang state yang tidak ada;
- replay/reset dan apakah state kembali dapat dipahami;
- `prefers-reduced-motion`, termasuk apakah pengalaman inti tetap dapat digunakan;
- overflow horizontal dan clipping pada viewport mobile serta desktop;
- kontras, label, semantic HTML, target interaksi, pengumuman status, dan kemampuan memakai tanpa pointer;
- kualitas motion dari pengalaman langsung: tujuan animasi, hierarchy, timing, easing, kontinuitas, respons terhadap input, dan penghormatan reduced motion;
- daya jual: proposition hadiah, momen emosional, ruang personalisasi, dan kejelasan apa yang akan diterima pembeli.

Gunakan viewport yang relevan dengan proyek; bila tidak ada ketentuan, catat ukuran viewport yang dipakai dan minimal periksa satu desktop lebar serta satu mobile sempit. Catat langkah reproduksi singkat dan artefak pendukung untuk setiap pengurangan skor.

## Skor dan peringkat

Nilai memakai rubric pada referensi. Bobot kategori adalah: first-impression clarity 15%, emotional payoff 20%, originality 15%, usability 15%, motion quality 15%, accessibility dan robustness 10%, sellability dan personalization 10%.

- Beri nilai mentah 0–10 hanya untuk dimensi dengan bukti yang cukup. Setiap nilai di bawah 10 wajib memiliki bukti spesifik: observasi, langkah reproduksi, viewport, artefak, atau batasan bukti. Jangan memakai frasa umum seperti “terasa kurang”.
- Jika Motion Quality tidak memiliki inspeksi visual live, video, atau trace yang memperlihatkan animasi, jangan beri angka untuk Motion Quality dan jangan memberi skor final. Tulis persis `Motion Quality: N/A — insufficient evidence`.
- Hitung `provisional score` dari kategori bernilai saja: jumlahkan kontribusi terbobotnya, bagi dengan total bobot kategori yang memiliki bukti, lalu kalikan 100. Labeli hasil sebagai `Provisional score`, bukan skor final; tampilkan bobot yang dikecualikan.
- Jangan menyatakan motion sudah baik atau memberi pengurangan/pujian Motion Quality hanya dari duration, easing, atau deklarasi animasi di source code. Source boleh dipakai untuk merencanakan bukti yang masih diperlukan.
- Bedakan kualitas yang buruk dengan bukti yang tidak cukup. Bukti tidak cukup bukan kegagalan; tandai sebagai `insufficient evidence`, jelaskan apa yang kurang, dan jangan mengubahnya menjadi klaim negatif.
- Urutkan berdasarkan experience readiness dan provisional score berbasis bukti, bukan ukuran pasar. Jelaskan bila ranking dipengaruhi ketidakpastian bukti.

## Format laporan wajib

Tulis laporan dalam Bahasa Indonesia, ringkas tetapi dapat ditindaklanjuti, dengan bagian berikut dalam urutan ini:

1. `Verdict` — pisahkan `Experience readiness`, `Commercial readiness`, dan `Motion confidence`; tiap verdict harus memuat alasan serta batasan bukti. Commercial readiness bukan klaim permintaan pasar.
2. `Evidence yang diperiksa` — daftar artefak/route/viewport dan yang tidak tersedia.
3. `Score breakdown` — tabel per prototype berisi nilai mentah kategori yang memiliki bukti, `Motion Quality: N/A — insufficient evidence` bila berlaku, formula provisional score, bobot yang dikecualikan, dan tanpa skor final bila motion N/A.
4. `Ranking prototype` — urutan experience readiness berbasis bukti beserta alasan satu kalimat per prototype; jangan jadikan ini klaim kesiapan pasar.
5. `Temuan setiap prototype` — kelompokkan persis sebagai `Blocker`, `High Impact`, dan `Polish`; setiap temuan berisi bukti dan dampak.
6. `Evaluasi animasi` — per prototype, dengan bukti langsung atau label `insufficient evidence`.
7. `Masalah accessibility` — daftar lintas prototype atau per prototype, beserta dampak pengguna dan bukti.
8. `Rekomendasi prioritas` — maksimal lima tindakan, diurutkan dari dampak tertinggi; jangan menyarankan perubahan kode bila tugas hanya review.
9. `Rencana pengujian 10 target pengguna` — jelaskan rekrutmen, segmentasi, skenario tugas, metrik, pertanyaan, dan kriteria keputusan tanpa mengklaim validasi pasar.

Jangan memberikan verdict siap tanpa menyebut apakah seluruh flow utama, mobile, desktop, dan bukti motion telah diperiksa. Bila materi tidak memadai, berikan verdict bersyarat dan langkah bukti minimum berikutnya.
