import { prisma } from "@/lib/prisma"
import { PhotoManagement } from "./PhotoManagement"

export const dynamic = "force-dynamic"

export default async function AdminPhotosPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { position: "asc" },
    include: {
      place: { select: { id: true, name: true } },
      reviews: { select: { id: true, title: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Photo Gallery
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage our travel photos, upload new ones, and organize them
          </p>
        </div>
      </div>

      <PhotoManagement initialPhotos={photos as any} />
    </div>
  )
}
