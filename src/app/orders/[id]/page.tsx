'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle2, XCircle, Clock, MapPin, Receipt, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { formatINR } from '@/lib/analytics';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; step: number }> = {
  pending:    { label: 'Order Placed', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Clock, step: 1 },
  processing: { label: 'Processing', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Package, step: 2 },
  shipped:    { label: 'Shipped', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Truck, step: 3 },
  delivered:  { label: 'Delivered', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: CheckCircle2, step: 4 },
  cancelled:  { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle, step: 0 },
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadOrder() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();

      if (orderErr || !orderData) {
        setError('Order not found or you do not have permission to view it.');
        setLoading(false);
        return;
      }

      setOrder(orderData);

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*, products(*)')
        .eq('order_id', orderData.id);

      setItems(itemsData || []);
      setLoading(false);
    }
    loadOrder();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8161B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <XCircle size={48} className="text-[#E8161B] mb-6" />
        <h1 className="font-display font-black text-3xl text-white uppercase tracking-widest mb-4">Order Not Found</h1>
        <p className="font-mono text-sm text-[#888] max-w-md mb-8">{error}</p>
        <Link href="/profile" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-display font-bold uppercase tracking-widest text-xs transition-all">
          Back to Profile
        </Link>
      </div>
    );
  }

  const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const currentStep = sc.step;
  const isCancelled = order.status === 'cancelled';
  const addr = order.shipping_address || {};
  
  // Extract tracking info if saved by admin
  const trackingProvider = addr.tracking_provider;
  const trackingNumber = addr.tracking_number;

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/profile" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest mb-8">
          <ArrowLeft size={14} /> Back to Profile
        </Link>

        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8161B]/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2">// Order Details</p>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="font-mono text-[10px] text-[#888] tracking-widest mt-2 uppercase">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${sc.color}`}>
                <sc.icon size={16} />
                <span className="font-display font-bold text-[10px] uppercase tracking-widest">{sc.label}</span>
              </div>
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                order.payment_status === 'paid' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
              }`}>
                <CreditCard size={16} />
                <span className="font-display font-bold text-[10px] uppercase tracking-widest">{order.payment_status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        {!isCancelled && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl mb-8">
            <h2 className="font-display font-black text-xl text-white tracking-widest uppercase mb-8">Order Status</h2>
            <div className="relative">
              {/* Line */}
              <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/5">
                <div 
                  className="h-full bg-[#E8161B] transition-all duration-1000" 
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }} 
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {[
                  { step: 1, label: 'Order Placed', icon: Clock },
                  { step: 2, label: 'Processing', icon: Package },
                  { step: 3, label: 'Shipped', icon: Truck },
                  { step: 4, label: 'Delivered', icon: CheckCircle2 },
                ].map((s) => {
                  const isActive = currentStep >= s.step;
                  const Icon = s.icon;
                  return (
                    <div key={s.step} className="flex flex-col items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 border-4 border-[#050505] ${
                        isActive ? 'bg-[#E8161B] text-white shadow-[0_0_20px_rgba(232,22,27,0.4)]' : 'bg-[#222] text-[#666]'
                      }`}>
                        <Icon size={16} />
                      </div>
                      <span className={`font-display font-bold text-[10px] uppercase tracking-widest text-center max-w-[80px] ${
                        isActive ? 'text-white' : 'text-[#666]'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking Info if shipped */}
            {(currentStep >= 3 && trackingProvider) && (
              <div className="mt-8 pt-6 border-t border-white/5 bg-green-500/5 border-l-2 border-l-green-500 rounded-r-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] text-green-400/60 uppercase tracking-widest mb-1">Shipping Details</p>
                  <p className="font-display font-bold text-sm text-green-400 uppercase tracking-wider">Shipped via {trackingProvider}</p>
                </div>
                {trackingNumber && (
                  <div className="bg-black/50 border border-green-500/20 px-4 py-2 rounded-lg">
                    <p className="font-mono text-[9px] text-green-400/60 uppercase tracking-widest mb-1">Tracking Number</p>
                    <p className="font-mono text-sm text-green-400 tracking-wider select-all">{trackingNumber}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display font-black text-xl text-white tracking-widest uppercase flex items-center gap-2">
              <Package size={20} className="text-[#E8161B]" /> Items in Order
            </h2>
            
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-colors">
                  <div className="w-20 h-20 bg-black rounded-xl overflow-hidden relative shrink-0">
                    {item.products?.images?.[0] ? (
                      <Image src={item.products.images[0]} alt={item.products.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="text-white/20" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.products?.slug}`} className="font-display font-bold text-sm text-white uppercase tracking-wider hover:text-[#E8161B] transition-colors line-clamp-1">
                      {item.products?.name || 'Unknown Product'}
                    </Link>
                    <p className="font-mono text-[10px] text-[#888] mt-1">QTY: {item.quantity} × {formatINR(item.price_at_time)}</p>
                    
                    {/* Render Variants if exists */}
                    {item.variant_options && Object.keys(item.variant_options).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(item.variant_options).map(([k, v]) => (
                          <span key={k} className="font-mono text-[8px] bg-white/5 text-white/60 px-2 py-0.5 rounded uppercase border border-white/5">
                            {k}: {v as string}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-black text-lg text-white">{formatINR(item.quantity * item.price_at_time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h2 className="font-display font-black text-sm text-white tracking-widest uppercase flex items-center gap-2 mb-6">
                <Receipt size={16} className="text-[#E8161B]" /> Order Summary
              </h2>
              <div className="space-y-3 font-mono text-[10px] uppercase tracking-widest text-[#888]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatINR(order.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="text-white">Included</span>
                </div>
                <div className="pt-3 mt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="font-display font-black text-xs text-white">Total</span>
                  <span className="font-display font-black text-2xl text-[#E8161B]">{formatINR(order.total_amount)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h2 className="font-display font-black text-sm text-white tracking-widest uppercase flex items-center gap-2 mb-6">
                <MapPin size={16} className="text-[#E8161B]" /> Shipping Info
              </h2>
              <div className="space-y-1 font-mono text-[10px] text-[#888] uppercase tracking-wider">
                <p className="font-bold text-white mb-2">{addr.full_name}</p>
                <p>{addr.email}</p>
                <p>{addr.phone}</p>
                <div className="h-2" />
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.zip}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
