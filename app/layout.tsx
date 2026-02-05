import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import { Montserrat } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { WarnerBrosFloatingButton } from '@/components/ui'
import { CartProvider } from '@/lib/cart-context'
import { ShopifyCartProvider } from '@/lib/shopify-cart-context'
import { CartSidebar } from '@/components/cart'
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
  title: 'Solitario - Lab Grown Diamond Jewellery | Modern Luxury',
  description: 'India\'s most loved new-age diamond jewellery brand. Discover timeless, modern luxury with lab-grown diamonds. Crafted for modern and future generations.',
  keywords: ['lab grown diamonds', 'diamond jewellery', 'diamond rings', 'luxury jewellery', 'lab created diamonds', 'Solitario'],
  authors: [{ name: 'Solitario' }],
  icons: {
    icon: '/solitariofavicon.svg',
    shortcut: '/solitariofavicon.svg',
    apple: '/solitariofavicon.svg',
  },
  openGraph: {
    title: 'Solitario - Lab Grown Diamond Jewellery',
    description: 'Discover our collection of exquisitely crafted lab-grown diamond jewellery. Modern luxury, timeless elegance.',
    url: 'https://thesolitario.com',
    siteName: 'Solitario',
    locale: 'en_IN',
    type: 'website',
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
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
        <SkipLinks />
        {/* Google Ads Conversion Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17875605995"
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
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
                      <main id="main-content">
                        {children}
                      </main>
                      <Footer />
                      <CartSidebar />
                      <WarnerBrosFloatingButton />
                    </ShopifyCartProvider>
                  </CartProvider>
                </WishlistProvider>
              </SmoothScrollWrapper>
            </QueryProvider>
          </PostHogProvider>
        </ClerkProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

