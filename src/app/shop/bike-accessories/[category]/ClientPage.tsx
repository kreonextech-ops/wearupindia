'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, ShoppingCart, Check, Shield, Truck, ChevronRight, Share2, Zap, Info, MessageCircle, Settings, Box, Droplet, Activity, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, Product } from '@/data';
import { useStore } from '@/lib/store-context';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { params: { category: string } };

const getProductSpecifications = (subItem: string | undefined) => {
  const normalized = subItem?.toLowerCase() || '';

  const maps: Record<string, any> = {
    'additives': {
      specs: [
        { title: 'Combustion Boost', desc: 'Optimizes fuel burn for smoother acceleration.', icon: Zap },
        { title: 'Engine Clean', desc: 'Removes carbon deposits from valves and injectors.', icon: Shield },
        { title: 'Fuel Economy', desc: 'Improves mileage by ensuring efficient combustion.', icon: Activity },
        { title: 'Easy Pour', desc: 'Designed for quick, mess-free DIY application.', icon: Check },
      ],
      quote: '"Restore lost power and protect your engine. Engineered to counter the effects of low-quality fuels and keep your machine running at its absolute peak."'
    },
    'coolant': {
      specs: [
        { title: 'Anti-Boil', desc: 'Prevents overheating during intense rides and traffic.', icon: Activity },
        { title: 'Anti-Freeze', desc: 'Maintains optimal flow in extreme cold weather.', icon: Droplet },
        { title: 'Corrosion Shield', desc: 'Protects radiator and water pump from rust.', icon: Shield },
        { title: 'Ready to Use', desc: 'Pre-mixed formula, no distilled water needed.', icon: Check },
      ],
      quote: '"Keep your engine running cool under the harshest conditions. Formulated for maximum thermal stability so you can push your bike to the limits safely."'
    },
    'engine oil': {
      specs: [
        { title: 'Friction Reduction', desc: 'Smooths gear shifts and reduces engine noise.', icon: Zap },
        { title: 'Wear Protection', desc: 'Advanced additives prevent premature engine wear.', icon: Shield },
        { title: 'Thermal Stability', desc: 'Maintains viscosity under extreme racing heat.', icon: Activity },
        { title: 'OEM Approved', desc: 'Meets and exceeds global manufacturer standards.', icon: Check },
      ],
      quote: '"The lifeblood of your motorcycle. Premium synthetic blend that delivers unmatched protection, smoother shifts, and uncompromising performance on every ride."'
    },
    'crashguard': {
      specs: [
        { title: 'Heavy-Duty Build', desc: 'High-tensile steel construction for maximum impact resistance.', icon: Shield },
        { title: 'Direct Fit', desc: 'Precision-engineered for easy, bolt-on installation.', icon: Settings },
        { title: 'Weatherproof', desc: 'Premium powder-coated finish protects against rust.', icon: Droplet },
        { title: 'Tested Tough', desc: 'Rigorously tested to withstand drops and slides.', icon: Check },
      ],
      quote: '"Armor your ride against the unexpected. Over-engineered to take the hit so your bike doesn\'t have to. Ride with absolute peace of mind."'
    },
    'lights': {
      specs: [
        { title: 'High Lumen Output', desc: 'Intense beams for crystal-clear night time visibility.', icon: Zap },
        { title: 'IP68 Waterproof', desc: 'Fully sealed housing to survive heavy monsoons.', icon: Droplet },
        { title: 'Plug & Play', desc: 'Designed for safe integration with your bike\'s electricals.', icon: Settings },
        { title: 'Durable Housing', desc: 'Aircraft-grade aluminum body for superior heat dissipation.', icon: Shield },
      ],
      quote: '"Turn night into day. Built for the hardcore tourer, our lighting solutions cut through darkness, fog, and rain, ensuring you always see what\'s coming next."'
    },
    'saddle bag': {
      specs: [
        { title: 'Maximum Capacity', desc: 'Smartly designed compartments for long tours.', icon: Box },
        { title: 'Weatherproof', desc: 'Keeps your gear dry and secure through rain.', icon: Droplet },
        { title: 'Secure Mounting', desc: 'Anti-vibration straps keep luggage stable at high speeds.', icon: Shield },
        { title: 'Durable Materials', desc: 'Tear-resistant fabrics and robust hardware.', icon: Check },
      ],
      quote: '"Pack up and chase the horizon. Designed for the long haul, our luggage systems keep your essentials secure, balanced, and protected from the elements."'
    },
    'spark plug': {
      specs: [
        { title: 'Iridium Core', desc: 'Extremely durable center electrode for maximum lifespan.', icon: Zap },
        { title: 'Better Combustion', desc: 'Concentrated spark ensures complete fuel burn and more power.', icon: Activity },
        { title: 'Cold Starts', desc: 'Requires lower voltage to spark, guaranteeing instant starts.', icon: Check },
        { title: 'Fuel Efficiency', desc: 'Consistent ignition improves overall mileage and throttle response.', icon: Shield },
      ],
      quote: '"Experience the power of Iridium. These premium spark plugs deliver unparalleled ignition efficiency, ensuring instant starts, crisper throttle response, and maximum power out of every drop of fuel."'
    }
  };

  for (const key of Object.keys(maps)) {
    if (normalized.includes(key)) {
      return maps[key];
    }
  }

  if (normalized.includes('guard') || normalized.includes('slider') || normalized.includes('grill') || normalized.includes('stay')) {
    return maps['crashguard'];
  }
  if (normalized.includes('bag') || normalized.includes('box')) {
    return maps['saddle bag'];
  }
  if (normalized.includes('light') || normalized.includes('switch') || normalized.includes('harness')) {
    return maps['lights'];
  }
  if (normalized.includes('oil') || normalized.includes('lube') || normalized.includes('cleaner') || normalized.includes('filter')) {
    return maps['engine oil'];
  }

  return {
    specs: [
      { title: 'Premium Quality', desc: 'Crafted from top-tier materials for long-lasting durability.', icon: Star },
      { title: 'Perfect Fit', desc: 'Precision-engineered to seamlessly integrate with your motorcycle.', icon: Settings },
      { title: 'Weather Resistant', desc: 'Built to withstand sun, rain, and everything in between.', icon: Droplet },
      { title: 'Rider Approved', desc: 'Tested and trusted by the riding community across India.', icon: Check },
    ],
    quote: '"Elevate your riding experience. Every accessory we offer is handpicked for its exceptional quality, functionality, and ability to make your journey better."'
  };
};

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
                    className="object-contain"
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
                    <Image src={img} alt="" fill className="object-contain" />
                  </button>
                ))}
              </div>
            )}
            
            {/* WhatsApp Query Button */}
            <a 
              href={`https://wa.me/919093543071?text=Hi%20WearUp!%20I'd%20like%20to%20know%20more%20about%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-3 w-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 py-4 rounded-2xl transition-all duration-300 font-display font-bold uppercase tracking-widest text-xs sm:text-sm"
            >
              <MessageCircle size={18} />
              Need more info? Message us on WhatsApp
            </a>

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

            {/* Product Specifications & Quote */}
            {(() => {
              const specData = getProductSpecifications((product as any).meta_data?.sub_item);
              return (
                <div className="pt-10 border-t border-border mt-10">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Info size={20} className="text-wu-red" /> 
                    Product Specifications
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specData.specs.map((item: any, i: number) => (
                      <div key={i} className="p-5 border border-border rounded-2xl hover:border-wu-red/30 transition-colors bg-muted/5">
                        <div className="w-8 h-8 rounded-lg bg-wu-red/10 text-wu-red flex items-center justify-center mb-3">
                          <item.icon size={16} />
                        </div>
                        <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-muted/30 rounded-2xl">
                    <p className="text-sm text-muted-foreground leading-relaxed italic whitespace-pre-wrap">
                      {product.description || specData.quote}
                    </p>
                  </div>
                </div>
              );
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

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
                    <span className={product.inStock ? 'text-wu-red font-bold' : 'text-muted-foreground'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <span className="text-foreground/40 border-l border-border pl-4">Free delivery on orders of ₹5,000 or more</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
                    <span className="text-foreground/60 border border-border px-3 py-1 rounded-full bg-foreground/[0.02]">
                      Fits: {(product as any).meta_data?.bike_compatibility === 'specific' && (product as any).meta_data?.compatible_bikes 
                        ? (product as any).meta_data.compatible_bikes 
                        : 'Universal (All Bikes)'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Cart */}
              <div className="bg-foreground/[0.03] border border-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Zap size={100} className="text-wu-red" />
                </div>
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="font-display font-black text-4xl sm:text-5xl text-foreground tracking-tighter">
                    {(product as any).meta_data?.price_type === 'range' && (product as any).meta_data?.price_max
                      ? `${formatPrice(product.price)} - ${formatPrice((product as any).meta_data.price_max)}`
                      : formatPrice(product.price)
                    }
                  </span>
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


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
