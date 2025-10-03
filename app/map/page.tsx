'use client'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getAllPlaces } from '@/lib/data'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'

// Fix default marker path in Next.js
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], 
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34], 
  shadowSize: [41, 41]
});

export default function MapPage() {
  const places = getAllPlaces()
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  const placesWithCoords = places.filter(p => p.coords)
  const categories = useMemo(() => {
    const bucket = new Set<string>()
    placesWithCoords.forEach(place => {
      place.categories?.forEach(category => bucket.add(category))
    })
    return Array.from(bucket).sort()
  }, [placesWithCoords])

  const visiblePlaces = useMemo(() => {
    const query = search.trim().toLowerCase()
    return placesWithCoords.filter(place => {
      const matchesQuery = query.length === 0
        || `${place.name} ${place.neighborhood ?? ''} ${place.city ?? ''}`.toLowerCase().includes(query)
      const matchesCategory = selectedCategories.length === 0
        || (place.categories?.some(category => selectedCategories.includes(category)) ?? false)
      return matchesQuery && matchesCategory
    })
  }, [placesWithCoords, search, selectedCategories])

  const center = visiblePlaces[0]?.coords
    ?? placesWithCoords[0]?.coords
    ?? { lat: 19.4326, lng: -99.1332 }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => prev.includes(category)
      ? prev.filter(item => item !== category)
      : [...prev, category]
    )
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedCategories([])
  }

  const isFiltered = search.trim().length > 0 || selectedCategories.length > 0
  const totalPinned = placesWithCoords.length
  const visibleCount = visiblePlaces.length
  
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Interactive Map</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore all {placesWithCoords.length} locations we've visited. Click markers for details.
        </p>
      </header>
      
      <div className="card card-dark p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[220px]">
            <label htmlFor="map-search" className="block mb-2">Search the map</label>
            <input
              id="map-search"
              placeholder="Search by name or neighborhood"
              value={search}
              onChange={event => setSearch(event.target.value)}
              className="w-full"
            />
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryToggle(category)}
                className={`chip capitalize ${selectedCategories.includes(category) ? 'chip-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="relative rounded-lg overflow-hidden" style={{ height: '70vh', minHeight: '500px' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
              <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
            </div>
          )}
          <MapContainer 
            center={[center.lat, center.lng]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            whenReady={() => setIsLoading(false)}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {visiblePlaces.map(p => p.coords && (
              <Marker key={p.id} position={[p.coords.lat, p.coords.lng]} icon={icon}>
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <div className="font-semibold text-base">{p.name}</div>
                    {p.address && <div className="text-xs text-gray-600">{p.address}</div>}
                    {p.categories && p.categories.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {p.categories.map(cat => (
                          <span key={cat} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.averageRating && p.averageRating > 0 && (
                      <div className="text-xs text-amber-600">
                        ⭐ {p.averageRating.toFixed(1)} / 5
                      </div>
                    )}
                    <Link 
                      className="inline-block text-accent-600 hover:text-accent-700 font-medium text-sm underline" 
                      href={`/places/${p.slug}`}
                    >
                      View Details →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
            {visiblePlaces.length > 0 && (
              <RecenterOnPlaces coords={[center.lat, center.lng]} />
            )}
          </MapContainer>
        </div>
      </div>
      
      <div className="card card-dark p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Pinned locations</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {visibleCount} of {totalPinned}
          </p>
        </div>

        {visibleCount === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No places match those filters. Try widening your search.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visiblePlaces.map(p => (
              <Link 
                key={p.id}
                href={`/places/${p.slug}`}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-accent-500 hover:shadow-lg transition-all group"
              >
                <h3 className="font-semibold group-hover:text-accent-600 transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {p.neighborhood ?? p.city}
                </p>
                {p.categories && p.categories.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {p.categories.slice(0, 2).map(cat => (
                      <span key={cat} className="badge text-xs">{cat}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RecenterOnPlaces({ coords }: { coords: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(coords, map.getZoom(), { animate: true, duration: 0.6 })
  }, [coords, map])

  return null
}
