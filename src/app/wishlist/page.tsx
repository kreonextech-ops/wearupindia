'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/data';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <Heart size={64} className="text-[#2a2a2a] mx-auto mb-6" />
          <h1 className="font-display font-black text-4xl text-white mb-4">WISHLIST IS EMPTY</h1>
          <p className="font-body text-[#555] mb-8">Save items you love and come back to them later.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#B81015] transition-colors"
          >
            Browse Gear <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-2">// Saved Items</p>
          <h1 className="font-display font-black text-5xl text-white">WISHLIST ({wishlist.length})</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlist.map(product => (
            <div key={product.id} className="bg-[#111] border border-[#1a1a1a] group relative flex flex-col">
              {/* Image */}
              <Link href={`/shop/${product.category}/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[#181818]">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <button
                  onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-[#E8161B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={13} className="text-white" />
                </button>
              </Link>

              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <p className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-1">
                    {product.category.replace('-', ' & ')}
                  </p>
                  <Link href={`/shop/${product.category}/${product.slug}`}>
                    <h3 className="font-display font-bold text-base text-white hover:text-[#E8161B] transition-colors line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1a1a1a]">
                  <div>
                    <span className="font-display font-black text-lg text-white">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="font-body text-xs text-[#444] line-through ml-2">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 bg-[#E8161B] hover:bg-[#B81015] text-white font-display font-bold text-[10px] tracking-wider uppercase px-3 py-2 transition-colors"
                  >
                    <ShoppingCart size={12} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
