'use client'
import { useMemo, useState } from 'react'
import { getAllReviews, getPlaceMap } from '@/lib/data'
import ReviewCard from '@/components/ReviewCard'

export default function ReviewsPage(){
  const [q, setQ] = useState('')
  const [minR, setMinR] = useState(0)
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date')
  const [activeTags, setActiveTags] = useState<string[]>([])
  
  const reviews = getAllReviews()
  const placeMap = getPlaceMap()
  const tags = useMemo(() => {
    const tagSet = new Set<string>()
    reviews.forEach(review => {
      review.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [reviews])

  const hasFilters = q.trim().length > 0 || minR > 0 || activeTags.length > 0 || sortBy !== 'date'

  const filtered = useMemo(() => {
    let result = reviews.filter(r => {
      const place = placeMap.get(r.placeId)
      const hay = `${r.title} ${r.tags?.join(' ')} ${place?.name} ${place?.neighborhood}`.toLowerCase()
      const matchesQuery = hay.includes(q.toLowerCase())
      const matchesRating = r.rating >= minR
      const matchesTags = activeTags.length === 0 || (r.tags?.some(tag => activeTags.includes(tag)) ?? false)
      return matchesQuery && matchesRating && matchesTags
    })
    
    // Sort results
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating
      }
      return new Date(b.dateVisited).getTime() - new Date(a.dateVisited).getTime()
    })
    
    return result
  }, [q, minR, sortBy, reviews, placeMap, activeTags])

  const toggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const resetFilters = () => {
    setQ('')
    setMinR(0)
    setSortBy('date')
    setActiveTags([])
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Reviews</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filtered.length} {filtered.length === 1 ? 'review' : 'reviews'} found
          </p>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-accent-600 hover:text-accent-700"
          >
            Reset filters
          </button>
        )}
      </div>
      
      <div className="card card-dark p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-2">Search</label>
            <input 
              placeholder="Search places, tags, neighborhoods…" 
              value={q} 
              onChange={e => setQ(e.target.value)} 
              className="w-full"
              aria-label="Search reviews"
            />
          </div>
          
          <div>
            <label className="block mb-2">Min Rating</label>
            <select 
              value={minR} 
              onChange={e => setMinR(Number(e.target.value))} 
              className="w-32"
              aria-label="Filter by minimum rating"
            >
              {[0, 1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n === 0 ? 'All' : `${n}+ stars`}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2">Sort By</label>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value as 'date' | 'rating')} 
              className="w-32"
              aria-label="Sort reviews"
            >
              <option value="date">Latest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTags([])}
              className={`chip ${activeTags.length === 0 ? 'chip-active' : ''}`}
            >
              All tags
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`chip capitalize ${activeTags.includes(tag) ? 'chip-active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.length > 0 ? (
          filtered.map(r => (
            <ReviewCard key={r.id} review={r} place={placeMap.get(r.placeId)} />
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
            No reviews found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  )
}
