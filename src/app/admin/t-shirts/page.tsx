'use client';

import * as React from 'react';
import { 
  Search, Filter, Plus, Edit3, Trash2, ShieldCheck, Box,
  TrendingUp, Activity, DollarSign, Shirt, AlertTriangle, X
} from 'lucide-react';
import Image from 'next/image';
import Sheet from '@/components/ui/Sheet';
import NewTShirtForm from '@/components/admin/NewTShirtForm';
import { 
  getProductsWithVariantsAction, 
  deleteProductAction, 
  updateTShirtAction 
} from '@/app/admin/products/actions';

export default function AdminTShirtsPage() {
  const [isAddSheetOpen, setIsAddSheetOpen] = React.useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [tshirts, setTshirts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    const res = await getProductsWithVariantsAction('tshirts');
    if (res.success && res.data) {
      setTshirts(res.data);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => { loadData(); }, [loadData]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async (productId: string) => {
    setActionLoading(true);
    const res = await deleteProductAction(productId);
    setActionLoading(false);
    setDeleteConfirm(null);
    if (res.success) {
      showToast('Deleted successfully.', 'success');
      loadData();
    } else {
      showToast(res.error || 'Failed to delete.', 'error');
    }
  };

  const filteredTshirts = React.useMemo(() => {
    return tshirts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tshirts, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl transition-all ${
          toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <span className="font-mono text-[11px] tracking-widest uppercase">{toast.msg}</span>
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="font-display font-black text-white text-lg uppercase mb-4">Confirm Delete?</h3>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={actionLoading} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-50">// Redefined Apparel</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">T-Shirts</h1>
        </div>
        <div className="flex gap-3">
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white/5 border border-white/5 rounded-full py-2.5 px-6 text-sm text-white focus:outline-none focus:border-[#E8161B]/50 transition-all w-64" />
          <button onClick={() => setIsAddSheetOpen(true)} className="flex items-center gap-3 px-6 py-2.5 bg-[#E8161B] rounded-lg font-display font-bold text-xs tracking-widest uppercase hover:bg-[#B81015] transition-all shadow-[0_5px_15px_rgba(232,22,27,0.3)]"><Plus size={16} /> Add Product</button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <h3 className="font-display font-black text-3xl text-white mb-1">{tshirts.length}</h3>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest italic">Total Designs</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <h3 className="font-display font-black text-3xl text-white mb-1">{tshirts.reduce((acc, p) => acc + (p.stock || 0), 0)}</h3>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest italic">Inventory Units</p>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#E8161B] rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] border-b border-white/5 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">
              <tr>
                <th className="px-6 py-5">Product</th>
                <th className="px-6 py-5">Total Stock</th>
                <th className="px-6 py-5">Size Breakdown</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-body">
              {filteredTshirts.map((p) => (
                <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                      {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
                    </div>
                    <div>
                      <p className="font-display font-bold text-white group-hover:text-[#E8161B] transition-colors uppercase">{p.name}</p>
                      <p className="font-mono text-[9px] text-white/20 tracking-widest">₹{p.price}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase ${p.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-1.5">
                      {Object.entries(p.sizes || {}).map(([size, qty]: any) => (
                        <div key={size} className="flex flex-col items-center">
                          <span className={`w-7 h-7 rounded flex items-center justify-center font-display text-[10px] font-bold ${qty > 0 ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-500 opacity-30'}`}>{size}</span>
                          <span className="text-[8px] font-mono text-white/20 mt-1">{qty}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingProduct(p); setIsEditSheetOpen(true); }} className="p-2 text-white/20 hover:text-white transition-all"><Edit3 size={16} /></button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-2 text-white/20 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sheets */}
      <Sheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} title="Add Product"><NewTShirtForm onSuccess={() => { setIsAddSheetOpen(false); loadData(); showToast('Product added!', 'success'); }} /></Sheet>
      <Sheet isOpen={isEditSheetOpen} onClose={() => { setIsEditSheetOpen(false); setEditingProduct(null); }} title="Edit Product">
        {editingProduct && <EditTShirtForm product={editingProduct} onSuccess={() => { setIsEditSheetOpen(false); loadData(); showToast('Updated!', 'success'); }} />}
      </Sheet>
    </div>
  );
}

function EditTShirtForm({ product, onSuccess }: any) {
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [preview, setPreview] = React.useState(product.images?.[0]);
  
  // Initialize sizes from product.sizes
  const [sizes, setSizes] = React.useState<Record<string, { active: boolean; qty: number }>>(() => {
    const base = {
      S: { active: false, qty: 0 },
      M: { active: false, qty: 0 },
      L: { active: false, qty: 0 },
      XL: { active: false, qty: 0 },
      XXL: { active: false, qty: 0 }
    };
    if (product.sizes) {
      Object.entries(product.sizes).forEach(([s, qty]: any) => {
        if (base[s as keyof typeof base]) {
          base[s as keyof typeof base] = { active: true, qty: qty };
        }
      });
    }
    return base;
  });

  const toggleSize = (size: string) => {
    setSizes(prev => ({
      ...prev,
      [size]: { ...prev[size], active: !prev[size].active, qty: !prev[size].active ? (prev[size].qty || 1) : 0 }
    }));
  };

  const handleQtyChange = (size: string, value: string) => {
    const num = parseInt(value) || 0;
    setSizes(prev => ({
      ...prev,
      [size]: { ...prev[size], qty: num >= 0 ? num : 0, active: num > 0 ? true : prev[size].active }
    }));
  };

  const clientAction = async (formData: FormData) => {
    setError(null);
    setPending(true);

    const activeSizes: Record<string, number> = {};
    Object.entries(sizes).forEach(([s, data]) => {
      if (data.active) activeSizes[s] = data.qty;
    });

    if (Object.keys(activeSizes).length === 0) {
      setError("Please select at least one size.");
      setPending(false);
      return;
    }

    formData.append('sizes', JSON.stringify(activeSizes));
    const res = await updateTShirtAction(product.id, formData);
    setPending(false);
    if (res.success) onSuccess();
    else setError(res.error || 'Failed to update.');
  };

  return (
    <form action={clientAction} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
      {error && <p className="text-red-500 text-xs font-mono uppercase tracking-widest p-3 bg-red-500/5 border border-red-500/10 rounded-xl">{error}</p>}
      
      <div className="space-y-3">
        {preview && <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10"><Image src={preview} alt="" fill className="object-cover" /></div>}
        <input type="file" name="image" accept="image/*" onChange={(e: any) => e.target.files[0] && setPreview(URL.createObjectURL(e.target.files[0]))} className="hidden" id="edit-img" />
        <label htmlFor="edit-img" className="block p-3 bg-white/5 border border-white/10 rounded-xl text-center text-[10px] font-mono text-white/40 cursor-pointer uppercase hover:bg-white/10 transition-colors">Replace Image</label>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Product Name</label>
        <input name="name" defaultValue={product.name} placeholder="Product Name" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-[#E8161B]/50 outline-none transition-all" required />
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Price (₹)</label>
        <input name="price" type="number" defaultValue={product.price} placeholder="Price" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-[#E8161B]/50 outline-none transition-all" required />
      </div>
      
      <div className="space-y-4 pt-4 border-t border-white/5">
        <label className="font-mono text-[10px] text-[#E8161B] tracking-[0.2em] uppercase font-bold block">Size & Inventory</label>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(sizes).map(([s, data]) => (
            <div key={s} className="space-y-2">
              <button
                type="button"
                onClick={() => toggleSize(s)}
                className={`w-full py-1 text-center font-display font-black text-[10px] rounded-t-lg transition-all border-x border-t ${
                  data.active ? 'bg-[#E8161B] border-[#E8161B] text-white' : 'bg-white/5 border-white/10 text-white/20'
                }`}
              >
                {s}
              </button>
              <input
                type="number"
                value={data.qty}
                onChange={e => handleQtyChange(s, e.target.value)}
                placeholder="0"
                className={`w-full bg-white/5 border border-white/5 rounded-b-lg py-2 text-center text-white text-xs focus:border-[#E8161B]/50 outline-none transition-all ${!data.active ? 'opacity-20' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Description</label>
        <textarea name="description" defaultValue={product.description} rows={4} className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-[#E8161B]/50 outline-none transition-all" />
      </div>

      <button type="submit" disabled={pending} className="w-full py-4 bg-[#E8161B] text-white rounded-xl font-display font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-[#B81015] shadow-lg shadow-wu-red/20">
        {pending ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" /> : 'Update Product'}
      </button>
    </form>
  );
}
