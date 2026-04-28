'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, PackageX, LayoutGrid, List, SlidersHorizontal, Bike } from 'lucide-react';
import { brands, Product } from '@/data';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

type Props = { params: { brand: string, model: string } };

export default function ModelProductsPage({ params }: Props) {
  const [modelProducts, setModelProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const brand = React.useMemo(() => brands.find(b => b.slug === params.brand), [params.brand]);
  
  const modelStr = React.useMemo(() => {
    if (!brand?.models) return params.model;
    const found = brand.models.find(m => 
      m.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === params.model
    );
    return found || params.model.replace(/-/g, ' ');
  }, [brand, params.model]);

  React.useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      const { getProductsAction } = await import('@/app/admin/products/actions');
      const res = await getProductsAction('graphic-kits');
      
      if (res.success && res.data) {
        const allKits = res.data as unknown as Product[];
        
        // Filter by brand and model
        const filtered = allKits.filter(p => {
          const compatibleBrands = p.meta_data?.brand?.toLowerCase() || '';
          const compatibleModels = p.meta_data?.compatible_models || [];
          
          const brandMatch = compatibleBrands === params.brand.toLowerCase();
          const modelMatch = compatibleModels.some((m: string) => 
            m.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === params.model
          );
          
          return brandMatch && modelMatch;
        });
        
        setModelProducts(filtered);
      }
      setIsLoading(false);
    }
    loadProducts();
  }, [params.brand, params.model]);

  if (!brand) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      {/* ─── HEADER ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ScrollReveal direction="down">
          <Link 
            href={`/shop/graphic-kits/${brand.slug}`} 
            className="group inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red text-[10px] font-mono tracking-[0.4em] uppercase mb-10 transition-all p-1 w-fit bg-white/5 px-4 py-2 rounded-full border border-white/5"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Models
          </Link>
        </ScrollReveal>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <ScrollReveal direction="up">
            <p className="font-mono text-[10px] text-wu-red tracking-[0.5em] uppercase mb-4 flex items-center gap-4 font-bold">
              <span className="w-8 h-px bg-wu-red" /> {brand.name} Collection
            </p>
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-foreground uppercase tracking-tighter italic leading-none">
              {modelStr} <span className="text-white/20">Kits</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.2} className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-1">Available Designs</p>
              <p className="font-display font-black text-3xl text-white italic">{modelProducts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-wu-red/10 flex items-center justify-center border border-wu-red/20 shadow-[0_0_20px_rgba(232,22,27,0.1)]">
              <Bike size={20} className="text-wu-red" />
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── BREADCRUMBS ─── */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} className="text-white/5" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={12} className="text-white/5" />
          <Link href="/shop/graphic-kits" className="hover:text-white transition-colors">Graphic Kits</Link>
          <ChevronRight size={12} className="text-white/5" />
          <Link href={`/shop/graphic-kits/${brand.slug}`} className="hover:text-white transition-colors">{brand.name}</Link>
          <ChevronRight size={12} className="text-white/5" />
          <span className="text-white font-bold">{modelStr}</span>
        </div>

        {/* ─── TOOLBAR ─── */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4 text-white/40">
            <SlidersHorizontal size={14} className="text-wu-red" />
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Refine & Sort</span>
          </div>
          <div className="flex items-center bg-white/[0.03] p-1.5 rounded-xl border border-white/5 shadow-inner">
             <button className="p-2.5 bg-white/10 text-white rounded-lg shadow-xl border border-white/10"><LayoutGrid size={16} /></button>
             <button className="p-2.5 text-white/20 hover:text-white transition-colors"><List size={16} /></button>
          </div>
        </div>

        {/* ─── PRODUCTS GRID ─── */}
        <main className="min-h-[500px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-2 border-white/5 border-t-wu-red rounded-full animate-spin mb-8" />
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.4em] animate-pulse italic">Scanning R2 Repository...</p>
            </div>
          ) : modelProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-8">
              {modelProducts.map((product, i) => (
                <ScrollReveal key={product.id} direction="up" delay={i * 0.05}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
              <div className="w-20 h-20 bg-wu-red/5 rounded-full flex items-center justify-center mb-8 relative group">
                 <div className="absolute inset-0 bg-wu-red/10 blur-2xl rounded-full group-hover:bg-wu-red/20 transition-all" />
                <PackageX className="text-white/10 relative z-10" size={32} />
              </div>
              <h3 className="font-display font-black text-3xl text-white mb-3 uppercase italic tracking-tighter">No Designs Available</h3>
              <p className="font-body text-white/30 text-sm text-center max-w-sm px-8 leading-relaxed mb-10">
                Our design team is currently sketching new concepts for the {modelStr}. Check back soon for the drops.
              </p>
              <Link href="/shop/graphic-kits" className="font-mono text-[10px] text-wu-red border-b border-wu-red/30 pb-1 hover:border-wu-red transition-all uppercase tracking-[0.3em]">
                View Other Manufacturers
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
