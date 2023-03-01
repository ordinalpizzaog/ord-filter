/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ordinals.com',
        port: '',
        pathname: '/content/**',
      },
    ],
  },
}

module.exports = nextConfig
