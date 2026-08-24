# Tiny Heart Repair Shop — Product Feature Review v1

**Product:** Tiny Heart Repair Shop  
**Route:** `/heart-repair`  
**Batas review:** hanya route dan product ini. Tidak ada prototype lain yang dinilai atau dibuka scope-nya.

## 1. Product definition

Tiny Heart Repair Shop adalah hadiah digital personal berbentuk bengkel kecil: recipient memilih keadaan hati, menerima treatment yang koheren, melakukan satu aksi repair, lalu memperoleh pesan personal dan care certificate. Janji emosionalnya adalah mengubah perhatian dari pengirim menjadi ritual singkat yang terasa hangat, bukan menyelesaikan masalah emosional recipient. Hasil yang diharapkan: buyer dapat mengirim perhatian yang terasa spesifik, recipient dapat menyelesaikan dan membuka kembali pengalaman itu tanpa bantuan.

**Evidence diperiksa:** registry route (`src/app/themeRegistry.ts`), implementasi dan content/reducer di `src/pages/heart-repair/`, E2E `tests/e2e/heart-repair.spec.ts`, review produk sebelumnya, motion review, serta perbaikan replay focus dan repair-success confirmation. Status klaim di bawah memakai **Observed**, **Reported**, **Inferred**, atau **Assumption to test**.

### Ringkasan readiness saat ini

- **Recipient experience:** cukup lengkap untuk uji pengguna terbatas. **Observed**
- **Buyer personalization dan delivery:** belum merupakan capability product; nama, pesan, treatment, certificate, dan visual masih berada di content tetap. **Observed**
- **Rekomendasi model MVP:** **seller-managed service** dengan brief terstruktur, konfigurasi bertipe, review pembeli, dan link privat. Ini menjaga nilai personal dengan effort dan risiko paling rendah untuk test-selling. **Inferred**

## 2. Target buyer, recipient, dan occasion

| Peran | Kebutuhan utama | Status evidence |
| --- | --- | --- |
| Buyer | Mengirim perhatian yang terasa ditujukan pada satu orang, yakin nama/pesan/treatment benar, lalu dapat mengirim link dengan percaya diri. | **Inferred** dari positioning hadiah personal dan tidak adanya titik personalisasi/review saat ini. |
| Recipient | Memahami konteks hadiah, memilih diagnosis yang nyaman, menyelesaikan repair melalui pointer atau keyboard, dan menerima pesan yang hangat. | **Observed** pada flow dan E2E. |
| Seller/operator | Mengubah brief menjadi pengalaman yang konsisten, memeriksa hasilnya, mengirim link, lalu menangani salah nama atau revisi tanpa mengedit banyak source. | **Reported** oleh business context; belum tersedia di product. |
| Occasion | Perhatian sehari-hari, hari berat, dukungan jarak jauh, atau pesan relasional ringan. | **Inferred** dari empat diagnosis dan copy; bukan demand tervalidasi. |

**Assumption to test:** buyer bersedia mempercayakan pesan personal kepada seller dan menilai sentuhan kurasi manusia lebih bernilai daripada kemandirian self-service pada tahap awal.

## 3. Recommended MVP business model

| Model | Value | Effort/risk awal | Kelayakan test-selling | Keputusan |
| --- | --- | --- | --- | --- |
| Seller-managed service | Seller menerjemahkan brief menjadi satu gift yang dipreview buyer; cocok dengan nilai personal dan content yang masih dikurasi. | Rendah–sedang; perlu intake, konfigurasi bertipe, QA, dan delivery discipline, tetapi tidak perlu editor publik. | Tinggi: proses dapat diuji dengan sedikit pesanan nyata dan feedback langsung. | **Rekomendasi MVP.** |
| Downloadable template | Buyer mengubah dan men-deploy source/template sendiri. | Rendah untuk operator, tetapi tinggi untuk buyer non-teknis; kualitas, privacy, dan hasil akhir sukar dikendalikan. | Rendah untuk hadiah personal siap-kirim. | Jangan jadikan model awal. |
| Self-service product | Buyer memasukkan data, preview, publish, dan mengelola link sendiri. | Tinggi: membutuhkan editor, validation, publish, privacy, delivery, support, dan penanganan error yang belum terbukti perlu. | Sedang hanya setelah personalisasi inti tervalidasi. | Future experiment, bukan scope awal. |

**Mengapa seller-managed:** experience yang ada sudah kuat sebagai artefak recipient, sedangkan celah terbesar adalah operasi personalisasi yang aman. Seller-managed memungkinkan penggunaan **typed configuration per order** dan satu checklist QA, sehingga seller tidak perlu menyentuh banyak source untuk setiap pesanan. Ini rekomendasi proses product, bukan instruksi membuat backend, dashboard, atau pricing.

## 4. Existing feature inventory

| Fitur yang benar-benar ada | Pengguna utama | Tahap journey | Evidence |
| --- | --- | --- | --- |
| Route tunggal dengan konteks bengkel hati | Recipient | Arrival | `themeRegistry.ts`, `HeartRepairPage.tsx` — **Observed** |
| Work order berisi pemilik, pengirim, dan status | Recipient | Arrival | Nilainya saat ini hardcoded Andre/Gusti — **Observed** |
| Empat diagnosis dengan prescription, tool, reveal, dan certificate treatment yang berpasangan | Recipient | Diagnosis sampai certificate | `heartRepairContent.ts`; content/E2E menutup empat cabang — **Observed** |
| Pointer drag serta tombol alternatif non-drag | Recipient | Repair | `RepairScene`; drag dan keyboard alternative diuji — **Observed** |
| Focus heading per scene, skip link, decorative SVG tersembunyi, reduced motion, dan tidak ada overflow pada viewport uji | Recipient | Seluruh flow | E2E — **Observed** |
| Repair-success receipt pada personal reveal | Recipient | Reveal | Memakai treatment aktif; terlihat di viewport normal/reduced — **Observed** |
| Surat reveal, signature, care certificate, replay, kembali ke koleksi | Recipient | Completion/replay | `RevealScene`, `CertificateScene`, E2E — **Observed** |
| Replay mengembalikan focus ke work order, bukan skip link | Recipient | Replay | Perbaikan fokus dan E2E pointer/keyboard — **Observed** |
| Personalisasi oleh buyer, preview buyer, order intake, link unik, approval, revisi, retention | Buyer/seller | Sebelum dan sesudah delivery | Tidak terlihat pada route atau tests — **Observed gap** |

### Apakah flow recipient sudah lengkap?

**Cukup lengkap untuk test-selling terbatas, belum lengkap sebagai produk berulang.** Diagnosis → prescription → repair → reveal membentuk sebab-akibat emosional yang jelas; certificate memberi penutup/keepsake, dan replay memiliki nilai kecil untuk membuka kembali ritual. **Observed.**

- **Pertahankan diagnosis, repair, reveal.** Diagnosis membuat pesan terasa relevan; repair memberi agency ringan; reveal adalah payoff inti. **Inferred kuat dari struktur content dan motion review.**
- **Pertahankan certificate, tetapi jangan jadikan download sebagai syarat MVP.** Certificate sudah berfungsi sebagai penutup dan dapat dibuka ulang melalui link yang sama. File download tidak menambah payoff inti sebelum ada bukti recipient ingin menyimpannya di luar link. **Inferred.**
- **Pertahankan replay sebagai kontrol sekunder.** Ia mendukung re-read tanpa memaksa buyer/recipient memulai dari link baru. **Observed.**
- **Jangan menambah langkah.** Empat aksi sebelum reveal perlu diuji apakah terasa ritual atau terlalu panjang; tidak ada bukti untuk menambah progress tracker, mini-game, atau cabang baru. **Assumption to test.**

## 5. Feature gaps

| Area gap | Temuan | Dampak peran | Status |
| --- | --- | --- | --- |
| Buyer customization | Tidak ada cara mengubah nama, pesan, signature, diagnosis/treatment, atau certificate tanpa source/content tetap. | Buyer tidak dapat membuat hadiah terasa milik penerima; seller berisiko edit manual. | **Observed** |
| Recipient experience | Tidak ada konteks delivery/pengirim selain copy yang terkunci; no custom message from buyer. | Payoff terbatas pada empat cabang pratulisan. | **Observed** |
| Seller workflow | Tidak ada brief minimum, configuration per order, preview/approval, QA definition, atau correction path. | Sulit memproses pesanan berulang secara konsisten. | **Observed** |
| Delivery dan sharing | Tidak ada unique link, private-boundary, fallback, atau metadata sharing yang ditentukan. | Gift dapat salah audiens atau preview chat membocorkan konteks pribadi. | **Observed** |
| Replay dan keepsake | Replay ada; penyimpanan di luar link belum ada. | Tidak cukup bukti bahwa download dibutuhkan. | **Observed / Assumption to test** |
| Privacy dan expiration | Tidak ada kebijakan data minimization, no-index, retention, revoke, archive, atau delete. | Nama/pesan/diagnosis dapat menjadi sensitif bila dijual berulang. | **Observed** |
| Mobile dan accessibility | Flow dan reduced motion teruji; custom content nanti berisiko merusak layout atau focus bila tidak divalidasi. | Recipient dengan perangkat atau kebutuhan akses berbeda. | **Observed / Inferred** |

## 6. Must / Should / Could / Avoid

| Kelas | Capability | Alasan | Evidence |
| --- | --- | --- | --- |
| Must | Brief personalisasi minimum yang diterjemahkan ke konfigurasi bertipe per order | Tanpanya nama/pesan tetap hardcoded dan seller perlu mengedit banyak source. | **Observed** |
| Must | Preview/review pembeli sebelum handoff, dengan jalur koreksi | Kesalahan nama atau tone pada hadiah personal memiliki dampak besar dan belum ada checkpoint. | **Inferred** |
| Must | Link unik dengan boundary privacy dasar: token sulit ditebak, no-index, metadata netral, dan revoke/delete operasional | Link hadiah personal butuh audience boundary; route publik saat ini tidak menyediakannya. | **Inferred** |
| Should | Checklist QA operator dan aturan correction pasca-publish | Menjaga typed configuration, mobile, link, dan recipient context konsisten tanpa dashboard. | **Inferred** |
| Should | Expiration/archive yang dipilih buyer, serta penghapusan atas permintaan | Mengurangi penyimpanan tanpa alasan dan mengelola lifecycle hadiah. Jangan aktif default sebelum kebutuhannya diuji. | **Inferred** |
| Could | Pilihan visual terbatas (mis. satu dari sedikit palette terkurasi) | Bisa menambah rasa milik tanpa mengubah narasi inti; perlu guard accessibility. | **Assumption to test** |
| Could | Opsi satu tanggal/occasion kecil pada certificate | Berguna bila recipient mengaitkan hadiah dengan momen tertentu; tidak perlu untuk nilai inti. | **Assumption to test** |
| Could | Unduh/share certificate setelah evidence kebutuhan keepsake | Tambahan convenience, bukan syarat completion. | **Assumption to test** |
| Avoid | Foto pada MVP | Memperbesar consent, copyright, moderation, cropping, dan privacy tanpa bukti menaikkan payoff. | **Inferred** |
| Avoid | Lagu, voice note, atau audio autoplay pada MVP | Membawa rights, hosting, consent, accessibility, dan gangguan konteks; manfaat belum tervalidasi. | **Inferred** |
| Avoid | Editor self-service, template bebas, dan dashboard pada MVP | Membuka scope publish/support/privacy sebelum proposisi personalisasi inti terbukti. | **Inferred** |
| Avoid | Menambah diagnosis, game, badge, atau progress UI | Flow saat ini sudah lengkap; tambahan tidak menyelesaikan gap buyer/seller terbesar. | **Observed / Inferred** |

## 7. Buyer personalization field map

| Field | Status | Validasi | Tempat tampil | Fallback |
| --- | --- | --- | --- | --- |
| Nama recipient | Required | Nama panggilan 1–40 karakter; larang ruang kosong saja; seller konfirmasi ejaan | Work order, tool label, warranty, certificate | Tidak publish bila kosong; gunakan nama yang buyer setujui, bukan default generik diam-diam. |
| Nama sender | Required | 1–40 karakter; buyer menyetujui bentuk panggilan | Work order, service stamp, reveal announcement, signature, certificate | Tidak publish bila kosong. |
| Personal message/reveal body | Required | Batas panjang yang tetap nyaman di mobile; multiline aman; preview wajib; tidak boleh mengandung data pihak ketiga tanpa consent | Personal reveal | Copy prompt yang disetujui buyer; jangan fallback ke pesan demo. |
| Signature | Optional | 1–40 karakter; dapat berbeda dari nama sender hanya setelah diperiksa buyer | Reveal | Nama sender. |
| Diagnosis/treatment | Required | Pilih tepat satu dari empat pasangan existing; tampilkan treatment hasil pilihan pada preview | Prescription, repair, success receipt, certificate | Tidak publish bila tidak dipilih; seller dapat menyarankan, buyer yang menyetujui. |
| Certificate copy / warranty singkat | Optional | Batas panjang; tidak mengubah makna treatment atau mengandung klaim medis | Certificate | Template certificate yang memasukkan recipient dan treatment. |
| Occasion atau tanggal | Optional | Format jelas; hanya dipakai bila buyer ingin dan tidak sensitif | Certificate atau service stamp | Tidak ditampilkan. |
| Palette visual terkurasi | Optional, Version 1 | Hanya pilihan yang menjaga contrast dan state focus; preview wajib | Seluruh route | Palette workshop default. |
| Foto | Avoid | Jangan dikumpulkan pada MVP | Tidak ada | Tidak ada. |
| Lagu / voice note | Avoid | Jangan dikumpulkan pada MVP | Tidak ada | Tidak ada. |

**Catatan:** diagnosis dapat memiliki implikasi emosional. Jangan meminta detail kondisi/cerita medis sebagai field order bila tidak diperlukan untuk memilih satu treatment; simpan hanya pilihan treatment yang memang diperlukan untuk menjalankan gift. **Inferred dari privacy risk.**

## 8. Seller operational requirements

### Workflow dari order sampai link dikirim

1. **Intake:** buyer memberikan field minimum, menyatakan ia berhak membagikan nama/pesan, memilih diagnosis/treatment, dan menentukan apakah gift memiliki waktu delivery atau archive. Jangan meminta foto, riwayat, atau kontak recipient bila tidak perlu.  
2. **Preparation:** operator membuat satu typed configuration per order dengan ID internal non-personal; seluruh surface menggunakan nilai yang sama agar diagnosis, receipt, reveal, dan certificate tidak menyimpang.  
3. **QA:** operator memeriksa ejaan, pilihan treatment, message overflow pada mobile, completion/replay, reduced motion, keyboard/skip link, dan link final. Ini adalah definition of ready tingkat produk.  
4. **Preview dan approval:** buyer menerima preview non-public atau draft link dengan metadata yang aman; buyer menyetujui isi personal sebelum handoff. Perubahan sebelum approval tidak menciptakan pengalaman final baru.  
5. **Publish dan delivery:** operator mengirim satu unique bearer link beserta instruksi singkat bahwa siapa pun yang memiliki link dapat membuka hadiah. Jika waktu pengiriman penting, operator mengirim pada waktu yang disepakati; jangan mengklaim scheduling otomatis tanpa capability tersebut.  
6. **Correction:** salah nama atau pesan harus dapat diperbaiki melalui configuration dan QA ulang, lalu buyer menerima link final yang jelas. Jika link lama sudah dikirim, operator harus dapat mengganti/menonaktifkan versi sebelumnya sesuai kebijakan yang dijelaskan.  
7. **Retention dan exception:** catat tanggal publish/archive/delete, bukan data pribadi tambahan. Tangani salah recipient, konten yang tidak pantas, link gagal, dan permintaan penghapusan dengan jalur yang jelas.

### Apakah typed configuration dan order form cukup?

Untuk **seller-managed MVP**, ya: typed configuration per order + form/brief minimum + checklist QA + approval manual cukup sebagai capability operasional. **Inferred.** Form adalah intake, bukan alasan untuk membangun checkout, database, dashboard, atau self-service editor. Jika order bertambah dan bukti menunjukkan seller tidak lagi dapat menjaga kualitas, barulah evaluasi tooling lebih lanjut.

## 9. Privacy dan delivery requirements

| Kebutuhan | Rekomendasi tingkat produk | Alasan |
| --- | --- | --- |
| Audience boundary | Gunakan unique, unguessable bearer link untuk setiap gift. Access code hanya bila buyer menilai content cukup sensitif untuk tambahan friksi. | Recipient dapat membuka dengan mudah; token bukan pengganti consent atau keamanan absolut. **Inferred** |
| Search indexing | Gift personal tidak masuk index mesin pencari atau sitemap; minta crawler tidak mengindeksnya. | Nama/pesan/treatment tidak layak mudah ditemukan publik. **Inferred** |
| Metadata sharing | Gunakan judul/deskripsi netral tanpa nama recipient, diagnosis, treatment, atau kutipan pesan; image preview tidak menampilkan data personal. | Preview chat dapat dilihat orang lain. **Inferred** |
| Link dibuka orang lain | Perlakukan sebagai bearer link: halaman tetap terbuka, tetapi tidak ada data tambahan di luar isi gift; jelaskan keterbatasan ini kepada buyer. | Tidak menjanjikan privacy yang tidak dapat dipenuhi. **Inferred** |
| Data minimization | Simpan hanya data yang dibutuhkan untuk menyiapkan, mengoreksi, dan menghapus gift: konfigurasi, ID order, status approval/publish, dan retention date. | Nama, pesan, dan diagnosis dapat sensitif; tidak perlu menyimpan alasan emosional, foto, kontak recipient, atau analytics identitas tanpa alasan. **Inferred** |
| Retention | Tetapkan pilihan archive/expiry dan delete request; beri tahu buyer kapan link berhenti aktif atau kapan data dihapus. | Lifecycle jelas bagi buyer/operator; jangan membuat expiry default tanpa validasi occasion. **Inferred** |

## 10. Value / Effort / Risk assessment

| Kandidat | Masalah yang diselesaikan | Pengguna utama | Buyer | Recipient | Emotional fit | Differentiation | Effort | Technical risk | Confidence | Keputusan |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| Konfigurasi personal bertipe + brief minimum | Nilai personal masih terkunci di source dan seller rawan salah edit. | Buyer, seller, recipient | 5 | 5 | 5 | 4 | Medium | Medium | **Observed** | Must / MVP |
| Preview/approval dan correction sebelum handoff | Buyer tidak punya titik yakin ejaan, tone, dan treatment sudah tepat. | Buyer, seller | 5 | 4 | 5 | 3 | Medium | Medium | **Inferred** | Must / MVP |
| Unique private link, metadata netral, revoke/delete lifecycle | Tidak ada boundary audience, safety delivery, atau jalur setelah publish. | Buyer, recipient, seller | 5 | 4 | 4 | 3 | Medium | High | **Inferred** | Must / MVP |
| QA checklist seller (mobile, keyboard, reduced motion, personalization) | Hasil per-order dapat rusak walau route dasar lulus. | Seller, recipient | 4 | 4 | 3 | 2 | Low | Low | **Inferred** | Should / MVP operation |
| Archive/expiry opt-in | Buyer tidak dapat menentukan lifecycle hadiah. | Buyer, recipient, seller | 3 | 3 | 3 | 2 | Medium | Medium | **Assumption to test** | Should / Version 1 |
| Palette visual terkurasi | Buyer ingin nuansa lebih dekat tanpa mengubah experience inti. | Buyer, recipient | 3 | 3 | 3 | 3 | Medium | Medium | **Assumption to test** | Could / Version 1 |
| Tanggal/occasion kecil pada certificate | Keepsake kurang terkait konteks tertentu. | Buyer, recipient | 2 | 3 | 3 | 2 | Low | Low | **Assumption to test** | Could / Version 1 |
| Download/share certificate | Recipient mungkin ingin menyimpan artefak di luar link. | Recipient | 2 | 3 | 3 | 2 | Medium | Medium | **Assumption to test** | Could / Future |
| Foto, lagu, voice note | Diduga menambah rasa personal. | Buyer, recipient | 2 | 3 | 3 | 2 | High | High | **Assumption to test** | Avoid pada MVP |
| Self-service editor/publish | Buyer tidak dapat mengelola semuanya sendiri. | Buyer | 3 | 2 | 2 | 2 | High | High | **Assumption to test** | Avoid sampai terbukti |

Nilai di atas adalah framework keputusan, **bukan bukti demand pasar**. Confidence adalah label kekuatan evidence, bukan jaminan hasil pasar.

## 11. MVP, Version 1, dan Future roadmap

| Fase | Capability | Alasan penempatan |
| --- | --- | --- |
| MVP | Seller-managed intake minimum; typed configuration per gift; empat diagnosis/treatment existing; message/signature/nama yang dipreview; QA checklist; unique link dengan boundary privacy dasar; approval sebelum delivery; correction/delete process manual yang jelas. | Ini adalah minimum agar hadiah dapat benar-benar dipersonalisasi, dikirim, dan ditangani dengan aman tanpa membuat self-service platform. |
| Version 1 | Archive/expiry opt-in; satu field occasion/tanggal; beberapa palette yang sudah diuji contrast; link replacement/revocation yang lebih rapi; user test berulang pada flow dan personalisasi. | Menambah control/lifecycle hanya setelah test-selling menunjukkan kebutuhan dan workflow MVP berjalan. |
| Future experiment | Download certificate; akses code opt-in; self-service configuration terbatas; audio/voice note hanya sebagai eksperimen dengan consent, rights, dan accessibility jelas. | Nilai/risiko belum tervalidasi atau dependensinya besar. Tidak ada komitmen build. |

## 12. Tiga fitur prioritas berikutnya

1. **Konfigurasi personal bertipe dari brief minimum.**  
   Untuk seller yang perlu menyiapkan gift berulang, sediakan satu sumber nilai untuk recipient, sender, message, signature, diagnosis/treatment, dan certificate agar semua scene konsisten dan tidak memerlukan banyak source edit. Nilai terutama untuk buyer dan recipient adalah rasa “ini untukku”; nilai operator adalah mengurangi salah nama. — **Observed gap**

2. **Preview/approval buyer dengan jalur koreksi.**  
   Untuk buyer yang ragu sebelum mengirim, sediakan titik review seluruh experience personal agar kesalahan ejaan, message, signature, dan treatment dapat ditemukan sebelum handoff. — **Inferred**

3. **Private delivery lifecycle.**  
   Untuk buyer/recipient yang berbagi pesan personal, sediakan unique link dengan metadata netral, no-index, dan proses revoke/delete agar audience dan masa hidup gift lebih jelas. — **Inferred**

## 13. Acceptance criteria tingkat produk

### 1. Konfigurasi personal bertipe

- Operator dapat menyiapkan satu gift dari field minimum tanpa mengubah banyak source dan tanpa meninggalkan nilai demo pada recipient-facing surface.
- Nama sender/recipient, diagnosis/treatment, receipt sukses, reveal, signature, dan certificate saling konsisten dalam satu preview.
- Buyer atau operator mendapat umpan balik sebelum publish bila field required kosong, terlalu panjang untuk dibaca, atau tidak cocok dengan pilihan yang tersedia.

### 2. Preview/approval buyer

- Buyer dapat melihat gift final pada mobile dan desktop sebelum link delivery dikirim.
- Buyer dapat menemukan dan meminta koreksi terhadap nama, message, signature, dan treatment sebelum approval.
- Setelah buyer menyetujui, operator dapat membedakan draft yang belum disetujui dari version yang siap dikirim.

### 3. Private delivery lifecycle

- Setiap gift yang dikirim memiliki link berbeda dan buyer diberi tahu siapa pun yang memperoleh link dapat membukanya.
- Preview link pada chat tidak membocorkan nama, diagnosis, treatment, atau isi personal.
- Buyer dapat diberi penjelasan yang jelas tentang archive/expiry/delete; operator dapat menangani salah kirim atau permintaan penghapusan tanpa membiarkan link lama ambigu.

## 14. Hal yang harus divalidasi kepada calon pembeli

| Hipotesis | Siapa yang diuji | Metode ringan | Sinyal keputusan |
| --- | --- | --- | --- |
| Seller-managed terasa cukup personal dan lebih meyakinkan daripada template/download. | 5–7 calon buyer pada occasion relevan. | Interview singkat + tugas membandingkan tiga model tanpa membahas harga. | Mayoritas memilih seller-managed karena mengurangi kecemasan hasil, bukan hanya karena dibantu. |
| Nama, satu personal message, signature, dan diagnosis/treatment adalah minimum yang cukup untuk terasa personal. | Calon buyer dan recipient (terpisah bila perlu). | Uji prototype/config-card dan debrief setelah melihat reveal. | Peserta dapat menyebut gift terasa ditujukan pada seseorang tanpa meminta foto/audio sebagai syarat. |
| Buyer membutuhkan preview sebelum delivery. | Calon buyer. | Minta mereka mengirim hadiah dari contoh brief dengan dan tanpa titik review. | Mereka menemukan atau takut pada kesalahan nyata sebelum handoff, dan preview mengurangi keraguan. |
| Link privat/no-index dan metadata netral penting untuk pesan ini. | Calon buyer yang nyaman membahas privacy. | Card sort trade-off antara link mudah dibuka, access code, dan preview netral. | Mereka memilih boundary yang proporsional; jangan menambah code bila friksi lebih besar dari rasa aman. |
| Diagnosis + repair terasa ritual bermakna, bukan langkah berlebih. | Recipient pada mobile dan desktop, termasuk keyboard/reduced motion. | Think-aloud sampai reveal, kemudian tanya bagian yang ingin dihilangkan. | Mayoritas memahami hubungan pilihan → treatment → pesan dan mencapai reveal tanpa bantuan. |
| Certificate perlu diunduh atau cukup tersedia lewat link/replay. | Recipient setelah completion. | Tanyakan tindakan yang benar-benar ingin dilakukan, bukan preferensi abstrak. | Hanya prioritaskan download bila pola kebutuhan penyimpanan muncul berulang. |

Laporan ini tidak menentukan harga, strategi marketing, arsitektur backend, dashboard, atau rencana implementasi. Semua rekomendasi di atas perlu diuji sebagai hipotesis sebelum scope produk diperluas.
