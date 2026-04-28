'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowLeft, PackageX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatPrice, Product } from '@/data';

export default function GraphicKitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const { getProductsAction } = await import('@/app/admin/products/actions');
      const res = await getProductsAction('graphic-kits');
      if (res.success && res.data) setProducts(res.data as unknown as Product[]);
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <div className="relative pt-32 pb-16 bg-muted/30 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wu-red/10 via-background to-background opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red transition-colors mb-6 font-mono text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Shop
          </Link>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-foreground uppercase tracking-tighter italic mb-4">Graphic Kits</h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Bold looks, built to endure. UV-resistant, monsoon-proof vinyl kits engineered for your machine.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-10">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight size={12} className="text-border" />
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight size={12} className="text-border" />
          <span className="text-foreground font-bold">Graphic Kits</span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-4 border-muted border-t-wu-red rounded-full animate-spin mb-6" />
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Loading Kits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 border border-dashed border-border rounded-[3rem]">
            <PackageX className="text-wu-red mb-6" size={48} />
            <h3 className="font-display font-black text-3xl text-foreground uppercase italic tracking-tighter mb-2">No Kits Yet</h3>
            <p className="font-body text-muted-foreground text-sm text-center max-w-xs">
              We are stocking up new graphic kits. Check back shortly!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/graphic-kits/product/${product.slug}`}
                className="group relative flex flex-col bg-muted/10 border border-border overflow-hidden hover:border-wu-red/50 transition-all duration-300 rounded-2xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-wu-red/5">
                      <span className="font-display font-black text-5xl text-wu-red/20 uppercase">{product.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-70 group-hover:opacity-30 transition-opacity pointer-events-none" />
                </div>
                <div className="p-4 bg-background border-t border-border">
                  <h2 className="font-display font-black text-sm text-foreground uppercase tracking-wider mb-1 group-hover:text-wu-red transition-colors line-clamp-1">{product.name}</h2>
                  {(product.meta_data?.brand || product.meta_data?.bike_brand) && (
                    <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-2">
                      {product.meta_data?.brand || product.meta_data?.bike_brand}
                      {(product.meta_data?.model || product.meta_data?.bike_model) ? ` · ${product.meta_data?.model || product.meta_data?.bike_model}` : ''}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-wu-red text-sm">{formatPrice(product.price)}</span>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-wu-red transform group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
