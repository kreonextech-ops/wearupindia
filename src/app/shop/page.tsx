'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, ArrowRight, ClipboardList, ShoppingBag, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { products, categories } from '@/data';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ShopCategorySection from '@/components/shop/ShopCategorySection';
import BulkOrderModal from '@/components/shop/BulkOrderModal';

export default function ShopPage() {
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const openBulkModal = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsBulkModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* ─── SHOP HERO ─── */}
      <section className="relative min-h-[480px] sm:min-h-[55vh] flex flex-col items-center border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1600&q=80"
            alt="WearUp Shop – Carbon Fiber"
            fill
            className="object-cover opacity-20 scale-105 pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          {/* Red glow orb backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-wu-red/5 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-40 sm:pt-48">
          <ScrollReveal direction="down">
            <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-6 flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-wu-red" /> Official Collection
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-9xl text-foreground tracking-tighter leading-[0.85] mb-8 uppercase">
              Elite <span className="text-wu-red">Gear.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4} className="max-w-2xl mx-auto mb-12">
            <p className="font-body text-muted-foreground text-base sm:text-lg leading-relaxed">
              From precision-cut graphic kits to track-tested protection. We engineer the aesthetics and performance of India&apos;s most aggressive machines.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
            {[
              { label: 'PAN-INDIA', sub: 'SHIPPING', icon: Zap },
              { label: 'CERTIFIED', sub: 'QUALITY', icon: ShieldCheck },
              { label: 'PREMIUM', sub: 'MATERIALS', icon: Sparkles },
              { label: 'EXPERT', sub: 'SUPPORT', icon: ShoppingBag },
            ].map((item, i) => (
              <ScrollReveal key={item.label} direction="up" delay={0.6 + i * 0.1}>
                <div className="flex flex-col items-center gap-2 p-5 border border-border bg-muted/30 backdrop-blur-sm group hover:border-wu-red/30 transition-all rounded-2xl">
                  <item.icon size={18} className="text-wu-red group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <p className="font-display font-bold text-[10px] text-foreground tracking-widest">{item.label}</p>
                    <p className="font-mono text-[8px] text-muted-foreground tracking-widest">{item.sub}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY ROWS ─── */}
      <div className="pb-24 space-y-12">
        {/* Active Categories */}
        {categories.map((category) => {
          if (!category.isComingSoon) {
            const categoryProducts = products.filter(p => p.category === category.slug);
            return (
              <ShopCategorySection 
                key={category.slug} 
                category={category} 
                products={categoryProducts} 
              />
            );
          }
          return null;
        })}

        {/* Coming Soon Categories */}
        {categories.map((category) => {
          if (category.isComingSoon) {
            return (
              <section key={category.slug} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border relative overflow-hidden group min-h-[350px] flex items-center justify-center">
                {/* Cinematic Background Image */}
                <div className="absolute inset-0 z-0">
                   <Image 
                    src={category.image} 
                    alt={category.name} 
                    fill 
                    className="object-cover opacity-[0.12] group-hover:opacity-25 group-hover:scale-105 transition-all duration-[3000ms]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
                </div>

                <ScrollReveal direction="up" className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-wu-red/5 flex items-center justify-center border border-wu-red/20 rotate-45 group-hover:rotate-0 transition-all duration-700 shadow-[0_0_30px_rgba(232,22,27,0.1)]">
                    <Lock size={20} className="text-wu-red -rotate-45 group-hover:rotate-0 transition-all duration-700" />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-display font-black text-wu-red text-2xl tracking-[0.1em] uppercase italic">
                      Coming Soon
                    </h3>
                  </div>
                  
                  <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-foreground tracking-tighter uppercase mb-6 leading-[0.8]">
                    {category.name}
                  </h2>
                  
                  <div className="flex flex-col items-center gap-6">
                    <p className="font-body text-muted-foreground text-xs sm:text-sm max-w-md leading-relaxed opacity-70">
                      {category.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Notify Me */}
                      <div className="inline-flex items-center gap-4 px-7 py-2.5 bg-background border border-border text-foreground font-display font-bold text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-wu-red hover:border-wu-red hover:text-white transition-all cursor-pointer shadow-xl">
                        Notify Me <ArrowRight size={12} />
                      </div>
                      
                      {/* Bulk Orders */}
                      <button 
                        onClick={() => openBulkModal(category.name)}
                        className="inline-flex items-center gap-4 px-7 py-2.5 bg-foreground text-background font-display font-bold text-[10px] tracking-[0.3em] uppercase rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl group/btn"
                      >
                        Contact for Bulk Orders <ClipboardList size={12} className="group-hover/btn:rotate-12 transition-transform" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
                
                {/* Massive Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[15vw] text-transparent pointer-events-none select-none tracking-tighter uppercase whitespace-nowrap z-0 opacity-[0.07]"
                     style={{ WebkitTextStroke: '1px rgba(var(--foreground-rgb), 0.2)' }}>
                  {category.name}
                </div>
              </section>
            );
          }
          return null;
        })}
      </div>

      <BulkOrderModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        categoryName={selectedCategory} 
      />
    </div>
  );
}
