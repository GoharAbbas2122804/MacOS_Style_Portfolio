/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static exports if needed, or remove for SSR
  // output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
