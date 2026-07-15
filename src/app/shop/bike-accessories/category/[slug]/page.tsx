'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, PackageX, Filter, LayoutGrid, X, ChevronRight } from 'lucide-react';
import { accessoryCategories, Product } from '@/data';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { params: { slug: string } };

export default function AccessorySubCategoryPage({ params }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Find the sub-category info from static data
  const subCat = accessoryCategories.find(c => c.slug === params.slug);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const { getProductsAction } = await import('@/app/admin/products/actions');
        // Fetch all bike-accessories products, then filter client-side by sub_category
        const res = await getProductsAction('bike-accessories');
        if (res.success && res.data) {
          const all = res.data as unknown as Product[];
          // Filter by sub_category stored in meta_data
          const filtered = all.filter((p: any) => {
            const subCatSlug =
              p.meta_data?.sub_category ||
              p.meta_data?.subcategory ||
              p.meta_data?.category;
            return subCatSlug === params.slug;
          });
          setProducts(filtered);
        }
      } catch (err) {
        console.error('Failed to load accessories:', err);
      }
      setIsLoading(false);
    }
    load();
  }, [params.slug]);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* ─── HERO ─── */}
      <div className="relative bg-[#070707] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 font-mono text-[9px] tracking-[0.3em] uppercase text-white/30">
            <Link href="/shop" className="hover:text-wu-red transition-colors">Shop</Link>
            <ChevronRight size={10} className="opacity-50" />
            <Link href="/shop/bike-accessories" className="hover:text-wu-red transition-colors">Bike Accessories</Link>
            <ChevronRight size={10} className="opacity-50" />
            <span className="text-white/60">{subCat?.name || params.slug}</span>
          </div>

          <Link
            href="/shop/bike-accessories"
            className="inline-flex items-center gap-2 text-white/30 hover:text-wu-red transition-colors mb-6 font-mono text-[9px] uppercase tracking-[0.5em]"
          >
            <ArrowLeft size={14} className="opacity-50" /> Back to Accessories
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-2">
                // Bike Accessories
              </p>
              <h1 className="font-display font-black text-5xl sm:text-7xl text-white tracking-tighter leading-none uppercase italic">
                {subCat?.name || params.slug}
              </h1>
            </div>
            {!isLoading && (
              <p className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase shrink-0">
                {products.length} Products
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search bar */}
        <div className="mb-10">
          <div className="relative max-w-sm">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 font-mono text-[11px] tracking-widest text-white placeholder-white/20 focus:outline-none focus:border-wu-red/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-4 border-white/10 border-t-wu-red rounded-full animate-spin mb-8" />
            <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase">Loading...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <ScrollReveal key={product.id} direction="up" delay={i * 0.05}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[3rem]">
            <div className="w-20 h-20 bg-wu-red/5 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-wu-red/10 blur-2xl rounded-full animate-pulse" />
              <PackageX className="text-white/20 relative z-10" size={36} />
            </div>
            <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-3">// Dropping Soon</p>
            <h3 className="font-display font-black text-3xl text-white mb-3 uppercase italic tracking-tighter">
              Products Coming Soon
            </h3>
            <p className="font-body text-white/30 text-sm text-center max-w-xs px-6 leading-relaxed">
              We&apos;re working hard to bring the best {subCat?.name} products to you. Check back soon!
            </p>
            <Link
              href="/shop/bike-accessories"
              className="mt-8 font-mono text-[10px] text-wu-red hover:text-white tracking-[0.3em] uppercase transition-colors"
            >
              ← Browse All Accessories
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[3rem]">
            <PackageX className="text-white/20 mb-6" size={36} />
            <h3 className="font-display font-black text-2xl text-white mb-2 uppercase italic tracking-tighter">No Results Found</h3>
            <button
              onClick={() => setSearch('')}
              className="mt-4 font-mono text-[10px] text-wu-red hover:text-white tracking-[0.3em] uppercase transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
