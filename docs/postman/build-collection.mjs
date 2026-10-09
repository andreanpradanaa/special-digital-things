// Generator Postman collection services/api (v2.1). Jalankan: node docs/postman/build-collection.mjs
// Semua contoh data fiktif. Tidak ada secret. Sumber: services/api/internal/api/{router,handlers,respond}.go
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const json = { 'Content-Type': 'application/json; charset=utf-8' }
const err = (code, message) => JSON.stringify({ error: { code, message } }, null, 2)
const header = (obj) => Object.entries(obj).map(([key, value]) => ({ key, value }))

function req({ name, method, path, description, body, headers = {}, formdata, responses, test }) {
  const url = {
    raw: `{{baseUrl}}${path}`,
    host: ['{{baseUrl}}'],
    path: path.replace(/^\//, '').split('/'),
  }
  const request = { method, header: header(headers), url, description }
  if (body) request.body = { mode: 'raw', raw: JSON.stringify(body, null, 2), options: { raw: { language: 'json' } } }
  if (formdata) request.body = { mode: 'formdata', formdata }
  const item = {
    name,
    request,
    response: responses.map(([rname, code, status, rbody]) => ({
      name: rname,
      originalRequest: request,
      status,
      code,
      _postman_previewlanguage: 'json',
      header: header(json),
      body: rbody,
    })),
  }
  if (test) item.event = [{ listen: 'test', script: { type: 'text/javascript', exec: test } }]
  return item
}

const orderBody = {
  recipientName: 'Sinta',
  senderName: 'Bima',
  mood: 'birthday',
  innerNote: 'Selamat ulang tahun, semoga tahun ini lebih ringan.',
  boxColor: '#e8b7a3',
  boxTheme: 'botanical',
  items: [
    { id: 'letter-1', type: 'letter', title: 'Untuk kamu', message: 'Hai Sinta!', signature: 'Bima' },
    { id: 'voucher-1', type: 'voucher', title: 'Kupon janji', description: 'Traktir kopi sekali', code: 'KOPI-01' },
  ],
  customer: { name: 'Bima Contoh', email: 'bima@contoh.id', phone: '081200000000' },
}

const collection = {
  info: {
    name: 'Special Digital Things API (services/api)',
    description:
      'Endpoint goodiebox-server. Semua publik; webhook diverifikasi signature sha512. Amplop error: {"error":{"code","message"}}. Dibuat dari kode 2026-10-09 lewat /postman.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [
    { key: 'orderCode', value: '' },
    { key: 'publicSlug', value: '' },
  ],
  item: [
    {
      name: 'Health',
      item: [
        req({
          name: 'Health check',
          method: 'GET',
          path: '/healthz',
          description: 'Publik. Cek server hidup.',
          responses: [['OK', 200, 'OK', JSON.stringify({ status: 'ok' }, null, 2)]],
        }),
      ],
    },
    {
      name: 'Orders',
      item: [
        req({
          name: 'Buat order + Snap token',
          method: 'POST',
          path: '/v1/orders',
          description:
            'Publik. Header Idempotency-Key (UUID) mencegah order ganda saat retry. Harga dihitung server. Validasi: recipientName & senderName wajib, mood/boxTheme dari daftar, maks 6 item, body ≤ 256 KB.',
          headers: { 'Content-Type': 'application/json', 'Idempotency-Key': '{{$guid}}' },
          body: orderBody,
          responses: [
            [
              'Created',
              201,
              'Created',
              JSON.stringify(
                {
                  order_code: 'GBX-261009-K3M8XA',
                  public_slug: 'k7bdm2xq9r',
                  status: 'pending',
                  amount: 49000,
                  currency: 'IDR',
                  snap_token: 'contoh-snap-token',
                  snap_redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/contoh-snap-token',
                  client_key: 'SB-Mid-client-CONTOH',
                  is_production: false,
                  created_at: '2026-10-09T10:00:00Z',
                },
                null,
                2,
              ),
            ],
            ['Body tidak valid', 400, 'Bad Request', err('INVALID_BODY', 'body JSON tidak valid')],
            ['Validasi gagal', 400, 'Bad Request', err('VALIDATION_ERROR', 'recipientName wajib diisi')],
            ['Midtrans tidak tersedia', 502, 'Bad Gateway', err('MIDTRANS_UNAVAILABLE', 'gagal membuat transaksi pembayaran')],
            ['Error internal', 500, 'Internal Server Error', err('INTERNAL', 'terjadi kesalahan')],
          ],
          test: [
            'const r = pm.response.json();',
            'if (r.order_code) pm.collectionVariables.set("orderCode", r.order_code);',
            'if (r.public_slug) pm.collectionVariables.set("publicSlug", r.public_slug);',
          ],
        }),
        req({
          name: 'Status order (polling)',
          method: 'GET',
          path: '/v1/orders/{{orderCode}}',
          description: 'Publik. Dipanggil frontend setelah Snap ditutup.',
          responses: [
            [
              'OK',
              200,
              'OK',
              JSON.stringify(
                {
                  order_code: 'GBX-261009-K3M8XA',
                  public_slug: 'k7bdm2xq9r',
                  status: 'paid',
                  amount: 49000,
                  currency: 'IDR',
                  payment_status: 'success',
                  payment_type: 'qris',
                  paid_at: '2026-10-09T10:05:00Z',
                  gift_unlock_path: '/v1/gifts/k7bdm2xq9r',
                },
                null,
                2,
              ),
            ],
            ['Tidak ditemukan', 404, 'Not Found', err('ORDER_NOT_FOUND', 'order tidak ditemukan')],
            ['Error internal', 500, 'Internal Server Error', err('INTERNAL', 'terjadi kesalahan')],
          ],
        }),
      ],
    },
    {
      name: 'Payments',
      item: [
        req({
          name: 'Webhook notifikasi Midtrans',
          method: 'POST',
          path: '/v1/payments/notifications',
          description:
            'Hanya dipanggil Midtrans. signature_key = sha512(order_id + status_code + gross_amount + server_key). Contoh di bawah memakai signature palsu sehingga akan ditolak 403 — hitung sendiri dengan server key sandbox untuk uji lokal.',
          headers: { 'Content-Type': 'application/json' },
          body: {
            order_id: '{{orderCode}}',
            status_code: '200',
            gross_amount: '49000.00',
            transaction_status: 'settlement',
            fraud_status: 'accept',
            transaction_id: 'txn-contoh-001',
            payment_type: 'qris',
            signature_key: 'HITUNG-SENDIRI',
          },
          responses: [
            ['Diproses', 200, 'OK', JSON.stringify({ status: 'processed', duplicate: false }, null, 2)],
            ['Order tidak dikenal (diabaikan)', 200, 'OK', JSON.stringify({ status: 'ignored', reason: 'order_not_found' }, null, 2)],
            ['Body bukan JSON', 400, 'Bad Request', err('INVALID_BODY', 'payload notifikasi bukan JSON valid')],
            ['Notifikasi tidak valid', 400, 'Bad Request', err('INVALID_NOTIFICATION', 'notifikasi tidak lengkap')],
            ['Signature salah', 403, 'Forbidden', err('INVALID_SIGNATURE', 'signature tidak valid')],
            ['Error internal', 500, 'Internal Server Error', err('INTERNAL', 'gagal memproses notifikasi')],
            ['Nominal tidak cocok', 422, 'Unprocessable Entity', err('AMOUNT_MISMATCH', 'gross_amount tidak sesuai order')],
          ],
        }),
      ],
    },
    {
      name: 'Gifts',
      item: [
        req({
          name: 'Isi hadiah untuk penerima',
          method: 'GET',
          path: '/v1/gifts/{{publicSlug}}',
          description: 'Publik. Mengembalikan builder state lengkap hanya bila order sudah paid.',
          responses: [
            ['OK (paid)', 200, 'OK', JSON.stringify({ ...orderBody, customer: undefined }, null, 2)],
            ['Belum dibayar', 403, 'Forbidden', err('GIFT_LOCKED', 'hadiah belum bisa dibuka')],
            ['Tidak ditemukan', 404, 'Not Found', err('GIFT_NOT_FOUND', 'gift tidak ditemukan')],
            ['Error internal', 500, 'Internal Server Error', err('INTERNAL', 'gagal mengambil gift')],
          ],
        }),
      ],
    },
    {
      name: 'Uploads',
      item: [
        req({
          name: 'Unggah foto / video',
          method: 'POST',
          path: '/v1/uploads',
          description: 'Publik, multipart (maks 25 MB). Field: file, type = photo | video. File diserve di /uploads/*.',
          formdata: [
            { key: 'type', value: 'photo', type: 'text' },
            { key: 'file', type: 'file', src: [] },
          ],
          responses: [
            [
              'OK',
              200,
              'OK',
              JSON.stringify(
                { id: '7f1c2e9a-0000-4000-8000-000000000000', url: '/uploads/7f1c2e9a-0000-4000-8000-000000000000.webp' },
                null,
                2,
              ),
            ],
            ['Form tidak valid', 400, 'Bad Request', err('INVALID_REQUEST', 'failed to parse form')],
            ['File kosong', 400, 'Bad Request', err('MISSING_FILE', 'file field required')],
            ['Tipe salah', 400, 'Bad Request', err('INVALID_TYPE', "type harus 'photo' atau 'video'")],
            ['Gagal simpan', 500, 'Internal Server Error', err('UPLOAD_FAILED', 'gagal menyimpan file')],
          ],
        }),
      ],
    },
  ],
}

const environment = {
  name: 'SDT API — lokal',
  values: [
    { key: 'baseUrl', value: 'http://localhost:8080', type: 'default', enabled: true },
    { key: 'orderCode', value: '', type: 'default', enabled: true },
    { key: 'publicSlug', value: '', type: 'default', enabled: true },
  ],
  _postman_variable_scope: 'environment',
}

writeFileSync(join(here, 'sdt-api.postman_collection.json'), JSON.stringify(collection, null, 2) + '\n')
writeFileSync(join(here, 'sdt-api.postman_environment.json'), JSON.stringify(environment, null, 2) + '\n')
const count = collection.item.reduce((n, f) => n + f.item.length, 0)
console.log(`collection: ${count} request · environment: ${environment.values.length} variabel`)
