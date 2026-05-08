import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { accessoryCategories } from '@/data';
import SafeImage from '@/components/ui/SafeImage';

export default function BikeAccessoriesPage() {
  return (
    <div className="min-h-screen bg-[#070707]">
      
      {/* ─── HERO SECTION ─── */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] flex flex-col bg-[#070707] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1600&q=80"
            alt="Bike Accessories"
            fill
            className="object-cover opacity-20 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/80 via-transparent to-[#070707]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-20">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-white/30 hover:text-wu-red transition-colors mb-8 font-mono text-[9px] uppercase tracking-[0.5em]"
          >
            <ArrowLeft size={14} className="opacity-50" /> BACK TO SHOP
          </Link>
          <h1 className="font-display font-black text-6xl sm:text-[120px] text-white tracking-tighter leading-none uppercase italic mb-8 text-center">
            Bike Accessories
          </h1>
          <p className="font-body text-white/40 max-w-2xl mx-auto text-xs sm:text-[14px] tracking-[0.2em] leading-relaxed uppercase text-center">
            Premium bike accessories that protect, boost performance, comfort, and style—engineered to handle every road you take.
          </p>
        </div>

        {/* ─── WHITE CATEGORY STRIP (Anchored to Hero) ─── */}
        <div className="relative z-20 bg-white py-3 overflow-x-auto no-scrollbar shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-12 min-w-max">
              {accessoryCategories.map((cat) => (
                <Link 
                  key={cat.slug}
                  href={`/shop/bike-accessories/${cat.slug}`}
                  className="flex flex-col items-center text-center group"
                >
                  <span className="font-display font-black text-[11px] text-black uppercase tracking-[0.1em] group-hover:text-wu-red transition-colors">
                    {cat.name}
                  </span>
                  <span className="font-mono text-[8px] text-black/30 uppercase tracking-[0.1em] mt-0.5">
                    {cat.items.length} Items
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ─── BREADCRUMBS ─── */}
        <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.4em] uppercase text-white/30 mb-16">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>{'>'}</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>{'>'}</span>
          <span className="text-white font-bold tracking-[0.4em]">Bike Accessories</span>
        </div>

        {/* ─── CATEGORIES GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {accessoryCategories.map((cat) => (
            <Link 
              key={cat.slug}
              href={`/shop/bike-accessories/${cat.slug}`}
              className="group relative flex flex-col bg-[#0A0A0A] border border-white/5 overflow-hidden transition-all duration-500 hover:border-wu-red/30 hover:shadow-[0_20px_50px_rgba(232,22,27,0.1)]"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <SafeImage 
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-display font-black text-2xl uppercase tracking-tighter transition-colors duration-300 ${cat.slug === 'fog-lights' || cat.slug === 'bike-protection' ? 'text-wu-red' : 'text-white group-hover:text-wu-red'}`}>
                    {cat.name}
                  </h3>
                  <ChevronRight size={18} className="text-white/20 group-hover:text-wu-red transform group-hover:translate-x-1 transition-all" />
                </div>
                
                <div className="flex items-center gap-2">
                   <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/40 group-hover:text-white/60 transition-colors">
                     {cat.items.length} Subcategories
                   </span>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 border-2 border-wu-red/0 group-hover:border-wu-red/20 transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
