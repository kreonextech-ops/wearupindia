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
    const subCategory = formData.get('sub_category') as string;
    const itemType = formData.get('item_type') as string;
    const imageFile = formData.get('image') as File;
    
    // Capture dynamic specs (any field not in core list)
    const coreKeys = ['name', 'category_slug', 'price', 'description', 'stock', 'brand', 'model', 'image', 'compatibleModels', 'pricingMatrix', 'sub_category', 'item_type'];
    const specs: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (!coreKeys.includes(key) && typeof value === 'string') {
        specs[key] = value;
      }
    });

    let compatibleModels = [];
    let pricingMatrix = null;
    try {
      if (formData.get('compatibleModels')) {
        compatibleModels = JSON.parse(formData.get('compatibleModels') as string);
      }
      if (formData.get('pricingMatrix')) {
        pricingMatrix = JSON.parse(formData.get('pricingMatrix') as string);
      }
    } catch (e) {
      console.error('Error parsing JSON from formData', e);
    }

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
            sub_category: subCategory,
            item_type: itemType,
            is_graphic_kit: categorySlug === 'graphic-kits',
            compatible_models: compatibleModels,
            pricing_matrix: pricingMatrix,
            specs: specs
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

/**
 * Server Action to fetch products, optionally filtered by category
 */
export async function getProductsAction(categorySlug?: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    let query = supabase.from('products').select(`*, categories!inner(slug)`);
    
    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;

    // Map to frontend Product type
    const mappedProducts = data.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.categories.slug,
      price: Number(p.price),
      stock: p.stock,
      inStock: p.stock > 0,
      description: p.description || '',
      images: p.images || [],
      rating: 0,
      reviews: 0,
      specs: [],
      compatibleBrands: p.meta_data?.brand ? [p.meta_data.brand] : [],
      compatibleModels: p.meta_data?.compatible_models || [],
      meta_data: p.meta_data || {},
    }));

    return { success: true, data: mappedProducts };
  } catch (error: any) {
    console.error('getProductsAction Error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Server Action to fetch a specific product by slug
 */
export async function getProductBySlugAction(categorySlug: string, productSlug: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories!inner(slug)`)
      .eq('categories.slug', categorySlug)
      .eq('slug', productSlug)
      .single();
    
    if (error) throw error;

    // Map to frontend Product type
    const mappedProduct = {
      id: data.id,
      slug: data.slug,
      name: data.name,
      category: data.categories.slug,
      price: Number(data.price),
      stock: data.stock,
      inStock: data.stock > 0,
      description: data.description || '',
      images: data.images || [],
      rating: 0,
      reviews: 0,
      specs: [],
      compatibleBrands: data.meta_data?.brand ? [data.meta_data.brand] : [],
      compatibleModels: data.meta_data?.compatible_models || [],
      meta_data: data.meta_data || {},
    };

    return { success: true, data: mappedProduct };
  } catch (error: any) {
    console.error('getProductBySlugAction Error:', error);
    return { success: false, error: error.message, data: null };
  }
}
