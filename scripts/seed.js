const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Read JSON files
  const dataDir = path.join(__dirname, '..', 'data')
  const placesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'places.json'), 'utf-8'))
  const reviewsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'reviews.json'), 'utf-8'))
  const photosData = JSON.parse(fs.readFileSync(path.join(dataDir, 'photos.json'), 'utf-8'))
  const tripsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'trips.json'), 'utf-8'))

  // 1. Create photos first (needed for foreign keys)
  console.log('📸 Creating photos...')
  for (const photo of photosData) {
    await prisma.photo.upsert({
      where: { id: photo.id },
      update: {},
      create: {
        id: photo.id,
        src: photo.src,
        alt: photo.alt || null,
        takenAt: photo.takenAt ? new Date(photo.takenAt) : null,
        tags: photo.tags || [],
        position: photosData.indexOf(photo),
      },
    })
  }

  // 2. Create places
  console.log('📍 Creating places...')
  for (const place of placesData) {
    await prisma.place.upsert({
      where: { id: place.id },
      update: {},
      create: {
        id: place.id,
        slug: place.slug,
        name: place.name,
        address: place.address || null,
        neighborhood: place.neighborhood || null,
        city: place.city || null,
        country: place.country || null,
        lat: place.coords?.lat || null,
        lng: place.coords?.lng || null,
        categories: place.categories || [],
        coverPhotoId: place.coverPhotoId || null,
        averageRating: place.averageRating || null,
      },
    })
  }

  // 3. Update photos with placeId
  console.log('🔗 Linking photos to places...')
  for (const photo of photosData) {
    if (photo.placeId) {
      await prisma.photo.update({
        where: { id: photo.id },
        data: { placeId: photo.placeId },
      })
    }
  }

  // 4. Create reviews
  console.log('⭐ Creating reviews...')
  for (const review of reviewsData) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {},
      create: {
        id: review.id,
        slug: review.slug,
        placeId: review.placeId,
        title: review.title,
        rating: review.rating || 0,
        dateVisited: new Date(review.dateVisited),
        cost: review.cost || null,
        tags: review.tags || [],
        pros: review.pros || [],
        cons: review.cons || [],
        tips: review.tips || [],
        body: review.body || null,
        photoIds: review.photos || [],
      },
    })
  }

  // 5. Create trips
  console.log('✈️ Creating trips...')
  for (const trip of tripsData) {
    await prisma.trip.upsert({
      where: { id: trip.id },
      update: {},
      create: {
        id: trip.id,
        slug: trip.slug,
        title: trip.title,
        startDate: new Date(trip.startDate),
        endDate: new Date(trip.endDate),
        coverPhotoId: trip.coverPhotoId || null,
        summary: trip.summary || null,
      },
    })

    // 6. Create trip-place relations
    if (trip.placeIds && Array.isArray(trip.placeIds)) {
      for (let i = 0; i < trip.placeIds.length; i++) {
        const placeId = trip.placeIds[i]
        await prisma.tripPlace.upsert({
          where: {
            tripId_placeId: {
              tripId: trip.id,
              placeId: placeId,
            },
          },
          update: { position: i },
          create: {
            tripId: trip.id,
            placeId: placeId,
            position: i,
          },
        })
      }
    }

    // 7. Create trip-photo relations
    if (trip.photoIds && Array.isArray(trip.photoIds)) {
      for (let i = 0; i < trip.photoIds.length; i++) {
        const photoId = trip.photoIds[i]
        await prisma.tripPhoto.upsert({
          where: {
            tripId_photoId: {
              tripId: trip.id,
              photoId: photoId,
            },
          },
          update: { position: i },
          create: {
            tripId: trip.id,
            photoId: photoId,
            position: i,
          },
        })
      }
    }
  }

  // 8. Create default admin user
  console.log('👤 Creating admin user...')
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    },
  })

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
