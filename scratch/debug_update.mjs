
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fix() {
  const { data, error, status, statusText } = await supabase
    .from('products')
    .update({ category_id: 'cf30d5e5-2eb0-44f1-a7ad-cb5b99cff1e0' })
    .eq('id', 'd5c1a606-49a1-4ab5-8e43-2a3a1608d714')
    .select();

  console.log('Status:', status, statusText);
  if (error) console.error('Error:', error);
  console.log('Data:', data);
}

fix();
