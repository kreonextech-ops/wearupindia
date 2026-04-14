'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { GRAPHIC_KITS_STRUCTURE } from '@/data';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function BikeSelector() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<{ brand: string; slug: string; models: string[] } | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const handleSearch = () => {
    if (selectedBrand && selectedModel) {
      // Ensure model string is URL friendly (basic substitution)
      const modelSlug = selectedModel.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      router.push(`/shop/graphic-kits/${selectedBrand.slug}/${modelSlug}`);
    } else if (selectedBrand) {
      router.push(`/shop/graphic-kits/${selectedBrand.slug}`);
    }
  };

  return (
    <section className="py-24 px-4 bg-muted/20 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <p className="font-mono text-[11px] text-wu-red tracking-[0.4em] uppercase mb-4 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-wu-red" /> Configurator <span className="w-6 h-px bg-wu-red" />
          </p>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-foreground uppercase tracking-tighter italic">
            Find Products For Your Bike
          </h2>
          <p className="font-body text-muted-foreground text-sm max-w-xl mx-auto mt-4">
            Select your manufacturer and model to filter our entire catalog of Graphic Kits, accessories, and precision parts tailored specifically for your machine.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="glass rounded-3xl p-6 sm:p-10 border border-border shadow-2xl relative overflow-hidden bg-background">
            {/* Background Red Glow */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-wu-red/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="min-h-[300px] flex flex-col justify-center relative z-10 w-full">
              <AnimatePresence mode="wait">
                {!selectedBrand ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display font-black text-2xl uppercase mb-8 text-center text-foreground">Step 1: Choose Brand</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      {GRAPHIC_KITS_STRUCTURE.map((item) => (
                        <button
                          key={item.slug}
                          onClick={() => setSelectedBrand(item)}
                          className="px-4 py-4 rounded-xl border border-border bg-muted flex items-center justify-center hover:border-wu-red/50 hover:bg-wu-red/10 transition-colors group"
                        >
                          <span className="font-display font-bold text-sm tracking-wide text-foreground group-hover:text-wu-red">{item.brand}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <button 
                        onClick={() => { setSelectedBrand(null); setSelectedModel(null); }}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-display font-bold text-xs uppercase tracking-widest"
                      >
                        <ArrowLeft size={14} /> Back to Brands
                      </button>
                      <span className="px-4 py-1.5 rounded-full bg-wu-red/10 border border-wu-red/20 text-wu-red font-display font-bold text-[10px] uppercase tracking-widest">
                        {selectedBrand.brand} Selected
                      </span>
                    </div>

                    <h3 className="font-display font-black text-2xl uppercase mb-8 text-center text-foreground">Step 2: Choose Model</h3>
                    
                    {selectedBrand.models.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedBrand.models.map((model) => (
                          <button
                            key={model}
                            onClick={() => setSelectedModel(model)}
                            className={`px-4 py-4 rounded-xl border text-left transition-all ${
                              selectedModel === model 
                                ? 'border-wu-red bg-wu-red/10 text-wu-red shadow-[0_0_15px_rgba(232,22,27,0.15)]' 
                                : 'border-border bg-muted text-foreground hover:border-foreground/30'
                            }`}
                          >
                            <span className="font-display font-bold text-sm">{model}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground font-body text-sm py-8">
                        No specific models listed. Click proceed to view universal {selectedBrand.brand} products.
                      </p>
                    )}

                    <div className="mt-12 flex justify-center border-t border-border pt-8">
                      <button 
                        onClick={handleSearch}
                        className="group flex items-center justify-center gap-3 px-12 py-5 bg-wu-red text-white font-display font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(232,22,27,0.2)] disabled:opacity-50 disabled:hover:scale-100"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
                      >
                        {selectedModel ? `Find ${selectedModel} Parts` : `Browse All ${selectedBrand.brand}`}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
