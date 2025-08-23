const nextConfig = {
  experimental: {
    // Enable server actions if needed for future features
  },
  images: {
    domains: ['localhost'],
  },
  // Proxy API calls to Express backend during development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ]
  },
}

module.exports = nextConfig