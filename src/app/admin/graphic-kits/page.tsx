'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Layers, Package, Plus, X, Search, Filter, Trash2, Edit3, Bike, IndianRupee } from 'lucide-react';
import NewGraphicKitForm from '@/components/admin/NewGraphicKitForm';
import { getProductsWithVariantsAction, deleteProductAction, updateGraphicKitAction } from '@/app/admin/products/actions';
import Image from 'next/image';
import Sheet from '@/components/ui/Sheet';

export default function AdminGraphicKitsPage() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [kits, setKits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const res = await getProductsWithVariantsAction('graphic-kits');
    if (res.success && res.data) {
      setKits(res.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Delete this kit? All pricing variants will be removed.')) return;
    setDeletingId(productId);
    await deleteProductAction(productId);
    setDeletingId(null);
    loadData();
  };

  const filteredKits = useMemo(() => {
    return kits.filter((k) => {
      const matchesSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            k.meta_data?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            k.meta_data?.model?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = filterBrand === 'all' || k.meta_data?.brand === filterBrand;
      return matchesSearch && matchesBrand;
    });
  }, [kits, searchQuery, filterBrand]);

  const brands = useMemo(() => {
    return Array.from(new Set(kits.map(k => k.meta_data?.brand).filter(Boolean)));
  }, [kits]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-wu-red tracking-[0.4em] uppercase mb-2 opacity-50">// Decal Division</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Graphic Kits</h1>
        </div>
        <button
          onClick={() => setIsAddSheetOpen(true)}
          className="bg-wu-red text-white px-8 py-4 rounded-xl font-display font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(232,22,27,0.2)]"
        >
          <Plus size={18} /> Add Design
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="font-display font-black text-4xl text-white mb-1 tracking-tight">{kits.length}</h3>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest italic">Total Designs</p>
          </div>
          <Layers className="absolute -bottom-4 -right-4 text-white/[0.03] group-hover:scale-110 transition-transform" size={120} />
        </div>
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="font-display font-black text-4xl text-white mb-1 tracking-tight">{brands.length}</h3>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest italic">Brands Covered</p>
          </div>
          <Bike className="absolute -bottom-4 -right-4 text-white/[0.03] group-hover:scale-110 transition-transform" size={120} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input
            type="text"
            placeholder="Search kits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-wu-red/50 transition-all font-body text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="flex-1 sm:w-48 appearance-none bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-white/60 focus:outline-none focus:border-wu-red/50 cursor-pointer"
          >
            <option value="all">All Brands</option>
            {brands.map(b => <option key={b as string} value={b as string}>{b as string}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-white/10 border-t-wu-red rounded-full animate-spin mb-4" />
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Syncing with R2 Database...</p>
        </div>
      ) : filteredKits.length === 0 ? (
        <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <Package className="mx-auto text-white/10 mb-6" size={48} />
          <h3 className="font-display font-black text-xl text-white uppercase tracking-widest mb-2">No Designs Found</h3>
          <p className="text-white/40 text-sm">Try adjusting your filters or add a new kit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredKits.map((k) => (
            <div key={k.id} className="group bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] transition-all relative overflow-hidden">
              <div className="flex gap-6 relative z-10">
                <div className="w-24 h-24 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0 relative">
                  {k.images?.[0] ? (
                    <Image src={k.images[0]} alt={k.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 font-display font-black text-2xl uppercase">{k.name.charAt(0)}</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-wu-red tracking-[0.2em] uppercase">{k.meta_data?.brand}</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingKit(k); setIsEditSheetOpen(true); }} className="text-white/20 hover:text-white transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(k.id)} disabled={deletingId === k.id} className="text-white/20 hover:text-wu-red transition-colors">
                          {deletingId === k.id ? <div className="w-3 h-3 border border-white/20 border-t-wu-red rounded-full animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </div>
                    <h3 className="font-display font-black text-xl text-white uppercase tracking-tight leading-none mb-2">{k.name}</h3>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{k.meta_data?.model}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-4 mt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <IndianRupee size={12} className="text-wu-red" />
                      <span className="font-display font-bold text-white text-sm">Starts at ₹{k.price}</span>
                    </div>
                    <span className="text-white/10 text-xs px-2 py-1 bg-white/5 rounded font-mono uppercase tracking-tighter">{k.variants?.length || 0} Pricing Variants</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sheets */}
      <Sheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} title="New Kit Design">
        <NewGraphicKitForm onSuccess={() => { setIsAddSheetOpen(false); loadData(); }} />
      </Sheet>
      <Sheet isOpen={isEditSheetOpen} onClose={() => { setIsEditSheetOpen(false); setEditingKit(null); }} title="Edit Design">
        {editingKit && <EditGraphicKitForm kit={editingKit} onSuccess={() => { setIsEditSheetOpen(false); loadData(); }} />}
      </Sheet>
    </div>
  );
}

function EditGraphicKitForm({ kit, onSuccess }: any) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [preview, setPreview] = useState(kit.images?.[0]);

  const clientAction = async (formData: FormData) => {
    setError(null);
    setPending(true);
    const res = await updateGraphicKitAction(kit.id, formData);
    setPending(false);
    if (res.success) onSuccess();
    else setError(res.error || 'Update failed.');
  };

  return (
    <form action={clientAction} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      {error && <p className="text-red-500 text-xs font-mono uppercase">{error}</p>}
      
      <div className="space-y-3">
        <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Image Preview</label>
        {preview && <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10"><Image src={preview} alt="" fill className="object-cover" /></div>}
        <input type="file" name="image" accept="image/*" onChange={(e: any) => e.target.files[0] && setPreview(URL.createObjectURL(e.target.files[0]))} className="hidden" id="edit-kit-img" />
        <label htmlFor="edit-kit-img" className="block p-4 bg-white/5 border border-white/10 rounded-xl text-center text-[10px] font-mono text-white/40 cursor-pointer uppercase hover:bg-white/10 transition-all">Replace Design Image</label>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Design Name</label>
        <input name="name" defaultValue={kit.name} className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-white text-sm focus:border-wu-red/50 transition-all" required />
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Starting Price (₹)</label>
        <div className="relative">
          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
          <input name="price" type="number" defaultValue={kit.price} className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-6 text-white text-sm focus:border-wu-red/50 transition-all" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Description</label>
        <textarea name="description" defaultValue={kit.description} rows={4} className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-white text-sm focus:border-wu-red/50 transition-all" />
      </div>

      <button type="submit" disabled={pending} className="w-full py-5 bg-wu-red text-white rounded-xl font-display font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-red-600">
        {pending ? 'Syncing...' : 'Save Changes'}
      </button>
    </form>
  );
}
