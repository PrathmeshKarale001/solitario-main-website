'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react';
import { trackMetaSubscribe } from '@/components/analytics/MetaPixel';

export default function Footer() {
  const [email, setEmail] = useState('');
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Track Subscribe event (Meta Pixel)
    trackMetaSubscribe();
    // Handle newsletter subscription
    setEmail('');
  };

  // Don't render footer on admin pages
  if (isAdminPage) {
    return null;
  }

  return (
    <footer id="footer" className="bg-classic-green text-ivory-pearl">
      {/* Newsletter Section - Compact */}
      <div className="border-b border-bronze-gold/20">
        <div className="section-container py-6 sm:py-8 md:py-12">
          <div className="max-w-md sm:max-w-2xl mx-auto text-center px-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-montserrat font-bold mb-2 sm:mb-4">Stay updated for newsletter.</h3>
            <p className="text-xs sm:text-sm text-ivory-pearl/80 mb-4 sm:mb-6 hidden sm:block">
              Special offers and Latest collection
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded bg-ivory-pearl/10 border border-ivory-pearl/20 text-ivory-pearl placeholder-ivory-pearl/50 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-bronze-gold text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-bronze-gold text-white rounded text-xs sm:text-sm font-gotham uppercase tracking-wider hover:bg-bronze-gold/90 transition-colors touch-manipulation"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Uniform Layout */}
      <div className="section-container py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-start">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.svg"
                alt="Solitario Logo"
                width={150}
                height={45}
                className="w-auto brightness-0 invert h-[2.6rem] md:h-[3.55rem]"
              />
            </Link>
            <p className="text-sm text-ivory-pearl/80 mb-4">
              India's most loved new-age diamond jewellery brand. Luxury that doesn't cost the Earth.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61586760412779"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory-pearl hover:text-bronze-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/solitariodiamonds/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory-pearl hover:text-bronze-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://in.linkedin.com/company/solitario-lab-grown-diamonds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory-pearl hover:text-bronze-gold transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@solitario.com"
                className="text-ivory-pearl hover:text-bronze-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/lab-grown-diamonds" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Lab Diamonds
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-base mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/category/rings" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/products/category/necklaces" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/products/category/earrings" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/products/category/bracelets" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/products/category/pendants" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Pendants
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-base mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-base mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/franchise" className="text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Franchise
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Links & Copyright */}
      <div className="border-t border-bronze-gold/20">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-ivory-pearl/95">
              <Link href="/privacy-policy" className="hover:text-bronze-gold transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden md:inline">|</span>
              <Link href="/terms" className="hover:text-bronze-gold transition-colors">
                Terms & Conditions
              </Link>
            </div>
            <p className="text-sm text-ivory-pearl/95">© 2025 Solitario. All rights reserved.</p>

          </div>
        </div>
      </div>
    </footer>
  );
}


