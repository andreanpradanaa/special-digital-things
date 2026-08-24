insert into public.categories (id, slug, name, description, sort_order, is_active)
values
  ('00000000-0000-4000-8000-000000000001', 'interactive-gifts', 'Interactive Gifts', 'Koleksi pengalaman hadiah digital interaktif.', 1, true),
  ('00000000-0000-4000-8000-000000000002', 'games', 'Games', 'Kategori untuk permainan interaktif di milestone mendatang.', 2, true),
  ('00000000-0000-4000-8000-000000000003', 'invitations', 'Invitations', 'Kategori untuk undangan digital di milestone mendatang.', 3, true)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.products (
  id,
  category_id,
  slug,
  name,
  short_description,
  experience_path,
  price_amount,
  currency,
  sort_order,
  is_featured,
  is_active
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    (select id from public.categories where slug = 'interactive-gifts'),
    'secret-message-machine',
    'Secret Message Machine',
    'Sebuah mesin kecil untuk kata-kata yang hampir terucap.',
    '/secret-message-machine',
    69000,
    'IDR',
    1,
    true,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    (select id from public.categories where slug = 'interactive-gifts'),
    'unsaid-garden',
    'The Unsaid Garden',
    'Sebuah rumah kaca kecil untuk kata-kata yang membutuhkan waktu sebelum berani mekar.',
    '/unsaid-garden',
    79000,
    'IDR',
    2,
    false,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    (select id from public.categories where slug = 'interactive-gifts'),
    'heart-repair',
    'Tiny Heart Repair Shop',
    'Untuk hari yang terasa terlalu berat dan hati yang membutuhkan sedikit perawatan.',
    '/heart-repair',
    69000,
    'IDR',
    3,
    false,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    (select id from public.categories where slug = 'interactive-gifts'),
    'lost-and-found',
    'The Things You Left With Me',
    'Untuk hal-hal kecil yang tetap tinggal, bahkan setelah waktunya berlalu.',
    '/lost-and-found',
    79000,
    'IDR',
    4,
    false,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    (select id from public.categories where slug = 'interactive-gifts'),
    'midnight-radio',
    '11:11 Midnight Radio',
    'Untuk pesan yang hanya berani terdengar ketika malam menjadi tenang.',
    '/midnight-radio',
    89000,
    'IDR',
    5,
    false,
    true
  )
on conflict (slug) do update
set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  experience_path = excluded.experience_path,
  price_amount = excluded.price_amount,
  currency = excluded.currency,
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  updated_at = now();
