'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ChevronDown, Search } from 'lucide-react';

const bikeModelMap: Record<string, string[]> = {
  'Yamaha': ['R15 V4', 'MT-15 V2', 'R3', 'FZ-S', 'Aerox 155', 'R1'],
  'KTM': ['Duke 390', 'RC 390', 'Adventure 390', 'Duke 250', 'Duke 200'],
  'Royal Enfield': ['Classic 350', 'Meteor 350', 'Hunter 350', 'Interceptor 650', 'Continental GT 650', 'Himalayan 450'],
  'Kawasaki': ['Ninja 300', 'Ninja 400', 'Ninja 650', 'Z900', 'ZX-10R'],
  'Honda': ['CBR650R', 'CB350RS', 'Hness CB350', 'Africa Twin', 'Hornet 2.0'],
  'Suzuki': ['Hayabusa', 'Gixxer SF 250', 'V-Strom SX', 'Katana'],
  'Ducati': ['Panigale V4', 'Streetfighter V4', 'Multistrada V4', 'Monster', 'Scrambler'],
  'Triumph': ['Street Triple RS', 'Tiger 900', 'Bonneville T120', 'Speed Twin 900', 'Trident 660'],
  'BMW': ['S 1000 RR', 'G 310 R', 'G 310 GS', 'R 1250 GS', 'M 1000 RR'],
  'Bajaj': ['Pulsar NS200', 'Pulsar RS200', 'Dominar 400', 'Pulsar N160']
};

export default function BikeSelector() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  const brands = Object.keys(bikeModelMap).sort();
  const models = selectedBrand ? bikeModelMap[selectedBrand] : [];

  const handleSearch = () => {
    if (selectedBrand) {
      const query = selectedModel ? `${selectedBrand} ${selectedModel}` : selectedBrand;
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="py-24 border-t border-b border-white/5 bg-gradient-to-b from-[#0f0f0f] to-[#050505] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#E8161B]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="down" className="text-center mb-16">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-[#E8161B]" /> Precise Compatibility
          </p>
          <h2 className="font-display font-black text-5xl sm:text-7xl text-white tracking-tighter leading-[0.9] uppercase mb-6">
            Shop By <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8161B] to-[#ff4b4f]">Machine</span>
          </h2>
          <p className="font-body text-[#888] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Select your exact make and model to instantly filter our inventory for precision-cut wraps, decals, and verified accessories built for your motorcycle.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="max-w-4xl mx-auto bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row gap-5 items-stretch">
              
              {/* Brand Dropdown */}
              <div className="relative flex-1 group">
                <label className="absolute -top-2.5 left-4 px-2 bg-[#171717] font-mono text-[10px] text-[#888] tracking-widest uppercase z-10 group-focus-within:text-[#E8161B] transition-colors rounded">
                  Brand
                </label>
                <select 
                  value={selectedBrand}
                  onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(''); }}
                  className="w-full h-16 bg-[#0A0A0A] border border-white/10 rounded-xl px-5 font-body text-white text-base sm:text-lg appearance-none outline-none focus:border-[#E8161B]/50 focus:ring-1 focus:ring-[#E8161B]/50 transition-all cursor-pointer shadow-inner"
                >
                  <option value="" disabled className="bg-[#111] text-[#555]">Select Manufacturer...</option>
                  {brands.map(b => (
                    <option key={b} value={b} className="bg-[#111] text-white py-2">{b}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none group-focus-within:text-[#E8161B] transition-colors" size={20} />
              </div>

              {/* Model Dropdown */}
              <div className="relative flex-1 group">
                <label className="absolute -top-2.5 left-4 px-2 bg-[#171717] font-mono text-[10px] text-[#888] tracking-widest uppercase z-10 group-focus-within:text-[#E8161B] transition-colors rounded">
                  Bike Model
                </label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full h-16 bg-[#0A0A0A] border border-white/10 rounded-xl px-5 font-body text-white text-base sm:text-lg appearance-none outline-none focus:border-[#E8161B]/50 focus:ring-1 focus:ring-[#E8161B]/50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-inner"
                >
                  <option value="" disabled className="bg-[#111] text-[#555]">
                    {selectedBrand ? "Select Bike Model..." : "Choose Brand First"}
                  </option>
                  {models.map(m => (
                    <option key={m} value={m} className="bg-[#111] text-white py-2">{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none group-focus-within:text-[#E8161B] transition-colors opacity-50" size={20} />
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                disabled={!selectedBrand}
                className="h-16 px-8 md:px-12 bg-[#E8161B] text-white font-display font-black text-lg tracking-widest uppercase rounded-xl hover:bg-[#ff1e24] focus:ring-2 focus:ring-[#E8161B]/50 focus:outline-none disabled:bg-white/5 disabled:text-[#555] disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(232,22,27,0.4)] hover:shadow-[0_0_35px_rgba(232,22,27,0.6)] disabled:shadow-none flex items-center justify-center gap-3 shrink-0"
              >
                <Search size={22} className={!selectedBrand ? 'opacity-50' : ''} />
                <span>Search</span>
              </button>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
