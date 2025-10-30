import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      new URL('https://picsum.photos/**'),
      new URL('https://i.ytimg.com/**'),
      new URL('https://img.youtube.com/**'),
    ],
  },
  // Increase body size limit for video uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '2gb',
    },
  },
}

export default nextConfig
