-- Run this in Supabase SQL Editor
-- Adds registration fields and per-document tracking to restaurants table

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS brand_name              text,
  ADD COLUMN IF NOT EXISTS cuisine_type            text,
  ADD COLUMN IF NOT EXISTS num_locations           integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS social_media            text,
  ADD COLUMN IF NOT EXISTS floor_suite             text,
  ADD COLUMN IF NOT EXISTS cert_url                text,
  ADD COLUMN IF NOT EXISTS cert_status             text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS business_reg_url        text,
  ADD COLUMN IF NOT EXISTS business_reg_status     text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS bank_account_url        text,
  ADD COLUMN IF NOT EXISTS bank_account_status     text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS menu_pricing_url        text,
  ADD COLUMN IF NOT EXISTS menu_pricing_status     text DEFAULT 'pending';

-- Also allow admins to update restaurant documents
DROP POLICY IF EXISTS "restaurants_admin_all" ON public.restaurants;
CREATE POLICY "restaurants_admin_all" ON public.restaurants FOR ALL USING (public.is_admin());
