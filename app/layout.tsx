import type { Metadata } from 'next'
import localFont from 'next/font/local'
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

// TEMPORARY: Using Playfair Display as fallback until Aguila font files are added
// TODO: Replace with actual Aguila font files in public/fonts/
// To use Aguila fonts:
// 1. Add font files: public/fonts/Aguila-Regular.woff2, Aguila-Medium.woff2, Aguila-Bold.woff2
// 2. Uncomment the localFont code below and comment out the Playfair_Display fallback
const aguila = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-aguila',
  display: 'swap',
  weight: ['400', '700'], // Reduced from 6 weights to 2 most used
});

// Uncomment this when you have Aguila font files:
// const aguila = localFont({
//   src: [
//     {
//       path: '../public/fonts/Aguila-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../public/fonts/Aguila-Medium.woff2',
//       weight: '500',
//       style: 'normal',
//     },
//     {
//       path: '../public/fonts/Aguila-Bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   variable: '--font-aguila',
//   display: 'swap',
//   fallback: ['Georgia', 'serif'],
// });

// TEMPORARY: Using Playfair Display as fallback until Didot LP font files are added
// TODO: Replace with actual Didot LP font files in public/fonts/
// To use Didot LP fonts:
// 1. Add font files: public/fonts/Didot-LP-Regular.woff2, Didot-LP-Medium.woff2, Didot-LP-Bold.woff2
// 2. Uncomment the localFont code below and comment out the Playfair_Display fallback
const didot = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-didot',
  display: 'swap',
  weight: ['400', '500'], // Reduced from 4 weights to 2 most used
});

// Uncomment this when you have Didot LP font files:
// const didot = localFont({
//   src: [
//     {
//       path: '../public/fonts/Didot-LP-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../public/fonts/Didot-LP-Medium.woff2',
//       weight: '500',
//       style: 'normal',
//     },
//     {
//       path: '../public/fonts/Didot-LP-Bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   variable: '--font-didot',
//   display: 'swap',
//   fallback: ['Georgia', 'serif'],
// });

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
    <html lang="en" className={`${montserrat.variable} ${aguila.variable} ${didot.variable} ${gotham.variable}`}>
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

