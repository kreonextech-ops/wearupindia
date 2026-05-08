'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ChevronDown, Search } from 'lucide-react';
import { GRAPHIC_KITS_STRUCTURE } from '@/data';

export default function BikeSelector() {
  const router = useRouter();
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  const selectedBrandData = GRAPHIC_KITS_STRUCTURE.find(b => b.slug === selectedBrandSlug);
  const models = selectedBrandData ? selectedBrandData.models : [];

  const handleSearch = () => {
    if (selectedBrandSlug) {
      if (selectedModel) {
        // Convert model name to slug matching the route expectations
        const modelSlug = selectedModel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        router.push(`/shop/graphic-kits/${selectedBrandSlug}/${modelSlug}`);
      } else {
        router.push(`/shop/graphic-kits/${selectedBrandSlug}`);
      }
    }
  };

  return (
    <section className="pt-6 pb-12 md:pb-16 border-b border-border bg-background relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-wu-red/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="down" className="text-center mb-8 md:mb-10">
          <h2 className="font-display font-black text-5xl sm:text-7xl text-foreground tracking-tighter leading-[0.9] uppercase">
            Find Graphic For <span className="text-transparent bg-clip-text bg-gradient-to-r from-wu-red to-[#ff4b4f]">Your Bike</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-2xl border border-border rounded-2xl p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row gap-5 items-stretch">
              
              {/* Brand Dropdown */}
              <div className="relative flex-1 group">
                <label className="absolute -top-2.5 left-4 px-2 bg-card font-mono text-[10px] text-muted-foreground tracking-widest uppercase z-10 group-focus-within:text-wu-red transition-colors rounded">
                  Brand
                </label>
                <select 
                  value={selectedBrandSlug}
                  onChange={(e) => { setSelectedBrandSlug(e.target.value); setSelectedModel(''); }}
                  className="w-full h-16 bg-background border border-border rounded-xl px-5 font-body text-foreground text-base sm:text-lg appearance-none outline-none focus:border-wu-red/50 focus:ring-1 focus:ring-wu-red/50 transition-all cursor-pointer shadow-inner"
                >
                  <option value="" disabled className="bg-card text-muted-foreground">Select Brand...</option>
                  {GRAPHIC_KITS_STRUCTURE.map(brand => (
                    <option key={brand.slug} value={brand.slug} className="bg-card text-foreground py-2">{brand.brand}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-wu-red transition-colors" size={20} />
              </div>

              {/* Model Dropdown */}
              <div className="relative flex-1 group">
                <label className="absolute -top-2.5 left-4 px-2 bg-card font-mono text-[10px] text-muted-foreground tracking-widest uppercase z-10 group-focus-within:text-wu-red transition-colors rounded">
                  Bike Model
                </label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrandSlug}
                  className="w-full h-16 bg-background border border-border rounded-xl px-5 font-body text-foreground text-base sm:text-lg appearance-none outline-none focus:border-wu-red/50 focus:ring-1 focus:ring-wu-red/50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-inner"
                >
                  <option value="" disabled className="bg-card text-muted-foreground">
                    {selectedBrandSlug ? "Select Bike Model..." : "Choose Brand First"}
                  </option>
                  {models.map(m => (
                    <option key={m} value={m} className="bg-card text-foreground py-2">{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-wu-red transition-colors opacity-50" size={20} />
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                disabled={!selectedBrandSlug}
                className="h-16 px-8 md:px-12 bg-wu-red text-white font-display font-black text-lg tracking-widest uppercase rounded-xl hover:bg-[#ff1e24] focus:ring-2 focus:ring-wu-red/50 focus:outline-none disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(232,22,27,0.4)] hover:shadow-[0_0_35px_rgba(232,22,27,0.6)] disabled:shadow-none flex items-center justify-center gap-3 shrink-0"
              >
                <Search size={22} className={!selectedBrandSlug ? 'opacity-50' : ''} />
                <span>Search</span>
              </button>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
