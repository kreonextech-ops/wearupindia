'use client';

import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { useRouter } from 'next/navigation';
import { Product, formatPrice } from '@/data';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, user } = useStore();
  const router = useRouter();
  const wishlisted = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover="hover"
      className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border transition-all duration-500 hover:border-wu-red/50 hover:shadow-[0_0_40px_var(--wu-red-glow)]"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-wu-red/0 to-wu-red/0 group-hover:to-wu-red/5 transition-colors duration-500 delay-100 z-0" />

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted z-10 p-4">
        <Link href={product.category === 'graphic-kits' ? `/shop/graphic-kits/product/${product.slug}` : `/shop/${product.category}/${product.slug}`} className="block relative w-full h-full">
          <SafeImage
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover rounded-xl transition-transform duration-700 ease-[0.25,0.46,0.45,0.94] group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          {product.is_featured && (
            <span className="font-display font-bold text-[9px] px-2.5 py-1 bg-wu-red text-white tracking-widest uppercase rounded-md shadow-lg shadow-wu-red/20 border border-white/10">
              Featured
            </span>
          )}
          {product.isNew && (
            <span className="font-display font-bold text-[9px] px-2.5 py-1 bg-white text-black tracking-widest uppercase rounded-md shadow-lg border border-border">
              New Arrival
            </span>
          )}
          {product.badge && (
            <span className="font-display font-bold text-[10px] px-3 py-1 bg-wu-red text-white tracking-widest uppercase rounded-full shadow-lg shadow-wu-red/20">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="font-display font-bold text-[10px] px-3 py-1 bg-foreground/10 backdrop-blur-md text-foreground dark:text-white tracking-widest uppercase rounded-full border border-border">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!user) {
              alert("Please log in to manage your wishlist.");
              router.push('/login');
              return;
            }
            wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
          }}
          className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-md border ${
            wishlisted
              ? 'bg-wu-red border-wu-red text-white shadow-[0_0_15px_rgba(232,22,27,0.5)]'
              : 'bg-background/40 border-border text-foreground/70 hover:bg-foreground/10 hover:text-foreground opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          }`}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} className={wishlisted ? "scale-110" : "scale-100"} />
        </button>

        {/* Quick Add To Cart Overlay */}
        <motion.div 
          className="absolute bottom-6 left-6 right-6 z-20"
          variants={{
            hover: { y: 0, opacity: 1, pointerEvents: 'auto' },
            rest: { y: 20, opacity: 0, pointerEvents: 'none' }
          }}
          initial="rest"
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <button
            onClick={() => addToCart(product)}
            className="w-full py-4 bg-background/80 backdrop-blur-xl border border-border text-foreground font-display font-bold text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-wu-red hover:border-wu-red hover:text-white transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group/btn"
          >
             <ShoppingCart size={14} className="group-hover/btn:-translate-x-1 transition-transform" /> Add to Cart
          </button>
        </motion.div>
      </div>

      {/* Info Content */}
      <div className="p-6 flex flex-col gap-4 flex-1 relative z-10 bg-gradient-to-t from-card to-transparent">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[9px] text-wu-red tracking-[0.3em] uppercase">
              {product.category.replace('-', ' & ')}
            </p>
            {/* Rating */}
            <div className="flex items-center gap-1.5 opacity-60">
              <Star size={10} className="text-wu-red fill-wu-red" />
              <span className="font-mono text-[9px] text-foreground tracking-widest">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <Link href={product.category === 'graphic-kits' ? `/shop/graphic-kits/product/${product.slug}` : `/shop/${product.category}/${product.slug}`} className="block group/link">
            <h3 className="font-display font-bold text-lg text-foreground leading-snug group-hover/link:text-wu-red transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-border">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="font-mono text-[10px] text-muted-foreground line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="font-display font-black text-xl text-foreground tracking-tight">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
