# Feature Review Framework

Gunakan kerangka ini saat menjalankan `review-product-features`. Ini adalah alat pengambilan keputusan, bukan bukti market demand.

## 1. Unit analisis

Audit satu product dan satu route saja. Baca source pada route tersebut, komponen yang dipakainya, tests yang relevan, dokumentasi product, dan laporan review. Catat path atau bagian dokumen sebagai evidence.

Gunakan tiga journey:

| Peran | Pertanyaan inti |
| --- | --- |
| Buyer | Bisakah saya memahami, mempersonalisasi, meninjau, lalu percaya diri mengirim hadiah ini? |
| Recipient | Bisakah saya membuka, memahami, menikmati, dan menyimpan momen ini dengan mudah dan aman? |
| Seller/operator | Bisakah saya menyiapkan, memeriksa, mengirim, mendukung, dan menangani pengecualian dengan beban yang wajar? |

## 2. Gap checklist

| Area | Cari kebutuhan atau kegagalan seperti |
| --- | --- |
| Buyer customization | identitas penerima, pesan, pilihan konten, preview, koreksi, consent |
| Recipient experience | context pembuka, alur emosional, kontrol pengalaman, aksesibilitas, mobile, completion |
| Seller workflow | brief/input, readiness check, QA, status, duplicate/rework, support |
| Delivery dan sharing | link handoff, instruksi penerima, timing, fallback, share boundary |
| Replay dan keepsake | re-open, memory return, saved state, commemorative summary |
| Privacy dan expiration | data minimization, audience control, expiry notice, revocation/deletion, sensitive content |
| Mobile dan accessibility | touch target, keyboard, focus, reduced motion, contrast, layar kecil, loading/failure state |

Sebut gap hanya jika terlihat ada kebutuhan pengguna atau risiko journey. “Belum ada” saja bukan alasan untuk menambahkan fitur.

## 3. Bentuk kandidat fitur

Tulis satu kalimat dengan format:

> Untuk **[peran]** yang perlu **[job/need]**, sediakan **[capability]** agar **[outcome]**. — *[evidence status]*

Contoh: “Untuk buyer yang ragu sebelum mengirim, sediakan preview experience yang jelas agar kesalahan personalisasi dapat diketahui sebelum handoff. — *Inferred dari tidak adanya titik review pada journey*”

Jangan menyebut solusi teknis kecuali diperlukan untuk memahami batasan atau risiko.

## 4. Prioritization rubric

Nilai setiap kandidat pada skala 1–5, lalu beri alasan satu frasa dan evidence status. Nilai bukan formula otomatis; gunakan judgement yang dapat diaudit.

| Dimensi | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Buyer value | Hampir tidak membantu keputusan/personalization | Membantu sebagian buyer | Menghapus hambatan atau kecemasan utama buyer |
| Recipient value | Hampir tak mengubah experience | Menambah kenyamanan atau kejelasan | Sangat menguatkan pengalaman inti atau aksesnya |
| Emotional fit | Tidak terkait janji emosional product | Mendukung suasana | Membuat momen utama terasa lebih personal/bermakna |
| Differentiation | Umum dan tidak khas | Sedikit membedakan | Memperkuat proposisi unik product |
| Implementation effort | Sangat kecil | Sedang/lintas beberapa bagian | Besar/berlapis atau memerlukan proses baru |
| Technical risk | Sangat rendah | Ada edge case/ketidakpastian | Sensitif terhadap reliability, privacy, atau platform |
| Confidence | Evidence langsung dan konsisten | Evidence sebagian/inferensi kuat | Hanya asumsi, evidence lemah, atau kontradiktif |

Untuk **confidence**, angka tinggi berarti ketidakpastian tinggi. Sertakan juga label `Observed`, `Reported`, `Inferred`, atau `Assumption to test`.

Gunakan tabel berikut:

| Kandidat | Peran utama | Buyer | Recipient | Emotional fit | Differentiation | Effort | Technical risk | Confidence | Keputusan |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |

Nilai tinggi pada value tidak otomatis menang: effort/risk/confidence harus memengaruhi keputusan. Jangan menyamarkan uncertainty melalui skor rata-rata.

## 5. MoSCoW dan roadmap

| Kelas | Gunakan bila | Bukan berarti |
| --- | --- | --- |
| Must Have | Tanpanya janji inti, trust, safety/privacy, atau penyelesaian experience gagal | Harus dibuat segera tanpa validasi |
| Should Have | Menghapus friksi penting atau meningkatkan kualitas inti setelah dasar aman | Must Have terselubung |
| Could Have | Bernilai tetapi tidak memengaruhi outcome inti saat ini | Backlog wajib |
| Avoid | Tidak menyelesaikan kebutuhan jelas, memperlebar scope, meningkatkan risiko, atau hanya novelty | Tidak boleh dieksplorasi di masa depan |

Tempatkan kemampuan menurut berikut:

| Fase | Kriteria |
| --- | --- |
| MVP | Minimum agar buyer dapat menyiapkan dan menyerahkan value inti, recipient dapat menjalankan experience, dan seller mampu mengoperasikan dengan aman. |
| Version 1 | Perbaikan bernilai tinggi setelah value inti terbukti; bukan syarat peluncuran awal. |
| Future experiment | Hipotesis dengan confidence rendah atau dependensi besar; uji kecil dahulu, tanpa komitmen build. |

## 6. Buyer personalization map

Audit alur buyer, bukan sekadar daftar field:

| Tahap | Kebutuhan buyer | Bukti/risiko yang dicari | Opportunity yang mungkin |
| --- | --- | --- | --- |
| Memilih | memahami untuk siapa dan kapan product cocok | ambiguity, promise tidak jelas | context occasion yang jelas |
| Mempersonalisasi | memasukkan detail bermakna dengan panduan | input membingungkan, content missing | guided input yang minimum dan relevan |
| Meninjau | mengecek hasil, tone, dan kesalahan | tidak ada preview/review | checkpoint sebelum handoff |
| Menyerahkan | yakin recipient bisa membuka pada waktu tepat | instruksi, timing, fallback hilang | handoff clarity dan delivery safety |

Jangan menyimpulkan tiap opportunity harus dibangun. Prioritaskan hanya yang menyelesaikan risiko terbesar yang ditemukan.

## 7. Seller operational requirements

Berikan requirement operasional tingkat produk, tanpa mendesain backend:

| Tahap | Requirement yang perlu jelas |
| --- | --- |
| Intake | informasi minimum untuk menyiapkan experience; batas konten dan consent |
| Preparation | definisi ready, pemeriksaan kelengkapan, dan penanganan materi sensitif |
| QA | verifikasi route/link, perangkat mobile, accessibility dasar, dan personalisasi benar |
| Delivery | pihak yang mengirim, waktu pengiriman, instruksi, dan fallback jika link gagal |
| Support | cara menangani salah recipient, revisi, link kedaluwarsa, dan pengalaman gagal dibuka |
| Privacy/retention | data yang perlu disimpan, siapa mengakses, kapan berakhir, dan tindakan atas permintaan penghapusan |

Catat requirement yang belum bisa dipenuhi oleh product saat ini sebagai risiko, bukan instruksi untuk membangun sistem baru.

## 8. Acceptance criteria tingkat produk

Tulis 2–4 criteria untuk setiap rekomendasi prioritas. Criteria harus observable oleh pengguna atau operator, misalnya:

- Buyer dapat memastikan detail personalisasi yang akan diterima sebelum menyerahkan hadiah.
- Recipient mengetahui tindakan berikutnya dan dapat menyelesaikan experience pada layar mobile tanpa bantuan eksternal.
- Operator dapat menentukan apakah experience siap dikirim dan mengidentifikasi kegagalan handoff.

Hindari nama komponen, endpoint, database, atau detail desain teknis.

## 9. Validasi yang diperlukan

Untuk setiap assumption bernilai tinggi, tulis:

| Hipotesis | Siapa yang diuji | Metode ringan | Sinyal keputusan |
| --- | --- | --- | --- |
| Buyer membutuhkan X sebelum mengirim | buyer pada occasion relevan | 5–7 interview atau prototype task | mayoritas berhasil/menyatakan X mengurangi keraguan |

Jangan mengklaim ukuran sampel atau ambang ini sebagai aturan universal. Sesuaikan dengan evidence, risiko privacy, dan tahap product.
