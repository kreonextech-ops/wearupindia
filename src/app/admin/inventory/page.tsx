'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/data';
import { 
  Package, Search, Filter, Box, ShieldCheck, 
  Star, StarOff, Save, RefreshCw, AlertTriangle, Trash2, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { getAllProductsAction, toggleFeaturedAction, toggleNewAction, updateStockAction, deleteProductAction } from '@/app/admin/products/actions';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    const res = await getAllProductsAction();
    if (res.success && res.data) {
      setProducts(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    const res = await toggleFeaturedAction(id, !currentStatus);
    if (res.success) {
      setProducts(products.map(p => p.id === id ? { ...p, is_featured: !currentStatus } : p));
    } else {
      alert('Failed to update: ' + res.error);
    }
    setUpdatingId(null);
  };

  const handleToggleNew = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    const res = await toggleNewAction(id, !currentStatus);
    if (res.success) {
      setProducts(products.map(p => p.id === id ? { ...p, is_new: !currentStatus } : p));
    } else {
      alert('Failed to update: ' + res.error);
    }
    setUpdatingId(null);
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    setUpdatingId(id);
    const res = await updateStockAction(id, newStock);
    if (res.success) {
      setProducts(products.map(p => p.id === id ? { ...p, stock: newStock, inStock: newStock > 0 } : p));
    } else {
      alert('Failed to update stock: ' + res.error);
    }
    setUpdatingId(null);
  };

  const handleDelete = async (product: any) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    const res = await deleteProductAction(product.id);
    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      alert('Failed to delete: ' + res.error);
    }
    setDeletingId(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-50">// Warehouse Management</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Inventory</h1>
        </div>
        <div className="flex gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Filter items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 w-64 transition-all"
              />
           </div>
           <button onClick={loadProducts} className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* ─── INVENTORY TABLE ─── */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#E8161B] rounded-full animate-spin" /></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Item Details</th>
                <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Category</th>
                <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Homepage Status</th>
                <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Live Stock</th>
                <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-body">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 group-hover:border-[#E8161B]/30 transition-colors">
                           {product.images?.[0] ? (
                             <Image src={product.images[0]} alt="" fill className="object-cover" />
                           ) : (
                             <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/10"><Package size={24} /></div>
                           )}
                        </div>
                        <div>
                           <p className="font-display font-bold text-white text-base group-hover:text-[#E8161B] transition-colors">{product.name}</p>
                           <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase">{product.slug}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] text-white/60 uppercase tracking-widest">
                       {product.categoryName}
                     </span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex flex-col gap-2">
                       <button 
                        disabled={updatingId === product.id}
                        onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                          product.is_featured 
                            ? 'bg-[#E8161B]/10 border-[#E8161B]/30 text-[#E8161B]' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                        }`}
                       >
                         {product.is_featured ? <Star size={14} fill="currentColor" /> : <StarOff size={14} />}
                         <span className="font-display font-bold text-[10px] tracking-widest uppercase">
                           {product.is_featured ? 'Featured' : 'Promote'}
                         </span>
                       </button>

                       <button 
                        disabled={updatingId === product.id}
                        onClick={() => handleToggleNew(product.id, product.is_new)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                          product.is_new 
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                        }`}
                       >
                         <Sparkles size={14} className={product.is_new ? "fill-currentColor" : ""} />
                         <span className="font-display font-bold text-[10px] tracking-widest uppercase">
                           {product.is_new ? 'New Arrival' : 'Mark New'}
                         </span>
                       </button>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-3">
                        <input 
                          type="number" 
                          defaultValue={product.stock}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (val !== product.stock) handleUpdateStock(product.id, val);
                          }}
                          className="w-20 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm font-display font-bold text-white focus:outline-none focus:border-[#E8161B]/50"
                        />
                        {product.stock < 10 && (
                          <div className="flex items-center gap-1.5 text-orange-500">
                            <AlertTriangle size={14} />
                            <span className="font-mono text-[9px] uppercase tracking-tighter">Low</span>
                          </div>
                        )}
                     </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                         <button
                           onClick={() => handleDelete(product)}
                           disabled={deletingId === product.id}
                           className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 text-white/30 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all disabled:opacity-50"
                         >
                           {deletingId === product.id
                             ? <div className="w-3.5 h-3.5 border-2 border-red-500/50 border-t-red-500 rounded-full animate-spin" />
                             : <Trash2 size={14} />}
                         </button>
                      </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── STATS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Value', value: formatPrice(products.reduce((acc, p) => acc + (p.price * p.stock), 0)), icon: Package },
           { label: 'Low Stock Items', value: products.filter(p => p.stock < 10).length, icon: AlertTriangle, color: 'text-orange-500' },
           { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, icon: Box, color: 'text-red-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl flex items-center justify-between group">
              <div>
                <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">{stat.label}</p>
                <p className={`font-display font-black text-3xl ${stat.color || 'text-white'}`}>{stat.value}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#E8161B] transition-colors">
                <stat.icon size={28} />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}

