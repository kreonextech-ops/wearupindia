'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, ShoppingCart, Heart, Check, Shield, Truck, Zap, Share2, PackageX, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { formatPrice, Product, AccessoryCategory } from '@/data';
import { useStore } from '@/lib/store-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Props = {
  product: Product | null;
  subCat: AccessoryCategory | null;
  itemName: string;
  categorySlug: string;
};

export default function AccessoryItemClient({ product, subCat, itemName, categorySlug }: Props) {
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, user } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const wishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    if (addedToCart) { router.push('/cart'); return; }
    addToCart(product, quantity);
    setAddedToCart(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!addedToCart) { addToCart(product, quantity); setAddedToCart(true); }
    router.push('/checkout');
  };

  const whatsappMsg = encodeURIComponent(`Hi, I am interested in ${itemName}`);
  const whatsappHref = `https://wa.me/917001234567?text=${whatsappMsg}`;

  // ─── COMING SOON ───
  if (!product) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 flex-1 flex flex-col">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-12 font-mono text-[9px] tracking-[0.3em] uppercase text-white/30 flex-wrap">
            <Link href="/shop" className="hover:text-wu-red transition-colors">Shop</Link>
            <ChevronRight size={10} className="opacity-50" />
            <Link href="/shop/bike-accessories" className="hover:text-wu-red transition-colors">Bike Accessories</Link>
            <ChevronRight size={10} className="opacity-50" />
            <Link href={`/shop/bike-accessories/category/${categorySlug}`} className="hover:text-wu-red transition-colors">
              {subCat?.name}
            </Link>
            <ChevronRight size={10} className="opacity-50" />
            <span className="text-white/60">{itemName}</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <div className="relative w-32 h-32 mb-10">
              <div className="absolute inset-0 rounded-full bg-wu-red/10 blur-2xl animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-wu-red/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="relative w-full h-full rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center">
                <PackageX size={40} className="text-white/20" />
              </div>
            </div>

            <p className="font-mono text-[10px] text-wu-red tracking-[0.5em] uppercase mb-4">// Dropping Soon</p>
            <h1 className="font-display font-black text-5xl sm:text-7xl text-white tracking-tighter leading-none uppercase italic mb-4">
              {itemName}
            </h1>
            <p className="font-body text-white/30 text-sm max-w-md leading-relaxed mb-10">
              This product is not available yet. Our team is working on bringing it to you. WhatsApp us and we can help you out directly.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-wu-red text-white font-display font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-wu-red/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(232,22,27,0.3)]"
              >
                <MessageCircle size={16} /> Enquire on WhatsApp
              </a>
              <Link
                href={`/shop/bike-accessories/category/${categorySlug}`}
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-white/50 font-display font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:border-white/30 hover:text-white transition-all"
              >
                <ArrowLeft size={14} /> Back to {subCat?.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── PRODUCT PAGE ───
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto whitespace-nowrap flex-wrap">
          <Link href="/shop" className="text-muted-foreground hover:text-foreground font-mono text-[9px] tracking-[0.2em] uppercase transition-colors">Shop</Link>
          <ChevronRight size={10} className="text-muted-foreground/50" />
          <Link href="/shop/bike-accessories" className="text-muted-foreground hover:text-foreground font-mono text-[9px] tracking-[0.2em] uppercase transition-colors">Bike Accessories</Link>
          <ChevronRight size={10} className="text-muted-foreground/50" />
          <Link href={`/shop/bike-accessories/category/${categorySlug}`} className="text-muted-foreground hover:text-foreground font-mono text-[9px] tracking-[0.2em] uppercase transition-colors">
            {subCat?.name}
          </Link>
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
          </div>

          {/* RIGHT: Info */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-10">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase">{subCat?.name || 'Bike Accessories'}</span>
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
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={`h-16 flex items-center justify-center gap-2 font-display font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-500 rounded-xl shadow-lg ${addedToCart ? 'bg-green-600 text-white' : 'bg-foreground text-background hover:bg-wu-red hover:text-white'}`}
                    >
                      {addedToCart ? <><Check size={16} /> Go to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="h-16 flex items-center justify-center gap-2 font-display font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-500 rounded-xl border-2 border-wu-red text-wu-red hover:bg-wu-red hover:text-white shadow-lg"
                    >
                      <Zap size={16} /> Buy Now
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) { alert('Please log in to manage your wishlist.'); return; }
                      wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
                    }}
                    className={`h-12 w-full flex items-center justify-center gap-2 border rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${wishlisted ? 'border-wu-red text-wu-red bg-wu-red/5' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}
                  >
                    <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
                    {wishlisted ? 'Saved' : 'Wishlist'}
                  </button>
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
