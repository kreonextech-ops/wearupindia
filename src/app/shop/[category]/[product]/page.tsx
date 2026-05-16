'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Heart, ShoppingCart, Check, Shield, Truck, 
  Info, Zap, ChevronRight, Share2, Bike, MessageCircle
} from 'lucide-react';
import { categories, brands, formatPrice, Product } from '@/data';
import { useStore } from '@/lib/store-context';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { params: { category: string; product: string } };

export default function ProductPage({ params }: Props) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, user } = useStore();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const { getProductBySlugAction, getProductsAction } = await import('@/app/admin/products/actions');
        
        // Use the exact category slug from URL first (no forced conversion)
        const catSlug = params.category;
        
        const res = await getProductBySlugAction(catSlug, params.product);
        if (res.success && res.data) {
          setProduct(res.data as unknown as Product);
          
          // Load related products
          const relatedRes = await getProductsAction(catSlug);
          if (relatedRes.success && relatedRes.data) {
             setRelated((relatedRes.data as unknown as Product[]).filter((p: any) => p.id !== res.data.id).slice(0, 4));
          }
        } else {
          // Try alternative slug if first attempt failed (handles tshirts <-> t-shirts mismatch)
          let altSlug: string | null = null;
          if (params.category === 't-shirts') altSlug = 'tshirts';
          else if (params.category === 'tshirts') altSlug = 't-shirts';

          if (altSlug) {
             const altRes = await getProductBySlugAction(altSlug, params.product);
             if (altRes.success && altRes.data) {
                setProduct(altRes.data as unknown as Product);
                const relatedRes = await getProductsAction(altSlug);
                if (relatedRes.success && relatedRes.data) {
                   setRelated((relatedRes.data as unknown as Product[]).filter((p: any) => p.id !== altRes.data.id).slice(0, 4));
                }
                setIsLoading(false);
                return;
             }
          }
          router.push('/404');
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      }
      setIsLoading(false);
    }
    loadData();
  }, [params.category, params.product, router]);

  const wishlisted = product ? isInWishlist(product.id) : false;
  const category = categories.find(c => c.slug === params.category);
  const isTShirt = params.category === 'tshirts' || product?.category === 'tshirts';
  const isBikeAccessory = params.category === 'bike-accessories' || product?.category === 'bike-accessories';
  
  // Cross-reference compatible brands from the updated data
  const compatibleBrandData = useMemo(() => 
    product ? brands.filter(b => product.compatibleBrands?.includes(b.slug)) : [],
    [product]
  );

  const handleAddToCart = () => {
    if (!product) return;
    if (isTShirt && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    
    if (addedToCart) {
      router.push('/cart');
      return;
    }
    
    addToCart(product, quantity, { size: selectedSize || undefined });
    
    setAddedToCart(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (isTShirt && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    
    if (!addedToCart) {
      addToCart(product, quantity, { size: selectedSize || undefined });
      setAddedToCart(true);
    }
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-muted border-t-wu-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

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
                <div className="relative aspect-[4/5] sm:aspect-square bg-card overflow-hidden rounded-3xl border border-border shadow-2xl">
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
                      <span className="font-display font-black text-[10px] px-3 py-1.5 bg-foreground text-background tracking-[0.2em] uppercase rounded-full shadow-lg">
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
                      selectedImage === i ? 'border-wu-red scale-105 shadow-lg shadow-wu-red/20' : 'border-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:border-border'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ─── THE ARSENAL / SPECIFICATIONS ─── */}
            <div className="pt-16 mt-16 border-t border-border">
              <ScrollReveal direction="up">
                 <h2 className="font-display font-black text-4xl text-foreground tracking-tight uppercase mb-10 leading-none">
                   {isTShirt ? 'Technical' : 'Product'} <span className="text-wu-red">{isTShirt ? 'Specs' : 'Details'}</span>
                 </h2>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {isTShirt ? (
                      <>
                        <div className="p-6 bg-foreground/[0.02] border border-border rounded-2xl">
                          <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-1">Fabric</p>
                          <p className="font-display font-bold text-foreground text-lg tracking-tight">{product.meta_data?.material || '100% Super-Combed Cotton'}</p>
                        </div>
                        <div className="p-6 bg-foreground/[0.02] border border-border rounded-2xl">
                          <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-1">Weight</p>
                          <p className="font-display font-bold text-foreground text-lg tracking-tight">{product.meta_data?.gsm || '220-240 GSM'}</p>
                        </div>
                        <div className="p-6 bg-foreground/[0.02] border border-border rounded-2xl">
                          <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-1">Fit</p>
                          <p className="font-display font-bold text-foreground text-lg tracking-tight">{product.meta_data?.fit || 'Premium Oversized Fit'}</p>
                        </div>
                        <div className="p-6 bg-foreground/[0.02] border border-border rounded-2xl">
                          <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-1">Print Type</p>
                          <p className="font-display font-bold text-foreground text-lg tracking-tight">High-Density DTF / Screen</p>
                        </div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                 </div>

                 {/* Care Instructions (For T-Shirts) */}
                 {isTShirt && (
                   <div className="mt-8 p-8 bg-foreground/[0.02] border border-border rounded-3xl">
                     <h3 className="font-display font-bold text-sm tracking-[0.2em] uppercase text-wu-red mb-6">Care Instructions</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                       {[
                         { label: 'Cold Wash', desc: 'Wash at 30°C' },
                         { label: 'No Bleach', desc: 'Avoid harsh chemicals' },
                         { label: 'Tumble Dry Low', desc: 'Gentle drying' },
                         { label: 'Iron Inside Out', desc: 'Protect the print' }
                       ].map((item, i) => (
                         <div key={i} className="text-center sm:text-left">
                           <p className="font-display font-black text-[10px] text-foreground tracking-widest uppercase mb-1">{item.label}</p>
                           <p className="font-body text-[10px] text-muted-foreground uppercase">{item.desc}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {/* Installation Note (For Graphic Kits) */}
                 {!isTShirt && ((product as any).meta_data?.specs?.installation_note) && (
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
                  <h1 className="font-display font-black text-5xl sm:text-6xl text-foreground tracking-tighter leading-[0.9] uppercase mb-4">
                    {product.name}
                  </h1>

                  <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                    {product.description || 'Premium quality gear designed for maximum performance and elite aesthetics.'}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
                    <span className="text-wu-red font-bold">In Stock</span>
                    <span className="text-foreground/40 border-l border-border pl-4">Free Shipping on Orders over ₹4999</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Price & Cart Section */}
              <ScrollReveal direction="up" delay={0.2} className="bg-foreground/[0.03] border border-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Zap size={100} className="text-wu-red" />
                </div>

                <div className="flex items-baseline gap-4 mb-8">
                  <span className="font-display font-black text-5xl text-foreground tracking-tighter">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="font-display font-bold text-2xl text-muted-foreground line-through tracking-tighter">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                {/* Size Selection (For T-Shirts) */}
                {isTShirt && (product as any).sizes && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-mono text-[10px] tracking-[0.2em] font-black uppercase text-foreground/40">Select Size</p>
                      <button className="text-[9px] font-mono text-wu-red uppercase tracking-widest hover:underline transition-all">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries((product as any).sizes).map(([size, stock]) => {
                        const isOutOfStock = (stock as number) <= 0;
                        return (
                          <button
                            key={size}
                            disabled={isOutOfStock}
                            onClick={() => setSelectedSize(size)}
                            className={`w-14 h-14 rounded-xl border font-display font-bold text-sm transition-all relative overflow-hidden ${
                              isOutOfStock 
                                ? 'bg-background/20 border-white/5 text-white/10 cursor-not-allowed opacity-50' 
                                : selectedSize === size
                                  ? 'bg-wu-red border-wu-red text-white shadow-lg shadow-wu-red/20'
                                  : 'bg-background/50 border-border text-foreground hover:border-wu-red/50 hover:bg-foreground/5'
                            }`}
                          >
                            {size}
                            {isOutOfStock && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-[1px] bg-white/20 rotate-45" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {!selectedSize && <p className="mt-3 font-mono text-[9px] text-wu-red/60 uppercase tracking-widest animate-pulse">Select a size to add to cart</p>}
                  </div>
                )}

                {/* Compatibility Checklist (For Non-Apparel) */}
                {!isTShirt && compatibleBrandData.length > 0 && (
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
                  <div className="flex items-center border border-border rounded-xl overflow-hidden h-14 bg-background/50 backdrop-blur-md">
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

                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={isTShirt && !selectedSize}
                        className={`h-16 flex items-center justify-center gap-2 font-display font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-500 rounded-xl shadow-[0_10px_30px_rgba(232,22,27,0.2)] ${
                          addedToCart
                            ? 'bg-green-500 text-white shadow-green-500/20'
                            : (isTShirt && !selectedSize)
                              ? 'bg-foreground/10 text-foreground/20 cursor-not-allowed border border-white/5'
                              : 'bg-wu-red hover:bg-[#B81015] text-white'
                        }`}
                      >
                        {addedToCart ? <><Check size={16} /> Go to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
                      </button>

                      <button
                        onClick={handleBuyNow}
                        disabled={isTShirt && !selectedSize}
                        className={`h-16 flex items-center justify-center gap-2 font-display font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-500 rounded-xl border-2 ${
                          (isTShirt && !selectedSize)
                            ? 'border-white/5 text-foreground/20 cursor-not-allowed'
                            : 'border-wu-red text-wu-red hover:bg-wu-red hover:text-white shadow-[0_10px_30px_rgba(232,22,27,0.1)]'
                        }`}
                      >
                        <Zap size={16} /> Buy Now
                      </button>
                    </div>
                    
                      <button
                        onClick={() => {
                          if (!user) {
                            alert("Please log in to manage your wishlist.");
                            router.push('/login');
                            return;
                          }
                          wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)
                        }}
                        className={`h-12 w-full flex items-center justify-center rounded-xl border transition-all font-display font-bold text-[10px] uppercase tracking-widest ${
                          wishlisted ? 'bg-wu-red border-wu-red text-white shadow-[0_0_15px_rgba(232,22,27,0.4)]' : 'border-border text-foreground/40 hover:text-foreground hover:bg-foreground/5'
                        }`}
                      >
                        <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} className="mr-2" />
                        {wishlisted ? 'Saved' : 'Wishlist'}
                      </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Trust Section */}
              <ScrollReveal direction="up" delay={0.4} className="grid grid-cols-1 gap-6 pt-4">
                {(isTShirt ? [
                  { icon: Zap, label: 'Super-Combed Cotton', sub: 'Extra soft & highly breathable' },
                  { icon: Shield, label: 'Durable Print', sub: 'Non-cracking, high-definition ink' },
                  { icon: Truck, label: 'Pan-India Shipping', sub: 'Express delivery available' }
                ] : [
                  { icon: Shield, label: '3M Certified', sub: 'UV Proof & Monsoon Durable' },
                  { icon: Truck, label: 'Pan-India Shipping', sub: 'Express delivery available' },
                  { icon: Info, label: 'Installation Support', sub: 'Installation guide included' }
                ]).map(({ icon: Icon, label, sub }, i) => (
                  <div key={i} className="flex items-center gap-5 group">
                    <div className="w-14 h-14 rounded-2xl border border-border flex items-center justify-center bg-foreground/[0.02] group-hover:border-wu-red/30 transition-all shadow-sm">
                      <Icon size={20} className="text-wu-red" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-foreground tracking-tight">{label}</h4>
                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{sub}</p>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
