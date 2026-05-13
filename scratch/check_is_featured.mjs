import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumn() {
  const { data, error } = await supabase.from('products').select('is_featured').limit(1);
  if (error) {
    console.log('COLUMN_NOT_FOUND', error.message);
  } else {
    console.log('COLUMN_EXISTS');
  }
}

checkColumn();
