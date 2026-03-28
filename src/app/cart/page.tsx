'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/data';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();

  const shipping = cartTotal >= 499 ? 0 : 99;
  const gst = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + gst;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-[#2a2a2a] mx-auto mb-6" />
          <h1 className="font-display font-black text-4xl text-white mb-4">YOUR CART IS EMPTY</h1>
          <p className="font-body text-[#555] mb-8">Looks like you haven&apos;t added anything yet. Go explore.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#B81015] transition-colors"
          >
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-2">// Your Bag</p>
          <h1 className="font-display font-black text-5xl text-white">CART ({cart.length})</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-[#111] border border-[#1a1a1a]">
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-[#181818] overflow-hidden">
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-1">
                        {item.category.replace('-', ' & ')}
                      </p>
                      <Link href={`/shop/${item.category}/${item.slug}`}>
                        <h3 className="font-display font-bold text-base text-white hover:text-[#E8161B] transition-colors leading-tight">
                          {item.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#444] hover:text-[#E8161B] transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-[#2a2a2a]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center font-mono text-sm text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="font-display font-black text-lg text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-[#111] border border-[#1a1a1a] p-6 sticky top-24">
              <h2 className="font-display font-black text-xl text-white mb-6 pb-4 border-b border-[#1a1a1a]">ORDER SUMMARY</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="font-body text-[#666]">Subtotal</span>
                  <span className="font-display font-bold text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-body text-[#666]">GST (18%)</span>
                  <span className="font-display font-bold text-white">{formatPrice(gst)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-body text-[#666]">Shipping</span>
                  <span className={`font-display font-bold ${shipping === 0 ? 'text-green-500' : 'text-white'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {cartTotal < 499 && (
                  <p className="text-[10px] font-mono text-[#555]">
                    Add {formatPrice(499 - cartTotal)} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-[#1a1a1a] pt-4 mb-6">
                <span className="font-display font-black text-lg text-white">TOTAL</span>
                <span className="font-display font-black text-2xl text-[#E8161B]">{formatPrice(total)}</span>
              </div>

              {/* Promo */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] text-white placeholder-[#444] px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E8161B] transition-colors"
                />
                <button className="px-4 py-2 border border-[#2a2a2a] text-[#666] font-display font-bold text-xs uppercase hover:border-[#E8161B] hover:text-white transition-colors">
                  Apply
                </button>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase py-4 hover:bg-[#B81015] transition-colors"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </Link>

              <Link
                href="/shop"
                className="w-full flex items-center justify-center gap-3 border border-[#2a2a2a] text-[#888] font-display font-bold text-sm tracking-widest uppercase py-4 hover:text-white hover:border-[#444] transition-colors mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
