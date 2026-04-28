-- ════════════════════════════════════════════════════════════════
-- SEED-CATEGORIES.SQL
-- Run this ONCE in: Supabase Dashboard → SQL Editor → Run
-- Fixes: Missing category slugs needed by admin panel
-- ════════════════════════════════════════════════════════════════

-- Insert all categories used by the admin panel and shop pages
INSERT INTO public.categories (name, slug, description, tagline, is_active)
VALUES
  ('T-Shirts',         'tshirts',          'Minimalist rider apparel for those who wear the brand.',  'Wear The Brand',    true),
  ('Graphic Kits',     'graphic-kits',     'Custom vinyl wraps and precision-cut sticker kits.',       'Dress Your Machine', true),
  ('Bike Accessories', 'bike-accessories', 'Premium motorcycle riding gear and accessories.',           'Upgrade Your Ride', true),
  ('Hoodies',          'hoodies',          'Heavyweight premium hoodies for cold morning rides.',       'Ride in Comfort',   true),
  ('Keychains',        'keychains',        'Premium metal and leather keychains for riders.',           'Pocket Essentials',  true)
ON CONFLICT (slug) DO NOTHING;

-- Verify what is now in the table
SELECT id, name, slug, is_active FROM public.categories ORDER BY name;
