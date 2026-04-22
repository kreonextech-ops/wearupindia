/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'www.transparenttextures.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    // Cache optimized images for 30 days to prevent re-processing on every request
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Only generate the sizes we actually use
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 64, 128, 256],
  },
  // Prevent large gallery/video files from being bundled into serverless functions.
  // These files are served as static CDN assets by Vercel separately.
  outputFileTracingExcludes: {
    '*': [
      './public/gallery/**',
      './public/videos/**',
      './public/images/**',
    ],
  },
};

export default nextConfig;
