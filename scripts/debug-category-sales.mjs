import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

async function debug() {
  console.log('\n=== 1. All orders in DB ===');
  const { data: orders, error: ordersErr } = await supabase
    .from('orders')
    .select('id, status, payment_status, total_amount, created_at');
  if (ordersErr) console.error('orders error:', ordersErr.message);
  else console.log(JSON.stringify(orders, null, 2));

  console.log('\n=== 2. All order_items in DB ===');
  const { data: items, error: itemsErr } = await supabase
    .from('order_items')
    .select('id, order_id, product_id, quantity, price_at_purchase');
  if (itemsErr) console.error('order_items error:', itemsErr.message);
  else console.log(JSON.stringify(items, null, 2));

  console.log('\n=== 3. All products with category_id ===');
  const { data: products, error: productsErr } = await supabase
    .from('products')
    .select('id, name, slug, category_id');
  if (productsErr) console.error('products error:', productsErr.message);
  else console.log(JSON.stringify(products, null, 2));

  console.log('\n=== 4. All categories in DB ===');
  const { data: cats, error: catsErr } = await supabase
    .from('categories')
    .select('id, name, slug');
  if (catsErr) console.error('categories error:', catsErr.message);
  else console.log(JSON.stringify(cats, null, 2));

  console.log('\n=== 5. Try order_items with inner join on orders ===');
  const { data: joined, error: joinErr } = await supabase
    .from('order_items')
    .select('quantity, price_at_purchase, order_id, orders!inner(created_at, status)')
    .neq('orders.status', 'cancelled');
  if (joinErr) console.error('join error:', joinErr.message, joinErr.details, joinErr.hint);
  else console.log('Joined results:', JSON.stringify(joined, null, 2));
}

debug().catch(console.error);
