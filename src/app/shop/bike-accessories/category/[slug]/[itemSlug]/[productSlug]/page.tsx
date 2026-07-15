import { notFound } from 'next/navigation';
import { getProductsAction } from '@/app/admin/products/actions';
import { accessoryCategories, Product } from '@/data';
import AccessoryItemClient from './AccessoryItemClient';

type Props = { params: { slug: string; itemSlug: string; productSlug: string } };

function toName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default async function AccessoryItemPage({ params }: Props) {
  const subCat = accessoryCategories.find(c => c.slug === params.slug);
  const itemName = toName(params.itemSlug);

  // Fetch all bike-accessories products on the SERVER — instant, no spinner
  const res = await getProductsAction('bike-accessories');
  const allProducts: Product[] = (res.success && res.data) ? res.data as unknown as Product[] : [];

  // Find matching product by slug
  const product = allProducts.find(p => p.slug === params.productSlug) || null;

  // Pass everything pre-fetched to the client component
  return (
    <AccessoryItemClient
      product={product}
      subCat={subCat || null}
      itemName={itemName}
      categorySlug={params.slug}
    />
  );
}
