'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import type { Photo } from '@/lib/types'

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<Photo | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle keyboard navigation
  useEffect(() => {
    if (!active) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActive(null)
      } else if (e.key === 'ArrowRight') {
        navigateNext()
      } else if (e.key === 'ArrowLeft') {
        navigatePrev()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, currentIndex])

  const navigateNext = () => {
    const nextIndex = (currentIndex + 1) % photos.length
    setCurrentIndex(nextIndex)
    setActive(photos[nextIndex])
  }

  const navigatePrev = () => {
    const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setActive(photos[prevIndex])
  }

  const openLightbox = (photo: Photo, index: number) => {
    setActive(photo)
    setCurrentIndex(index)
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No photos available yet.
      </div>
    )
  }

  return (
    <>
      <div className="columns-2 md:columns-3 gap-3 [column-fill:_balance]">
        {photos.map((p, idx) => (
          <button 
            key={p.id} 
            onClick={() => openLightbox(p, idx)} 
            className="break-inside-avoid mb-3 w-full group relative overflow-hidden rounded-lg"
            aria-label={`View photo: ${p.alt ?? 'Photo'}`}
          >
            <Image 
              src={p.src} 
              alt={p.alt ?? 'Travel photo'} 
              width={800} 
              height={800} 
              className="w-full h-auto rounded-lg border border-gray-200 dark:border-zinc-800 transition-transform group-hover:scale-105" 
            />
            {p.alt && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">{p.alt}</p>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {active && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <button
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
            aria-label="Close lightbox"
          >
            ×
          </button>
          
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
                className="absolute left-4 text-white text-5xl hover:text-gray-300 transition-colors z-10"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigateNext(); }}
                className="absolute right-4 text-white text-5xl hover:text-gray-300 transition-colors z-10"
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
          
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={active.src} 
              alt={active.alt ?? 'Travel photo'} 
              width={1400} 
              height={900} 
              className="w-full h-auto rounded-xl" 
              priority
            />
            {active.alt && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mt-4">
                <p className="text-white text-center">{active.alt}</p>
                {active.takenAt && (
                  <p className="text-white/70 text-sm text-center mt-1">
                    {new Date(active.takenAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            {photos.length > 1 && (
              <p className="text-white/70 text-center mt-2 text-sm">
                {currentIndex + 1} / {photos.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
