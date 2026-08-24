# Rubrik Review Interactive Prototypes

## Bukti dan batasannya

Gunakan hanya bukti yang benar-benar diperiksa. Cantumkan sumber untuk tiap temuan: route/berkas, URL lokal dan langkah reproduksi, viewport, screenshot atau timecode rekaman, hasil test, atau trace Playwright.

| Sumber | Dapat mendukung | Tidak cukup untuk membuktikan |
| --- | --- | --- |
| Repository | struktur route, markup, handler, state yang terbaca, reduced-motion yang diimplementasikan | perilaku runtime yang belum dijalankan, rasa timing animasi |
| App lokal dengan inspeksi visual | flow end-to-end, input, focus, responsivitas, motion, replay, overflow | minat pasar nyata |
| Screenshot | hierarchy dan layout pada viewport tertentu | kualitas motion, interaksi keyboard, flow lengkap |
| Rekaman layar | flow yang direkam, kualitas motion yang terlihat | semua breakpoint atau state yang tidak direkam |
| Test Playwright | langkah, assertion, error runtime, jejak interaksi | kualitas estetika/motion yang tidak direkam atau diverifikasi |
| Trace/recording Playwright | flow dan animasi yang benar-benar terekam | breakpoint atau state yang tidak ada di artefak |

Jika tidak ada inspeksi visual live, rekaman layar, atau trace yang memperlihatkan animasi, tulis persis `Motion Quality: N/A — insufficient evidence`. Jangan memberi angka Motion Quality, skor final, atau klaim kualitas motion dari source, screenshot, duration/easing, maupun test completion.

Jika aplikasi lokal dan Playwright tersedia, usahakan menjalankan flow yang relevan dengan trace atau recording aktif tanpa mengubah source application. Jika pembuatan artefak tidak tersedia/gagal, catat alasannya sebagai batasan bukti.

## Dimensi skor

Nilai mentah tiap dimensi dengan bukti cukup adalah 0–10. Mulai dari 10 dan kurangi hanya bila ada bukti spesifik. Jika suatu dimensi tidak dapat dibuktikan, gunakan `insufficient evidence` dan jelaskan; jangan mengisi nilai negatif berdasarkan dugaan.

| Dimensi | Bobot | Nilai 10 | Contoh bukti yang menurunkan nilai |
| --- | ---: | --- | --- |
| First-impression clarity | 15% | Dalam beberapa detik pengguna memahami hadiah, aksi pertama, dan hasil yang dijanjikan. | CTA ambigu, affordance tersembunyi, atau layar awal tidak menjelaskan tujuan. |
| Emotional payoff | 20% | Ada buildup dan payoff yang terasa personal, jelas, dan memuaskan. | Payoff tidak terlihat setelah flow selesai, copy generik, atau anticlimax yang dapat direproduksi. |
| Originality | 15% | Konsep, interaksi, atau framing memiliki karakter yang membedakan tanpa mengorbankan kejelasan. | Flow/visual klise tanpa twist yang teramati, atau mekanik tidak mendukung ide hadiah. |
| Usability | 15% | Flow mudah dipelajari, state dapat dipulihkan, dan input utama konsisten. | Tap/click gagal, instruksi hilang, reset membingungkan, atau state error menghambat completion. |
| Motion quality | 15% | Motion memperjelas sebab-akibat dan hierarchy, halus, tepat waktu, serta aman pada reduced motion. | Stutter yang terlihat, transisi menghalangi input, timing mengurangi payoff, atau reduced motion merusak flow. |
| Accessibility dan robustness | 10% | Semantik, keyboard, focus, kontras, responsivitas, fallback, dan overflow mendukung penggunaan andal. | Focus tidak terlihat, keyboard trap, kontrol tanpa nama, overflow horizontal, atau fallback gagal. |
| Sellability dan personalization | 10% | Nilai sebagai hadiah, penerima, momen, serta ruang personalisasi mudah dipahami. | Manfaat hadiah tidak jelas, personalisasi tidak tampak/bermakna, atau hasil terasa sulit dibagikan/dipahami. |

### Aturan Motion Quality dan provisional score

- Hanya beri nilai Motion Quality bila ada inspeksi visual live, video, atau trace yang menunjukkan animasi. Source code, screenshot statis, serta test yang selesai lulus tidak memenuhi syarat ini.
- Tanpa bukti tersebut, tulis `Motion Quality: N/A — insufficient evidence`; jangan menghitung skor final dan jangan menyatakan motion baik/buruk.
- Untuk kategori lain yang memiliki bukti, hitung `provisional score = (Σ(nilai mentah / 10 × bobot kategori berbukti) / Σ(bobot kategori berbukti)) × 100`. Bulatkan ke bilangan bulat terdekat dan tulis bobot yang dikecualikan.
- `Provisional score` mengukur hanya kategori berbukti; tidak setara dengan skor final dan tidak boleh dipakai untuk mengaburkan gap motion.

## Verdict terpisah dan ranking

| Verdict | Kondisi panduan |
| --- | --- |
| Experience readiness: Belum siap | Ada Blocker, flow inti tidak dapat selesai, atau bukti minimum flow utama tidak tersedia. |
| Experience readiness: Siap untuk uji terbatas | Tidak ada Blocker yang diketahui; pengalaman inti dapat diselesaikan, tetapi ada High Impact atau ketidakpastian penting. |
| Experience readiness: Siap | Tidak ada Blocker/High Impact dalam bukti yang diperiksa dan pengalaman inti terverifikasi desktop serta mobile. |
| Commercial readiness: Belum terbukti | Proposition hadiah, personalisasi, atau konteks pembeli belum dapat dinilai; ini bukan penilaian demand pasar. |
| Commercial readiness: Siap dieksplorasi | Nilai hadiah dan personalisasi dapat dijelaskan, tetapi belum ada riset pengguna/pasar yang mengonfirmasi demand. |
| Motion confidence: Insufficient evidence | Tidak ada inspeksi visual live, video, atau trace yang memperlihatkan animasi. |
| Motion confidence: Terbatas / Tinggi | Ada bukti animasi langsung; gunakan `Terbatas` bila cakupan flow/viewport tidak lengkap dan `Tinggi` bila cukup lengkap. |

Urutkan berdasarkan: (1) tidak adanya Blocker, (2) experience readiness, (3) provisional score berbasis bukti, (4) usability + accessibility dan robustness, (5) emotional payoff + sellability dan personalization, lalu (6) kelengkapan bukti. Ranking mengukur kesiapan pengalaman untuk diuji, bukan ukuran atau kepastian permintaan pasar.

## Klasifikasi temuan

| Tingkat | Definisi | Contoh |
| --- | --- | --- |
| Blocker | Menghalangi pengguna sasaran menyelesaikan payoff utama, membuat flow inti tidak dapat dipakai, atau menciptakan risiko aksesibilitas/robustness yang serius. | Kontrol utama tak dapat diaktifkan keyboard, halaman crash sebelum payoff, keyboard trap, atau konten utama tak dapat diakses pada mobile. |
| High Impact | Tidak memblokir semua pengguna, tetapi secara nyata menurunkan completion, kejelasan, payoff, atau kesiapan uji. | CTA utama ambigu, replay kehilangan konteks, horizontal overflow, reduced motion membuat flow esensial hilang. |
| Polish | Penyempurnaan dengan dampak terbatas terhadap completion atau makna inti. | Ritme easing sedikit tidak konsisten, microcopy kurang rapat, atau alignment minor. |

Jangan menaikkan severity tanpa menjelaskan pengguna terdampak, langkah reproduksi, dan dampak flow.

## Template bukti pengurangan skor

Gunakan format: `Dimensi — pengurangan N/10. Bukti: [artefak] pada [route/viewport/langkah] menunjukkan [observasi]. Dampak: [pengguna/flow].`

Contoh: `Usability — pengurangan 2/10. Bukti: app lokal, /surprise, 390×844; setelah menekan Replay, layar kembali ke langkah kedua tanpa instruksi. Dampak: pengguna baru tidak tahu cara memulai ulang.`

## Rencana uji dengan minimal 10 target pengguna

Usulkan minimal 10 orang, bukan sampel representatif pasar. Rekrut pengguna yang relevan dengan konteks hadiah dan bagi ke 2–3 segmen yang beralasan (misalnya pembeli hadiah digital, penerima, dan pengguna dengan preferensi aksesibilitas). Jangan mengklaim hasilnya akan membuktikan market demand.

Cantumkan:

1. tujuan dan hipotesis yang diuji;
2. kriteria rekrutmen, segmentasi, dan jumlah tiap segmen (total minimal 10);
3. perangkat: campuran mobile dan desktop, plus minimal satu sesi keyboard-only dan satu sesi reduced-motion;
4. skenario tugas dari first impression sampai replay tanpa tutorial yang tidak realistis;
5. metrik: completion, waktu ke aksi pertama, salah langkah, kebutuhan bantuan, pemahaman payoff, dan rating keinginan memberi/menerima secara eksploratif;
6. pertanyaan wawancara singkat mengenai kejelasan, emosi, personalisasi, dan hambatan;
7. kriteria keputusan sebelum sesi: kondisi yang memicu iterasi, uji ulang, atau penghentian prototype.

Pisahkan observasi perilaku dari pernyataan niat beli. Temuan dari 10 sesi hanya sinyal eksploratif, bukan bukti permintaan pasar.
