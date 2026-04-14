-- WEARUP ENTERPRISE SCHEMA (SUPABASE)
-- Last Updated: 2024-03-28

-- 0. Profiles & Auth Setup
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  shipping_address JSONB DEFAULT '{}', -- Stores { street, city, state, zip }
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  tagline TEXT,
  image_url TEXT,
  accent_color TEXT DEFAULT '#000000',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(12,2),
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Product Variants (Size, Color, etc.)
CREATE TABLE IF NOT EXISTS public.variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., 'Size', 'Color'
  value TEXT NOT NULL, -- e.g., 'XL', 'Matte Black'
  price_adjustment NUMERIC(12,2) DEFAULT 0.00,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC(12,2) NOT NULL,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded')),
  shipping_address JSONB DEFAULT '{}',
  payment_intent_id TEXT, -- For UPI/Stripe/etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.variants(id),
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC(12,2) NOT NULL
);

-- 6. Services & Testimonials (Retained from Legacy)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price TEXT,
  duration TEXT,
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  process JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  city TEXT,
  stars INTEGER DEFAULT 5 CHECK (stars BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Persistent Carts (For Server Sync)
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  items JSONB DEFAULT '[]', -- Stores [{ product_id, quantity, size }]
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Persistent Wishlists
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  items JSONB DEFAULT '[]', -- Stores [product_id]
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- ─── SAFE POLICIES (DROP IF EXISTS) ───

-- Select Policies (Public Read)
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Variants" ON public.variants;
CREATE POLICY "Public Read Variants" ON public.variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Services" ON public.services;
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Testimonials" ON public.testimonials;
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (true);

-- Profile Policies
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Order Policies
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;
CREATE POLICY "Users can read their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Cart Policies
DROP POLICY IF EXISTS "Users can manage their own cart" ON public.carts;
CREATE POLICY "Users can manage their own cart" ON public.carts 
  FOR ALL USING (auth.uid() = user_id);

-- Wishlist Policies
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public.wishlists;
CREATE POLICY "Users can manage their own wishlist" ON public.wishlists 
  FOR ALL USING (auth.uid() = user_id);

-- Admin Global Access (Example role-based logic)
DROP POLICY IF EXISTS "Admins have full access" ON public.products;
CREATE POLICY "Admins have full access" ON public.products 
  FOR ALL TO authenticated 
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- ─── SEED DATA ───
INSERT INTO public.categories (name, slug, description, tagline)
VALUES 
  ('Stickers & Wraps', 'stickers-wraps', 'Custom vinyl wraps and precision-cut stickers.', 'Dress Your Machine'),
  ('Accessories', 'accessories', 'Helmets, gloves, and riding gear.', 'Gear Up Right'),
  ('Merchandise', 'merchandise', 'Apparel and lifestyle gear.', 'Wear The Culture')
ON CONFLICT (slug) DO NOTHING;

-- ─── AUTOMATIC PROFILE CREATION ───
-- This function runs every time a user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    'customer' -- Default role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function above
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
