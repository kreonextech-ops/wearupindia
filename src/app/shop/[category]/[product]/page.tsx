import { notFound } from 'next/navigation';
import { getProductBySlugAction, getProductsAction } from '@/app/admin/products/actions';
import ProductPageClient from './ProductPageClient';
import { Product } from '@/data';

type Props = { params: { category: string; product: string } };

export default async function ProductPage({ params }: Props) {
  let product: Product | null = null;
  let related: Product[] = [];
  let categorySlug = params.category;

  const res = await getProductBySlugAction(categorySlug, params.product);
  
  if (res.success && res.data) {
    product = res.data as unknown as Product;
    const relatedRes = await getProductsAction(categorySlug);
    if (relatedRes.success && relatedRes.data) {
      related = (relatedRes.data as unknown as Product[])
        .filter((p: any) => p.id !== (res.data as any).id)
        .slice(0, 4);
    }
  } else {
    // Try alternative slug if first attempt failed (handles tshirts <-> t-shirts mismatch)
    let altSlug: string | null = null;
    if (categorySlug === 't-shirts') altSlug = 'tshirts';
    else if (categorySlug === 'tshirts') altSlug = 't-shirts';

    if (altSlug) {
      const altRes = await getProductBySlugAction(altSlug, params.product);
      if (altRes.success && altRes.data) {
        product = altRes.data as unknown as Product;
        categorySlug = altSlug;
        const relatedRes = await getProductsAction(altSlug);
        if (relatedRes.success && relatedRes.data) {
          related = (relatedRes.data as unknown as Product[])
            .filter((p: any) => p.id !== (altRes.data as any).id)
            .slice(0, 4);
        }
      }
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <ProductPageClient 
      product={product} 
      related={related} 
      categorySlug={categorySlug} 
    />
  );
}
