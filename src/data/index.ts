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
  isBestSeller?: boolean;
  compatibleBrands: string[];
  compatibleModels?: string[];
  // Admin-editable rich content blocks
  kitIncludes?: string[];
  installationSteps?: { step: number; title: string; desc: string }[];
  whyChoose?: { icon: string; title: string; desc: string }[];
  marketingTagline?: string;
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
  { brand: 'Hero', slug: 'hero', models: ['Xpulse 200'] },
  { brand: 'Kawasaki', slug: 'kawasaki', models: ['Ninja 300', 'Ninja 650', 'Z800', 'Z900', 'ZX10R-2016/2020', 'ZX6R-2019/2023', 'ZX6R-2024/2026'] },
  { brand: 'Honda', slug: 'honda', models: ['CBR-150/250', 'CBR650R-2019/2022', 'NX500'] },
  { brand: 'Suzuki', slug: 'suzuki', models: ['Hayabusa', 'Gixxer SF-155/250'] },
];

export const categories: Category[] = [
  {
    slug: 'graphic-kits',
    name: 'Graphic Kits',
    tagline: 'Dress Your Machine',
    description: 'Custom vinyl wraps and precision-cut kits built for the Indian road. UV-resistant, monsoon-proof materials from 3M and Avery.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    accentColor: '#E8161B',
  },
  {
    slug: 'bike-accessories',
    name: 'Bike Accessories',
    tagline: 'Gear Up Right',
    description: 'Performance parts and protection gear engineered for every Indian terrain.',
    image: '/images/services/wrapping.png',
    accentColor: '#E8161B',
  },
  {
    slug: 'keychains',
    name: 'Keychains',
    tagline: 'Pocket Essentials',
    description: 'Premium metal and leather keychains for riders who value detail. Coming Soon.',
    image: '/images/categories/keychains_v2.png',
    accentColor: '#E8161B',
    isComingSoon: true,
  },
  {
    slug: 'tshirts',
    name: 'T-Shirts',
    tagline: 'Wear The Brand',
    description: 'Minimalist, high-quality rider apparel designed for comfort on and off the saddle. Coming Soon.',
    image: '/images/categories/tshirts_v2.png',
    accentColor: '#E8161B',
    isComingSoon: true,
  },
  {
    slug: 'hoodies',
    name: 'Hoodies',
    tagline: 'Ride in Comfort',
    description: 'Heavyweight, premium hoodies for those cold morning sprints. Coming Soon.',
    image: '/images/categories/hoodies_v2.png',
    accentColor: '#E8161B',
    isComingSoon: true,
  },
];

export const products: Product[] = [
  // ─── YAMAHA FZ-25 GRAPHIC KITS (Model-specific samples) ───
  {
    id: 'gk-fz25-001',
    slug: 'yamaha-fz25-venom-design-full-body-kit',
    name: 'Yamaha FZ 25 – Venom Design [Full Body Edge To Edge Wrap / Decal / Sticker Kit]',
    category: 'graphic-kits',
    price: 2999,
    originalPrice: 4999,
    badge: 'NEW',
    rating: 4.8,
    reviews: 23,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1200&q=90',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=90',
    ],
    description: 'The Venom Design Full Body Kit is a precision edge-to-edge wrap designed exclusively for the Yamaha FZ 25. Inspired by aggressive racing aesthetics, this kit transforms your naked street fighter into a track-ready machine. Manufactured with genuine 3M MPI 1105 cast vinyl with UV laminate — this kit survives harsh Indian climates.',
    marketingTagline: '3M Scratchless Series: Your ride deserves nothing but the best.',
    specs: [
      { label: 'Material', value: '3M Cast Vinyl + UV Laminate' },
      { label: 'Fit', value: 'Yamaha FZ 25 (All Years)' },
      { label: 'Coverage', value: 'Full Body – Edge To Edge' },
      { label: 'Durability', value: '5+ Years Outdoor' },
      { label: 'Finish', value: 'Gloss / Matte (Choose at checkout)' },
      { label: 'Application', value: 'DIY + Professional Guide Included' },
    ],
    kitIncludes: [
      'Front Fender Wrap',
      'Fuel Tank Full Wrap',
      'Side Fairings (L + R)',
      'Tail Piece Wrap',
      'Swingarm Sticker',
      'Engine Cowl Decal',
      'Rim Strips (Set of 16)',
      'Application Squeegee + Heat Gun Guide',
    ],
    installationSteps: [
      { step: 1, title: 'Clean the Surface', desc: 'Use isopropyl alcohol to degrease all panels. Ensure zero dust or moisture. A clean surface is 70% of the job.' },
      { step: 2, title: 'Measure & Position', desc: 'Line up each panel piece using the guide markers printed on the film backing. Do not peel the full sheet at once.' },
      { step: 3, title: 'Apply with Squeegee', desc: 'Peel 2–3 cm, position, and use the squeegee at a 45° angle to push out bubbles from center outward.' },
      { step: 4, title: 'Heat & Conform', desc: 'Use a heat gun at 60–70°C on curved sections and edges. This activates the adhesive and allows the film to conform to complex curves.' },
      { step: 5, title: 'Trim & Seal Edges', desc: 'Use the included precision blade to trim overlaps neatly. Press all edges firmly. Your kit is ready.' },
    ],
    whyChoose: [
      { icon: 'shield', title: '3M Certified Materials', desc: 'Every kit uses genuine 3M MPI 1105 cast vinyl — same material used by professional wrap studios.' },
      { icon: 'droplets', title: 'Monsoon Proof', desc: 'UV laminate coat protects against harsh UV, rain, and road debris. Built for Indian conditions.' },
      { icon: 'scissors', title: 'Precision Die-Cut', desc: 'Every piece is cut by a precision plotter to match your exact bike model — no trimming needed.' },
      { icon: 'undo', title: 'Zero Paint Damage', desc: 'Leaves no adhesive residue. Peel off clean anytime — it won\'t harm your stock paint.' },
    ],
    inStock: true,
    isNew: true,
    compatibleBrands: ['yamaha'],
    compatibleModels: ['fz-25'],
  },
  {
    id: 'gk-fz25-002',
    slug: 'yamaha-fz25-abstract-design-full-body-kit',
    name: 'Yamaha FZ 25 – Abstract Design [Full Body Edge To Edge Wrap / Decal / Sticker Kit]',
    category: 'graphic-kits',
    price: 2999,
    originalPrice: 4999,
    badge: 'NEW',
    rating: 4.7,
    reviews: 18,
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1200&q=90',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=90',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90',
    ],
    description: 'The Abstract Design brings a contemporary art-meets-machine aesthetic to your FZ 25. Geometric patterns flow across the tank, fairings, and tail — giving the bike a gallery-worthy, one-of-a-kind look on every street corner. Premium 3M materials ensure it looks as good on day 1 as it does 5 years later.',
    marketingTagline: '3M Scratchless Series: Your ride deserves nothing but the best.',
    specs: [
      { label: 'Material', value: '3M Cast Vinyl + UV Laminate' },
      { label: 'Fit', value: 'Yamaha FZ 25 (All Years)' },
      { label: 'Coverage', value: 'Full Body – Edge To Edge' },
      { label: 'Durability', value: '5+ Years Outdoor' },
      { label: 'Finish', value: 'Gloss / Matte (Choose at checkout)' },
      { label: 'Application', value: 'DIY + Professional Guide Included' },
    ],
    kitIncludes: [
      'Front Fender Wrap',
      'Fuel Tank Full Wrap',
      'Side Fairings (L + R)',
      'Tail Piece Wrap',
      'Swingarm Sticker',
      'Engine Cowl Decal',
      'Rim Strips (Set of 16)',
      'Application Squeegee + Heat Gun Guide',
    ],
    installationSteps: [
      { step: 1, title: 'Clean the Surface', desc: 'Use isopropyl alcohol to degrease all panels. Ensure zero dust or moisture. A clean surface is 70% of the job.' },
      { step: 2, title: 'Measure & Position', desc: 'Line up each panel piece using the guide markers printed on the film backing. Do not peel the full sheet at once.' },
      { step: 3, title: 'Apply with Squeegee', desc: 'Peel 2–3 cm, position, and use the squeegee at a 45° angle to push out bubbles from center outward.' },
      { step: 4, title: 'Heat & Conform', desc: 'Use a heat gun at 60–70°C on curved sections and edges. This activates the adhesive and allows the film to conform to complex curves.' },
      { step: 5, title: 'Trim & Seal Edges', desc: 'Use the included precision blade to trim overlaps neatly. Press all edges firmly. Your kit is ready.' },
    ],
    whyChoose: [
      { icon: 'shield', title: '3M Certified Materials', desc: 'Every kit uses genuine 3M MPI 1105 cast vinyl — same material used by professional wrap studios.' },
      { icon: 'droplets', title: 'Monsoon Proof', desc: 'UV laminate coat protects against harsh UV, rain, and road debris. Built for Indian conditions.' },
      { icon: 'scissors', title: 'Precision Die-Cut', desc: 'Every piece is cut by a precision plotter to match your exact bike model — no trimming needed.' },
      { icon: 'undo', title: 'Zero Paint Damage', desc: 'Leaves no adhesive residue. Peel off clean anytime — it won\'t harm your stock paint.' },
    ],
    inStock: true,
    isNew: true,
    compatibleBrands: ['yamaha'],
    compatibleModels: ['fz-25'],
  },
  // Stickers & Wraps
  {
    id: 'sw-001',
    slug: 'heritage-decal-kit-re',
    name: 'Heritage Decal Kit – Royal Enfield',
    category: 'graphic-kits',
    price: 1299,
    originalPrice: 1899,
    badge: 'BEST SELLER',
    rating: 4.8,
    reviews: 312,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80',
    ],
    description: 'Specially crafted vinyl decal kit for Royal Enfield classics. Deep-etched graphics with UV-laminate coat — handles torrential monsoon and harsh sun alike.',
    specs: [
      { label: 'Material', value: '3M Cast Vinyl + UV Laminate' },
      { label: 'Fit', value: 'Royal Enfield Classic 350/500' },
      { label: 'Durability', value: '5+ Years' },
      { label: 'Application', value: 'DIY with guide included' },
    ],
    inStock: true,
    isBestSeller: true,
    compatibleBrands: ['royal-enfield'],
  },
  {
    id: 'sw-002',
    slug: 'hex-grip-tank-pads',
    name: 'Hex-Grip Tank Pads',
    category: 'graphic-kits',
    price: 599,
    originalPrice: 899,
    badge: 'NEW',
    rating: 4.6,
    reviews: 189,
    images: [
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80',
    ],
    description: 'High-grip hex-pattern tank pad protectors. Anti-scratch, fuel-resistant, and precision die-cut for a seamless factory finish.',
    specs: [
      { label: 'Material', value: '3D Carbon Fiber Vinyl' },
      { label: 'Size', value: '15cm × 10cm per pad (set of 2)' },
      { label: 'Adhesive', value: 'Premium 3M' },
      { label: 'Finish', value: 'Matte / Gloss' },
    ],
    inStock: true,
    isNew: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda'],
  },
  {
    id: 'sw-003',
    slug: 'full-bike-wrap-kit',
    name: 'Full Bike Wrap Kit – Matte Black',
    category: 'graphic-kits',
    price: 8999,
    rating: 4.9,
    reviews: 94,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
    description: 'Complete matte-black transformation wrap. Avery Dennison MPI 1105 film for total coverage — doors, panels, fairings.',
    specs: [
      { label: 'Material', value: 'Avery Dennison MPI 1105' },
      { label: 'Finish', value: 'Matte Black' },
      { label: 'Coverage', value: 'Full bike (excl. chrome)' },
      { label: 'Durability', value: '7 Years' },
    ],
    inStock: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda', 'royal-enfield', 'ducati', 'triumph', 'bmw', 'suzuki'],
  },
  {
    id: 'sw-004',
    slug: 'racing-number-plate-sticker',
    name: 'Racing Number Plate Sticker',
    category: 'graphic-kits',
    price: 299,
    rating: 4.5,
    reviews: 441,
    images: [
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80',
    ],
    description: 'Custom racing number plates with hi-vis reflective finish. Track-legal and road-ready.',
    specs: [
      { label: 'Material', value: 'Reflective Vinyl' },
      { label: 'Customizable', value: 'Yes – Number + Name' },
      { label: 'Size', value: 'Standard / Custom' },
    ],
    inStock: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda', 'suzuki'],
  },
  {
    id: 'sw-005',
    slug: 'carbon-fiber-wrap-3m',
    name: '3M Carbon Fiber – Textured Wrap',
    category: 'graphic-kits',
    price: 3499,
    rating: 4.8,
    reviews: 152,
    images: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80'],
    description: 'Genuine 3M 2080 Series textured carbon fiber wrap. High-conformability for complex curves like aero-wings and mirrors.',
    specs: [{ label: 'Series', value: '2080 Textured' }, { label: 'Air-Release', value: 'Comply™ Tech' }],
    inStock: true,
    isNew: true,
    compatibleBrands: ['ducati', 'kawasaki', 'bmw', 'yamaha'],
  },
  {
    id: 'sw-006',
    slug: 'neon-rim-strips',
    name: 'Reflective Neon Rim Strips',
    category: 'graphic-kits',
    price: 399,
    originalPrice: 599,
    rating: 4.4,
    reviews: 820,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    description: 'High-visibility fluorescent rim strips. Precision curved for 17-inch wheels (set of 16).',
    specs: [{ label: 'Reflectivity', value: 'Class A' }, { label: 'Compatibility', value: '17" Wheels' }],
    inStock: true,
    compatibleBrands: ['ktm', 'yamaha', 'honda', 'bajaj'],
  },
  // Accessories
  {
    id: 'ac-001',
    slug: 'carbon-phantom-helmet',
    name: 'Carbon Phantom Helmet',
    category: 'bike-accessories',
    price: 24999,
    originalPrice: 29999,
    badge: 'NEW',
    rating: 4.9,
    reviews: 67,
    images: [
      'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&q=80',
    ],
    description: 'Full-face carbon fiber shell helmet with anti-fog visor and emergency release cheek pads. DOT & ISI certified.',
    specs: [
      { label: 'Shell', value: 'Carbon Fiber Composite' },
      { label: 'Certification', value: 'DOT, ISI' },
      { label: 'Visor', value: 'Anti-fog, UV400' },
      { label: 'Weight', value: '1,350g' },
      { label: 'Sizes', value: 'S, M, L, XL, XXL' },
    ],
    inStock: true,
    isNew: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda', 'royal-enfield', 'ducati', 'triumph', 'bmw', 'suzuki'],
  },
  {
    id: 'ac-002',
    slug: 'x-pro-racing-gloves',
    name: 'X-Pro Racing Gloves',
    category: 'bike-accessories',
    price: 6499,
    originalPrice: 8999,
    rating: 4.7,
    reviews: 203,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
    description: 'Track-tested leather racing gloves with carbon knuckle guards, pre-curved fingers and wrist brace system.',
    specs: [
      { label: 'Material', value: 'Kangaroo Leather' },
      { label: 'Protection', value: 'CE Level 1' },
      { label: 'Knuckles', value: 'Hard Carbon Insert' },
      { label: 'Closure', value: 'Dual-Velcro Wrist Wrap' },
    ],
    inStock: true,
    isBestSeller: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda', 'royal-enfield', 'ducati', 'triumph', 'bmw', 'suzuki'],
  },
  {
    id: 'ac-003',
    slug: 'pro-series-gold-chain',
    name: 'Pro-Series Gold Drive Chain',
    category: 'bike-accessories',
    price: 4500,
    badge: 'BEST VALUE',
    rating: 4.6,
    reviews: 158,
    images: [
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80',
    ],
    description: '520-pitch gold X-ring chain with pre-stretched links and double-sealed O-ring tech for extended life.',
    specs: [
      { label: 'Pitch', value: '520' },
      { label: 'Links', value: '118 (Standard)' },
      { label: 'Seal', value: 'X-Ring' },
      { label: 'Tensile Strength', value: '3,200 kg' },
    ],
    inStock: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda', 'suzuki'],
  },
  {
    id: 'ac-004',
    slug: 'velocity-rider-boots',
    name: 'Velocity Rider Boots',
    category: 'bike-accessories',
    price: 12499,
    originalPrice: 15999,
    rating: 4.8,
    reviews: 88,
    images: [
      'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&q=80',
    ],
    description: 'Full-grain leather moto boots with ankle reinforcement, oil-resistant sole and waterproof membrane.',
    specs: [
      { label: 'Upper', value: 'Full-Grain Leather' },
      { label: 'Sole', value: 'Rubber, Oil-Resistant' },
      { label: 'Ankle', value: 'TPU Reinforced' },
      { label: 'Waterproof', value: 'Gore-Tex Membrane' },
    ],
    inStock: true,
    isBestSeller: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda', 'royal-enfield', 'ducati', 'triumph', 'bmw', 'suzuki'],
  },
  {
    id: 'ac-005',
    slug: 'ducati-corsa-tank-bag',
    name: 'Ducati Corsa Semi-Rigid Tank Bag',
    category: 'bike-accessories',
    price: 8999,
    rating: 4.9,
    reviews: 24,
    images: ['https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80'],
    description: 'Premium semi-rigid tank bag with Givi Tanklock system. Red accents and official Corsa branding.',
    specs: [{ label: 'Volume', value: '5L' }, { label: 'Mount', value: 'Tanklock' }],
    inStock: true,
    compatibleBrands: ['ducati'],
  },
  // Merchandise
  {
    id: 'me-001',
    slug: 'tech-wear-hoodie',
    name: 'Tech-Wear Hoodie',
    category: 'bike-accessories',
    price: 4499,
    originalPrice: 5999,
    badge: 'HOT',
    rating: 4.7,
    reviews: 346,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    ],
    description: 'Heavyweight 400 GSM fleece hoodie with embroidered WearUp logo patch. Pre-shrunk, relaxed-fit.',
    specs: [
      { label: 'Material', value: '400 GSM Fleece' },
      { label: 'Fit', value: 'Relaxed / Oversized' },
      { label: 'Logo', value: 'Embroidered Chest Patch' },
      { label: 'Sizes', value: 'S – 3XL' },
    ],
    inStock: true,
    isBestSeller: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda', 'royal-enfield', 'ducati', 'triumph', 'bmw', 'suzuki'],
  },
  {
    id: 'me-002',
    slug: 'kinetic-logo-tee',
    name: 'Kinetic Logo Tee',
    category: 'bike-accessories',
    price: 1299,
    rating: 4.5,
    reviews: 512,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    ],
    description: '220 GSM cotton jersey tee with screen-printed WearUp graphic. Pre-washed for softer feel.',
    specs: [
      { label: 'Material', value: '220 GSM Cotton Jersey' },
      { label: 'Print', value: 'Screen Print' },
      { label: 'Fit', value: 'Regular' },
      { label: 'Sizes', value: 'XS – 3XL' },
    ],
    inStock: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda', 'royal-enfield', 'ducati', 'triumph', 'bmw', 'suzuki'],
  },
  {
    id: 'me-003',
    slug: 'mach-1-leather-jacket',
    name: 'Mach-1 Leather Jacket',
    category: 'bike-accessories',
    price: 18999,
    originalPrice: 24999,
    badge: 'PREMIUM',
    rating: 4.9,
    reviews: 127,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    ],
    description: 'CE-rated motorcycle leather jacket with removable armor at shoulders, elbows and back. Full-grain cowhide.',
    specs: [
      { label: 'Leather', value: 'Full-Grain Cowhide 1.2mm' },
      { label: 'Armor', value: 'CE Level 1 – Removable' },
      { label: 'Lining', value: 'Mesh Ventilated' },
      { label: 'Sizes', value: 'S – 4XL' },
    ],
    inStock: true,
    isNew: true,
    compatibleBrands: ['yamaha', 'ktm', 'kawasaki', 'honda', 'royal-enfield', 'ducati', 'triumph', 'bmw', 'suzuki'],
  },
  {
    id: 'me-004',
    slug: 'phantom-rider-gloves-street',
    name: 'Phantom Street Performance Gloves',
    category: 'bike-accessories',
    price: 2499,
    rating: 4.6,
    reviews: 112,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'],
    description: 'Lightweight textile/leather hybrid gloves for daily city commuting. Touchscreen sensitive fingertips.',
    specs: [{ label: 'Material', value: 'Mesh/Goat Leather' }, { label: 'Usage', value: 'Daily City' }],
    inStock: true,
    compatibleBrands: ['ktm', 'yamaha', 'bajaj', 'royal-enfield'],
  },
];

export const brands: Brand[] = [
  { name: 'Ather', slug: 'ather', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'ather')?.models || [] },
  { name: 'Bajaj', slug: 'bajaj', image: '/images/brands/bajaj.webp', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'bajaj')?.models || [] },
  { name: 'KTM', slug: 'ktm', image: '/images/brands/ktm.webp', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'ktm')?.models || [] },
  { name: 'Royal Enfield', slug: 'royal-enfield', image: '/images/brands/re.webp', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'royal-enfield')?.models || [] },
  { name: 'TVS', slug: 'tvs', image: '/images/brands/tvs.webp', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'tvs')?.models || [] },
  { name: 'Yamaha', slug: 'yamaha', image: '/images/brands/yamaha.webp', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'yamaha')?.models || [] },
  { name: 'BMW', slug: 'bmw', image: 'https://images.unsplash.com/photo-1616196236528-761c5655716e?w=400&q=80', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'bmw')?.models || [] },
  { name: 'Hero', slug: 'hero', image: 'https://images.unsplash.com/photo-1642289659020-f56860f1882d?w=400&q=80', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'hero')?.models || [] },
  { name: 'Kawasaki', slug: 'kawasaki', image: '/images/brands/kawasaki.webp', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'kawasaki')?.models || [] },
  { name: 'Honda', slug: 'honda', image: 'https://images.unsplash.com/photo-1649982361664-df8207f2cd4a?w=400&q=80', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'honda')?.models || [] },
  { name: 'Suzuki', slug: 'suzuki', image: 'https://images.unsplash.com/photo-1632763261763-883fd34a8e0f?w=400&q=80', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'suzuki')?.models || [] },
  { name: 'Universal', slug: 'universal', image: 'https://images.unsplash.com/photo-1620986794695-171542f0c79d?w=400&q=80', models: GRAPHIC_KITS_STRUCTURE.find(b => b.slug === 'universal')?.models || [] },
];

export const services: Service[] = [
  {
    slug: 'bike-wrapping',
    name: 'Bike Wrapping',
    tagline: 'Premium Custom Vinyl Wraps',
    description: 'Elite customization for your motorcycle using world-class vinyl from 3M and Avery Dennison. Our wraps are heat-formed, edge-sealed, and UV-protected to withstand the harsh Indian climate while giving your bike a factory-fresh or custom show-stopper look.',
    price: 'From ₹4,999',
    duration: '2–4 Days',
    image: '/images/services/wrapping.png',
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
    image: '/images/services/wash.png',
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
    image: '/images/services/restoration.png',
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
    image: '/images/services/ppf.png',
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
    image: '/images/services/ceramic.png',
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
    name: 'Ritwick Lama',
    role: 'Customer',
    city: 'Siliguri',
    text: 'The product is absolutely amazing, without any residual glues and it did not took off the original paint of the motorbike which is the best part.',
    stars: 5,
  },
  {
    name: 'sushant adhikari',
    role: 'Customer',
    city: 'Siliguri',
    stars: 5,
    text: "Great experience at Wearup India. The team did an amazing job with the ceramic coating on my bike (Ninja 1000SX). The price was reasonable, and the quality of work is exceptional. My bike looks stunning.",
  },
  {
    name: 'Jayanta Arya',
    role: 'Customer',
    city: 'Siliguri',
    text: 'Trained professionals are here to wrap your vehicle. Best in Siliguri. Recommended',
    stars: 5,
  },
  {
    name: 'Where_is Fariz',
    role: 'Customer',
    city: 'India',
    text: 'I recently purchased a decal kit from WearUp India. The owner was very helpful throughout the process. I received the kit within 4 days via India Post.',
    stars: 5,
  },
];

export const brandMarquee = ['YAMAHA', 'KAWASAKI', 'HONDA', 'ROYAL ENFIELD', 'BAJAJ', 'KTM', 'DUCATI', 'TRIUMPH', 'BMW', 'SUZUKI'];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
