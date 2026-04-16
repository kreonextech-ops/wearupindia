-- ─── FIX: ADD MISSING INSERT/UPDATE POLICIES ───
-- Run this in: Supabase Dashboard → SQL Editor

-- 1. Allow authenticated users to INSERT their own orders
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 2. Allow unauthenticated/guest checkout (user_id = NULL)
DROP POLICY IF EXISTS "Allow guest order insert" ON public.orders;
CREATE POLICY "Allow guest order insert"
  ON public.orders FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- 3. Allow users to INSERT order_items for their own orders
DROP POLICY IF EXISTS "Users can insert order items" ON public.order_items;
CREATE POLICY "Users can insert order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- 4. Allow guest order_items insert (for orders with null user_id)
DROP POLICY IF EXISTS "Allow guest order items insert" ON public.order_items;
CREATE POLICY "Allow guest order items insert"
  ON public.order_items FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id IS NULL
    )
  );

-- 5. Allow admins full access to orders
DROP POLICY IF EXISTS "Admins full access orders" ON public.orders;
CREATE POLICY "Admins full access orders"
  ON public.orders FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- 6. Allow admins full access to order_items
DROP POLICY IF EXISTS "Admins full access order_items" ON public.order_items;
CREATE POLICY "Admins full access order_items"
  ON public.order_items FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- 7. Allow users to read their own order_items
DROP POLICY IF EXISTS "Users can read their own order items" ON public.order_items;
CREATE POLICY "Users can read their own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );
