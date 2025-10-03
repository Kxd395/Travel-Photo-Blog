'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Trip, Place, Photo } from '@/lib/types'

export type TripWithDetails = Trip & {
  places: Place[]
  coverPhoto?: Photo
  cities: string[]
  countries: string[]
  categories: string[]
  photoCount: number
}

type Props = {
  trips: TripWithDetails[]
}

export default function TripExplorer({ trips }: Props) {
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

  const yearOptions = useMemo(() => {
    const years = new Set<string>()
    trips.forEach(trip => {
      const year = new Date(trip.startDate).getFullYear()
      if (!Number.isNaN(year)) {
        years.add(String(year))
      }
    })
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
  }, [trips])

  const countryOptions = useMemo(() => {
    const countries = new Set<string>()
    trips.forEach(trip => trip.countries.forEach(country => countries.add(country)))
    return Array.from(countries).sort()
  }, [trips])

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>()
    trips.forEach(trip => trip.categories.forEach(category => categories.add(category)))
    return Array.from(categories).sort()
  }, [trips])

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase()

    const matches = trips.filter(trip => {
      const matchesYear = selectedYear === 'all'
        || new Date(trip.startDate).getFullYear().toString() === selectedYear
      const matchesCountry = selectedCountry === 'all'
        || trip.countries.includes(selectedCountry)
      const matchesCategory = selectedCategory === 'all'
        || trip.categories.includes(selectedCategory)
      const matchesQuery = query.length === 0
        || `${trip.title} ${trip.summary ?? ''} ${trip.places.map(place => place.name).join(' ')}`
          .toLowerCase()
          .includes(query)

      return matchesYear && matchesCountry && matchesCategory && matchesQuery
    })

    return matches
  }, [trips, search, selectedYear, selectedCountry, selectedCategory])

  const sortedTrips = useMemo(() => {
    const list = [...filteredTrips]
    list.sort((a, b) => {
      const delta = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      return sort === 'newest' ? -delta : delta
    })
    return list
  }, [filteredTrips, sort])

  const resetFilters = () => {
    setSearch('')
    setSelectedYear('all')
    setSelectedCountry('all')
    setSelectedCategory('all')
    setSort('newest')
  }

  const hasFilters = search.trim().length > 0
    || selectedYear !== 'all'
    || selectedCountry !== 'all'
    || selectedCategory !== 'all'
    || sort !== 'newest'

  return (
    <div className="space-y-6">
      <div className="card card-dark p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[220px]">
            <label htmlFor="trip-search" className="block mb-2">Search trips</label>
            <input
              id="trip-search"
              placeholder="Search by title or highlight"
              value={search}
              onChange={event => setSearch(event.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={event => setSelectedYear(event.target.value)}
              className="w-32"
            >
              <option value="all">Any year</option>
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Country</label>
            <select
              value={selectedCountry}
              onChange={event => setSelectedCountry(event.target.value)}
              className="w-36"
            >
              <option value="all">Anywhere</option>
              {countryOptions.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Sort</label>
            <select
              value={sort}
              onChange={event => setSort(event.target.value as 'newest' | 'oldest')}
              className="w-36"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {categoryOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`chip ${selectedCategory === 'all' ? 'chip-active' : ''}`}
            >
              All moods
            </button>
            {categoryOptions.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`chip capitalize ${selectedCategory === category ? 'chip-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-accent-600 hover:text-accent-700"
          >
            Reset
          </button>
        )}
      </div>

      {sortedTrips.length === 0 ? (
        <div className="card card-dark p-12 text-center text-gray-500 dark:text-gray-400">
          No trips match those filters yet. Adjust the filters to rediscover an itinerary.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}

function TripCard({ trip }: { trip: TripWithDetails }) {
  const start = new Date(trip.startDate)
  const end = new Date(trip.endDate)
  const duration = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  const cover = trip.coverPhoto
  const placesToShow = trip.places.slice(0, 3)
  const remainingPlaces = Math.max(0, trip.places.length - placesToShow.length)

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 shadow-soft hover:shadow-xl transition">
      <div className="relative h-48">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt ?? trip.title}
            fill
            priority={false}
            className="object-cover"
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
          <h3 className="text-xl font-semibold">{trip.title}</h3>
          <p className="text-xs uppercase tracking-wide text-white/80">
            {start.toLocaleDateString()} – {end.toLocaleDateString()} • {duration} {duration === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {trip.summary && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
            {trip.summary}
          </p>
        )}

        {trip.places.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {placesToShow.map(place => (
              <span key={place.id} className="badge text-xs">
                {place.name}
              </span>
            ))}
            {remainingPlaces > 0 && (
              <span className="badge text-xs">+{remainingPlaces} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <span>{trip.photoCount} {trip.photoCount === 1 ? 'photo' : 'photos'}</span>
          <span>{trip.places.length} {trip.places.length === 1 ? 'place' : 'places'}</span>
        </div>

        <Link
          href={`/trips/${trip.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700"
        >
          View itinerary →
        </Link>
      </div>
    </article>
  )
}
