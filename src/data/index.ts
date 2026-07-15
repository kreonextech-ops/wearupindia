import { getAssetUrl } from '@/lib/assets';

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accentColor: string;
  isComingSoon?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  inStock: boolean;
  isNew?: boolean;
  is_featured?: boolean;
  isBestSeller?: boolean;
  compatibleBrands: string[];
  compatibleModels?: string[];
  // Admin-editable rich content blocks
  kitIncludes?: string[];
  installationSteps?: { step: number; title: string; desc: string }[];
  whyChoose?: { icon: string; title: string; desc: string }[];
  marketingTagline?: string;
  // Dynamic metadata for accessories, graphic kits, t-shirts
  meta_data?: Record<string, any>;
};

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  subPrices?: { label: string; value: string }[];
  duration: string;
  image: string;
  features: string[];
  process: { step: string; title: string; desc: string }[];
};

export type Brand = {
  name: string;
  slug: string;
  image: string;
  models: string[];
};

export const GRAPHIC_KITS_STRUCTURE = [
  { brand: 'Ather', slug: 'ather', models: ['Ather 450X'] },
  { brand: 'Bajaj', slug: 'bajaj', models: ['Dominar-250/400', 'Pulsar 220', 'Pulsar NS-125/160/200', 'Pulsar NS 400', 'Pulsar N160/250', 'Pulsar RS'] },
  { brand: 'KTM', slug: 'ktm', models: ['Duke-125/200/390 Gen1', 'Duke-125/200/250/390 Gen2', 'Duke-250/390 Gen 3', 'Adventure-250/390 Gen 1', 'Adventure-250/390 Gen 2', 'RC-125/200/390 Gen 1', 'RC-125/200/390 Gen 2'] },
  { brand: 'Royal Enfield', slug: 'royal-enfield', models: ['Himalayan'] },
  { brand: 'TVS', slug: 'tvs', models: ['Ntorq', 'RTR-160/200 4V', 'RR310', 'RTX-300'] },
  { brand: 'Yamaha', slug: 'yamaha', models: ['Aerox-155', 'MT-15', 'R3', 'V2', 'V3', 'V4', 'FZ-25'] },
  { brand: 'BMW', slug: 'bmw', models: ['G310GS', 'S1000RR-(2019-2022)'] },
  { brand: 'Hero', slug: 'hero', models: ['Xpulse 200', 'Xpulse 210'] },
  { brand: 'Triumph', slug: 'triumph', models: ['Street Triple 765 RS'] },
  { brand: 'Kawasaki', slug: 'kawasaki', models: ['Ninja 300', 'Ninja 650', 'Z800', 'Z900', 'ZX10R-2016/2020', 'ZX6R-2019/2023', 'ZX6R-2024/2026'] },
  { brand: 'Honda', slug: 'honda', models: ['CBR-150/250', 'CBR650R-2019/2022', 'NX500'] },
  { brand: 'Suzuki', slug: 'suzuki', models: ['Hayabusa', 'Gixxer SF-155/250'] },
];

export const MOTORCYCLE_ACCESSORIES_STRUCTURE = [
  {
    category: 'Performance',
    slug: 'performance',
    items: ['Engine Oil', 'Oil Filter', 'Coolant', 'Brake Oil', 'Spark Plug', 'Air Filter', 'Cleaner', 'Additives', 'Brake Pads', 'Chain Sprocket', 'Lube', 'Exhaust']
  },
  {
    category: 'Luggage Accessories Touring',
    slug: 'luggage-accessories-touring',
    items: ['Top Box 45L', 'Petrol Cans', 'Bungee Cords', 'Navigation System']
  },
  {
    category: 'Fog Lights',
    slug: 'fog-lights',
    items: ['Lights', 'Clamps', 'Switches', 'Harness']
  },
  {
    category: 'Bags and Backpacks',
    slug: 'bags-and-backpacks',
    items: ['Saddle Bag', 'Rack Less Bag', 'Crash Bar Bag', 'Tail Bag', 'Tank Bag', 'Handle Bar Bag', 'Backpack 100% Waterproof', 'Waist Bag', 'Hydration Bag']
  },
  {
    category: 'Helmet',
    slug: 'helmet',
    items: ['Anti Fog', 'Helmet Cleaner', 'GoPro Mount', 'Goggles 100%']
  },
  {
    category: 'Accessories',
    slug: 'accessories',
    items: ['Mobile Mount', 'GoPro Mount', 'Spools', 'Hand Grips', 'Brake Lever Grips', 'Gear Cover', 'Gear Shoe Cover', 'Key Chain', 'Mirror', 'Tyre Hugger', 'Indicator']
  },
  {
    category: 'Bike Protection',
    slug: 'bike-protection',
    items: ['Crashguard', 'Saddle Stay', 'Stand Extender', 'Head Light Grill', 'Radiator Grill', 'Body Cover', 'Engine Guard and Skid Plate', 'Frame Slider', 'Disc Lock', 'Coolant Guard', 'Master Cylinder Guard', 'Foot Peg Extender', 'Hand Guard']
  },
  {
    category: 'Intercom & BT Devices',
    slug: 'intercom-bt-devices',
    items: ['V6', 'Q8', 'EF-7 pro']
  },
  {
    category: 'Bike Body Parts',
    slug: 'bike-body-parts',
    items: []
  }
];

export type AccessoryCategory = {
  name: string;
  slug: string;
  image: string;
  items: string[];
};

const ACCESSORY_CATEGORY_IMAGES: Record<string, string> = {
  'performance': '/images/accessory-categories/Performance.png',
  'luggage-accessories-touring': '/images/accessory-categories/Luggage Accessories Touring.png',
  'fog-lights': '/images/accessory-categories/Fog lights.png',
  'bags-and-backpacks': '/images/accessory-categories/Bags and Backpacks.png',
  'helmet': '/images/accessory-categories/Helmet.png',
  'accessories': '/images/accessory-categories/Accessories.png',
  'bike-protection': '/images/accessory-categories/Bike protection.png',
};

export const accessoryCategories: AccessoryCategory[] = MOTORCYCLE_ACCESSORIES_STRUCTURE.map(cat => ({
  name: cat.category,
  slug: cat.slug,
  image: ACCESSORY_CATEGORY_IMAGES[cat.slug] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80',
  items: cat.items
}));

export const categories: Category[] = [
  {
    slug: 'graphic-kits',
    name: 'Graphic Kits',
    tagline: 'Durability Meets Design',
    description: 'Bold looks, built to endure this graphics kit is UV-resistant, monsoon-proof, and bubble-free for a clean, flawless finish every time. Finished with a tough triple layer laminate, it delivers extra durability, vibrant colors, and long lasting style. Ride hard, stay sharp in any condition.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    accentColor: '#E8161B',
  },
  {
    slug: 'bike-accessories',
    name: 'Bike Accessories',
    tagline: 'Upgrade your ride',
    description: 'Premium bike accessories that protects, boost performance, comfort, and style engineered to handle every road you take.',
    image: '/images/accessory-categories/Accessories.png',
    accentColor: '#E8161B',
  },
  {
    slug: 'keychains',
    name: 'Keychains',
    tagline: 'Pocket Essentials',
    description: 'Premium metal and leather keychains for riders who value detail. Coming Soon.',
    image: getAssetUrl('/images/categories/keychains_v2.png'),
    accentColor: '#E8161B',
    isComingSoon: true,
  },
  {
    slug: 'tshirts',
    name: 'T-Shirts',
    tagline: 'Wear The Brand',
    description: 'Minimalist, high-quality rider apparel designed for comfort on and off the saddle.',
    image: getAssetUrl('/images/categories/tshirts_v2.png'),
    accentColor: '#E8161B',
    isComingSoon: false,
  },
  {
    slug: 'hoodies',
    name: 'Hoodies',
    tagline: 'Ride in Comfort',
    description: 'Heavyweight, premium hoodies for those cold morning sprints. Coming Soon.',
    image: getAssetUrl('/images/categories/hoodies_v2.png'),
    accentColor: '#E8161B',
    isComingSoon: true,
  },
];

export const products: Product[] = [];
export const brands: Brand[] = [
  { name: 'Ather', slug: 'ather', image: '/images/brands/ather.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'ather')?.models || [] },
  { name: 'Bajaj', slug: 'bajaj', image: '/images/brands/pulsar.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'bajaj')?.models || [] },
  { name: 'KTM', slug: 'ktm', image: '/images/brands/ktm.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'ktm')?.models || [] },
  { name: 'Royal Enfield', slug: 'royal-enfield', image: '/images/brands/royal-enfield.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'royal-enfield')?.models || [] },
  { name: 'TVS', slug: 'tvs', image: '/images/brands/tvs.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'tvs')?.models || [] },
  { name: 'Yamaha', slug: 'yamaha', image: '/images/brands/yamaha.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'yamaha')?.models || [] },
  { name: 'BMW', slug: 'bmw', image: '/images/brands/bmw.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'bmw')?.models || [] },
  { name: 'Hero', slug: 'hero', image: '/images/brands/hero.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'hero')?.models || [] },
  { name: 'Triumph', slug: 'triumph', image: 'https://pub-31f370b9c507419ebf40c697be9f14c7.r2.dev/images/brands/triumph.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'triumph')?.models || [] },
  { name: 'Kawasaki', slug: 'kawasaki', image: '/images/brands/kawasaki.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'kawasaki')?.models || [] },
  { name: 'Honda', slug: 'honda', image: '/images/brands/honda.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'honda')?.models || [] },
  { name: 'Suzuki', slug: 'suzuki', image: '/images/brands/suzuki.jpeg', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'suzuki')?.models || [] },
];

export const MODEL_IMAGES: Record<string, string> = {
  // Ather
  'ather-450x': '/images/models/ather/ather450x.jpeg',
  // Bajaj
  'dominar-250-400': '/images/models/bajaj/dominar 400.jpeg',
  'pulsar-220': '/images/models/bajaj/pulsar 220.jpeg',
  'pulsar-ns-125-160-200': '/images/models/bajaj/ns160.jpeg',
  'pulsar-ns-400': '/images/models/bajaj/n400.jpeg',
  'pulsar-n160-250': '/images/models/bajaj/n160.jpeg',
  'pulsar-rs': '/images/models/bajaj/pulsar rs.jpeg',
  // BMW
  'g310gs': '/images/models/bmw/g310gs.jpeg',
  's1000rr-2019-2022': '/images/models/bmw/s1000rr.jpeg',
  // Hero
  'xpulse-200': '/images/models/hero/xpulse200.jpeg',
  'xpulse-210': 'https://pub-31f370b9c507419ebf40c697be9f14c7.r2.dev/images/models/hero/xpulse210.jpeg',
  // Triumph
  'street-triple-765-rs': 'https://pub-31f370b9c507419ebf40c697be9f14c7.r2.dev/images/models/triumph/street-triple-765-rs.jpeg',
  // Honda
  'cbr-150-250': '/images/models/honda/cbr150.jpeg',
  'cbr650r-2019-2022': '/images/models/honda/cbr650.jpeg',
  'nx500': '/images/models/honda/nx500.jpeg',
  // Kawasaki
  'ninja-300': '/images/models/kawasaki/ninja300.jpeg',
  'ninja-650': '/images/models/kawasaki/ninja650.jpeg',
  'z800': '/images/models/kawasaki/z800.jpeg',
  'z900': '/images/models/kawasaki/z900.jpeg',
  'zx10r-2016-2020': '/images/models/kawasaki/zx10r-20162020.jpeg',
  'zx6r-2019-2023': '/images/models/kawasaki/zx6r-20192023.jpeg',
  'zx6r-2024-2026': '/images/models/kawasaki/zx6r-20242026.jpeg',
  // KTM
  'duke-125-200-390-gen1': '/images/models/ktm/duke gen 1.jpeg',
  'duke-125-200-250-390-gen2': '/images/models/ktm/duke 2nd gen.jpeg',
  'duke-250-390-gen-3': '/images/models/ktm/duke 3rd gen.jpeg',
  'adventure-250-390-gen-1': '/images/models/ktm/adventure gen 1.jpeg',
  'adventure-250-390-gen-2': '/images/models/ktm/adventure gen 2.jpeg',
  'rc-125-200-390-gen-1': '/images/models/ktm/rc gen 1.jpeg',
  'rc-125-200-390-gen-2': '/images/models/ktm/rc gen 2.jpeg',
  // RE
  'himalayan': '/images/models/royal enfield/himalyan.jpeg',
  // Suzuki
  'hayabusa': '/images/models/suzuki/Hayabusa.jpeg',
  'gixxer-sf-155-250': '/images/models/suzuki/gixxer sf-155250.jpeg',
  // TVS
  'ntorq': '/images/models/tvs/ntorq.jpeg',
  'rtr-160-200-4v': '/images/models/tvs/rtr160.jpeg',
  'rr310': '/images/models/tvs/rr310.jpeg',
  'rtx-300': '/images/models/tvs/rtx300.jpeg',
  // Yamaha
  'aerox-155': '/images/models/yamaha/aerox155.jpeg',
  'mt-15': '/images/models/yamaha/mt15.jpeg',
  'r3': '/images/models/yamaha/r3.jpeg',
  'v2': '/images/models/yamaha/v2.jpeg',
  'v3': '/images/models/yamaha/v3.jpeg',
  'v4': '/images/models/yamaha/v4.jpeg',
  'fz-25': '/images/models/yamaha/fz25.jpeg',
};

export const services: Service[] = [
  {
    slug: 'bike-wrapping',
    name: 'Bike Wrapping',
    tagline: 'Premium Custom Vinyl Wraps',
    description: 'Elite customization for your motorcycle using world-class vinyl from 3M and Avery Dennison. Our wraps are heat-formed, edge-sealed, and UV-protected to withstand the harsh Indian climate while giving your bike a factory-fresh or custom show-stopper look.',
    price: 'From ₹4,999',
    duration: '2–4 Days',
    image: getAssetUrl('/images/services/wrapping.png'),
    features: [
      '3M & Avery Dennison Materials',
      'UV + Scratch Protection',
      'Heat-Sealed Precision Edges',
      'Matte, Gloss & Satin Finishes',
      '2-Year Workmanship Warranty',
    ],
    process: [
      { step: '01', title: 'Consultation', desc: 'Detailed design session to finalize colours, finishes, and custom graphics.' },
      { step: '02', title: 'Preparation', desc: 'Thorough decontamination and surface prep to ensure perfect vinyl adhesion.' },
      { step: '03', title: 'Application', desc: 'Expert heat-formed wrapping with zero air bubbles and concealed seams.' },
      { step: '04', title: 'Curing', desc: 'Controlled post-heat treatment for long-term durability and edge-sealing.' },
    ],
  },
  {
    slug: 'premium-wash',
    name: 'Premium Wash Packages',
    tagline: 'Multi-Stage Deep Cleaning',
    description: 'Transform your vehicle with our professional multi-stage wash. We use pH-neutral snow foams, the two-bucket safe wash method, and high-pressure detailing to remove every speck of road grime without harming your paint.',
    price: 'From ₹120',
    subPrices: [
      { label: 'Bike Wash', value: '₹120' },
      { label: 'Car Wash', value: '₹400' },
    ],
    duration: '45–90 Minutes',
    image: getAssetUrl('/images/services/wash.png'),
    features: [
      'pH-Neutral Snow Foam Blast',
      'Two-Bucket Safe Wash Method',
      'Engine & Wheel Deep Cleaning',
      'Microfiber Hand Drying',
      'Hydrophobic Spray Sealant',
    ],
    process: [
      { step: '01', title: 'Foam Soak', desc: 'Thick snow foam pre-soak to lift road salt and grit safely.' },
      { step: '02', title: 'Detail Wash', desc: 'Agitation with ultra-soft brushes in hard-to-reach areas like gearsets.' },
      { step: '03', title: 'Purify', desc: 'High-pressure rinse followed by iron decontaminant on wheels.' },
      { step: '04', title: 'Protect', desc: 'Application of a quick-detailer for instant shine and water beading.' },
    ],
  },
  {
    slug: 'colour-restoration',
    name: 'Colour Restoration',
    tagline: 'Showroom Shine, Redefined',
    description: 'Breathe new life into dull, faded, or oxidized paintwork. Our multi-stage machine polishing removes swirl marks and light scratches, restoring the deep gloss and vibrant depth of your original factory finish.',
    price: 'From ₹3,500',
    duration: '1–2 Days',
    image: getAssetUrl('/images/services/restoration.png'),
    features: [
      'Multi-Stage Paint Correction',
      'Oxidation & Swirl Removal',
      'Depth Enhancement Polishing',
      'Compounding & Finishing',
      'Clay Bar Surface Prep',
    ],
    process: [
      { step: '01', title: 'Audit', desc: 'Paint depth measurement and defect identification under specialized lighting.' },
      { step: '02', title: 'Correction', desc: 'Heavy compounding to remove deep scratches and oxidation layers.' },
      { step: '03', title: 'Refine', desc: 'Jewelling polish to create a mirror-like surface and high-gloss depth.' },
      { step: '04', title: 'Preserve', desc: 'Protective wax layer application to lock in the restored finish.' },
    ],
  },
  {
    slug: 'ppf-protection',
    name: 'PPF (Paint Protection Film)',
    tagline: 'Invisible Armour for Your Ride',
    description: 'Ultimate protection against stones, road debris, and scratches. Our high-grade TPU Paint Protection Film is self-healing, optically clear, and provides a massive layer of defence for your car or motorcycle.',
    price: 'From ₹8,500',
    subPrices: [
      { label: 'Bike PPF', value: 'From ₹8,500' },
      { label: 'Car PPF', value: 'From ₹65,000' },
    ],
    duration: '2–5 Days',
    image: getAssetUrl('/images/services/ppf.png'),
    features: [
      'Self-Healing TPU Technology',
      'Stone Chip & Scratch Resistance',
      'Anti-Yellowing Formula',
      'High-Gloss Invisible Finish',
      '5–7 Year Warranty',
    ],
    process: [
      { step: '01', title: 'Precision Cut', desc: 'Computer-aided templates ensure a perfect fit for every panel of your vehicle.' },
      { step: '02', title: 'Decontaminate', desc: 'Clinical cleaning to ensure zero dust particles are trapped under the film.' },
      { step: '03', title: 'Install', desc: 'Liquid-based application and squeegee technique for a seamless bond.' },
      { step: '04', title: 'Edge Wrap', desc: 'Tucked edges where possible for a completely invisible installation.' },
    ],
  },
  {
    slug: 'ceramic-coating',
    name: 'Ceramic & Graphene Coating',
    tagline: 'High-Gloss Hydrophobic Shield',
    description: 'The pinnacle of automotive surface protection. Our 9H Ceramic and Graphene coatings create a permanent hydrophobic bond, making your vehicle incredibly easy to clean while adding insane levels of gloss.',
    price: 'From ₹7,000',
    subPrices: [
      { label: 'Bike Coating', value: 'From ₹7,000' },
      { label: 'Car Coating', value: 'From ₹20,000' },
    ],
    duration: '2–3 Days',
    image: getAssetUrl('/images/services/ceramic.png'),
    features: [
      '9H Hardness Protection',
      'Extreme Hydrophobic (Water Beading)',
      'Chemical & UV Resistance',
      'Permanent Gloss Enhancement',
      'Graphene Infused Options',
    ],
    process: [
      { step: '01', title: 'Correction', desc: 'Full paint correction is mandatory to ensure the coating bonds with pure paint.' },
      { step: '02', title: 'Panel Wipe', desc: 'Removing all oils and residues for a pure chemical bond surface.' },
      { step: '03', title: 'Infusion', desc: 'Precise manual application of the coating layer by layer.' },
      { step: '04', title: 'Curing', desc: 'Controlled IR lamp curing for optimal hardness and durability.' },
    ],
  },
];

export const testimonials = [
  {
    name: 'Fariz',
    role: 'Local Guide',
    stars: 5,
    text: 'I recently purchased a decal kit from WearUp India. The owner was very helpful throughout the process. I received the kit within 4 days via India Post.',
  },
  {
    name: 'Sushant Adhikari',
    role: 'Bike Enthusiast',
    stars: 5,
    text: "Great experience at Wearup India. The team did an amazing job with the ceramic coating on my bike (Ninja 1000SX). The price was reasonable, and the quality of work is exceptional. My bike looks stunning!",
  },
  {
    name: 'Saikat Nath',
    role: 'Adventure Rider',
    stars: 5,
    text: 'I recently had the pleasure of entrusting my 390 Adventure to WEARUP INDIA, and I couldn\'t be more thrilled with the results. From start to finish, the experience was nothing short of exceptional.',
  },
  {
    name: 'Ritwick Lama',
    role: 'Verified Customer',
    stars: 5,
    text: 'The product is absolutely amazing, without any residual glues and it did not take off the original paint of the motorbike which is the best part.',
  },
  {
    name: 'Suman Das',
    role: 'Auto Enthusiast',
    stars: 5,
    text: 'One of the best places in the city to make your bikes and cars look crazy awesome. Love their work. ❤️',
  },
  {
    name: 'Jayanta Arya',
    role: 'Local Resident',
    stars: 5,
    text: 'Trained professionals are here to wrap your vehicle. Best in Siliguri. Highly Recommended!',
  }
];

export const brandMarquee = ['YAMAHA', 'KAWASAKI', 'HONDA', 'ROYAL ENFIELD', 'BAJAJ', 'KTM', 'DUCATI', 'TRIUMPH', 'BMW', 'SUZUKI', 'ATHER', 'TVS', 'HERO'];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
