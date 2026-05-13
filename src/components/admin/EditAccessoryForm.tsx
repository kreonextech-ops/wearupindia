'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Upload, X, Package, Zap, Shield, Briefcase, Droplets, Settings } from 'lucide-react';
import Image from 'next/image';
import { updateProductAction } from '@/app/admin/products/actions';
import { MOTORCYCLE_ACCESSORIES_STRUCTURE } from '@/data';

// Extends the base Product type with DB fields returned from the server
interface AccessoryProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock?: number;
  images: string[];
  meta_data?: Record<string, any>;
}

interface EditAccessoryFormProps {
  product: AccessoryProduct;
  onSuccess: () => void;
}

const TEMPLATE_MAPPING: Record<string, string> = {
  'Liqui Moly': 'liquids', 'Brake Oil': 'liquids', 'Anti Fog': 'liquids', 'Helmet Cleaner': 'liquids',
  'Top Box 45L': 'luggage', 'Saddle Bag': 'luggage', 'Rack Less Bag': 'luggage', 'Crash Bar Bag': 'luggage',
  'Tail Bag': 'luggage', 'Tank Bag': 'luggage', 'Handle Bar Bag': 'luggage',
  'Backpack 100% Waterproof': 'luggage', 'Waist Bag': 'luggage', 'Hydration Bag': 'luggage',
  'Navigation System': 'electronics', 'Foglight - 5 LED': 'electronics', 'Fog Light - 4 LED': 'electronics',
  'Fog Light - P49': 'electronics', 'MG - VK 70 Pro': 'electronics', 'VK 50 S': 'electronics', 'VK 60': 'electronics',
  'Body Cover': 'fabric', 'Gear Shoe Cover': 'fabric',
  'BMC Air Filter': 'hardware', 'RCB Brakes': 'hardware', 'RCB Suspension': 'hardware',
  'Crashguard': 'hardware', 'Saddle Stay': 'hardware', 'Stand Extender': 'hardware',
  'Head Light Grill': 'hardware', 'Radiator Grill': 'hardware', 'Engine Guard and Skid Plate': 'hardware',
  'Frame Slider': 'hardware', 'Coolant Guard': 'hardware', 'Master Cylinder Guard': 'hardware', 'Foot Peg Extender': 'hardware',
  'Petrol Cans': 'general', 'Bungee Cords': 'general', 'GoPro Mount': 'general', 'Goggles 100%': 'general',
  'Foglight Clamp': 'general', 'Mobile Mount': 'general', 'Spools': 'general', 'Hand Grips': 'general',
  'Brake Lever Grips': 'general', 'Gear Cover': 'general', 'Key Chain': 'general', 'Disc Lock': 'general',
};

export default function EditAccessoryForm({ product, onSuccess }: EditAccessoryFormProps) {
  const [preview, setPreview] = React.useState<string | null>(product.images?.[0] || null);
  const [newImageSelected, setNewImageSelected] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState(product.meta_data?.sub_category || '');
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(product.meta_data?.sub_item || '');
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setNewImageSelected(true);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setNewImageSelected(false);
    // Reset the file input
    const fileInput = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const clientAction = async (formData: FormData) => {
    setError(null);

    const result = await updateProductAction(product.id, formData);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Failed to update accessory.');
    }
  };

  const currentCategoryData = MOTORCYCLE_ACCESSORIES_STRUCTURE.find(c => c.slug === selectedCategory);
  const existingSpecs = product.meta_data?.specs || {};

  return (
    <form ref={formRef} action={clientAction} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar pb-10">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-500 text-xs font-mono uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Image */}
      <div className="space-y-2">
        <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Accessory Image</label>
        {preview && (
          <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 mb-2">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <button type="button" onClick={clearImage} className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-[#E8161B] transition-all">
              <X size={14} />
            </button>
          </div>
        )}
        {!preview && (
          <label className="flex flex-col items-center justify-center aspect-square max-w-sm mx-auto rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all">
            <Upload className="text-white/20 hover:text-[#E8161B] mb-2" size={24} />
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Upload New Photo</p>
            <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        )}
        {preview && !newImageSelected && (
          <label className="flex items-center justify-center gap-2 py-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all">
            <Upload size={14} className="text-white/40" />
            <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Replace Image</span>
            <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        )}
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Product Name</label>
          <input
            name="name"
            type="text"
            defaultValue={product.name}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm"
            required
          />
        </div>

        {/* Category & Sub-Category */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Main Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubCategory(''); }}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm appearance-none cursor-pointer"
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
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm appearance-none cursor-pointer disabled:opacity-50"
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
            <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Price (₹)</label>
            <input
              name="price"
              type="number"
              defaultValue={product.price}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Stock</label>
            <input
              name="stock"
              type="number"
              defaultValue={product.stock ?? 0}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Description</label>
          <textarea
            name="description"
            defaultValue={product.description || ''}
            rows={4}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E8161B]/50 font-body text-sm resize-none"
            required
          />
        </div>
      </div>

      {/* Dynamic Specs */}
      {selectedSubCategory && (
        <div className="pt-6 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <Settings size={16} className="text-[#E8161B]" />
            <h3 className="font-display font-black text-white text-sm uppercase tracking-widest">Technical Specifications</h3>
          </div>

          {TEMPLATE_MAPPING[selectedSubCategory] === 'electronics' && (
            <div className="grid grid-cols-2 gap-4 bg-[#E8161B]/5 p-5 rounded-2xl border border-[#E8161B]/10">
              <SpecInput label="Brightness (Lumens)" name="lumens" placeholder="e.g. 6000 LM" defaultValue={existingSpecs.lumens} icon={<Zap size={14}/>} />
              <SpecInput label="Power (Watts)" name="watts" placeholder="e.g. 60W" defaultValue={existingSpecs.watts} icon={<Zap size={14}/>} />
              <SpecInput label="Waterproof Rating" name="ip_rating" placeholder="e.g. IP67" defaultValue={existingSpecs.ip_rating} icon={<Droplets size={14}/>} />
              <SpecInput label="Operating Voltage" name="voltage" placeholder="e.g. 9V-36V DC" defaultValue={existingSpecs.voltage} icon={<Settings size={14}/>} />
            </div>
          )}

          {TEMPLATE_MAPPING[selectedSubCategory] === 'luggage' && (
            <div className="grid grid-cols-2 gap-4 bg-blue-500/5 p-5 rounded-2xl border border-blue-500/10">
              <SpecInput label="Capacity (Liters)" name="capacity" placeholder="e.g. 45L" defaultValue={existingSpecs.capacity} icon={<Briefcase size={14}/>} />
              <SpecInput label="Material" name="material" placeholder="e.g. 1000D Cordura" defaultValue={existingSpecs.material} icon={<Shield size={14}/>} />
              <SpecInput label="Waterproofing" name="waterproof_status" placeholder="e.g. 100% Waterproof" defaultValue={existingSpecs.waterproof_status} icon={<Droplets size={14}/>} />
              <SpecInput label="Dimensions" name="dimensions" placeholder="e.g. 40x30x20 cm" defaultValue={existingSpecs.dimensions} icon={<Package size={14}/>} />
            </div>
          )}

          {TEMPLATE_MAPPING[selectedSubCategory] === 'hardware' && (
            <div className="grid grid-cols-2 gap-4 bg-orange-500/5 p-5 rounded-2xl border border-orange-500/10">
              <SpecInput label="Material" name="material" placeholder="e.g. Mild Steel" defaultValue={existingSpecs.material} icon={<Shield size={14}/>} />
              <SpecInput label="Finish/Coating" name="finish" placeholder="e.g. Powder Coated" defaultValue={existingSpecs.finish} icon={<Settings size={14}/>} />
              <SpecInput label="Weight" name="weight" placeholder="e.g. 4.5kg" defaultValue={existingSpecs.weight} icon={<Package size={14}/>} />
              <SpecInput label="Fitment" name="fitment" placeholder="e.g. Direct Bolt-on" defaultValue={existingSpecs.fitment} icon={<Settings size={14}/>} />
            </div>
          )}

          {TEMPLATE_MAPPING[selectedSubCategory] === 'liquids' && (
            <div className="grid grid-cols-2 gap-4 bg-green-500/5 p-5 rounded-2xl border border-green-500/10">
              <SpecInput label="Volume" name="volume" placeholder="e.g. 1L / 500ml" defaultValue={existingSpecs.volume} icon={<Droplets size={14}/>} />
              <SpecInput label="Type/Grade" name="type" placeholder="e.g. Full Synthetic" defaultValue={existingSpecs.type} icon={<Droplets size={14}/>} />
              <SpecInput label="Application" name="application" placeholder="e.g. Visor Cleaning" defaultValue={existingSpecs.application} icon={<Settings size={14}/>} />
              <SpecInput label="Features" name="features" placeholder="e.g. Streak-free, UV Protection" defaultValue={existingSpecs.features} icon={<Shield size={14}/>} />
            </div>
          )}

          {TEMPLATE_MAPPING[selectedSubCategory] === 'fabric' && (
            <div className="grid grid-cols-2 gap-4 bg-yellow-500/5 p-5 rounded-2xl border border-yellow-500/10">
              <SpecInput label="Material" name="material" placeholder="e.g. 190T Polyester" defaultValue={existingSpecs.material} icon={<Shield size={14}/>} />
              <SpecInput label="Size Options" name="size" placeholder="e.g. Universal / XL" defaultValue={existingSpecs.size} icon={<Package size={14}/>} />
              <SpecInput label="Waterproofing" name="waterproof_status" placeholder="e.g. Water Resistant" defaultValue={existingSpecs.waterproof_status} icon={<Droplets size={14}/>} />
              <SpecInput label="Care Instructions" name="care" placeholder="e.g. Hand wash only" defaultValue={existingSpecs.care} icon={<Settings size={14}/>} />
            </div>
          )}

          {TEMPLATE_MAPPING[selectedSubCategory] === 'general' && (
            <div className="grid grid-cols-2 gap-4 bg-purple-500/5 p-5 rounded-2xl border border-purple-500/10">
              <SpecInput label="Material" name="material" placeholder="e.g. CNC Aluminum" defaultValue={existingSpecs.material} icon={<Shield size={14}/>} />
              <SpecInput label="Color" name="color" placeholder="e.g. Anodized Black" defaultValue={existingSpecs.color} icon={<Settings size={14}/>} />
              <SpecInput label="Fitment" name="fitment" placeholder="e.g. Universal" defaultValue={existingSpecs.fitment} icon={<Settings size={14}/>} />
              <SpecInput label="Misc" name="misc" placeholder="e.g. Set of 2" defaultValue={existingSpecs.misc} icon={<Package size={14}/>} />
            </div>
          )}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function SpecInput({
  label, name, placeholder, defaultValue, icon
}: {
  label: string; name: string; placeholder: string; defaultValue?: string; icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue || ''}
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
          Saving Changes...
        </>
      ) : (
        'Save Changes'
      )}
    </button>
  );
}
