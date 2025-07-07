/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // ✅ 1MB থেকে বাড়িয়ে 10MB করা হলো
    },
  },
};

export default nextConfig;
