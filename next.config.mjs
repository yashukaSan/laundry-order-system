/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevents ESLint errors from failing the Vercel build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Prevents type errors from failing the Vercel build (safety net for JS projects)
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
