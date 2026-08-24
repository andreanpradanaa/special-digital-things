# Tiny Heart Repair Shop — Review v1

**Route:** `/heart-repair`  
**Lingkup:** halaman, content/reducer, test Heart Repair, dan application shell yang memengaruhi route ini. Tidak ada prototype lain yang dinilai atau dibandingkan.

## Launch verdict

**Siap untuk uji terbatas.** Seluruh flow inti selesai pada Chromium melalui pointer dan alternatif keyboard, tanpa error runtime yang tertangkap; mobile dan desktop tidak memiliki horizontal overflow pada viewport yang diuji. Namun, dua temuan High Impact perlu dibawa sebagai risiko saat uji: replay tidak memindahkan focus ke konteks work order yang baru, dan CTA pertama tidak tampak pada viewport desktop 1280×800 tanpa scroll.

Prototype ini **layak diuji jual secara terbatas**, sebagai riset pengalaman dengan setidaknya 10 orang yang relevan. Skor ini menilai kesiapan pengalaman, bukan bukti adanya permintaan pasar.

## Evidence yang diperiksa

| Bukti | Hasil |
| --- | --- |
| Route dan shell | `src/app/router.tsx`, `src/app/AppShell.tsx`; `/heart-repair` memakai `AppShell`, termasuk skip link ke `<main>`. |
| Implementasi flow | `HeartRepairPage.tsx`, `heartRepairReducer.ts`, dan `heartRepairContent.ts`; tujuh tahap dan empat cabang diagnosis ditelusuri dari source. |
| Aplikasi lokal | Work order dimuat di `http://127.0.0.1:5174/heart-repair`; screenshot diperiksa pada 390×844 dan 1280×800. |
| Test unit relevan | `npx vitest run src/pages/heart-repair`: 2 file, 3 test lulus. Reducer menguji transition invalid dan reset; content menguji empat diagnosis lengkap. |
| Test end-to-end relevan | `npx playwright test tests/e2e/heart-repair.spec.ts --project=chromium`: 15/15 lulus. Mencakup direct navigation, pointer, keyboard, drag, alternatif non-drag, semua diagnosis, replay, Back, focus indicator, reduced motion, dan overflow. |
| Bukti yang tidak tersedia | Tidak ada screen recording atau Playwright trace sukses untuk mengamati rasa timing/easing secara langsung. In-app browser juga tidak tersedia pada sesi audit. Karena itu, kualitas animasi perseptual berstatus **insufficient evidence**; penilaian motion di bawah hanya didukung implementasi dan test runtime. |

Tidak ada loading, empty, maupun error state yang diekspos dalam flow ini. Direct-navigation test tidak menangkap console/page error; reducer menolak transition invalid yang diuji.

## Score breakdown

| Kategori | Bobot | Nilai mentah | Kontribusi | Bukti pengurangan |
| --- | ---: | ---: | ---: | --- |
| First-impression clarity | 15% | 8.0/10 | 12.0 | Screenshot live 1280×800 memperlihatkan work order dan bench, tetapi tombol **Mulai pemeriksaan** berada di bawah fold; aksi pertama tidak langsung terlihat tanpa scroll. |
| Emotional payoff | 20% | 9.0/10 | 18.0 | Empat cabang membawa pesan suportif yang spesifik untuk kondisi terpilih dan ditutup dengan surat/certificate. Pengurangan 1 poin: payoff tetap berupa copy pratulisan; tidak ada input personal baru dari pembeli/penerima pada flow yang diperiksa. |
| Originality | 15% | 8.5/10 | 12.75 | Metafora bengkel, prescription, dan alat per kondisi membentuk identitas kuat. Pengurangan 1.5 poin: mekanik utama tetap pola pilih → lanjut → drag/tombol yang sama untuk seluruh cabang. |
| Usability | 15% | 8.0/10 | 12.0 | E2E membuktikan seluruh cabang, drag, tombol pengganti drag, replay, dan Back selesai. Pengurangan 2 poin: fokus setelah replay tidak dipindahkan ke work order baru; lihat High Impact 1. |
| Motion quality | 15% | 8.0/10 | 12.0 | Implementasi memakai transisi antar-scene 280 ms `easeOut`, feedback success 200 ms, dan waktu jeda reveal 760 ms. Pengurangan 2 poin: setiap pergantian memakai pola fade/geser yang sama; tidak ada bukti perseptual langsung bahwa ritme ini memperkuat build-up. **Kualitas animasi perseptual: insufficient evidence.** |
| Accessibility dan robustness | 10% | 8.0/10 | 8.0 | Skip link, outline, focus antar-phase, SVG dekoratif, reduced motion, dan empat viewport diuji lulus. Pengurangan 2 poin: replay belum mengelola focus; cek test juga belum mengunci perilaku tersebut. |
| Sellability dan personalization | 10% | 6.5/10 | 6.5 | Nama pengirim/penerima, kondisi, alat, surat, dan certificate konsisten. Pengurangan 3.5 poin: seluruh personalisasi masih terkunci sebagai Andre/Gusti dan empat teks cabang; belum ada bukti bahwa pembeli dapat membentuk hadiah untuk orang atau konteks lain. |
| **Total** | **100%** |  | **81.25 → 81/100** |  |

## Kekuatan utama

- Konsep segera terbaca sebagai hadiah yang merawat, bukan sekadar mini-game; bahasa work order dan visual meja repair saling menguatkan.
- Cabang diagnosis benar-benar berakhir pada alat, pesan, dan label certificate yang koheren, bukan hanya mengganti judul.
- Interaksi repair tidak memaksa drag: tombol `Gunakan …` tersedia dengan instruksi yang jelas, sementara drag pointer juga tervalidasi.
- Dasar aksesibilitas kuat: skip link, focus visible, focus menuju heading pada transisi utama, SVG dekoratif tersembunyi dari pembaca layar, reduced motion, dan tidak ada overflow pada viewport uji.

## Alur yang diperiksa

| Tahap | Bukti hasil |
| --- | --- |
| Arrival / work order | Work order memuat pemilik, pengirim, status, dan tombol mulai; direct-navigation test lulus tanpa console/page error. |
| Diagnosis | Empat pilihan diagnosis tersedia; semua cabang selesai sampai certificate melalui E2E. |
| Prescription | Setiap diagnosis memilih satu alat dan instruksi yang sesuai; content test memverifikasi kelengkapan cabang. |
| Repair interaction | Drag pointer ke target lulus; tombol non-drag juga menyelesaikan seluruh cabang. |
| Personal reveal | Muncul sesudah repair berhasil; heading dan copy berubah menurut kondisi. |
| Care certificate | Memuat pemilik, perawat, treatment, status, garansi, replay, dan kembali ke koleksi. |
| Replay | Kembali ke work order dan browser Back lulus, tetapi focus reset belum dikelola. |

Alur tidak terbukti membingungkan secara fungsional: 15 test E2E menyelesaikannya. Namun flow memerlukan empat tindakan berurutan sebelum reveal (mulai, diagnosis, ke repair, repair); pada desktop, tindakan pertama juga terletak di bawah fold. Ini cukup untuk dipantau dalam uji pengguna, bukan Blocker.

## Temuan Tiny Heart Repair Shop

### Blocker

Tidak ada Blocker yang ditemukan dalam bukti yang diperiksa.

### High Impact

1. **Focus hilang setelah replay.** Bukti: tombol `Ulangi pengalaman` hanya menjalankan `RESET`, sedangkan `ArrivalScene` merender `SceneHeading` tanpa `shouldFocus`; berbeda dengan scene diagnosis sampai certificate yang memakai `shouldFocus`. Setelah tombol certificate di-unmount, pengguna keyboard tidak diberi lokasi fokus baru pada work order. Dampak: orientasi setelah replay melemah dan pengguna bisa harus menelusuri ulang dari awal dokumen. E2E saat ini hanya memeriksa heading work order terlihat, bukan focus setelah replay.
2. **CTA pertama tidak terlihat pada desktop target.** Bukti: screenshot live 1280×800 memperlihatkan card work order terpotong sebelum area `orderFooter`; button `Mulai pemeriksaan` berada di bawah fold. CSS desktop mempertahankan heading hingga `4.25rem` dan layout dua kolom mulai 48rem. Dampak: pengguna desktop melihat konteks yang baik, tetapi tidak segera melihat cara memulai; ini mengurangi kejelasan first impression.

### Optional polish

1. **Ritme motion belum terbukti terasa seperti repair yang bertahap.** Bukti: tiap scene memakai enter/exit 280 ms `easeOut`; feedback berhasil memakai 200 ms dan reveal ditunda 760 ms. Struktur ini fungsional, tetapi tidak ada rekaman/trace sukses untuk menilai apakah jeda tersebut terasa hangat atau hanya menunggu. Dampak: polish emosional, bukan kegagalan flow.
2. **Progress fase tidak tersaji secara visual.** Bukti: state diketahui melalui copy dan aria-live, tetapi UI hanya memunculkan `REPAIR STATUS` ketika sudah berada di repair bay. Dampak: sebagian pengguna mungkin tidak mengetahui seberapa jauh mereka dari personal reveal; validasi lewat uji pengguna sebelum dianggap masalah besar.

## Evaluasi animasi

**Status: insufficient evidence untuk kualitas perseptual.** Aplikasi lokal berjalan dan E2E membuktikan transisi mencapai reveal/certificate, tetapi tidak ada rekaman layar atau trace sukses untuk mengamati timing, easing, frame pacing, dan kontinuitas gerak secara langsung.

Yang dapat diverifikasi dari implementasi:

- Antar-scene memakai opacity + gerak vertikal 12 px masuk / 8 px keluar, 280 ms `easeOut`.
- Saat repair selesai, pesan status masuk selama 200 ms dan reveal dijadwalkan setelah 760 ms.
- Tool drag memberi feedback `scale: 1.06` dan `rotate: -3`; indikator hati memakai transisi CSS 220 ms.
- `prefers-reduced-motion` menghapus initial/exit motion, mengembalikan transform dekoratif ke netral, dan E2E membuktikan flow tetap selesai.

Rekomendasi evaluasi berikutnya: rekam satu flow pointer normal dan satu reduced-motion pada kedua viewport, lalu nilai jeda 760 ms, keterbacaan feedback berhasil, dan apakah reveal mendapat penekanan emosional yang cukup.

## Masalah accessibility dan robustness

- **High Impact — focus replay:** dijelaskan di atas. Ini adalah satu gap aksesibilitas yang ditemukan.
- **Terverifikasi baik:** skip link hanya tampil saat focus dan memindahkan focus ke `<main>`; focus heading tervalidasi pada diagnosis, prescription, repair, reveal, dan certificate; tombol diagnosis memiliki outline; SVG dekoratif tidak menjadi image pembaca layar; tombol pengganti drag dapat dipakai keyboard; reduced motion tetap menyelesaikan flow; tidak ada overflow horizontal pada 320×700, 390×844, 768×900, dan 1280×800.
- **Batasan:** tidak ada audit pembaca layar manusia atau pengukuran kontras terinstrumentasi dalam bukti ini. Tidak ada temuan kontras yang dapat dibuktikan dari screenshot, jadi tidak dicatat sebagai kegagalan.

## Rekomendasi prioritas

1. Pastikan replay menempatkan fokus dan konteks keyboard pada work order yang baru.
2. Pastikan tindakan `Mulai pemeriksaan` terlihat pada viewport desktop 1280×800 tanpa menunggu scroll.
3. Uji apakah empat langkah sebelum reveal terasa bermakna atau terlalu panjang; ukur drop-off serta waktu ke payoff.
4. Validasi nilai personalisasi dengan pembeli potensial: apakah identitas pengirim/penerima dan pesan dapat terasa milik mereka, bukan hanya demo Andre/Gusti.
5. Rekam flow normal dan reduced-motion untuk menilai ulang ritme 280/760 ms berdasarkan pengalaman langsung.

## Rencana pengujian dengan 10 target pengguna

**Tujuan:** menguji apakah orang memahami ini sebagai hadiah digital, dapat menyelesaikan flow tanpa bantuan, dan merasakan payoff personal. Ini adalah riset eksploratif, bukan pembuktian market demand.

- **Rekrutmen:** 4 orang yang pernah membeli hadiah personal/digital dalam 12 bulan terakhir, 4 orang yang nyaman menerima atau mengirim pesan emosional digital, dan 2 orang yang rutin memakai keyboard atau preferensi reduced motion. Total 10; catat overlap bila ada, tetapi tetap jalankan dua sesi aksesibilitas yang eksplisit.
- **Perangkat:** 5 sesi di mobile sekitar 390 px, 5 di desktop sekitar 1280 px; setidaknya satu sesi keyboard-only dan satu sesi `prefers-reduced-motion`.
- **Skenario:** buka tanpa penjelasan; ceritakan apa yang diyakini pengguna akan terjadi; selesaikan sampai care certificate; pilih apakah ingin replay; lalu jelaskan untuk siapa hadiah ini terasa cocok.
- **Metrik:** completion rate, waktu ke aksi pertama, waktu ke reveal, salah langkah, kebutuhan bantuan, apakah CTA pertama ditemukan, apakah replay mempertahankan orientasi, pemahaman pesan, dan rating eksploratif 1–5 untuk keinginan memberi/menerima.
- **Pertanyaan singkat:** “Apa yang kamu kira ini saat pertama tiba?”, “Bagian mana yang paling/kurang bermakna?”, “Apakah diagnosis dan repair terasa perlu?”, “Apa yang harus berubah agar terasa personal untuk seseorang yang kamu kenal?”, dan “Apakah ada bagian yang sulit dipakai?”
- **Kriteria keputusan sebelum sesi:** iterasi CTA bila kurang dari 8/10 menemukan tindakan pertama tanpa bantuan; iterasi/persingkat flow bila kurang dari 8/10 mencapai reveal tanpa bantuan atau median waktu ke reveal terasa terlalu lama dalam debrief; perbaiki focus sebelum melanjutkan uji keyboard; uji ulang motion bila peserta menyebut jeda repair/reveal tidak jelas atau terburu-buru.

## Ranking prototype

Tidak dilakukan: hanya satu prototype berada dalam scope audit, sehingga tidak ada perbandingan atau ranking terhadap prototype lain.
