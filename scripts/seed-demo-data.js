const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CATEGORIES = [
  { name: 'Graphic Kits', slug: 'graphic-kits', tagline: 'Dress Your Machine' },
  { name: 'Bike Accessories', slug: 'bike-accessories', tagline: 'Gear Up Right' },
  { name: 'Keychains', slug: 'keychains', tagline: 'Pocket Essentials' },
  { name: 'T-Shirts', slug: 'tshirts', tagline: 'Wear The Brand' },
  { name: 'Hoodies', slug: 'hoodies', tagline: 'Ride in Comfort' },
];

const PRODUCTS = [
  { name: 'Yamaha FZ-25 Venom Kit', slug: 'yamaha-fz25-venom', price: 2999, category_slug: 'graphic-kits' },
  { name: 'KTM Duke Carbon Kit', slug: 'ktm-duke-carbon', price: 3499, category_slug: 'graphic-kits' },
  { name: 'Royal Enfield Heritage Decals', slug: 're-heritage-decals', price: 1299, category_slug: 'graphic-kits' },
  { name: 'Carbon Phantom Helmet', slug: 'carbon-phantom-helmet', price: 24999, category_slug: 'bike-accessories' },
  { name: 'X-Pro Racing Gloves', slug: 'x-pro-racing-gloves', price: 6499, category_slug: 'bike-accessories' },
  { name: 'Hex-Grip Tank Pads', slug: 'hex-grip-tank-pads', price: 599, category_slug: 'bike-accessories' },
  { name: 'WearUp Tech Hoodie', slug: 'tech-hoodie', price: 4499, category_slug: 'hoodies' },
  { name: 'Kinetic Logo Tee', slug: 'kinetic-tee', price: 1299, category_slug: 'tshirts' },
];

async function seed() {
  console.log('🚀 Starting Seeding...');

  // 1. Seed Categories
  console.log('--- Seeding Categories ---');
  for (const cat of CATEGORIES) {
    const { data: existing } = await supabase.from('categories').select('id').eq('slug', cat.slug).single();
    if (!existing) {
      await supabase.from('categories').insert([cat]);
      console.log(`✅ Created Category: ${cat.name}`);
    }
  }

  // 2. Fetch Category ID Map
  const { data: catData } = await supabase.from('categories').select('id, slug');
  const catMap = Object.fromEntries(catData.map(c => [c.slug, c.id]));

  // 3. Seed Products
  console.log('--- Seeding Products ---');
  for (const p of PRODUCTS) {
    const { data: existing } = await supabase.from('products').select('id').eq('slug', p.slug).single();
    if (!existing) {
      await supabase.from('products').insert([{
        ...p,
        category_id: catMap[p.category_slug],
        category_slug: undefined, // cleanup
        stock: 50,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']
      }]);
      console.log(`✅ Created Product: ${p.name}`);
    }
  }

  // 4. Fetch Product List
  const { data: productList } = await supabase.from('products').select('id, price, category_id');
  const { data: users } = await supabase.from('profiles').select('id').limit(1);
  const userId = users[0]?.id;

  if (!userId) {
    console.warn('⚠️ No user profiles found. Please register a user first to seed orders.');
    return;
  }

  // 5. Seed Orders (Last 90 Days)
  console.log('--- Seeding 50 Orders ---');
  const now = new Date();
  for (let i = 0; i < 50; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 90);
    const orderDate = new Date();
    orderDate.setDate(now.getDate() - randomDaysAgo);

    // Pick 1-3 random products
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const prod = productList[Math.floor(Math.random() * productList.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      items.push({
        product_id: prod.id,
        quantity: qty,
        price_at_purchase: prod.price
      });
      total += prod.price * qty;
    }

    const { data: order, error: orderError } = await supabase.from('orders').insert([{
      user_id: userId,
      total_amount: total,
      status: 'delivered',
      payment_status: 'paid',
      created_at: orderDate.toISOString()
    }]).select().single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      continue;
    }

    await supabase.from('order_items').insert(
      items.map(item => ({ ...item, order_id: order.id }))
    );

    if (i % 10 === 0) console.log(`📦 Seeded ${i} orders...`);
  }

  console.log('✨ Seeding Completed Successfully!');
}

seed().catch(console.error);
