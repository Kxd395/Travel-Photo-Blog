import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-3">
        <h1 className="text-6xl font-bold text-accent-600">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Looks like you've wandered off the map! The page you're looking for doesn't exist.
        </p>
      </div>
      
      <div className="flex gap-4">
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
        <Link href="/reviews" className="btn border border-gray-300 hover:border-accent-500 hover:text-accent-600 transition-colors">
          Browse Reviews
        </Link>
      </div>
    </div>
  )
}
