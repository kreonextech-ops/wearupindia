import { notFound } from 'next/navigation';
import { getProductBySlugAction, getProductsAction } from '@/app/admin/products/actions';
import GraphicKitClient from './GraphicKitClient';
import { Product } from '@/data';

type Props = { params: { slug: string } };

export default async function GraphicKitProductPage({ params }: Props) {
  const categorySlug = 'graphic-kits';
  const res = await getProductBySlugAction(categorySlug, params.slug);
  
  if (!res.success || !res.data) {
    notFound();
  }

  const product = res.data as unknown as Product;
  
  if (product.meta_data && !product.meta_data.compatible_models && product.meta_data.specs?.model) {
    product.meta_data.compatible_models = [product.meta_data.specs.model];
  }

  let related: Product[] = [];
  const relatedRes = await getProductsAction(categorySlug);
  if (relatedRes.success && relatedRes.data) {
    related = (relatedRes.data as unknown as Product[])
      .filter((p: any) => p.id !== product.id)
      .slice(0, 4);
  }

  return (
    <GraphicKitClient 
      product={product} 
      related={related} 
      categorySlug={categorySlug} 
    />
  );
}
