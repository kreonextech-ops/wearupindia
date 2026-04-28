'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { uploadToR2 } from '@/lib/r2';

/**
 * REDEFINED: Create T-Shirt with proper Variant management
 */
export async function createTShirtAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;
    const fit = formData.get('fit') as string;
    const material = formData.get('material') as string;
    const sku = formData.get('sku') as string;
    const sizesRaw = formData.get('sizes') as string; // JSON string from form

    let sizes: Record<string, number> = {};
    try { sizes = JSON.parse(sizesRaw); } catch { sizes = {}; }

    // 1. Resolve Category ID
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'tshirts').single();
    if (!cat) throw new Error('T-Shirts category not found. Run the seed script.');

    // 2. Upload Image to R2
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + uuidv4().slice(0, 4);
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `products/tshirts/${slug}.${fileExt}`;
    const publicUrl = await uploadToR2(imageFile, filePath);

    // 3. Insert Base Product
    const totalStock = Object.values(sizes).reduce((a, b) => a + b, 0);
    const { data: product, error: pError } = await supabase
      .from('products')
      .insert([{
        name,
        slug,
        category_id: cat.id,
        price,
        description,
        stock: totalStock,
        images: [publicUrl],
        meta_data: { fit, material, sku, type: 'tshirt' }
      }])
      .select()
      .single();

    if (pError) throw pError;

    // 4. Insert Variants (Sizes)
    const variantRows = Object.entries(sizes)
      .filter(([_, qty]) => qty >= 0)
      .map(([size, qty]) => ({
        product_id: product.id,
        name: 'Size',
        value: size,
        stock: qty
      }));

    if (variantRows.length > 0) {
      const { error: vError } = await supabase.from('variants').insert(variantRows);
      if (vError) throw vError;
    }

    revalidatePath('/admin/t-shirts');
    revalidatePath('/shop/tshirts');
    return { success: true, data: product };
  } catch (error: any) {
    console.error('createTShirtAction Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * REDEFINED: Update T-Shirt and its Variants
 */
export async function updateTShirtAction(productId: string, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;
    const sizesRaw = formData.get('sizes') as string;

    let sizes: Record<string, number> = {};
    try { sizes = JSON.parse(sizesRaw); } catch { sizes = {}; }

    // 1. Get existing product
    const { data: existing } = await supabase.from('products').select('*').eq('id', productId).single();
    if (!existing) throw new Error('Product not found');

    let imageUrls = existing.images;
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `products/tshirts/${existing.slug}-${uuidv4().slice(0,4)}.${fileExt}`;
      const publicUrl = await uploadToR2(imageFile, filePath);
      imageUrls = [publicUrl];
    }

    // 2. Update Base Product
    const totalStock = Object.values(sizes).reduce((a, b) => a + b, 0);
    const { error: pError } = await supabase
      .from('products')
      .update({
        name,
        price,
        description,
        stock: totalStock,
        images: imageUrls,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (pError) throw pError;

    // 3. Update Variants (Delete and Re-insert for simplicity/consistency)
    await supabase.from('variants').delete().eq('product_id', productId);
    const variantRows = Object.entries(sizes).map(([size, qty]) => ({
      product_id: productId,
      name: 'Size',
      value: size,
      stock: qty
    }));
    await supabase.from('variants').insert(variantRows);

    revalidatePath('/admin/t-shirts');
    revalidatePath('/shop/tshirts');
    return { success: true };
  } catch (error: any) {
    console.error('updateTShirtAction Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * REDEFINED: Delete Product
 */
export async function deleteProductAction(productId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Variants will be deleted automatically via CASCADE if schema is correct
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;

    revalidatePath('/admin/t-shirts');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * REDEFINED: Fetch Products with Variants
 */
export async function getProductsWithVariantsAction(categorySlug: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(slug),
        variants(*)
      `)
      .eq('categories.slug', categorySlug)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { 
      success: true, 
      data: data.map((p: any) => ({
        ...p,
        category: p.categories.slug,
        inStock: p.stock > 0,
        // Map variants array back to a sizes object for the UI
        sizes: p.variants.reduce((acc: any, v: any) => {
          acc[v.value] = v.stock;
          return acc;
        }, {})
      }))
    };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * REDEFINED: Create Graphic Kit with Matrix Variants
 */
export async function createGraphicKitAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const name = formData.get('name') as string;
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;
    const compatibleModelsRaw = formData.get('compatibleModels') as string;
    const pricingMatrixRaw = formData.get('pricingMatrix') as string;

    const compatibleModels = JSON.parse(compatibleModelsRaw);
    const pricingMatrix = JSON.parse(pricingMatrixRaw);

    // 1. Resolve Category
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'graphic-kits').single();
    if (!cat) throw new Error('Graphic Kits category not found.');

    // 2. Upload Image to R2
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + uuidv4().slice(0, 4);
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `products/graphic-kits/${slug}.${fileExt}`;
    const publicUrl = await uploadToR2(imageFile, filePath);

    // 3. Insert Base Product
    // Use the lowest price from the matrix as the "Starting At" price
    const allPrices = Object.values(pricingMatrix).flatMap((m: any) => [
      parseFloat(m.Standard.Matte), parseFloat(m.Standard.Glossy),
      parseFloat(m.Premium.Matte), parseFloat(m.Premium.Glossy)
    ]);
    const basePrice = Math.min(...allPrices);

    const { data: product, error: pError } = await supabase
      .from('products')
      .insert([{
        name,
        slug,
        category_id: cat.id,
        price: basePrice,
        description,
        stock: 999, // Graphic kits are usually made-to-order
        images: [publicUrl],
        meta_data: { 
          brand, 
          model, 
          compatible_models: compatibleModels,
          type: 'graphic-kit'
        }
      }])
      .select()
      .single();

    if (pError) throw pError;

    // 4. Insert Variants (Model + Quality + Finish)
    // Create variants for EVERY compatible model and EVERY quality/finish combination
    const variantRows: any[] = [];
    
    compatibleModels.forEach((mName: string) => {
      const modelPricing = pricingMatrix[mName];
      if (!modelPricing) return;

      variantRows.push(
        { product_id: product.id, name: 'Option', value: `${mName} - Standard Matte`, price_adjustment: parseFloat(modelPricing.Standard.Matte) - basePrice, stock: 999 },
        { product_id: product.id, name: 'Option', value: `${mName} - Standard Glossy`, price_adjustment: parseFloat(modelPricing.Standard.Glossy) - basePrice, stock: 999 },
        { product_id: product.id, name: 'Option', value: `${mName} - Premium Matte`, price_adjustment: parseFloat(modelPricing.Premium.Matte) - basePrice, stock: 999 },
        { product_id: product.id, name: 'Option', value: `${mName} - Premium Glossy`, price_adjustment: parseFloat(modelPricing.Premium.Glossy) - basePrice, stock: 999 }
      );
    });

    if (variantRows.length > 0) {
      const { error: vError } = await supabase.from('variants').insert(variantRows);
      if (vError) throw vError;
    }

    revalidatePath('/admin/graphic-kits');
    return { success: true, data: product };
  } catch (error: any) {
    console.error('createGraphicKitAction Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * REDEFINED: Update Graphic Kit
 */
export async function updateGraphicKitAction(productId: string, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;
    const basePrice = parseFloat(formData.get('price') as string);

    // 1. Get existing
    const { data: existing } = await supabase.from('products').select('*').eq('id', productId).single();
    if (!existing) throw new Error('Product not found');

    let imageUrls = existing.images;
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `products/graphic-kits/${existing.slug}-${uuidv4().slice(0,4)}.${fileExt}`;
      const publicUrl = await uploadToR2(imageFile, filePath);
      imageUrls = [publicUrl];
    }

    // 2. Update Base
    const { error: pError } = await supabase
      .from('products')
      .update({
        name,
        price: basePrice,
        description,
        images: imageUrls,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (pError) throw pError;

    revalidatePath('/admin/graphic-kits');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
