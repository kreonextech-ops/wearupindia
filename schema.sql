-- Drop existing tables if needed (careful in production!)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS testimonials;

-- 1. Categories Table
CREATE TABLE categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  "accentColor" TEXT NOT NULL
);

-- 2. Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT REFERENCES categories(slug) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  "originalPrice" NUMERIC,
  badge TEXT,
  rating NUMERIC NOT NULL,
  reviews INTEGER NOT NULL,
  images TEXT[] NOT NULL,
  description TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  "isNew" BOOLEAN DEFAULT false,
  "isBestSeller" BOOLEAN DEFAULT false
);

CREATE INDEX idx_products_category ON products(category);

-- 3. Services Table
CREATE TABLE services (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  image TEXT NOT NULL,
  features TEXT[] NOT NULL,
  process JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 4. Testimonials Table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  city TEXT NOT NULL,
  stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  text TEXT NOT NULL
);

-- Add public read access policies (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products"   ON products   FOR SELECT USING (true);
CREATE POLICY "Allow public read access to services"   ON services   FOR SELECT USING (true);
CREATE POLICY "Allow public read access to testimonials" ON testimonials FOR SELECT USING (true);
