'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowLeft, Bike, MoveRight } from 'lucide-react';
import { brands } from '@/data';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function GraphicKitsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground">
      
      {/* ─── CLEAN HEADER (From Image 2) ─── */}
      <div className="relative pt-32 pb-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 text-white/30 hover:text-wu-red transition-all mb-8 font-mono text-[10px] uppercase tracking-[0.4em]">
            <ArrowLeft size={14} /> Back to Shop
          </Link>
          <h1 className="font-display font-black text-6xl sm:text-8xl text-white uppercase tracking-tighter leading-none mb-6">
            Graphic <span className="italic">Kits</span>
          </h1>
          <p className="font-body text-white/40 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Select your motorcycle manufacturer to explore precision-cut, premium vinyl kits tailored perfectly for your machine's aggressive lines.
          </p>
        </div>
      </div>

      {/* ─── QUICK SELECTION BAR (From Image 2) ─── */}
      <div className="sticky top-[72px] z-30 bg-black/80 backdrop-blur-md border-b border-white/5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 min-w-max">
          {brands.map((brand) => (
            <Link 
              key={brand.slug}
              href={`/shop/graphic-kits/${brand.slug}`}
              className="px-6 flex flex-col items-center justify-center border-r border-white/5 hover:bg-white/5 transition-colors group"
            >
              <span className="font-display font-bold text-[10px] text-white tracking-widest uppercase group-hover:text-wu-red transition-colors">
                {brand.name}
              </span>
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-tighter">
                {brand.models.length} Models
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/20 mb-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-white font-bold">Graphic Kits</span>
        </div>

        {/* ─── VISUAL BRAND GRID (From Image 1) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand, i) => (
            <ScrollReveal key={brand.slug} direction="up" delay={i * 0.05}>
              <Link
                href={`/shop/graphic-kits/${brand.slug}`}
                className="group relative block bg-[#141414] border border-white/5 overflow-hidden transition-all duration-500 hover:border-wu-red hover:shadow-[0_0_30px_rgba(232,22,27,0.2)]"
              >
                {/* Bike Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1A1A1A]">
                  <Image 
                    src={brand.image} 
                    alt={brand.name} 
                    fill 
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    priority={i < 4}
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Logo Overlay (Top Left) */}
                  <div className="absolute top-4 left-4 w-12 h-12">
                    <Image src="/images/logo-icon.png" alt="WearUp" width={48} height={48} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Content Bar */}
                <div className="p-6 flex flex-col gap-1 bg-[#111111] group-hover:bg-[#1A1A1A] transition-colors">
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tighter group-hover:text-wu-red transition-colors">
                    {brand.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">
                      {brand.models.length} Models Available
                    </span>
                    <MoveRight size={16} className="text-white/20 group-hover:text-wu-red transform group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Bottom Red Accent Line */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-wu-red transition-all duration-500 w-0 group-hover:w-full" />
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Custom Request Section */}
        <div className="mt-32 p-12 bg-white/[0.02] border border-white/5 rounded-[2rem] text-center">
          <h3 className="font-display font-black text-2xl text-white uppercase tracking-tighter mb-4 italic">Custom Decal Requests</h3>
          <p className="font-body text-white/40 text-sm max-w-xl mx-auto leading-relaxed mb-8">
            Can't find your specific bike model? Our design studio specializes in one-off custom kits for any machine on the market.
          </p>
          <button className="px-12 py-4 bg-white text-black font-display font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-wu-red hover:text-white transition-all rounded-full">
            Contact Studio
          </button>
        </div>
      </div>
    </div>
  );
}
