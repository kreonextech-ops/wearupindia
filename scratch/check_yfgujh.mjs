import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkVariants() {
  const { data: variants, error } = await supabase
    .from('variants')
    .select('*')
    .eq('product_id', '7b669ffa-7a70-42da-a099-80ffa946601b');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Variants for yfgujh:');
  console.table(variants);
}

checkVariants();
