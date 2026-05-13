
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const { data, error } = await supabase.from('carts').select('*').limit(1);
  if (error) {
    console.error('Carts table error:', error.message);
  } else {
    console.log('Carts table exists');
  }

  const { data: w, error: we } = await supabase.from('wishlists').select('*').limit(1);
  if (we) {
    console.error('Wishlists table error:', we.message);
  } else {
    console.log('Wishlists table exists');
  }
}

checkTables();
