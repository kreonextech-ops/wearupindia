'use client';

import { useState } from 'react';
import { Search, ChevronDown, Filter, X } from 'lucide-react';
import { brands } from '@/data';

type ShopFiltersProps = {
  onFilterChange: (filters: FilterState) => void;
  brandOptions?: string[];
  maxPrice?: number;
  categorySlug?: string;
};

export type FilterState = {
  search: string;
  priceRange: [number, number];
  brands: string[];
  bikeBrand: string;
  sizes: string[];
  fits: string[];
};

export default function ShopFilters({ onFilterChange, brandOptions = [], maxPrice = 50000, categorySlug }: ShopFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [0, maxPrice],
    brands: [],
    bikeBrand: 'all',
    sizes: [],
    fits: [],
  });

  const isApparel = categorySlug === 'tshirts' || categorySlug === 'hoodies' || categorySlug === 't-shirts';

  const handleChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleToggle = (list: string[], item: string, key: keyof FilterState) => {
    const newList = list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
    handleChange({ ...filters, [key]: newList });
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-wu-red transition-colors">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-muted/30 border border-border text-foreground font-mono text-[11px] placeholder:text-muted-foreground/30 pl-11 pr-4 py-4 focus:outline-none focus:border-wu-red group-focus-within:bg-muted/50 transition-all tracking-widest uppercase"
          value={filters.search}
          onChange={(e) => handleChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Bike Compatibility - ONLY FOR KITS/ACCESSORIES */}
      {!isApparel && (
        <div>
          <label className="block font-mono text-[10px] text-wu-red tracking-[0.25em] uppercase mb-4 font-bold flex items-center gap-2">
             <span className="w-4 h-px bg-wu-red" /> For Your Bike
          </label>
          <div className="relative group">
            <select
              className="w-full bg-muted/30 border border-border text-foreground font-display font-bold text-xs tracking-widest uppercase px-5 py-4 appearance-none focus:outline-none focus:border-wu-red transition-all cursor-pointer"
              value={filters.bikeBrand}
              onChange={(e) => handleChange({ ...filters, bikeBrand: e.target.value })}
            >
              <option value="all">ALL MODELS</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground/30">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      )}

      {/* Apparel Sizes - ONLY FOR APPAREL */}
      {isApparel && (
        <div>
          <label className="block font-mono text-[10px] text-wu-red tracking-[0.25em] uppercase mb-4 font-bold flex items-center gap-2">
             <span className="w-4 h-px bg-wu-red" /> Select Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button
                key={size}
                onClick={() => handleToggle(filters.sizes, size, 'sizes')}
                className={`py-3 rounded-lg border font-display font-bold text-[10px] transition-all ${
                  filters.sizes.includes(size)
                    ? 'bg-wu-red border-wu-red text-white shadow-lg shadow-wu-red/20'
                    : 'bg-muted/30 border-border text-muted-foreground hover:border-wu-red/40 hover:text-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Apparel Fit - ONLY FOR APPAREL */}
      {isApparel && (
        <div>
          <label className="block font-mono text-[10px] text-wu-red tracking-[0.25em] uppercase mb-4 font-bold flex items-center gap-2">
             <span className="w-4 h-px bg-wu-red" /> Desired Fit
          </label>
          <div className="flex flex-col gap-2">
            {['Oversized', 'Regular', 'Slim'].map((fit) => (
              <button
                key={fit}
                onClick={() => handleToggle(filters.fits, fit, 'fits')}
                className={`px-4 py-3 rounded-xl border text-left font-display font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-between ${
                  filters.fits.includes(fit)
                    ? 'bg-wu-red/10 border-wu-red text-wu-red'
                    : 'bg-muted/30 border-border text-muted-foreground hover:border-wu-red/40 hover:text-foreground'
                }`}
              >
                {fit}
                {filters.fits.includes(fit) && <div className="w-1.5 h-1.5 rounded-full bg-wu-red animate-pulse" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Slider */}
      <div>
        <label className="block font-mono text-[10px] text-wu-red tracking-[0.25em] uppercase mb-4 font-bold flex items-center gap-2">
           <span className="w-4 h-px bg-wu-red" /> Price Range
        </label>
        <div className="px-1 space-y-6">
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max={maxPrice}
              step="100"
              className="w-full h-1.5 bg-muted/60 rounded-full appearance-none cursor-pointer accent-wu-red transition-all"
              value={filters.priceRange[1]}
              onChange={(e) => handleChange({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
            />
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">Maximum Price</span>
                <span className="font-display font-black text-lg text-foreground tracking-tight">₹{filters.priceRange[1].toLocaleString()}</span>
              </div>
              <button 
                onClick={() => handleChange({ ...filters, priceRange: [0, maxPrice] })}
                className="font-mono text-[9px] text-wu-red hover:underline tracking-widest uppercase font-bold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quick Price Brackets */}
          <div className="pt-4 border-t border-border/50">
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-3">Quick Selection</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Under 1k', max: 1000 },
                { label: 'Under 5k', max: 5000 },
                { label: 'Under 10k', max: 10000 },
                { label: 'Premium', max: maxPrice },
              ].map((bracket) => (
                <button
                  key={bracket.label}
                  onClick={() => handleChange({ ...filters, priceRange: [0, bracket.max] })}
                  className={`px-3 py-1.5 rounded-md border font-display font-bold text-[9px] tracking-widest uppercase transition-all ${
                    filters.priceRange[1] === bracket.max
                      ? 'bg-wu-red/10 border-wu-red text-wu-red'
                      : 'bg-muted/10 border-border text-muted-foreground hover:border-wu-red/30 hover:text-foreground'
                  }`}
                >
                  {bracket.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
