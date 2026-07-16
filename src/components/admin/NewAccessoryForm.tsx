'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Upload, X, Package, IndianRupee, Zap, Shield, Briefcase, Droplets, Info, Settings } from 'lucide-react';
import Image from 'next/image';
import { createProductAction } from '@/app/admin/products/actions';
import { MOTORCYCLE_ACCESSORIES_STRUCTURE } from '@/data';

interface NewAccessoryFormProps {
  onSuccess: () => void;
}

const TEMPLATE_MAPPING: Record<string, string> = {
  // Liquids
  'Engine Oil': 'liquids',
  'Coolant': 'liquids',
  'Brake Oil': 'liquids',
  'Cleaner': 'liquids',
  'Additives': 'liquids',
  'Lube': 'liquids',
  'Anti Fog': 'liquids',
  'Helmet Cleaner': 'liquids',

  // Luggage
  'Top Box 45L': 'luggage',
  'Saddle Bag': 'luggage',
  'Rack Less Bag': 'luggage',
  'Crash Bar Bag': 'luggage',
  'Tail Bag': 'luggage',
  'Tank Bag': 'luggage',
  'Handle Bar Bag': 'luggage',
  'Backpack 100% Waterproof': 'luggage',
  'Waist Bag': 'luggage',
  'Hydration Bag': 'luggage',

  // Electronics
  'Navigation System': 'electronics',
  'Spark Plug': 'electronics',
  'Lights': 'electronics',
  'Switches': 'electronics',
  'Harness': 'electronics',
  'V6': 'electronics',
  'Q8': 'electronics',
  'EF-7 pro': 'electronics',
  'Indicator': 'electronics',

  // Fabric
  'Body Cover': 'fabric',
  'Gear Shoe Cover': 'fabric',

  // Hardware
  'Oil Filter': 'hardware',
  'Air Filter': 'hardware',
  'Brake Pads': 'hardware',
  'Chain Sprocket': 'hardware',
  'Exhaust': 'hardware',
  'Clamps': 'hardware',
  'Crashguard': 'hardware',
  'Saddle Stay': 'hardware',
  'Stand Extender': 'hardware',
  'Head Light Grill': 'hardware',
  'Radiator Grill': 'hardware',
  'Engine Guard and Skid Plate': 'hardware',
  'Frame Slider': 'hardware',
  'Coolant Guard': 'hardware',
  'Master Cylinder Guard': 'hardware',
  'Foot Peg Extender': 'hardware',
  'Mirror': 'hardware',
  'Tyre Hugger': 'hardware',
  'Hand Guard': 'hardware',

  // General
  'Petrol Cans': 'general',
  'Bungee Cords': 'general',
  'GoPro Mount': 'general',
  'Goggles 100%': 'general',
  'Mobile Mount': 'general',
  'Spools': 'general',
  'Hand Grips': 'general',
  'Brake Lever Grips': 'general',
  'Gear Cover': 'general',
  'Key Chain': 'general',
  'Disc Lock': 'general'
};

export default function NewAccessoryForm({ onSuccess }: NewAccessoryFormProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedSubCategory, setSelectedSubCategory] = React.useState('');
  const [priceType, setPriceType] = React.useState('single');
  const [bikeCompatibility, setBikeCompatibility] = React.useState('all');
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const clientAction = async (formData: FormData) => {
    setError(null);
    formData.append('category_slug', 'bike-accessories');
    
    // Add both category and sub-category for filtering
    formData.append('sub_category', selectedCategory);
    formData.append('sub_item', selectedSubCategory);

    const result = await createProductAction(formData);
    if (result.success) {
      formRef.current?.reset();
      setPreview(null);
      setSelectedCategory('');
      setSelectedSubCategory('');
      onSuccess();
    } else {
      setError(result.error || 'Failed to add Accessory.');
    }
  };

  const currentCategoryData = MOTORCYCLE_ACCESSORIES_STRUCTURE.find(c => c.slug === selectedCategory);

  return (
    <form ref={formRef} action={clientAction} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar pb-10">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-500 text-xs font-mono uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Accessory Image</label>
        <div className="relative group">
          {preview && (
            <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 mb-4">
              <Image src={preview} alt="Preview" fill className="object-cover" />
              <button type="button" onClick={() => setPreview(null)} className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-[#E8161B] transition-all">
                <X size={14} />
              </button>
            </div>
          )}
          
          <label className={`flex flex-col items-center justify-center aspect-square max-w-sm mx-auto rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer group transition-all ${preview ? 'hidden' : ''}`}>
            <Upload className="text-white/20 group-hover:text-[#E8161B] mb-2" size={24} />
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Upload Photo</p>
            <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} required={!preview} />
          </label>
        </div>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Product Name</label>
          <input name="name" type="text" placeholder="e.g. HJG VK-70 Pro Fog Lights" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm" required />
        </div>

        {/* Category & Sub-Category */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Main Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory(''); // Reset sub-category when main changes
              }}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm appearance-none cursor-pointer"
              required
            >
              <option value="" disabled className="bg-[#0A0A0A]">Select Main Category</option>
              {MOTORCYCLE_ACCESSORIES_STRUCTURE.map(cat => (
                <option key={cat.slug} value={cat.slug} className="bg-[#0A0A0A]">{cat.category}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Sub-Category (Item)</label>
            <select 
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              disabled={!selectedCategory}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="" disabled className="bg-[#0A0A0A]">Select Sub-Category</option>
              {currentCategoryData?.items.map(item => (
                <option key={item} value={item} className="bg-[#0A0A0A]">{item}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Price (₹)</label>
              <select 
                name="price_type" 
                value={priceType} 
                onChange={e => setPriceType(e.target.value)}
                className="bg-transparent border-none text-[10px] font-mono text-[#E8161B] uppercase tracking-widest focus:outline-none cursor-pointer"
              >
                <option value="single" className="bg-[#0A0A0A]">Single Price</option>
                <option value="range" className="bg-[#0A0A0A]">Price Range</option>
              </select>
            </div>
            {priceType === 'range' ? (
              <div className="flex gap-4">
                <input name="price" type="number" placeholder="Min" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm" required />
                <input name="price_max" type="number" placeholder="Max" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm" required />
              </div>
            ) : (
              <input name="price" type="number" placeholder="4999" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm" required />
            )}
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase mt-1 block">Stock</label>
            <input name="stock" type="number" placeholder="10" className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm" required />
          </div>
        </div>
        
        {/* Bike Compatibility */}
        <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[10px] text-[#E8161B] tracking-[0.2em] uppercase font-bold">Bike Compatibility</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="bike_compatibility" value="all" checked={bikeCompatibility === 'all'} onChange={() => setBikeCompatibility('all')} className="accent-[#E8161B]" />
                <span className="text-xs font-mono text-white/60">Universal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="bike_compatibility" value="specific" checked={bikeCompatibility === 'specific'} onChange={() => setBikeCompatibility('specific')} className="accent-[#E8161B]" />
                <span className="text-xs font-mono text-white/60">Specific</span>
              </label>
            </div>
          </div>
          {bikeCompatibility === 'specific' && (
            <input name="compatible_bikes" type="text" placeholder="e.g. KTM Duke 390, RC 390" className="w-full bg-[#E8161B]/5 border border-[#E8161B]/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B] transition-all font-body text-sm mt-3" required />
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Description</label>
          <textarea 
            name="description" 
            placeholder="Describe the product..."
            rows={4}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm resize-none"
            required
          />
        </div>
      </div>

      {/* ─── DYNAMIC TEMPLATES ─── */}
      {selectedSubCategory && (
        <div className="pt-6 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <Settings size={16} className="text-[#E8161B]" />
            <h3 className="font-display font-black text-white text-sm uppercase tracking-widest">Technical Specifications</h3>
          </div>

          {/* FOG LIGHTS / ELECTRONICS */}
          {TEMPLATE_MAPPING[selectedSubCategory] === 'electronics' && (
            <div className="grid grid-cols-2 gap-4 bg-[#E8161B]/5 p-5 rounded-2xl border border-[#E8161B]/10">
              <SpecInput label="Brightness (Lumens)" name="lumens" placeholder="e.g. 6000 LM" icon={<Zap size={14}/>} />
              <SpecInput label="Power (Watts)" name="watts" placeholder="e.g. 60W" icon={<Zap size={14}/>} />
              <SpecInput label="Waterproof Rating" name="ip_rating" placeholder="e.g. IP67" icon={<Droplets size={14}/>} />
              <SpecInput label="Operating Voltage" name="voltage" placeholder="e.g. 9V-36V DC" icon={<Settings size={14}/>} />
            </div>
          )}

          {/* BAGS / LUGGAGE */}
          {TEMPLATE_MAPPING[selectedSubCategory] === 'luggage' && (
            <div className="grid grid-cols-2 gap-4 bg-blue-500/5 p-5 rounded-2xl border border-blue-500/10">
              <SpecInput label="Capacity (Liters)" name="capacity" placeholder="e.g. 45L" icon={<Briefcase size={14}/>} />
              <SpecInput label="Material" name="material" placeholder="e.g. 1000D Cordura" icon={<Shield size={14}/>} />
              <SpecInput label="Waterproofing" name="waterproof_status" placeholder="e.g. 100% Waterproof" icon={<Droplets size={14}/>} />
              <SpecInput label="Dimensions" name="dimensions" placeholder="e.g. 40x30x20 cm" icon={<Package size={14}/>} />
            </div>
          )}

          {/* PROTECTION / HARDWARE */}
          {TEMPLATE_MAPPING[selectedSubCategory] === 'hardware' && (
            <div className="grid grid-cols-2 gap-4 bg-orange-500/5 p-5 rounded-2xl border border-orange-500/10">
              <SpecInput label="Material" name="material" placeholder="e.g. Mild Steel" icon={<Shield size={14}/>} />
              <SpecInput label="Finish/Coating" name="finish" placeholder="e.g. Powder Coated" icon={<Settings size={14}/>} />
              <SpecInput label="Weight" name="weight" placeholder="e.g. 4.5kg" icon={<Package size={14}/>} />
              <SpecInput label="Fitment" name="fitment" placeholder="e.g. Direct Bolt-on" icon={<Settings size={14}/>} />
            </div>
          )}

          {/* PERFORMANCE / LIQUIDS */}
          {TEMPLATE_MAPPING[selectedSubCategory] === 'liquids' && (
            <div className="grid grid-cols-2 gap-4 bg-green-500/5 p-5 rounded-2xl border border-green-500/10">
              <SpecInput label="Volume" name="volume" placeholder="e.g. 1L / 500ml" icon={<Droplets size={14}/>} />
              <SpecInput label="Type/Grade" name="type" placeholder="e.g. Full Synthetic" icon={<Droplets size={14}/>} />
              <SpecInput label="Application" name="application" placeholder="e.g. Visor Cleaning" icon={<Settings size={14}/>} />
              <SpecInput label="Features" name="features" placeholder="e.g. Streak-free, UV Protection" icon={<Shield size={14}/>} />
            </div>
          )}

          {/* FABRIC / COVERS */}
          {TEMPLATE_MAPPING[selectedSubCategory] === 'fabric' && (
            <div className="grid grid-cols-2 gap-4 bg-yellow-500/5 p-5 rounded-2xl border border-yellow-500/10">
              <SpecInput label="Material" name="material" placeholder="e.g. 190T Polyester" icon={<Shield size={14}/>} />
              <SpecInput label="Size Options" name="size" placeholder="e.g. Universal / XL" icon={<Package size={14}/>} />
              <SpecInput label="Waterproofing" name="waterproof_status" placeholder="e.g. Water Resistant" icon={<Droplets size={14}/>} />
              <SpecInput label="Care Instructions" name="care" placeholder="e.g. Hand wash only" icon={<Settings size={14}/>} />
            </div>
          )}

          {/* HELMET / GENERAL */}
          {TEMPLATE_MAPPING[selectedSubCategory] === 'general' && (
            <div className="grid grid-cols-2 gap-4 bg-purple-500/5 p-5 rounded-2xl border border-purple-500/10">
              <SpecInput label="Material" name="material" placeholder="e.g. CNC Aluminum" icon={<Shield size={14}/>} />
              <SpecInput label="Color" name="color" placeholder="e.g. Anodized Black" icon={<Settings size={14}/>} />
              <SpecInput label="Fitment" name="fitment" placeholder="e.g. Universal" icon={<Settings size={14}/>} />
              <SpecInput label="Misc" name="misc" placeholder="e.g. Set of 2" icon={<Package size={14}/>} />
            </div>
          )}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function SpecInput({ label, name, placeholder, icon }: { label: string, name: string, placeholder: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase flex items-center gap-2">
        {icon} {label}
      </label>
      <input 
        name={name} 
        type="text" 
        placeholder={placeholder} 
        className="w-full bg-black/40 border border-white/5 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-white/20 font-body text-xs" 
      />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-4 rounded-xl font-display font-black text-xs tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 mt-4 ${
        pending 
          ? 'bg-white/5 text-white/20 cursor-not-allowed' 
          : 'bg-[#E8161B] text-white hover:bg-[#B81015] hover:shadow-[0_10px_30px_rgba(232,22,27,0.4)]'
      }`}
    >
      {pending ? (
        <>
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          Adding Product...
        </>
      ) : (
        'Publish Accessory'
      )}
    </button>
  );
}
