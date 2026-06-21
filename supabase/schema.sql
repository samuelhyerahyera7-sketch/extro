-- ============================================================
-- DELIVERY APP DATABASE SCHEMA
-- Run this in Supabase → SQL Editor
-- ============================================================

-- ── Profiles (extends auth.users) ───────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  first_name  text,
  last_name   text,
  phone       text,
  avatar_url  text,
  role        text not null default 'customer',  -- customer | restaurant | driver
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Restaurants / stores ─────────────────────────────────────
create table if not exists public.restaurants (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references public.profiles(id) on delete cascade,
  name        text not null,
  category    text,
  address     text,
  lat         double precision,
  lng         double precision,
  logo_url    text,
  is_open     boolean default true,
  created_at  timestamptz default now()
);

-- ── Menu items ────────────────────────────────────────────────
create table if not exists public.menu_items (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  name          text not null,
  description   text,
  price         numeric(10,2) not null,
  image_url     text,
  available     boolean default true,
  created_at    timestamptz default now()
);

-- ── Drivers ───────────────────────────────────────────────────
create table if not exists public.drivers (
  id           uuid primary key references public.profiles(id) on delete cascade,
  vehicle_type text default 'car',  -- car | bike | scooter
  is_online    boolean default false,
  current_lat  double precision,
  current_lng  double precision,
  updated_at   timestamptz default now()
);

-- ── Orders ────────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid references public.profiles(id) on delete cascade,
  restaurant_id   uuid references public.restaurants(id) on delete cascade,
  driver_id       uuid references public.profiles(id),
  status          text not null default 'pending',
    -- pending | accepted | preparing | ready | picked_up | delivered | cancelled
  items           jsonb not null default '[]',
  subtotal        numeric(10,2) not null default 0,
  delivery_fee    numeric(10,2) not null default 0,
  total           numeric(10,2) not null default 0,
  delivery_address text,
  delivery_lat    double precision,
  delivery_lng    double precision,
  payment_status  text default 'unpaid',  -- unpaid | paid | failed
  payment_ref     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Saved delivery addresses (customers) ─────────────────────
create table if not exists public.addresses (
  id                    uuid primary key default gen_random_uuid(),
  customer_id           uuid references public.profiles(id) on delete cascade,
  label                 text default 'Home',
  address_type          text default 'house',  -- house | flat | townhouse | office | hotel
  street_address        text,
  house_number          text,
  delivery_instructions text,
  lat                   double precision,
  lng                   double precision,
  is_default            boolean default false,
  created_at            timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles    enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_items  enable row level security;
alter table public.drivers     enable row level security;
alter table public.orders      enable row level security;
alter table public.addresses   enable row level security;

-- profiles: users read/write own row only
create policy "profiles_own" on public.profiles
  using (auth.uid() = id) with check (auth.uid() = id);

-- restaurants: anyone can read (browse), only owner can write
create policy "restaurants_read_all" on public.restaurants
  for select using (true);
create policy "restaurants_owner_write" on public.restaurants
  for insert with check (auth.uid() = owner_id);
create policy "restaurants_owner_update" on public.restaurants
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "restaurants_owner_delete" on public.restaurants
  for delete using (auth.uid() = owner_id);

-- menu_items: anyone can read, only the owning restaurant's owner can write
create policy "menu_items_read_all" on public.menu_items
  for select using (true);
create policy "menu_items_owner_write" on public.menu_items
  for insert with check (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );
create policy "menu_items_owner_update" on public.menu_items
  for update using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );
create policy "menu_items_owner_delete" on public.menu_items
  for delete using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

-- drivers: a driver can read/write their own row; available drivers list readable by all authenticated users
create policy "drivers_own_write" on public.drivers
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "drivers_read_all" on public.drivers
  for select using (true);

-- orders: customer sees own orders; restaurant owner sees orders for their restaurant;
-- driver sees unassigned "ready" orders plus orders assigned to them
create policy "orders_customer_read" on public.orders
  for select using (
    auth.uid() = customer_id
    or restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
    or auth.uid() = driver_id
    or (status = 'ready' and driver_id is null)
  );

create policy "orders_customer_insert" on public.orders
  for insert with check (auth.uid() = customer_id);

create policy "orders_update" on public.orders
  for update using (
    auth.uid() = customer_id
    or restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
    or auth.uid() = driver_id
    or (status = 'ready' and driver_id is null)
  );

-- addresses: customers own their own addresses
create policy "addresses_own" on public.addresses
  using (auth.uid() = customer_id) with check (auth.uid() = customer_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGN UP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.phone,
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;

  if coalesce(new.raw_user_meta_data->>'role', 'customer') = 'driver' then
    insert into public.drivers (id) values (new.id) on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Subscriptions (Extro Pass) ────────────────────────────────
create table if not exists public.subscriptions (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete cascade,
  plan        text not null default 'extro_pass',
  status      text not null default 'active',  -- active | cancelled | expired
  price       numeric(10,2) not null default 49.00,
  started_at  timestamptz default now(),
  expires_at  timestamptz,
  created_at  timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_own" on public.subscriptions
  using (auth.uid() = customer_id) with check (auth.uid() = customer_id);

-- ============================================================
-- REALTIME
-- ============================================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.drivers;
alter publication supabase_realtime add table public.subscriptions;
