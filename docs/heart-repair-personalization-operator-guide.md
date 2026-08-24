# Panduan operator — personalisasi Tiny Heart Repair Shop

Panduan ini untuk seller/operator yang menyiapkan **satu** hadiah `/heart-repair`. Ini bukan form buyer, dashboard, atau alur self-service.

## Konfigurasi per pesanan

Satu object `HeartRepairGiftConfigurationInput` adalah sumber nilai personal untuk satu hadiah. Validasi harus selalu dilakukan melalui `loadHeartRepairGiftConfiguration()` sebelum route dirender.

```ts
const gift = loadHeartRepairGiftConfiguration({
  giftId: 'order-internal-001',
  recipientName: 'Nama penerima',
  senderName: 'Nama pengirim',
  personalMessage: 'Pesan pribadi untuk penerima.\nBoleh terdiri dari beberapa baris.',
  signature: 'Opsional — jika kosong memakai nama pengirim',
  certificateNote: 'Opsional — catatan kecil pada certificate',
  occasionLabel: 'Opsional — misalnya Untuk hari yang berat',
})
```

Jangan tambahkan diagnosis atau treatment ke object ini. Recipient tetap memilih salah satu dari empat diagnosis dalam experience; `heartRepairContent.ts` menentukan treatment secara tetap dari pilihan tersebut.

## Field dan batasan

| Field | Required | Batas setelah trim | Surface recipient |
| --- | --- | ---: | --- |
| `giftId` | Ya | 80 karakter | Tidak ditampilkan; hanya identifier internal. |
| `recipientName` | Ya | 40 karakter | Work Order, label hati, tool label, success receipt, certificate, warranty, dan footer Heart Repair. |
| `senderName` | Ya | 40 karakter | Work Order, service stamp, live announcement, certificate, dan footer Heart Repair. |
| `personalMessage` | Ya | 320 karakter | Isi Personal Reveal; baris baru dipertahankan. |
| `signature` | Tidak | 40 karakter | Signature Personal Reveal; kosong/whitespace memakai `senderName`. |
| `certificateNote` | Tidak | 180 karakter | Catatan tambahan pada Care Certificate; tidak dirender bila kosong. |
| `occasionLabel` | Tidak | 80 karakter | Baris Occasion pada Care Certificate; tidak dirender bila kosong. |

Validator melakukan trim, menolak field required yang kosong/whitespace, dan menolak setiap nilai yang melampaui batas. Data invalid tidak pernah diganti diam-diam dengan nilai demo.

## Cara menyiapkan satu hadiah

1. Kumpulkan hanya nama panggilan recipient/sender, pesan pribadi, signature bila berbeda, serta note/occasion bila memang ingin dipakai.
2. Buat satu configuration input, jalankan validator, lalu gunakan hasilnya untuk route. Jangan menyebarkan nama atau message ke component atau content diagnosis.
3. Biarkan recipient memilih diagnosis saat experience berjalan. Jangan menyarankan satu diagnosis sebagai data pesanan atau mengubah mapping treatment.
4. Tinjau route menggunakan isi configuration yang sama pada mobile dan desktop. `giftId` tidak boleh masuk ke surface recipient.

## Checklist sebelum preview buyer

- [ ] Semua field required valid setelah trim; ejaan recipient dan sender sudah dikonfirmasi.
- [ ] Personal message terbaca nyaman, termasuk line break, pada 390×844 dan 1280×800.
- [ ] Signature benar atau memang menggunakan fallback sender.
- [ ] Certificate note dan occasion hanya muncul bila buyer meminta.
- [ ] Empat diagnosis tetap tersedia; treatment pada receipt/certificate tetap mengikuti diagnosis yang dipilih recipient.
- [ ] Arrival, Personal Reveal, dan Care Certificate tidak overflow, overlap, atau memotong teks.
- [ ] Pointer, keyboard, reduced motion, skip link, focus reveal, dan replay masih menyelesaikan flow.
- [ ] Tidak ada nama, pesan, atau nilai demo lain yang tersisa pada surface Heart Repair.

Private link, approval UI, order form, dan delivery lifecycle berada di tahap berikutnya dan tidak dicakup oleh konfigurasi ini.
