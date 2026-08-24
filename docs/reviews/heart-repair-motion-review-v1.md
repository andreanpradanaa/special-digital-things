# Tiny Heart Repair Shop — Motion Review v1

**Route:** `/heart-repair`  
**Lingkup:** kualitas animasi, feedback interaksi, dan continuity saja. Review ini tidak menilai ulang kategori lain atau prototype lain.

## Verdict

- **Experience readiness:** tetap **Siap untuk uji terbatas**. Motion tidak mengubah verdict review sebelumnya; ada satu High Impact khusus reduced motion yang perlu diamati dalam sesi pengguna.
- **Commercial readiness:** tidak dinilai ulang. Review motion ini bukan bukti demand pasar atau kesiapan komersial.
- **Motion confidence:** **Tinggi** untuk flow yang direkam: empat rekaman/trace menutup normal dan reduced motion pada 390×844 serta 1280×800, dengan diagnosis yang sama. Kepercayaan ini tidak mencakup performa perangkat pengguna nyata.

## Evidence yang berhasil diperiksa

Semua run memakai diagnosis **“Hari ini tidak berjalan baik”** dan menuju **Emergency Hug Patch** / personal reveal **“Satu hari tidak menentukan semuanya.”**

| Run | Viewport | Interaksi repair | Bukti | Hasil runtime |
| --- | --- | --- | --- | --- |
| `mobile-normal` | 390×844 | Pointer drag dengan jeda antar-aksi | video, trace, 32 screenshot | selesai dalam 9.89 dtk; tanpa console/page error |
| `mobile-reduced` | 390×844 | Tombol alternatif | video, trace, 12 screenshot | selesai dalam 6.78 dtk; tanpa console/page error |
| `desktop-normal` | 1280×800 | Pointer drag dengan jeda antar-aksi | video, trace, 32 screenshot | selesai dalam 10.36 dtk; tanpa console/page error |
| `desktop-reduced` | 1280×800 | Tombol alternatif | video, trace, 12 screenshot | selesai dalam 6.87 dtk; tanpa console/page error |

Evidence berada di [artifacts/heart-repair-motion-review](../../artifacts/heart-repair-motion-review/), termasuk [manifest](../../artifacts/heart-repair-motion-review/manifest.json), empat `.zip` trace, empat `.webm` recording, serta screenshot phase dan frame transisi. Recording dikodekan 25 fps; ini cukup untuk meninjau kontinuitas visual pada rekaman, tetapi bukan benchmark performa perangkat nyata.

Contoh evidence yang diperiksa langsung:

- Normal mobile: [drag in progress](../../artifacts/heart-repair-motion-review/mobile-normal/07-drag-in-progress.png), [feedback sukses](../../artifacts/heart-repair-motion-review/mobile-normal/08-success-feedback-to-reveal-02.png), dan [reveal settled](../../artifacts/heart-repair-motion-review/mobile-normal/09-personal-reveal.png).
- Normal desktop: [diagnosis setelah transisi](../../artifacts/heart-repair-motion-review/desktop-normal/01-arrival-to-diagnosis-04.png), [feedback sukses](../../artifacts/heart-repair-motion-review/desktop-normal/08-success-feedback-to-reveal-02.png), dan [reveal settled](../../artifacts/heart-repair-motion-review/desktop-normal/09-personal-reveal.png).
- Reduced mobile dan desktop: [reveal mobile](../../artifacts/heart-repair-motion-review/mobile-reduced/09-personal-reveal.png), [reveal desktop](../../artifacts/heart-repair-motion-review/desktop-reduced/09-personal-reveal.png), dan [certificate desktop](../../artifacts/heart-repair-motion-review/desktop-reduced/11-certificate.png).

## Normal versus reduced motion

| Aspek | Normal motion | Reduced motion |
| --- | --- | --- |
| Click dan perpindahan scene | **Observed:** arrival → diagnosis → prescription → repair → reveal → certificate memudar/masuk secara kontinu pada 390×844 dan 1280×800. Frame 70 ms menunjukkan opacity dan perpindahan berlangsung bertahap; frame sekitar 280 ms sudah stabil. Tidak terlihat layout shift acak atau visual jump di rekaman. | **Observed:** tiap scene muncul sudah stabil dalam capture 100 ms; semua scene utama sampai certificate hadir, tanpa penantian visual yang tidak perlu. |
| Drag dan target repair | **Observed:** tool mudah ditemukan di meja repair, drag menuju hati terbaca, dan selepas drop patch menempel pada hati serta kartu status berubah dari `Tool ready` ke `Handled with care`. Tidak terlihat snap/teleport sebelum drop. | **Observed:** tombol alternatif menyelesaikan flow dan reveal/certificate tetap muncul. Drag tidak direkam pada mode ini karena tujuan run adalah kejelasan tanpa gerak. |
| Feedback repair berhasil | **Observed:** patch di hati dan kartu status memberi konfirmasi visual. Namun pesan sukses berbentuk teks berada di bawah area meja repair pada kedua viewport, sehingga tidak tampak dalam jendela yang sedang dilihat selama jeda sebelum reveal. | **Observed:** capture 100 ms setelah aktivasi sudah berada di personal reveal; tidak ada frame yang memperlihatkan feedback sukses repair secara visual. Ini adalah gap kejelasan reduced motion. |
| Jeda sebelum reveal | **Observed:** ada jeda yang cukup untuk melihat patch dan kartu status berubah, lalu exit/enter tetap mulus menuju surat. Jeda memberi napas, tetapi karena pesan sukses teks tidak terlihat, sebagian payoff bergantung pada patch dan label kecil. | **Observed:** tidak ada delay yang menahan pengguna; reveal muncul langsung. Kejelasan naratif berkurang karena konfirmasi repair tidak sempat terlihat. |
| Penekanan emosional reveal | **Observed:** reveal settled menempatkan hati yang telah dipatch bersebelahan dengan surat; pada desktop keduanya tampil utuh dalam satu komposisi. Motion masuk tetap sama dengan scene lain, jadi penekanan emosional terutama berasal dari komposisi, copy, dan patch—bukan motion khusus. | **Observed:** surat dan hati tetap hadir lengkap; tanpa gerakan, komposisi masih jelas dan dapat dibaca. |

## Motion Quality score

**7.5/10**

Pengurangan 2.5 poin didukung bukti recording/trace, bukan source code:

- **−1.5:** feedback keberhasilan visual tidak terlihat secara eksplisit pada reduced motion; run reduced sudah menampilkan personal reveal dalam 100 ms setelah repair diaktifkan.
- **−1.0:** pada normal motion, patch dan kartu status terlihat, tetapi pesan sukses teks berada di luar viewport repair. Jeda sebelum reveal tidak memberi konfirmasi lengkap pada layar yang sama.

Tidak ada skor kategori lain atau total skor yang diubah oleh review ini.

## Observed, Inferred, dan Unvalidated

### Observed

- Empat recording/trace menyelesaikan arrival, diagnosis, prescription, repair, feedback/reveal, dan certificate tanpa console/page error.
- Normal motion pada kedua viewport tidak memperlihatkan visual jump atau stutter yang tampak dalam video 25 fps; transisi antar-scene stabil dan feedback patch tersambung secara visual dengan pilihan `Emergency Hug Patch`.
- Reduced motion mempertahankan semua scene utama dan menghapus penantian antar-scene, tetapi menghilangkan kesempatan melihat feedback repair berhasil.

### Inferred

- Karena perubahan visual patch, status counter, dan surat memakai objek/narasi yang sama, continuity cerita kemungkinan mudah dipahami saat pengguna melihat seluruh flow pada kecepatan serupa recording.
- Penekanan emosional reveal cukup ditopang oleh layout dan copy, tetapi motion saat ini lebih bersifat penghubung scene daripada klimaks tersendiri.

### Unvalidated

- Jank pada perangkat mobile fisik, perangkat berdaya rendah, atau refresh rate di luar video capture 25 fps.
- Apakah jeda normal motion terasa tepat bagi pengguna nyata, bukan hanya dalam playback scripted dengan jeda antar-aksi.
- Apakah pembaca layar menerima live announcement repair sukses sebelum state reduced motion segera berganti ke reveal; ini bukan audit assistive technology.

## Temuan motion

### Blocker

Tidak ada Blocker yang terlihat pada empat recording/trace.

### High Impact

1. **Reduced motion melewati feedback sukses repair secara visual.** Bukti: `mobile-reduced/08-success-feedback-to-reveal-00.png` dan `desktop-reduced/08-success-feedback-to-reveal-00.png` sudah menampilkan personal reveal 100 ms setelah repair diaktifkan; tidak ada frame feedback sukses yang terlihat. Dampak: pengguna reduced motion masih menyelesaikan flow, tetapi kehilangan konfirmasi sebab-akibat antara tindakan repair dan surat yang dibuka.

### Polish

1. **Konfirmasi sukses normal tidak lengkap dalam viewport repair.** Bukti: screenshot feedback normal memperlihatkan patch dan status card, tetapi teks keberhasilan berada setelah area repair yang tidak tampak pada 390×844 maupun 1280×800. Dampak: jeda sebelum reveal terasa lebih bermakna bila konfirmasi sukses dapat dibaca tanpa scroll.
2. **Reveal tidak memiliki motion signature tersendiri.** Bukti: frame transition normal memakai pola fade/masuk yang sama dengan scene sebelumnya; komposisi akhir kuat, tetapi motion tidak menambah aksen khusus pada payoff. Dampak: polish emosional terbatas, bukan masalah completion.

## Rekomendasi prioritas

1. Pastikan reduced motion tetap memberi konfirmasi repair yang dapat dilihat sebelum atau saat personal reveal muncul, tanpa menambah delay yang tidak perlu.
2. Pastikan pesan sukses repair terbaca dalam viewport yang sama dengan patch/status pada normal motion.
3. Uji dua variasi penekanan reveal dengan pengguna setelah dua masalah kejelasan di atas ditangani; jangan menganggap motion yang lebih banyak otomatis lebih emosional.

## Kelayakan motion untuk user testing

**Ya, cukup baik untuk user testing terbatas.** Normal motion sudah memiliki bukti langsung di mobile dan desktop, drag memberi respons yang koheren, dan reduced motion tidak menyembunyikan scene utama. Uji pengguna harus secara khusus mengamati apakah pengguna reduced motion memahami bahwa repair berhasil, serta apakah peserta normal menangkap feedback sukses sebelum reveal.
