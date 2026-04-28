'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { accessoryCategories } from '@/data';
import SafeImage from '@/components/ui/SafeImage';

type Props = { params: { category: string } };

export default function AccessoryCategoryPage({ params }: Props) {
  const category = useMemo(() => accessoryCategories.find(c => c.slug === params.category), [params.category]);
  
  if (!category) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* ─── CATEGORY HERO ─── */}
      <div className="relative min-h-[400px] sm:h-[45vh] lg:h-[50vh] overflow-hidden border-b border-border">
        {/* Massive Background Image */}
        <SafeImage 
          src={category.image} 
          alt={category.name} 
          fill 
          className="object-cover opacity-40 mix-blend-luminosity scale-105 pointer-events-none" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        {/* Localized Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-wu-red/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
          <Link 
            href="/shop/bike-accessories" 
            className="group inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red text-[10px] font-mono tracking-[0.4em] uppercase mb-8 transition-all p-1 w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Accessories
          </Link>

          <p className="font-mono text-[10px] sm:text-[12px] text-wu-red tracking-[0.5em] uppercase mb-4 flex items-center gap-4">
            <span className="w-8 sm:w-12 h-px bg-wu-red" /> Performance & Upgrades
          </p>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-9xl text-foreground tracking-tighter leading-[0.8] mb-6 uppercase">
            {category.name}
          </h1>
          <p className="font-body text-muted-foreground text-sm sm:text-lg max-w-2xl leading-relaxed">
            Select your specific accessory type to view our premium, engineered solutions for your motorcycle.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* ─── BREADCRUMBS ─── */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-12">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight size={12} className="text-border" />
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight size={12} className="text-border" />
          <Link href="/shop/bike-accessories" className="hover:text-foreground transition-colors">Bike Accessories</Link>
          <ChevronRight size={12} className="text-border" />
          <span className="text-foreground font-bold">{category.name}</span>
        </div>

        {/* ─── ITEMS GRID ─── */}
        <div className="mb-8">
          <h2 className="font-display font-black text-3xl uppercase tracking-tighter italic mb-8">Select Item</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {category.items && category.items.length > 0 ? (
              category.items.map((item) => {
                // Slugify the item name for the URL
                const itemSlug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                
                return (
                  <Link 
                    href={`/shop/bike-accessories/${category.slug}/${itemSlug}`}
                    key={item}
                    className="group relative flex flex-col bg-muted/10 border border-border overflow-hidden hover:border-wu-red/50 transition-colors"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20 flex items-center justify-center">
                      <SafeImage 
                        // Generic placeholder image for items
                        src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80"
                        alt={item}
                        fill
                        className="object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 pointer-events-none" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-5 bg-background border-t border-border flex flex-col">
                      <h3 className="font-display font-black text-xl text-foreground uppercase tracking-wider mb-1 group-hover:text-wu-red transition-colors truncate">
                        {item}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
                          View Products
                        </span>
                        <ChevronRight size={14} className="text-muted-foreground group-hover:text-wu-red transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-border bg-muted/10">
                <span className="font-display font-bold text-xl uppercase tracking-widest text-muted-foreground mb-2">No Items Listed</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">{category.name} accessories coming soon</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
