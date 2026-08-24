-- Commerce Foundation: grants, RLS, atomic claim, dan isolasi buyer.
begin;

select plan(23);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-4000-8000-000000000001',
    'authenticated',
    'authenticated',
    'buyer-a@example.test',
    '',
    now(),
    '{"provider":"anonymous","providers":["anonymous"]}',
    '{}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-4000-8000-000000000002',
    'authenticated',
    'authenticated',
    'buyer-b@example.test',
    '',
    now(),
    '{"provider":"anonymous","providers":["anonymous"]}',
    '{}',
    now(),
    now()
  );

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
values (
  '10000000-0000-4000-8000-000000000099',
  (select id from public.categories where slug = 'interactive-gifts'),
  'inactive-security-fixture',
  'Produk nonaktif',
  'Fixture untuk menguji RLS.',
  '/inactive-security-fixture',
  49000,
  'IDR',
  99,
  false,
  false
);

select is(
  (select display_name from public.profiles where id = '20000000-0000-4000-8000-000000000001'),
  'Demo Buyer',
  'trigger membuat profile Demo Buyer untuk anonymous user'
);

set local role anon;
select is(
  (select count(*) from public.products),
  5::bigint,
  'public hanya dapat membaca lima produk aktif'
);
select is(
  (select count(*) from public.products where slug = 'inactive-security-fixture'),
  0::bigint,
  'public tidak dapat membaca produk nonaktif'
);
select is(
  (select count(*) from public.categories),
  3::bigint,
  'public dapat membaca kategori aktif'
);
reset role;

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select is(
  (select already_owned from public.claim_demo_product('10000000-0000-4000-8000-000000000001')),
  false,
  'anonymous authenticated buyer dapat menjalankan demo claim pertama'
);
select is(
  (select count(*) from public.orders),
  1::bigint,
  'claim membuat satu order milik buyer'
);
select is(
  (select count(*) from public.order_items),
  1::bigint,
  'claim membuat satu order item milik buyer'
);
select is(
  (select count(*) from public.entitlements),
  1::bigint,
  'claim membuat satu entitlement milik buyer'
);
select is(
  (select price_amount_snapshot from public.order_items limit 1),
  69000,
  'harga snapshot berasal dari harga integer database, bukan input browser'
);
select is(
  (select already_owned from public.claim_demo_product('10000000-0000-4000-8000-000000000001')),
  true,
  'claim duplikat mengembalikan status sudah dimiliki'
);
select is(
  (select count(*) from public.orders),
  1::bigint,
  'claim duplikat tidak membuat order baru'
);
reset role;

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000002', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select is(
  (select count(*) from public.profiles where id = '20000000-0000-4000-8000-000000000001'),
  0::bigint,
  'buyer B tidak dapat membaca profile buyer A'
);
select is(
  (select count(*) from public.orders),
  0::bigint,
  'buyer B tidak dapat membaca order buyer A'
);
select is(
  (select count(*) from public.order_items),
  0::bigint,
  'buyer B tidak dapat membaca order item buyer A'
);
select is(
  (select count(*) from public.entitlements),
  0::bigint,
  'buyer B tidak dapat membaca entitlement buyer A'
);
reset role;

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;
select throws_ok(
  $$select public.claim_demo_product('10000000-0000-4000-8000-000000000099')$$,
  'P0001',
  'Produk tidak ditemukan atau tidak aktif',
  'produk nonaktif tidak dapat diklaim'
);
reset role;

select ok(
  not has_function_privilege('anon', 'public.claim_demo_product(uuid)', 'EXECUTE'),
  'unauthenticated anon tidak dapat menjalankan RPC claim'
);
select ok(
  not has_table_privilege('anon', 'public.products', 'INSERT')
  and not has_table_privilege('anon', 'public.products', 'UPDATE')
  and not has_table_privilege('anon', 'public.products', 'DELETE'),
  'anon tidak dapat mengubah catalog'
);
select ok(
  not has_table_privilege('authenticated', 'public.categories', 'INSERT')
  and not has_table_privilege('authenticated', 'public.categories', 'UPDATE')
  and not has_table_privilege('authenticated', 'public.categories', 'DELETE'),
  'authenticated tidak dapat mengubah catalog'
);
select ok(
  not has_table_privilege('authenticated', 'public.products', 'INSERT')
  and not has_table_privilege('authenticated', 'public.products', 'UPDATE')
  and not has_table_privilege('authenticated', 'public.products', 'DELETE'),
  'authenticated tidak dapat mengubah produk'
);
select ok(
  not has_table_privilege('authenticated', 'public.orders', 'INSERT')
  and not has_table_privilege('authenticated', 'public.orders', 'UPDATE')
  and not has_table_privilege('authenticated', 'public.orders', 'DELETE'),
  'authenticated tidak dapat mengubah order langsung'
);
select ok(
  not has_table_privilege('authenticated', 'public.order_items', 'INSERT')
  and not has_table_privilege('authenticated', 'public.order_items', 'UPDATE')
  and not has_table_privilege('authenticated', 'public.order_items', 'DELETE'),
  'authenticated tidak dapat mengubah order item langsung'
);
select ok(
  not has_table_privilege('authenticated', 'public.entitlements', 'INSERT')
  and not has_table_privilege('authenticated', 'public.entitlements', 'UPDATE')
  and not has_table_privilege('authenticated', 'public.entitlements', 'DELETE'),
  'authenticated tidak dapat mengubah entitlement langsung'
);

select * from finish();

rollback;
