'use server';

import { revalidatePath, unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@/lib/config';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';

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
    const sizesRaw = formData.get('sizes') as string; 

    let sizes: Record<string, number> = {};
    try { sizes = JSON.parse(sizesRaw); } catch { sizes = {}; }

    const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'tshirts').single();
    if (!cat) throw new Error('T-Shirts category not found.');

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + uuidv4().slice(0, 4);
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `products/tshirts/${slug}.${fileExt}`;
    const publicUrl = await uploadToR2(imageFile, filePath);

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
        is_new: true,
        is_featured: false,
        meta_data: { fit, material, sku, type: 'tshirt' }
      }])
      .select()
      .single();

    if (pError) throw pError;

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
    revalidatePath('/shop');
    revalidatePath('/shop/t-shirts');
    return { success: true, data: product };
  } catch (error: any) {
    console.error('createTShirtAction Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * GENERIC: Backwards compatibility for other categories
 */
export async function createProductAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const name = formData.get('name') as string;
    const categorySlug = formData.get('category_slug') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const stock = parseInt(formData.get('stock') as string) || 0;
    const imageFile = formData.get('image') as File | null;

    const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
    if (!cat) throw new Error(`Category ${categorySlug} not found`);

    let imageUrls: string[] = [];
    if (imageFile && imageFile.size > 0) {
      const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + uuidv4().slice(0, 4);
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `products/${categorySlug}/${slug}.${fileExt}`;
      const url = await uploadToR2(imageFile, filePath);
      imageUrls = [url];
    }

    const subCategory = formData.get('sub_category') as string | null;
    const subItem = formData.get('sub_item') as string | null;

    // Extract dynamic specs
    const standardFields = ['name', 'category_slug', 'price', 'description', 'stock', 'image', 'sub_category', 'sub_item'];
    const specs: Record<string, string> = {};
    for (const [key, value] of Array.from(formData.entries())) {
      if (!standardFields.includes(key) && value && typeof value === 'string') {
        specs[key] = value;
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + uuidv4().slice(0, 4),
        category_id: cat.id,
        price,
        description,
        stock,
        images: imageUrls,
        is_new: true,
        is_featured: false,
        meta_data: { sub_category: subCategory, sub_item: subItem, specs }
      }])
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * GENERIC: Update Product
 */
export async function updateProductAction(productId: string, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const stock = parseInt(formData.get('stock') as string) || 0;
    const imageFile = formData.get('image') as File | null;

    const { data: existing } = await supabase.from('products').select('*').eq('id', productId).single();
    if (!existing) throw new Error('Product not found');

    let imageUrls = existing.images;
    if (imageFile && imageFile.size > 0) {
      const slug = existing.slug; // Keep same slug
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `products/${slug}-${uuidv4().slice(0, 4)}.${fileExt}`;
      const url = await uploadToR2(imageFile, filePath);
      imageUrls = [url];
    }

    // Extract dynamic specs
    const standardFields = ['id', 'name', 'price', 'description', 'stock', 'image', 'sub_category', 'sub_item'];
    const specs: Record<string, string> = {};
    for (const [key, value] of Array.from(formData.entries())) {
      if (!standardFields.includes(key) && value && typeof value === 'string') {
        specs[key] = value;
      }
    }
    
    const subCategory = formData.get('sub_category') as string | null;
    const subItem = formData.get('sub_item') as string | null;

    // Merge existing meta_data with updated specs
    const meta_data = existing.meta_data || {};
    meta_data.specs = specs;
    if (subCategory) meta_data.sub_category = subCategory;
    if (subItem) meta_data.sub_item = subItem;

    const { error } = await supabase
      .from('products')
      .update({
        name,
        price,
        description,
        stock,
        images: imageUrls,
        meta_data,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (error) throw error;
    
    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * REDEFINED: Update T-Shirt
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

    const { data: existing } = await supabase.from('products').select('*').eq('id', productId).single();
    if (!existing) throw new Error('Product not found');

    let imageUrls = existing.images;
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `products/tshirts/${existing.slug}-${uuidv4().slice(0, 4)}.${fileExt}`;
      const publicUrl = await uploadToR2(imageFile, filePath);
      imageUrls = [publicUrl];
    }

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
    return { success: false, error: error.message };
  }
}

/**
 * Utility to extract R2 Key from URL
 */
function getR2Key(url: string) {
  try {
    const baseUrl = process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
    if (url.startsWith(baseUrl)) {
      return url.replace(`${baseUrl}/`, '');
    }
    // Fallback for different URL structures if needed
    const parts = url.split('/');
    const productsIndex = parts.indexOf('products');
    if (productsIndex !== -1) {
      return parts.slice(productsIndex).join('/');
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * REDEFINED: Delete Product with R2 cleanup
 */
export async function deleteProductAction(productId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    // 1. Fetch product to get image URLs
    const { data: product } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .single();

    if (product?.images && Array.isArray(product.images)) {
      // 2. Delete each image from R2
      for (const url of product.images) {
        const key = getR2Key(url);
        await deleteFromR2(key);
      }
    }

    // 3. Delete from database
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;

    revalidatePath('/admin/t-shirts');
    revalidatePath('/admin/graphic-kits');
    revalidatePath('/admin/bike-accessories');
    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    revalidatePath('/shop');
    revalidatePath('/shop/graphic-kits');
    revalidatePath('/shop/bike-accessories');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * REDEFINED: Fetch All Products (Admin)
 */
export async function getAllProductsAction() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories(slug, name)`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data.map((p: any) => ({
        ...p,
        category: p.categories?.slug || 'uncategorized',
        categoryName: p.categories?.name || 'Uncategorized',
        inStock: p.stock > 0,
        is_featured: p.is_featured,
        is_new: p.is_new,
        rating: 5,
        reviews: 0
      }))
    };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function toggleFeaturedAction(productId: string, isFeatured: boolean) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_featured: isFeatured })
      .eq('id', productId);
    if (error) throw error;
    revalidatePath('/admin/inventory');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleNewAction(productId: string, isNew: boolean) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_new: isNew })
      .eq('id', productId);
    if (error) throw error;
    revalidatePath('/admin/inventory');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateStockAction(productId: string, stock: number) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase
      .from('products')
      .update({ stock })
      .eq('id', productId);
    if (error) throw error;
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/products');
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
      .select(`*, categories!inner(slug), variants(*)`)
      .eq('categories.slug', categorySlug)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data.map((p: any) => ({
        ...p,
        category: p.categories.slug,
        inStock: p.stock > 0,
        rating: 5,
        reviews: 0,
        compatibleBrands: p.meta_data?.brand ? [p.meta_data.brand] : (p.meta_data?.specs?.brand ? [p.meta_data.specs.brand] : []),
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
 * GENERIC: Fetch Products (Backwards compatibility)
 */
export async function getProductsAction(categorySlug: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories!inner(slug), variants(*)`)
      .eq('categories.slug', categorySlug)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const mappedData = data.map((p: any) => ({
      ...p,
      category: p.categories.slug,
      inStock: p.stock > 0,
      rating: 5,
      reviews: 0,
      compatibleBrands: p.meta_data?.brand ? [p.meta_data.brand] : (p.meta_data?.specs?.brand ? [p.meta_data.specs.brand] : []),
      sizes: p.variants?.reduce((acc: any, v: any) => {
        acc[v.value] = v.stock;
        return acc;
      }, {}) || {}
    }));

    return { success: true, data: mappedData };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function getProductBySlugAction(categorySlug: string, productSlug: string) {
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
      .eq('slug', productSlug)
      .single();

    if (error) throw error;

    const mappedProduct = {
      ...data,
      category: data.categories.slug,
      inStock: data.stock > 0,
      rating: 5,
      reviews: 0,
      compatibleBrands: data.meta_data?.brand ? [data.meta_data.brand] : (data.meta_data?.specs?.brand ? [data.meta_data.specs.brand] : []),
      sizes: data.variants?.reduce((acc: any, v: any) => {
        acc[v.value] = v.stock;
        return acc;
      }, {})
    };

    return { success: true, data: mappedProduct };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * REDEFINED: Create Graphic Kit
 */
export async function createGraphicKitAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const name = formData.get('name') as string;
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const description = formData.get('description') as string;
    const stock = parseInt(formData.get('stock') as string) || 0;
    const imageFile = formData.get('image') as File | null;
    const compatibleModelsRaw = formData.get('compatibleModels') as string;
    const pricingMatrixRaw = formData.get('pricingMatrix') as string;

    if (!imageFile || !imageFile.name || imageFile.size === 0) {
      throw new Error('Design image is required.');
    }

    const compatibleModels = JSON.parse(compatibleModelsRaw);
    const pricingMatrix = JSON.parse(pricingMatrixRaw);

    const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'graphic-kits').single();
    if (!cat) throw new Error('Graphic Kits category not found.');

    const safeName = name || 'Untitled Design';
    const slug = safeName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + uuidv4().slice(0, 4);
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const filePath = `products/graphic-kits/${slug}.${fileExt}`;
    const publicUrl = await uploadToR2(imageFile, filePath);

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
        stock,
        images: [publicUrl],
        is_new: true,
        is_featured: false,
        meta_data: { brand, model, compatible_models: compatibleModels, pricing_matrix: pricingMatrix, type: 'graphic-kit' }
      }])
      .select()
      .single();

    if (pError) throw pError;

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
    revalidatePath('/shop');
    revalidatePath('/shop/graphic-kits');
    return { success: true, data: product };
  } catch (error: any) {
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
    const stock = parseInt(formData.get('stock') as string) || 0;

    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const compatibleModelsRaw = formData.get('compatibleModels') as string;

    const pricingMatrixRaw = formData.get('pricingMatrix') as string;
    let pricingMatrix: any = null;
    let basePrice = parseFloat(formData.get('price') as string) || 0;
    
    if (pricingMatrixRaw) {
      pricingMatrix = JSON.parse(pricingMatrixRaw);
      const allPrices = Object.values(pricingMatrix).flatMap((m: any) => [
        parseFloat(m.Standard?.Matte || 0), parseFloat(m.Standard?.Glossy || 0),
        parseFloat(m.Premium?.Matte || 0), parseFloat(m.Premium?.Glossy || 0)
      ]).filter((p: number) => !isNaN(p) && p > 0);
      if (allPrices.length > 0) {
        basePrice = Math.min(...allPrices);
      }
    }

    const { data: existing } = await supabase.from('products').select('*').eq('id', productId).single();
    if (!existing) throw new Error('Product not found');

    let imageUrls = existing.images;
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `products/graphic-kits/${existing.slug}-${uuidv4().slice(0, 4)}.${fileExt}`;
      const publicUrl = await uploadToR2(imageFile, filePath);
      imageUrls = [publicUrl];
    }

    const meta_data = existing.meta_data || {};
    if (pricingMatrix) {
      meta_data.pricing_matrix = pricingMatrix;
    }
    if (brand) meta_data.brand = brand;
    if (model) meta_data.model = model;
    if (compatibleModelsRaw) meta_data.compatible_models = JSON.parse(compatibleModelsRaw);

    const { error: pError } = await supabase
      .from('products')
      .update({ 
        name, 
        price: basePrice, 
        description, 
        stock,
        images: imageUrls, 
        meta_data,
        updated_at: new Date().toISOString() 
      })
      .eq('id', productId);

    if (pError) throw pError;

    if (pricingMatrix && meta_data.compatible_models) {
      await supabase.from('variants').delete().eq('product_id', productId);
      const variantRows: any[] = [];
      meta_data.compatible_models.forEach((mName: string) => {
        const modelPricing = pricingMatrix[mName];
        if (!modelPricing) return;
        variantRows.push(
          { product_id: productId, name: 'Option', value: `${mName} - Standard Matte`, price_adjustment: parseFloat(modelPricing.Standard?.Matte || '0') - basePrice, stock: 999 },
          { product_id: productId, name: 'Option', value: `${mName} - Standard Glossy`, price_adjustment: parseFloat(modelPricing.Standard?.Glossy || '0') - basePrice, stock: 999 },
          { product_id: productId, name: 'Option', value: `${mName} - Premium Matte`, price_adjustment: parseFloat(modelPricing.Premium?.Matte || '0') - basePrice, stock: 999 },
          { product_id: productId, name: 'Option', value: `${mName} - Premium Glossy`, price_adjustment: parseFloat(modelPricing.Premium?.Glossy || '0') - basePrice, stock: 999 }
        );
      });
      if (variantRows.length > 0) {
        await supabase.from('variants').insert(variantRows);
      }
    }

    revalidatePath('/admin/graphic-kits');
    revalidatePath('/shop');
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * REDEFINED: Duplicate Product
 */
export async function duplicateProductAction(productId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('products')
      .select('*, variants(*)')
      .eq('id', productId)
      .single();

    if (fetchError || !existing) throw new Error('Product not found for duplication');

    const newName = `${existing.name} (Copy)`;
    const newSlug = newName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + uuidv4().slice(0, 4);

    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert([{
        name: newName,
        slug: newSlug,
        category_id: existing.category_id,
        price: existing.price,
        description: existing.description,
        stock: existing.stock,
        images: existing.images,
        is_new: existing.is_new,
        is_featured: existing.is_featured,
        meta_data: existing.meta_data,
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    if (existing.variants && existing.variants.length > 0) {
      const variantRows = existing.variants.map((v: any) => ({
        product_id: newProduct.id,
        name: v.name,
        value: v.value,
        price_adjustment: v.price_adjustment,
        stock: v.stock
      }));
      await supabase.from('variants').insert(variantRows);
    }

    revalidatePath('/admin/graphic-kits');
    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    revalidatePath('/shop');

    return { success: true, data: newProduct };
  } catch (error: any) {
    console.error('Duplicate Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * CACHED HOME PAGE QUERIES (TTFB Optimization)
 * Uses unstable_cache and a cookie-less client so it doesn't opt out of Next.js static generation/caching.
 */
export const getCachedHomeProducts = unstable_cache(
  async () => {
    const supabase = createSupabaseClient(config.supabase.url, config.supabase.anonKey);
    
    // Fetch Featured (limit 5)
    const { data: featured } = await supabase
      .from('products')
      .select(`
        *,
        categories (slug, name)
      `)
      .eq('is_featured', true)
      .limit(5);

    // Fetch New Arrivals (limit 5)
    const { data: newArrivals } = await supabase
      .from('products')
      .select(`
        *,
        categories (slug, name)
      `)
      .eq('is_new', true)
      .limit(5);

    const mapProduct = (p: any) => ({
      ...p,
      category: p.categories?.slug || 'uncategorized',
      categoryName: p.categories?.name || 'Uncategorized',
      inStock: p.stock > 0,
      is_featured: p.is_featured,
      is_new: p.is_new,
      rating: 5,
      reviews: 0
    });

    return {
      featuredKits: (featured || []).map(mapProduct),
      newArrivals: (newArrivals || []).map(mapProduct)
    };
  },
  ['home-products-cache'], // Cache key
  { revalidate: 3600 }     // Revalidate every hour
);
