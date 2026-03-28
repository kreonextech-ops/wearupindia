import { createClient } from '@supabase/supabase-js'
import { categories, products, services, testimonials } from '../src/data/index.js'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Support both .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // or SERVICE_ROLE_KEY if bypassing RLS

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log("Starting seed...")

  // 1. Seed Categories
  const { error: catError } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' })
  if (catError) console.error("Error seeding categories:", catError)
  else console.log("✅ Categories seeded")

  // 2. Seed Products
  const mappedProducts = products.map(p => ({
    ...p,
    category: p.category, // match relation
    specs: p.specs // jsonb
  }))
  const { error: prodError } = await supabase.from('products').upsert(mappedProducts, { onConflict: 'slug' })
  if (prodError) console.error("Error seeding products:", prodError)
  else console.log("✅ Products seeded")

  // 3. Seed Services
  const { error: servError } = await supabase.from('services').upsert(services, { onConflict: 'slug' })
  if (servError) console.error("Error seeding services:", servError)
  else console.log("✅ Services seeded")

  // 4. Seed Testimonials
  // Don't upsert by ID since mock data doesn't have consistent IDs, we'll just insert
  // Warning: running this multiple times will duplicate testimonials!
  const { error: testError } = await supabase.from('testimonials').insert(
    testimonials.map(t => ({
      name: t.name,
      role: t.role,
      city: t.city,
      stars: t.stars,
      text: t.text
    }))
  )
  if (testError) console.error("Error seeding testimonials:", testError)
  else console.log("✅ Testimonials seeded")

  console.log("Seed complete!")
}

seed()
