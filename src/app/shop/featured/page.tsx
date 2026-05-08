
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { Product } from '@/data';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function FeaturedCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const { getAllProductsAction } = await import('@/app/admin/products/actions');
        const res = await getAllProductsAction();
        if (res.success && res.data) {
          // Filter only featured products
          const filtered = (res.data as any[]).filter(p => p.is_featured);
          setProducts(filtered as unknown as Product[]);
        }
      } catch (error) {
        console.error('Failed to load featured collection:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-16">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red transition-colors mb-8 font-mono text-[10px] uppercase tracking-[0.4em]"
          >
            <ArrowLeft size={14} /> Back to Shop
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.4em] uppercase mb-3 flex items-center gap-2">
                <Star size={14} fill="currentColor" /> // The Elite Selection
              </p>
              <h1 className="font-display font-black text-5xl sm:text-7xl text-foreground uppercase tracking-tighter italic leading-none">
                Featured <span className="text-wu-red">Kits</span>
              </h1>
            </div>
            <p className="font-body text-muted-foreground max-w-md text-sm sm:text-base leading-relaxed">
              Hand-picked by our design team, these kits represent the pinnacle of motorcycle customization. Our most popular designs and track-proven accessories.
            </p>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-muted border-t-wu-red rounded-full animate-spin mb-4" />
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Loading elite selection...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product, i) => (
              <ScrollReveal key={product.id} direction="up" delay={i * 0.05}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-border rounded-3xl">
            <p className="font-display font-bold text-xl text-muted-foreground uppercase tracking-widest mb-4">No Featured Items Currently</p>
            <Link href="/shop" className="text-wu-red font-mono text-[10px] uppercase tracking-widest hover:underline">Explore the Full Catalog</Link>
          </div>
        )}

      </div>
    </div>
  );
}
