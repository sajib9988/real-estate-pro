// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // আপনার অন্যান্য কনফিগারেশন এখানে থাকতে পারে...
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;