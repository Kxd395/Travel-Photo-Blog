/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  },
  // Image optimization for deployment
  images: {
    domains: ['uploadthing.com', 'utfs.io', 'images.unsplash.com'],
    // Disable optimization for static deployment if needed
    // unoptimized: true,
  },
  // Handle environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.URL || 'http://localhost:3000',
  }
};
export default nextConfig;
