import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PhotoGrid from '@/components/PhotoGrid'
import { getAllTrips, getPhotosByIds, getAllPlaces, getAllPhotos } from '@/lib/data'

export function generateStaticParams() {
  return getAllTrips().map(trip => ({ slug: trip.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const trip = getAllTrips().find(candidate => candidate.slug === params.slug)
  if (!trip) {
    return { title: 'Trip Not Found' }
  }
  return {
    title: `${trip.title} – Travel Photo Blog`,
    description: trip.summary ?? `Explore photos and places from ${trip.title}`,
  }
}

export default function TripPage({ params }: { params: { slug: string } }) {
  const trip = getAllTrips().find(candidate => candidate.slug === params.slug)

  if (!trip) {
    notFound()
  }

  const allPhotos = getAllPhotos()
  const photos = getPhotosByIds(trip.photoIds ?? [])
  const places = getAllPlaces().filter(place => trip.placeIds?.includes(place.id))

  const coverPhoto = trip.coverPhotoId
    ? allPhotos.find(photo => photo.id === trip.coverPhotoId)
    : photos[0]

  const citySet = new Set(places.map(place => place.city).filter(Boolean) as string[])
  const categorySet = new Set<string>()
  places.forEach(place => place.categories?.forEach(category => categorySet.add(category)))

  const tripDurationDays = Math.max(
    1,
    Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))
  )

  const stats = [
    { label: 'Trip length', value: `${tripDurationDays} ${tripDurationDays === 1 ? 'day' : 'days'}` },
    { label: 'Places bookmarked', value: places.length > 0 ? String(places.length) : 'TBD' },
    { label: 'Cities visited', value: citySet.size > 0 ? String(citySet.size) : 'Local favorite' },
    { label: 'Photos captured', value: photos.length > 0 ? String(photos.length) : 'Coming soon' },
  ]

  return (
    <article className="space-y-10">
      <header className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 shadow-soft">
        <div className="absolute inset-0">
          {coverPhoto ? (
            <Image
              src={coverPhoto.src}
              alt={coverPhoto.alt ?? trip.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 100vw, 100vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-amber-200 via-amber-50 to-white dark:from-amber-500/20 dark:via-gray-900 dark:to-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 p-8 md:p-12 space-y-6 text-white">
          <Link href="/trips" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            ← All trips
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold max-w-4xl leading-tight">
              {trip.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <span>
                {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
              </span>
              <span>
                {tripDurationDays} {tripDurationDays === 1 ? 'day' : 'days'} on the move
              </span>
              {places.length > 0 && (
                <span>{places.length} {places.length === 1 ? 'place' : 'places'} mapped</span>
              )}
              {photos.length > 0 && (
                <span>{photos.length} {photos.length === 1 ? 'photo' : 'photos'} captured</span>
              )}
            </div>
            {trip.summary && (
              <p className="text-base md:text-lg text-white/80 max-w-3xl leading-relaxed">
                {trip.summary}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {stats.map(stat => (
              <div key={stat.label} className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{stat.label}</p>
                <p className="text-lg font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {categorySet.size > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from(categorySet).map(category => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/15 text-xs uppercase tracking-wide text-white/80"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {places.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Places visited</h2>
            <Link href="/map" className="text-sm font-medium text-accent-600 hover:text-accent-700">
              View on map →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {places.map(place => (
              <Link
                key={place.id}
                href={`/places/${place.slug}`}
                className="group p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 hover:border-accent-500 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-lg group-hover:text-accent-600 transition-colors">
                    {place.name}
                  </h3>
                  {place.averageRating && place.averageRating > 0 && (
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      ⭐ {place.averageRating.toFixed(1)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {[place.neighborhood, place.city, place.country].filter(Boolean).join(', ')}
                </p>
                {place.categories && place.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {place.categories.slice(0, 3).map(category => (
                      <span key={category} className="badge text-xs capitalize">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Photo gallery</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'} from the trip
            </span>
          </div>
          <PhotoGrid photos={photos} />
        </section>
      )}

      {places.length === 0 && photos.length === 0 && (
        <div className="card card-dark p-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg">This trip is still being documented. Check back soon!</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
        <Link href="/trips" className="btn border border-gray-300 hover:border-accent-500 hover:text-accent-600 transition-colors">
          ← Back to trips
        </Link>
        <Link href="/reviews" className="btn btn-primary">
          Read related reviews
        </Link>
      </div>
    </article>
  )
}
