import reviews from '../data/reviews.json'
import places from '../data/places.json'
import photos from '../data/photos.json'
import trips from '../data/trips.json'
import { Place, Review, Trip, Photo } from './types'

// Cache for performance
let cachedPlaces: Place[] | null = null
let cachedReviews: Review[] | null = null
let cachedPhotos: Photo[] | null = null
let cachedTrips: Trip[] | null = null

export function getAllReviews(): Review[] {
  if (!cachedReviews) {
    cachedReviews = reviews as unknown as Review[]
  }
  return cachedReviews
}

export function getAllPlaces(): Place[] {
  if (!cachedPlaces) {
    cachedPlaces = places as unknown as Place[]
  }
  return cachedPlaces
}

export function getAllPhotos(): Photo[] {
  if (!cachedPhotos) {
    cachedPhotos = photos as unknown as Photo[]
  }
  return cachedPhotos
}

export function getAllTrips(): Trip[] {
  if (!cachedTrips) {
    cachedTrips = trips as unknown as Trip[]
  }
  return cachedTrips
}

export function getPlaceBySlug(slug: string): Place | undefined {
  return getAllPlaces().find(p => p.slug === slug)
}
export function getReviewBySlug(slug: string): Review | undefined {
  return getAllReviews().find(r => r.slug === slug)
}
export function getTripBySlug(slug: string): Trip | undefined {
  return getAllTrips().find(t => t.slug === slug)
}

export function getPhotosByIds(ids: string[]) {
  const all = getAllPhotos()
  return ids.map(id => all.find(p => p.id === id)).filter(Boolean) as Photo[]
}

// Create a map for O(1) lookups
export function getPlaceMap(): Map<string, Place> {
  const map = new Map<string, Place>()
  getAllPlaces().forEach(place => {
    map.set(place.id, place)
  })
  return map
}

export function getReviewsByPlaceId(placeId: string): Review[] {
  return getAllReviews().filter(r => r.placeId === placeId)
}

export function getPhotosByPlaceId(placeId: string): Photo[] {
  return getAllPhotos().filter(p => p.placeId === placeId)
}
