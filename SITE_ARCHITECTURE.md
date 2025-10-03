# 🗺️ Site Architecture & Information Architecture

**Date**: October 2, 2025  
**Status**: Complete IA Specification  
**Routes**: 40+ pages planned

---

## 📊 Overview

Complete site structure with:
- Public routes (25+)
- Admin routes (15+)
- Navigation patterns
- SEO strategy
- URL structure

---

## 🌐 Public Routes

### Core Content

| Route | Purpose | Key Components | SEO Priority |
|-------|---------|----------------|--------------|
| `/` | Homepage | HeroGrid, TripCarousel, PhotoMasonry, StatsBar, MiniMap | High |
| `/trips` | Trip index with filters | FilterBar (year, country, rating), TripCard, Pagination | High |
| `/trips/[slug]` | Trip detail with day timeline | Cover, TripMeta, DayTimeline, MapInline, Gallery, Highlights | High |
| `/places` | Place index with map | MapWithDrawer, PlaceCard, CategoryChips | High |
| `/places/[slug]` | Place detail | PlaceHeader, MapPin, ReviewList, PhotoMasonry, Nearby | High |
| `/photos` | Global gallery | Filters (trip, place, year, camera, tags), Masonry, Lightbox | Medium |
| `/reviews` | Reviews index | ReviewCard, Sorter, Search (text + rating filter) | Medium |
| `/map` | Full-screen interactive map | LeafletMap, ClusterPins, Drawer | Medium |

### Discovery & Browsing

| Route | Purpose | Key Components | SEO Priority |
|-------|---------|----------------|--------------|
| `/countries` | Countries index | CountryGrid (flags + stats), Map | High |
| `/countries/[code]` | Country detail | Hero, CityList, TopPlaces, TopPhotos | High |
| `/tags` | Tags index | TagCloud, PopularTags | Medium |
| `/tags/[slug]` | Tag detail | MixedContentGrid (photos, places, trips) | Medium |
| `/collections` | Curated collections | CollectionGrid, Featured | Medium |
| `/collections/[slug]` | Collection detail | Hero, MixedGrid, Filters | Medium |
| `/timeline` | Chronological view | YearJumpBar, InfiniteScroll | Low |
| `/calendar` | Calendar view | MonthHeatmap, DayView | Low |
| `/highlights` | Curated "best-of" | EditorialLayout, Blurbs, CTAs | High |

### Guides & Content

| Route | Purpose | Key Components | SEO Priority |
|-------|---------|----------------|--------------|
| `/guides` | Guide index | GuideGrid (by region/type) | High |
| `/guides/[slug]` | City/region guide | Hero, TOC, Sections, InlineMaps | High |
| `/packing` | Packing lists index | TemplateGrid | Medium |
| `/packing/[slug]` | Specific packing list | ChecklistMode, TripReference | Low |
| `/gear` | Gear & equipment | GearCards, SamplePhotos, Categories | Medium |
| `/food` | Restaurants & cafés | VenueCards, MapPins, Filters (city, price, rating) | Medium |
| `/food/[slug]` | Venue detail | Header, Photos, Notes, Nearby | Medium |
| `/moments` | Micro-stories | CardStream, Shareable | Low |

### Utilities & Meta

| Route | Purpose | Key Components | SEO Priority |
|-------|---------|----------------|--------------|
| `/search` | Global search | SearchBox, Results, Facets (trip, place, tag) | High |
| `/year/[yyyy]` | Year-in-review | Stats, Highlights, MapPath, Collage | Medium |
| `/compare` | Compare trips/places | Side-by-side tables | Low |
| `/exports` | Data exports (auth required) | Download buttons, Timestamps | - |
| `/about` | Personal story, philosophy | MarkdownPage | Medium |
| `/contact` | Contact + newsletter | Form (Resend), CaptainForm | Low |
| `/newsletter` | Newsletter signup | EmailForm, DoubleOptIn | Low |
| `/guestbook` | Friend/family notes | GuestbookForm, Moderated | Low |
| `/badges` | Milestones & achievements | BadgeGrid, UnlockDates | Low |
| `/privacy` | Privacy policy | MarkdownPage | Low |
| `/terms` | Terms of service | MarkdownPage | Low |
| `/status` | System health (public) | HealthTiles (DB, Storage, Auth) | - |
| `/*` | 404 page | Friendly 404, Search shortcut, Map link | - |

---

## 🔐 Admin Routes

### Dashboard & Overview

| Route | Purpose | Key Components |
|-------|---------|----------------|
| `/admin` | Main dashboard | Counters (places, trips, photos, reviews), RecentItems, SystemHealth |
| `/admin/analytics` | Stats & insights | Charts, TopContent, Traffic |

### Content Management

| Route | Purpose | Key Components |
|-------|---------|----------------|
| `/admin/photos` | Photo upload & management | Uploader, BulkActions, DedupeWarnings, FaceBlur, GPS toggle |
| `/admin/trips` | Trip management | TripTable, Filters |
| `/admin/trips/new` | Create trip | TripForm, DayEditor, StopPicker |
| `/admin/trips/[id]/edit` | Edit trip | TripForm, DayTimeline, Reorder |
| `/admin/places` | Place management | PlaceTable, MapView |
| `/admin/places/new` | Create place | PlaceForm, CoordsPicker, CategoryManager |
| `/admin/places/[id]/edit` | Edit place | PlaceForm, PhotoAssignment |
| `/admin/reviews` | Review management | ReviewTable, QuickEdit |
| `/admin/reviews/new` | Write review | Editor (Tiptap), LinkToPlace/Trip, Rating |
| `/admin/reviews/[id]/edit` | Edit review | Editor, Metadata |
| `/admin/tags` | Tag taxonomy | TagTable, MergeTools, Usage stats |
| `/admin/collections` | Collection management | CollectionBuilder, ContentPicker |
| `/admin/guides` | Guide management | GuideTable, TemplateSelector |
| `/admin/guides/[id]/edit` | Edit guide | SectionEditor, InlinePhotos, MapPicker |
| `/admin/venues` | Venue (food) management | VenueTable, BatchImport |

### System & Tools

| Route | Purpose | Key Components |
|-------|---------|----------------|
| `/admin/import` | Import from external sources | SourceSelector (Apple Photos, Google Photos, Lightroom), Mapping, DryRun, pHashDedupe |
| `/admin/queues` | Background jobs | JobTable (status, retry, cancel), Progress |
| `/admin/moderation` | Privacy review | BatchApproval, RedFlags (kids + GPS), FaceDetection |
| `/admin/redirects` | URL redirects | RedirectTable (from, to, type 301/302) |
| `/admin/settings` | Site settings | BrandForm, VisibilityDefaults, RoleManagement |
| `/admin/audit` | Change history | AuditTable, RevertButton, FilterByEntity |

---

## 🧭 Navigation Structure

### Header (Desktop)

```
[ Logo ]  [ Trips ]  [ Places ]  [ Photos ]  [ Map ]  [ Reviews ]  [ Guides ]     [ Search 🔍 ]  [ ☀️/🌙 ]
```

### Mobile Bottom Bar

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│  Home   │  Trips  │ Places  │ Photos  │   Map   │
│   🏠    │   ✈️    │   📍    │   📸    │   🗺️   │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

### Footer

```
EXPLORE              CONTENT            CONNECT
• Trips              • Guides           • Newsletter
• Places             • Packing Lists    • Guestbook
• Photos             • Gear Reviews     • Contact
• Map                • Food & Cafés     
• Reviews                               LEGAL
                     DISCOVER           • Privacy
                     • Collections      • Terms
                     • Highlights
                     • Timeline         © 2025 Travel Blog
```

---

## 🎨 Page Templates

### 1. Homepage (/)

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ HEADER (nav)                                             │
├─────────────────────────────────────────────────────────┤
│ HERO GRID                                                │
│ ┌──────────────────────────┐  ┌──────────────────────┐ │
│ │  Featured Trip           │  │  Stats:              │ │
│ │  (cover + dates + CTA)   │  │  12 trips · 38 cities│ │
│ └──────────────────────────┘  └──────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ TRIP CAROUSEL                                            │
│ [Card] [Card] [Card] [Card] [Card] [Card] →             │
├─────────────────────────────────────────────────────────┤
│ LATEST PHOTOS (masonry grid)                             │
│ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣                                 │
├─────────────────────────────────────────────────────────┤
│ MINI MAP + NEWSLETTER                                    │
│ ┌──────────────────┐  ┌────────────────────────────┐   │
│ │  Last 50 pins    │  │  Get updates when we post  │   │
│ │  (clustered)     │  │  new adventures            │   │
│ └──────────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**SEO**:
- OG image: Collage of 4 latest photos
- JSON-LD: CollectionPage
- Meta description: "Real trips, real photos, honest notes from our family travels."

---

### 2. Trip Detail (/trips/[slug])

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ COVER IMAGE                                              │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Title | Apr 4–18, 2025 | 14 days | 🗺️ Map | 🔗 Share ││
│ └──────────────────────────────────────────────────────┘│
├─────────────────────┬───────────────────────────────────┤
│ SIDEBAR (sticky)    │ CONTENT                            │
│ • Day 1            │ ┌────────────────────────────────┐ │
│ • Day 2            │ │ DAY 1 - April 4                │ │
│ • Day 3            │ │ ┌─────────────┬──────────────┐ │ │
│ • ...              │ │ │ Stop 1      │ Stop 2       │ │ │
│ • Day 14           │ │ │ Place name  │ Place name   │ │ │
│                    │ │ │ ⭐ 4.5      │ ⭐ 5.0       │ │ │
│                    │ │ │ Notes...    │ Notes...     │ │ │
│                    │ │ └─────────────┴──────────────┘ │ │
│                    │ │ Photo strip: ▣ ▣ ▣ ▣ ▣ ▣     │ │
│                    │ └────────────────────────────────┘ │
│                    │                                     │
│                    │ [Repeat for each day...]            │
│                    │                                     │
│                    │ MAP (this trip only)                │
│                    │ ┌────────────────────────────────┐ │
│                    │ │ Pins for all stops             │ │
│                    │ └────────────────────────────────┘ │
└─────────────────────┴───────────────────────────────────┘
```

**SEO**:
- Title: "{Trip Title} | {Dates} | Travel Blog"
- OG image: Cover photo + dates overlay
- JSON-LD: Trip schema
- Breadcrumbs: Home > Trips > [Trip Title]

---

### 3. Place Detail (/places/[slug])

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ PLACE HEADER                                             │
│ Name | Region | ⭐ 4.5 (3 reviews) | [Open in Map 🗺️]  │
├─────────────────────────────────────────────────────────┤
│ HERO GALLERY (3 across)                                  │
│ ▣▣▣ ▣▣▣ ▣▣▣                                              │
├─────────────────────────────────────────────────────────┤
│ REVIEWS                                                  │
│ ┌──────────────────────────────────────────────────────┐│
│ │ ⭐⭐⭐⭐⭐ | Apr 15, 2025 | Mexico City 2025 trip      ││
│ │ "Amazing tacos, best we've had..." [Read more]       ││
│ └──────────────────────────────────────────────────────┘│
│ [More reviews...]                                        │
├─────────────────────────────────────────────────────────┤
│ SEEN ON TRIPS                                            │
│ [Mexico 2025] [Spain 2024]                               │
├─────────────────────────────────────────────────────────┤
│ NEARBY PLACES (map + list)                               │
│ ┌──────────────────┐  • Place 1 (2.3 km)                │
│ │  Map with pins   │  • Place 2 (5.1 km)                │
│ └──────────────────┘  • Place 3 (8.7 km)                │
└─────────────────────────────────────────────────────────┘
```

**SEO**:
- Title: "{Place Name} - {City}, {Country} | Travel Blog"
- OG image: Hero photo
- JSON-LD: Place + AggregateRating
- Schema: LocalBusiness or TouristAttraction

---

### 4. Guide (/guides/[slug])

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ GUIDE HEADER                                             │
│ Title: "Mexico City with Teens"                         │
│ Cover Photo | Summary | Best Time to Visit              │
├─────────────────────────────────────────────────────────┤
│ TABLE OF CONTENTS (sticky on scroll)                     │
│ • Where to Stay | • Where to Eat | • What to See | •Tips│
├─────────────────────────────────────────────────────────┤
│ SECTION: WHERE TO STAY                                   │
│ [Neighborhood] [Hotel recommendations] [Map]             │
├─────────────────────────────────────────────────────────┤
│ SECTION: WHERE TO EAT                                    │
│ [Venue cards with photos + ratings]                      │
├─────────────────────────────────────────────────────────┤
│ SECTION: WHAT TO SEE                                     │
│ [Place cards linked to /places/[slug]]                   │
├─────────────────────────────────────────────────────────┤
│ SECTION: TIPS                                            │
│ • Transportation | • Safety | • Money | • Language       │
└─────────────────────────────────────────────────────────┘
```

**SEO**:
- Title: "Complete Guide to {City} | Travel Blog"
- Meta: Comprehensive structured data
- Target long-tail keywords: "{City} with kids", "{City} guide"

---

### 5. Packing List (/packing/[slug])

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│ Title: "Summer in Spain - Packing List"                 │
│ Related trip: [Spain 2024]                               │
├─────────────────────────────────────────────────────────┤
│ CHECKLIST (admin can check off)                          │
│ CLOTHING                                                 │
│ ☑ 2x light shirts                                       │
│ ☑ Walking shoes                                         │
│ ☐ Sun hat                                               │
│                                                          │
│ ELECTRONICS                                              │
│ ☑ Camera + 3 batteries                                  │
│ ☑ Travel adapters (EU Type C)                           │
│ ☐ Phone charger                                         │
│                                                          │
│ [Download as PDF]                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 SEO Strategy

### Sitemap Inclusion

```xml
<!-- next-sitemap.config.js -->
{
  include: [
    '/',
    '/trips',
    '/trips/*',
    '/places',
    '/places/*',
    '/photos',
    '/reviews',
    '/map',
    '/countries',
    '/countries/*',
    '/guides',
    '/guides/*',
    '/collections',
    '/collections/*',
    '/tags/*',
    '/about',
    '/contact',
  ],
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
  ],
}
```

### Meta Templates

```typescript
// lib/seo.ts
export const seo = {
  title: {
    template: '%s • Travel Photo Blog',
    default: 'Travel Photo Blog - Real Trips, Real Photos',
  },
  description: 'Real trips, real photos, honest notes from our family travels.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'Travel Photo Blog',
  },
};
```

### JSON-LD Schemas

**Trip**:
```json
{
  "@context": "https://schema.org",
  "@type": "Trip",
  "name": "Mexico City 2025",
  "startDate": "2025-04-04",
  "endDate": "2025-04-18",
  "description": "Two weeks exploring Mexico City...",
  "itinerary": [...]
}
```

**Place**:
```json
{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Museo Frida Kahlo",
  "address": {...},
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 19.3551,
    "longitude": -99.1628
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "3"
  }
}
```

---

## 📱 Mobile Navigation

### Bottom Navigation (< 768px)

```tsx
// components/MobileNav.tsx
<nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
  <div className="grid grid-cols-5 h-16">
    <NavItem href="/" icon="🏠" label="Home" />
    <NavItem href="/trips" icon="✈️" label="Trips" />
    <NavItem href="/places" icon="📍" label="Places" />
    <NavItem href="/photos" icon="📸" label="Photos" />
    <NavItem href="/map" icon="🗺️" label="Map" />
  </div>
</nav>
```

---

## 🎯 URL Patterns

### Clean URLs

```
✅ /trips/mexico-city-2025
✅ /places/museo-frida-kahlo
✅ /guides/mexico-city-with-teens
✅ /countries/mx

❌ /trips?id=123
❌ /place.php?slug=museo
❌ /pages/guide/1
```

### Query Parameters (for filters only)

```
/photos?trip=mexico-2025&year=2025&camera=sony
/search?q=tacos&type=place
/compare?trip=mexico-2025&trip=spain-2024
```

---

## 📊 Analytics Events to Track

```typescript
// lib/analytics.ts
export const trackEvent = (event: string, properties?: object) => {
  // Vercel Analytics
  // Posthog
  // Custom tracking
};

// Key events:
- page_view
- trip_viewed
- photo_lightbox_opened
- search_performed
- newsletter_signup
- guide_downloaded
- map_interaction
```

---

## ✅ Implementation Checklist

### Phase 1: Core Routes
- [ ] Scaffold `/` homepage
- [ ] Create `/trips` and `/trips/[slug]`
- [ ] Create `/places` and `/places/[slug]`
- [ ] Create `/photos` gallery
- [ ] Create `/map` full-screen view

### Phase 2: Discovery
- [ ] Add `/countries` and `/countries/[code]`
- [ ] Add `/tags` and `/tags/[slug]`
- [ ] Add `/collections`
- [ ] Add `/search`

### Phase 3: Guides & Content
- [ ] Create `/guides/[slug]` template
- [ ] Add `/packing/[slug]`
- [ ] Add `/food` and `/food/[slug]`
- [ ] Add `/gear`

### Phase 4: Admin
- [ ] Build admin dashboard
- [ ] Photo management
- [ ] Trip builder with day editor
- [ ] Place/review CRUD

---

**Status**: ✅ Complete IA specification  
**Next**: Implement page scaffolds  
**Estimated**: 20-30 hours for all routes
