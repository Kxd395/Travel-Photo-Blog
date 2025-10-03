import TripExplorer, { TripWithDetails } from '@/components/TripExplorer'
import { getAllTrips, getAllPlaces, getAllPhotos } from '@/lib/data'

export default function TripsPage() {
  const trips = getAllTrips()
  const places = getAllPlaces()
  const photos = getAllPhotos()

  const placeMap = new Map(places.map(place => [place.id, place]))
  const photoMap = new Map(photos.map(photo => [photo.id, photo]))

  const tripsWithDetails: TripWithDetails[] = trips.map(trip => {
    const tripPlaces = (trip.placeIds ?? [])
      .map(id => placeMap.get(id))
      .filter((place): place is NonNullable<typeof place> => Boolean(place))

    const coverPhoto = trip.coverPhotoId ? photoMap.get(trip.coverPhotoId) : undefined
    const cities = Array.from(new Set(tripPlaces.map(place => place.city).filter(Boolean) as string[]))
    const countries = Array.from(new Set(tripPlaces.map(place => place.country).filter(Boolean) as string[]))
    const categoriesSet = new Set<string>()
    tripPlaces.forEach(place => place.categories?.forEach(category => categoriesSet.add(category)))

    return {
      ...trip,
      places: tripPlaces,
      coverPhoto,
      cities,
      countries,
      categories: Array.from(categoriesSet),
      photoCount: trip.photoIds?.length ?? 0,
    }
  })

  const totalTrips = tripsWithDetails.length
  const uniquePlaceCount = new Set(tripsWithDetails.flatMap(trip => trip.places.map(place => place.id))).size
  const uniqueCityCount = new Set(tripsWithDetails.flatMap(trip => trip.cities)).size
  const totalTripPhotos = tripsWithDetails.reduce((sum, trip) => sum + trip.photoCount, 0)

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-amber-50 via-white to-white dark:from-amber-500/10 dark:via-gray-900 dark:to-gray-900 p-8 md:p-12 shadow-soft">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.2),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.2),_rgba(17,24,39,0.1)_65%)]"
        />
        <div className="relative space-y-6">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-600 bg-white/70 dark:bg-white/10 px-3 py-1 rounded-full w-fit border border-amber-200/70 dark:border-amber-500/20">
            Trip archive
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 max-w-3xl leading-tight">
            Our travel history: itineraries, photos, and recommendations.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            These are the trips we've actually taken—complete with our honest takes on food, museums, and memorable stops. Browse our itineraries for inspiration and real-world recommendations.
          </p>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Trips Logged</dt>
              <dd className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalTrips}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Places Featured</dt>
              <dd className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{uniquePlaceCount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Cities Covered</dt>
              <dd className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{uniqueCityCount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Trip Photos</dt>
              <dd className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalTripPhotos}</dd>
            </div>
          </dl>
        </div>
      </header>

      <TripExplorer trips={tripsWithDetails} />
    </div>
  )
}
