import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata: Metadata = {
  title: 'Travel Photo Blog & Reviews',
  description: 'Parent-teen travel photo journal with place reviews and maps.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for better performance */}
        <link rel="preconnect" href="https://uploadthing.com" />
        <link rel="preconnect" href="https://utfs.io" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent-500 focus:text-white focus:px-4 focus:py-2 focus:rounded">
          Skip to main content
        </a>
        
        <header className="border-b border-gray-200 dark:border-gray-700 sticky top-0 backdrop-blur bg-white/80 dark:bg-gray-900/80 z-30 shadow-sm">
          <nav className="container flex flex-wrap items-center justify-between gap-4 py-4">
            <Link href="/" className="text-xl font-bold hover:text-accent-600 transition-colors flex items-center gap-2">
              <span aria-hidden>✈️</span>
              <span>Travel Photo Blog</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
                <Link href="/reviews" className="hover:text-accent-600 transition-colors">Reviews</Link>
                <Link href="/map" className="hover:text-accent-600 transition-colors">Map</Link>
                <Link href="/trips" className="hover:text-accent-600 transition-colors">Trips</Link>
                <a 
                  href="https://mexico-city-trip.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-600 hover:text-accent-700"
                >
                  CDMX Itinerary ↗
                </a>
              </div>
              <div className="flex sm:hidden items-center gap-2 text-sm">
                <Link href="/reviews" className="hover:text-accent-600 transition-colors">Reviews</Link>
                <Link href="/map" className="hover:text-accent-600 transition-colors">Map</Link>
                <Link href="/trips" className="hover:text-accent-600 transition-colors">Trips</Link>
              </div>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        
        <main id="main-content" className="container py-8 flex-1">
          {children}
        </main>
        
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-16 bg-gray-50 dark:bg-gray-900">
          <div className="container py-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">About</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A parent-teen travel journal documenting places we love with honest reviews and photos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/reviews" className="text-gray-600 dark:text-gray-400 hover:text-accent-600">All Reviews</Link></li>
                  <li><Link href="/map" className="text-gray-600 dark:text-gray-400 hover:text-accent-600">Interactive Map</Link></li>
                  <li><Link href="/trips/mexico-city-2025" className="text-gray-600 dark:text-gray-400 hover:text-accent-600">Mexico City 2025</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Tech Stack</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built with Next.js, TypeScript, Tailwind CSS, and Leaflet. 
                  Content managed in <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">/data</code>.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Travel Photo Blog. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
