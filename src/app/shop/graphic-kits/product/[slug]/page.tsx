'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { 
  Heart, ShoppingCart, Star, Check, Shield, Truck, 
  RotateCcw, ChevronRight, Share2, Bike, Scissors, Droplets, Undo2,
  MessageCircle, Phone
} from 'lucide-react';
import { products, categories, brands, formatPrice } from '@/data';
import { useStore } from '@/lib/store-context';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { params: { slug: string } };

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  droplets: Droplets,
  scissors: Scissors,
  undo: Undo2,
};

export default function GraphicKitProductPage({ params }: Props) {
  const product = products.find(p => p.slug === params.slug && p.category === 'graphic-kits');
  if (!product) notFound();

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, user } = useStore();
  const router = useRouter();
  const wishlisted = isInWishlist(product.id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState('Glossy');
  const [selectedQuality, setSelectedQuality] = useState('Standard');
  const [selectedModel, setSelectedModel] = useState(product.compatibleModels?.[0] || '');

  const related = useMemo(() => products
    .filter(p => p.category === 'graphic-kits' && p.id !== product.id)
    .slice(0, 4), [product]);

  const compatibleBrandData = useMemo(() =>
    brands.filter(b => product.compatibleBrands?.includes(b.slug)),
    [product]
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  // Calculate dynamic price based on selections
  let currentPrice = product.price;
  const matrix = (product as any).pricingMatrix || (product as any).meta_data?.pricing_matrix;
  
  if (matrix && selectedModel && matrix[selectedModel]) {
    const variantPricing = matrix[selectedModel][selectedQuality];
    if (variantPricing && variantPricing[selectedFinish]) {
      currentPrice = Number(variantPricing[selectedFinish]);
    }
  } else {
    // Fallback logic for legacy mock data to demonstrate dynamic pricing
    if (selectedQuality === 'Premium') currentPrice += 1500;
    if (selectedFinish === 'Matte') currentPrice += 300;
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ─── BREADCRUMB ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="text-muted-foreground hover:text-foreground font-mono text-[9px] tracking-[0.25em] uppercase transition-colors">Home</Link>
          <ChevronRight size={10} className="text-muted-foreground/50 flex-shrink-0" />
          <Link href="/shop/graphic-kits" className="text-muted-foreground hover:text-foreground font-mono text-[9px] tracking-[0.25em] uppercase transition-colors">Graphic Kits</Link>
          <ChevronRight size={10} className="text-muted-foreground/50 flex-shrink-0" />
          <span className="text-foreground/30 font-mono text-[9px] tracking-[0.25em] uppercase truncate">{product.name}</span>
        </div>
      </div>

      {/* ─── TOP SPLIT: GALLERY + CHECKOUT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative">
              <div className="relative aspect-[4/3] bg-card overflow-hidden rounded-3xl border border-border shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: 'circOut' }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={product.images[selectedImage] || product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                  {product.badge && (
                    <span className="font-display font-black text-[10px] px-3 py-1.5 bg-wu-red text-white tracking-[0.2em] uppercase rounded-full shadow-[0_5px_15px_rgba(232,22,27,0.5)]">
                      {product.badge}
                    </span>
                  )}
                  {discount && (
                    <span className="font-display font-black text-[10px] px-3 py-1.5 bg-green-500 text-white tracking-[0.2em] uppercase rounded-full border border-border">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-background/50 backdrop-blur-xl border border-border flex items-center justify-center text-foreground/50 hover:text-foreground transition-all z-10">
                  <Share2 size={15} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-24 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      selectedImage === i
                        ? 'border-wu-red scale-105 shadow-[0_0_12px_rgba(232,22,27,0.4)]'
                        : 'border-transparent opacity-40 hover:opacity-100 grayscale hover:grayscale-0'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Checkout */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-7">

              {/* Title + Rating */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <p className="font-mono text-[9px] text-wu-red tracking-[0.4em] uppercase">Graphic Kit</p>
                  <div className="h-px flex-1 bg-wu-red/20" />
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground tracking-tight leading-snug uppercase mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5 text-wu-red">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-foreground/40 tracking-widest">
                    {product.rating} · {product.reviews} reviews
                  </span>
                </div>
                
                {/* Custom Description provided by user */}
                <div className="mt-6 text-sm text-foreground/70 font-body leading-relaxed space-y-4 bg-foreground/[0.02] p-5 rounded-2xl border border-border">
                  <p>Transform your ride with our high-quality Graphics Kit, crafted for riders who want standout looks with reliable performance in every condition.</p>
                  
                  <div>
                    <p className="font-display font-bold text-foreground mb-2 flex items-center gap-2">
                      <span className="text-wu-red">🔥</span> Key Features:
                    </p>
                    <ul className="space-y-2 list-none">
                      <li className="flex gap-2">
                        <span className="text-wu-red mt-1">•</span> 
                        <span><strong>Bubble-Free Material:</strong> Advanced air-release vinyl ensures smooth, hassle-free installation without bubbles</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-wu-red mt-1">•</span> 
                        <span><strong>UV Resistant:</strong> Fade-proof colors that stay vibrant even under harsh sunlight</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-wu-red mt-1">•</span> 
                        <span><strong>Monsoon-Proof Laminate:</strong> Special protective layer designed to withstand rain, moisture, and humid conditions</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-wu-red mt-1">•</span> 
                        <span><strong>Premium Quality Vinyl:</strong> Durable and flexible material for a perfect fit on curves and edges</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-wu-red mt-1">•</span> 
                        <span><strong>High-Definition Printing:</strong> Sharp graphics with rich, long-lasting colors</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-wu-red mt-1">•</span> 
                        <span><strong>Scratch Protection:</strong> Shields your original paint from minor scratches and wear</span>
                      </li>
                    </ul>
                  </div>
                  
                  <ul className="space-y-1 text-xs text-foreground/60 border-t border-border/50 pt-3">
                    <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Built for Indian weather conditions from scorching heat to heavy rains</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Enhances your vehicle&apos;s look instantly</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Long-lasting finish without peeling or fading</li>
                  </ul>
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-foreground/[0.03] border border-border rounded-3xl p-7 space-y-6">
                {/* Price */}
                <div className="flex items-baseline gap-4">
                  <span className="font-display font-black text-5xl text-foreground tracking-tighter">{formatPrice(currentPrice)}</span>
                  {product.originalPrice && (
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                      <span className="font-mono text-[9px] text-green-500 tracking-widest uppercase">
                        Save {formatPrice(product.originalPrice - currentPrice)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Compatible Models Tag */}
                {product.compatibleModels && product.compatibleModels.length > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-wu-red/5 border border-wu-red/20 rounded-2xl">
                    <Bike size={16} className="text-wu-red flex-shrink-0" />
                    <div>
                      <p className="font-mono text-[8px] text-wu-red tracking-widest uppercase mb-0.5">Designed For</p>
                      <p className="font-display font-black text-sm text-foreground uppercase tracking-tight">
                        {product.compatibleModels.join(' / ').toUpperCase().replace(/-/g, ' ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Compatible Brands */}
                {compatibleBrandData.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {compatibleBrandData.map(b => (
                      <span key={b.slug} className="font-mono text-[8px] px-3 py-1.5 border border-border text-foreground/50 rounded-full uppercase tracking-widest">
                        {b.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* ─── NEW DROPDOWN SELECTIONS ─── */}
                <div className="space-y-4 pt-2">
                  {/* Model Selection (Only if > 1 model) */}
                  {product.compatibleModels && product.compatibleModels.length > 1 && (
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-foreground/50 tracking-widest uppercase block">Select Model</label>
                      <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-display font-bold uppercase tracking-wide focus:outline-none focus:border-wu-red transition-all cursor-pointer appearance-none"
                      >
                        {product.compatibleModels.map(model => (
                          <option key={model} value={model}>{model.toUpperCase().replace(/-/g, ' ')}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {/* Finish Selection */}
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-foreground/50 tracking-widest uppercase block">Finish Type</label>
                      <select 
                        value={selectedFinish}
                        onChange={(e) => setSelectedFinish(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-display font-bold uppercase tracking-wide focus:outline-none focus:border-wu-red transition-all cursor-pointer appearance-none"
                      >
                        <option value="Glossy">Glossy</option>
                        <option value="Matte">Matte</option>
                      </select>
                    </div>

                    {/* Quality Selection */}
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-foreground/50 tracking-widest uppercase block">Material Quality</label>
                      <select 
                        value={selectedQuality}
                        onChange={(e) => setSelectedQuality(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-display font-bold uppercase tracking-wide focus:outline-none focus:border-wu-red transition-all cursor-pointer appearance-none"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quantity + Cart */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background/50">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-12 text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors text-xl font-bold">−</button>
                    <span className="flex-1 text-center font-display font-black text-xl text-foreground">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-14 h-12 text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors text-xl font-bold">+</button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 h-14 flex items-center justify-center gap-2 font-display font-black text-xs tracking-[0.2em] uppercase rounded-xl transition-all duration-500 ${
                        addedToCart
                          ? 'bg-green-500 text-white'
                          : 'bg-wu-red hover:bg-[#C01218] text-white shadow-[0_0_30px_rgba(232,22,27,0.35)]'
                      }`}
                    >
                      {addedToCart
                        ? <><Check size={17} /> Added!</>
                        : <><ShoppingCart size={17} /> Add to Cart</>}
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
                      className={`w-14 h-14 flex items-center justify-center rounded-xl border transition-all ${
                        wishlisted ? 'bg-wu-red border-wu-red text-white' : 'border-border text-foreground/40 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      <Heart size={19} fill={wishlisted ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 flex items-center justify-center gap-2 border border-green-500/30 text-green-600 dark:text-green-400 font-display font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-green-500/10 transition-all"
                  >
                    <MessageCircle size={14} /> Order via WhatsApp
                  </a>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: '3M Certified' },
                  { icon: RotateCcw, label: 'No Glue Left' },
                  { icon: Truck, label: 'Ships Pan-India' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-2 p-4 bg-foreground/[0.02] border border-border rounded-2xl">
                    <Icon size={16} className="text-wu-red" />
                    <span className="font-mono text-[8px] text-foreground/40 tracking-widest uppercase leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RED MARKETING BANNER ─── */}
      {product.marketingTagline && (
        <div className="bg-wu-red py-5 mt-6">
          <p className="text-center font-display font-black text-xl sm:text-2xl text-white tracking-tight uppercase">
            {product.marketingTagline}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

        {/* ─── WHAT'S INCLUDED ─── */}
        {product.kitIncludes && product.kitIncludes.length > 0 && (
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                  <span className="w-6 h-px bg-wu-red" /> In The Box
                </p>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground uppercase tracking-tighter leading-none mb-10">
                  What&apos;s <br /><span className="text-wu-red">Included?</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.kitIncludes.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-foreground/[0.03] border border-border rounded-xl group hover:border-wu-red/30 transition-all">
                      <div className="w-6 h-6 rounded-full bg-wu-red/10 border border-wu-red/30 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-wu-red" />
                      </div>
                      <span className="font-body text-sm text-foreground/60 group-hover:text-foreground transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-border">
                <Image
                  src={product.images[1] || product.images[0]}
                  alt="Kit Contents"
                  fill
                  className="object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <p className="font-mono text-[10px] text-wu-red tracking-widest uppercase mb-2">Visual Mockup Only</p>
                  <p className="font-display font-black text-2xl text-foreground uppercase">Full Body Kit</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ─── WHY WEARUP ─── */}
        {product.whyChoose && product.whyChoose.length > 0 && (
          <ScrollReveal direction="up">
            <div className="border-t border-border pt-16">
              <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-wu-red" /> Why Us
              </p>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground uppercase tracking-tighter mb-14 leading-none">
                Why <span className="text-wu-red">WearUp?</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.whyChoose.map((item, i) => {
                  const Icon = iconMap[item.icon] || Shield;
                  return (
                    <div key={i} className="p-7 bg-foreground/[0.02] border border-border rounded-3xl hover:border-wu-red/30 transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-wu-red/10 border border-wu-red/20 flex items-center justify-center mb-5 group-hover:bg-wu-red/20 transition-colors">
                        <Icon size={20} className="text-wu-red" />
                      </div>
                      <h3 className="font-display font-black text-base text-foreground uppercase mb-3 tracking-tight">{item.title}</h3>
                      <p className="font-body text-sm text-foreground/50 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ─── INSTALLATION GUIDE ─── */}
        {product.installationSteps && product.installationSteps.length > 0 && (
          <ScrollReveal direction="up">
            <div className="border-t border-border pt-16">
              <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-wu-red" /> DIY Friendly
              </p>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground uppercase tracking-tighter mb-14 leading-none">
                Installation <span className="text-wu-red">Guide</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-0 relative">
                {product.installationSteps.map((step, i) => (
                  <div key={i} className="flex gap-6 relative pb-10">
                    {/* Vertical connector line */}
                    {i % 2 === 0 && i < product.installationSteps!.length - 1 && (
                      <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-wu-red/50 to-transparent" />
                    )}
                    <div className="w-12 h-12 bg-wu-red flex items-center justify-center font-mono text-sm font-black text-white flex-shrink-0 rounded-2xl z-10 shadow-[0_0_20px_rgba(232,22,27,0.3)] border border-border/10">
                      {step.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-display font-black text-lg text-foreground uppercase mb-2 tracking-tight">{step.title}</h3>
                      <p className="font-body text-sm text-foreground/50 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro installation CTA */}
              <div className="mt-4 p-8 bg-wu-red/5 border border-wu-red/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="font-display font-black text-xl text-foreground uppercase mb-1">Need professional installation?</p>
                  <p className="font-body text-sm text-foreground/50">Book a professional wrap fitting at our studio. We cover the entire process.</p>
                </div>
                <Link
                  href="/services/bike-wrapping"
                  className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-wu-red text-white font-display font-bold text-xs tracking-widest uppercase rounded-full hover:bg-wu-red/90 transition-all shadow-[0_0_20px_rgba(232,22,27,0.3)] whitespace-nowrap"
                >
                  <Phone size={13} /> Book a Service
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ─── SPECS ─── */}
        <ScrollReveal direction="up">
          <div className="border-t border-border pt-16">
            <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-wu-red" /> Specifications
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground uppercase tracking-tighter mb-10 leading-none">
              Product <span className="text-wu-red">Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.specs.map((spec, i) => (
                <div key={i} className="p-6 bg-foreground/[0.02] border border-border rounded-2xl group hover:bg-foreground/[0.04] transition-colors">
                  <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-2">{spec.label}</p>
                  <p className="font-display font-bold text-foreground text-base tracking-tight">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ─── RELATED PRODUCTS ─── */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 border-t border-border pt-16">
          <ScrollReveal direction="up">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-4">More Kits</p>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground tracking-tighter uppercase leading-none">You May Also Like</h2>
              </div>
              <Link href="/shop/graphic-kits" className="hidden sm:flex items-center gap-2 text-foreground/40 hover:text-foreground font-display font-bold text-xs tracking-[0.2em] uppercase transition-colors group">
                View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p, i) => (
              <ScrollReveal key={p.id} direction="up" delay={i * 0.08}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
