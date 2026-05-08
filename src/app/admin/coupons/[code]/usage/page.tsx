'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Receipt, Loader2, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type Usage = {
  id: string;
  order_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  order_total: number;
  discount_applied: number;
  used_at: string;
};

export default function CouponUsagePage({ params }: { params: { code: string } }) {
  const [usages, setUsages] = useState<Usage[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponInfo, setCouponInfo] = useState<any>(null);
  const supabase = createClient();
  const code = decodeURIComponent(params.code).toUpperCase();

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Fetch coupon info
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .single();
      setCouponInfo(coupon);

      // Fetch usages
      const { data } = await supabase
        .from('coupon_usages')
        .select('*')
        .eq('coupon_code', code)
        .order('used_at', { ascending: false });

      setUsages(data || []);
      setLoading(false);
    }
    load();
  }, [code]);

  const totalRevenue = usages.reduce((sum, u) => sum + (u.order_total || 0), 0);
  const totalDiscount = usages.reduce((sum, u) => sum + (u.discount_applied || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/5">
        <Link href="/admin/coupons" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-mono text-[9px] uppercase tracking-widest mb-4 transition-colors">
          <ArrowLeft size={12} /> Back to Coupons
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-1">// Coupon Analytics</p>
            <h1 className="font-display font-black text-4xl text-white tracking-tight uppercase">{code}</h1>
            {couponInfo?.influencer_name && (
              <p className="font-mono text-[10px] text-white/40 mt-1 flex items-center gap-1.5">
                <Users size={10} /> Linked to: {couponInfo.influencer_name}
                {couponInfo.influencer_contact && ` · ${couponInfo.influencer_contact}`}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 py-3 text-right">
              <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Times Used</p>
              <p className="font-display font-black text-2xl text-white">{usages.length}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 py-3 text-right">
              <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Revenue Attr.</p>
              <p className="font-display font-black text-2xl text-green-400">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 py-3 text-right">
              <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Total Saved</p>
              <p className="font-display font-black text-2xl text-[#E8161B]">₹{totalDiscount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-[#E8161B] animate-spin" />
        </div>
      ) : usages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0A0A0A] border border-white/5 rounded-3xl text-center">
          <Receipt size={40} className="text-white/10 mb-4" />
          <p className="font-display font-bold text-white/30 uppercase tracking-widest">No Usages Yet</p>
          <p className="font-mono text-[10px] text-white/15 tracking-widest mt-2 uppercase">This coupon hasn&apos;t been used by any customer</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-white/5">
                {['Order ID', 'Customer', 'Email', 'Order Total', 'Discount Applied', 'Date'].map(h => (
                  <th key={h} className="pb-3 text-left font-mono text-[9px] text-[#555] tracking-widest uppercase px-3 first:pl-0 last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {usages.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 pl-0 pr-3">
                    <span className="font-mono text-[10px] text-[#E8161B]">
                      #{u.order_id ? u.order_id.slice(0, 8).toUpperCase() : '—'}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-display font-bold text-sm text-white">{u.customer_name || '—'}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-mono text-[10px] text-white/50">{u.customer_email || '—'}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-display font-bold text-sm text-white">₹{u.order_total?.toLocaleString('en-IN') || 0}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-display font-bold text-sm text-green-400">−₹{u.discount_applied?.toLocaleString('en-IN') || 0}</span>
                  </td>
                  <td className="py-4 pr-0 pl-3">
                    <span className="font-mono text-[10px] text-white/40">
                      {new Date(u.used_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
