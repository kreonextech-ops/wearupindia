'use client';

import * as React from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, ShoppingCart, Check, Shield, Truck, 
  ChevronRight, Bike, Scissors, Droplets,
  MessageCircle, Info, Star, Zap
} from 'lucide-react';
import { formatPrice, Product } from '@/data';
import { useStore } from '@/lib/store-context';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { params: { slug: string } };

export default function GraphicKitProductPage({ params }: Props) {
  const [product, setProduct] = React.useState<Product | null>(null);
  const [related, setRelated] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const router = useRouter();
  
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [addedToCart, setAddedToCart] = React.useState(false);
  const [selectedFinish, setSelectedFinish] = React.useState('Glossy');
  const [selectedQuality, setSelectedQuality] = React.useState('Standard');
  const [selectedModel, setSelectedModel] = React.useState('');

  React.useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const { getProductBySlugAction, getProductsAction } = await import('@/app/admin/products/actions');
        const res = await getProductBySlugAction('graphic-kits', params.slug);
        
        if (res.success && res.data) {
          const p = res.data as unknown as Product;
          
          if (p.meta_data && !p.meta_data.compatible_models && p.meta_data.specs?.model) {
            p.meta_data.compatible_models = [p.meta_data.specs.model];
          }

          setProduct(p);
          
          const models = p.meta_data?.compatible_models || [];
          if (models.length > 0) setSelectedModel(models[0]);

          const relatedRes = await getProductsAction('graphic-kits');
          if (relatedRes.success && relatedRes.data) {
            setRelated((relatedRes.data as unknown as Product[])
              .filter(item => item.id !== p.id)
              .slice(0, 4)
            );
          }
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
      setIsLoading(false);
    }
    loadProduct();
  }, [params.slug]);

  const currentPrice = React.useMemo(() => {
    if (!product) return 0;
    const matrix = product.meta_data?.pricing_matrix;
    if (matrix) {
      let modelData = matrix[selectedModel];
      if (!modelData) {
        const modelKey = Object.keys(matrix).find(k => k.toLowerCase().trim() === selectedModel.toLowerCase().trim());
        if (modelKey) modelData = matrix[modelKey];
      }
      if (modelData) {
        const qualityKey = Object.keys(modelData).find(k => k.toLowerCase() === selectedQuality.toLowerCase()) || selectedQuality;
        const finishData = modelData[qualityKey];
        if (finishData) {
          const finishKey = Object.keys(finishData).find(k => k.toLowerCase() === selectedFinish.toLowerCase()) || selectedFinish;
          const priceValue = finishData[finishKey];
          if (priceValue) return Number(priceValue);
        }
      }
    }
    let fallbackPrice = product.price;
    if (selectedQuality.toLowerCase() === 'premium') fallbackPrice += 1000;
    if (selectedFinish.toLowerCase() === 'matte') fallbackPrice += 300;
    return fallbackPrice;
  }, [product, selectedModel, selectedQuality, selectedFinish]);

  const wishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, {
      model: selectedModel || undefined,
      finish: selectedFinish || undefined,
      quality: selectedQuality || undefined,
      price: currentPrice
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!addedToCart) {
      addToCart(product, quantity, {
        model: selectedModel || undefined,
        finish: selectedFinish || undefined,
        quality: selectedQuality || undefined,
        price: currentPrice
      });
    }
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-border border-t-wu-red rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Loading Product...</p>
      </div>
    );
  }

  if (error || !product) notFound();

  const discount = product?.originalPrice ? Math.round((1 - currentPrice / product.originalPrice) * 100) : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Navigation / Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-wu-red transition-colors">Home</Link>
          <ChevronRight size={12} className="opacity-30" />
          <Link href="/shop/graphic-kits" className="hover:text-wu-red transition-colors">Graphic Kits</Link>
          <ChevronRight size={12} className="opacity-30" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
          
          {/* Gallery Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted/30 border border-border group shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.badge && (
                  <span className="bg-wu-red text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                {discount && discount > 0 && (
                  <span className="bg-background text-foreground text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-border">
                    {discount}% Off
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 aspect-square rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === i ? 'border-wu-red' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Product Details / Features */}
            <div className="pt-10 border-t border-border mt-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Info size={20} className="text-wu-red" /> 
                Product Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Bubble-Free Technology', desc: 'Air-release vinyl for easy, bubble-free DIY installation.', icon: Check },
                  { title: 'Weather & UV Proof', desc: 'Special coating protects against fading and monsoon rains.', icon: Shield },
                  { title: 'Precision Cut', desc: 'Durable vinyl machine-cut for a perfect fit on your bike.', icon: Scissors },
                  { title: 'High Definition', desc: 'Sharp graphics with rich, long-lasting colors.', icon: Star },
                ].map((item, i) => (
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
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "Transform your ride with our high-quality Graphics Kit, crafted for riders who want standout looks with reliable performance in every condition. Built for Indian weather conditions from scorching heat to heavy rains."
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
                <p className="text-[10px] font-bold text-wu-red uppercase tracking-[0.2em] italic">// High-Performance Decals</p>
              </div>

              {/* Price & Selection Card */}
              <div className="bg-muted/10 border border-border rounded-3xl p-8 space-y-8 shadow-sm">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold">{formatPrice(currentPrice)}</span>
                  {product.originalPrice && product.originalPrice > currentPrice && (
                    <span className="text-lg text-muted-foreground line-through decoration-wu-red/50">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Model Selector */}
                  {product.meta_data?.compatible_models && product.meta_data.compatible_models.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Bike size={12} /> Select Bike Model
                      </label>
                      <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full h-14 px-6 rounded-xl border border-border bg-background font-bold text-sm focus:ring-2 focus:ring-wu-red/20 focus:border-wu-red transition-all appearance-none cursor-pointer"
                      >
                        {product.meta_data.compatible_models.map((m: string) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Options Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Finish Type</label>
                      <div className="flex p-1 bg-muted rounded-xl border border-border">
                        {['Glossy', 'Matte'].map(f => (
                          <button
                            key={f}
                            onClick={() => setSelectedFinish(f)}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                              selectedFinish === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Material Grade</label>
                      <div className="flex p-1 bg-muted rounded-xl border border-border">
                        {['Standard', 'Premium'].map(q => (
                          <button
                            key={q}
                            onClick={() => setSelectedQuality(q)}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                              selectedQuality === q ? 'bg-wu-red text-white shadow-md shadow-wu-red/20' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`h-16 flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all ${
                      addedToCart ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-foreground text-background hover:bg-wu-red hover:text-white shadow-lg'
                    }`}
                  >
                    {addedToCart ? <><Check size={18} /> In Cart</> : <><ShoppingCart size={18} /> Add to Cart</>}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                      className={`h-12 flex items-center justify-center gap-2 border rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                        wishlisted ? 'border-wu-red text-wu-red bg-wu-red/5' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
                      {wishlisted ? 'Saved' : 'Wishlist'}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="h-12 flex items-center justify-center gap-2 border border-wu-red/20 bg-wu-red/5 text-wu-red rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-wu-red hover:text-white transition-all"
                    >
                      <Zap size={14} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping Badges */}
              <div className="flex items-center justify-center gap-8 py-4 border-y border-border">
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                  <Truck size={18} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Ships Fast</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                  <Shield size={18} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div className="mt-32 pt-20 border-t border-border">
            <h2 className="text-2xl font-bold mb-12">More Popular Designs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
