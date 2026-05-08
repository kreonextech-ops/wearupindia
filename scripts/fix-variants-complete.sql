-- ════════════════════════════════════════════════════════════════
-- FIX-VARIANTS-COMPLETE.SQL
-- Run this in Supabase Dashboard → SQL Editor → Run
-- This script is safe to run multiple times
-- ════════════════════════════════════════════════════════════════

-- STEP 1: Create variants table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.variants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name        text NOT NULL,         -- e.g. "Size" or "Option"
  value       text NOT NULL,         -- e.g. "XL" or "R15 - Standard Matte"
  stock       integer NOT NULL DEFAULT 0,
  price_adjustment numeric(10,2) NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- STEP 2: Ensure is_admin() function exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- STEP 3: Enable RLS
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- STEP 4: VARIANTS Policies
DROP POLICY IF EXISTS "Allow public to view variants" ON public.variants;
CREATE POLICY "Allow public to view variants"
  ON public.variants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins have full access to variants" ON public.variants;
CREATE POLICY "Admins have full access to variants"
  ON public.variants FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- STEP 5: PRODUCTS Policies
DROP POLICY IF EXISTS "Allow public to view products" ON public.products;
CREATE POLICY "Allow public to view products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- STEP 6: Verify everything is set up
SELECT 
  tablename, 
  policyname, 
  cmd
FROM pg_policies 
WHERE tablename IN ('variants', 'products')
ORDER BY tablename, policyname;
