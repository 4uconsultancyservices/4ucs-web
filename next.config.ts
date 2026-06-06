import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      '@radix-ui/react-icons',
    ],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com'       },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'api.dicebear.com'           },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Required for Prisma in Next.js App Router
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;
