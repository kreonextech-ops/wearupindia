import { redirect } from 'next/navigation';
import { accessoryCategories } from '@/data';
import ClientPage from './ClientPage';

export default function BikeAccessoryFallbackPage({ params }: { params: { category: string } }) {
  const isCategory = accessoryCategories.some(c => c.slug === params.category);
  
  if (isCategory) {
    redirect(`/shop/bike-accessories/category/${params.category}`);
  }
  
  return <ClientPage params={params} />;
}
