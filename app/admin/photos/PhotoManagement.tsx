"use client"

import { useState } from "react"
import { PhotoUpload } from "@/components/admin/PhotoUpload"
import { PhotoManager } from "@/components/admin/PhotoManager"
import { Plus } from "lucide-react"

interface Photo {
  id: string
  src: string
  alt?: string
  position: number
  place?: { id: string; name: string } | null
  reviews?: { id: string; title: string }[]
}

export function PhotoManagement({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [showUpload, setShowUpload] = useState(false)

  const handleUploadComplete = async (
    uploadedPhotos: { photoId: string; url: string }[]
  ) => {
    // Refresh the page to show new photos
    window.location.reload()
  }

  const handleReorder = async (reorderedPhotos: Photo[]) => {
    const updates = reorderedPhotos.map((photo) => ({
      id: photo.id,
      position: photo.position,
    }))

    const response = await fetch("/api/admin/photos/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photos: updates }),
    })

    if (!response.ok) {
      throw new Error("Failed to reorder photos")
    }

    setPhotos(reorderedPhotos)
  }

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/photos/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete photo")
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upload Photos
          </h3>
          {!showUpload && (
            <button
              onClick={() => setShowUpload(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Photos
            </button>
          )}
        </div>
        {showUpload && (
          <PhotoUpload onUploadComplete={handleUploadComplete} />
        )}
      </div>

      {/* Photo Gallery */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Photo Gallery ({photos.length})
        </h3>
        <PhotoManager
          initialPhotos={photos}
          onReorder={handleReorder}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
