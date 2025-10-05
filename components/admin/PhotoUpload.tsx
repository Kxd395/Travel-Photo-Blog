"use client"

import { useState, useTransition } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { Upload, X, Loader2 } from "lucide-react"

interface PhotoUploadProps {
  onUploadComplete?: (photos: { photoId: string; url: string }[]) => void
}

export function PhotoUpload({ onUploadComplete }: PhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isPending, startTransition] = useTransition()

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setUploading(false)
      setFiles([])
      setUploadProgress(0)
      if (onUploadComplete) {
        onUploadComplete(res as any)
      }
    },
    onUploadError: (error: Error) => {
      setUploading(false)
      alert(`Upload failed: ${error.message}`)
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress)
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      startTransition(() => {
        setFiles(Array.from(e.target.files!))
      })
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    await startUpload(files)
  }

  const removeFile = (index: number) => {
    startTransition(() => {
      setFiles((prev) => prev.filter((_, i) => i !== index))
    })
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div className="relative">
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="sr-only"
          disabled={uploading || isPending}
        />
        <label
          htmlFor="photo-upload"
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            uploading || isPending
              ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              : "border-gray-300 dark:border-gray-600 hover:border-accent-500 dark:hover:border-accent-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG or WEBP (MAX. 8MB per file)
            </p>
          </div>
        </label>
      </div>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected files ({files.length})
            </p>
            {!uploading && (
              <button
                onClick={() => setFiles([])}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                {!uploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                  <p className="text-xs text-white truncate">{file.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-accent-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !uploading && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload {files.length} {files.length === 1 ? "photo" : "photos"}
        </button>
      )}

      {uploading && (
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Processing photos...</span>
        </div>
      )}
    </div>
  )
}
