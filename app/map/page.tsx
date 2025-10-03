import dynamic from 'next/dynamic'

const DynamicMapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  )
})

export default function MapPage() {
  return <DynamicMapView />
}
