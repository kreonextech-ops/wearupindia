-- ============================================================
-- FIX 1: Add RLS policy so admins can read ALL orders & order_items
-- ============================================================

-- Allow admins to read all orders
DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
CREATE POLICY "Admins can read all orders" ON public.orders
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Allow admins to read all order_items
DROP POLICY IF EXISTS "Admins can read all order_items" ON public.order_items;
CREATE POLICY "Admins can read all order_items" ON public.order_items
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Allow admins to insert orders (for future admin-placed orders)
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Allow users to insert their own orders (needed for checkout)
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert order items
DROP POLICY IF EXISTS "Users can insert order items" ON public.order_items;
CREATE POLICY "Users can insert order items" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Allow admins to manage all order items
DROP POLICY IF EXISTS "Admins can manage order_items" ON public.order_items;
CREATE POLICY "Admins can manage order_items" ON public.order_items
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================
-- FIX 2: Remove the duplicate T-Shirts category (slug: tshirts)
-- and ensure all products with that slug move to t-shirts
-- ============================================================

-- First: re-assign any products using 'tshirts' slug to 't-shirts'
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 't-shirts')
WHERE category_id = (SELECT id FROM public.categories WHERE slug = 'tshirts');

-- Then: delete the duplicate
DELETE FROM public.categories WHERE slug = 'tshirts';
