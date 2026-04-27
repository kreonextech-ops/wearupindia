import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { brands, GRAPHIC_KITS_STRUCTURE } from '@/data';
import { getAssetUrl } from '@/lib/assets';
import SafeImage from '@/components/ui/SafeImage';

export default function GraphicKitsBrandsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO HEADER ─── */}
      <div className="relative pt-32 pb-16 bg-muted/30 border-b border-border overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wu-red/10 via-background to-background" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red transition-colors mb-6 font-mono text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Shop
          </Link>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-foreground uppercase tracking-tighter italic mb-4">
            Graphic Kits
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Select your motorcycle manufacturer to explore precision-cut, premium vinyl kits tailored perfectly for your machine's aggressive lines.
          </p>
        </div>
      </div>

      {/* ─── QUICK NAV BAR (Optional, mimicking screenshot structure) ─── */}
      <div className="bg-foreground text-background overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-start sm:justify-center gap-8 sm:gap-12 w-max sm:w-auto">
          {brands.map(brand => (
            <Link key={brand.slug} href={`/shop/graphic-kits/${brand.slug}`} className="group flex flex-col items-center">
              <span className="font-display font-bold text-xs uppercase tracking-widest group-hover:text-wu-red transition-colors">{brand.name}</span>
              <span className="font-mono text-[9px] text-muted-foreground opacity-70 group-hover:opacity-100">{brand.models?.length || 0} Models</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ─── BREADCRUMBS ─── */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-12">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight size={12} className="text-border" />
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight size={12} className="text-border" />
          <span className="text-foreground font-bold">Graphic Kits</span>
        </div>

        {/* ─── BRAND GRID ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {brands.map((brand) => (
            <Link 
              href={`/shop/graphic-kits/${brand.slug}`} 
              key={brand.slug}
              className="group relative flex flex-col bg-muted/10 border border-border overflow-hidden hover:border-wu-red/50 transition-colors"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20 flex items-center justify-center p-6">
                 {/* 
                    If we have transparent bike PNGs, this looks great. 
                    Alternatively, using the cinematic images we generated.
                 */}
                <SafeImage 
                  src={brand.slug === 'ktm' ? getAssetUrl('/images/brands/brand_ktm_bg.png') : 
                       brand.slug === 'yamaha' ? getAssetUrl('/images/brands/brand_yamaha_bg.png') : 
                       brand.slug === 'kawasaki' ? getAssetUrl('/images/brands/brand_kawasaki_bg.png') : 
                       brand.slug === 'royal-enfield' ? getAssetUrl('/images/brands/brand_re_bg.png') :
                       brand.slug === 'bajaj' ? getAssetUrl('/images/brands/brand_bajaj_bg.png') :
                       brand.slug === 'tvs' ? getAssetUrl('/images/brands/brand_tvs_bg.png') :
                       brand.image}
                  alt={brand.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 pointer-events-none" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-5 bg-background border-t border-border flex flex-col">
                <h2 className="font-display font-black text-xl text-foreground uppercase tracking-wider mb-1 group-hover:text-wu-red transition-colors">
                  {brand.name}
                </h2>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
                    {brand.models?.length || 0} Models Available
                  </span>
                  <ChevronRight size={14} className="text-muted-foreground group-hover:text-wu-red transform group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
