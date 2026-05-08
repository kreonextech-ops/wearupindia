'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Plus, Trash2, ToggleLeft, ToggleRight, ExternalLink,
  X, Check, ChevronDown, Users, AlertCircle, Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type Coupon = {
  id: string;
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  expiry_date: string | null;
  usage_limit: number;
  times_used: number;
  is_active: boolean;
  influencer_name: string | null;
  influencer_contact: string | null;
  created_at: string;
  revenue_attributed?: number;
};

const inputCls = 'w-full bg-[#0d0d0d] border border-white/10 text-white placeholder-[#444] px-4 py-2.5 font-mono text-xs focus:outline-none focus:border-[#E8161B] transition-colors rounded-lg';
const labelCls = 'font-mono text-[10px] text-[#666] tracking-widest uppercase mb-1 block';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: '', discount_type: 'percent', discount_value: '',
    expiry_date: '', usage_limit: '100',
    influencer_name: '', influencer_contact: '',
  });

  const supabase = createClient();

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      // Fetch revenue attributed per coupon
      const withRevenue = await Promise.all(data.map(async (c: any) => {
        const { data: usages } = await supabase
          .from('coupon_usages')
          .select('order_total')
          .eq('coupon_code', c.code);
        const revenue = usages?.reduce((sum: number, u: any) => sum + (u.order_total || 0), 0) || 0;
        return { ...c, revenue_attributed: revenue };
      }));
      setCoupons(withRevenue);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async () => {
    if (!form.code || !form.discount_value) {
      setCreateError('Code and discount value are required.');
      return;
    }
    setCreating(true);
    setCreateError('');

    const { error } = await supabase.from('coupons').insert([{
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      expiry_date: form.expiry_date || null,
      usage_limit: parseInt(form.usage_limit) || 100,
      influencer_name: form.influencer_name || null,
      influencer_contact: form.influencer_contact || null,
      is_active: true,
    }]);

    if (error) {
      setCreateError(error.message.includes('unique') ? 'This coupon code already exists.' : error.message);
    } else {
      setShowCreate(false);
      setForm({ code: '', discount_type: 'percent', discount_value: '', expiry_date: '', usage_limit: '100', influencer_name: '', influencer_contact: '' });
      fetchCoupons();
    }
    setCreating(false);
  };

  const handleToggle = async (coupon: Coupon) => {
    setTogglingId(coupon.id);
    await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id);
    setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, is_active: !c.is_active } : c));
    setTogglingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon? This will also delete all its usage history.')) return;
    setDeletingId(id);
    await supabase.from('coupons').delete().eq('id', id);
    setCoupons(prev => prev.filter(c => c.id !== id));
    setDeletingId(null);
  };

  const formatDiscount = (c: Coupon) =>
    c.discount_type === 'percent' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`;

  const isExpired = (expiry: string | null) => expiry && new Date(expiry) < new Date();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-1">// Admin</p>
          <h1 className="font-display font-black text-4xl text-white tracking-tight uppercase">Coupons</h1>
          <p className="font-mono text-[10px] text-[#555] tracking-widest mt-1 uppercase">
            {coupons.length} coupon{coupons.length !== 1 ? 's' : ''} · {coupons.filter(c => c.is_active).length} active
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#E8161B] text-white font-display font-bold text-xs tracking-widest uppercase px-5 py-3 rounded-xl hover:bg-[#B81015] transition-colors shadow-[0_5px_20px_rgba(232,22,27,0.3)]"
        >
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-black text-2xl text-white uppercase">New Coupon</h2>
                <button onClick={() => setShowCreate(false)} className="text-white/30 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Code */}
                <div>
                  <label className={labelCls}>Coupon Code *</label>
                  <input className={`${inputCls} uppercase`} placeholder="e.g. RIDERAJ10"
                    value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
                </div>

                {/* Discount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Discount Type *</label>
                    <select className={inputCls} value={form.discount_type}
                      onChange={e => setForm(p => ({ ...p, discount_type: e.target.value }))}>
                      <option value="percent" className="bg-[#0d0d0d]">Percentage (%)</option>
                      <option value="flat" className="bg-[#0d0d0d]">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Discount Value *</label>
                    <input className={inputCls} type="number" placeholder={form.discount_type === 'percent' ? '10' : '100'}
                      value={form.discount_value} onChange={e => setForm(p => ({ ...p, discount_value: e.target.value }))} />
                  </div>
                </div>

                {/* Expiry & Usage Limit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Expiry Date</label>
                    <input className={inputCls} type="date"
                      value={form.expiry_date} onChange={e => setForm(p => ({ ...p, expiry_date: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Usage Limit</label>
                    <input className={inputCls} type="number" placeholder="100"
                      value={form.usage_limit} onChange={e => setForm(p => ({ ...p, usage_limit: e.target.value }))} />
                  </div>
                </div>

                {/* Influencer */}
                <div className="pt-2 border-t border-white/5">
                  <p className="font-mono text-[10px] text-[#E8161B] tracking-widest uppercase mb-3">// Linked Influencer</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Influencer Name</label>
                      <input className={inputCls} placeholder="Raj Sharma"
                        value={form.influencer_name} onChange={e => setForm(p => ({ ...p, influencer_name: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelCls}>Contact (Phone/IG)</label>
                      <input className={inputCls} placeholder="+91 99999 88888"
                        value={form.influencer_contact} onChange={e => setForm(p => ({ ...p, influencer_contact: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {createError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                    <p className="font-mono text-xs text-red-400">{createError}</p>
                  </div>
                )}

                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="w-full flex items-center justify-center gap-2 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase py-3 rounded-xl hover:bg-[#B81015] transition-colors disabled:opacity-50"
                >
                  {creating ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <><Check size={16} /> Create Coupon</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-[#E8161B] animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0A0A0A] border border-white/5 rounded-3xl text-center">
          <Tag size={40} className="text-white/10 mb-4" />
          <p className="font-display font-bold text-white/30 uppercase tracking-widest">No Coupons Yet</p>
          <p className="font-mono text-[10px] text-white/15 tracking-widest mt-2 uppercase">Create your first coupon above</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5">
                {['Code', 'Influencer', 'Discount', 'Used / Limit', 'Revenue Attr.', 'Expiry', 'Status', 'Actions'].map(h => (
                  <th key={h} className="pb-3 text-left font-mono text-[9px] text-[#555] tracking-widest uppercase px-3 first:pl-0 last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {coupons.map((coupon, i) => (
                <motion.tr
                  key={coupon.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  {/* Code */}
                  <td className="py-4 pl-0 pr-3">
                    <span className="font-mono font-bold text-sm text-[#E8161B] tracking-wider">{coupon.code}</span>
                  </td>
                  {/* Influencer */}
                  <td className="py-4 px-3">
                    {coupon.influencer_name ? (
                      <div>
                        <p className="font-display font-bold text-xs text-white">{coupon.influencer_name}</p>
                        {coupon.influencer_contact && <p className="font-mono text-[9px] text-white/30">{coupon.influencer_contact}</p>}
                      </div>
                    ) : (
                      <span className="font-mono text-[9px] text-white/20">—</span>
                    )}
                  </td>
                  {/* Discount */}
                  <td className="py-4 px-3">
                    <span className="font-display font-black text-sm text-white">{formatDiscount(coupon)}</span>
                  </td>
                  {/* Used */}
                  <td className="py-4 px-3">
                    <span className="font-mono text-xs text-white">
                      {coupon.times_used}
                      <span className="text-white/30"> / {coupon.usage_limit}</span>
                    </span>
                  </td>
                  {/* Revenue */}
                  <td className="py-4 px-3">
                    <span className="font-display font-bold text-sm text-green-400">₹{coupon.revenue_attributed?.toLocaleString('en-IN') || 0}</span>
                  </td>
                  {/* Expiry */}
                  <td className="py-4 px-3">
                    {coupon.expiry_date ? (
                      <span className={`font-mono text-[10px] ${isExpired(coupon.expiry_date) ? 'text-red-400' : 'text-white/60'}`}>
                        {new Date(coupon.expiry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                        {isExpired(coupon.expiry_date) && ' (Expired)'}
                      </span>
                    ) : <span className="font-mono text-[9px] text-white/20">No expiry</span>}
                  </td>
                  {/* Status toggle */}
                  <td className="py-4 px-3">
                    <button
                      onClick={() => handleToggle(coupon)}
                      disabled={togglingId === coupon.id}
                      className="flex items-center gap-2 transition-all disabled:opacity-40"
                    >
                      {coupon.is_active
                        ? <ToggleRight size={24} className="text-green-400" />
                        : <ToggleLeft size={24} className="text-white/20" />}
                      <span className={`font-mono text-[9px] uppercase tracking-widest ${coupon.is_active ? 'text-green-400' : 'text-white/20'}`}>
                        {coupon.is_active ? 'Active' : 'Off'}
                      </span>
                    </button>
                  </td>
                  {/* Actions */}
                  <td className="py-4 pr-0 pl-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/coupons/${coupon.code}/usage`}
                        className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                      >
                        <ExternalLink size={12} /> Usage
                      </Link>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        disabled={deletingId === coupon.id}
                        className="text-white/20 hover:text-red-400 transition-colors disabled:opacity-40"
                      >
                        {deletingId === coupon.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
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
