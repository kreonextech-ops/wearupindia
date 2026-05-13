
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error(error);
    return;
  }
  console.log('Categories in DB:');
  data.forEach(c => console.log(`- Slug: ${c.slug}, ID: ${c.id}, Name: ${c.name}`));
}

checkCategories();
