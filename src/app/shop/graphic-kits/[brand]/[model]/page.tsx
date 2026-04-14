'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, PackageX, Filter, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { brands, products } from '@/data';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

type Props = { params: { brand: string, model: string } };

export default function ModelProductsPage({ params }: Props) {
  const brand = useMemo(() => brands.find(b => b.slug === params.brand), [params.brand]);
  
  // Reconstruct the original model string from the slug, or find it from the brand.models array
  const modelStr = useMemo(() => {
    if (!brand?.models) return params.model;
    const found = brand.models.find(m => 
      m.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === params.model
    );
    return found || params.model.replace(/-/g, ' ');
  }, [brand, params.model]);

  if (!brand) notFound();

  // Filter products: prefer exact model match, fallback to brand-level graphic kits
  const modelProducts = useMemo(() => {
    const modelSpecific = products.filter(p =>
      p.category === 'graphic-kits' &&
      p.compatibleModels?.includes(params.model)
    );
    if (modelSpecific.length > 0) return modelSpecific;
    // Fallback: show all brand-level kits (for models without specific kits yet)
    return products.filter(p =>
      p.category === 'graphic-kits' &&
      p.compatibleBrands.includes(brand.slug) &&
      !p.compatibleModels // only show non-model-specific products in fallback
    );
  }, [brand.slug, params.model]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      {/* ─── HEADER ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link 
          href={`/shop/graphic-kits/${brand.slug}`} 
          className="group inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red text-[10px] font-mono tracking-[0.4em] uppercase mb-8 transition-all p-1 w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to {brand.name} Models
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
          <div>
            <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-wu-red" /> {brand.name} Graphic Kits
            </p>
            <h1 className="font-display font-black text-4xl sm:text-6xl text-foreground uppercase tracking-tighter italic">
              {modelStr}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {modelProducts.length} Results Found
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── BREADCRUMBS ─── */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-10 overflow-hidden">
          <Link href="/" className="hover:text-foreground transition-colors shrink-0">Home</Link>
          <ChevronRight size={12} className="text-border shrink-0" />
          <Link href="/shop" className="hover:text-foreground transition-colors shrink-0">Shop</Link>
          <ChevronRight size={12} className="text-border shrink-0" />
          <Link href="/shop/graphic-kits" className="hover:text-foreground transition-colors shrink-0">Graphic Kits</Link>
          <ChevronRight size={12} className="text-border shrink-0" />
          <Link href={`/shop/graphic-kits/${brand.slug}`} className="hover:text-foreground transition-colors shrink-0">{brand.name}</Link>
          <ChevronRight size={12} className="text-border shrink-0" />
          <span className="text-foreground font-bold truncate">{modelStr}</span>
        </div>

        {/* ─── TOOLBAR ─── */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <SlidersHorizontal size={14} className="text-wu-red" />
            <span className="font-display font-bold text-[10px] tracking-widest uppercase">Sort By</span>
          </div>
          <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
             <button className="p-2 bg-background text-foreground rounded-md shadow-sm border border-border"><LayoutGrid size={16} /></button>
             <button className="p-2 text-muted-foreground/40 hover:text-foreground"><List size={16} /></button>
          </div>
        </div>

        {/* ─── PRODUCTS GRID ─── */}
        <main className="min-h-[400px]">
          {modelProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {modelProducts.map((product, i) => (
                <ScrollReveal key={product.id} direction="up" delay={i * 0.05}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded-3xl bg-muted/5">
              <div className="w-16 h-16 bg-wu-red/10 rounded-full flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 bg-wu-red/20 blur-xl rounded-full" />
                <PackageX className="text-wu-red relative z-10" size={24} />
              </div>
              <h3 className="font-display font-black text-2xl text-foreground mb-2 uppercase italic tracking-tighter">No Kits Found</h3>
              <p className="font-body text-muted-foreground text-xs text-center max-w-xs px-6 leading-relaxed">
                We are currently developing precise graphic kits for the {modelStr}. Check back soon.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
