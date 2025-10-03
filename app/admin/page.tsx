import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, MessageSquare, Plane, Image } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [
    placesCount,
    reviewsCount,
    tripsCount,
    photosCount,
    recentReviews,
    recentTrips,
  ] = await Promise.all([
    prisma.place.count({ where: { published: true } }),
    prisma.review.count({ where: { published: true } }),
    prisma.trip.count({ where: { published: true } }),
    prisma.photo.count(),
    prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { place: true, user: true },
    }),
    prisma.trip.findMany({
      take: 5,
      orderBy: { startDate: "desc" },
    }),
  ])

  const stats = [
    {
      name: "Places",
      value: placesCount,
      icon: MapPin,
      href: "/admin/places",
      color: "bg-blue-500",
    },
    {
      name: "Reviews",
      value: reviewsCount,
      icon: MessageSquare,
      href: "/admin/reviews",
      color: "bg-green-500",
    },
    {
      name: "Trips",
      value: tripsCount,
      icon: Plane,
      href: "/admin/trips",
      color: "bg-purple-500",
    },
    {
      name: "Photos",
      value: photosCount,
      icon: Image,
      href: "/admin/photos",
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with our travel blog
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} rounded-lg p-3 text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reviews */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Reviews
            </h3>
            <Link
              href="/admin/reviews"
              className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recentReviews.length > 0 ? (
              recentReviews.map((review: any) => (
                <div
                  key={review.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {review.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {review.place.name} • {review.rating}⭐
                    </p>
                  </div>
                  <Link
                    href={`/admin/reviews/${review.id}`}
                    className="text-xs text-accent-600 hover:text-accent-700 dark:text-accent-400"
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No reviews yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Trips */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Trips
            </h3>
            <Link
              href="/admin/trips"
              className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recentTrips.length > 0 ? (
              recentTrips.map((trip: any) => (
                <div
                  key={trip.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {trip.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(trip.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/admin/trips/${trip.id}`}
                    className="text-xs text-accent-600 hover:text-accent-700 dark:text-accent-400"
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No trips yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/places/new"
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 hover:border-accent-500 dark:hover:border-accent-400 transition-colors"
          >
            <MapPin className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Place
            </span>
          </Link>
          <Link
            href="/admin/reviews/new"
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 hover:border-accent-500 dark:hover:border-accent-400 transition-colors"
          >
            <MessageSquare className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Write Review
            </span>
          </Link>
          <Link
            href="/admin/trips/new"
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 hover:border-accent-500 dark:hover:border-accent-400 transition-colors"
          >
            <Plane className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Plan Trip
            </span>
          </Link>
          <Link
            href="/admin/photos"
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 hover:border-accent-500 dark:hover:border-accent-400 transition-colors"
          >
            <Image className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Photos
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
