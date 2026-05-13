
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('--- Orders ---');
  const { data: orders, error: oe } = await supabase.from('orders').select('id, user_id, total_amount, status');
  if (oe) console.error('Orders error:', oe.message);
  else console.log('Orders found:', orders.length, orders.slice(0, 5));

  console.log('\n--- Order Items ---');
  const { data: items, error: ie } = await supabase.from('order_items').select('id, order_id, product_id');
  if (ie) console.error('Order Items error:', ie.message);
  else console.log('Order Items found:', items.length, items.slice(0, 5));

  console.log('\n--- Profiles ---');
  const { data: profiles } = await supabase.from('profiles').select('id, email, full_name, role');
  profiles?.forEach(p => {
    console.log(`User: ${p.full_name} (${p.email}), ID: ${p.id}, Role: ${p.role}`);
  });
}

checkData();
