# React 19 Migration Preparation Checklist

**Status**: 🟡 In Progress  
**Target Date**: TBD  
**Current Version**: React 18.2.0, Next.js 14.2.33

---

## ✅ Quick Wins Completed

### Performance Improvements
- [x] Added resource preloading hints (preconnect, dns-prefetch)
  - UploadThing CDN preconnection
  - OpenStreetMap tile prefetch
  - Unpkg CDN prefetch for Leaflet

### Code Preparation
- [x] Restructured NewsletterForm with useTransition
  - Separated action logic for easy server function migration
  - Added pending states
  - Ready for `useActionState` conversion

---

## 📋 Pre-Migration Tasks

### 1. Dependency Audit
- [ ] Check all dependencies for React 19 compatibility
  - [ ] `next-auth` compatibility
  - [ ] `uploadthing` compatibility
  - [ ] `react-leaflet` compatibility
  - [ ] `@dnd-kit` compatibility
  - [ ] `react-hook-form` compatibility

### 2. Code Preparation
- [ ] Identify all forms for `useActionState` migration
  - [x] NewsletterForm (prepared)
  - [ ] SignInForm
  - [ ] PhotoUpload form
  - [ ] PhotoManagement forms
  
- [ ] Identify components for Server Component conversion
  - [ ] `/app/page.tsx` (homepage)
  - [ ] `/app/trips/page.tsx`
  - [ ] `/app/places/[slug]/page.tsx`
  - [ ] `/app/trips/[slug]/page.tsx`
  - [ ] `/app/reviews/page.tsx`

- [ ] Create server action structure
  - [ ] `/app/actions/` directory
  - [ ] Newsletter subscription action
  - [ ] Photo management actions
  - [ ] User authentication actions

### 3. Testing Preparation
- [ ] Document current functionality
- [ ] Create test scenarios for critical paths
  - [ ] Newsletter subscription
  - [ ] Photo upload
  - [ ] Authentication flow
  - [ ] Map rendering
  - [ ] Trip browsing

---

## 🚀 Migration Phases

### Phase 1: Upgrade Dependencies (Week 1)

#### Day 1-2: Create Migration Branch
```bash
git checkout -b feature/react-19-migration
```

#### Day 3-4: Upgrade Core Dependencies
```bash
npm install react@rc react-dom@rc
npm install next@latest
npm install @types/react@rc @types/react-dom@rc
```

#### Day 5: Initial Testing
- [ ] Run build: `npm run build`
- [ ] Test development: `npm run dev`
- [ ] Check for TypeScript errors
- [ ] Verify existing functionality

**Rollback Plan**: If critical issues, revert to `main` branch

---

### Phase 2: Server Components Migration (Week 2)

#### Convert Static Pages to Server Components
1. [ ] Homepage (`/app/page.tsx`)
   - Move data fetching to server
   - Remove client-side data imports
   - Test rendering

2. [ ] Trips Page (`/app/trips/page.tsx`)
   - Server-side trip data loading
   - Implement Suspense boundaries
   - Add loading states

3. [ ] Places Page (`/app/places/[slug]/page.tsx`)
   - Async data fetching
   - Progressive rendering with `use` hook
   - Optimize image loading

4. [ ] Reviews Page (`/app/reviews/page.tsx`)
   - Server component for static content
   - Client components for interactive elements

#### Create Server/Client Separation
```typescript
// app/trips/[slug]/page.tsx (Server Component)
async function TripPage({ params }) {
  const trip = await db.trips.get(params.slug)
  const photosPromise = db.photos.getByTrip(params.slug)
  
  return (
    <>
      <TripHeader trip={trip} />
      <Suspense fallback={<PhotosLoading />}>
        <PhotoGallery photosPromise={photosPromise} />
      </Suspense>
    </>
  )
}

// components/PhotoGallery.tsx (Client Component)
"use client"
import { use } from 'react'

function PhotoGallery({ photosPromise }) {
  const photos = use(photosPromise)
  return <PhotoGrid photos={photos} />
}
```

---

### Phase 3: Form Actions Migration (Week 3)

#### Convert to useActionState

1. [ ] Newsletter Form
```typescript
// app/actions/newsletter.ts
'use server'

export async function subscribeAction(prevState, formData) {
  const email = formData.get('email')
  const result = await subscribeToNewsletter(email)
  if (result.error) return { error: result.error }
  revalidatePath('/')
  return { success: true }
}

// components/NewsletterForm.tsx
const [state, formAction, isPending] = useActionState(subscribeAction, null)
```

2. [ ] Photo Upload Form
```typescript
// app/actions/photos.ts
'use server'

export async function uploadPhotoAction(prevState, formData) {
  const file = formData.get('photo')
  const result = await uploadToStorage(file)
  if (result.error) return { error: result.error }
  revalidatePath('/admin/photos')
  return { success: true, photoId: result.id }
}
```

3. [ ] Admin Forms
   - [ ] Photo deletion
   - [ ] Photo reordering (with useOptimistic)
   - [ ] Photo editing

---

### Phase 4: Advanced Features (Week 4)

#### Implement useOptimistic

1. [ ] Photo Reordering
```typescript
function PhotoManager({ photos }) {
  const [optimisticPhotos, setOptimisticPhotos] = useOptimistic(photos)
  
  async function reorderAction(newOrder) {
    setOptimisticPhotos(newOrder)
    await updatePhotoOrder(newOrder)
  }
  
  return <DragDropPhotos photos={optimisticPhotos} onReorder={reorderAction} />
}
```

2. [ ] Review Submissions
3. [ ] Real-time Updates

#### Add Resource Preloading
- [ ] Convert manual preconnect to React 19 APIs
```typescript
import { preload, preconnect } from 'react-dom'

export default function RootLayout() {
  preconnect('https://uploadthing.com')
  preload('/fonts/inter.woff2', { as: 'font' })
  // ...
}
```

#### Enhanced Transitions
- [ ] Trip tab switching with async transitions
- [ ] Map view transitions
- [ ] Theme toggle improvements

---

## 🧪 Testing Checklist

### Critical Paths
- [ ] Homepage loads correctly
- [ ] Trip browsing works
- [ ] Place details display
- [ ] Map renders and is interactive
- [ ] Reviews display properly
- [ ] Newsletter subscription works
- [ ] Photo upload functions (admin)
- [ ] Authentication flow works
- [ ] Theme toggle persists

### Performance Testing
- [ ] Lighthouse scores (before/after)
- [ ] Bundle size comparison
- [ ] Initial load time
- [ ] Time to Interactive (TTI)
- [ ] Largest Contentful Paint (LCP)

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## 📊 Success Metrics

### Performance Goals
- [ ] 50%+ reduction in client bundle size
- [ ] 20-40% faster initial page load
- [ ] LCP < 2.5s
- [ ] TTI < 3.5s

### Code Quality Goals
- [ ] 60% reduction in boilerplate code
- [ ] Zero TypeScript errors
- [ ] All tests passing
- [ ] No console warnings

---

## 🔄 Rollback Strategy

If critical issues arise:

1. **Immediate Rollback**:
   ```bash
   git checkout main
   npm install
   npm run build
   ```

2. **Identify Issues**:
   - Document what broke
   - Create issues in GitHub
   - Plan fixes

3. **Incremental Approach**:
   - Migrate one feature at a time
   - Test thoroughly before proceeding
   - Keep main branch stable

---

## 📝 Notes

### Breaking Changes to Watch
- `ref` as prop no longer needs `forwardRef`
- `useReducer` type inference improvements
- Context type inference changes
- Potential third-party library incompatibilities

### Resources
- [React 19 Release Blog](https://react.dev/blog/2024/12/05/react-19)
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

**Last Updated**: October 5, 2025  
**Next Review**: Before starting Phase 1
