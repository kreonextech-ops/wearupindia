'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, TrendingDown, Users, Package, ShoppingCart,
  Activity, Clock, CheckCircle2, XCircle, Loader2, ArrowUpRight, Minus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  fetchDashboardStats, fetchRecentOrders, fetchTopProducts,
  DashboardStats, RecentOrder, TopProduct,
  TimeRange, pctChange, formatINR
} from '@/lib/analytics';
import SalesTrendChart from '@/components/admin/SalesTrendChart';
import CategorySalesBreakdown from '@/components/admin/CategorySalesBreakdown';

const RANGE_TABS: { label: string; value: TimeRange }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
  { label: 'Overall', value: 'overall' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  processing: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

function StatCard({
  label, value, icon: Icon, change, isUp, loading, delay = 0
}: {
  label: string; value: string; icon: any; change: string; isUp: boolean; loading: boolean; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl relative overflow-hidden group hover:border-[#E8161B]/30 transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-[#E8161B]/10 group-hover:text-[#E8161B] transition-all duration-500">
          <Icon size={18} />
        </div>
        {!loading && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-mono font-bold ${
            change === '0%' || change === '0' ? 'text-white/30 bg-white/5 border-white/10' :
            isUp ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'
          }`}>
            {change === '0%' || change === '0' ? <Minus size={10} /> : isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {change}
          </div>
        )}
      </div>
      <p className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-2">{label}</p>
      {loading ? (
        <div className="h-7 w-24 bg-white/5 rounded animate-pulse" />
      ) : (
        <p className="font-display font-black text-2xl text-white group-hover:text-[#E8161B] transition-colors duration-500">{value}</p>
      )}
      {/* BG Icon */}
      <div className="absolute bottom-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
        <Icon size={72} />
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [range, setRange] = useState<TimeRange>('month');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    setLoading(true);
    const [statsData, ordersData, productsData] = await Promise.all([
      fetchDashboardStats(supabase, range),
      fetchRecentOrders(supabase),
      fetchTopProducts(supabase, range),
    ]);
    setStats(statsData);
    setRecentOrders(ordersData);
    setTopProducts(productsData);
    setLoading(false);
  }, [range]);

  useEffect(() => { loadData(); }, [loadData]);

  const revChange = stats ? pctChange(stats.totalRevenue, stats.prevRevenue) : { value: '0%', isUp: true };
  const ordersChange = stats ? pctChange(stats.totalOrders, stats.prevOrders) : { value: '0%', isUp: true };
  const custChange = stats ? pctChange(stats.totalCustomers, stats.prevCustomers) : { value: '0%', isUp: true };

  const statCards = [
    {
      label: 'Revenue',
      value: stats ? formatINR(stats.totalRevenue) : '₹0',
      icon: TrendingUp,
      change: revChange.value,
      isUp: revChange.isUp,
    },
    {
      label: 'Orders Received',
      value: stats ? stats.totalOrders.toString() : '0',
      icon: ShoppingCart,
      change: ordersChange.value,
      isUp: ordersChange.isUp,
    },
    {
      label: 'Orders Pending',
      value: stats ? stats.pendingOrders.toString() : '0',
      icon: Clock,
      change: 'Needs Action',
      isUp: false,
    },
    {
      label: 'Orders Completed',
      value: stats ? (stats.completedOrders || 0).toString() : '0',
      icon: CheckCircle2,
      change: 'Delivered',
      isUp: true,
    },
  ];

  function timeLabel(r: TimeRange) {
    if (r === 'today') return 'vs. Yesterday';
    if (r === 'week') return 'vs. Last Week';
    if (r === 'month') return 'vs. Last Month';
    if (r === 'year') return 'vs. Last Year';
    return 'All Time';
  }

  return (
    <div className="space-y-10">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-60">// Admin Overview</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Dashboard</h1>
          <p className="font-mono text-[10px] text-white/20 tracking-widest mt-2 uppercase">{timeLabel(range)}</p>
        </div>
        {/* Global Time Filter */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          {RANGE_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setRange(t.value)}
              className={`px-4 py-2 rounded-lg font-mono text-[10px] tracking-widest uppercase transition-all duration-200 ${
                range === t.value
                  ? 'bg-[#E8161B] text-white shadow-[0_2px_10px_rgba(232,22,27,0.4)]'
                  : 'text-white/30 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} loading={loading} delay={i * 0.08} />
        ))}
      </div>

      {/* ─── SALES TREND CHART ─── */}
      <SalesTrendChart initialRange={range} />

      {/* ─── CATEGORY SALES BREAKDOWN ─── */}
      <CategorySalesBreakdown />

      {/* ─── BOTTOM 2-COL ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-[#E8161B]" />
              <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">Recent Orders</h3>
            </div>
            <a href="/admin/orders" className="font-mono text-[9px] text-white/30 hover:text-[#E8161B] tracking-widest uppercase flex items-center gap-1 transition-colors">
              View All <ArrowUpRight size={12} />
            </a>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart size={32} className="text-white/10 mb-3" />
              <p className="font-mono text-[10px] text-white/20 tracking-widest uppercase">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group hover:pl-2 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#E8161B]/10 flex items-center justify-center text-[#E8161B] flex-shrink-0">
                      <ShoppingCart size={13} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase">{order.user_email ?? 'Customer'}</p>
                      <p className="font-display font-bold text-sm text-white truncate">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-widest ${STATUS_COLORS[order.status] ?? 'text-white/30 bg-white/5 border-white/10'}`}>
                      {order.status}
                    </span>
                    <p className="font-display font-bold text-sm text-white">{formatINR(order.total_amount)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package size={18} className="text-[#E8161B]" />
              <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">Top Products</h3>
            </div>
            <a href="/admin/products" className="font-mono text-[9px] text-white/30 hover:text-[#E8161B] tracking-widest uppercase flex items-center gap-1 transition-colors">
              View All <ArrowUpRight size={12} />
            </a>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package size={32} className="text-white/10 mb-3" />
              <p className="font-mono text-[10px] text-white/20 tracking-widest uppercase">No sales data for this period</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((prod, i) => (
                <motion.div
                  key={prod.slug}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group hover:pr-2 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/30 font-display font-black text-xs flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase">{prod.category}</p>
                      <p className="font-display font-bold text-sm text-white truncate">{prod.name}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-display font-bold text-sm text-white">{formatINR(prod.revenue)}</p>
                    <p className="font-mono text-[9px] text-white/30">{prod.units} units</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
