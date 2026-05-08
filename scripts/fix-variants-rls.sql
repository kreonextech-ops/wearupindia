-- ════════════════════════════════════════════════════════════════
-- FIX-VARIANTS-RLS.SQL (FIXED)
-- ════════════════════════════════════════════════════════════════

-- 1. Ensure the is_admin() helper exists
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

-- 2. Enable RLS on tables
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. VARIANTS Policies
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

-- 4. PRODUCTS Policies
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

-- 5. Verification
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('variants', 'products');
