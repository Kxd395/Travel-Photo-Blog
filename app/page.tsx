import Link from 'next/link'
import ReviewCard from '@/components/ReviewCard'
import PhotoShowcase from '@/components/PhotoShowcase'
import NewsletterForm from '@/components/NewsletterForm'
import { getAllReviews, getAllPhotos, getAllTrips, getPlaceMap, getAllPlaces } from '@/lib/data'

export default function HomePage() {
  const allReviews = getAllReviews()
  const reviews = allReviews.slice(0, 4)
  const photos = getAllPhotos()
  const photoSelection = photos.slice(0, 24)
  const trips = getAllTrips()
  const places = getAllPlaces()
  const placeMap = getPlaceMap()

  const totalPlaces = places.length
  const totalPhotos = photos.length
  const totalReviews = allReviews.length
  const uniqueCities = new Set(
    places
      .map(place => {
        const city = place.city?.trim()
        const country = place.country?.trim()
        if (city && country) return `${city}, ${country}`
        return city ?? country ?? ''
      })
      .filter(Boolean)
  )

  const averageRating = totalReviews > 0
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0

  const stats = [
    { label: 'Places logged', value: totalPlaces },
    { label: 'Cities explored', value: uniqueCities.size },
    { label: 'Photos shared', value: totalPhotos },
    { label: 'Avg. rating', value: averageRating > 0 ? `${averageRating.toFixed(1)} / 5` : 'Coming soon' },
  ]

  const categoryCounts = new Map<string, number>()
  places.forEach(place => {
    place.categories?.forEach(category => {
      const key = category.trim()
      if (key.length === 0) return
      categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1)
    })
  })
  const topCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )
  const featuredTrip = sortedTrips[0]
  const supportingTrips = sortedTrips.slice(1, 4)

  const spotlightReview = reviews[0]
  const spotlightPlace = spotlightReview ? placeMap.get(spotlightReview.placeId) : undefined

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-amber-50 via-white to-white dark:from-amber-500/10 dark:via-gray-900 dark:to-gray-900 p-8 md:p-12 shadow-soft">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.25),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_rgba(17,24,39,0.1)_65%)]"
        />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-600 bg-white/80 dark:bg-white/10 px-3 py-1 rounded-full w-fit border border-amber-200/70 dark:border-amber-500/20">
              Our travel journal
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl text-gray-900 dark:text-gray-50">
              Modern city adventures with a camera in hand.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              We document the spots that make our trips memorable—from hidden taco counters to playful museums. Dive into our honest reviews, photo essays, and maps from places we've actually visited.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/reviews" className="btn btn-primary">
                Browse reviews
              </Link>
              <Link href="/map" className="btn border border-gray-300 hover:border-accent-500 hover:text-accent-600 transition-colors">
                Open the map
              </Link>
              <Link href="/trips" className="btn border border-gray-300 hover:border-accent-500 hover:text-accent-600 transition-colors">
                Explore trips
              </Link>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/70 dark:border-white/10">
              {stats.map(stat => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </dt>
                  <dd className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="surface-glass shadow-soft p-6 md:p-7 space-y-6">
            {featuredTrip && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Trip spotlight
                </p>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {featuredTrip.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(featuredTrip.startDate).toLocaleDateString()} – {new Date(featuredTrip.endDate).toLocaleDateString()}
                </p>
                {featuredTrip.summary && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {featuredTrip.summary}
                  </p>
                )}
                <Link
                  href={`/trips/${featuredTrip.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700"
                >
                  View travel notes →
                </Link>
              </div>
            )}

            {topCategories.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Current vibes
                </p>
                <div className="flex flex-wrap gap-2">
                  {topCategories.map(([category]) => (
                    <span key={category} className="chip chip-active capitalize">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {spotlightReview && (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 border-t border-white/60 dark:border-white/10 pt-4">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Latest field note</p>
                <p>
                  {spotlightReview.title}
                  {spotlightPlace && <span className="text-gray-400 dark:text-gray-500"> • {spotlightPlace.name}</span>}
                </p>
                {spotlightReview.tips && spotlightReview.tips.length > 0 && (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    "{spotlightReview.tips[0]}"
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-8 items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Latest reviews</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fresh takes from our recent wanderings.
              </p>
            </div>
            <Link href="/reviews" className="text-sm font-medium text-accent-600 hover:text-accent-700">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} place={placeMap.get(review.placeId)} />
            ))}
          </div>
        </div>

        <aside className="card card-dark p-6 space-y-4">
          <h3 className="text-lg font-semibold">Browse our stops</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            We've logged {totalPlaces} places across {uniqueCities.size} cities. Check out the interactive map or browse our trips to see where we've been and what we recommend.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/map" className="btn btn-primary">
              Explore the map
            </Link>
            <Link href="/trips" className="btn border border-gray-300 hover:border-accent-500 hover:text-accent-600 transition-colors">
              Browse trips
            </Link>
          </div>
          {supportingTrips.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                In our queue
              </p>
              <ul className="space-y-3 text-sm">
                {supportingTrips.map(trip => (
                  <li key={trip.id} className="flex items-start justify-between gap-3">
                    <Link href={`/trips/${trip.slug}`} className="font-medium hover:text-accent-600">
                      {trip.title}
                    </Link>
                    <span className="text-gray-400 dark:text-gray-500">
                      {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Photo stories</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Filter by vibe and jump into our favorite frames.
            </p>
          </div>
          <Link href="/reviews" className="text-sm font-medium text-accent-600 hover:text-accent-700">
            Read the stories →
          </Link>
        </div>
        <PhotoShowcase photos={photoSelection} />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card card-dark p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-semibold">Get notified when we post new adventures</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            One compact email with our latest reviews, photo drops, and trip reports. No spam, just our real travel experiences.
          </p>
          <NewsletterForm />
        </div>
        <div className="card card-dark p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-semibold">Trip log at a glance</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalReviews} reviews, {totalPhotos} photos, and counting. Our personal recommendations from actual trips—tested by us for real experiences.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden />
              <span>{totalPlaces} places logged across {uniqueCities.size} cities.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" aria-hidden />
              <span>{averageRating > 0 ? `${averageRating.toFixed(1)} average rating across experiences.` : 'New reviews landing soon.'}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
              <span>Next up: {featuredTrip ? featuredTrip.title : 'planning our next getaway'}.</span>
            </li>
          </ul>
          <Link href="/trips" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700">
            Peek the trip archive →
          </Link>
        </div>
      </section>
    </div>
  )
}
