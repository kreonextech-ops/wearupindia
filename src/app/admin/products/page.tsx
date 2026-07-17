'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/data';
import { 
  Package, Search, Filter, Plus, ChevronRight, 
  MoreVertical, Edit3, Trash2, ShieldCheck, Box
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Sheet from '@/components/ui/Sheet';
import NewProductForm from '@/components/admin/NewProductForm';
import { getAllProductsAction, deleteProductAction } from '@/app/admin/products/actions';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    const res = await getAllProductsAction();
    if (res.success && res.data) {
      setProducts(res.data);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? This will also remove images from storage.')) {
      const res = await deleteProductAction(id);
      if (res.success) {
        loadProducts();
      } else {
        alert('Failed to delete: ' + res.error);
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingProduct(null);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Plus size={16} /> Add Product
           </button>
        </div>
      </div>

      {/* ─── NEW PRODUCT SHEET ─── */}
      <Sheet 
        isOpen={isSheetOpen} 
        onClose={handleCloseSheet}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        description={editingProduct ? "Update the product details below." : "Fill in the details to add a new product to the catalog."}
      >
        <NewProductForm 
          product={editingProduct} 
          onSuccess={() => { handleCloseSheet(); loadProducts(); }} 
        />
      </Sheet>

      {/* ─── PRODUCT LIST ─── */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#E8161B] rounded-full animate-spin" /></div>
        ) : (
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 group-hover:border-[#E8161B]/30 transition-colors">
                           {product.images?.[0] ? (
                             <Image src={product.images[0]} alt="" fill className="object-cover" />
                           ) : (
                             <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/10"><Package size={20} /></div>
                           )}
                        </div>
                        <div>
                           <p className="font-display font-bold text-white group-hover:text-[#E8161B] transition-colors">{product.name}</p>
                           <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">{product.categoryName || product.category}</p>
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
                     <p className="font-display font-bold text-white/60">{product.stock} Units</p>
                  </td>
                  <td className="px-6 py-5 font-display font-bold text-white">
                     {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => handleEdit(product)}
                         className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                       >
                          <Edit3 size={16} />
                       </button>
                       <button 
                         onClick={() => handleDelete(product.id)}
                         className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                       >
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
        )}
        
        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
           <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">Showing {filteredProducts.length} entries of {products.length} total items</p>
           <div className="flex gap-2">
             <button disabled className="px-4 py-2 border border-white/5 rounded-lg text-white/10 font-mono text-[10px] uppercase">Prev</button>
             <button className="px-4 py-2 border border-white/5 rounded-lg text-white/40 hover:text-white hover:border-[#E8161B] font-mono text-[10px] uppercase">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#E8161B] rounded-full animate-spin" /></div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
