'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Product, Category } from '@/data';
import ProductCard from './ProductCard';
import ScrollReveal from '../ui/ScrollReveal';

type ShopCategorySectionProps = {
  category: Category;
  products: Product[];
};

export default function ShopCategorySection({ category, products }: ShopCategorySectionProps) {
  // Show up to 5 products to accommodate the 5-column desktop layout
  const featured = products.slice(0, 5);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden border-t border-border group">
      {/* ─── CINEMATIC BACKGROUND ─── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={category.image} 
          alt="" 
          fill 
          className="object-cover opacity-[0.08] grayscale group-hover:scale-110 group-hover:opacity-[0.12] transition-all duration-[5000ms] ease-out pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        {/* Localized Glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-wu-red/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ─── HEADER ─── */}
        <ScrollReveal direction="up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-px bg-wu-red" />
                <p className="font-mono text-[11px] text-wu-red tracking-[0.4em] uppercase font-bold">
                  {category.tagline}
                </p>
              </div>
              
              <h2 className="font-display font-black text-6xl sm:text-7xl lg:text-8xl text-foreground tracking-tighter leading-[0.85] uppercase mb-6 italic">
                {category.name}
              </h2>
              
              <p className="font-body text-muted-foreground text-sm sm:text-lg max-w-none leading-relaxed opacity-80">
                {category.description}
              </p>
            </div>
            
            <Link 
              href={`/shop/${category.slug}`} 
              className="group relative flex items-center gap-4 text-foreground font-display font-bold text-xs tracking-[0.2em] uppercase bg-background/50 backdrop-blur-md border border-border px-10 py-5 hover:bg-wu-red hover:border-wu-red hover:text-white transition-all duration-500 overflow-hidden shadow-xl"
              style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
              </span>
              <div className="absolute inset-0 bg-wu-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          </div>
        </ScrollReveal>

        {/* ─── PRODUCT GRID ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {featured.map((product, i) => (
            <ScrollReveal 
              key={product.id} 
              direction="up" 
              delay={i * 0.1}
              className={i === 4 ? 'hidden lg:block' : ''}
            >
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
