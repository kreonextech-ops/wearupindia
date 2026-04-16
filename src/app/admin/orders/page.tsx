'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Package, Truck, CheckCircle2, XCircle, Clock, Eye, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatINR } from '@/lib/analytics';

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
        const { count } = await supabase
          .from('order_items')
          .select('*', { count: 'exact', head: true })
          .eq('order_id', o.id);
        return {
          ...o,
          user_email: o.profiles?.email ?? o.shipping_address?.email ?? '—',
          items_count: count ?? 0,
        };
      }));
      setOrders(withDetails);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
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

                    {/* Status Update Dropdown */}
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="appearance-none bg-white/5 border border-white/10 text-white/60 hover:border-[#E8161B]/50 hover:text-white rounded-lg px-3 py-2 font-mono text-[9px] uppercase tracking-widest cursor-pointer transition-all focus:outline-none focus:border-[#E8161B] pr-7 disabled:opacity-40"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
