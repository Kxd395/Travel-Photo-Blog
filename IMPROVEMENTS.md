# 🚀 Production-Grade Improvements Roadmap

**Date**: October 2, 2025  
**Status**: Implementation Plan  
**Priority**: High-Impact → Foundation → Polish  
**Estimated Time**: 7-10 hours total

---

## 📊 Overview

Transform from **solid foundation** to **production-grade travel platform** in 3 focused sessions.

### What This Adds
- ✅ Rich relational data model with day-by-day itineraries
- ✅ Automated media pipeline with variants & deduplication
- ✅ Privacy controls & EXIF scrubbing
- ✅ Security hardening (CSP, rate limiting, audit logs)
- ✅ Admin UX enhancements (bulk ops, keyboard shortcuts)
- ✅ Full-text search with PostgreSQL trigrams
- ✅ E2E testing & error monitoring

---

## 🗺️ 3-Session Migration Plan

| Session | Focus | Time | Impact |
|---------|-------|------|--------|
| **1** | Schema & Data Model | 2-3 hrs | Foundation |
| **2** | Media Pipeline & Privacy | 3-4 hrs | Core Feature |
| **3** | UX, Security & Observability | 2-3 hrs | Production Polish |

---

## 🗄️ Session 1: Schema & Data Model (2-3 hours)

### Goals
- Day-by-day trip itineraries with stops
- Slugs for SEO-friendly URLs
- Soft deletes & audit trails
- Photo deduplication infrastructure
- Full-text search preparation

### New Prisma Schema

```prisma
// ============================================================================
// ENHANCED SCHEMA - Copy to prisma/schema.prisma
// ============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// CORE ENTITIES
// ============================================================================

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  photos    Photo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
}

model Place {
  id         String        @id @default(cuid())
  name       String
  slug       String        @unique @db.VarChar(96)
  lat        Decimal?      @db.Decimal(9, 6)
  lng        Decimal?      @db.Decimal(9, 6)
  address    String?
  categories String[]      @default([])
  
  // Search optimization
  searchVector String?     // Computed: name + address + categories
  
  // Relations
  visits     PlaceVisit[]
  photos     Photo[]
  reviews    Review[]
  tripStops  TripStop[]
  
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  @@index([slug])
  @@index([lat, lng])
}

model Trip {
  id          String        @id @default(cuid())
  title       String
  slug        String        @unique @db.VarChar(96)
  description String?       @db.Text
  
  // Dates
  start       DateTime
  end         DateTime
  
  // Privacy
  isPublic    Boolean       @default(true)
  shareToken  String?       @unique // For unlisted sharing
  shareExpiry DateTime?     // Optional expiration
  
  // Relations
  days        TripDay[]
  photos      Photo[]
  reviews     Review[]
  visits      PlaceVisit[]
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([slug])
  @@index([start, end])
  @@index([shareToken])
}

model TripDay {
  id        String     @id @default(cuid())
  tripId    String
  dayIndex  Int        // 0-based: Day 0, Day 1, etc.
  date      DateTime?  // Actual date for this day
  notes     String?    @db.Text
  
  trip      Trip       @relation(fields: [tripId], references: [id], onDelete: Cascade)
  stops     TripStop[]
  photos    Photo[]
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@unique([tripId, dayIndex])
  @@index([tripId, dayIndex])
}

model TripStop {
  id        String   @id @default(cuid())
  dayId     String
  placeId   String
  order     Int      @default(0) // Order within the day
  notes     String?  @db.Text
  arrivedAt DateTime?
  leftAt    DateTime?
  
  day       TripDay  @relation(fields: [dayId], references: [id], onDelete: Cascade)
  place     Place    @relation(fields: [placeId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([dayId, order])
  @@index([dayId, order])
}

model PlaceVisit {
  id         String    @id @default(cuid())
  placeId    String
  tripId     String?
  visitedOn  DateTime?
  notes      String?   @db.Text
  
  place      Place     @relation(fields: [placeId], references: [id])
  trip       Trip?     @relation(fields: [tripId], references: [id])
  
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@index([placeId])
  @@index([tripId])
  @@index([visitedOn])
}

// ============================================================================
// MEDIA & PHOTOS
// ============================================================================

model Photo {
  id          String    @id @default(cuid())
  
  // Content
  title       String?
  description String?   @db.Text
  altText     String?   @db.Text // Required for accessibility
  
  // Storage
  originalUrl String
  variants    Json      // {thumb: url, grid: url, lightbox: url}
  
  // Metadata
  takenAt     DateTime?
  lat         Decimal?  @db.Decimal(9, 6)
  lng         Decimal?  @db.Decimal(9, 6)
  exif        Json?     // Full EXIF (server-side only)
  exifPublic  Json?     // Scrubbed EXIF for public display
  
  // Deduplication
  phash       String?   @unique @db.Char(16) // Perceptual hash
  fileHash    String?   // SHA-256 for exact duplicates
  
  // Privacy
  isPublic    Boolean   @default(true)
  facesBlurred Boolean  @default(false)
  gpsPublic   Boolean   @default(true) // Show precise GPS?
  
  // Relations
  placeId     String?
  tripId      String?
  dayId       String?
  authorId    String?
  
  place       Place?    @relation(fields: [placeId], references: [id])
  trip        Trip?     @relation(fields: [tripId], references: [id])
  day         TripDay?  @relation(fields: [dayId], references: [id])
  author      User?     @relation(fields: [authorId], references: [id])
  tags        Tag[]
  
  // Lifecycle
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime? // Soft delete

  @@index([placeId])
  @@index([tripId])
  @@index([dayId])
  @@index([takenAt])
  @@index([lat, lng])
  @@index([phash])
  @@index([deletedAt])
}

// ============================================================================
// REVIEWS
// ============================================================================

model Review {
  id         String   @id @default(cuid())
  rating     Int      @db.SmallInt // 1-5
  title      String?
  body       String   @db.Text
  tips       String?  @db.Text
  visitedOn  DateTime?
  
  // Privacy
  isPublic   Boolean  @default(true)
  
  // Relations
  placeId    String
  tripId     String?
  authorId   String
  
  place      Place    @relation(fields: [placeId], references: [id])
  trip       Trip?    @relation(fields: [tripId], references: [id])
  author     User     @relation(fields: [authorId], references: [id])
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([placeId])
  @@index([tripId])
  @@index([rating])
  @@index([visitedOn])
}

// ============================================================================
// AUDIT & SECURITY
// ============================================================================

model AuditLog {
  id        String   @id @default(cuid())
  actorId   String   // User who performed action
  action    String   // CREATE, UPDATE, DELETE, PUBLISH
  entity    String   // Photo, Trip, Place, Review
  entityId  String
  diff      Json?    // Old vs new values
  metadata  Json?    // IP, user agent, etc.
  
  createdAt DateTime @default(now())

  @@index([entityId])
  @@index([actorId])
  @@index([entity, entityId])
  @@index([createdAt])
}

// ============================================================================
// USER & AUTH
// ============================================================================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("viewer") // admin | editor | viewer
  
  accounts      Account[]
  sessions      Session[]
  photos        Photo[]
  reviews       Review[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### Migration Steps

```bash
# 1. Install dependencies
npm install slugify image-hash

# 2. Enable PostgreSQL extensions
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"

# 3. Run migration
npx prisma migrate dev --name travel_relations_and_media

# 4. Generate Prisma client
npx prisma generate
```

### Data Backfill Script

```typescript
// scripts/backfill-slugs.ts
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Backfilling slugs...');

  // Backfill Place slugs
  const places = await prisma.place.findMany();
  for (const place of places) {
    const slug = slugify(place.name, { lower: true, strict: true });
    await prisma.place.update({
      where: { id: place.id },
      data: { slug },
    });
  }
  console.log(`✅ Updated ${places.length} places`);

  // Backfill Trip slugs
  const trips = await prisma.trip.findMany();
  for (const trip of trips) {
    const slug = slugify(trip.title, { lower: true, strict: true });
    await prisma.trip.update({
      where: { id: trip.id },
      data: { slug },
    });
  }
  console.log(`✅ Updated ${trips.length} trips`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```bash
# Run backfill
npx tsx scripts/backfill-slugs.ts
```

### ✅ Session 1 Checklist

- [ ] Backup current database
- [ ] Install `slugify` and `image-hash` packages
- [ ] Enable `pg_trgm` PostgreSQL extension
- [ ] Copy new schema to `prisma/schema.prisma`
- [ ] Run `npx prisma migrate dev`
- [ ] Create and run backfill script
- [ ] Verify with `npx prisma studio`

---

## 📸 Session 2: Media Pipeline & Privacy (3-4 hours)

### Goals
- Generate 3 image variants on upload (thumb, grid, lightbox)
- Strip sensitive EXIF before public delivery
- Compute pHash for duplicate detection
- Background job processing with Inngest
- Rate limiting on uploads

### Install Dependencies

```bash
npm install inngest @upstash/ratelimit @upstash/redis sharp
```

### Image Variants Generator

```typescript
// lib/media/variants.ts
import sharp from 'sharp';
import { createHash } from 'crypto';

export const VARIANT_SIZES = {
  thumb: 320,
  grid: 800,
  lightbox: 1600,
} as const;

export interface ImageVariants {
  thumb: string;
  grid: string;
  lightbox: string;
  original: string;
}

export async function generateVariants(
  buffer: Buffer,
  uploadFn: (buffer: Buffer, filename: string) => Promise<string>
): Promise<ImageVariants> {
  const variants: Partial<ImageVariants> = {};

  // Generate each variant
  for (const [variant, width] of Object.entries(VARIANT_SIZES)) {
    const processed = await sharp(buffer)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true,
      })
      .rotate() // Auto-rotate based on EXIF
      .toBuffer();

    const filename = `${variant}-${Date.now()}.jpg`;
    variants[variant as keyof typeof VARIANT_SIZES] = await uploadFn(
      processed,
      filename
    );
  }

  // Upload original (HEIC → JPEG if needed)
  const originalJpeg = await sharp(buffer)
    .jpeg({ quality: 95, progressive: true })
    .rotate()
    .toBuffer();

  variants.original = await uploadFn(
    originalJpeg,
    `original-${Date.now()}.jpg`
  );

  return variants as ImageVariants;
}

export async function computeHashes(buffer: Buffer) {
  const imageHash = await import('image-hash');
  
  // File hash (exact duplicates)
  const fileHash = createHash('sha256').update(buffer).digest('hex');

  // Perceptual hash (similar images)
  const phash = await new Promise<string>((resolve, reject) => {
    imageHash.imageHash(
      { data: buffer },
      16,
      true,
      (error: Error | null, data: string) => {
        if (error) reject(error);
        else resolve(data);
      }
    );
  });

  return { fileHash, phash };
}
```

### EXIF Scrubber

```typescript
// lib/media/exif.ts
import ExifReader from 'exifreader';

interface ExifData {
  takenAt?: Date;
  lat?: number;
  lng?: number;
  camera?: {
    make?: string;
    model?: string;
    lens?: string;
  };
  settings?: {
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
  };
}

const SENSITIVE_TAGS = [
  'GPSLatitude',
  'GPSLongitude',
  'GPSAltitude',
  'GPSImgDirection',
  'UserComment',
  'SerialNumber',
  'LensSerialNumber',
  'OwnerName',
  'CameraOwnerName',
];

export function extractExif(buffer: Buffer): ExifData {
  const tags = ExifReader.load(buffer);

  return {
    takenAt: tags.DateTime?.description
      ? new Date(tags.DateTime.description)
      : undefined,
    lat: tags.GPSLatitude?.description,
    lng: tags.GPSLongitude?.description,
    camera: {
      make: tags.Make?.description,
      model: tags.Model?.description,
      lens: tags.LensModel?.description,
    },
    settings: {
      aperture: tags.FNumber?.description,
      shutterSpeed: tags.ExposureTime?.description,
      iso: tags.ISOSpeedRatings?.description,
      focalLength: tags.FocalLength?.description,
    },
  };
}

export function scrubSensitiveExif(exif: any): any {
  const scrubbed = { ...exif };
  SENSITIVE_TAGS.forEach((tag) => delete scrubbed[tag]);
  return scrubbed;
}

export function roundGPS(lat?: number, lng?: number, precision = 2) {
  if (!lat || !lng) return { lat: undefined, lng: undefined };
  return {
    lat: Number(lat.toFixed(precision)),
    lng: Number(lng.toFixed(precision)),
  };
}
```

### Background Job Processor (Inngest)

```typescript
// lib/jobs/inngest.ts
import { Inngest } from 'inngest';

export const inngest = new Inngest({ id: 'travel-photo-blog' });

// lib/jobs/photo-processor.ts
import { inngest } from './inngest';
import { generateVariants, computeHashes } from '@/lib/media/variants';
import { extractExif, scrubSensitiveExif } from '@/lib/media/exif';
import { prisma } from '@/lib/prisma';

export const processPhoto = inngest.createFunction(
  { id: 'process-photo' },
  { event: 'photo.uploaded' },
  async ({ event, step }) => {
    const { photoId, buffer } = event.data;

    // Step 1: Generate variants
    const variants = await step.run('generate-variants', async () => {
      return await generateVariants(buffer, uploadToStorage);
    });

    // Step 2: Compute hashes
    const { fileHash, phash } = await step.run('compute-hashes', async () => {
      return await computeHashes(buffer);
    });

    // Step 3: Extract EXIF
    const exif = await step.run('extract-exif', async () => {
      return extractExif(buffer);
    });

    // Step 4: Check duplicates
    const duplicate = await step.run('check-duplicates', async () => {
      return await prisma.photo.findFirst({
        where: { OR: [{ fileHash }, { phash }] },
      });
    });

    // Step 5: Update photo
    await step.run('update-photo', async () => {
      return await prisma.photo.update({
        where: { id: photoId },
        data: {
          variants,
          phash,
          fileHash,
          exif,
          exifPublic: scrubSensitiveExif(exif),
          takenAt: exif.takenAt,
          lat: exif.lat,
          lng: exif.lng,
          ...(duplicate && {
            description: `⚠️ Possible duplicate of ${duplicate.id}`,
          }),
        },
      });
    });

    return { success: true, duplicate: !!duplicate };
  }
);

// app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '@/lib/jobs/inngest';
import { processPhoto } from '@/lib/jobs/photo-processor';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processPhoto],
});
```

### Rate-Limited Upload API

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 per minute
  analytics: true,
});

// app/api/admin/photos/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ratelimit } from '@/lib/rate-limit';
import { canManageContent } from '@/lib/admin';
import { inngest } from '@/lib/jobs/inngest';

export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success, limit, remaining } = await ratelimit.limit(`upload:${ip}`);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many uploads. Slow down.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    );
  }

  // 2. Auth
  const session = await getServerSession();
  if (!session?.user?.email || !canManageContent(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 3. Validate
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/heic'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (10MB max)' }, { status: 400 });
  }

  // 4. Create photo
  const photo = await prisma.photo.create({
    data: {
      originalUrl: 'pending',
      authorId: session.user.id,
      isPublic: false,
    },
  });

  // 5. Queue processing
  const buffer = Buffer.from(await file.arrayBuffer());
  await inngest.send({
    name: 'photo.uploaded',
    data: { photoId: photo.id, buffer },
  });

  // 6. Return 202 Accepted
  return NextResponse.json(
    { id: photo.id, status: 'processing' },
    { status: 202 }
  );
}
```

### ✅ Session 2 Checklist

- [ ] Install Inngest, Upstash packages
- [ ] Create Upstash Redis account
- [ ] Create Inngest account
- [ ] Add env vars: `UPSTASH_REDIS_REST_URL`, `INNGEST_EVENT_KEY`
- [ ] Create `lib/media/variants.ts`
- [ ] Create `lib/media/exif.ts`
- [ ] Create `lib/jobs/photo-processor.ts`
- [ ] Update upload API route
- [ ] Test upload flow end-to-end

---

## 🔒 Session 3: Security, UX & Observability (2-3 hours)

### Goals
- Content Security Policy headers
- Audit logging for all actions
- Bulk operations UI
- Keyboard shortcuts
- Sentry error tracking
- Playwright E2E tests
- Full-text search

### Content Security Policy

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://*.uploadthing.com https://tile.openstreetmap.org",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://*.uploadthing.com https://*.supabase.co",
  "frame-ancestors 'none'",
].join('; ');

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('Content-Security-Policy', CSP);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Audit Logging

```typescript
// lib/audit.ts
import { prisma } from './prisma';

export async function logAction(params: {
  actorId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH';
  entity: 'Photo' | 'Trip' | 'Place' | 'Review';
  entityId: string;
  diff?: any;
  metadata?: any;
}) {
  await prisma.auditLog.create({ data: params });
}

// Usage
await logAction({
  actorId: session.user.id,
  action: 'UPDATE',
  entity: 'Photo',
  entityId: photo.id,
  diff: { before: oldPhoto, after: newPhoto },
  metadata: { ip: req.headers.get('x-forwarded-for') },
});
```

### Bulk Operations Component

```typescript
// components/admin/PhotoBulkActions.tsx
'use client';

import { useState } from 'react';

export function PhotoBulkActions({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const bulkPublish = async () => {
    await fetch('/api/admin/photos/bulk', {
      method: 'PATCH',
      body: JSON.stringify({
        ids: Array.from(selected),
        action: 'publish',
      }),
    });
  };

  return (
    <div>
      {selected.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg p-4">
          <span>{selected.size} selected</span>
          <button onClick={bulkPublish}>Publish</button>
        </div>
      )}
      {/* Grid with checkboxes */}
    </div>
  );
}
```

### Keyboard Shortcuts

```typescript
// components/admin/KeyboardShortcuts.tsx
'use client';

import { useEffect } from 'react';

export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case 'e':
          if (e.metaKey) {
            e.preventDefault();
            // Open edit modal
          }
          break;
        case 't':
          if (e.metaKey) {
            e.preventDefault();
            // Open tag modal
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return null;
}
```

### Sentry Setup

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Playwright Tests

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// tests/smoke.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});

test('admin requires auth', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/auth\/signin/);
});

test('can upload photo', async ({ page }) => {
  // Sign in flow
  await page.goto('/auth/signin');
  // ... auth steps

  await page.goto('/admin/photos');
  await page.setInputFiles('input[type="file"]', 'test-photo.jpg');
  await expect(page.locator('text=processing')).toBeVisible();
});
```

### Full-Text Search

```typescript
// lib/search.ts
import { prisma } from './prisma';

export async function searchContent(query: string) {
  const results = await prisma.$queryRaw`
    SELECT 'place' as type, id, name as title, slug
    FROM "Place"
    WHERE name ILIKE ${'%' + query + '%'}
    UNION ALL
    SELECT 'trip' as type, id, title, slug
    FROM "Trip"
    WHERE title ILIKE ${'%' + query + '%'}
    LIMIT 10
  `;
  return results;
}

// app/api/search/route.ts
import { searchContent } from '@/lib/search';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  
  if (!q || q.length < 2) {
    return Response.json({ results: [] });
  }
  
  const results = await searchContent(q);
  return Response.json({ results });
}
```

### ✅ Session 3 Checklist

- [ ] Add CSP to middleware
- [ ] Create audit logging helpers
- [ ] Build bulk operations UI
- [ ] Add keyboard shortcuts
- [ ] Install & configure Sentry
- [ ] Install Playwright
- [ ] Write smoke tests
- [ ] Implement search endpoint
- [ ] Run `npx playwright test`

---

## 📋 Complete Implementation Checklist

### Environment Setup
- [ ] Create Upstash Redis account
- [ ] Create Inngest account
- [ ] Create Sentry account
- [ ] Add all env vars to `.env`

### Session 1: Data Model
- [ ] Backup database
- [ ] Install dependencies
- [ ] Enable PostgreSQL extensions
- [ ] Update Prisma schema
- [ ] Run migrations
- [ ] Backfill slugs

### Session 2: Media Pipeline
- [ ] Install media packages
- [ ] Create variant generator
- [ ] Create EXIF scrubber
- [ ] Set up Inngest jobs
- [ ] Add rate limiting
- [ ] Test upload flow

### Session 3: Security & UX
- [ ] Add CSP headers
- [ ] Implement audit logs
- [ ] Build bulk operations
- [ ] Add keyboard shortcuts
- [ ] Configure Sentry
- [ ] Write E2E tests
- [ ] Add search

### Testing & Deployment
- [ ] Run Playwright tests
- [ ] Check Sentry dashboard
- [ ] Test on staging
- [ ] Deploy to production
- [ ] Tag release v0.2.0

---

## 🚀 Quick Start Commands

```bash
# Session 1
npm install slugify image-hash
npx prisma migrate dev --name travel_relations_and_media
npx tsx scripts/backfill-slugs.ts

# Session 2
npm install inngest @upstash/ratelimit @upstash/redis
# Add env vars, then restart dev server

# Session 3
npx @sentry/wizard -i nextjs
npm install -D @playwright/test
npx playwright install
npx playwright test

# Deploy
git add .
git commit -m "feat: production-grade improvements v0.2.0"
git tag v0.2.0
git push --tags
```

---

## 📊 Success Metrics

After completing all 3 sessions:

✅ **3 image variants** generated on every upload  
✅ **Duplicate detection** via pHash  
✅ **Privacy controls** per photo (GPS, faces)  
✅ **Soft deletes** protect against accidents  
✅ **Audit trail** for all admin actions  
✅ **Rate limiting** prevents abuse  
✅ **CSP headers** harden security  
✅ **E2E tests** validate critical flows  
✅ **Search** across content  
✅ **Bulk operations** save time  
✅ **Background jobs** keep uploads fast  

---

## 🎯 What's Next (v0.3.0)

After v0.2.0 ships:

1. **PWA capabilities** (offline, install, background sync)
2. **Social OG images** with @vercel/og
3. **Map clustering** for better UX
4. **Rich text editor** (Tiptap/Novel)
5. **Export functionality** (trip PDFs)
6. **Multi-language** support

---

## 📚 Resources

- [Inngest Docs](https://www.inngest.com/docs)
- [Upstash Docs](https://upstash.com/docs)
- [Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Playwright](https://playwright.dev/docs/intro)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)

---

**Ready to start? Begin with Session 1!** 🚀

Let me know if you want me to implement any session or need help with specific parts.
