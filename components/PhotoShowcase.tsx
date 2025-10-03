'use client'

import { useMemo, useState } from 'react'
import PhotoGrid from './PhotoGrid'
import type { Photo } from '@/lib/types'

export default function PhotoShowcase({ photos }: { photos: Photo[] }) {
  const tags = useMemo(() => {
    const tagSet = new Set<string>()
    photos.forEach(photo => {
      photo.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [photos])

  const [activeTag, setActiveTag] = useState<string>('all')

  const filteredPhotos = useMemo(() => {
    if (activeTag === 'all') return photos
    return photos.filter(photo => photo.tags?.includes(activeTag))
  }, [activeTag, photos])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTag('all')}
          className={`chip ${activeTag === 'all' ? 'chip-active' : ''}`}
        >
          All Photos <span className="text-xs text-gray-400 dark:text-gray-500">{photos.length}</span>
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`chip capitalize ${activeTag === tag ? 'chip-active' : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filteredPhotos.length > 0 ? (
        <PhotoGrid photos={filteredPhotos} />
      ) : (
        <div className="card card-dark p-6 text-center text-gray-500 dark:text-gray-400">
          Nothing under the "{activeTag}" vibe yet. Check back after our next adventure!
        </div>
      )}
    </div>
  )
}
