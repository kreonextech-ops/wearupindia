'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { Product, formatPrice } from '@/data';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
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
      className="group relative flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_rgba(232,22,27,0.15)]"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8161B]/0 to-[#E8161B]/0 group-hover:to-[#E8161B]/10 transition-colors duration-500 delay-100 z-0" />

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#111] z-10 p-4">
        <Link href={`/shop/${product.category}/${product.slug}`} className="block relative w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover rounded-xl transition-transform duration-700 ease-[0.25,0.46,0.45,0.94] group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          {product.badge && (
            <span className="font-display font-bold text-[10px] px-3 py-1 bg-[#E8161B] text-white tracking-widest uppercase rounded-full shadow-lg shadow-[#E8161B]/20">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="font-display font-bold text-[10px] px-3 py-1 bg-white/10 backdrop-blur-md text-white tracking-widest uppercase rounded-full border border-white/10">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
          }}
          className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-md border ${
            wishlisted
              ? 'bg-[#E8161B] border-[#E8161B] text-white shadow-[0_0_15px_rgba(232,22,27,0.5)]'
              : 'bg-black/40 border-white/10 text-white/70 hover:bg-white/10 hover:text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
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
            className="w-full py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-display font-bold text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-[#E8161B] hover:border-[#E8161B] transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group/btn"
          >
             <ShoppingCart size={14} className="group-hover/btn:-translate-x-1 transition-transform" /> Quick Add
          </button>
        </motion.div>
      </div>

      {/* Info Content */}
      <div className="p-6 flex flex-col gap-4 flex-1 relative z-10 bg-gradient-to-t from-[#0A0A0A] to-transparent">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[9px] text-[#E8161B] tracking-[0.3em] uppercase">
              {product.category.replace('-', ' & ')}
            </p>
            {/* Rating */}
            <div className="flex items-center gap-1.5 opacity-60">
              <Star size={10} className="text-[#E8161B] fill-[#E8161B]" />
              <span className="font-mono text-[9px] text-white tracking-widest">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <Link href={`/shop/${product.category}/${product.slug}`} className="block group/link">
            <h3 className="font-display font-bold text-lg text-white/90 leading-snug group-hover/link:text-[#E8161B] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="font-mono text-[10px] text-[#555] line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="font-display font-black text-xl text-white tracking-tight">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
