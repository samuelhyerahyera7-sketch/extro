-- ============================================================
-- ADMIN & ONBOARDING SCHEMA ADDITIONS
-- Run this in Supabase → SQL Editor AFTER schema.sql
-- ============================================================

-- ── Add missing columns to drivers ───────────────────────────
alter table public.drivers
  add column if not exists id_number            text,
  add column if not exists id_document_url      text,
  add column if not exists vehicle_document_url text,
  add column if not exists avatar_url           text,
  add column if not exists id_verified          boolean default false,
  add column if not exists onboarded_at         timestamptz,
  add column if not exists status               text default 'unregistered',
  add column if not exists rejection_reason     text;

-- ── Add missing columns to restaurants ───────────────────────
alter table public.restaurants
  add column if not exists is_approved       boolean default false,
  add column if not exists status            text default 'pending',
  add column if not exists phone             text,
  add column if not exists prep_time_minutes integer default 25,
  add column if not exists commission_rate   numeric(5,4) default 0.15,
  add column if not exists business_hours    jsonb,
  add column if not exists rejection_reason  text,
  add column if not exists reviewed_at       timestamptz,
  add column if not exists reviewed_by       uuid references public.profiles(id);

-- ── Security-definer helper (avoids RLS recursion) ───────────
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )
$$;

-- ── Admin policies ────────────────────────────────────────────
-- profiles: admin can read all rows
drop policy if exists "profiles_admin_read"   on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_read"   on public.profiles for select using (public.is_admin());
create policy "profiles_admin_update" on public.profiles for update using (public.is_admin());

-- drivers: admin can read and update any driver row
drop policy if exists "drivers_admin_all" on public.drivers;
create policy "drivers_admin_all" on public.drivers for all using (public.is_admin());

-- restaurants: admin can read and update any restaurant row
drop policy if exists "restaurants_admin_all" on public.restaurants;
create policy "restaurants_admin_all" on public.restaurants for all using (public.is_admin());

-- ── Set yourself as admin ─────────────────────────────────────
-- Replace <your-user-uuid> with your actual Supabase user ID.
-- Find it in Supabase → Authentication → Users.
--
-- update public.profiles set role = 'admin' where id = '<your-user-uuid>';
