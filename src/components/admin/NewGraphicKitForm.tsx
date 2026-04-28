'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Upload, X, Package, IndianRupee, Bike, Copy } from 'lucide-react';
import Image from 'next/image';
import { createProductAction } from '@/app/admin/products/actions';
import { GRAPHIC_KITS_STRUCTURE } from '@/data';

interface NewGraphicKitFormProps {
  onSuccess: () => void;
}

// Helper to parse complex model strings like "Duke-125/200/390 Gen1" -> ["Duke-125 Gen1", "Duke-200 Gen1", "Duke-390 Gen1"]
function parseModels(modelStr: string): string[] {
  if (!modelStr.includes('/')) return [modelStr];
  
  const parts = modelStr.split(' ');
  const slashPartIndex = parts.findIndex(p => p.includes('/'));
  if (slashPartIndex === -1) return [modelStr];
  
  const slashPart = parts[slashPartIndex];
  const dashSplit = slashPart.split('-');
  let prefix = '';
  let varsStr = slashPart;
  
  if (dashSplit.length > 1) {
    prefix = dashSplit.slice(0, -1).join('-') + '-';
    varsStr = dashSplit[dashSplit.length - 1];
  }
  
  const vars = varsStr.split('/');
  const result: string[] = [];
  
  for (const v of vars) {
    const newParts = [...parts];
    newParts[slashPartIndex] = `${prefix}${v}`;
    result.push(newParts.join(' '));
  }
  
  return result;
}

type PricingMatrix = Record<string, {
  Standard: { Matte: string, Glossy: string },
  Premium: { Matte: string, Glossy: string }
}>;

const defaultPricing = {
  Standard: { Matte: '', Glossy: '' },
  Premium: { Matte: '', Glossy: '' }
};

export default function NewGraphicKitForm({ onSuccess }: NewGraphicKitFormProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const [selectedBrand, setSelectedBrand] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('');
  const [parsedModels, setParsedModels] = React.useState<string[]>([]);
  const [pricingMatrix, setPricingMatrix] = React.useState<PricingMatrix>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Update parsed models and matrix when model changes
  React.useEffect(() => {
    if (!selectedModel) {
      setParsedModels([]);
      setPricingMatrix({});
      return;
    }
    const models = parseModels(selectedModel);
    setParsedModels(models);
    
    // Initialize matrix for new models, preserving existing data if any
    setPricingMatrix(prev => {
      const newMatrix: PricingMatrix = {};
      models.forEach(m => {
        newMatrix[m] = prev[m] || JSON.parse(JSON.stringify(defaultPricing));
      });
      return newMatrix;
    });
  }, [selectedModel]);

  const updatePrice = (model: string, quality: 'Standard' | 'Premium', finish: 'Matte' | 'Glossy', value: string) => {
    setPricingMatrix(prev => ({
      ...prev,
      [model]: {
        ...prev[model],
        [quality]: {
          ...prev[model][quality],
          [finish]: value
        }
      }
    }));
  };

  const copyFirstToAll = () => {
    if (parsedModels.length <= 1) return;
    const firstModel = parsedModels[0];
    const template = pricingMatrix[firstModel];
    
    setPricingMatrix(prev => {
      const newMatrix = { ...prev };
      parsedModels.forEach(m => {
        newMatrix[m] = JSON.parse(JSON.stringify(template));
      });
      return newMatrix;
    });
  };

  const availableModels = React.useMemo(() => {
    if (!selectedBrand) return [];
    return GRAPHIC_KITS_STRUCTURE.find(b => b.brand === selectedBrand)?.models || [];
  }, [selectedBrand]);

  const clientAction = async (formData: FormData) => {
    setError(null);
    
    if (!selectedBrand || !selectedModel) {
      setError("Please select a Brand and Model.");
      return;
    }

    // Validate Pricing Matrix
    for (const model of parsedModels) {
      const p = pricingMatrix[model];
      if (!p.Standard.Matte || !p.Standard.Glossy || !p.Premium.Matte || !p.Premium.Glossy) {
        setError(`Please fill in all prices for ${model}`);
        return;
      }
    }

    // Determine Base Price (using Standard Matte of first model as baseline)
    const basePrice = pricingMatrix[parsedModels[0]].Standard.Matte;

    formData.append('category_slug', 'graphic-kits');
    formData.append('brand', selectedBrand);
    formData.append('model', selectedModel);
    formData.append('price', basePrice);
    formData.append('compatibleModels', JSON.stringify(parsedModels));
    formData.append('pricingMatrix', JSON.stringify(pricingMatrix));

    const result = await createProductAction(formData);
    
    if (result.success) {
      formRef.current?.reset();
      setPreview(null);
      setSelectedBrand('');
      setSelectedModel('');
      onSuccess();
    } else {
      setError(result.error || 'Failed to add Graphic Kit.');
    }
  };

  return (
    <form ref={formRef} action={clientAction} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar pb-10">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl sticky top-0 z-10 backdrop-blur-md">
          <p className="text-red-500 text-xs font-mono uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Design Image</label>
        <div className="relative group">
          {preview && (
            <div className="relative aspect-[4/3] max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 mb-4">
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
          
          <label className={`flex flex-col items-center justify-center aspect-[4/3] max-w-sm mx-auto rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#E8161B]/30 transition-all cursor-pointer group ${preview ? 'hidden' : ''}`}>
            <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-white/40 group-hover:text-[#E8161B]" size={24} />
            </div>
            <p className="text-white/60 font-display font-bold text-sm">Upload Kit Design</p>
            <p className="text-white/20 font-mono text-[10px] mt-2 uppercase tracking-widest text-center px-4">Horizontal format preferred<br/>PNG, JPG up to 5MB</p>
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
              required={!preview} 
            />
          </label>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Design Name</label>
          <div className="relative whitespace-nowrap">
             <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <input 
              name="name"
              type="text" 
              placeholder="e.g. Neon Rush Edition"
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 transition-all font-body text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Bike Brand</label>
          <div className="relative whitespace-nowrap">
             <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <select 
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedModel('');
              }}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 transition-all font-body text-sm appearance-none cursor-pointer"
              required
            >
              <option value="" disabled className="bg-[#0A0A0A]">Select Brand</option>
              {GRAPHIC_KITS_STRUCTURE.map(b => (
                <option key={b.brand} value={b.brand} className="bg-[#0A0A0A]">{b.brand}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Bike Model</label>
          <div className="relative whitespace-nowrap">
             <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 transition-all font-body text-sm appearance-none cursor-pointer disabled:opacity-50"
              required
            >
              <option value="" disabled className="bg-[#0A0A0A]">Select Model</option>
              {availableModels.map(m => (
                <option key={m} value={m} className="bg-[#0A0A0A]">{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── DYNAMIC PRICING MATRIX ─── */}
      {parsedModels.length > 0 && (
        <div className="pt-6 border-t border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-white text-lg uppercase tracking-tight">Pricing Matrix</h3>
              <p className="font-mono text-[9px] text-[#E8161B] tracking-widest uppercase mt-1">Set prices for variants</p>
            </div>
            {parsedModels.length > 1 && (
              <button 
                type="button"
                onClick={copyFirstToAll}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono tracking-widest text-white/70 uppercase transition-all"
              >
                <Copy size={12} /> Apply First to All
              </button>
            )}
          </div>

          <div className="space-y-6">
            {parsedModels.map((model, index) => (
              <div key={model} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#E8161B]/20 text-[#E8161B] font-display font-black flex items-center justify-center text-xs">{index + 1}</div>
                  <h4 className="font-display font-black text-white uppercase tracking-tight">{model.replace(/-/g, ' ')}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 pl-8">
                  {/* Standard */}
                  <div className="space-y-3">
                    <p className="font-mono text-[9px] text-white/50 tracking-widest uppercase border-b border-white/5 pb-1">Standard Quality</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] font-mono text-white/40 uppercase">Matte</span>
                        <div className="relative flex-1">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={12} />
                          <input type="number" required placeholder="0" value={pricingMatrix[model]?.Standard.Matte || ''} onChange={e => updatePrice(model, 'Standard', 'Matte', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-white focus:border-[#E8161B]/50 font-body text-xs" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] font-mono text-white/40 uppercase">Glossy</span>
                        <div className="relative flex-1">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={12} />
                          <input type="number" required placeholder="0" value={pricingMatrix[model]?.Standard.Glossy || ''} onChange={e => updatePrice(model, 'Standard', 'Glossy', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-white focus:border-[#E8161B]/50 font-body text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium */}
                  <div className="space-y-3">
                    <p className="font-mono text-[9px] text-white/50 tracking-widest uppercase border-b border-white/5 pb-1">Premium Quality</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] font-mono text-[#E8161B] uppercase">Matte</span>
                        <div className="relative flex-1">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E8161B]/50" size={12} />
                          <input type="number" required placeholder="0" value={pricingMatrix[model]?.Premium.Matte || ''} onChange={e => updatePrice(model, 'Premium', 'Matte', e.target.value)} className="w-full bg-black/40 border border-[#E8161B]/20 rounded-lg py-1.5 pl-8 pr-3 text-white focus:border-[#E8161B] font-body text-xs" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] font-mono text-[#E8161B] uppercase">Glossy</span>
                        <div className="relative flex-1">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E8161B]/50" size={12} />
                          <input type="number" required placeholder="0" value={pricingMatrix[model]?.Premium.Glossy || ''} onChange={e => updatePrice(model, 'Premium', 'Glossy', e.target.value)} className="w-full bg-black/40 border border-[#E8161B]/20 rounded-lg py-1.5 pl-8 pr-3 text-white focus:border-[#E8161B] font-body text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
      className={`w-full py-4 rounded-xl font-display font-black text-xs tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 mt-8 ${
        pending 
          ? 'bg-white/5 text-white/20 cursor-not-allowed' 
          : 'bg-[#E8161B] text-white hover:bg-[#B81015] hover:shadow-[0_10px_30px_rgba(232,22,27,0.4)]'
      }`}
    >
      {pending ? (
        <>
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          Adding Matrix...
        </>
      ) : (
        'Publish Graphic Kit'
      )}
    </button>
  );
}
