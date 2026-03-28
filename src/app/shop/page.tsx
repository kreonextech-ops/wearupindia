'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { products, categories } from '@/data';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ShopCategorySection from '@/components/shop/ShopCategorySection';

export default function ShopPage() {
  // Get products for each category
  const stickWraps = products.filter(p => p.category === 'stickers-wraps');
  const accessories = products.filter(p => p.category === 'accessories');
  const merchandise = products.filter(p => p.category === 'merchandise');

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      
      {/* ─── SHOP HERO ─── */}
      <section className="relative min-h-[480px] sm:min-h-[55vh] flex flex-col items-center border-b border-white/5">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1600&q=80"
            alt="WearUp Shop – Carbon Fiber"
            fill
            className="object-cover opacity-20 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
          {/* Subtle red mesh overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-40 sm:pt-48">
          {/* Badge removed as requested */}

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tighter leading-[0.85] mb-8">
              UNCOMPROMISED <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8161B] to-[#ff4b4f]">GEAR.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <p className="font-body text-[#888] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-12">
              From precision-cut vinyl to track-tested protection. Every piece is engineered for the rigors of the Indian road.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'PAN-INDIA', sub: 'SHIPPING', icon: Zap },
              { label: 'CERTIFIED', sub: 'QUALITY', icon: ShieldCheck },
              { label: 'PREMIUM', sub: 'MATERIALS', icon: Sparkles },
              { label: 'EXPERT', sub: 'SUPPORT', icon: ShoppingBag },
            ].map((item, i) => (
              <ScrollReveal key={item.label} direction="up" delay={0.6 + i * 0.1}>
                <div className="flex flex-col items-center gap-2 p-4 border border-white/5 bg-white/2 group hover:border-[#E8161B]/20 transition-all">
                  <item.icon size={18} className="text-[#E8161B]/40 group-hover:text-[#E8161B] transition-colors" />
                  <div className="text-center">
                    <p className="font-display font-bold text-[10px] text-white tracking-widest">{item.label}</p>
                    <p className="font-mono text-[8px] text-[#555] tracking-widest">{item.sub}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY ROWS ─── */}
      <div className="pb-24">
        {/* Row 1: Stickers & Wraps */}
        <ShopCategorySection 
          category={categories[0]} 
          products={stickWraps} 
        />

        {/* Row 2: Accessories */}
        <ShopCategorySection 
          category={categories[1]} 
          products={accessories} 
        />

        {/* Row 3: Merchandise */}
        <ShopCategorySection 
          category={categories[2]} 
          products={merchandise} 
        />
      </div>

    </div>
  );
}
