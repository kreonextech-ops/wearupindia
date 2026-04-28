'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Heart, ShoppingCart, Star, Check, Shield, Truck, 
  RotateCcw, Info, Zap, ChevronRight, Share2, Bike
} from 'lucide-react';
import { products, categories, brands, formatPrice } from '@/data';
import { useStore } from '@/lib/store-context';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { params: { category: string; product: string } };

export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.slug === params.product && p.category === params.category);
  if (!product) notFound();

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, user } = useStore();
  const router = useRouter();
  const wishlisted = isInWishlist(product.id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const related = useMemo(() => products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4), [product]);

  const category = categories.find(c => c.slug === product.category);
  
  // Cross-reference compatible brands from the updated data
  const compatibleBrandData = useMemo(() => 
    brands.filter(b => product.compatibleBrands?.includes(b.slug)),
    [product]
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Breadcrumb - Minimalist */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/shop" className="text-muted-foreground hover:text-foreground font-mono text-[9px] tracking-[0.2em] uppercase transition-colors">Shop</Link>
          <ChevronRight size={10} className="text-muted-foreground/50" />
          <Link href={`/shop/${product.category}`} className="text-muted-foreground hover:text-foreground font-mono text-[9px] tracking-[0.2em] uppercase transition-colors">{category?.name}</Link>
          <ChevronRight size={10} className="text-muted-foreground/50" />
          <span className="text-foreground/40 font-mono text-[9px] tracking-[0.2em] uppercase">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* ─── LEFT COLUMN: IMMERSIVE GALLERY ─── */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative group">
              <ScrollReveal direction="down">
                <div className="relative aspect-[4/5] sm:aspect-square bg-card overflow-hidden rounded-3xl border border-border">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={product.images[selectedImage] || product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Overlays */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.badge && (
                      <span className="font-display font-black text-[10px] px-3 py-1.5 bg-wu-red text-white tracking-[0.2em] uppercase rounded-full shadow-[0_5px_15px_rgba(232,22,27,0.3)]">
                        {product.badge}
                      </span>
                    )}
                    {product.isNew && (
                      <span className="font-display font-black text-[10px] px-3 py-1.5 bg-foreground text-background tracking-[0.2em] uppercase rounded-full">
                        Fresh Drop
                      </span>
                    )}
                  </div>
                </div>
              </ScrollReveal>

              {/* Share Icon */}
              <button className="absolute top-6 right-6 w-11 h-11 rounded-full bg-background/40 backdrop-blur-xl border border-border flex items-center justify-center text-foreground/50 hover:text-foreground transition-all">
                <Share2 size={16} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 p-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-24 h-24 rounded-2xl transition-all duration-300 overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === i ? 'border-wu-red scale-105' : 'border-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:border-border'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ─── THE ARSENAL: TECHNICAL SECTION ─── */}
            <div className="pt-16 mt-16 border-t border-border">
              <ScrollReveal direction="up">
                 <h2 className="font-display font-black text-4xl text-foreground tracking-tight uppercase mb-10 leading-none">Product <span className="text-wu-red">Details</span></h2>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => {
                      const dynamicSpecs = (product as any).meta_data?.specs || {};
                      const hasDynamicSpecs = Object.keys(dynamicSpecs).length > 0;
                      
                      if (hasDynamicSpecs) {
                        return Object.entries(dynamicSpecs).map(([key, value], i) => {
                          if (key === 'installation_note') return null;
                          const formattedLabel = key.replace(/_/g, ' ');
                          return (
                            <div key={i} className="p-6 bg-foreground/[0.02] border border-border rounded-2xl group hover:bg-foreground/[0.04] transition-colors">
                              <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-1">{formattedLabel}</p>
                              <p className="font-display font-bold text-foreground text-lg tracking-tight transition-colors">{value as string}</p>
                            </div>
                          );
                        });
                      }

                      return product.specs?.map((spec, i) => (
                        <div key={i} className="p-6 bg-foreground/[0.02] border border-border rounded-2xl group hover:bg-foreground/[0.04] transition-colors">
                          <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-1">{spec.label}</p>
                          <p className="font-display font-bold text-foreground text-lg tracking-tight transition-colors">{spec.value}</p>
                        </div>
                      ));
                    })()}
                 </div>

                 {/* Installation Note */}
                 {((product as any).meta_data?.specs?.installation_note) && (
                   <div className="mt-6 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4">
                     <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                     <div>
                       <h4 className="font-display font-bold text-sm text-foreground uppercase tracking-widest mb-1">Installation Note</h4>
                       <p className="font-body text-sm text-foreground/60 leading-relaxed">
                         {(product as any).meta_data.specs.installation_note}
                       </p>
                     </div>
                   </div>
                 )}
              </ScrollReveal>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: STICKY INFO ─── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-10">
              
              <ScrollReveal direction="up">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase">{category?.name}</span>
                    <div className="h-px w-8 bg-wu-red/40" />
                  </div>
                  <h1 className="font-display font-black text-5xl sm:text-6xl text-foreground tracking-tighter leading-[0.9] uppercase mb-6">
                    {product.name}
                  </h1>

                  {/* Rating & Trust */}
                  <div className="flex items-center gap-4 text-xs font-mono tracking-widest uppercase">
                    <div className="flex gap-0.5 text-wu-red">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="text-foreground/40">{product.rating} / {product.reviews} Reviews</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Price & Cart Section */}
              <ScrollReveal direction="up" delay={0.2} className="bg-foreground/[0.03] border border-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="font-display font-black text-5xl text-foreground tracking-tighter">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="font-display font-bold text-2xl text-muted-foreground line-through tracking-tighter">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                {/* Compatibility Checklist */}
                {compatibleBrandData.length > 0 && (
                  <div className="mb-8 p-6 bg-foreground/[0.02] rounded-3xl border border-border">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-full bg-wu-red/10 flex items-center justify-center text-wu-red">
                        <Bike size={14} />
                      </div>
                      <p className="font-mono text-[10px] tracking-[0.2em] font-black uppercase text-foreground/40">Compatible With</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {compatibleBrandData.map(b => (
                        <div key={b.slug} className="group/brand relative">
                          <div className="relative w-10 h-10 rounded-full border border-border overflow-hidden bg-foreground/5 group-hover/brand:border-wu-red/50 transition-all shadow-lg flex items-center justify-center">
                             <Image 
                                src={b.image} 
                                alt={b.name} 
                                fill 
                                className="object-cover grayscale group-hover/brand:grayscale-0 transition-all opacity-40 group-hover/brand:opacity-100" 
                                onError={(e) => { (e.target as any).style.display = 'none'; }}
                             />
                             <span className="font-display font-black text-[10px] text-foreground/20 group-hover/brand:text-foreground transition-colors">{b.name.charAt(0)}</span>
                          </div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/brand:opacity-100 transition-all font-mono text-[8px] text-background whitespace-nowrap bg-foreground px-2 py-1 rounded border border-border z-10 pointer-events-none tracking-widest uppercase">
                            {b.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-4">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden h-14 bg-background/50">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-16 h-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors text-xl font-bold"
                    >−</button>
                    <span className="flex-1 text-center font-display font-black text-lg text-foreground">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-16 h-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors text-xl font-bold"
                    >+</button>
                  </div>

                  <div className="flex gap-3 h-16">
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 flex items-center justify-center gap-3 font-display font-black text-xs tracking-[0.2em] uppercase transition-all duration-500 rounded-xl shadow-[0_10px_30px_rgba(232,22,27,0.2)] ${
                        addedToCart
                          ? 'bg-green-500 text-white shadow-green-500/20'
                          : 'bg-wu-red hover:bg-[#B81015] text-white'
                      }`}
                    >
                      {addedToCart ? <Check size={18} /> : <><ShoppingCart size={18} /> Add to Cart</>}
                    </button>
                    <button
                      onClick={() => {
                        if (!user) {
                          alert("Please log in to manage your wishlist.");
                          router.push('/login');
                          return;
                        }
                        wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)
                      }}
                      className={`w-16 flex items-center justify-center rounded-xl border transition-all ${
                        wishlisted ? 'bg-wu-red border-wu-red text-white shadow-[0_0_15px_rgba(232,22,27,0.4)]' : 'border-border text-foreground/40 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Trust Section */}
              <ScrollReveal direction="up" delay={0.4} className="grid grid-cols-1 gap-4">
                {[
                  { icon: Shield, label: '3M Certified', sub: 'UV Proof & Monsoon Durable' },
                  { icon: RotateCcw, label: 'No Glue Left', sub: 'Hassle-free paint preservation' },
                  { icon: Info, label: 'Installation Support', sub: 'Installation guide included' }
                ].map(({ icon: Icon, label, sub }, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-foreground/[0.02] group-hover:border-wu-red/30 transition-colors">
                      <Icon size={18} className="text-wu-red" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-foreground">{label}</h4>
                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{sub}</p>
                    </div>
                  </div>
                ))}
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* ─── RELATABLE SQUADS (RECOMMENDATIONS) ─── */}
        {related.length > 0 && (
          <div className="mt-40">
            <ScrollReveal direction="up">
              <div className="flex items-end justify-between mb-16 px-2">
                <div>
                   <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-4">Complete the Look</p>
                   <h2 className="font-display font-black text-5xl text-foreground tracking-tighter uppercase leading-none">You May Also Like</h2>
                </div>
                <Link href={`/shop/${product.category}`} className="group hidden sm:flex items-center gap-2 text-foreground/40 hover:text-foreground font-display font-bold text-xs tracking-[0.2em] uppercase transition-colors">
                  View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ScrollReveal key={p.id} direction="up" delay={i * 0.1}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
