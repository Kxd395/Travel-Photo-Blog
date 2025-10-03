"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Edit } from "lucide-react"

interface Photo {
  id: string
  src: string
  alt?: string
  position: number
}

interface PhotoManagerProps {
  initialPhotos: Photo[]
  onReorder: (photos: Photo[]) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function SortablePhoto({ photo, onDelete }: { photo: Photo; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <img
        src={photo.src}
        alt={photo.alt || "Photo"}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="rounded-lg bg-white p-2 hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={() => onDelete(photo.id)}
          className="rounded-lg bg-red-500 p-2 hover:bg-red-600 transition-colors"
        >
          <Trash2 className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  )
}

export function PhotoManager({ initialPhotos, onReorder, onDelete }: PhotoManagerProps) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((p) => p.id === active.id)
      const newIndex = photos.findIndex((p) => p.id === over.id)

      const newPhotos = arrayMove(photos, oldIndex, newIndex).map(
        (photo, index) => ({
          ...photo,
          position: index,
        })
      )

      setPhotos(newPhotos)
      setIsSaving(true)
      try {
        await onReorder(newPhotos)
      } catch (error) {
        console.error("Failed to reorder photos:", error)
        setPhotos(photos) // Revert on error
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return

    setPhotos((prev) => prev.filter((p) => p.id !== id))
    try {
      await onDelete(id)
    } catch (error) {
      console.error("Failed to delete photo:", error)
    }
  }

  return (
    <div className="space-y-4">
      {isSaving && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 text-sm text-blue-800 dark:text-blue-200">
          Saving new order...
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={photos} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <SortablePhoto
                key={photo.id}
                photo={photo}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {photos.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No photos yet. Upload some to get started!
        </div>
      )}
    </div>
  )
}
