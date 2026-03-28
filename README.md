# WearUp — Next.js Ecommerce Frontend

> Ride Bold. Wrap Louder.  
> Premium motorcycle wraps, accessories, detailing and merch for the modern Indian rider.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Homepage
│   ├── layout.tsx              # Root layout (Navbar + Footer)
│   ├── globals.css             # Global styles + design tokens
│   ├── not-found.tsx           # Custom 404
│   ├── shop/
│   │   ├── page.tsx            # All products (filterable)
│   │   ├── [category]/
│   │   │   ├── page.tsx        # Category page
│   │   │   └── [product]/
│   │   │       └── page.tsx    # Product detail page
│   ├── services/
│   │   ├── page.tsx            # Services overview
│   │   └── [service]/
│   │       └── page.tsx        # Service detail + booking
│   ├── cart/page.tsx           # Cart with quantity controls
│   ├── wishlist/page.tsx       # Saved items
│   ├── checkout/page.tsx       # 3-step checkout (address → payment → confirm)
│   ├── gallery/page.tsx        # Work gallery
│   ├── about/page.tsx          # About + team + values
│   ├── contact/page.tsx        # Contact form
│   ├── shipping/page.tsx       # Shipping policy
│   ├── returns/page.tsx        # Return policy
│   ├── privacy/page.tsx        # Privacy policy
│   └── terms/page.tsx          # Terms of service
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky navbar, mobile menu, cart/wishlist icons
│   │   └── Footer.tsx          # Multi-column footer with social links
│   └── shop/
│       └── ProductCard.tsx     # Reusable product card with wishlist + add to cart
│
├── data/
│   └── index.ts                # All product, category, service, and testimonial data
│
└── lib/
    └── store-context.tsx       # React context for cart + wishlist (localStorage persisted)
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#E8161B` (WearUp Red) |
| Background | `#0A0A0A` |
| Card | `#111111` |
| Border | `#2a2a2a` |
| Display Font | Barlow Condensed (Black/ExtraBold) |
| Body Font | Barlow (Regular/Medium) |
| Mono Font | JetBrains Mono |

---

## 📦 Pages & Features

### Homepage
- Hero section with bike imagery
- Brand marquee (Yamaha, KTM, Honda, etc.)
- Category grid (Stickers, Accessories, Merch, Services)
- Featured products
- Services preview (Pit Stop)
- Gallery grid
- Testimonials
- Trust badges (free delivery, warranty, returns)

### Shop
- `/shop` — All products with category filter + sort
- `/shop/[category]` — Per-category page with hero
- `/shop/[category]/[product]` — Full product detail with:
  - Image gallery
  - Rating, reviews
  - Quantity selector
  - Add to Cart + Wishlist
  - Specs table
  - Related products

### Services
- `/services` — All 3 services (Wrapping, Detail Wash, Custom Decals)
- `/services/[service]` — Full detail with process steps, booking sidebar

### Commerce
- `/cart` — Cart with quantity controls, promo code input, order summary
- `/wishlist` — Saved products
- `/checkout` — 3-step: Address → Payment (UPI/Card/COD) → Confirm → Success

### Content
- `/gallery` — Masonry grid with filter tabs
- `/about` — Story, values, team
- `/contact` — Form + WhatsApp CTA + map placeholder
- `/shipping`, `/returns`, `/privacy`, `/terms`

---

## 🛒 State Management

Cart and wishlist are managed via React Context (`StoreProvider`) with **localStorage persistence** — state survives page refresh.

```tsx
const { cart, addToCart, removeFromCart, wishlist, addToWishlist } = useStore();
```

---

## 📦 Adding More Products / Categories

Edit `/src/data/index.ts`:

```ts
// Add a new category
categories.push({
  slug: 'parts',
  name: 'Parts',
  tagline: 'Go Faster',
  description: '...',
  image: 'https://...',
  accentColor: '#E8161B',
});

// Add a product
products.push({
  id: 'pt-001',
  slug: 'performance-exhaust',
  name: 'Performance Exhaust',
  category: 'parts',
  price: 15999,
  ...
});
```

---

## 🔧 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom design tokens)
- **Lucide React** (icons)
- **Google Fonts** — Barlow Condensed + Barlow + JetBrains Mono
- **React Context** for cart/wishlist
- **next/image** for optimized images

---

## 🚢 To Production

1. Connect a real backend (Supabase, Strapi, Shopify Storefront API)
2. Add real payment gateway (Razorpay recommended for India)
3. Replace `next/image` placeholder domains with your CDN
4. Add real analytics (Vercel Analytics or Google Analytics)
5. Deploy on **Vercel** (zero config with Next.js)

```bash
npm run build
vercel deploy
```

---

Built with ❤️ for Indian riders.
