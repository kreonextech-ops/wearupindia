'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, SlidersHorizontal, LayoutGrid, List, ChevronDown, Filter, X } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0A0A0A]">
      
      {/* ─── CATEGORY HERO ─── */}
      <div className="relative min-h-[450px] sm:h-[45vh] lg:h-[50vh] overflow-hidden border-b border-white/5">
        <Image 
          src={category.image} 
          alt={category.name} 
          fill 
          className="object-cover opacity-25 scale-105" 
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-12 sm:pb-20">
          <ScrollReveal direction="down">
            <Link 
              href="/shop" 
              className="group inline-flex items-center gap-2 text-white/40 hover:text-[#E8161B] text-[10px] sm:text-[11px] font-mono tracking-[0.4em] uppercase mb-8 sm:mb-12 transition-all p-1"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
            </Link>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="font-mono text-[10px] sm:text-[12px] text-[#E8161B] tracking-[0.5em] uppercase mb-4 flex items-center gap-4">
              <span className="w-8 sm:w-12 h-px bg-[#E8161B]" /> {category.tagline}
            </p>
            <h1 className="font-display font-black text-4xl sm:text-7xl lg:text-9xl text-white tracking-tighter leading-[0.85] mb-6">
              {category.name.toUpperCase()}
            </h1>
            <p className="font-body text-[#888] text-sm sm:text-lg max-w-2xl leading-relaxed">
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
            <div className="sticky top-32 bg-[#111] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center justify-between mb-10 pb-5 border-b border-white/5">
                <h3 className="font-display font-black text-xs tracking-[0.3em] text-white uppercase italic">TACTICAL FILTERS</h3>
                <div className="w-8 h-8 rounded-full bg-[#E8161B]/10 flex items-center justify-center">
                  <Filter size={14} className="text-[#E8161B]" />
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
            <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/5">
              <div className="flex items-center gap-6 sm:gap-10">
                {/* Desktop Toggle */}
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hidden lg:flex items-center gap-3 text-white/50 hover:text-white transition-all p-1"
                >
                  <SlidersHorizontal size={18} className={isSidebarOpen ? 'text-[#E8161B]' : ''} />
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase">{isSidebarOpen ? 'Stow Filters' : 'Toggle Filters'}</span>
                </button>
                
                {/* Mobile Trigger */}
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-full text-white hover:border-[#E8161B]/50 transition-all"
                >
                  <Filter size={14} className="text-[#E8161B]" />
                  <span className="font-display font-bold text-[10px] tracking-widest uppercase">Filter Gear</span>
                </button>

                <div className="h-4 w-px bg-white/10" />
                <p className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">
                  {filteredProducts.length} <span className="hidden sm:inline">Tactical</span> Units
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/5 p-1 rounded-sm border border-white/5">
                  <button className="p-2 bg-white/10 text-white rounded-sm"><LayoutGrid size={16} /></button>
                  <button className="p-2 text-white/30 hover:text-white/60"><List size={16} /></button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product, i) => (
                  <ScrollReveal key={product.id} direction="up" delay={i * 0.05}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] mx-4">
                <div className="w-20 h-20 bg-[#E8161B]/10 rounded-full flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 bg-[#E8161B]/20 blur-xl rounded-full" />
                  <X className="text-[#E8161B] relative z-10" size={40} />
                </div>
                <h3 className="font-display font-black text-3xl text-white mb-3 uppercase italic tracking-tighter">Target Absent.</h3>
                <p className="font-body text-[#666] text-sm text-center max-w-sm px-6 leading-relaxed">
                  No operational gear matches your parameters. Broaden your tactical search criteria.
                </p>
                <button 
                  onClick={() => setFilters({ search: '', priceRange: [0, 50000], brands: [], bikeBrand: 'all' })}
                  className="mt-10 group flex items-center gap-3 font-display font-bold text-[11px] text-[#E8161B] tracking-[0.3em] uppercase hover:gap-5 transition-all"
                >
                  Reset Parameters <ArrowLeft className="rotate-180" size={14} />
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
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[110] w-[85%] max-w-[400px] bg-[#0A0A0A] border-l border-white/10 p-8 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Filter size={18} className="text-[#E8161B]" />
                  <h3 className="font-display font-black text-xl text-white tracking-tighter italic uppercase">FILTERS</h3>
                </div>
                <button onClick={() => setIsMobileFilterOpen(false)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white">
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
                className="w-full bg-[#E8161B] text-white font-display font-bold py-5 tracking-widest uppercase rounded-2xl shadow-[0_10px_30px_rgba(232,22,27,0.3)]"
              >
                Apply Tactical Config
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
