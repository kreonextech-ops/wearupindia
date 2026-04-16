-- ════════════════════════════════════════════════════════════════
-- FIX-ALL-RLS-FINAL.SQL
-- Run this ONCE in: Supabase Dashboard → SQL Editor → Run
-- Fixes: (1) customers not showing, (2) orders not showing,
--         (3) profile not updated after checkout
-- ════════════════════════════════════════════════════════════════

-- ── HELPER: a stable is_admin() function to avoid recursive RLS ──
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ══════════════════════════════════════════════════════════════
-- SECTION 1: PROFILES TABLE
-- ══════════════════════════════════════════════════════════════

-- Drop ALL existing profile policies to start clean
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are selectable by owner or admin" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 1a. SELECT: users see their own, admins see all
CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR public.is_admin()
  );

-- 1b. UPDATE: users update their own profile (checkout sync)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 1c. UPDATE: admins update any profile
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- 1d. INSERT: allow the trigger to create profiles on signup
--     (service_role handles this, but just in case)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Make sure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- ══════════════════════════════════════════════════════════════
-- SECTION 2: ORDERS TABLE
-- ══════════════════════════════════════════════════════════════

-- Drop ALL existing order policies
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow guest order insert" ON public.orders;
DROP POLICY IF EXISTS "Admins full access orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;

-- 2a. SELECT: users see their own orders
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2b. SELECT: admins see ALL orders
CREATE POLICY "orders_select_admin"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 2c. INSERT: authenticated users insert their own orders
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 2d. INSERT: guest / anon checkout (user_id IS NULL)
CREATE POLICY "orders_insert_guest"
  ON public.orders FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- 2e. UPDATE/DELETE: admins only
CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "orders_delete_admin"
  ON public.orders FOR DELETE
  TO authenticated
  USING (public.is_admin());

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;


-- ══════════════════════════════════════════════════════════════
-- SECTION 3: ORDER_ITEMS TABLE
-- ══════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Users can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow guest order items insert" ON public.order_items;
DROP POLICY IF EXISTS "Admins full access order_items" ON public.order_items;
DROP POLICY IF EXISTS "Users can read their own order items" ON public.order_items;

-- 3a. SELECT: users see items from their own orders
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- 3b. SELECT: admins see all order_items
CREATE POLICY "order_items_select_admin"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 3c. INSERT: authenticated users
CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- 3d. INSERT: guest/anon
CREATE POLICY "order_items_insert_guest"
  ON public.order_items FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id IS NULL
    )
  );

-- 3e. UPDATE/DELETE: admins only
CREATE POLICY "order_items_update_admin"
  ON public.order_items FOR UPDATE
  TO authenticated
  USING (public.is_admin());

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;


-- ══════════════════════════════════════════════════════════════
-- SECTION 4: ENSURE profiles trigger exists (auto-create profile on signup)
-- ══════════════════════════════════════════════════════════════

-- Create or replace the function that syncs auth.users → profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'customer',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- don't overwrite if already exists
  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ══════════════════════════════════════════════════════════════
-- DONE. All policies applied.
-- ══════════════════════════════════════════════════════════════
