import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import { Montserrat, Playfair_Display } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
// import { WarnerBrosFloatingButton } from '@/components/ui'
import { CartProvider } from '@/lib/cart-context'
import { ShopifyCartProvider } from '@/lib/shopify-cart-context'
import { CartSidebar } from '@/components/cart'
import { WishlistProvider } from '@/lib/wishlist-context'
import { PostHogProvider } from '@/lib/posthog'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/ProductJsonLd'
import ScrollToTopOnRouteChange from '@/components/ui/ScrollToTopOnRouteChange'
import SmoothScrollWrapper from '@/components/ui/SmoothScrollWrapper'
import { Analytics } from '@vercel/analytics/next';
import { QueryProvider } from '@/lib/query-client';
import { Toaster } from '@/components/providers/Toaster';
import { SkipLinks } from '@/components/ui/SkipLink';
import './globals.css'

// Playfair Display for headings - elegant serif font
// Reduced weights from 4 to 2 most used (400 for body, 600 for emphasis)
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600'], // Reduced from 4 weights to 2
  preload: true,
  fallback: ['Georgia', 'serif'],
})

// Load Montserrat from Google Fonts for body text AND UI text
// Consolidated: Using single instance for both body and Gotham (UI) to reduce font loading
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600'], // All weights needed across body and UI
  preload: true, // Preload for faster LCP
  fallback: ['system-ui', 'arial'], // System font fallback to reduce CLS
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
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`} style={{ '--font-gotham': 'var(--font-montserrat)' } as React.CSSProperties}>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="antialiased overflow-x-hidden">
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
        <ClerkProvider>
          <QueryProvider>
            <PostHogProvider>
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
                    {/* <WarnerBrosFloatingButton /> */}
                  </ShopifyCartProvider>
                </CartProvider>
              </WishlistProvider>
            </SmoothScrollWrapper>
            </PostHogProvider>
          </QueryProvider>
        </ClerkProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

