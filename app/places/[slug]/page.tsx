import { getAllPlaces, getReviewsByPlaceId, getPhotosByPlaceId } from '@/lib/data'
import PhotoGrid from '@/components/PhotoGrid'
import StarRating from '@/components/StarRating'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return getAllPlaces().map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const place = getAllPlaces().find(p => p.slug === params.slug)
  if (!place) {
    return { title: 'Place Not Found' }
  }
  return { 
    title: `${place.name} – Reviews & Photos`,
    description: `Read reviews and see photos of ${place.name} in ${place.neighborhood ?? place.city}. ${place.categories?.join(', ')}.`,
  }
}

export default function PlacePage({ params }: { params: { slug: string } }) {
  const place = getAllPlaces().find(p => p.slug === params.slug)
  
  if (!place) {
    notFound()
  }
  
  const reviews = getReviewsByPlaceId(place.id)
  const photos = getPhotosByPlaceId(place.id)
  const avg = reviews.length > 0 
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0
  
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {place.address && <span>{place.address}</span>}
              {place.neighborhood && <span> • {place.neighborhood}</span>}
            </p>
          </div>
          {avg > 0 && (
            <div className="text-center">
              <StarRating value={avg} size={24} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {avg.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </p>
            </div>
          )}
        </div>
        
        {place.categories && place.categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {place.categories.map(cat => (
              <span key={cat} className="badge text-sm">{cat}</span>
            ))}
          </div>
        )}
      </header>

      {reviews.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          {reviews.map(rv => (
            <div key={rv.id} className="card card-dark p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl mb-1">{rv.title}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Visited {new Date(rv.dateVisited).toLocaleDateString()}
                    {rv.cost && <span> • {rv.cost}</span>}
                  </div>
                </div>
                <StarRating value={rv.rating} />
              </div>
              
              {rv.tags && rv.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {rv.tags.map(t => <span key={t} className="badge">{t}</span>)}
                </div>
              )}
              
              {rv.pros && rv.pros.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">✓ Pros</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {rv.pros.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              )}
              
              {rv.cons && rv.cons.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">✗ Cons</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {rv.cons.map(c => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              )}
              
              {rv.tips && rv.tips.length > 0 && (
                <div>
                  <h4 className="font-medium text-accent-600 mb-2">💡 Tips</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {rv.tips.map(t => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              )}
              
              {rv.body && (
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{rv.body}</p>
              )}
            </div>
          ))}
        </section>
      ) : (
        <div className="card card-dark p-8 text-center text-gray-500 dark:text-gray-400">
          No reviews yet. Be the first to review this place!
        </div>
      )}

      {photos.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Photos ({photos.length})</h2>
          <PhotoGrid photos={photos} />
        </section>
      )}
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/reviews" className="text-accent-600 hover:underline">
          ← Back to all reviews
        </Link>
      </div>
    </article>
  )
}
