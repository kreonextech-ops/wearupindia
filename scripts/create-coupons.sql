-- ════════════════════════════════════════════════════════════
-- CREATE-COUPONS.SQL
-- Run ONCE in: Supabase Dashboard → SQL Editor → Run
-- Creates: coupons table + coupon_usages table + RLS policies
-- ════════════════════════════════════════════════════════════

-- ── COUPONS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code             text NOT NULL UNIQUE,
  discount_type    text NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value   numeric(10,2) NOT NULL,
  expiry_date      date,
  usage_limit      integer DEFAULT 100,
  times_used       integer DEFAULT 0,
  is_active        boolean DEFAULT true,
  influencer_name  text,
  influencer_contact text,
  created_at       timestamptz DEFAULT now()
);

-- ── COUPON USAGES TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id         uuid REFERENCES public.coupons(id) ON DELETE CASCADE,
  coupon_code       text NOT NULL,
  order_id          uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name     text,
  customer_email    text,
  order_total       numeric(10,2),
  discount_applied  numeric(10,2),
  used_at           timestamptz DEFAULT now()
);

-- ── RLS POLICIES ───────────────────────────────────────────
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

-- Anyone can read a single coupon to validate at checkout
DROP POLICY IF EXISTS "coupons_select_all" ON public.coupons;
CREATE POLICY "coupons_select_all"
  ON public.coupons FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can create/update/delete coupons
DROP POLICY IF EXISTS "coupons_admin_all" ON public.coupons;
CREATE POLICY "coupons_admin_all"
  ON public.coupons FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Authenticated users can insert usage logs (during order placement)
DROP POLICY IF EXISTS "coupon_usages_insert" ON public.coupon_usages;
CREATE POLICY "coupon_usages_insert"
  ON public.coupon_usages FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Admins can read all usage logs
DROP POLICY IF EXISTS "coupon_usages_admin_select" ON public.coupon_usages;
CREATE POLICY "coupon_usages_admin_select"
  ON public.coupon_usages FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── INDEXES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons (code);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_code ON public.coupon_usages (coupon_code);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_order_id ON public.coupon_usages (order_id);
