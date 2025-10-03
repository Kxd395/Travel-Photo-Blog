import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ExifReader from "exifreader"
import sharp from "sharp"
import { prisma } from "@/lib/prisma"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)

      try {
        // Download the image
        const response = await fetch(file.url)
        const buffer = Buffer.from(await response.arrayBuffer())

        // Extract EXIF data
        let exifData = null
        let takenAt = null
        try {
          const tags = ExifReader.load(buffer)
          exifData = tags
          
          // Try to extract date
          if (tags.DateTimeOriginal?.description) {
            takenAt = new Date(tags.DateTimeOriginal.description)
          } else if (tags.DateTime?.description) {
            takenAt = new Date(tags.DateTime.description)
          }
        } catch (e) {
          console.log("Could not extract EXIF data:", e)
        }

        // Generate blur placeholder
        const image = sharp(buffer)
        const metadata = await image.metadata()
        const blurBuffer = await image
          .resize(20, 20, { fit: "inside" })
          .blur()
          .toBuffer()
        const blurDataUrl = `data:image/${metadata.format};base64,${blurBuffer.toString("base64")}`

        // Create photo record in database
        const photo = await prisma.photo.create({
          data: {
            src: file.url,
            width: metadata.width || null,
            height: metadata.height || null,
            blurDataUrl,
            takenAt,
            exifData: exifData as any,
            alt: file.name.replace(/\.[^/.]+$/, ""), // Use filename without extension as initial alt
          },
        })

        return { photoId: photo.id, url: file.url }
      } catch (error) {
        console.error("Error processing upload:", error)
        throw error
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
