-- ─── FIX: PROFILE POLICIES FOR ADMIN + CHECKOUT SYNC ───
-- Run this in: Supabase Dashboard → SQL Editor

-- 1. Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;

-- 2. NEW: Users read own + Admins read ALL profiles (for admin customers page)
CREATE POLICY "Profiles are selectable by owner or admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- 3. Drop old UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- 4. NEW: Users update own + WITH CHECK to prevent privilege escalation
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Admin can UPDATE any profile
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
