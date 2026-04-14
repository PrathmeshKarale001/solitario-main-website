import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import { Montserrat } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/cart-context'
import { ShopifyCartProvider } from '@/lib/shopify-cart-context'
import { LazyCartSidebar } from '@/components/lazy'
import LazyWarnerBrosFloatingButton from '@/components/ui/LazyWarnerBrosFloatingButton'
import { WishlistProvider } from '@/lib/wishlist-context'
import { PostHogProvider } from '@/lib/posthog'
import { QueryProvider } from '@/lib/query-client'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import MetaPixel from '@/components/analytics/MetaPixel'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/ProductJsonLd'
import ScrollToTopOnRouteChange from '@/components/ui/ScrollToTopOnRouteChange'
import SmoothScrollWrapper from '@/components/ui/SmoothScrollWrapper'
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/providers/Toaster';
import { SkipLinks } from '@/components/ui/SkipLink';
import CookieConsent from '@/components/ui/CookieConsent';
import './globals.css'

// Load Montserrat from Google Fonts - unified font for the entire website
// Using various weights for titles (Bold), subtitles (Medium), and paragraphs (Regular/Light)
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'], // Light, Regular, Medium, SemiBold, Bold
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://thesolitario.com'),
  verification: {
    google: 'xUFl2vc34O49CIjWhqmHX4-vYIQVoWlYIY2FI6zE9ZM',
  },
  title: {
    default: 'The Solitario - Lab Grown Diamond Jewellery | Modern Luxury',
    template: '%s | The Solitario',
  },
  description: 'India\'s most loved new-age diamond jewellery brand. Discover timeless, modern luxury with lab-grown diamonds. Crafted for modern and future generations.',
  keywords: ['lab grown diamonds', 'diamond jewellery', 'diamond rings', 'luxury jewellery', 'lab created diamonds', 'The Solitario', 'lab grown diamond jewellery India'],
  authors: [{ name: 'The Solitario' }],
  creator: 'The Solitario',
  publisher: 'The Solitario',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'The Solitario - Lab Grown Diamond Jewellery',
    description: 'Discover exquisitely crafted lab-grown diamond jewellery. Modern luxury, timeless elegance.',
    url: 'https://thesolitario.com',
    siteName: 'The Solitario',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Solitario - Lab Grown Diamond Jewellery',
    description: 'India\'s most loved new-age diamond jewellery brand. Modern luxury with lab-grown diamonds.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.variable} style={{ '--font-playfair': 'var(--font-montserrat)', '--font-gotham': 'var(--font-montserrat)', '--font-didot': 'var(--font-montserrat)' } as React.CSSProperties} suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains — reduces connection setup time for LCP */}
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for analytics/tracking domains — non-blocking early resolution */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://us.i.posthog.com" />

        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
        <SkipLinks />
        {/* Google Ads Conversion Tracking - lazyOnload to avoid blocking LCP/FCP */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17875605995"
          strategy="lazyOnload"
        />
        <Script id="google-ads-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17875605995');
          `}
        </Script>

        <GoogleAnalytics />
        <MetaPixel />
        <ClerkProvider>
          <PostHogProvider>
            <QueryProvider>
              <SmoothScrollWrapper>
                <Suspense fallback={null}>
                  <ScrollToTopOnRouteChange />
                </Suspense>
                <WishlistProvider>
                  <CartProvider>
                    <ShopifyCartProvider>
                    <Header />
                    <main id="main-content" suppressHydrationWarning>
                      <Suspense fallback={null}>
                        {children}
                      </Suspense>
                    </main>
                    <Footer />
                    <LazyCartSidebar />
                    <LazyWarnerBrosFloatingButton />
                    </ShopifyCartProvider>
                  </CartProvider>
                </WishlistProvider>
              </SmoothScrollWrapper>
            </QueryProvider>
          </PostHogProvider>
        </ClerkProvider>
        <Toaster />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}

