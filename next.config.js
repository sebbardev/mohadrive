/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard output for Hostinger deployment
  trailingSlash: true,
  
  // Disable static generation - force dynamic rendering
  staticPageGenerationTimeout: 120,
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
    ],
    // Enable WebP and AVIF formats for better compression
    formats: ['image/webp', 'image/avif'],
    // Optimize image loading
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable React strict mode for better performance in development
  reactStrictMode: true,
  
  // Compression for production
  compress: true,
  
  // OPTIMIZED: Enable SWC minifier for faster builds
  swcMinify: true,
  
  // OPTIMIZED: Enable experimental optimizations
  experimental: {
    // Disable CSS optimization to avoid webpack errors
    optimizeCss: false,
    // Enable legacy browser support if needed
    forceSwcTransforms: false,
  },
  
    
  // Headers for better caching
  async headers() {
    return [
      {
        // Cache static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Shorter cache for pages
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Redirects if needed
  async redirects() {
    return [];
  },
  
  // OPTIMIZED: Enable powered by header removal for security
  poweredByHeader: false,
};

module.exports = nextConfig;
