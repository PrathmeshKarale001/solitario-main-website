'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Heart, Search, ShoppingBag, User, ChevronRight, Sparkles, MapPin, Phone, Diamond } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import SearchModal from '@/components/ui/SearchModal';

// Clean navigation structure - only essential links
const NAV_LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/stores', label: 'Stores' },
  { href: '/about', label: 'About' },
];

// Mobile menu categories for better organization
const MOBILE_MENU_SECTIONS = [
  {
    title: 'Shop',
    links: [
      { href: '/products', label: 'All Products', icon: Sparkles },
      { href: '/products?category=rings', label: 'Rings' },
      { href: '/products?category=earrings', label: 'Earrings' },
      { href: '/products?category=pendants', label: 'Pendants' },
      { href: '/products?category=bracelets', label: 'Bracelets' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { href: '/stores', label: 'Our Stores', icon: MapPin },
      { href: '/about', label: 'Our Story' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { href: '/contact', label: 'Contact Us', icon: Phone },
      { href: '/franchise', label: 'Franchise' },
    ],
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isProductsPage = pathname === '/products';
  const isProductDetailPage = pathname?.startsWith('/products/'); // Individual product pages
  const isStoresPage = pathname === '/stores';
  const isTransparentHeroPage =
    isHomePage ||
    pathname === '/lab-grown-diamonds' ||
    pathname === '/about' ||
    pathname === '/stores' ||
    (pathname === '/products'); // Only products listing, not product detail
  const isAdminPage = pathname?.startsWith('/admin');
  const { itemCount, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { data: session } = useSession();

  useEffect(() => {
    const updateScroll = () => {
      const heroThreshold = isStoresPage
        ? window.innerHeight * 0.65
        : window.innerHeight * 0.99; // wait until hero is essentially passed
      setIsScrolled(window.scrollY > heroThreshold);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, [isStoresPage]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Don't render header on admin pages
  if (isAdminPage) {
    return null;
  }

  // Fully transparent on hero pages until scroll; solid black after scroll; solid dark elsewhere
  const headerClasses = isTransparentHeroPage
    ? isScrolled
      ? 'bg-[#146552] shadow-luxury'
      : isProductsPage
        ? 'bg-gradient-to-b from-black/70 via-black/35 to-transparent'
        : 'bg-transparent'
    : 'bg-[#146552] shadow-luxury';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          headerClasses,
          isMobileMenuOpen && 'lg:block hidden'
        )}
      >
        {/* Main Header - Increased padding */}
        <div className="px-3 sm:px-4 lg:px-8 py-2 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile: Menu Button | Desktop: Navigation */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-white p-1.5 -ml-1.5 touch-manipulation"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Desktop Navigation - Clean & Minimal */}
              <nav className="hidden lg:flex items-center space-x-6 ml-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-white/90 hover:text-bronze-gold transition-colors duration-200 font-gotham text-xs uppercase tracking-[0.15em]",
                      pathname === link.href && "text-bronze-gold"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center Logo - Responsive sizing */}
            <Link 
              href="/" 
              className="absolute left-1/2 -translate-x-1/2 flex items-center"
            >
              <Image
                src="/logo.svg"
                alt="Solitario"
                width={140}
                height={40}
                className="w-auto brightness-0 invert h-8 sm:h-9 lg:h-10"
                priority
              />
            </Link>

            {/* Right Icons - Optimized touch targets for mobile */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search - Desktop only in header, mobile in menu */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex text-white hover:text-bronze-gold transition-colors p-2 touch-manipulation"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative text-white hover:text-bronze-gold transition-colors p-2 touch-manipulation"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-bronze-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account - Hidden on mobile, shown in menu */}
              <Link
                href={session ? '/account' : '/auth/login'}
                className="hidden sm:flex text-white hover:text-bronze-gold transition-colors p-2 touch-manipulation"
                aria-label={session ? 'My Account' : 'Sign In'}
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative text-white hover:text-bronze-gold transition-colors p-2 touch-manipulation"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-bronze-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden transition-all duration-300",
          isMobileMenuOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel - Slides from left */}
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-[85%] max-w-sm bg-classic-green overflow-y-auto transition-transform duration-300 ease-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Menu Header */}
          <div className="sticky top-0 bg-classic-green z-10 px-4 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Image
                src="/logo.svg"
                alt="Solitario"
                width={120}
                height={34}
                className="brightness-0 invert h-7 w-auto"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white p-2 -mr-2 touch-manipulation"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar in Mobile Menu */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="mt-4 w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white/70 text-sm touch-manipulation"
            >
              <Search className="w-4 h-4" />
              <span>Search products...</span>
            </button>
          </div>

          {/* Menu Sections */}
          <nav className="px-4 py-6 space-y-6">
            {MOBILE_MENU_SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="text-bronze-gold text-xs font-gotham uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-3 px-3 rounded-lg text-white hover:bg-white/10 transition-colors touch-manipulation",
                        pathname === link.href && "bg-white/10"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {link.icon && <link.icon className="w-4 h-4 text-bronze-gold" />}
                        <span className="font-montserrat text-sm">{link.label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/40" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* User Section at Bottom */}
          <div className="sticky bottom-0 bg-classic-green border-t border-white/10 px-4 py-4">
            <Link
              href={session ? '/account' : '/auth/login'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-3 bg-bronze-gold/20 rounded-lg text-white touch-manipulation"
            >
              <User className="w-5 h-5" />
              <span className="font-montserrat text-sm">
                {session ? 'My Account' : 'Sign In / Register'}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
