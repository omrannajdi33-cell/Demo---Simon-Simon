/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Demo---Simon-Simon',
  assetPrefix: '/Demo---Simon-Simon',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
