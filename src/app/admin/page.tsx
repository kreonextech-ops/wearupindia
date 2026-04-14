'use client';

import { 
  TrendingUp, Users, Package, ShoppingCart, 
  ArrowUpRight, ArrowDownRight, Zap, Target, Activity 
} from 'lucide-react';
import { motion } from 'framer-motion';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [stats, setStats] = useState([
    { label: 'Total Sales', value: '₹12,48,290', icon: TrendingUp, change: '+12.5%', isUp: true },
    { label: 'Active Recruits', value: '0', icon: Users, change: '+0%', isUp: true },
    { label: 'The Arsenal', value: '0 Items', icon: Package, change: '0 New', isUp: true },
    { label: 'Pending Logistics', value: '0 Orders', icon: ShoppingCart, change: '0 New', isUp: true },
  ]);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch Customer Count
      const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch Product Count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch Order Count (Pending/Processing)
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'processing']);

      setStats(prev => [
        prev[0],
        { ...prev[1], value: `${customerCount || 0}` },
        { ...prev[2], value: `${productCount || 0} Items` },
        { ...prev[3], value: `${orderCount || 0} Orders` },
      ]);
    };

    fetchStats();
  }, [supabase]);
  return (
    <div className="space-y-10">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-4 opacity-50">// System Status: Operational</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Command Center</h1>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg font-display font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-all">Export Log</button>
           <button className="px-6 py-2 bg-[#E8161B] rounded-lg font-display font-bold text-xs tracking-widest uppercase hover:bg-[#B81015] transition-all shadow-[0_5px_15px_rgba(232,22,27,0.3)]">Generate Intel</button>
        </div>
      </div>

      {/* ─── STATS GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl relative overflow-hidden group hover:border-[#E8161B]/30 transition-all duration-500 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-[#E8161B]/10 group-hover:text-[#E8161B] transition-all duration-500">
                <stat.icon size={20} />
              </div>
              <div className={`p-1.5 flex items-center gap-1 rounded-md bg-white/5 text-[9px] font-mono tracking-widest uppercase ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.change}
              </div>
            </div>
            <h3 className="font-display font-bold text-xs text-white/30 tracking-[0.2em] uppercase mb-1">{stat.label}</h3>
            <p className="font-display font-black text-2xl text-white group-hover:text-[#E8161B] transition-colors duration-500">{stat.value}</p>
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
              <stat.icon size={80} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── TECHNICAL MIDDLE SECTION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart Mockup */}
        <div className="lg:col-span-8 p-8 bg-[#0A0A0A] border border-white/5 rounded-3xl relative overflow-hidden">
           <div className="flex items-center justify-between mb-10">
             <div>
               <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">Fleet Trajectory</h3>
               <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">Revenue performance vs previous delta</p>
             </div>
             <div className="flex gap-4">
               {['7D', '30D', '90D', 'ALL'].map((t) => (
                 <button key={t} className={`font-mono text-[10px] tracking-widest transition-colors ${t === '30D' ? 'text-[#E8161B] underline underline-offset-8 decoration-2 font-bold' : 'text-white/20 hover:text-white'}`}>{t}</button>
               ))}
             </div>
           </div>
           {/* Mock Chart Visualization */}
           <div className="h-64 flex items-end justify-between gap-1 w-full px-2">
              {[40, 60, 45, 90, 65, 80, 55, 75, 88, 60, 95, 85, 100, 70, 80].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }} 
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1 }}
                  className="flex-1 bg-gradient-to-t from-[#E8161B]/5 via-[#E8161B]/40 to-[#E8161B] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity relative group/bar"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111] border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-white opacity-0 group-hover/bar:opacity-100 transition-opacity">₹{h}k</div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="lg:col-span-4 p-8 bg-[#0A0A0A] border border-white/5 rounded-3xl">
           <div className="flex items-center gap-3 mb-8">
              <Activity className="text-[#E8161B]" size={18} />
              <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">Active Ops</h3>
           </div>
           <div className="space-y-6">
              {[
                { type: 'Acquisition', user: 'Rahul.RE', time: '2m ago', icon: Target },
                { type: 'New Recruit', user: 'Anil.KTM', time: '14m ago', icon: Zap },
                { type: 'Dispatch', user: 'Order #4128', time: '1h ago', icon: ShoppingCart },
                { type: 'Restock', user: 'Helmet Hub', time: '3h ago', icon: Package },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/30 group-hover:border-[#E8161B]/30 group-hover:text-[#E8161B] transition-all">
                    <act.icon size={16} />
                  </div>
                  <div>
                     <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">{act.type} • {act.time}</p>
                     <p className="font-display font-bold text-sm text-white">{act.user}</p>
                  </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-10 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-display font-bold text-[10px] tracking-widest uppercase transition-colors">See Complete Ops Log</button>
        </div>
      </div>
    </div>
  );
}
