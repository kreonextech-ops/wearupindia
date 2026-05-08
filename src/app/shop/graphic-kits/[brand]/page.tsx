'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, Bike } from 'lucide-react';
import { brands, MODEL_IMAGES } from '@/data';
import ScrollReveal from '@/components/ui/ScrollReveal';

type Props = { params: { brand: string } };

export default function BrandModelsPage({ params }: Props) {
  const brand = React.useMemo(() => brands.find(b => b.slug === params.brand), [params.brand]);
  
  if (!brand) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* ─── BRAND HERO ─── */}
      <div className="relative min-h-[400px] sm:h-[45vh] lg:h-[55vh] overflow-hidden border-b border-border">
        {/* Massive Background Image */}
        <div className="absolute inset-0 opacity-20 grayscale pointer-events-none scale-110">
          <Image 
            src={brand.image} 
            alt={brand.name} 
            fill 
            className="object-cover transition-all duration-1000" 
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        {/* Animated Brand Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-wu-red/20 blur-[150px] rounded-full animate-pulse pointer-events-none opacity-50" />
        
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 pt-32">
          <ScrollReveal direction="down">
            <Link 
              href="/shop/graphic-kits" 
              className="group inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red text-[10px] font-mono tracking-[0.4em] uppercase mb-8 transition-all p-1 w-fit bg-white/5 px-4 py-2 rounded-full border border-white/5"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Brands
            </Link>
          </ScrollReveal>
 
          <ScrollReveal direction="up" delay={0.2}>
            <p className="font-mono text-[10px] sm:text-[12px] text-wu-red tracking-[0.6em] uppercase mb-4 flex items-center gap-4 font-bold">
              <span className="w-8 sm:w-12 h-px bg-wu-red" /> {brand.name} Decal Division
            </p>
            <h1 className="font-display font-black text-6xl sm:text-8xl lg:text-[10rem] text-foreground tracking-tighter leading-[0.75] mb-6 uppercase italic">
              {brand.name}
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-lg max-w-2xl leading-relaxed">
              Select your specific {brand.name} model to view our collection of performance decal kits. Every design is laser-measured for a factory-perfect fit.
            </p>
          </ScrollReveal>
        </div>
      </div>
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* ─── BREADCRUMBS ─── */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-16">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight size={12} className="text-border" />
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight size={12} className="text-border" />
          <Link href="/shop/graphic-kits" className="hover:text-foreground transition-colors">Graphic Kits</Link>
          <ChevronRight size={12} className="text-border" />
          <span className="text-foreground font-bold">{brand.name}</span>
        </div>
 
        {/* ─── MODELS GRID ─── */}
        <div className="mb-8">
          <h2 className="font-display font-black text-2xl uppercase tracking-[0.2em] text-white/40 mb-12 flex items-center gap-6">
            Select {brand.name} Model <div className="h-px flex-1 bg-white/5" />
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brand.models && brand.models.length > 0 ? (
              brand.models.map((model, i) => {
                const modelSlug = model.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                const modelImage = MODEL_IMAGES[modelSlug] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80";
                
                return (
                  <ScrollReveal key={model} direction="up" delay={i * 0.05}>
                    <Link 
                      href={`/shop/graphic-kits/${brand.slug}/${modelSlug}`}
                      className="group relative flex flex-col bg-muted/5 border border-white/5 overflow-hidden hover:bg-muted/10 hover:border-wu-red/30 transition-all duration-500"
                    >
                      {/* Image/Silhouette */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/10 flex items-center justify-center p-8">
                        <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Image 
                            src={modelImage}
                            alt={model}
                            fill
                            className="object-cover group-hover:scale-110 transition-all duration-700"
                          />
                        </div>
                        <Bike className="relative z-10 text-white/5 group-hover:text-wu-red/20 transition-colors duration-500 scale-[2]" size={80} strokeWidth={1} />
                        
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-background to-transparent">
                          <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tighter italic group-hover:text-wu-red transition-colors">
                            {model}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Interaction Footer */}
                      <div className="px-8 py-5 flex items-center justify-between bg-white/[0.02]">
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40 group-hover:text-white transition-colors">
                          Explore Designs
                        </span>
                        <ChevronRight size={14} className="text-white/20 group-hover:text-wu-red transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })
            ) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-white/10 bg-muted/5">
                <Bike className="text-white/5 mb-8" size={64} strokeWidth={1} />
                <span className="font-display font-bold text-xl uppercase tracking-widest text-white/60 mb-2 italic">Models Coming Soon</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">Check back for {brand.name} specific kits</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
