'use client';

import { useState, useEffect } from 'react';
import { Package, BarChart3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { TimeRange, formatINR } from '@/lib/analytics';
import { categories as FRONTEND_CATEGORIES } from '@/data';

const TIME_TABS: { label: string; value: TimeRange }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
  { label: 'Overall', value: 'overall' },
];

// Colors per category slug — matched to the shop page's accent colours
const CATEGORY_COLORS: Record<string, string> = {
  'graphic-kits':    '#E8161B',
  'bike-accessories': '#F97316',
  'keychains':       '#A855F7',
  'tshirts':         '#22C55E',
  'hoodies':         '#3B82F6',
};

interface CategorySalesRow {
  slug: string;
  name: string;
  isComingSoon: boolean;
  revenue: number;
  orders: number;
  units: number;
}

function getDateFilter(range: TimeRange): string | null {
  const now = new Date();
  if (range === 'overall') return null;
  const days = range === 'today' ? 0 : range === 'week' ? 7 : range === 'month' ? 30 : 365;
  const from = new Date(now);
  if (range === 'today') {
    from.setHours(0, 0, 0, 0);
  } else {
    from.setDate(now.getDate() - days);
  }
  return from.toISOString();
}

export default function CategorySalesBreakdown() {
  const [range, setRange] = useState<TimeRange>('month');
  const [data, setData] = useState<CategorySalesRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const fromDate = getDateFilter(range);

      // Get all DB categories matching the frontend slugs
      const frontendSlugs = FRONTEND_CATEGORIES.map(c => c.slug);
      const { data: dbCats } = await supabase
        .from('categories')
        .select('id, slug')
        .in('slug', frontendSlugs);

      const catIdMap: Record<string, string> = {};
      for (const c of (dbCats ?? [])) catIdMap[c.slug] = c.id;

      // Build results — always one row per frontend category, in the same order
      const rows: CategorySalesRow[] = await Promise.all(
        FRONTEND_CATEGORIES.map(async (fc) => {
          const catId = catIdMap[fc.slug];
          if (!catId) {
            return { slug: fc.slug, name: fc.name, isComingSoon: !!fc.isComingSoon, revenue: 0, orders: 0, units: 0 };
          }

          // Get products for this category
          const { data: products } = await supabase
            .from('products')
            .select('id')
            .eq('category_id', catId);

          if (!products?.length) {
            return { slug: fc.slug, name: fc.name, isComingSoon: !!fc.isComingSoon, revenue: 0, orders: 0, units: 0 };
          }

          const productIds = products.map(p => p.id);

          // Get matching order items (via inner join with orders table)
          let q = supabase
            .from('order_items')
            .select('quantity, price_at_purchase, order_id, orders!inner(created_at, payment_status)')
            .in('product_id', productIds)
            .eq('orders.payment_status', 'paid');

          if (fromDate) q = q.gte('orders.created_at', fromDate);

          const { data: items } = await q;

          const revenue = items?.reduce((s, i) => s + i.price_at_purchase * i.quantity, 0) ?? 0;
          const units = items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
          const orders = new Set(items?.map(i => i.order_id)).size;

          return { slug: fc.slug, name: fc.name, isComingSoon: !!fc.isComingSoon, revenue, orders, units };
        })
      );

      setData(rows);
      setLoading(false);
    };

    load();
  }, [range]);

  const totalRevenue = data.reduce((s, c) => s + c.revenue, 0);
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8161B]/10 border border-[#E8161B]/20 flex items-center justify-center">
            <BarChart3 size={18} className="text-[#E8161B]" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">Category Sales</h3>
            <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">Revenue Breakdown by Shop Category</p>
          </div>
        </div>
        {/* Time Range Tabs */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          {TIME_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setRange(t.value)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-widest uppercase transition-all duration-200 ${
                range === t.value
                  ? 'bg-[#E8161B] text-white shadow-[0_2px_8px_rgba(232,22,27,0.4)]'
                  : 'text-white/30 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Totals Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: formatINR(totalRevenue) },
          { label: 'Total Orders',  value: `${data.reduce((s, c) => s + c.orders, 0)}` },
          { label: 'Units Sold',    value: `${data.reduce((s, c) => s + c.units, 0)}`  },
        ].map(m => (
          <div key={m.label} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
            <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-1">{m.label}</p>
            <p className="font-display font-black text-lg text-white">{loading ? '—' : m.value}</p>
          </div>
        ))}
      </div>

      {/* Category Rows */}
      {loading ? (
        <div className="space-y-6">
          {FRONTEND_CATEGORIES.map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 w-40 bg-white/5 rounded" />
              <div className="h-2 bg-white/5 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((cat) => {
            const color = CATEGORY_COLORS[cat.slug] ?? '#6B7280';
            const pct = totalRevenue > 0 ? ((cat.revenue / totalRevenue) * 100).toFixed(1) : '0.0';
            const barW = maxRevenue > 0 ? (cat.revenue / maxRevenue) * 100 : 0;

            return (
              <div key={cat.slug} className="group">
                {/* Row header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="font-display font-bold text-sm text-white">
                      {cat.name}
                    </span>
                    {cat.isComingSoon && (
                      <span className="font-mono text-[8px] text-white/25 border border-white/10 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                        Coming Soon
                      </span>
                    )}
                    <span className="font-mono text-[9px] text-white/20">{pct}%</span>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden sm:block">
                      <p className="font-mono text-[9px] text-white/20 uppercase">Orders</p>
                      <p className="font-display font-bold text-sm text-white/50">{cat.orders}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-mono text-[9px] text-white/20 uppercase">Units</p>
                      <p className="font-display font-bold text-sm text-white/50">{cat.units}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] text-white/20 uppercase">Revenue</p>
                      <p className="font-display font-bold text-sm text-white">{formatINR(cat.revenue)}</p>
                    </div>
                  </div>
                </div>
                {/* Bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${barW}%`,
                      background: `linear-gradient(90deg, ${color}50, ${color})`,
                      boxShadow: `0 0 10px ${color}50`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      {!loading && (
        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
          {FRONTEND_CATEGORIES.map(cat => (
            <div key={cat.slug} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat.slug] ?? '#6B7280' }} />
              <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">{cat.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
