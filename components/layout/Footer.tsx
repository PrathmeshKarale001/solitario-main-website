'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  // Don't render footer on admin pages
  if (isAdminPage) {
    return null;
  }

  return (
    <footer className="bg-classic-green text-ivory-pearl">
      {/* Newsletter Section - Compact */}
      <div className="border-b border-bronze-gold/20">
        <div className="section-container py-6 sm:py-8 md:py-12">
          <div className="max-w-md sm:max-w-2xl mx-auto text-center px-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-didot mb-2 sm:mb-4">Subscribe</h3>
            <p className="text-xs sm:text-sm text-ivory-pearl/80 mb-4 sm:mb-6 hidden sm:block">
              Stay updated on special offers and latest collection
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
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Compact */}
      <div className="section-container py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.svg"
                alt="Solitario Logo"
                width={150}
                height={45}
                className="w-auto brightness-0 invert h-[2.6rem] md:h-[3.55rem]"
              />
            </Link>
            <p className="text-xs sm:text-sm text-ivory-pearl/80 mb-3 sm:mb-4">
              India's most loved new-age diamond jewellery brand. Luxury that doesn't cost the Earth.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory-pearl hover:text-bronze-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory-pearl hover:text-bronze-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory-pearl hover:text-bronze-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="mailto:info@solitario.com"
                className="text-ivory-pearl hover:text-bronze-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - Compact */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories - Compact */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-4">Categories</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/products?category=rings" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/products?category=necklaces" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/products?category=earrings" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/products?category=bracelets" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service - Compact */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-4">Service</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/faq" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-ivory-pearl/80 hover:text-bronze-gold transition-colors text-sm">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ivory-pearl/80 hover:text-bronze-gold transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Certifications
                </Link>
              </li>
              {/* <li>
                <Link href="/sustainability" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
                  Sustainability
                </Link>
              </li> */}
              <li>
                <Link href="/franchise" className="text-xs sm:text-sm text-ivory-pearl/80 hover:text-bronze-gold transition-colors">
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
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-ivory-pearl/70">
              <Link href="/privacy-policy" className="hover:text-bronze-gold transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden md:inline">|</span>
              <Link href="/terms" className="hover:text-bronze-gold transition-colors">
                Terms & Conditions
              </Link>
            </div>
            <p className="text-sm text-ivory-pearl/70">© 2025 Solitario. All rights reserved.</p>
            <p className="text-sm text-ivory-pearl/70">
              Marketed by{' '}
              <a
                href="https://yashus.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bronze-gold hover:underline"
              >
                Yashus
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


