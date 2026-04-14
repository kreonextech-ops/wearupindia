'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, SlidersHorizontal, LayoutGrid, List, ChevronDown, Filter, X, Search, PackageX, ArrowRight } from 'lucide-react';
import { categories, products, Product, Category } from '@/data';
import ProductCard from '@/components/shop/ProductCard';
import ShopFilters, { FilterState } from '@/components/shop/ShopFilters';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { params: { category: string } };

export default function CategoryPage({ params }: Props) {
  const category = categories.find(c => c.slug === params.category);
  if (!category) notFound();

  // Desktop sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Mobile drawer toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [0, 50000],
    brands: [],
    bikeBrand: 'all',
  });

  const categoryProducts = useMemo(() => {
    return products.filter(p => p.category === params.category);
  }, [params.category]);

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(product => {
      // Search
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      
      // Price
      if (product.price > filters.priceRange[1]) return false;

      // Manufacturer (Brand)
      if (filters.brands.length > 0) {
        const brandMatch = filters.brands.some(b => product.name.toLowerCase().includes(b.toLowerCase()));
        if (!brandMatch) return false;
      }

      // Bike Compatibility
      if (filters.bikeBrand !== 'all') {
        const bikeMatch = product.compatibleBrands.includes(filters.bikeBrand);
        if (!bikeMatch) return false;
      }

      return true;
    });
  }, [categoryProducts, filters]);

  const brandOptions = useMemo(() => {
    const names = ['KTM', 'YAMAHA', 'ROYAL ENFIELD', '3M', 'AVERY', 'PHANTOM', 'MACH-1'];
    return names;
  }, []);

  // Prevent scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileFilterOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      
      {/* ─── CATEGORY HERO ─── */}
      <div className="relative min-h-[450px] sm:h-[45vh] lg:h-[50vh] overflow-hidden border-b border-border">
        <Image 
          src={category.image} 
          alt={category.name} 
          fill 
          className="object-cover opacity-30 scale-105 pointer-events-none transition-opacity duration-700" 
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-12 sm:pb-20">
          <ScrollReveal direction="down">
            <Link 
              href="/shop" 
              className="group inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red text-[11px] font-mono tracking-[0.4em] uppercase mb-8 sm:mb-12 transition-all p-1"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
            </Link>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="font-mono text-[10px] sm:text-[12px] text-wu-red tracking-[0.5em] uppercase mb-4 flex items-center gap-4">
              <span className="w-8 sm:w-12 h-px bg-wu-red" /> {category.tagline}
            </p>
            <h1 className="font-display font-black text-4xl sm:text-7xl lg:text-9xl text-foreground tracking-tighter leading-[0.85] mb-6 uppercase">
              {category.name}
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-lg max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* ─── SHOP INTERFACE ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* SIDEBAR FILTERS (DESKTOP ONLY) */}
          <aside className={`hidden lg:block lg:w-80 flex-shrink-0 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute pointer-events-none'}`}>
            <div className="sticky top-32 bg-muted/30 border border-border p-10 rounded-[2.5rem] shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-10 pb-5 border-b border-border">
                <h3 className="font-display font-black text-xs tracking-[0.3em] text-foreground uppercase italic">Filters</h3>
                <div className="w-8 h-8 rounded-full bg-wu-red/10 flex items-center justify-center">
                  <Filter size={14} className="text-wu-red" />
                </div>
              </div>
              <ShopFilters 
                onFilterChange={setFilters} 
                brandOptions={brandOptions} 
                maxPrice={categoryProducts.length > 0 ? Math.max(...categoryProducts.map(p => p.price), 50000) : 50000}
              />
            </div>
          </aside>

          {/* MAIN GRID */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-10 pb-8 border-b border-border">
              <div className="flex items-center gap-6 sm:gap-10">
                {/* Desktop Toggle */}
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hidden lg:flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all p-1"
                >
                  <SlidersHorizontal size={18} className={isSidebarOpen ? 'text-wu-red' : ''} />
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase">{isSidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
                </button>
                
                {/* Mobile Trigger */}
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-3 bg-muted/50 border border-border px-6 py-3 rounded-full text-foreground hover:border-wu-red/50 transition-all"
                >
                  <Filter size={14} className="text-wu-red" />
                  <span className="font-display font-bold text-[10px] tracking-widest uppercase">Refine Search</span>
                </button>

                <div className="h-4 w-px bg-border" />
                <p className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.2em] uppercase">
                  {filteredProducts.length} Results
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
                  <button className="p-2 bg-background text-foreground rounded-md shadow-sm border border-border"><LayoutGrid size={16} /></button>
                  <button className="p-2 text-muted-foreground/40 hover:text-foreground"><List size={16} /></button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={`grid grid-cols-2 gap-6 sm:gap-8 ${isSidebarOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
                {filteredProducts.map((product, i) => (
                  <ScrollReveal key={product.id} direction="up" delay={i * 0.05}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 border border-dashed border-border rounded-[3rem] bg-muted/10 mx-4">
                <div className="w-20 h-20 bg-wu-red/10 rounded-full flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 bg-wu-red/20 blur-xl rounded-full" />
                  <PackageX className="text-wu-red relative z-10" size={36} />
                </div>
                <h3 className="font-display font-black text-3xl text-foreground mb-3 uppercase italic tracking-tighter">No Products Found</h3>
                <p className="font-body text-muted-foreground text-sm text-center max-w-xs px-6 leading-relaxed">
                  We couldn&apos;t find any items matching your current filters. Try resetting or adjusting your selection.
                </p>
                <button 
                  onClick={() => setFilters({ search: '', priceRange: [0, 50000], brands: [], bikeBrand: 'all' })}
                  className="mt-10 group flex items-center gap-3 font-display font-bold text-[11px] text-wu-red tracking-[0.3em] uppercase hover:gap-5 transition-all outline-none"
                >
                  Reset All Filters <ArrowRight size={14} />
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* ─── MOBILE FILTER DRAWER ─── */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[110] w-[85%] max-w-[400px] bg-background border-l border-border p-8 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-12 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <Filter size={18} className="text-wu-red" />
                  <h3 className="font-display font-black text-xl text-foreground tracking-tighter italic uppercase">Filters</h3>
                </div>
                <button onClick={() => setIsMobileFilterOpen(false)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="pb-10">
                <ShopFilters 
                  onFilterChange={(f) => setFilters(f)} 
                  brandOptions={brandOptions} 
                  maxPrice={categoryProducts.length > 0 ? Math.max(...categoryProducts.map(p => p.price), 50000) : 50000}
                />
              </div>

              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-wu-red text-white font-display font-bold py-5 tracking-widest uppercase rounded-2xl shadow-[0_10px_30px_rgba(232,22,27,0.3)] transition-transform active:scale-95"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
