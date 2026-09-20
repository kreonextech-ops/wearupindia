'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Upload, X, Package, IndianRupee, AlignLeft, Tags, Scissors } from 'lucide-react';
import Image from 'next/image';
import { createTShirtAction } from '@/app/admin/products/actions';

interface NewTShirtFormProps {
  onSuccess: () => void;
}

export default function NewTShirtForm({ onSuccess }: NewTShirtFormProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const clientAction = async (formData: FormData) => {
    setError(null);
    
    const result = await createTShirtAction(formData);
    
    if (result.success) {
      formRef.current?.reset();
      setPreview(null);
      onSuccess();
    } else {
      setError(result.error || 'Failed to add T-Shirt.');
    }
  };

  return (
    <form ref={formRef} action={clientAction} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-500 text-xs font-mono uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Apparel Image</label>
        <div className="relative group">
          {preview && (
            <div className="relative aspect-[3/4] max-w-xs mx-auto rounded-2xl overflow-hidden border border-white/10 mb-4">
              <Image src={preview} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-[#E8161B] transition-all"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <label className={`flex flex-col items-center justify-center aspect-[3/4] max-w-xs mx-auto rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#E8161B]/30 transition-all cursor-pointer group ${preview ? 'hidden' : ''}`}>
            <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-white/40 group-hover:text-[#E8161B]" size={24} />
            </div>
            <p className="text-white/60 font-display font-bold text-sm">Upload Design</p>
            <p className="text-white/20 font-mono text-[10px] mt-2 uppercase tracking-widest text-center px-4">Ideal size: 1200x1600px</p>
            <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} required={!preview} />
          </label>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Product Name</label>
          <div className="relative">
             <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <input name="name" type="text" placeholder="e.g. Graphic Oversized Tee" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#E8161B]/50 transition-all text-sm outline-none" required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Price (₹)</label>
          <div className="relative">
             <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <input name="price" type="number" placeholder="999" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#E8161B]/50 transition-all text-sm outline-none" required />
          </div>
        </div>

        <div className="space-y-2">
           <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Total Stock</label>
           <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input name="stock" type="number" placeholder="100" defaultValue="100" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#E8161B]/50 transition-all text-sm outline-none" required />
           </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Description</label>
        <textarea name="description" rows={4} placeholder="Enter apparel details..." className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:border-[#E8161B]/50 transition-all text-sm outline-none" required />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`w-full py-4 rounded-xl font-display font-black text-xs tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 ${pending ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#E8161B] text-white hover:bg-[#B81015]'}`}>
      {pending ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Publish T-Shirt'}
    </button>
  );
}
