'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Upload, X, Package, Tag, IndianRupee, Database, AlignLeft } from 'lucide-react';
import { createProductAction } from '@/app/admin/products/actions';
import Image from 'next/image';

interface NewProductFormProps {
  onSuccess: () => void;
}

export default function NewProductForm({ onSuccess }: NewProductFormProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const clientAction = async (formData: FormData) => {
    setError(null);
    const result = await createProductAction(formData);
    
    if (result.success) {
      formRef.current?.reset();
      setPreview(null);
      onSuccess();
    } else {
      setError(result.error || 'Failed to deploy product.');
    }
  };

  return (
    <form ref={formRef} action={clientAction} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-500 text-xs font-mono uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Image Upload Dropzone */}
      <div className="space-y-3">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Visual Asset</label>
        <div className="relative group">
          {preview ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
              <Image src={preview} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-[#E8161B] transition-all"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#E8161B]/30 transition-all cursor-pointer group">
              <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload className="text-white/40 group-hover:text-[#E8161B]" size={24} />
              </div>
              <p className="text-white/60 font-display font-bold text-sm">Drop product render here</p>
              <p className="text-white/20 font-mono text-[10px] mt-2 uppercase tracking-widest">PNG, JPG up to 5MB</p>
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
                required 
              />
            </label>
          )}
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Core Designation (Name)</label>
          <div className="relative whitespace-nowrap">
             <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <input 
              name="name"
              type="text" 
              placeholder="e.g. Stealth Exhaust Wrap"
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 transition-all font-body text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Valuation (Price)</label>
          <div className="relative whitespace-nowrap">
             <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <input 
              name="price"
              type="number" 
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 transition-all font-body text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Stockpile (Units)</label>
          <div className="relative whitespace-nowrap">
             <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <input 
              name="stock"
              type="number" 
              placeholder="42"
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 transition-all font-body text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2 col-span-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Sector (Category)</label>
          <div className="relative whitespace-nowrap">
             <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <select 
              name="category_slug"
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 transition-all font-body text-sm appearance-none cursor-pointer"
              required
            >
              <option value="" className="bg-[#0A0A0A]">Select Sector...</option>
              <option value="stickers-wraps" className="bg-[#0A0A0A]">Stickers & Wraps</option>
              <option value="accessories" className="bg-[#0A0A0A]">Accessories</option>
              <option value="merchandise" className="bg-[#0A0A0A]">Merchandise</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 col-span-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Mission Brief (Description)</label>
          <div className="relative">
             <AlignLeft className="absolute left-4 top-4 text-white/20" size={16} />
             <textarea 
              name="description"
              rows={4}
              placeholder="Tactical specifications..."
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 transition-all font-body text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-4 rounded-xl font-display font-black text-xs tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 ${
        pending 
          ? 'bg-white/5 text-white/20 cursor-not-allowed' 
          : 'bg-[#E8161B] text-white hover:bg-[#B81015] hover:shadow-[0_10px_30px_rgba(232,22,27,0.4)]'
      }`}
    >
      {pending ? (
        <>
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          Deploying to Grid...
        </>
      ) : (
        'Deploy Tactical Asset'
      )}
    </button>
  );
}
