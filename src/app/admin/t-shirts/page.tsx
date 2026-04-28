'use client';

import * as React from 'react';
import { 
  Search, Filter, Plus, Edit3, Trash2, ShieldCheck, Box,
  TrendingUp, Activity, DollarSign, Shirt
} from 'lucide-react';
import Image from 'next/image';
import Sheet from '@/components/ui/Sheet';
import NewTShirtForm from '@/components/admin/NewTShirtForm';
import { formatPrice, products, Product } from '@/data';
import { getProductsAction } from '@/app/admin/products/actions';

// Mock metrics for now
const metrics = [
  { label: 'Total Sales (T-Shirts)', value: '₹0', trend: '0%', icon: DollarSign },
  { label: 'Units Sold', value: '0', trend: '0%', icon: TrendingUp },
  { label: 'Active Items', value: '0', trend: '0%', icon: Shirt },
  { label: 'Low Stock Alert', value: '0', trend: 'Sizes', icon: Activity, alert: false },
];

export default function AdminTShirtsPage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const [baseTshirts, setBaseTshirts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getProductsAction('t-shirts');
      if (res.success && res.data) {
        setBaseTshirts(res.data as unknown as Product[]);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredTshirts = React.useMemo(() => {
    return baseTshirts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      // Just a placeholder filter if there are sub-categories of t-shirts in the future
      const matchesFilter = filterType === 'all' || product.meta_data?.sub_category === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [baseTshirts, searchQuery, filterType]);

  // Update dynamic metrics
  const displayMetrics = React.useMemo(() => [
    ...metrics.slice(0, 2),
    { label: 'Active Items', value: baseTshirts.length.toString(), trend: '0%', icon: Shirt },
    ...metrics.slice(3)
  ], [baseTshirts]);

  return (
    <div className="space-y-10">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-50">// Apparel Division</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">T-Shirts</h1>
        </div>
        <div className="flex gap-3">
           <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Search T-Shirts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 w-64 transition-all"
              />
           </div>
           <button className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
              <Filter size={18} />
           </button>
           <button 
            onClick={() => setIsSheetOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 bg-[#E8161B] rounded-lg font-display font-bold text-xs tracking-widest uppercase hover:bg-[#B81015] transition-all shadow-[0_5px_15px_rgba(232,22,27,0.3)]"
           >
              <Plus size={16} /> Add T-Shirt
           </button>
        </div>
      </div>

      {/* ─── METRICS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className={`p-6 rounded-2xl border transition-all ${metric.alert ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.02] border-white/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg ${metric.alert ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/40'}`}>
                  <Icon size={18} />
                </div>
                <span className={`font-mono text-[10px] tracking-widest px-2 py-1 rounded-full ${metric.alert ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {metric.trend}
                </span>
              </div>
              <h3 className="font-display font-black text-3xl text-white mb-1">{metric.value}</h3>
              <p className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">{metric.label}</p>
            </div>
          );
        })}
      </div>

      {/* ─── NEW T-SHIRT SHEET ─── */}
      <Sheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)}
        title="Add New T-Shirt"
        description="Configure sizing, materials, and stock levels for new apparel."
      >
        <NewTShirtForm onSuccess={() => {
          setIsSheetOpen(false);
          window.location.reload(); // Refresh to see new data
        }} />
      </Sheet>

      {/* ─── T-SHIRT LIST ─── */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#E8161B] rounded-full animate-spin mb-4" />
          <h3 className="font-display font-black text-xl text-white uppercase tracking-widest">Loading Apparel...</h3>
        </div>
      ) : filteredTshirts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Shirt size={24} className="text-[#E8161B]" />
          </div>
          <h3 className="font-display font-black text-xl text-white uppercase tracking-widest mb-2">No T-Shirts Found</h3>
          <p className="font-body text-sm text-white/40 max-w-sm text-center">
            {searchQuery ? "Try adjusting your search." : "Your apparel database is currently empty. Start by adding your first T-Shirt."}
          </p>
          {!searchQuery && (
            <button 
              onClick={() => setIsSheetOpen(true)}
              className="mt-8 text-[#E8161B] font-display font-bold text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4 flex items-center gap-2"
            >
              <Plus size={14} /> Add First T-Shirt
            </button>
          )}
        </div>
      ) : (
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Product</th>
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Status</th>
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Total Stock</th>
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Size Breakdown</th>
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-body">
            {filteredTshirts.map((product) => (
              <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 group-hover:border-[#E8161B]/30 transition-colors">
                         <Image src={product.images ? product.images[0] : (product as any).image} alt="" fill className="object-cover" />
                      </div>
                      <div>
                         <p className="font-display font-bold text-white group-hover:text-[#E8161B] transition-colors">{product.name}</p>
                         <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">SKU: {product.id.slice(0,8)}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase ${
                      product.inStock
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                   }`}>
                      {product.inStock ? <ShieldCheck size={10} /> : <Box size={10} />}
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                   </span>
                </td>
                <td className="px-6 py-5">
                   <p className="font-display font-bold text-white/60">{(product as any).stock || 0} Units</p>
                </td>
                <td className="px-6 py-5">
                   <div className="flex gap-1.5">
                     {Object.entries(product.meta_data?.sizes || {}).map(([size, count]) => (
                       <div key={size} className="flex flex-col items-center">
                         <span className={`w-7 h-7 rounded flex items-center justify-center font-display text-[10px] font-bold ${(count as number) > 0 ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                           {size}
                         </span>
                         <span className="text-[8px] font-mono text-white/30 mt-1">{count as React.ReactNode}</span>
                       </div>
                     ))}
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center justify-end gap-2">
                     <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Edit3 size={16} />
                     </button>
                     <button className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all">
                        <Trash2 size={16} />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
