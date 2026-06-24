-- ============================================================
-- EXTRO PHASE 1 MIGRATION — Full Delivery Lifecycle
-- Run once in Supabase → SQL Editor
-- ============================================================

-- ── Orders: add lifecycle columns ─────────────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS pickup_code                 text,
  ADD COLUMN IF NOT EXISTS delivery_code               text,
  ADD COLUMN IF NOT EXISTS vehicle_state               text DEFAULT 'idle',
  ADD COLUMN IF NOT EXISTS pickup_confirmed_at         timestamptz,
  ADD COLUMN IF NOT EXISTS delivery_confirmed_at       timestamptz,
  ADD COLUMN IF NOT EXISTS driver_arrived_restaurant_at timestamptz,
  ADD COLUMN IF NOT EXISTS driver_arrived_customer_at  timestamptz,
  ADD COLUMN IF NOT EXISTS estimated_pickup_at         timestamptz,
  ADD COLUMN IF NOT EXISTS estimated_delivery_at       timestamptz;

-- Status comment (14-step lifecycle)
COMMENT ON COLUMN public.orders.status IS
  'pending | accepted | preparing | ready | driver_assigned | driver_en_route | driver_at_restaurant | driver_collecting | picked_up | in_transit | driver_nearby | driver_arrived | delivered | cancelled';

COMMENT ON COLUMN public.orders.vehicle_state IS
  'idle | driving_to_restaurant | parked_at_restaurant | walking_to_collect | returning_to_vehicle | driving_to_customer | parked_at_customer';

-- ── Drivers: heading + speed ────────────────────────────────────
ALTER TABLE public.drivers
  ADD COLUMN IF NOT EXISTS heading              double precision,
  ADD COLUMN IF NOT EXISTS speed                double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_location_update timestamptz;

-- ── Restaurants: approval + operations ─────────────────────────
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS approval_status   text DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS operating_hours   jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prep_time_minutes integer DEFAULT 25,
  ADD COLUMN IF NOT EXISTS phone             text,
  ADD COLUMN IF NOT EXISTS rejection_reason  text;

-- ── New table: order_status_history ────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   uuid        NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status     text        NOT NULL,
  notes      text,
  created_by uuid        REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "osh_select" ON public.order_status_history
    FOR SELECT USING (
      order_id IN (
        SELECT id FROM public.orders
        WHERE customer_id = auth.uid()
           OR driver_id   = auth.uid()
           OR restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid())
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "osh_insert" ON public.order_status_history
    FOR INSERT WITH CHECK (
      order_id IN (
        SELECT id FROM public.orders
        WHERE customer_id = auth.uid()
           OR driver_id   = auth.uid()
           OR restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid())
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── New table: driver_location_updates ─────────────────────────
CREATE TABLE IF NOT EXISTS public.driver_location_updates (
  id            uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid             REFERENCES public.orders(id) ON DELETE CASCADE,
  driver_id     uuid             NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  latitude      double precision NOT NULL,
  longitude     double precision NOT NULL,
  heading       double precision,
  speed         double precision,
  vehicle_state text,
  created_at    timestamptz      DEFAULT now()
);

ALTER TABLE public.driver_location_updates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "dlu_driver_write" ON public.driver_location_updates
    FOR INSERT WITH CHECK (driver_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "dlu_read" ON public.driver_location_updates
    FOR SELECT USING (
      driver_id = auth.uid()
      OR order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Realtime ────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_location_updates;

-- ── Orders RLS: allow drivers to see new statuses ───────────────
-- Update the existing orders read policy to include driver-phase statuses
DROP POLICY IF EXISTS "orders_customer_read" ON public.orders;
CREATE POLICY "orders_customer_read" ON public.orders
  FOR SELECT USING (
    auth.uid() = customer_id
    OR restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid())
    OR auth.uid() = driver_id
    OR (status = 'ready' AND driver_id IS NULL)
  );

-- ── Trigger: auto-generate pickup + delivery codes ──────────────
CREATE OR REPLACE FUNCTION public.generate_order_codes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- 6-digit pickup code when restaurant marks order ready
  IF NEW.status = 'ready' AND (OLD.status IS DISTINCT FROM 'ready') THEN
    NEW.pickup_code = LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
  END IF;

  -- 6-digit delivery code + timestamp when driver confirms pickup
  IF NEW.status = 'picked_up' AND (OLD.status IS DISTINCT FROM 'picked_up') THEN
    NEW.delivery_code        = LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
    NEW.pickup_confirmed_at  = now();
  END IF;

  -- Delivery confirmation timestamp
  IF NEW.status = 'delivered' AND (OLD.status IS DISTINCT FROM 'delivered') THEN
    NEW.delivery_confirmed_at = now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_codes ON public.orders;
CREATE TRIGGER trg_order_codes
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_codes();
