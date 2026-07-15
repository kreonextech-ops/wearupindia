'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, ShoppingCart, Check, Shield, Truck, ChevronRight, Share2, Zap, Info, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, Product } from '@/data';
import { useStore } from '@/lib/store-context';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { params: { category: string } };

export default function BikeAccessoryProductOrCategoryPage({ params }: Props) {
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, user } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (addedToCart) {
      router.push('/cart');
      return;
    }
    
    addToCart(product, quantity);
    setAddedToCart(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (!addedToCart) {
      addToCart(product, quantity);
      setAddedToCart(true);
    }
    router.push('/checkout');
  };

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        // Dynamically import to avoid SSR issues
        const [{ accessoryCategories }, { getProductBySlugAction }] = await Promise.all([
          import('@/data'),
          import('@/app/admin/products/actions'),
        ]);



        // 2. Otherwise treat it as a product slug
        const res = await getProductBySlugAction('bike-accessories', params.category);
        if (res.success && res.data) {
          setProduct(res.data as unknown as Product);
        } else {
          router.push('/404');
        }
      } catch (err) {
        console.error('Failed to load:', err);
        router.push('/404');
      }
      setIsLoading(false);
    }
    load();
  }, [params.category, router]);

  const wishlisted = product ? isInWishlist(product.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-muted border-t-wu-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto whitespace-nowrap">
          <Link href="/shop" className="text-muted-foreground hover:text-foreground font-mono text-[9px] tracking-[0.2em] uppercase transition-colors">Shop</Link>
          <ChevronRight size={10} className="text-muted-foreground/50" />
          <Link href="/shop/bike-accessories" className="text-muted-foreground hover:text-foreground font-mono text-[9px] tracking-[0.2em] uppercase transition-colors">Bike Accessories</Link>
          <ChevronRight size={10} className="text-muted-foreground/50" />
          <span className="text-foreground/40 font-mono text-[9px] tracking-[0.2em] uppercase">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          {/* LEFT: Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] sm:aspect-square bg-card overflow-hidden rounded-3xl border border-border shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: 'circOut' }}
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
              <button className="absolute top-6 right-6 w-11 h-11 rounded-full bg-background/40 backdrop-blur-xl border border-border flex items-center justify-center text-foreground/50 hover:text-foreground transition-all">
                <Share2 size={16} />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${selectedImage === i ? 'border-wu-red scale-105' : 'border-transparent grayscale opacity-50'}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specifications */}
            {(() => {
              const dynamicSpecs = (product as any).meta_data?.specs || {};
              const hasDynamicSpecs = Object.keys(dynamicSpecs).length > 0;
              
              if (hasDynamicSpecs) {
                return (
                  <div className="pt-16 mt-16 border-t border-border">
                    <h2 className="font-display font-black text-4xl text-foreground tracking-tight uppercase mb-10 leading-none">
                      Technical <span className="text-wu-red">Specs</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(dynamicSpecs).map(([key, value], i) => {
                        if (key === 'installation_note') return null;
                        const formattedLabel = key.replace(/_/g, ' ');
                        return (
                          <div key={i} className="p-6 bg-foreground/[0.02] border border-border rounded-2xl group hover:bg-foreground/[0.04] transition-colors">
                            <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-1">{formattedLabel}</p>
                            <p className="font-display font-bold text-foreground text-lg tracking-tight transition-colors">{value as string}</p>
                          </div>
                        );
                      })}
                    </div>
                    {dynamicSpecs.installation_note && (
                      <div className="mt-6 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4">
                        <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                        <div>
                          <h4 className="font-display font-bold text-sm text-foreground uppercase tracking-widest mb-1">Installation Note</h4>
                          <p className="font-body text-sm text-foreground/60 leading-relaxed">
                            {dynamicSpecs.installation_note as string}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* RIGHT: Info */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-10">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase">Bike Accessories</span>
                  <div className="h-px w-8 bg-wu-red/40" />
                </div>
                <h1 className="font-display font-black text-5xl sm:text-6xl text-foreground tracking-tighter leading-[0.9] uppercase mb-4">
                  {product.name}
                </h1>
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                  {product.description || 'Premium quality accessory designed for maximum performance.'}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
                  <span className={product.inStock ? 'text-wu-red font-bold' : 'text-muted-foreground'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span className="text-foreground/40 border-l border-border pl-4">Free Shipping on Orders over ₹4999</span>
                </div>
              </div>

              {/* Price & Cart */}
              <div className="bg-foreground/[0.03] border border-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Zap size={100} className="text-wu-red" />
                </div>
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="font-display font-black text-5xl text-foreground tracking-tighter">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="font-display font-bold text-2xl text-muted-foreground line-through tracking-tighter">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden h-14 bg-background/50 backdrop-blur-md">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-16 h-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors text-xl font-bold">−</button>
                    <span className="flex-1 text-center font-display font-black text-lg text-foreground">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-16 h-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors text-xl font-bold">+</button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleAddToCart}
                        className={`h-16 flex items-center justify-center gap-2 font-display font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-500 rounded-xl shadow-lg ${
                          addedToCart
                            ? 'bg-green-600 text-white shadow-green-600/20'
                            : 'bg-foreground text-background hover:bg-wu-red hover:text-white'
                        }`}
                      >
                        {addedToCart ? <><Check size={16} /> Go to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="h-16 flex items-center justify-center gap-2 font-display font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-500 rounded-xl border-2 border-wu-red text-wu-red hover:bg-wu-red hover:text-white shadow-lg"
                      >
                        <Zap size={16} /> Buy Now
                      </button>
                    </div>
                    
                      <button
                        onClick={() => {
                          if (!user) { alert('Please log in to manage your wishlist.'); return; }
                          wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
                        }}
                        className={`h-12 w-full flex items-center justify-center gap-2 border rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                          wishlisted ? 'border-wu-red text-wu-red bg-wu-red/5' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                        }`}
                      >
                        <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
                        {wishlisted ? 'Saved' : 'Wishlist'}
                      </button>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 gap-6 pt-4">
                {[
                  { icon: Shield, label: '3M Certified', sub: 'UV Proof & Monsoon Durable' },
                  { icon: Truck, label: 'Pan-India Shipping', sub: 'Express delivery available' },
                  { icon: Zap, label: 'Quality Guarantee', sub: 'Premium grade materials only' },
                ].map(({ icon: Icon, label, sub }, i) => (
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
