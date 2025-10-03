import Link from 'next/link'
import StarRating from './StarRating'
import type { Review, Place } from '@/lib/types'

export default function ReviewCard({ review, place }: { review: Review, place?: Place }) {
  return (
    <div className="card card-dark p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold">
          <Link href={`/places/${place?.slug ?? review.slug}`} className="hover:underline hover:text-accent-600 transition-colors">{review.title}</Link>
        </h3>
        <StarRating value={review.rating} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {place?.name ?? 'Unknown Place'} • {new Date(review.dateVisited).toLocaleDateString()}
        {review.cost && <span> • {review.cost}</span>}
      </p>
      {review.tags && review.tags.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {review.tags.map(t=><span key={t} className="badge">{t}</span>)}
        </div>
      )}
      {review.body && <p className="mt-3 text-gray-800 dark:text-gray-200 line-clamp-3">{review.body}</p>}
      {review.pros && review.pros.length > 0 && (
        <div className="mt-3 text-sm">
          <span className="text-green-600 dark:text-green-400 font-medium">Pros:</span>{' '}
          {review.pros.slice(0, 2).join(', ')}
        </div>
      )}
      <div className="mt-4">
        <Link href={`/places/${place?.slug ?? review.slug}`} className="btn btn-primary text-sm">Read Full Review</Link>
      </div>
    </div>
  )
}
