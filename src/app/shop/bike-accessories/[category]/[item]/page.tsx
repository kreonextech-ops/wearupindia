'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, PackageX } from 'lucide-react';
import { accessoryCategories, formatPrice, Product } from '@/data';
import SafeImage from '@/components/ui/SafeImage';
import ProductCard from '@/components/shop/ProductCard';

type Props = { params: { category: string; item: string } };

export default function AccessoryItemPage({ params }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const category = accessoryCategories.find(c => c.slug === params.category);
  const itemName = category?.items.find(i => i.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.item);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const { getProductsAction } = await import('@/app/admin/products/actions');
      const res = await getProductsAction('bike-accessories');
      if (res.success && res.data) {
        // Filter by sub_category and sub_item in meta_data
        const filtered = (res.data as any[]).filter(p => 
          p.meta_data?.sub_category === params.category && 
          p.meta_data?.sub_item === params.item
        );
        setProducts(filtered as unknown as Product[]);
      }
      setIsLoading(false);
    }
    load();
  }, [params.category, params.item]);

  if (!category) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* ─── HERO SECTION ─── */}
      <div className="relative min-h-[50vh] sm:min-h-[60vh] flex flex-col bg-[#070707] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1600&q=80"
            alt={itemName || params.item}
            fill
            className="object-cover opacity-20 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/80 via-transparent to-[#070707]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-20">
          <Link 
            href={`/shop/bike-accessories/${params.category}`} 
            className="inline-flex items-center gap-2 text-white/30 hover:text-wu-red transition-colors mb-6 font-mono text-[10px] uppercase tracking-[0.4em]"
          >
            <ArrowLeft size={14} /> Back to {category.name}
          </Link>
          <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-3">// {category.name}</p>
          <h1 className="font-display font-black text-6xl sm:text-8xl text-white uppercase tracking-tighter italic mb-4 text-center">
            {itemName || params.item.replace(/-/g, ' ')}
          </h1>
          <p className="font-body text-white/40 text-sm sm:text-base max-w-2xl text-center leading-relaxed uppercase tracking-widest">
            High-performance parts and premium protection for your motorcycle.
          </p>
        </div>

        {/* ─── WHITE CATEGORY STRIP (Anchored to Hero) ─── */}
        <div className="relative z-20 bg-white py-3 overflow-x-auto no-scrollbar shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-12 min-w-max">
              {accessoryCategories.map((cat) => (
                <Link 
                  key={cat.slug}
                  href={`/shop/bike-accessories/${cat.slug}`}
                  className={`flex flex-col items-center text-center group ${params.category === cat.slug ? 'relative' : ''}`}
                >
                  <span className={`font-display font-black text-[11px] uppercase tracking-[0.1em] transition-colors ${params.category === cat.slug ? 'text-wu-red' : 'text-black group-hover:text-wu-red'}`}>
                    {cat.name}
                  </span>
                  <span className={`font-mono text-[8px] uppercase tracking-[0.1em] mt-0.5 ${params.category === cat.slug ? 'text-wu-red/60' : 'text-black/30'}`}>
                    {cat.items.length} Items
                  </span>
                  {params.category === cat.slug && (
                    <div className="absolute -bottom-3 left-0 w-full h-1 bg-wu-red" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ─── BREADCRUMBS ─── */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-12">
          <Link href="/" className="hover:text-foreground transition-colors text-black/60">Home</Link>
          <ChevronRight size={12} className="text-border" />
          <Link href="/shop" className="hover:text-foreground transition-colors text-black/60">Shop</Link>
          <ChevronRight size={12} className="text-border" />
          <Link href="/shop/bike-accessories" className="hover:text-foreground transition-colors text-black/60">Bike Accessories</Link>
          <ChevronRight size={12} className="text-border" />
          <Link href={`/shop/bike-accessories/${params.category}`} className="hover:text-foreground transition-colors text-black/60">{category.name}</Link>
          <ChevronRight size={12} className="text-border" />
          <span className="text-black font-bold">{itemName || params.item.replace(/-/g, ' ')}</span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-4 border-muted border-t-wu-red rounded-full animate-spin mb-6" />
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Loading Products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 border border-dashed border-border rounded-[3rem] bg-muted/5">
            <PackageX className="text-wu-red mb-6" size={48} />
            <h3 className="font-display font-black text-3xl text-foreground uppercase italic tracking-tighter mb-2">Currently Unavailable</h3>
            <p className="font-body text-muted-foreground text-sm text-center max-w-xs">
              We are working on bringing these products to you. Stay tuned!
            </p>
            <Link href={`/shop/bike-accessories/${params.category}`} className="mt-8 px-8 py-3 bg-white text-black font-display font-bold text-[10px] tracking-widest uppercase hover:bg-wu-red hover:text-white transition-all">
              Browse Other {category.name}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
