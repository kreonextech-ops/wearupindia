'use client';

import { notFound } from 'next/navigation';
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

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
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
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Breadcrumb - Minimalist */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/shop" className="text-[#666] hover:text-white font-mono text-[9px] tracking-[0.2em] uppercase transition-colors">Lab Hub</Link>
          <ChevronRight size={10} className="text-[#333]" />
          <Link href={`/shop/${product.category}`} className="text-[#666] hover:text-white font-mono text-[9px] tracking-[0.2em] uppercase transition-colors">{category?.name}</Link>
          <ChevronRight size={10} className="text-[#333]" />
          <span className="text-white/40 font-mono text-[9px] tracking-[0.2em] uppercase">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* ─── LEFT COLUMN: IMMERSIVE GALLERY ─── */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative group">
              <ScrollReveal direction="down">
                <div className="relative aspect-[4/5] sm:aspect-square bg-[#111] overflow-hidden rounded-3xl border border-white/5">
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
                      <span className="font-display font-black text-[10px] px-3 py-1.5 bg-[#E8161B] text-white tracking-[0.2em] uppercase rounded-full shadow-[0_5px_15px_rgba(232,22,27,0.3)]">
                        {product.badge}
                      </span>
                    )}
                    {product.isNew && (
                      <span className="font-display font-black text-[10px] px-3 py-1.5 bg-white text-black tracking-[0.2em] uppercase rounded-full">
                        Fresh Drop
                      </span>
                    )}
                  </div>
                </div>
              </ScrollReveal>

              {/* Share Icon */}
              <button className="absolute top-6 right-6 w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all">
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
                      selectedImage === i ? 'border-[#E8161B] scale-105' : 'border-white/5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ─── THE ARSENAL: TECHNICAL SECTION ─── */}
            <div className="pt-16 mt-16 border-t border-white/5">
              <ScrollReveal direction="up">
                 <div className="inline-flex items-center gap-3 px-3 py-1 bg-[#E8161B]/10 border border-[#E8161B]/30 rounded-full mb-6 text-[#E8161B]">
                    <Zap size={10} />
                    <span className="font-mono text-[9px] font-black tracking-widest uppercase">Performance Science</span>
                 </div>
                 <h2 className="font-display font-black text-4xl text-white tracking-tight uppercase mb-10 leading-none">The Arsenal <span className="text-[#E8161B]">Standard</span></h2>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-colors">
                        <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase mb-1">{spec.label}</p>
                        <p className="font-display font-bold text-white text-lg tracking-tight group-hover:text-white transition-colors">{spec.value}</p>
                      </div>
                    ))}
                 </div>
              </ScrollReveal>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: STICKY INFO ─── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-10">
              
              <ScrollReveal direction="up">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase">{category?.name}</span>
                    <div className="h-px w-8 bg-[#E8161B]/40" />
                  </div>
                  <h1 className="font-display font-black text-5xl sm:text-6xl text-white tracking-tighter leading-[0.9] uppercase mb-6">
                    {product.name}
                  </h1>

                  {/* Rating & Trust */}
                  <div className="flex items-center gap-4 text-xs font-mono tracking-widest uppercase">
                    <div className="flex gap-0.5 text-[#E8161B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="text-white/40">{product.rating} / {product.reviews} Verification Logs</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Price & Cart Section */}
              <ScrollReveal direction="up" delay={0.2} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="font-display font-black text-5xl text-white tracking-tighter">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="font-display font-bold text-2xl text-white/20 line-through tracking-tighter">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                {/* Compatibility Checklist */}
                {compatibleBrandData.length > 0 && (
                  <div className="mb-8 p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-full bg-[#E8161B]/10 flex items-center justify-center text-[#E8161B]">
                        <Bike size={14} />
                      </div>
                      <p className="font-mono text-[10px] tracking-[0.2em] font-black uppercase text-white/40">Verified Fit Range</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {compatibleBrandData.map(b => (
                        <div key={b.slug} className="group/brand relative">
                          <div className="relative w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 group-hover/brand:border-[#E8161B]/50 transition-all shadow-lg flex items-center justify-center">
                             <Image 
                                src={b.image} 
                                alt={b.name} 
                                fill 
                                className="object-cover grayscale group-hover/brand:grayscale-0 transition-all opacity-40 group-hover/brand:opacity-100" 
                                onError={(e) => { (e.target as any).style.display = 'none'; }}
                             />
                             <span className="font-display font-black text-[10px] text-white/10 group-hover/brand:text-white transition-colors">{b.name.charAt(0)}</span>
                          </div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/brand:opacity-100 transition-all font-mono text-[8px] text-white whitespace-nowrap bg-black/90 px-2 py-1 rounded border border-white/10 z-10 pointer-events-none tracking-widest uppercase">
                            {b.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-4">
                  <div className="flex items-center border border-white/10 rounded-xl overflow-hidden h-14 bg-black/20">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-16 h-full text-white/40 hover:text-white hover:bg-white/5 transition-colors text-xl font-bold"
                    >−</button>
                    <span className="flex-1 text-center font-display font-black text-lg text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-16 h-full text-white/40 hover:text-white hover:bg-white/5 transition-colors text-xl font-bold"
                    >+</button>
                  </div>

                  <div className="flex gap-3 h-16">
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 flex items-center justify-center gap-3 font-display font-black text-xs tracking-[0.2em] uppercase transition-all duration-500 rounded-xl shadow-[0_10px_30px_rgba(232,22,27,0.2)] ${
                        addedToCart
                          ? 'bg-green-500 text-white shadow-green-500/20'
                          : 'bg-[#E8161B] hover:bg-[#B81015] text-white'
                      }`}
                    >
                      {addedToCart ? <Check size={18} /> : <><ShoppingCart size={18} /> Initiate Acquisition</>}
                    </button>
                    <button
                      onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                      className={`w-16 flex items-center justify-center rounded-xl border border-white/10 transition-all ${
                        wishlisted ? 'bg-[#E8161B] border-[#E8161B] text-white shadow-[0_0_15px_rgba(232,22,27,0.4)]' : 'text-white/40 hover:text-white hover:border-white/20'
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
                  { icon: Info, label: 'Install Support', sub: 'Tutorial kit included with item' }
                ].map(({ icon: Icon, label, sub }, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] group-hover:border-[#E8161B]/30 transition-colors">
                      <Icon size={18} className="text-[#E8161B]" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">{label}</h4>
                      <p className="font-body text-[10px] text-[#666] uppercase tracking-wider">{sub}</p>
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
                   <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-4">Tactical expansion</p>
                   <h2 className="font-display font-black text-5xl text-white tracking-tighter uppercase leading-none">Complete The Kit</h2>
                </div>
                <Link href={`/shop/${product.category}`} className="group hidden sm:flex items-center gap-2 text-white/40 hover:text-white font-display font-bold text-xs tracking-[0.2em] uppercase transition-colors">
                  Full Department <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
