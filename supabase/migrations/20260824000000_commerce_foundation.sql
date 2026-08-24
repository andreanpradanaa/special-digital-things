create extension if not exists "pgcrypto" with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete restrict,
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  short_description text not null,
  experience_path text not null unique check (experience_path ~ '^/[a-z0-9-]+$'),
  price_amount integer not null check (price_amount >= 0),
  currency text not null default 'IDR' check (currency = upper(currency) and char_length(currency) = 3),
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status = 'demo_completed'),
  currency text not null check (currency = upper(currency) and char_length(currency) = 3),
  total_amount integer not null check (total_amount >= 0),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name_snapshot text not null,
  price_amount_snapshot integer not null check (price_amount_snapshot >= 0),
  created_at timestamptz not null default now()
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  order_item_id uuid not null references public.order_items(id) on delete restrict,
  granted_at timestamptz not null default now(),
  unique (buyer_id, product_id)
);

create index orders_buyer_id_created_at_idx on public.orders (buyer_id, created_at desc);
create index order_items_order_id_idx on public.order_items (order_id);
create index entitlements_buyer_id_granted_at_idx on public.entitlements (buyer_id, granted_at desc);
create index products_active_sort_order_idx on public.products (sort_order) where is_active;
create index categories_active_sort_order_idx on public.categories (sort_order) where is_active;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'Demo Buyer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create function public.claim_demo_product(product_id uuid)
returns table (entitlement_id uuid, already_owned boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_buyer_id uuid := auth.uid();
  active_product public.products%rowtype;
  existing_entitlement_id uuid;
  created_order_id uuid;
  created_order_item_id uuid;
  created_entitlement_id uuid;
begin
  if current_buyer_id is null then
    raise exception using errcode = '28000', message = 'Authentication required';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(current_buyer_id::text || ':' || product_id::text, 0)
  );

  select entitlement.id
  into existing_entitlement_id
  from public.entitlements as entitlement
  where entitlement.buyer_id = current_buyer_id
    and entitlement.product_id = $1;

  if found then
    return query select existing_entitlement_id, true;
    return;
  end if;

  select *
  into active_product
  from public.products as product
  where product.id = $1
    and product.is_active = true;

  if not found then
    raise exception using errcode = 'P0001', message = 'Produk tidak ditemukan atau tidak aktif';
  end if;

  insert into public.orders (buyer_id, status, currency, total_amount)
  values (current_buyer_id, 'demo_completed', active_product.currency, active_product.price_amount)
  returning id into created_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    product_name_snapshot,
    price_amount_snapshot
  )
  values (
    created_order_id,
    active_product.id,
    active_product.name,
    active_product.price_amount
  )
  returning id into created_order_item_id;

  insert into public.entitlements (buyer_id, product_id, order_item_id)
  values (current_buyer_id, active_product.id, created_order_item_id)
  returning id into created_entitlement_id;

  return query select created_entitlement_id, false;
end;
$$;

revoke all on table public.profiles, public.categories, public.products, public.orders,
  public.order_items, public.entitlements from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on table public.categories, public.products to anon, authenticated;
grant select, update on table public.profiles to authenticated;
grant select on table public.orders, public.order_items, public.entitlements to authenticated;

revoke all on function public.claim_demo_product(uuid) from public;
grant execute on function public.claim_demo_product(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.entitlements enable row level security;

create policy "profiles are readable by their owner"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "profiles are updated by their owner"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "active categories are publicly readable"
on public.categories for select to anon, authenticated
using (is_active = true);

create policy "active products are publicly readable"
on public.products for select to anon, authenticated
using (is_active = true);

create policy "orders are readable by their buyer"
on public.orders for select to authenticated
using ((select auth.uid()) = buyer_id);

create policy "order items are readable by their order buyer"
on public.order_items for select to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.buyer_id = (select auth.uid())
  )
);

create policy "entitlements are readable by their buyer"
on public.entitlements for select to authenticated
using ((select auth.uid()) = buyer_id);
