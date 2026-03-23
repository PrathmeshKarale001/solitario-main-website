'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const BLOG_POSTS = [
  {
    id: 'diamond-clarity-guide',
    title: 'What Is Diamond Clarity? A Complete Visual Guide for First-Time Diamond Buyers',
    excerpt:
      'Buying a diamond should feel empowering, not overwhelming. This complete guide walks you through everything about diamond clarity — from grades and charts to what actually matters for your jewellery.',
    image: '/solitario/blog/Desktop - diamond stone purity.png',
    mobileImage: '/solitario/blog/Mobile - diamond stone purity.png',
    date: 'March 2025',
    readTime: '7 min read',
    featured: true,
    category: 'Education',
    author: { name: 'Solitario Diamond Specialists' },
    slug: 'diamond-clarity-guide',
    href: '/blog/diamond-clarity-guide',
  },
  {
    id: 'lab-grown-diamonds-last-forever',
    title: 'Do Lab-Grown Diamonds Last Forever? What Happens After 10 Years.',
    excerpt:
      'Will your lab-grown diamond still sparkle in 2035? A science-backed answer to the #1 question millennial and Gen Z buyers ask before committing to a diamond purchase.',
    image: '/solitario/blog/Desktop - solitario_lab_grown_diamonds.png',
    mobileImage: '/solitario/blog/Mobile - solitario_lab_grown_diamonds.png',
    date: 'February 2025',
    readTime: '6 min read',
    featured: false,
    category: 'Education',
    author: { name: 'Solitario Diamond Specialists' },
    slug: 'lab-grown-diamonds-last-forever',
    href: '/blog/lab-grown-diamonds-last-forever',
  },
  {
    id: '14k-vs-18k-gold-diamond-jewellery',
    title: '14K vs 18K Gold: Which Is Better for Diamond Jewellery?',
    excerpt:
      'The gold that holds your diamond is not just structural — it is visual, emotional, and consequential. The definitive guide for luxury-conscious Indian jewellery buyers.',
    image: '/solitario/blog/Desktop - 14 k 18 k.png',
    mobileImage: '/solitario/blog/Mobile - 14 k 18 k.png',
    date: 'January 2025',
    readTime: '8 min read',
    featured: false,
    category: 'Guides',
    author: { name: 'Solitario Diamond Specialists' },
    slug: '14k-vs-18k-gold-diamond-jewellery',
    href: '/blog/14k-vs-18k-gold-diamond-jewellery',
  },
  {
    id: 'diamond-earrings-face-shape-guide',
    title: 'How to Choose Diamond Earrings for Your Face Shape: The Ultimate Style Guide',
    excerpt:
      'Buying diamond earrings without considering your face shape is like choosing an outfit without a mirror. Your complete guide to finding the perfect pair — every time.',
    image: '/solitario/blog/Desktop - Face shapes and earrings.png',
    mobileImage: '/solitario/blog/Mobile - Face shapes and earrings.png',
    date: 'December 2024',
    readTime: '6 min read',
    featured: false,
    category: 'Guides',
    author: { name: 'Solitario Style Team' },
    slug: 'diamond-earrings-face-shape-guide',
    href: '/blog/diamond-earrings-face-shape-guide',
  },
  {
    id: 'lifetime-diamond-exchange-policy',
    title: "What Is a Lifetime Diamond Exchange Policy? Why Solitario's Guarantee Stands Apart.",
    excerpt:
      "Not all lifetime exchange policies are created equal. A buyer's guide to understanding what real commitment looks like — and why Solitario's policy sets a new benchmark for Indian luxury jewellery.",
    image: '/solitario/blog/Desktop - exchange, resale , keep.png',
    mobileImage: '/solitario/blog/Mobile - exchange, resale , keep.png',
    date: 'November 2024',
    readTime: '7 min read',
    featured: false,
    category: 'Lifestyle',
    author: { name: 'The Solitario Promise' },
    slug: 'lifetime-diamond-exchange-policy',
    href: '/blog/lifetime-diamond-exchange-policy',
  },
];

// Auto-derive categories from actual post data — never shows empty tabs
const CATEGORIES = ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))] as const;

// ---------------------------------------------------------------------------
// RESPONSIVE IMAGE COMPONENT — fixes the "both images load" bug
// Only one network request fires: the one matching the current viewport.
// ---------------------------------------------------------------------------
function ResponsiveImage({
  src,
  mobileSrc,
  alt,
  fill,
  priority,
  className,
}: {
  src: string;
  mobileSrc: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Before mount, default to desktop src (SSR-safe: avoids flicker on desktop)
  const activeSrc = mounted ? (isMobile ? mobileSrc : src) : src;

  return (
    <Image
      src={activeSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
    />
  );
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const featuredPost = BLOG_POSTS.find((p) => p.featured)!;

  // Posts shown in the grid — all non-featured posts matching the category filter
  const gridPosts = BLOG_POSTS.filter(
    (p) => !p.featured && (activeCategory === 'All' || p.category === activeCategory),
  );

  // Count per category (including featured post)
  const countByCategory: Record<string, number> = {};
  BLOG_POSTS.forEach((p) => {
    countByCategory[p.category] = (countByCategory[p.category] ?? 0) + 1;
  });
  const totalAll = BLOG_POSTS.length;

  // Is the featured post part of the active category filter?
  const featuredMatchesFilter =
    activeCategory === 'All' || featuredPost.category === activeCategory;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      {/* Spacer — clears fixed navbar */}
      <div className="h-20 md:h-[100px] w-full" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 w-full">

        {/* ── HERO FEATURED POST — fully clickable ──────────────────────── */}
        <Link href={featuredPost.href} className="block">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full relative aspect-[3/4] sm:aspect-[4/3] md:aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-md cursor-pointer group"
          >
            {/* Single image, correct viewport loaded via JS */}
            <ResponsiveImage
              src={featuredPost.image}
              mobileSrc={featuredPost.mobileImage}
              alt={featuredPost.title}
              fill
              priority
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Category chip + Read Article — top row */}
            <div className="absolute top-4 left-4 right-4 md:top-5 md:left-6 md:right-6 flex items-center justify-between">
              <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] md:text-[11px] font-gotham uppercase tracking-wider rounded-full border border-white/30">
                {featuredPost.category}
              </span>
              <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-[10px] md:text-xs font-gotham uppercase tracking-wider rounded-full border border-white/30 transition-all">
                Read <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </span>
            </div>

            {/* Bottom — title + author */}
            <div className="absolute bottom-0 w-full px-4 pb-5 md:px-10 md:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div className="max-w-2xl text-white">
                <h1 className="text-base sm:text-xl md:text-4xl lg:text-[2.6rem] font-montserrat font-bold text-white leading-tight mb-1.5 md:mb-2.5 line-clamp-3 md:line-clamp-none">
                  {featuredPost.title}
                </h1>
                {/* Hide excerpt on mobile — too cramped */}
                <p className="hidden md:block text-white/75 font-montserrat text-sm md:text-base line-clamp-2">
                  {featuredPost.excerpt}
                </p>
                {/* Dots */}
                <div className="flex gap-1.5 md:gap-2 mt-2 md:mt-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1 md:h-1.5 rounded-full transition-all ${
                        i === 0 ? 'w-4 md:w-5 bg-white' : 'w-1 md:w-1.5 bg-white/35'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Author meta — hidden on mobile to reduce clutter */}
              <div className="hidden md:flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-classic-green/80 border-2 border-white/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="text-white">
                  <p className="font-montserrat font-semibold text-sm leading-tight">
                    {featuredPost.author.name}
                  </p>
                  <p className="text-white/65 text-xs font-montserrat">
                    {featuredPost.date} &nbsp;·&nbsp; {featuredPost.readTime}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </Link>

        {/* Mobile-only: author strip + read CTA below the hero */}
        <div className="md:hidden flex items-center justify-between mt-3 mb-2 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-classic-green/15 border border-classic-green/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-classic-green" />
            </div>
            <div>
              <p className="font-montserrat font-semibold text-xs text-brand-800 leading-tight">
                {featuredPost.author.name}
              </p>
              <p className="text-gray-400 text-[10px] font-montserrat">
                {featuredPost.date} &nbsp;·&nbsp; {featuredPost.readTime}
              </p>
            </div>
          </div>
          <Link
            href={featuredPost.href}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-800 text-white text-[11px] font-gotham uppercase tracking-wider rounded-full transition-all"
          >
            Read <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* ── BLOG HEADER + CATEGORY FILTERS ────────────────────────────── */}
        <section className="mt-14 mb-8">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-800 mb-2">
            Blog
          </h2>
          <p className="text-brand-500 font-montserrat text-sm md:text-base max-w-2xl mb-8">
            Here, we share diamond insights, styling guides, and stories that inspire your next luxury legacy.
          </p>

          {/* Category pills with real post counts */}
          <div className="flex items-center overflow-x-auto gap-2 md:gap-3 no-scrollbar pb-3 border-b border-gray-200">
            {CATEGORIES.map((cat) => {
              const count = cat === 'All' ? totalAll : (countByCategory[cat] ?? 0);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-montserrat font-medium whitespace-nowrap transition-all border ${
                    activeCategory === cat
                      ? 'bg-brand-800 text-white border-brand-800 shadow-sm'
                      : 'bg-transparent text-gray-500 border-gray-200 hover:text-brand-800 hover:border-gray-400'
                  }`}
                >
                  {cat}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      activeCategory === cat ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Featured post hint — shown when its category is filtered */}
          {activeCategory !== 'All' && featuredMatchesFilter && (
            <p className="mt-3 text-xs font-montserrat text-gray-400">
              ↑ &nbsp;The featured article above is also in&nbsp;
              <span className="font-semibold text-brand-700">{featuredPost.category}</span>.
            </p>
          )}
        </section>

        {/* ── BLOG CARD GRID ─────────────────────────────────────────────── */}
        <section className="mb-16">
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {gridPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="group flex flex-col cursor-pointer"
                >
                  <Link href={post.href} className="flex flex-col h-full">
                    {/* Card Image — 16:9 */}
                    <div className="relative w-full aspect-video rounded-[1.25rem] overflow-hidden mb-5 bg-gray-100">
                      <ResponsiveImage
                        src={post.image}
                        mobileSrc={post.mobileImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Category chip */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="inline-block px-3 py-1 bg-black/45 backdrop-blur-md text-white text-[10px] font-gotham uppercase tracking-wider rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-montserrat mb-3">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="text-base md:text-lg font-montserrat font-bold text-brand-800 leading-[1.3] mb-3 group-hover:text-classic-green transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-500 text-sm font-montserrat leading-relaxed mb-5 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Author row */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-classic-green/15 border border-classic-green/30 flex items-center justify-center shrink-0">
                            <Sparkles className="w-3.5 h-3.5 text-classic-green" />
                          </div>
                          <span className="text-xs font-montserrat font-semibold text-brand-700 line-clamp-1">
                            {post.author.name}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-montserrat font-semibold text-classic-green shrink-0">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}

              {gridPosts.length === 0 && (
                <div className="col-span-3 py-20 text-center">
                  <p className="text-gray-400 font-montserrat text-base">
                    No articles in this category yet.
                  </p>
                  <button
                    onClick={() => setActiveCategory('All')}
                    className="mt-4 px-5 py-2 rounded-full text-sm font-montserrat font-semibold text-white bg-brand-800 hover:bg-brand-900 transition-colors"
                  >
                    Show all articles
                  </button>
                </div>
              )}
            </div>
          </AnimatePresence>

          {/* Pagination — only shown when there are more than 6 articles to show */}
          {gridPosts.length > 6 && (
            <div className="mt-14 flex items-center justify-center gap-1.5">
              <button
                aria-label="Previous page"
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-800 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[1].map((n) => (
                <button
                  key={n}
                  className="w-10 h-10 flex items-center justify-center rounded-full font-montserrat text-sm font-semibold bg-brand-800 text-white shadow-sm"
                >
                  {n}
                </button>
              ))}
              <button
                aria-label="Next page"
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-800 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </section>

        {/* ── PROMOTIONAL FOOTER BLOCKS ──────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10 lg:h-[360px]">
          {/* Left — dark promo card + stat card */}
          <div className="lg:col-span-4 flex flex-col gap-5 h-full">
            {/* Promo card */}
            <div className="bg-[#1A1F25] rounded-[1.5rem] p-8 flex flex-col justify-between items-start text-white relative overflow-hidden flex-1 group">
              <div className="absolute -top-8 -right-8 w-44 h-44 bg-classic-green/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm mb-5">
                <Sparkles className="w-5 h-5 text-bronze-gold" />
              </div>
              <div className="relative z-10 w-full">
                <h3 className="text-xl md:text-2xl font-montserrat font-bold mb-3 leading-[1.25]">
                  Explore the brilliance of lab-grown diamonds
                </h3>
                <p className="text-white/55 text-sm font-montserrat mb-7">
                  Find your perfect certified diamond with us.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-900 font-gotham uppercase tracking-wider text-[11px] font-bold rounded-lg hover:bg-ivory-pearl transition-colors"
                >
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Stats card — uses diamond clarity image (unique, not reused elsewhere) */}
            <div className="bg-[#F0EDE8] rounded-[1.5rem] relative overflow-hidden h-[130px] shrink-0 group">
              <Image
                src="/solitario/blog/Desktop - diamond stone purity.png"
                alt="Solitario Blog Collection"
                fill
                className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute bottom-5 left-6 text-white">
                <span className="block text-[12px] font-montserrat text-white/70 mb-0.5 uppercase tracking-wider">
                  Articles Available
                </span>
                <span className="text-[32px] font-montserrat font-bold leading-none">
                  0{BLOG_POSTS.length}
                </span>
              </div>
            </div>
          </div>

          {/* Right — panoramic image (uses exchange/keep image — distinct from card images) */}
          <div className="lg:col-span-8 rounded-[1.5rem] relative overflow-hidden min-h-[300px] h-full group">
            <Image
              src="/solitario/blog/Desktop - exchange, resale , keep.png"
              alt="Beyond jewelry, creating memories of a lifetime"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 right-8 text-right max-w-xs md:max-w-sm text-white z-10">
              <p className="text-xs font-gotham uppercase tracking-widest text-bronze-gold mb-3">
                The Solitario Promise
              </p>
              <h3 className="text-2xl md:text-[28px] font-montserrat font-bold leading-tight">
                Beyond jewellery, creating memories of a lifetime
              </h3>
              <Link
                href="/lab-grown-diamonds"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-gotham uppercase tracking-wider rounded-full border border-white/30 transition-all"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
