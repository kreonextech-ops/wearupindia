'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Package, Truck, CheckCircle2, XCircle, Clock, Eye, ChevronDown, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatINR } from '@/lib/analytics';
import Link from 'next/link';

type OrderStatus = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  shipping_address: any;
  created_at: string;
  user_email?: string;
  items_count?: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'Pending',    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',  icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',        icon: Package },
  shipped:    { label: 'Shipped',    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',  icon: Truck },
  delivered:  { label: 'Delivered',  color: 'text-green-400 bg-green-400/10 border-green-400/20',     icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  color: 'text-red-400 bg-red-400/10 border-red-400/20',           icon: XCircle },
};

const FILTER_TABS: { label: string; value: OrderStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal State for Shipping
  const [shippingModalOrder, setShippingModalOrder] = useState<Order | null>(null);
  const [shippingProvider, setShippingProvider] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false });

    if (data) {
      // Get item counts per order
      const withDetails: Order[] = await Promise.all(data.map(async (o: any) => {
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('quantity, price_at_purchase, products(name, slug)')
          .eq('order_id', o.id);
        
        return {
          ...o,
          user_email: o.profiles?.email ?? o.shipping_address?.email ?? '—',
          items_count: itemsData ? itemsData.length : 0,
          items: itemsData || [],
        };
      }));
      setOrders(withDetails);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (order: Order, newStatus: string) => {
    if (newStatus === 'shipped') {
      setShippingModalOrder(order);
      setShippingProvider(order.shipping_address?.tracking_provider || '');
      setTrackingNumber(order.shipping_address?.tracking_number || '');
      return;
    }
    
    setUpdatingId(order.id);
    let updates: any = { status: newStatus, updated_at: new Date().toISOString() };
    await supabase.from('orders').update(updates).eq('id', order.id);
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...updates } : o));
    setUpdatingId(null);
  };

  const handleShippingSubmit = async () => {
    if (!shippingModalOrder) return;
    setUpdatingId(shippingModalOrder.id);
    
    const addr = shippingModalOrder.shipping_address || {};
    const updates = { 
      status: 'shipped', 
      updated_at: new Date().toISOString(),
      shipping_address: {
        ...addr,
        tracking_provider: shippingProvider || 'Not Specified',
        tracking_number: trackingNumber || ''
      }
    };
    
    await supabase.from('orders').update(updates).eq('id', shippingModalOrder.id);
    setOrders(prev => prev.map(o => o.id === shippingModalOrder.id ? { ...o, ...updates } : o));
    setUpdatingId(null);
    setShippingModalOrder(null);
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    setUpdatingId(orderId);
    await supabase.from('orders').update({ payment_status: newPaymentStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: newPaymentStatus } : o));
    setUpdatingId(null);
  };

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter;
    const matchSearch = !search
      || o.id.toLowerCase().includes(search.toLowerCase())
      || o.user_email?.toLowerCase().includes(search.toLowerCase())
      || o.shipping_address?.full_name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = Object.fromEntries(
    ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => [
      s, orders.filter(o => o.status === s).length
    ])
  );

  return (
    <div className="space-y-8">
      {/* Shipping Modal */}
      <AnimatePresence>
        {shippingModalOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShippingModalOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-black text-2xl text-white uppercase">Shipping Details</h2>
                <button onClick={() => setShippingModalOrder(null)} className="text-white/30 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] text-[#666] tracking-widest uppercase mb-1 block">Shipping Provider</label>
                  <input
                    type="text"
                    placeholder="e.g., India Post, DTDC"
                    value={shippingProvider}
                    onChange={e => setShippingProvider(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-white/10 text-white placeholder-[#444] px-4 py-2.5 font-mono text-xs focus:outline-none focus:border-[#E8161B] transition-colors rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-[#666] tracking-widest uppercase mb-1 block">Tracking Number / ID</label>
                  <input
                    type="text"
                    placeholder="e.g., AB123456789IN"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-white/10 text-white placeholder-[#444] px-4 py-2.5 font-mono text-xs focus:outline-none focus:border-[#E8161B] transition-colors rounded-lg"
                  />
                </div>

                <button
                  onClick={handleShippingSubmit}
                  disabled={updatingId === shippingModalOrder.id}
                  className="w-full flex items-center justify-center gap-2 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase py-3 rounded-xl hover:bg-[#B81015] transition-colors disabled:opacity-50 mt-4"
                >
                  {updatingId === shippingModalOrder.id ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save & Mark Shipped'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-60">// Order Management</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Orders</h1>
          <p className="font-mono text-[10px] text-white/20 tracking-widest mt-2 uppercase">{orders.length} total orders</p>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input
            type="text"
            placeholder="Search by ID, email, name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-6 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E8161B]/50 w-full md:w-72 transition-all"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`px-4 py-2 rounded-xl font-mono text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 ${
              filter === t.value
                ? 'bg-[#E8161B] text-white'
                : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'
            }`}
          >
            {t.label}
            {t.value !== 'all' && counts[t.value] !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                filter === t.value ? 'bg-white/20 text-white' : 'bg-white/10 text-white/40'
              }`}>
                {counts[t.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0A0A0A] border border-white/5 rounded-3xl text-center">
          <ShoppingCart size={40} className="text-white/10 mb-4" />
          <p className="font-display font-bold text-white/30 uppercase tracking-widest">No Orders Found</p>
          <p className="font-mono text-[10px] text-white/15 tracking-widest mt-2 uppercase">
            {filter !== 'all' ? `No ${filter} orders` : 'Orders will appear here once customers checkout'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const StatusIcon = sc.icon;
            const addr = order.shipping_address ?? {};

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group"
              >
                <div className="flex flex-wrap items-start gap-4 justify-between">
                  {/* Left: Order ID + Customer */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#E8161B]/10 flex items-center justify-center flex-shrink-0">
                      <StatusIcon size={16} className="text-[#E8161B]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-display font-black text-sm text-white">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-widest ${sc.color}`}>
                          {sc.label}
                        </span>
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-widest ${
                          order.payment_status === 'paid'
                            ? 'text-green-400 bg-green-400/10 border-green-400/20'
                            : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                        }`}>
                          {order.payment_status}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] text-white/30 mt-0.5">{order.user_email}</p>
                      {addr.full_name && (
                        <p className="font-mono text-[9px] text-white/20 mt-0.5">
                          {addr.full_name} · {addr.city}, {addr.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount + Date + Actions */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-mono text-[9px] text-white/20 uppercase">Items</p>
                      <p className="font-display font-bold text-sm text-white">{order.items_count}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[9px] text-white/20 uppercase">Amount</p>
                      <p className="font-display font-bold text-sm text-white">{formatINR(order.total_amount)}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="font-mono text-[9px] text-white/20 uppercase">Date</p>
                      <p className="font-display font-bold text-xs text-white/60">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </p>
                    </div>

                    {/* Status Update Dropdowns */}
                    <div className="flex flex-col gap-2 relative">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order, e.target.value)}
                          disabled={updatingId === order.id}
                          className="w-full appearance-none bg-white/5 border border-white/10 text-white/60 hover:border-[#E8161B]/50 hover:text-white rounded-lg px-3 py-2 font-mono text-[9px] uppercase tracking-widest cursor-pointer transition-all focus:outline-none focus:border-[#E8161B] pr-7 disabled:opacity-40"
                        >
                          <option value="pending" className="bg-[#0A0A0A] text-white">Pending</option>
                          <option value="processing" className="bg-[#0A0A0A] text-white">Processing</option>
                          <option value="shipped" className="bg-[#0A0A0A] text-white">Shipped</option>
                          <option value="delivered" className="bg-[#0A0A0A] text-white">Delivered</option>
                          <option value="cancelled" className="bg-[#0A0A0A] text-white">Cancelled</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <select
                          value={order.payment_status}
                          onChange={e => updatePaymentStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="w-full appearance-none bg-white/5 border border-white/10 text-white/60 hover:border-[#E8161B]/50 hover:text-white rounded-lg px-3 py-2 font-mono text-[9px] uppercase tracking-widest cursor-pointer transition-all focus:outline-none focus:border-[#E8161B] pr-7 disabled:opacity-40"
                        >
                          <option value="unpaid" className="bg-[#0A0A0A] text-white">Unpaid</option>
                          <option value="paid" className="bg-[#0A0A0A] text-white">Paid</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List (Clickable Product Links) */}
                {(order as any).items && (order as any).items.length > 0 && (
                  <div className="w-full mt-4 pt-4 border-t border-white/5">
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-3">Order Items</p>
                    <div className="space-y-2">
                      {(order as any).items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-2">
                          <div className="flex items-center gap-3">
                            <span className="font-display font-bold text-xs text-white/40">{item.quantity}x</span>
                            <Link 
                              href={`/admin/products?search=${item.products?.name}`} 
                              className="font-display font-bold text-sm text-white hover:text-[#E8161B] transition-colors"
                            >
                              {item.products?.name || 'Unknown Product'}
                            </Link>
                          </div>
                          <span className="font-mono text-xs text-white/60">{formatINR(item.price_at_purchase)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
