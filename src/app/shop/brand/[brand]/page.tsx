'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bike } from 'lucide-react';
import { brands, formatPrice, Product } from '@/data';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function BrandPage() {
  const params = useParams();
  const brandSlug = params.brand as string;
  const brand = brands.find(b => b.slug === brandSlug);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const { getAllProductsAction } = await import('@/app/admin/products/actions');
      const res = await getAllProductsAction();
      if (res.success && res.data) {
        const all = res.data as unknown as Product[];
        setFilteredProducts(all.filter(p => {
          if (!p.compatibleBrands) return false;
          return p.compatibleBrands.some(cb => cb.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === brandSlug);
        }));
      }
      setIsLoading(false);
    }
    load();
  }, [brandSlug]);

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl text-white mb-4">Brand Not Found</h1>
        <Link href="/" className="text-[#E8161B] underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#666] hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-[10px] tracking-widest uppercase">Back to Home</span>
        </Link>

        {/* Brand Header */}
        <ScrollReveal direction="down" className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#E8161B]/30 shadow-[0_0_30px_rgba(232,22,27,0.2)]">
              <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-2">// Compatible Store</p>
              <h1 className="font-display font-black text-5xl sm:text-7xl text-white tracking-tight uppercase leading-none">
                {brand.name} <span className="text-[#E8161B] italic">Edition</span>
              </h1>
              <p className="font-body text-[#666] mt-4 max-w-xl">
                Curated selection of wraps, parts, and gear tested and verified for your {brand.name} machine.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ScrollReveal key={product.id} direction="up" delay={i * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl">
            <Bike className="mx-auto text-[#222] mb-4" size={48} />
            <p className="text-[#444] font-display font-bold text-xl uppercase tracking-widest">No specific products found for this machine yet.</p>
            <Link href="/shop" className="inline-block mt-4 text-[#E8161B] font-mono text-xs tracking-widest uppercase hover:underline">Browse Full Catalog</Link>
          </div>
        )}
      </div>
    </div>
  );
}
