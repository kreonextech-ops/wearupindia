'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, Mail, Phone, MapPin, Calendar,
  ShoppingCart, Shield, UserIcon, Package
} from 'lucide-react';
import { formatINR } from '@/lib/analytics';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  shipping_address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;
  role: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error.message);
        setLoading(false);
        return;
      }

      // For each profile, pull order stats
      const enriched: Customer[] = await Promise.all(
        (profiles ?? []).map(async (p) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('user_id', p.id);

          const order_count = orders?.length ?? 0;
          const total_spent = orders?.reduce((s, o) => s + (o.total_amount ?? 0), 0) ?? 0;

          return { ...p, order_count, total_spent };
        })
      );

      setCustomers(enriched);
      setLoading(false);
    };

    load();
  }, []);

  const filtered = customers.filter(c =>
    !search ||
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone_number?.includes(search) ||
    c.shipping_address?.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-60">// Customer Management</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Customers</h1>
          <p className="font-mono text-[10px] text-white/20 tracking-widest mt-2 uppercase">
            {customers.length} registered customer{customers.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8161B] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-6 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E8161B]/50 w-full md:w-80 transition-all"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0A0A0A] border border-white/5 rounded-3xl text-center">
          <Users size={40} className="text-white/10 mb-4" />
          <p className="font-display font-bold text-white/30 uppercase tracking-widest">No Customers Found</p>
          <p className="font-mono text-[10px] text-white/15 tracking-widest mt-2 uppercase">
            Customers appear here automatically after they register or place an order
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((customer, i) => {
            const addr = customer.shipping_address;
            const hasAddress = addr && (addr.street || addr.city);
            const initial = (customer.full_name?.[0] ?? customer.email?.[0] ?? '?').toUpperCase();

            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group"
              >
                <div className="flex flex-wrap gap-6">
                  {/* Avatar + Basic Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-[200px]">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#E8161B] to-[#ff4b4f] flex items-center justify-center text-white font-display font-black text-base flex-shrink-0 shadow-lg shadow-[#E8161B]/20">
                      {initial}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-base text-white truncate">
                          {customer.full_name || 'No Name'}
                        </h3>
                        {customer.role === 'admin' && (
                          <span className="flex items-center gap-1 bg-[#E8161B]/20 text-[#E8161B] px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase">
                            <Shield size={8} /> Admin
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-white/30 flex items-center gap-1.5 truncate">
                        <Mail size={9} /> {customer.email}
                      </p>
                      <p className={`font-mono text-[10px] flex items-center gap-1.5 ${customer.phone_number ? 'text-white/40' : 'text-white/15 italic'}`}>
                        <Phone size={9} />
                        {customer.phone_number ?? 'No phone on file'}
                      </p>
                      <p className="font-mono text-[9px] text-white/20 flex items-center gap-1.5">
                        <Calendar size={9} />
                        Joined {new Date(customer.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-2 flex items-center gap-1.5">
                      <MapPin size={9} className="text-[#E8161B]" /> Shipping Address
                    </p>
                    {hasAddress ? (
                      <div className="bg-white/3 border border-white/5 rounded-xl p-3">
                        {addr.street && <p className="font-body text-sm text-white/70">{addr.street}</p>}
                        <p className="font-body text-xs text-white/40">
                          {[addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white/3 border border-dashed border-white/10 rounded-xl p-3">
                        <p className="font-mono text-[9px] text-white/20 uppercase italic">Not provided yet</p>
                        <p className="font-mono text-[8px] text-white/10 mt-1 uppercase">Will be filled when they checkout</p>
                      </div>
                    )}
                  </div>

                  {/* Order Stats */}
                  <div className="flex items-center gap-8 flex-shrink-0">
                    <div className="text-center">
                      <p className="font-mono text-[9px] text-white/20 uppercase mb-1 flex items-center gap-1 justify-center">
                        <ShoppingCart size={9} /> Orders
                      </p>
                      <p className={`font-display font-black text-xl ${(customer.order_count ?? 0) > 0 ? 'text-white' : 'text-white/20'}`}>
                        {customer.order_count ?? 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[9px] text-white/20 uppercase mb-1 flex items-center gap-1 justify-center">
                        <Package size={9} /> Spent
                      </p>
                      <p className={`font-display font-black text-lg ${(customer.total_spent ?? 0) > 0 ? 'text-[#E8161B]' : 'text-white/20'}`}>
                        {(customer.total_spent ?? 0) > 0 ? formatINR(customer.total_spent!) : '₹0'}
                      </p>
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
