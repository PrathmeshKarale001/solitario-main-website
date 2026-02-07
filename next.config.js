/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thesolitario.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'], // AVIF first for better compression
    minimumCacheTTL: 31536000, // Cache for 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Experimental features - Audit Recommendation 5.3
  experimental: {
    // View Transitions API for smooth page transitions
    viewTransition: true,
  },
  // Security headers - Audit Recommendation 4.1
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          // Content Security Policy - Google Ads, GA, Meta Pixel, Conversions API
          { 
            key: 'Content-Security-Policy', 
            value: [
              "default-src 'self'",
              // script-src: Google (GTM, Analytics, Ads, gtag) + Meta Pixel + app scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://checkout.razorpay.com https://api.razorpay.com https://cdn.razorpay.com https://*.clerk.accounts.dev https://*.clerk.com https://*.vercel-scripts.com https://*.posthog.com https://*.sentry.io https://www.googletagmanager.com https://googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://tagmanager.google.com https://www.googleadservices.com https://googleadservices.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://google.com https://*.google.com https://*.googlesyndication.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://connect.facebook.net https://*.facebook.net https://www.facebook.com https://facebook.com https://*.facebook.com",
              // worker-src: Clerk and other workers
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com https://www.googletagmanager.com https://cdn.razorpay.com",
              // img-src: Google tracking pixels, Ads, Meta Pixel, analytics
              "img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://images.pexels.com https://*.clerk.com https://*.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://ssl.gstatic.com https://www.gstatic.com https://www.google.com https://google.com https://*.google.com https://www.googleadservices.com https://googleadservices.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://bid.g.doubleclick.net https://www.google.co.in https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.facebook.com https://facebook.com https://*.facebook.com https://*.facebook.net",
              "font-src 'self' https://fonts.gstatic.com",
              // connect-src: Google Ads conversion, remarketing, Meta Pixel, Conversions API
              "connect-src 'self' https://*.shopify.com https://checkout.razorpay.com https://api.razorpay.com https://*.razorpay.com https://*.clerk.accounts.dev https://clerk-telemetry.com https://*.clerk-telemetry.com https://*.clerk.com https://*.posthog.com https://*.sentry.io https://*.vercel-insights.com https://api.radar.io https://track.delhivery.com https://www.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://*.doubleclick.net https://bid.g.doubleclick.net https://www.googletagmanager.com https://www.google.com https://google.com https://*.google.com https://www.googleadservices.com https://googleadservices.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://*.googlesyndication.com https://tpc.googlesyndication.com https://www.facebook.com https://facebook.com https://*.facebook.com https://*.facebook.net https://connect.facebook.net",
              // frame-src: Google Ads, reCAPTCHA, Meta widgets
              "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://*.razorpay.com https://*.clerk.accounts.dev https://www.google.com https://google.com https://*.google.com https://td.doubleclick.net https://*.doubleclick.net https://www.googletagmanager.com https://bid.g.doubleclick.net https://tpc.googlesyndication.com https://www.facebook.com https://facebook.com https://*.facebook.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; ')
          },
        ],
      },
    ];
  },
  // Compress responses
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  // Webpack optimizations - Audit Recommendation 6.2
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Vendor splitting for better caching
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate vendor chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Separate framer-motion (large library)
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 20,
          },
          // Separate maplibre (heavy mapping library)
          maplibre: {
            test: /[\\/]node_modules[\\/]maplibre-gl[\\/]/,
            name: 'maplibre',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "end-of-day",
  project: "thesolitario",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
