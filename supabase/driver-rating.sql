-- Add driver rating columns to orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS driver_rating   smallint,
  ADD COLUMN IF NOT EXISTS driver_rating_note text;
