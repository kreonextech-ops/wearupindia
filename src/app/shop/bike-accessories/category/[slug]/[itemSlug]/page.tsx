import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { accessoryCategories, Product } from '@/data';
import { getProductsAction } from '@/app/admin/products/actions';
import ProductCard from '@/components/shop/ProductCard';

type Props = { params: { slug: string; itemSlug: string } };

function toName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default async function SubCategoryGridPage({ params }: Props) {
  const subCat = accessoryCategories.find(c => c.slug === params.slug);
  const itemName = toName(params.itemSlug);

  // Fetch all bike-accessories products
  const res = await getProductsAction('bike-accessories');
  const allProducts: Product[] = (res.success && res.data) ? res.data as unknown as Product[] : [];

  // Filter products by sub_item
  const categoryProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(itemName.toLowerCase()) ||
    itemName.toLowerCase().includes(p.name.toLowerCase()) ||
    (p as any).meta_data?.sub_item?.toLowerCase() === itemName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-12 font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground flex-wrap">
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight size={10} className="opacity-50" />
          <Link href="/shop/bike-accessories" className="hover:text-foreground transition-colors">Bike Accessories</Link>
          <ChevronRight size={10} className="opacity-50" />
          <Link href={`/shop/bike-accessories/category/${params.slug}`} className="hover:text-foreground transition-colors">
            {subCat?.name || params.slug}
          </Link>
          <ChevronRight size={10} className="opacity-50" />
          <span className="text-foreground font-bold">{itemName}</span>
        </div>

        <div className="mb-16">
          <h1 className="font-display font-black text-5xl sm:text-7xl text-foreground tracking-tighter leading-none uppercase mb-6">
            {itemName}
          </h1>
          <p className="font-body text-muted-foreground text-sm max-w-2xl leading-relaxed">
            {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} available in {itemName}
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="font-display font-bold text-2xl text-foreground tracking-tight uppercase mb-4">No Products Found</h3>
            <p className="text-muted-foreground mb-8">We're currently restocking this category. Check back soon!</p>
            <Link 
              href={`/shop/bike-accessories/category/${params.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-wu-red text-white font-display font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-wu-red/90 transition-all"
            >
              <ArrowLeft size={16} /> Back to {subCat?.name || 'Accessories'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
