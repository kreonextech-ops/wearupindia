
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixCategories() {
  const { data: categories } = await supabase.from('categories').select('*');
  console.log('Available categories in DB:', categories.map(c => ({ slug: c.slug, id: c.id })));

  const target = categories.find(c => c.slug === 'tshirts');
  const merchandise = categories.find(c => c.slug === 'merchandise');
  const tshirts_hyphen = categories.find(c => c.slug === 't-shirts');

  if (!target) {
    console.error('Target category "tshirts" not found.');
    return;
  }

  const idsToMigrate = [];
  if (merchandise) idsToMigrate.push(merchandise.id);
  if (tshirts_hyphen) idsToMigrate.push(tshirts_hyphen.id);

  console.log('Migrating products from IDs:', idsToMigrate, 'to target ID:', target.id);

  const { data: productsToFix } = await supabase.from('products').select('id, name, category_id').in('category_id', idsToMigrate);
  console.log('Products found to migrate:', productsToFix);

  if (productsToFix && productsToFix.length > 0) {
    const { data: updated, error } = await supabase
      .from('products')
      .update({ category_id: target.id })
      .in('id', productsToFix.map(p => p.id))
      .select();

    if (error) console.error('Error during update:', error);
    else console.log('Successfully updated:', updated.length, 'products.');
  } else {
    console.log('No products found needing migration.');
  }
}

fixCategories();
