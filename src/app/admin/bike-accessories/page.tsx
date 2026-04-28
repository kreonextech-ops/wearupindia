'use client';

import { useState, useMemo } from 'react';
import { Package, TrendingUp, Settings, IndianRupee, Plus, X, Search, Filter, Shield } from 'lucide-react';
import NewAccessoryForm from '@/components/admin/NewAccessoryForm';

import { products } from '@/data';

const metrics = {
  totalItems: 0,
  lowStock: 0,
  monthlySales: 0,
  revenue: 0,
};

export default function AdminBikeAccessoriesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Base accessories
  const baseAccessories = products.filter(p => p.category === 'bike-accessories');

  // Filtered and searched accessories
  const filteredAccessories = useMemo(() => {
    return baseAccessories.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.meta_data?.sub_category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === 'all' || product.meta_data?.sub_category === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [baseAccessories, searchQuery, filterType]);

  // Extract unique sub_categories for the filter dropdown
  const uniqueSubCategories = useMemo(() => {
    const subs = new Set(baseAccessories.map(p => p.meta_data?.sub_category).filter(Boolean));
    return Array.from(subs);
  }, [baseAccessories]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-50">// Equipment & Gear</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Bike Accessories</h1>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#E8161B] text-white px-6 py-4 rounded-xl font-display font-black text-xs uppercase tracking-widest hover:bg-[#B81015] transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(232,22,27,0.2)]"
        >
          <Plus size={16} /> Add Accessory
        </button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: metrics.totalItems, icon: Package },
          { label: 'Low Stock', value: metrics.lowStock, icon: Shield },
          { label: 'Monthly Sales', value: metrics.monthlySales, icon: TrendingUp },
          { label: 'Revenue (₹)', value: metrics.revenue, icon: IndianRupee },
        ].map((metric, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <metric.icon size={18} className="text-[#E8161B]" />
            </div>
            <div>
              <p className="font-display font-black text-3xl text-white tracking-tight">{metric.value}</p>
              <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase">{metric.label}</p>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
              <metric.icon size={100} />
            </div>
          </div>
        ))}
      </div>

      {/* LIST HEADER */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input 
            type="text" 
            placeholder="Search accessories by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E8161B]/50 transition-all font-body text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto relative group">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 sm:flex-none appearance-none bg-black/40 border border-white/10 rounded-xl px-10 py-3 font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all focus:outline-none focus:border-[#E8161B]/50 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {uniqueSubCategories.map(cat => (
              <option key={cat as string} value={cat as string}>{(cat as string).replace(/-/g, ' ')}</option>
            ))}
          </select>
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={14} />
        </div>
      </div>

      {/* LIST CONTENT */}
      {filteredAccessories.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Package size={24} className="text-[#E8161B]" />
          </div>
          <h3 className="font-display font-black text-xl text-white uppercase tracking-widest mb-2">No Accessories Found</h3>
          <p className="font-body text-sm text-white/40 max-w-sm text-center">
            {searchQuery || filterType !== 'all' ? "Try adjusting your search or filters." : "Your accessories database is currently empty. Start by adding your first product."}
          </p>
          {!searchQuery && filterType === 'all' && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-8 text-[#E8161B] font-display font-bold text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4 flex items-center gap-2"
            >
              <Plus size={14} /> Add First Accessory
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAccessories.map((product) => (
            <div key={product.id} className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden relative shrink-0 border border-white/10">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white tracking-tight leading-none mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2">
                     <span className="font-mono text-[9px] text-[#E8161B] tracking-widest uppercase">{product.meta_data?.sub_category?.replace(/-/g, ' ')}</span>
                     <span className="text-white/20">•</span>
                     <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">{product.price} INR</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                <div className="text-right">
                  <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mb-1">Status</p>
                  <p className="font-display font-bold text-xs text-green-500 uppercase">In Stock</p>
                </div>
                <button className="h-10 px-4 rounded-lg border border-white/10 text-white hover:bg-white/5 font-display font-bold text-xs uppercase transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SLIDE OUT MODAL */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isAddModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsAddModalOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 bottom-0 w-full max-w-xl bg-[#0A0A0A] border-l border-white/10 p-8 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden flex flex-col ${isAddModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6 shrink-0">
            <div>
              <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">New Accessory</h2>
              <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mt-1">Add to equipment catalog</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
             <NewAccessoryForm onSuccess={() => setIsAddModalOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
