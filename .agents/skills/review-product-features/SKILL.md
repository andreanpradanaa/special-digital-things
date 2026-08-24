---
name: review-product-features
description: Audit feature set untuk tepat satu produk digital dan satu route, lalu menentukan fitur yang perlu dipertahankan, ditambahkan, ditunda, atau dihindari tanpa mengubah source code. Gunakan untuk interactive digital gifts, romantic keepsakes, surprise websites, digital invitation experiences, dan personalized web products saat pengguna meminta product-feature review, prioritisasi roadmap, gap analysis, atau rekomendasi fitur berdasarkan kebutuhan buyer, recipient, dan seller/operator.
---

# Review Product Features

Audit produk secara read-only. Fokuskan rekomendasi pada kebutuhan nyata dan evidence dari implementasi, laporan review, serta konteks yang tersedia—bukan asumsi bahwa ide AI adalah market demand.

## Guardrails

- Tetapkan **satu** product dan **satu** route sebelum mulai. Jika belum jelas dari permintaan atau repository, minta pengguna memilihnya; jangan membandingkan product.
- Jangan mengedit source code, konfigurasi, data, atau laporan yang ada.
- Bedakan selalu tiga peran: buyer (membeli dan mempersonalisasi), recipient (menerima dan menjalankan experience), serta seller/operator (menyiapkan, mengirim, dan mengelola pesanan).
- Jangan menentukan harga atau monetisasi; itu berada di scope Product Marketing.
- Jangan merekomendasikan fitur hanya karena menarik. Kaitkan setiap fitur dengan kebutuhan spesifik setidaknya satu peran.
- Pertimbangkan mobile, accessibility, privacy, expiration, serta biaya dan beban operasional. Hindari feature bloat.

## Workflow

1. Nyatakan target: nama product, route, dan evidence yang diperiksa. Cari route melalui `src/app/themeRegistry.ts`; baca implementasi product dan laporan review yang relevan. Jika tidak ada laporan, nyatakan ketiadaannya sebagai evidence gap.
2. Rumuskan product definition dalam 2–4 kalimat: janji experience, tujuan emosional, occasion, batasan yang terlihat, dan hasil yang diharapkan buyer/recipient.
3. Identifikasi target buyer, recipient, dan gifting occasion. Pisahkan fakta dari asumsi; tandai asumsi yang perlu diuji.
4. Inventarisasi fitur yang benar-benar ada. Cantumkan fitur, pengguna utama, bukti lokasi, serta tahap journey yang didukung. Jangan menganggap UI yang belum tersambung sebagai capability yang tersedia.
5. Temukan gap pada buyer customization, recipient experience, seller workflow, delivery/sharing, replay/keepsake, privacy/expiration, mobile, dan accessibility.
6. Formulasikan kandidat fitur sebagai masalah → capability → pengguna yang terbantu → hasil yang diharapkan. Evaluasi memakai framework di [references/feature-review-framework.md](references/feature-review-framework.md).
7. Kelompokkan kandidat menjadi Must Have, Should Have, Could Have, atau Avoid. Berikan alasan singkat dan evidence/assumption tag pada setiap item.
8. Pisahkan rekomendasi menjadi MVP, Version 1, dan Future experiment. MVP hanya mencakup capability minimum yang membuat nilai inti bisa diterima dan dijalankan dengan aman.
9. Pilih maksimal tiga fitur prioritas lintas roadmap. Untuk masing-masing, tulis product-level acceptance criteria dan validasi pengguna yang diperlukan.

## Evidence discipline

Labeli setiap klaim penting dengan salah satu status berikut:

- **Observed** — terlihat dalam source, route, test, atau laporan review.
- **Reported** — berasal dari feedback, analytics, atau brief yang disediakan pengguna.
- **Inferred** — kesimpulan wajar dari evidence; jelaskan dasar inferensinya.
- **Assumption to test** — belum terbukti dan wajib divalidasi dengan buyer, recipient, atau seller.

Jangan mengubah status assumption menjadi demand tanpa evidence baru. Jika evidence tidak cukup untuk menentukan prioritas, rekomendasikan riset atau user test kecil, bukan feature build.

## Required output

Tulis laporan dalam Bahasa Indonesia dengan urutan berikut:

1. **Product definition** — product, route, emotional goal, dan evidence reviewed.
2. **Target buyer, recipient, dan occasion** — kebutuhan utama dan assumption yang belum tervalidasi.
3. **Existing feature inventory** — tabel fitur yang ada, pengguna utama, journey, dan evidence.
4. **Feature gaps** — dikelompokkan menurut tujuh area gap pada workflow.
5. **Must / Should / Could / Avoid** — tabel dengan alasan dan status evidence.
6. **Buyer personalization map** — sebelum beli, saat personalisasi, preview/review, dan handoff/delivery.
7. **Seller operational requirements** — input/order prep, quality check, delivery, support, privacy/retention, dan exception handling.
8. **Value / Effort / Risk assessment** — nilai semua kandidat dengan rubric referensi, termasuk confidence.
9. **MVP, Version 1, dan Future roadmap** — capability per fase dan alasan penempatannya.
10. **Maksimal tiga rekomendasi fitur prioritas** — masalah, pengguna, outcome, evidence, dan alasan prioritas.
11. **Acceptance criteria tingkat produk** — criteria yang dapat diamati untuk setiap prioritas, tanpa merinci implementasi teknis.
12. **Hal yang harus divalidasi kepada pengguna** — hipotesis, siapa yang diuji, dan sinyal keputusan.

Gunakan tabel yang ringkas. Bedakan rekomendasi dari fakta, dan akhiri tanpa rencana implementasi.
