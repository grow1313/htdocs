/** @type {import('next').NextConfig} */
const nextConfig = {
  // turbopack removido (não suportado)
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig
