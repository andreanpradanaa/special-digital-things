# Supabase Commerce Foundation

Milestone 6A menyediakan database dan application data-access layer, tanpa mengubah gallery atau experience prototype. Local state browser tidak digunakan sebagai database atau fallback production.

## Requirement dan local setup

Butuh Docker Desktop yang aktif. Supabase CLI dipasang sebagai dev dependency proyek (tervalidasi dengan versi `2.115.0`), sehingga tidak ada ketergantungan pada instalasi global:

```bash
npm install
npx supabase --version
npx supabase start
npx supabase status
```

Ambil `API_URL` dan `PUBLISHABLE_KEY` dari output `npx supabase status`, kemudian buat `.env.local` yang di-ignore Git:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=publishable-key-dari-supabase-start
```

`service_role` tidak boleh diletakkan di `.env.local` dengan prefix `VITE_`, source frontend, test browser, atau repository. Nilai `VITE_` dibundel ke browser.

Migration dan seed dijalankan ulang secara deterministik dengan:

```bash
npx supabase db reset
npx supabase db lint --level error
npx supabase test db
```

`npx supabase db reset` menjalankan seluruh `supabase/migrations/` lalu `supabase/seed.sql`. Test pgTAP pada `supabase/tests/database/commerce_foundation_rls.test.sql` menguji grants, RLS, claim, snapshot harga, dan isolasi dua buyer. Jalankan command ini hanya setelah local stack berhasil start; Docker diperlukan oleh CLI.

Setelah local stack aktif dan migration berhasil diterapkan, regenerasi tipe database lalu review diff-nya:

```bash
npx supabase gen types --lang typescript --local > src/types/database.types.ts
```

File `src/types/database.types.ts` saat ini adalah output type generation resmi dari local database. Jalankan ulang command tersebut setiap kali migration berubah dan review diff-nya sebelum memakai tipe baru.

## Model data dan akses

- `profiles` dibuat otomatis setiap kali user Auth dibuat; nama default anonymous user adalah `Demo Buyer`.
- `categories` dan `products` adalah catalog. Harga disimpan sebagai `integer` rupiah (contoh `69000`) dengan currency `IDR`, tidak memakai floating point.
- `orders` dan `order_items` menyimpan transaksi demo dan snapshot nama/harga dari database.
- `entitlements` memiliki unique `(buyer_id, product_id)` dan menjadi sumber halaman **Koleksi Saya** pada milestone berikutnya.

RLS aktif pada semua tabel exposed. `anon` dan `authenticated` hanya mendapat `SELECT` untuk kategori/produk aktif. `authenticated` dapat membaca dan memperbarui profile sendiri serta membaca order, order item, dan entitlement sendiri. Tidak ada grant insert/update/delete catalog, order, order item, atau entitlement ke browser.

## Anonymous demo buyer dan claim

Application layer di `src/features/commerce/commerceRepository.ts` menyediakan `signInAsDemoBuyer`, `getCurrentBuyer`, `signOutBuyer`, katalog aktif, claim, entitlement, dan order. `signInAsDemoBuyer()` memanggil `supabase.auth.signInAnonymously()`; setiap browser menerima akun anonim yang berbeda.

`claim_demo_product(product_id)` adalah RPC `security definer` dengan `search_path` kosong, table reference fully-qualified, execute dicabut dari `public`, dan diberikan hanya kepada `authenticated`. RPC menolak request tanpa `auth.uid()`, mengunci pasangan buyer/produk dalam transaksi, membaca produk aktif dari database, membuat order `demo_completed`, snapshot item, dan entitlement. Claim produk yang sama mengembalikan entitlement yang ada dan `already_owned = true` tanpa membuat order baru.

## Menghubungkan hosted Supabase

1. Buat hosted project Supabase dan aktifkan **Anonymous sign-ins** pada Auth provider settings. Hosted project belum dibuat pada milestone ini.
2. Login CLI, link project (`supabase link --project-ref <project-ref>`), lalu push migration menggunakan workflow deployment organisasi Anda (contoh `supabase db push`).
3. Jalankan seed melalui environment aman sesuai workflow deployment; jangan memasukkan service role key ke frontend.
4. Salin **Project URL** dan **Publishable key** ke environment hosting sebagai `VITE_SUPABASE_URL` serta `VITE_SUPABASE_PUBLISHABLE_KEY`, lalu rebuild frontend.
5. Verifikasi RLS dengan akun anonymous terpisah sebelum mengaktifkan UI commerce.

## Batas milestone

Belum termasuk payment gateway, Midtrans/Xendit/Stripe, Supabase Storage, email, authentication UI, checkout, admin dashboard, buyer dashboard, upload, coupon/discount, analytics, atau storefront. Milestone 6B akan menangani storefront UI setelah mendapat instruksi terpisah.
