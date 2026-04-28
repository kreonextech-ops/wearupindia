'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Upload, X, Package, IndianRupee, Bike, Copy, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { createGraphicKitAction } from '@/app/admin/products/actions';
import { GRAPHIC_KITS_STRUCTURE } from '@/data';

interface NewGraphicKitFormProps {
  onSuccess: () => void;
}

function parseModels(modelStr: string): string[] {
  if (!modelStr.includes('/')) return [modelStr];
  const parts = modelStr.split(' ');
  const slashPartIndex = parts.findIndex(p => p.includes('/'));
  if (slashPartIndex === -1) return [modelStr];
  const slashPart = parts[slashPartIndex];
  const dashSplit = slashPart.split('-');
  let prefix = dashSplit.length > 1 ? dashSplit.slice(0, -1).join('-') + '-' : '';
  const varsStr = dashSplit[dashSplit.length - 1];
  const vars = varsStr.split('/');
  return vars.map(v => {
    const newParts = [...parts];
    newParts[slashPartIndex] = `${prefix}${v}`;
    return newParts.join(' ');
  });
}

const defaultPricing = {
  Standard: { Matte: '1499', Glossy: '1499' },
  Premium: { Matte: '2499', Glossy: '2499' }
};

export default function NewGraphicKitForm({ onSuccess }: NewGraphicKitFormProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [selectedBrand, setSelectedBrand] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('');
  const [parsedModels, setParsedModels] = React.useState<string[]>([]);
  const [pricingMatrix, setPricingMatrix] = React.useState<any>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  React.useEffect(() => {
    if (!selectedModel) { setParsedModels([]); setPricingMatrix({}); return; }
    const models = parseModels(selectedModel);
    setParsedModels(models);
    setPricingMatrix((prev: any) => {
      const newMatrix: any = {};
      models.forEach(m => { newMatrix[m] = prev[m] || JSON.parse(JSON.stringify(defaultPricing)); });
      return newMatrix;
    });
  }, [selectedModel]);

  const updatePrice = (model: string, quality: string, finish: string, value: string) => {
    setPricingMatrix((prev: any) => ({
      ...prev,
      [model]: { ...prev[model], [quality]: { ...prev[model][quality], [finish]: value } }
    }));
  };

  const clientAction = async (formData: FormData) => {
    setError(null);
    if (!selectedBrand || !selectedModel) { setError("Select Brand & Model."); return; }
    
    formData.append('brand', selectedBrand);
    formData.append('model', selectedModel);
    formData.append('compatibleModels', JSON.stringify(parsedModels));
    formData.append('pricingMatrix', JSON.stringify(pricingMatrix));

    const result = await createGraphicKitAction(formData);
    if (result.success) {
      formRef.current?.reset();
      setPreview(null);
      onSuccess();
    } else {
      setError(result.error || 'Failed to add kit.');
    }
  };

  return (
    <form ref={formRef} action={clientAction} className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar pb-10">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-red-500 text-xs font-mono uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Kit Preview Image</label>
        <div className="relative group">
          {preview ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
              <Image src={preview} alt="Preview" fill className="object-cover" />
              <button type="button" onClick={() => setPreview(null)} className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all"><X size={16} /></button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#E8161B]/30 transition-all cursor-pointer">
              <Upload className="text-white/20 mb-4" size={32} />
              <p className="text-white/60 font-display font-bold text-sm uppercase tracking-widest">Upload Kit Design</p>
              <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} required />
            </label>
          )}
        </div>
      </div>

      {/* Brand & Model */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Design Name</label>
          <input name="name" type="text" placeholder="e.g. Stealth Black Edition" className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-white focus:border-[#E8161B]/50 transition-all text-sm" required />
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Bike Brand</label>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-white focus:border-[#E8161B]/50 transition-all text-sm appearance-none cursor-pointer" required>
            <option value="" disabled className="bg-[#0A0A0A]">Select Brand</option>
            {GRAPHIC_KITS_STRUCTURE.map(b => <option key={b.brand} value={b.brand} className="bg-[#0A0A0A]">{b.brand}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Bike Model</label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand} className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-white focus:border-[#E8161B]/50 transition-all text-sm appearance-none cursor-pointer disabled:opacity-30" required>
            <option value="" disabled className="bg-[#0A0A0A]">Select Model</option>
            {(GRAPHIC_KITS_STRUCTURE.find(b => b.brand === selectedBrand)?.models || []).map(m => <option key={m} value={m} className="bg-[#0A0A0A]">{m}</option>)}
          </select>
        </div>
      </div>

      {/* Pricing Matrix */}
      {parsedModels.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-white/5">
          <h3 className="font-display font-black text-white text-lg uppercase tracking-tight">Pricing & Variants</h3>
          <div className="space-y-4">
            {parsedModels.map((model) => (
              <div key={model} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
                <p className="font-display font-bold text-wu-red text-xs uppercase tracking-widest">{model}</p>
                <div className="grid grid-cols-2 gap-8">
                  {['Standard', 'Premium'].map(q => (
                    <div key={q} className="space-y-4">
                      <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] border-b border-white/5 pb-2">{q} Quality</p>
                      {['Matte', 'Glossy'].map(f => (
                        <div key={f} className="flex items-center gap-4">
                          <span className="w-12 text-[10px] font-mono text-white/20 uppercase">{f}</span>
                          <div className="relative flex-1">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" size={12} />
                            <input type="number" value={pricingMatrix[model]?.[q]?.[f] || ''} onChange={e => updatePrice(model, q, f, e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-white text-xs focus:border-[#E8161B]/30 transition-all" required />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Description</label>
        <textarea name="description" rows={4} placeholder="Enter kit details..." className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-white focus:border-[#E8161B]/50 transition-all text-sm" required />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`w-full py-5 rounded-xl font-display font-black text-xs tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 ${pending ? 'bg-white/5 text-white/20' : 'bg-[#E8161B] text-white hover:bg-[#B81015]'}`}>
      {pending ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Publish Graphic Kit'}
    </button>
  );
}
