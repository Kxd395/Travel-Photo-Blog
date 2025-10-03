# Travel Photo Blog & Reviews (Next.js Starter)

A drop‑in starter you can open in VS Code. It shows a photo grid, place pages with review cards, and an interactive map (Leaflet + OpenStreetMap). Content lives in `/data` (JSON) and images in `/public/photos`.

## ✨ Recent Improvements

- ✅ **Performance Optimizations**: Added caching layer for data fetching
- ✅ **Enhanced UI/UX**: Improved photo grid with keyboard navigation & lightbox carousel
- ✅ **Better Accessibility**: Skip-to-content links, ARIA labels, and keyboard support
- ✅ **Advanced Filtering**: Sort reviews by date/rating, improved search
- ✅ **Error Handling**: Proper 404 pages with Next.js `notFound()`
- ✅ **SEO Enhancements**: Dynamic metadata for all pages
- ✅ **Responsive Design**: Enhanced mobile experience with better spacing
- ✅ **Developer Experience**: TypeScript path aliases, better type safety

## Quick start (macOS / Node 20+)

```bash
# 1) Open the folder in VS Code
# 2) Install deps
npm install

# 3) Run dev server
npm run dev
# open http://localhost:3000
```

> **No keys required.** Map uses OSM tiles via Leaflet. You can drop in your own photos in `public/photos/` and update JSON in `/data`.

## Content model

- **/data/places.json** – places (id, slug, name, address, coords, categories, etc)
- **/data/reviews.json** – reviews linked to a place, with rating (1–5), tips, body, photos
- **/data/photos.json** – photos (id, src under `/public/photos`, optional placeId, tags)
- **/data/trips.json** – trips bundling places & photos with dates

Edit JSON and hot‑reload will update the UI.

## Pages

- `/` home: latest reviews + recent photos + trips
- `/reviews` filterable list (search + min rating + sort options)
- `/places/[slug]` place page with aggregated reviews + photo gallery
- `/trips/[slug]` trip hub with places and photo grid (with metadata)
- `/map` interactive map with markers from `/data/places.json` (with place list)

## Features

### Photo Grid
- **Responsive masonry layout** with CSS columns
- **Lightbox viewer** with keyboard navigation (← → arrows, ESC to close)
- **Image carousel** - navigate through all photos
- **Hover effects** with captions
- **Lazy loading** for performance

### Reviews
- **Advanced filtering** by search query, minimum rating
- **Sorting options** by date or rating
- **Detailed review cards** with pros, cons, tips
- **Star ratings** with half-star support
- **Cost indicators** and tags

### Map
- **Interactive markers** for all places with coordinates
- **Rich popups** with place details, categories, and ratings
- **Place list view** below map for easy browsing
- **Loading states** for better UX

### Accessibility
- **Skip-to-content** link for keyboard users
- **ARIA labels** on interactive elements
- **Keyboard navigation** in photo lightbox
- **Focus management** with visible focus states
- **Semantic HTML** structure

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Leaflet** - Interactive maps
- **React Leaflet** - React wrapper for Leaflet

## Notes & next steps

- **Persistence**: This starter reads JSON files at build/runtime in dev. For production persistence, connect a DB (e.g., Supabase, SQLite) or CMS. The UI and types are ready.
- **Images**: Replace placeholders with real images (drop them into `public/photos/` and update `photos.json`).
- **SEO**: Add OG images and JSON‑LD as needed. Basic metadata is implemented.
- **Deploy**: Works on Vercel/Netlify (static + server). For Netlify, use the Next.js runtime plugin (optional).
- **Extend**: Add review creation (server actions) or import from Google Photos/Apple Photos via a script.

## Performance

- **Cached data fetching** - Reduces repeated JSON parsing
- **Optimized images** - Next.js Image component with automatic optimization
- **Code splitting** - Automatic route-based splitting
- **Static generation** - Pre-rendered pages for fast loads

## Project Structure

```
travel-photo-blog/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with nav & footer
│   ├── page.tsx           # Home page
│   ├── not-found.tsx      # 404 page
│   ├── map/               # Interactive map page
│   ├── places/[slug]/     # Dynamic place pages
│   ├── reviews/           # Reviews listing with filters
│   └── trips/[slug]/      # Dynamic trip pages
├── components/            # Reusable React components
│   ├── PhotoGrid.tsx      # Photo gallery with lightbox
│   ├── ReviewCard.tsx     # Review display component
│   └── StarRating.tsx     # Star rating component
├── data/                  # JSON content files
├── lib/                   # Utility functions & types
│   ├── data.ts           # Data fetching with caching
│   └── types.ts          # TypeScript type definitions
└── public/photos/         # Static photo assets
```

Enjoy!
