import React from 'react';
import Image from 'next/image';
import { Lock, ArrowRight, ClipboardList, ShoppingBag, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { categories, Product } from '@/data';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ShopCategorySection from '@/components/shop/ShopCategorySection';
import BulkOrderButton from '@/components/shop/BulkOrderButton';
import { getAllProductsAction } from '@/app/admin/products/actions';

export default async function ShopPage() {
  const res = await getAllProductsAction();
  const allProducts = (res.success && res.data ? res.data : []) as Product[];

  return (
    <div className="min-h-screen bg-background">
      
      {/* ─── SHOP HERO ─── */}
      <section className="relative min-h-[350px] sm:min-h-[40vh] flex flex-col items-center justify-center border-b border-border overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/shop-hero.png"
            alt="WearUp Shop"
            fill
            className="object-cover opacity-20 pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background" />
          {/* Red glow orb backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[150px] bg-wu-red/10 blur-[80px] rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="down">
            <p className="font-mono text-[9px] text-wu-red tracking-[0.4em] uppercase mb-3 flex items-center justify-center gap-3">
              <span className="w-6 h-px bg-wu-red" /> Official Collection
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-foreground tracking-tighter leading-none mb-4 uppercase">
              Elite <span className="text-wu-red">Gear.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4} className="max-w-xl mx-auto">
            <p className="font-body text-muted-foreground text-[10px] sm:text-xs leading-relaxed opacity-80 uppercase tracking-widest">
              Performance engineered aesthetics for India&apos;s most aggressive machines.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <div className="relative z-10 -mt-8 mb-2 px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'PAN-INDIA', sub: 'SHIPPING', icon: Zap },
            { label: 'CERTIFIED', sub: 'QUALITY', icon: ShieldCheck },
            { label: 'PREMIUM', sub: 'MATERIALS', icon: Sparkles },
            { label: 'EXPERT', sub: 'SUPPORT', icon: ShoppingBag },
          ].map((item, i) => (
            <ScrollReveal key={item.label} direction="up" delay={0.5 + i * 0.1}>
              <div className="flex flex-col items-center gap-2 p-4 border border-border bg-background/80 backdrop-blur-md group hover:border-wu-red/30 transition-all rounded-xl shadow-2xl shadow-black/20">
                <item.icon size={16} className="text-wu-red group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <p className="font-display font-bold text-[9px] text-foreground tracking-widest">{item.label}</p>
                  <p className="font-mono text-[7px] text-muted-foreground tracking-widest">{item.sub}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* ─── CATEGORY ROWS ─── */}
      <div className="pb-12 space-y-0">
        {/* Active Categories */}
            {categories.map((category) => {
              if (!category.isComingSoon) {
                const categoryProducts = allProducts.filter(p => p.category === category.slug);
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
                      <BulkOrderButton categoryName={category.name} />
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
    </div>
  );
}
