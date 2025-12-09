import type { Metadata } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/cart-context'
import { ShopifyCartProvider } from '@/lib/shopify-cart-context'
import AuthProvider from '@/components/providers/AuthProvider'
import { CartSidebar } from '@/components/cart'
import SmoothScroll from '@/components/ui/SmoothScroll'
// CustomCursor disabled - using default system cursor
// import CustomCursor from '@/components/ui/CustomCursor'
import { WishlistProvider } from '@/lib/wishlist-context'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/ProductJsonLd'
import './globals.css'

// Playfair Display for headings - elegant serif font
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

// Load Montserrat from Google Fonts for body text AND UI text
// Montserrat is a brand font and will be used for both body and Gotham (UI) text
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600'], // Reduced from 7 weights to 3 most used
})

// Use Montserrat for Gotham (UI text) as well - it's a brand font
// If you have actual Gotham font files, load them as localFont similar to Aguila
const gotham = Montserrat({
  subsets: ['latin'],
  variable: '--font-gotham',
  display: 'swap',
  weight: ['400', '500'], // Reduced from 7 weights to 2 most used for UI
})

export const metadata: Metadata = {
  title: 'Solitario - Lab Grown Diamond Jewellery | Sustainable Luxury',
  description: 'India\'s most loved new-age diamond jewellery brand. Discover timeless, sustainable luxury with lab-grown diamonds. Crafted for modern and future generations.',
  keywords: ['lab grown diamonds', 'sustainable jewellery', 'diamond rings', 'luxury jewellery', 'ethical diamonds', 'Solitario'],
  authors: [{ name: 'Solitario' }],
  openGraph: {
    title: 'Solitario - Lab Grown Diamond Jewellery',
    description: 'Luxury that doesn\'t cost the Earth. Discover our collection of ethically crafted lab-grown diamond jewellery.',
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
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} ${gotham.variable}`}>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <SmoothScroll>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <ShopifyCartProvider>
                  <Header />
                  <main>
                    {children}
                  </main>
                  <Footer />
                  <CartSidebar />
                </ShopifyCartProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  )
}

