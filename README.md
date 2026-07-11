# Satrangi Designer Studio

Boutique e-commerce website for Satrangi Designer Studio — a bridal and ethnic wear studio based in Noida/Delhi.

## Tech Stack

- **React 19** with Vite 8
- **Shopify Storefront API** (GraphQL) for products, cart, and checkout
- **Shopify Web Components** for server-rendered product grids
- **Swiper.js** for the hero carousel
- **Lucide React** for icons
- **Netlify** for deployment

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` with your Shopify credentials:

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_PUBLIC_ACCESS_TOKEN=your-token
VITE_SHOPIFY_API_VERSION=2026-04
```

## Project Structure

```
src/
├── components/       # UI components (Navbar, Hero, Gallery, etc.)
├── lib/              # Shopify API utilities (cart, product details, config)
├── App.jsx           # Root component with lazy section loading
├── main.jsx          # Entry point
├── index.css         # Global styles and design tokens
└── App.css           # Layout-specific styles
```

## Build & Deploy

```bash
npm run build        # Output to dist/
npm run preview      # Preview production build locally
```

Deployment is handled via Netlify with auto-deploy on push to `main`.
