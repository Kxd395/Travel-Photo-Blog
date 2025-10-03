# 🗄️ Enhanced Database Schema

**Date**: October 2, 2025  
**Status**: Production-Ready Schema  
**Database**: PostgreSQL via Prisma

---

## 📊 Overview

Complete database schema with:
- Core travel content (Trip, Place, Photo, Review)
- Discovery features (Country, Tag, Collection)
- Content types (Guide, PackingList, Venue, Moment)
- Admin features (AuditLog, Favorite, GuestbookEntry)

**Total Models**: 20+

---

## 🎯 Schema Extensions

### Add to existing `prisma/schema.prisma`:

```prisma
// ============================================================================
// DISCOVERY & NAVIGATION
// ============================================================================

model Collection {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?  @db.Text
  coverPhotoId String?
  
  // Content references (stored as arrays for flexibility)
  tripIds     String[] @default([])
  placeIds    String[] @default([])
  photoIds    String[] @default([])
  
  // Visibility
  isPublic    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
}

model Country {
  code        String   @id @db.Char(2)  // ISO 3166-1 alpha-2
  name        String
  heroPhotoId String?
  summary     String?  @db.Text
  
  cities      City[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([name])
}

model City {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  countryCode String
  
  // Coordinates (for map positioning)
  lat         Decimal? @db.Decimal(9, 6)
  lng         Decimal? @db.Decimal(9, 6)
  
  // Relations
  country     Country  @relation(fields: [countryCode], references: [code])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([countryCode])
  @@index([lat, lng])
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

model Guide {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  
  // Area reference (could be country code, city slug, or custom)
  areaRef     String?
  
  coverPhotoId String?
  
  // Structured content
  sections    Json?    // [{heading, body, photos[]}]
  
  // Practical info
  bestTimeToVisit String? @db.Text
  tips        Json?    // [{category, items[]}]
  
  // SEO
  metaDescription String? @db.Text
  
  // Visibility
  isPublic    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([areaRef])
}

model PackingList {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  
  // Optional trip reference
  tripId      String?
  trip        Trip?    @relation(fields: [tripId], references: [id])
  
  // Items structure: [{label, qty?, note?, required?}]
  items       Json
  
  // Visibility
  isPublic    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([tripId])
}

model Venue {
  id          String    @id @default(cuid())
  name        String
  
  // Category: restaurant | cafe | market | bar
  category    String
  
  // Optional place reference (if venue is at a specific place)
  placeId     String?
  place       Place?    @relation(fields: [placeId], references: [id])
  
  // Ratings & pricing
  rating      Int?      @db.SmallInt  // 1-5
  priceTier   Int?      @db.SmallInt  // 1-4 ($, $$, $$$, $$$$)
  
  // Visit info
  visitedOn   DateTime?
  
  // Location (can be independent of place)
  address     String?
  lat         Decimal?  @db.Decimal(9, 6)
  lng         Decimal?  @db.Decimal(9, 6)
  
  // Content
  notes       String?   @db.Text
  photos      Json?     // Photo IDs or URLs
  
  // Visibility
  isPublic    Boolean   @default(true)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([placeId])
  @@index([category])
  @@index([lat, lng])
  @@index([visitedOn])
}

model GearItem {
  id          String   @id @default(cuid())
  name        String
  brand       String?
  category    String   // camera | lens | accessory | clothing | bag
  
  // Usage tracking
  usedOnTrips String[] @default([])  // Trip IDs
  
  // Sample photo showing this gear
  photoId     String?
  
  // Notes & affiliate
  notes       String?  @db.Text
  affiliateUrl String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
}

model Moment {
  id          String    @id @default(cuid())
  title       String?
  body        String    @db.Text
  
  // Optional references
  photoId     String?
  placeId     String?
  tripId      String?
  
  // When this moment happened
  takenAt     DateTime?
  
  // Visibility
  isPublic    Boolean   @default(true)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([takenAt])
  @@index([tripId])
}

// ============================================================================
// ENGAGEMENT & SOCIAL
// ============================================================================

model Favorite {
  id          String   @id @default(cuid())
  
  // Entity type: 'place' | 'photo' | 'trip' | 'venue'
  entityType  String
  entityId    String
  
  // Optional editorial blurb
  blurb       String?  @db.Text
  
  // Display order
  order       Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([entityType, entityId])
  @@index([order])
}

model GuestbookEntry {
  id          String   @id @default(cuid())
  name        String
  message     String   @db.Text
  
  // Optional trip reference
  relatedTripId String?
  
  // Moderation
  isPublic    Boolean  @default(false)  // Requires approval
  isApproved  Boolean  @default(false)
  
  createdAt   DateTime @default(now())

  @@index([relatedTripId])
  @@index([isPublic])
}

model Newsletter {
  id          String   @id @default(cuid())
  email       String   @unique
  
  // Double opt-in
  isVerified  Boolean  @default(false)
  verifiedAt  DateTime?
  
  // Unsubscribe
  isActive    Boolean  @default(true)
  unsubscribedAt DateTime?
  
  createdAt   DateTime @default(now())

  @@index([email])
  @@index([isActive])
}

// ============================================================================
// ADMIN & OPERATIONS
// ============================================================================

model Redirect {
  id          String   @id @default(cuid())
  
  // Path (without domain)
  from        String   @unique
  to          String
  
  // Type: 301 (permanent) | 302 (temporary)
  type        Int      @default(301)
  
  // Tracking
  hits        Int      @default(0)
  lastHitAt   DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([from])
}

model ImportJob {
  id          String   @id @default(cuid())
  
  // Source: apple-photos | google-photos | lightroom | manual
  source      String
  
  // Status: pending | processing | completed | failed
  status      String   @default("pending")
  
  // Progress tracking
  totalItems  Int      @default(0)
  processedItems Int   @default(0)
  failedItems Int      @default(0)
  
  // Results
  importedPhotoIds String[] @default([])
  duplicatePhotoIds String[] @default([])
  errors      Json?
  
  // Mapping preset used
  mapping     Json?
  
  // Run by
  userId      String
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  completedAt DateTime?

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

// ============================================================================
// RELATIONS TO EXISTING MODELS
// ============================================================================

// Add these to existing models:

// Photo model - add these fields:
// cityId      String?
// city        City?    @relation(fields: [cityId], references: [id])

// Place model - add:
// cityId      String?
// city        City?    @relation(fields: [cityId], references: [id])
// venues      Venue[]

// Trip model - add:
// packingLists PackingList[]
```

---

## 🔄 Migration Strategy

### Step 1: Backup

```bash
# Backup current database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Step 2: Add New Models

```bash
# Create migration
npx prisma migrate dev --name add_discovery_content_models

# Generate Prisma client
npx prisma generate
```

### Step 3: Seed Data

```typescript
// prisma/seed-countries.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const countries = [
  { code: 'MX', name: 'Mexico' },
  { code: 'ES', name: 'Spain' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  // Add more countries as needed
];

async function seedCountries() {
  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
  }
  console.log('✅ Seeded countries');
}

seedCountries()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```bash
# Run seed
npx tsx prisma/seed-countries.ts
```

---

## 📋 Content Forms (Exact Fields)

### Collection

```typescript
interface CollectionForm {
  title: string;
  slug: string;
  description?: string;
  coverPhotoId?: string;
  tripIds: string[];
  placeIds: string[];
  photoIds: string[];
  isPublic: boolean;
}
```

### Guide

```typescript
interface GuideForm {
  title: string;
  slug: string;
  areaRef?: string;  // Country code or city slug
  coverPhotoId?: string;
  bestTimeToVisit?: string;
  metaDescription?: string;
  sections: Array<{
    heading: string;
    body: string;
    photos?: string[];
  }>;
  tips: Array<{
    category: string;  // "Transportation", "Safety", etc.
    items: string[];
  }>;
  isPublic: boolean;
}
```

### PackingList

```typescript
interface PackingListForm {
  title: string;
  slug: string;
  tripId?: string;
  items: Array<{
    label: string;
    qty?: number;
    note?: string;
    required?: boolean;
  }>;
  isPublic: boolean;
}
```

### Venue

```typescript
interface VenueForm {
  name: string;
  category: 'restaurant' | 'cafe' | 'market' | 'bar';
  placeId?: string;
  rating?: number;  // 1-5
  priceTier?: number;  // 1-4
  visitedOn?: Date;
  address?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  photos?: string[];  // Photo IDs
  isPublic: boolean;
}
```

### Favorite

```typescript
interface FavoriteForm {
  entityType: 'place' | 'photo' | 'trip' | 'venue';
  entityId: string;
  blurb?: string;
  order: number;
}
```

---

## 🎨 Admin Form Components

### Collection Builder

```tsx
// app/admin/collections/[id]/edit/page.tsx
'use client';

import { useState } from 'react';
import { ContentPicker } from '@/components/admin/ContentPicker';

export function CollectionEditor({ collection }: { collection: Collection }) {
  const [selectedTrips, setSelectedTrips] = useState(collection.tripIds);
  const [selectedPlaces, setSelectedPlaces] = useState(collection.placeIds);
  const [selectedPhotos, setSelectedPhotos] = useState(collection.photoIds);

  return (
    <form>
      <Input name="title" label="Collection Title" />
      <Input name="slug" label="Slug" />
      <Textarea name="description" label="Description" />
      
      <ContentPicker
        type="trip"
        selected={selectedTrips}
        onChange={setSelectedTrips}
      />
      
      <ContentPicker
        type="place"
        selected={selectedPlaces}
        onChange={setSelectedPlaces}
      />
      
      <ContentPicker
        type="photo"
        selected={selectedPhotos}
        onChange={setSelectedPhotos}
      />
      
      <Button type="submit">Save Collection</Button>
    </form>
  );
}
```

### Guide Section Editor

```tsx
// components/admin/GuideSectionEditor.tsx
'use client';

import { useState } from 'react';
import { Tiptap } from '@/components/ui/Tiptap';

export function GuideSectionEditor({ sections, onChange }) {
  const addSection = () => {
    onChange([...sections, { heading: '', body: '', photos: [] }]);
  };

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="border rounded-xl p-6">
          <Input
            value={section.heading}
            onChange={(e) => updateSection(index, 'heading', e.target.value)}
            label="Section Heading"
          />
          
          <Tiptap
            content={section.body}
            onChange={(content) => updateSection(index, 'body', content)}
          />
          
          <PhotoPicker
            selected={section.photos}
            onChange={(photos) => updateSection(index, 'photos', photos)}
          />
        </div>
      ))}
      
      <Button onClick={addSection}>+ Add Section</Button>
    </div>
  );
}
```

### Venue Form

```tsx
// app/admin/venues/new/page.tsx
export function VenueForm() {
  return (
    <form>
      <Input name="name" label="Venue Name" required />
      
      <Select name="category" label="Category">
        <option value="restaurant">Restaurant</option>
        <option value="cafe">Café</option>
        <option value="market">Market</option>
        <option value="bar">Bar</option>
      </Select>
      
      <PlacePicker name="placeId" label="Link to Place (optional)" />
      
      <StarRating name="rating" label="Rating" />
      
      <Select name="priceTier" label="Price Range">
        <option value="1">$ (Budget)</option>
        <option value="2">$$ (Moderate)</option>
        <option value="3">$$$ (Upscale)</option>
        <option value="4">$$$$ (Fine Dining)</option>
      </Select>
      
      <DatePicker name="visitedOn" label="Visited On" />
      
      <Input name="address" label="Address" />
      
      <CoordinatesPicker name="coordinates" />
      
      <Textarea name="notes" label="Notes" />
      
      <PhotoPicker name="photos" label="Photos" multiple />
      
      <Switch name="isPublic" label="Make Public" />
      
      <Button type="submit">Save Venue</Button>
    </form>
  );
}
```

---

## 🔍 Search & Filtering

### Global Search Query

```sql
-- Full-text search across all content types
SELECT 
  'trip' as type,
  id,
  title as name,
  slug,
  description as excerpt
FROM "Trip"
WHERE 
  title ILIKE '%query%' 
  OR description ILIKE '%query%'

UNION ALL

SELECT 
  'place' as type,
  id,
  name,
  slug,
  address as excerpt
FROM "Place"
WHERE 
  name ILIKE '%query%'
  OR address ILIKE '%query%'

UNION ALL

SELECT 
  'guide' as type,
  id,
  title as name,
  slug,
  "metaDescription" as excerpt
FROM "Guide"
WHERE 
  title ILIKE '%query%'

UNION ALL

SELECT 
  'venue' as type,
  id,
  name,
  slug,
  notes as excerpt
FROM "Venue"
WHERE 
  name ILIKE '%query%'
  OR notes ILIKE '%query%'

ORDER BY name
LIMIT 20;
```

---

## 📊 Computed Fields

### Country Visit Count

```typescript
// lib/queries/countries.ts
export async function getCountriesWithStats() {
  const countries = await prisma.country.findMany({
    include: {
      cities: {
        include: {
          _count: {
            select: { places: true }
          }
        }
      }
    }
  });

  return countries.map(country => ({
    ...country,
    visitedCityCount: country.cities.length,
    totalPlaces: country.cities.reduce((sum, city) => sum + city._count.places, 0)
  }));
}
```

---

## ✅ Migration Checklist

- [ ] Backup current database
- [ ] Add new models to schema
- [ ] Run `prisma migrate dev`
- [ ] Seed countries data
- [ ] Test all relations
- [ ] Update TypeScript types
- [ ] Create admin forms
- [ ] Test CRUD operations
- [ ] Update API routes
- [ ] Deploy migration

---

**Status**: ✅ Schema ready for implementation  
**Estimated time**: 4-6 hours to fully integrate
