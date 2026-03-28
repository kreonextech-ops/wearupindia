'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product, Category } from '@/data';
import ProductCard from './ProductCard';
import ScrollReveal from '../ui/ScrollReveal';

type ShopCategorySectionProps = {
  category: Category;
  products: Product[];
};

export default function ShopCategorySection({ category, products }: ShopCategorySectionProps) {
  // Show only first 4 products in this row
  const featured = products.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex-1">
            <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#E8161B]" /> {category.tagline}
            </p>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-none uppercase">
              {category.name}
            </h2>
            <p className="font-body text-[#666] mt-4 text-sm max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>
          
          <Link 
            href={`/shop/${category.slug}`} 
            className="group flex items-center gap-3 text-white font-display font-bold text-xs tracking-[0.2em] uppercase bg-white/5 border border-white/10 px-8 py-4 hover:bg-[#E8161B] hover:border-[#E8161B] transition-all duration-300"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
          >
            Explore All <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((product, i) => (
          <ScrollReveal key={product.id} direction="up" delay={i * 0.1}>
            <ProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
