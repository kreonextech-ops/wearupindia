'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { uploadToR2 } from '@/lib/r2';

/**
 * Server Action to create a new product with image upload to Supabase Storage
 */
export async function createProductAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const name = formData.get('name') as string;
    const categorySlug = formData.get('category_slug') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const stock = parseInt(formData.get('stock') as string);
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const imageFile = formData.get('image') as File;

    if (!imageFile || imageFile.size === 0) {
      throw new Error('Please upload an image.');
    }

    // 1. Resolve Category ID from Slug
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (categoryError || !categoryData) {
      throw new Error(`Category "${categorySlug}" not found. Please ensure categories are seeded.`);
    }

    const category_id = categoryData.id;

    // 2. Generate Slug & File Name
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + uuidv4().slice(0, 4);
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${slug}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // 2. Upload to Cloudflare R2
    const publicUrl = await uploadToR2(imageFile, filePath);

    // 4. Save Product Metadata to Database
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([
        {
          name,
          slug,
          category_id,
          price,
          description,
          stock,
          images: [publicUrl], // Array of URLs
          meta_data: {
            brand,
            model,
            is_graphic_kit: categorySlug === 'graphic-kits'
          }
        },
      ])
      .select();

    if (productError) throw productError;

    revalidatePath('/admin/products');
    return { success: true, data: productData };
  } catch (error: any) {
    console.error('Action Error:', error);
    return { success: false, error: error.message };
  }
}
