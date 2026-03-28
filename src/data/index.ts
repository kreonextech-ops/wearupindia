export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accentColor: string;
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
};

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  features: string[];
  process: { step: string; title: string; desc: string }[];
};

export type Brand = {
  name: string;
  slug: string;
  image: string;
};

export const categories: Category[] = [
  {
    slug: 'stickers-wraps',
    name: 'Stickers & Wraps',
    tagline: 'Dress Your Machine',
    description: 'Custom vinyl wraps and precision-cut stickers built for the Indian road. UV-resistant, monsoon-proof.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    accentColor: '#E8161B',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    tagline: 'Gear Up Right',
    description: 'Helmets, gloves, and riding gear engineered for performance on every Indian terrain.',
    image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&q=80',
    accentColor: '#E8161B',
  },
  {
    slug: 'merchandise',
    name: 'Merchandise',
    tagline: 'Wear The Culture',
    description: 'Apparel and lifestyle gear for riders who live the moto life on and off the bike.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    accentColor: '#E8161B',
  },
];

export const products: Product[] = [
  // Stickers & Wraps
  {
    id: 'sw-001',
    slug: 'heritage-decal-kit-re',
    name: 'Heritage Decal Kit – Royal Enfield',
    category: 'stickers-wraps',
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
    category: 'stickers-wraps',
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
    category: 'stickers-wraps',
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
    category: 'stickers-wraps',
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
    category: 'stickers-wraps',
    price: 3499,
    rating: 4.8,
    reviews: 152,
    images: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80'],
    description: 'Genuine 3M 2080 Series textured carbon fiber wrap. High-conformability for complex curves like aero-wings and mirrors.',
    specs: [{ label: 'Series', value: '2080 Textured' }, { label: 'Air-Release', value: 'Comply™ Tech' }],
    inStock: true,
    compatibleBrands: ['ducati', 'kawasaki', 'bmw', 'yamaha'],
  },
  {
    id: 'sw-006',
    slug: 'neon-rim-strips',
    name: 'Reflective Neon Rim Strips',
    category: 'stickers-wraps',
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
    category: 'accessories',
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
    category: 'accessories',
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
    category: 'accessories',
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
    category: 'accessories',
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
    category: 'accessories',
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
    category: 'merchandise',
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
    category: 'merchandise',
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
    category: 'merchandise',
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
    category: 'merchandise',
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
  { name: 'Yamaha', slug: 'yamaha', image: 'https://images.unsplash.com/photo-1652427672205-d91d4d876a3e?w=400&q=80' },
  { name: 'KTM', slug: 'ktm', image: 'https://images.unsplash.com/photo-1625447192660-f9256a4270ca?w=400&q=80' },
  { name: 'Royal Enfield', slug: 'royal-enfield', image: 'https://images.unsplash.com/photo-1610471186714-36774ed63973?w=400&q=80' },
  { name: 'Kawasaki', slug: 'kawasaki', image: 'https://images.unsplash.com/photo-1620986794695-171542f0c79d?w=400&q=80' },
  { name: 'Honda', slug: 'honda', image: 'https://images.unsplash.com/photo-1649982361664-df8207f2cd4a?w=400&q=80' },
  { name: 'Suzuki', slug: 'suzuki', image: 'https://images.unsplash.com/photo-1642289659020-f56860f1882d?w=400&q=80' },
  { name: 'Ducati', slug: 'ducati', image: 'https://images.unsplash.com/photo-1632763261763-883fd34a8e0f?w=400&q=80' },
  { name: 'Triump', slug: 'triumph', image: 'https://images.unsplash.com/photo-1625032543886-0684fddb4657?w=400&q=80' },
  { name: 'BMW', slug: 'bmw', image: 'https://images.unsplash.com/photo-1616196236528-761c5655716e?w=400&q=80' },
  { name: 'Bajaj', slug: 'bajaj', image: 'https://images.unsplash.com/photo-1625447192660-f9256a4270ca?w=400&q=80' },
];

export const services: Service[] = [
  {
    slug: 'bike-wrapping',
    name: 'Bike Wrapping',
    tagline: 'Full & Partial Custom Vinyl',
    description: 'Full and partial custom vinyl wraps using 3M & Avery Dennison premium grade materials. Every wrap is precision-cut, heat-formed and sealed for maximum durability on Indian roads.',
    price: 'From ₹8,999',
    duration: '1–3 Days',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    features: [
      '3M & Avery Dennison materials only',
      'UV + monsoon resistant laminate',
      'Partial or full coverage options',
      '2-year workmanship warranty',
      'Before/after photography',
      'Paint protection option',
    ],
    process: [
      { step: '01', title: 'Consultation', desc: 'Share your vision — colour, finish, design. We mock it up digitally for approval.' },
      { step: '02', title: 'Prep & Clean', desc: 'Deep clay-bar wash, panel decontamination, and surface prep for perfect adhesion.' },
      { step: '03', title: 'Wrap', desc: 'Precision heat-formed vinyl application with zero air bubbles, sealed edges.' },
      { step: '04', title: 'Deliver', desc: 'Final inspection, post-heat treatment and delivery with care instructions.' },
    ],
  },
  {
    slug: 'detail-wash',
    name: 'Detail Wash',
    tagline: 'Ceramic Coating & Multi-Stage Detailing',
    description: 'Ceramic coating and multi-stage detailing to restore your machine\'s showroom finish. pH-neutral foams, machine polishing and SiO2 ceramic sealant.',
    price: 'From ₹1,999',
    duration: '4–8 Hours',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80',
    features: [
      'pH-neutral foam pre-wash',
      'Two-bucket safe wash method',
      'Machine polish (swirl removal)',
      'Ceramic SiO2 sealant coat',
      '6-month protection guarantee',
      'Interior detailing available',
    ],
    process: [
      { step: '01', title: 'Foam Blast', desc: 'pH-neutral snow foam pre-soak loosens all road grime without touching the paint.' },
      { step: '02', title: 'Safe Wash', desc: 'Two-bucket method with microfibre mitts, rinse from top to bottom.' },
      { step: '03', title: 'Polish', desc: 'Machine polisher removes swirl marks, oxidation and fine scratches.' },
      { step: '04', title: 'Seal', desc: 'SiO2 ceramic spray sealant — hydrophobic, heat-resistant, 6-month durability.' },
    ],
  },
  {
    slug: 'custom-decals',
    name: 'Custom Decals',
    tagline: 'Track-Legal Hi-Vis Graphics',
    description: 'Individually designed stickers and racing numbers with high-visibility reflective tech. Designed in-house, printed on professional Roland plotters.',
    price: 'From ₹299',
    duration: '24–48 Hours',
    image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&q=80',
    features: [
      'In-house design team',
      'Roland eco-solvent printer',
      'Reflective + standard finishes',
      'Any shape, any bike',
      'Custom name & number',
      'Bulk discounts for clubs',
    ],
    process: [
      { step: '01', title: 'Brief', desc: 'Tell us your style — logo, number, text or full design. Upload reference or we design from scratch.' },
      { step: '02', title: 'Design', desc: 'In-house designer creates vector artwork, shares for approval within 24 hrs.' },
      { step: '03', title: 'Print & Cut', desc: 'Roland eco-solvent print + contour cut for pixel-perfect output.' },
      { step: '04', title: 'Ship', desc: 'Sandwiched in rigid mailer, shipped PAN India with tracking.' },
    ],
  },
];

export const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Track Day Modder',
    city: 'Bengaluru',
    stars: 5,
    text: 'The custom wrap job on my Ninja 650 is flawless. The attention to detail in the seams is what sets WearUp apart. Total precision.',
  },
  {
    name: 'Ananya Das',
    role: 'Touring Enthusiast',
    city: 'Kolkata',
    text: 'Finding genuine accessories in India used to be a gamble. WearUp is my go-to now. Fast shipping and the merch quality is top-tier.',
    stars: 5,
  },
  {
    name: 'Vikram Seth',
    role: 'Pro Adventurer',
    city: 'Mumbai',
    text: 'Their ceramic coating actually works. Rode through a massive storm in Munnar and the bike looks like it just came out of the showroom.',
    stars: 5,
  },
];

export const brandMarquee = ['YAMAHA', 'KAWASAKI', 'HONDA', 'ROYAL ENFIELD', 'BAJAJ', 'KTM', 'DUCATI', 'TRIUMPH', 'BMW', 'SUZUKI'];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
