'use client';

import { useState } from 'react';
import { Search, ChevronDown, Filter, X } from 'lucide-react';
import { brands } from '@/data';

type ShopFiltersProps = {
  onFilterChange: (filters: FilterState) => void;
  brandOptions?: string[];
  maxPrice?: number;
};

export type FilterState = {
  search: string;
  priceRange: [number, number];
  brands: string[];
  bikeBrand: string;
};

export default function ShopFilters({ onFilterChange, brandOptions = [], maxPrice = 50000 }: ShopFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [0, maxPrice],
    brands: [],
    bikeBrand: 'all',
  });

  const handleChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    handleChange({ ...filters, brands: newBrands });
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-[#E8161B] transition-colors">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="SEARCH PRODUCTS..."
          className="w-full bg-white/5 border border-white/10 text-white font-mono text-[11px] placeholder:text-white/20 pl-11 pr-4 py-4 focus:outline-none focus:border-[#E8161B] group-focus-within:bg-white/10 transition-all uppercase tracking-widest"
          value={filters.search}
          onChange={(e) => handleChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Bike Compatibility */}
      <div>
        <label className="block font-mono text-[10px] text-[#E8161B] tracking-[0.25em] uppercase mb-4 font-bold flex items-center gap-2">
           <span className="w-4 h-px bg-[#E8161B]" /> Compatibility
        </label>
        <div className="relative group">
          <select
            className="w-full bg-white/5 border border-white/10 text-white font-display font-bold text-xs tracking-widest uppercase px-5 py-4 appearance-none focus:outline-none focus:border-[#E8161B] transition-all cursor-pointer"
            value={filters.bikeBrand}
            onChange={(e) => handleChange({ ...filters, bikeBrand: e.target.value })}
          >
            <option value="all">ALL MACHINES</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/20">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Brands Selection */}
      <div>
        <label className="block font-mono text-[10px] text-[#E8161B] tracking-[0.25em] uppercase mb-4 font-bold flex items-center gap-2">
           <span className="w-4 h-px bg-[#E8161B]" /> Manufacturer
        </label>
        <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
          {brandOptions.length > 0 ? brandOptions.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandToggle(brand)}
              className={`flex items-center justify-between group py-1 text-left transition-all ${
                filters.brands.includes(brand) ? 'text-white font-bold' : 'text-white/40 hover:text-white'
              }`}
            >
              <span className="font-display text-[11px] tracking-widest uppercase">{brand}</span>
              <div className={`w-3.5 h-3.5 border transition-all flex items-center justify-center ${
                filters.brands.includes(brand) ? 'bg-[#E8161B] border-[#E8161B]' : 'border-white/20'
              }`}>
                {filters.brands.includes(brand) && <div className="w-1.5 h-1.5 bg-white" />}
              </div>
            </button>
          )) : (
            <p className="text-white/20 font-mono text-[10px]">NO BRANDS AVAILABLE</p>
          )}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <label className="block font-mono text-[10px] text-[#E8161B] tracking-[0.25em] uppercase mb-4 font-bold flex items-center gap-2">
           <span className="w-4 h-px bg-[#E8161B]" /> Budget Range
        </label>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="100"
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#E8161B]"
            value={filters.priceRange[1]}
            onChange={(e) => handleChange({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">Max: ₹{filters.priceRange[1].toLocaleString()}</span>
            <button 
              onClick={() => handleChange({ ...filters, priceRange: [0, maxPrice] })}
              className="font-mono text-[9px] text-[#E8161B] hover:underline"
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
