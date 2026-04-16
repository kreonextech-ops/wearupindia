'use client';

import * as React from 'react';
import { products, formatPrice } from '@/data';
import { 
  Package, Search, Filter, Plus, ChevronRight, 
  MoreVertical, Edit3, Trash2, ShieldCheck, Box
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Sheet from '@/components/ui/Sheet';
import NewProductForm from '@/components/admin/NewProductForm';

export default function AdminProductsPage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <div className="space-y-10">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-50">// Inventory System</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Products</h1>
        </div>
        <div className="flex gap-3">
           <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Search Products..." 
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
              <Plus size={16} /> Add Product
           </button>
        </div>
      </div>

      {/* ─── NEW PRODUCT SHEET ─── */}
      <Sheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)}
        title="Add New Product"
        description="Fill in the details to add a new product to the catalog."
      >
        <NewProductForm onSuccess={() => setIsSheetOpen(false)} />
      </Sheet>

      {/* ─── PRODUCT LIST ─── */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Product</th>
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Status</th>
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Stock</th>
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Price</th>
              <th className="px-6 py-5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-body">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 group-hover:border-[#E8161B]/30 transition-colors">
                         <Image src={product.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div>
                         <p className="font-display font-bold text-white group-hover:text-[#E8161B] transition-colors">{product.name}</p>
                         <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">{product.category}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase ${
                      product.inStock 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                   }`}>
                      {product.inStock ? <ShieldCheck size={10} /> : <Box size={10} />}
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                   </span>
                </td>
                <td className="px-6 py-5">
                   <p className="font-display font-bold text-white/60">{product.stock || 0} Units</p>
                </td>
                <td className="px-6 py-5 font-display font-bold text-white">
                   {formatPrice(product.price)}
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center justify-end gap-2">
                     <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Edit3 size={16} />
                     </button>
                     <button className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all">
                        <Trash2 size={16} />
                     </button>
                     <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <MoreVertical size={16} />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
           <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">Showing {products.length} entries of 142 total items</p>
           <div className="flex gap-2">
             <button disabled className="px-4 py-2 border border-white/5 rounded-lg text-white/10 font-mono text-[10px] uppercase">Prev</button>
             <button className="px-4 py-2 border border-white/5 rounded-lg text-white/40 hover:text-white hover:border-[#E8161B] font-mono text-[10px] uppercase">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
