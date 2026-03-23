'use client';

import { notFound } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Clock, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


// ─────────────────────────────────────────────────────────────────────────────
// BLOG CONTENT DATA
// ─────────────────────────────────────────────────────────────────────────────

type BlogSection = {
  type: 'h2' | 'h3' | 'p' | 'quote' | 'tip' | 'table' | 'list' | 'cta';
  content?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  href?: string;
  label?: string;
};

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  image: string;
  mobileImage: string;
  date: string;
  readTime: string;
  category: string;
  author: { name: string; role: string };
  body: BlogSection[];
  relatedPosts: string[];
};

const BLOG_POSTS: Record<string, BlogPost> = {
  'diamond-clarity-guide': {
    id: 'diamond-clarity-guide',
    slug: 'diamond-clarity-guide',
    title: 'What Is Diamond Clarity? A Complete Visual Guide for First-Time Diamond Buyers',
    subtitle: 'Diamond Education Series',
    excerpt:
      'Buying a diamond for the first time is one of the most significant purchases of your life. One of the most misunderstood concepts is diamond clarity. At Solitario, we believe an educated buyer is a confident buyer.',
    image: '/solitario/blog/Desktop - diamond stone purity.png',
    mobileImage: '/solitario/blog/Mobile - diamond stone purity.png',
    date: 'March 2025',
    readTime: '7 min read',
    category: 'Education',
    author: { name: 'Solitario Diamond Specialists', role: 'Diamond Education Series' },
    relatedPosts: ['lab-grown-diamonds-last-forever', '14k-vs-18k-gold-diamond-jewellery'],
    body: [
      { type: 'p', content: 'Buying a diamond for the first time is one of the most significant purchases of your life — a symbol of love, milestone, or personal triumph. But between the terminology, the sparkle, and the price tags, it can feel overwhelming. One of the most misunderstood concepts in diamond buying is diamond clarity.' },
      { type: 'quote', content: '"Clarity is not just about perfection — it\'s about understanding what you\'re looking at, and choosing the diamond that gives you maximum brilliance within your budget." — Solitario Diamond Specialists' },
      { type: 'h2', content: 'What Is Diamond Clarity? The Basics Explained' },
      { type: 'p', content: 'Diamond clarity refers to the presence or absence of internal characteristics (called inclusions) and surface characteristics (called blemishes) within a diamond. These tiny imperfections are formed deep within the earth during the diamond\'s natural creation process — or, in the case of lab-grown diamonds, during the controlled growth process. In simple terms: the fewer the inclusions, the higher the clarity grade, and the more brilliant and valuable the diamond.' },
      { type: 'h2', content: 'Why Does Diamond Clarity Matter?' },
      { type: 'p', content: 'Clarity directly impacts the diamond\'s brilliance and overall visual appeal. A diamond with fewer inclusions allows more light to pass through and refract, creating that breathtaking sparkle we all love. However, the impact of clarity on appearance varies significantly across grades — and that\'s where smart buying decisions are made.' },
      { type: 'h2', content: 'The Diamond Clarity Chart: A Complete Grade-by-Grade Breakdown' },
      { type: 'p', content: 'The globally recognised diamond clarity scale was established by the Gemological Institute of America (GIA) and is used universally — including for certified lab-grown diamonds. The scale has 11 grades across 6 categories, ranging from Flawless to Included.' },
      {
        type: 'table',
        headers: ['Grade', 'Name', 'What It Means'],
        rows: [
          ['FL', 'Flawless', 'No inclusions or blemishes visible under 10x magnification. Extremely rare and prized.'],
          ['IF', 'Internally Flawless', 'No internal inclusions; only minor surface blemishes under 10x magnification.'],
          ['VVS1', 'Very Very Slightly Included 1', 'Inclusions are so minute they are extremely difficult even for a skilled grader to see under 10x.'],
          ['VVS2', 'Very Very Slightly Included 2', 'Slightly more inclusions than VVS1, still virtually impossible to detect with the naked eye.'],
          ['VS1', 'Very Slightly Included 1', 'Minor inclusions visible under 10x magnification but not to the naked eye. Excellent value grade.'],
          ['VS2', 'Very Slightly Included 2', 'Slightly more inclusions than VS1; still eye-clean in most cases. Most popular choice.'],
          ['SI1', 'Slightly Included 1', 'Inclusions are noticeable under 10x magnification and may be visible to the naked eye depending on placement.'],
          ['SI2', 'Slightly Included 2', 'Inclusions visible to the naked eye in some diamonds; inspect carefully before purchasing.'],
          ['I1', 'Included 1', 'Inclusions visible to the naked eye and may affect brilliance. Significant budget option.'],
          ['I2', 'Included 2', 'Obvious inclusions that impact transparency and brilliance noticeably.'],
          ['I3', 'Included 3', 'Severe inclusions that significantly diminish brilliance and transparency. Not recommended for fine jewellery.'],
        ],
      },
      { type: 'h2', content: 'Visual Clarity Chart Explanation: What Each Grade Actually Looks Like' },
      { type: 'h3', content: 'FL and IF — The Pinnacle of Purity' },
      { type: 'p', content: 'Imagine looking through a perfectly clean glass window on a clear day — that is what an FL or IF diamond looks like, even under 10x magnification. These are extraordinarily rare, accounting for less than 1% of all gem-quality diamonds, and are typically reserved for investment pieces or ultra-luxury jewellery.' },
      { type: 'h3', content: 'VS1 and VS2 — The Sweet Spot for Luxury Buyers' },
      { type: 'p', content: 'VS clarity diamonds contain minor inclusions that require 10x magnification to see clearly. To the naked eye: eye-clean in virtually all cases. VS1 and VS2 represent the ideal balance of quality and value, which is why Solitario\'s curated collection emphasises diamonds in this range and above.' },
      { type: 'h2', content: 'Diamond Clarity in Lab-Grown Diamonds' },
      { type: 'p', content: 'Lab-grown diamonds are graded using the exact same clarity scale as mined diamonds — FL to I3. Because lab-grown diamonds are created in controlled environments, it is significantly easier to produce high-clarity stones. At Solitario, our lab-grown diamonds are curated to meet stringent clarity standards, specialising in VS and above clarity grades.' },
      { type: 'h2', content: 'Common Myths About Diamond Clarity — Debunked' },
      { type: 'list', items: [
        'Myth 1: "You Always Need a Flawless Diamond" — Reality: FL and IF diamonds look identical to a VS1 to the naked eye. For wearable jewellery, a VS1 or VS2 offers the same visual beauty at a fraction of the cost.',
        'Myth 2: "Higher Clarity Always Means More Sparkle" — Reality: Sparkle is primarily determined by a diamond\'s cut quality, not its clarity. A perfectly cut VS2 will outshine a poorly cut VVS1 every time.',
        'Myth 3: "Lab-Grown Diamonds Have Lower Clarity" — Reality: Lab-grown diamonds can and do achieve FL clarity grades.',
        'Myth 4: "A Diamond with Inclusions Is Defective" — Reality: Inclusions are natural — they are the diamond\'s fingerprint. What matters is whether the inclusion impacts brilliance or durability.',
      ]},
      { type: 'tip', content: 'Pro Tip from Solitario: Always request the full grading certificate (GIA, IGI, or equivalent) with your diamond purchase. The clarity plot on the certificate shows exactly where inclusions are located — this is your window into the diamond\'s character.' },
      { type: 'h2', content: 'Conclusion: Clarity Is the Confidence Behind Every Diamond' },
      { type: 'p', content: 'Diamond clarity is more than a grading system — it is a window into a diamond\'s soul. Understanding clarity empowers you to make confident, informed choices that align with your values, your budget, and your vision of beauty. For first-time diamond buyers in India, the most important takeaway is this: you do not need a Flawless diamond to own a stunning piece of jewellery. A well-chosen VS1 or VS2 lab-grown diamond from Solitario will captivate every room you walk into, carry your story with elegance, and retain its brilliance for a lifetime.' },
      { type: 'cta', content: 'Ready to find your perfect diamond? Explore Solitario\'s curated collection of high-clarity lab-grown diamond jewellery.', href: '/lab-grown-diamonds', label: 'Explore Collection' },
    ],
  },

  'lab-grown-diamonds-last-forever': {
    id: 'lab-grown-diamonds-last-forever',
    slug: 'lab-grown-diamonds-last-forever',
    title: 'Do Lab-Grown Diamonds Last Forever? What Happens After 10 Years.',
    subtitle: 'A science-backed guide for millennial and Gen Z diamond buyers in India',
    excerpt: '"But will it last? Will it still look the same in 10 years?" The answer, backed by science: lab-grown diamonds are built to last a lifetime — and beyond.',
    image: '/solitario/blog/Desktop - solitario_lab_grown_diamonds.png',
    mobileImage: '/solitario/blog/Mobile - solitario_lab_grown_diamonds.png',
    date: 'February 2025',
    readTime: '6 min read',
    category: 'Education',
    author: { name: 'Solitario Diamond Specialists', role: 'Diamond Education Series' },
    relatedPosts: ['diamond-clarity-guide', 'lifetime-diamond-exchange-policy'],
    body: [
      { type: 'p', content: 'There is a question that comes up in almost every conversation about lab-grown diamonds, whispered in DMs, typed into search bars at midnight before a big purchase decision: "But will it last? Will it still look the same in 10 years?" It is a completely valid question. The answer, backed by science and not just marketing: lab-grown diamonds are built to last a lifetime — and beyond.' },
      { type: 'h2', content: 'What Are Lab-Grown Diamonds, Really?' },
      { type: 'p', content: 'A lab-grown diamond is not a diamond simulant. It is not cubic zirconia. It is not moissanite. A lab-grown diamond is a real diamond. Chemically, physically, and optically — it is identical to a mined diamond. Both are composed of pure carbon atoms arranged in a cubic crystal lattice structure, which gives diamonds their legendary hardness and light-refracting brilliance. The only difference is origin.' },
      { type: 'quote', content: '"Same carbon. Same crystal structure. Same diamond."' },
      { type: 'h2', content: 'The Science of Durability: Where Do Lab-Grown Diamonds Stand?' },
      { type: 'h3', content: 'Hardness: The Mohs Scale' },
      {
        type: 'table',
        headers: ['Material', 'Mohs Score', 'Scratch Resistance'],
        rows: [
          ['Lab-Grown Diamond', '10 / 10', 'Maximum — nearly unscratchable'],
          ['Mined Diamond', '10 / 10', 'Maximum — nearly unscratchable'],
          ['Moissanite', '9.25 / 10', 'Excellent but slightly softer'],
          ['Sapphire / Ruby', '9 / 10', 'Very good'],
          ['Cubic Zirconia', '8 – 8.5 / 10', 'Good, but chips over time'],
          ['Glass', '5.5 / 10', 'Poor — scratches easily'],
        ],
      },
      { type: 'h2', content: 'What Actually Happens to a Lab-Grown Diamond After 10 Years?' },
      { type: 'list', items: [
        'The crystal structure remains completely unchanged — no degradation, no softening, no internal shifts.',
        'Surface brilliance is preserved, provided the diamond receives routine cleaning (warm water, mild soap, soft brush — once a month).',
        'No fading. No colour change. No cloudiness from within the stone itself.',
        'The diamond\'s refractive index — the property that creates its fire and sparkle — is permanent and will not diminish over time.',
      ]},
      { type: 'h2', content: 'The Myth of "Clouding"' },
      { type: 'p', content: 'Can a lab-grown diamond cloud over? No — not in the way many buyers fear. A real diamond cannot become internally cloudy over time. What buyers sometimes notice is surface build-up: a thin film of oil, soap residue, lotion, or skin cells that dulls the appearance temporarily. A simple cleaning restores full brilliance instantly. This is not the diamond changing — it is just the diamond being worn.' },
      { type: 'h2', content: 'Lab-Grown vs Mined Diamonds: A Durability Comparison' },
      {
        type: 'table',
        headers: ['Property', 'Lab-Grown Diamond', 'Mined Diamond'],
        rows: [
          ['Chemical Composition', '100% Carbon (C)', '100% Carbon (C)'],
          ['Crystal Structure', 'Cubic lattice', 'Cubic lattice'],
          ['Mohs Hardness', '10 / 10', '10 / 10'],
          ['Refractive Index', '2.417 – 2.419', '2.417 – 2.419'],
          ['Fades Over Time?', 'No', 'No'],
          ['Clouds Over Time?', 'No', 'No'],
          ['Needs Cleaning?', 'Yes (routine)', 'Yes (routine)'],
        ],
      },
      { type: 'tip', content: 'At Solitario, the majority of our collection features VS clarity and above with Excellent or Very Good cut grades — because we believe the quality of your diamond should match the significance of the moment it marks.' },
      { type: 'h2', content: 'How to Keep Your Lab-Grown Diamond Looking Flawless for Decades' },
      { type: 'list', items: [
        'Clean monthly with warm water, a drop of mild dish soap, and a soft toothbrush. Rinse and pat dry.',
        'Remove jewellery before applying lotions, sunscreen, perfume, or hairspray.',
        'Store pieces individually in soft pouches or lined boxes to prevent scratching.',
        'Visit a professional jeweller once a year for a setting inspection and professional clean.',
        'Avoid wearing your ring during heavy manual work, gym sessions, or activities involving significant impact.',
      ]},
      { type: 'h2', content: 'The Verdict: Built to Last, Designed to Shine' },
      { type: 'p', content: 'Lab-grown diamonds do not just last — they endure. Through anniversaries, monsoons, decades of daily wear, and the inevitable adventures of a full life, the diamond you choose today will remain exactly as it is: brilliant, hard, and beautiful.' },
      { type: 'cta', content: 'Ready to choose your forever diamond? Explore Solitario\'s certified lab-grown diamond jewellery collection.', href: '/lab-grown-diamonds', label: 'Explore Collection' },
    ],
  },

  '14k-vs-18k-gold-diamond-jewellery': {
    id: '14k-vs-18k-gold-diamond-jewellery',
    slug: '14k-vs-18k-gold-diamond-jewellery',
    title: '14K vs 18K Gold: Which Is Better for Diamond Jewellery?',
    subtitle: 'The definitive guide for luxury-conscious Indian jewellery buyers',
    excerpt: 'The gold that holds your diamond is not merely structural — it is visual, emotional, and deeply consequential to how your jewellery looks, feels, and endures over a lifetime.',
    image: '/solitario/blog/Desktop - 14 k 18 k.png',
    mobileImage: '/solitario/blog/Mobile - 14 k 18 k.png',
    date: 'January 2025',
    readTime: '8 min read',
    category: 'Guides',
    author: { name: 'Solitario Diamond Specialists', role: 'The Gold Standard Guide' },
    relatedPosts: ['diamond-clarity-guide', 'diamond-earrings-face-shape-guide'],
    body: [
      { type: 'p', content: 'Every great diamond deserves an equally great setting. Yet for most buyers, the choice of gold purity is often an afterthought, buried beneath decisions about carat weight and cut quality. At Solitario, we craft our diamond jewellery exclusively in 18K gold and 18K gold vermeil — and by the end of this guide, you will understand precisely why.' },
      { type: 'h2', content: 'Understanding Gold Purity: What Do the Karats Actually Mean?' },
      {
        type: 'table',
        headers: ['Gold Purity', 'Gold Content', 'Alloy Content', 'Common Use'],
        rows: [
          ['24K Gold', '99.9% pure', '0.1% other metals', 'Investment bars, not jewellery'],
          ['22K Gold', '91.7% pure', '8.3% other metals', 'Traditional Indian jewellery'],
          ['18K Gold', '75.0% pure', '25% other metals', 'Fine & luxury jewellery'],
          ['14K Gold', '58.3% pure', '41.7% other metals', 'Commercial & fashion jewellery'],
          ['10K Gold', '41.7% pure', '58.3% other metals', 'Budget & mass-market pieces'],
        ],
      },
      { type: 'h2', content: '14K vs 18K Gold: A Detailed Comparison' },
      {
        type: 'table',
        headers: ['Property', '14K Gold (58.3% pure)', '18K Gold (75% pure)'],
        rows: [
          ['Colour Richness', 'Lighter, slightly muted tone', 'Deep, warm, saturated colour'],
          ['Durability', 'High — harder due to more alloy', 'Very high — excellent for daily wear'],
          ['Skin Sensitivity', 'May cause reactions in sensitive skin', 'Hypoallergenic in most wearers'],
          ['Tarnish Resistance', 'Moderate — alloys can oxidise', 'Excellent — more gold, less oxidisation'],
          ['Diamond Brilliance', 'Adequate setting', 'Enhances diamond fire and warmth'],
          ['Prestige Perception', 'Standard commercial grade', 'International luxury standard'],
          ['Hallmark Standard', '585 hallmark', '750 hallmark'],
          ['Best Suited For', 'Fashion jewellery, everyday basics', 'Diamond jewellery, heirloom pieces'],
        ],
      },
      { type: 'quote', content: 'At the international luxury level — from Paris to Mumbai — 18K gold (stamped 750) is the universal standard for fine diamond jewellery. It is the sweet spot where beauty, durability, and wearability converge.' },
      { type: 'h2', content: 'Colour Richness and Diamond Brilliance: Why 18K Gold Wins' },
      { type: 'p', content: 'Place a 14K gold ring next to an 18K gold ring of the same design, in the same lighting. The 18K piece will display a visibly richer, deeper, more saturated colour. This is not a subtle difference. It is the difference between gold that looks golden and gold that looks luxurious.' },
      { type: 'list', items: [
        'Yellow 18K gold warms the environment around a diamond, making lower colour-grade stones appear whiter and more vivid by contrast.',
        'White 18K gold creates a neutral, mirror-like backdrop that maximises the visual impact of a colourless or near-colourless diamond.',
        'Rose 18K gold adds a romantic, feminine warmth that creates a sophisticated interplay of pink-gold tones with diamond fire.',
      ]},
      { type: 'h2', content: '18K Gold Vermeil: The Intelligent Luxury Choice' },
      {
        type: 'table',
        headers: ['', 'Gold Vermeil', 'Gold Plated', 'Solid Gold'],
        rows: [
          ['Base Material', 'Sterling Silver (925)', 'Brass or base metal', 'Pure gold alloy'],
          ['Gold Thickness', '≥ 2.5 microns', '0.5 microns or less', 'Entire piece'],
          ['Gold Purity', '18K at Solitario', 'Varies, often 10K', '14K or 18K'],
          ['Durability', 'Excellent', 'Poor — fades quickly', 'Excellent'],
          ['Skin Safety', 'Hypoallergenic', 'Often causes reactions', 'Varies by alloy'],
          ['Price Position', 'Accessible luxury', 'Budget', 'Premium to ultra-premium'],
          ['Best For', 'Daily luxury wear', 'Occasional fashion', 'Heirloom investment'],
        ],
      },
      { type: 'tip', content: 'Every Solitario vermeil piece uses a gold layer of 3+ microns — exceeding the industry standard — applied through precision electroforming that ensures longevity and colour consistency across the entire piece.' },
      { type: 'h2', content: 'The Verdict: 18K Gold Is the Gold Standard for Diamond Jewellery' },
      { type: 'p', content: 'For jewellery that matters — engagement rings, anniversary gifts, birthday milestones, personal expressions of identity and achievement — 18K gold is not a preference. It is the right answer. It delivers richer colour, superior skin compatibility, excellent durability, and the international prestige standard that fine diamonds deserve.' },
      { type: 'cta', content: 'Discover jewellery that honours both the diamond and the moment. Explore Solitario\'s 18K gold and 18K gold vermeil diamond jewellery.', href: '/products', label: 'Shop Solitario' },
    ],
  },

  'diamond-earrings-face-shape-guide': {
    id: 'diamond-earrings-face-shape-guide',
    slug: 'diamond-earrings-face-shape-guide',
    title: 'How to Choose Diamond Earrings for Your Face Shape: The Ultimate Style Guide',
    subtitle: 'Your complete guide to finding the perfect pair — every time',
    excerpt: 'Buying diamond earrings without considering your face shape is like choosing an outfit without a mirror. The right pair does not just accessorise — it sculpts, balances, and flatters.',
    image: '/solitario/blog/Desktop - Face shapes and earrings.png',
    mobileImage: '/solitario/blog/Mobile - Face shapes and earrings.png',
    date: 'December 2024',
    readTime: '6 min read',
    category: 'Guides',
    author: { name: 'Solitario Style Team', role: 'The Style Edit' },
    relatedPosts: ['14k-vs-18k-gold-diamond-jewellery', 'diamond-clarity-guide'],
    body: [
      { type: 'p', content: 'Diamond earrings are the piece you reach for every morning, the detail that frames your face in every photograph, and the quiet luxury that says everything without saying a word. But buying diamond earrings without considering your face shape is like choosing an outfit without a mirror. The right pair does not just accessorise — it sculpts, balances, and flatters.' },
      { type: 'h2', content: 'Step One: How to Identify Your Face Shape' },
      { type: 'p', content: 'Before you shop, take two minutes to identify your face shape. Pull your hair back, stand in front of a mirror, and observe: forehead width, jaw shape, face length, and cheekbones. The five most common face shapes are: Round, Oval, Heart, Square, and Long (Oblong).' },
      { type: 'quote', content: 'Style truth: The goal of earrings is not to "fix" your face shape — it is to frame it. Every face shape has a perfect pair of diamond earrings. This guide helps you find yours.' },
      { type: 'h2', content: 'Diamond Earrings by Face Shape: Your Complete Style Guide' },
      { type: 'h3', content: '1. Round Face Shape' },
      {
        type: 'table',
        headers: ['', 'Details'],
        rows: [
          ['Best Styles', 'Long drops, chandelier earrings, angular studs, vertical dangles, teardrop shapes'],
          ['Why They Work', 'Vertical lines and angular shapes elongate the face and create the illusion of a slimmer silhouette'],
          ['Avoid', 'Round studs, hoop earrings, circular designs that mirror the face\'s natural shape'],
          ['Ideal Stone', 'Marquise, pear, or oval-cut diamonds in drop or dangle settings'],
          ['Solitario Pick', 'Lab-grown diamond drop earrings with pear-shaped stone in 18K yellow gold'],
        ],
      },
      { type: 'h3', content: '2. Oval Face Shape' },
      {
        type: 'table',
        headers: ['', 'Details'],
        rows: [
          ['Best Styles', 'Virtually all earring styles work — studs, drops, hoops, chandeliers, teardrops'],
          ['Why They Work', 'Balanced proportions mean no corrective styling is needed — personal preference reigns'],
          ['Avoid', 'Earrings so long they add excessive length to an already-long face'],
          ['Ideal Stone', 'Round brilliant, oval, or cushion-cut diamonds — any premium cut shines here'],
          ['Solitario Pick', 'Classic round-brilliant solitaire studs or statement chandelier drops in 18K gold'],
        ],
      },
      { type: 'h3', content: '3. Heart Face Shape' },
      {
        type: 'table',
        headers: ['', 'Details'],
        rows: [
          ['Best Styles', 'Bottom-heavy drops, chandelier earrings, cluster earrings, triangular shapes wide at the base'],
          ['Why They Work', 'Weight at the bottom of the earring draws the eye downward and adds visual width to the narrow chin'],
          ['Avoid', 'Studs placed at the widest part of the face, top-heavy designs, broad hoop earrings'],
          ['Ideal Stone', 'Pear-cut diamonds (inverted), round brilliants in drop settings, cluster designs'],
          ['Solitario Pick', 'Lab-grown diamond chandelier earrings with cascading round brilliants in rose gold'],
        ],
      },
      { type: 'h3', content: '4. Square Face Shape' },
      {
        type: 'table',
        headers: ['', 'Details'],
        rows: [
          ['Best Styles', 'Long drops with curves, hoops, oval shapes, teardrop earrings, rounded cluster designs'],
          ['Why They Work', 'Soft curves and circular shapes contrast with and soften the angular jawline beautifully'],
          ['Avoid', 'Geometric, angular, or square-shaped earrings that echo and emphasise the jaw\'s squareness'],
          ['Ideal Stone', 'Round brilliant or oval-cut diamonds in hoop, drop, or curved cluster settings'],
          ['Solitario Pick', 'Oval hoop earrings with pavé-set lab-grown diamonds in 18K white gold'],
        ],
      },
      { type: 'h3', content: '5. Long (Oblong) Face Shape' },
      {
        type: 'table',
        headers: ['', 'Details'],
        rows: [
          ['Best Styles', 'Wide studs, cluster earrings, broad hoops, button earrings, wide chandelier designs'],
          ['Why They Work', 'Horizontal width at ear level creates the visual illusion of a wider, more balanced face'],
          ['Avoid', 'Long, vertical drop earrings that add further length and narrow the face'],
          ['Ideal Stone', 'Cushion-cut, emerald-cut, or princess-cut diamonds in wide stud or cluster settings'],
          ['Solitario Pick', 'Large cushion-cut diamond solitaire studs or wide cluster earrings in 18K gold'],
        ],
      },
      { type: 'h2', content: 'Diamond Earrings for Every Occasion' },
      { type: 'h3', content: 'Everyday Luxury: The Office and Beyond' },
      { type: 'p', content: 'For daily wear, diamond studs are the universal answer — timeless, appropriate, and endlessly wearable. Solitario\'s round brilliant solitaire studs in 18K white gold are designed for exactly this: the pair you put on Monday morning and forget to take off because they look that right.' },
      { type: 'h3', content: 'Weddings and Festive Occasions' },
      { type: 'p', content: 'Indian weddings are among the world\'s most visually spectacular occasions — and your earrings should rise to the moment. For grand, celebratory occasions, choose earrings with movement, layering, and maximum brilliance — chandelier earrings with cascading lab-grown diamonds for lehenga and heavy silk saree occasions.' },
      { type: 'h2', content: 'Why Choose Lab-Grown Diamond Earrings from Solitario?' },
      { type: 'list', items: [
        '100% real diamonds — not simulants, not cubic zirconia',
        '18K gold settings in yellow, white, and rose gold',
        'VS clarity and above — eye-clean diamonds for maximum brilliance',
        'International certifications with every purchase',
        '40–60% more accessible than mined diamond equivalents of the same quality',
      ]},
      { type: 'cta', content: 'Find your perfect pair at Solitario. Lab-grown diamond earrings in 18K gold — crafted for the way you live, designed for the way you shine.', href: '/products', label: 'Shop Earrings' },
    ],
  },

  'lifetime-diamond-exchange-policy': {
    id: 'lifetime-diamond-exchange-policy',
    slug: 'lifetime-diamond-exchange-policy',
    title: "What Is a Lifetime Diamond Exchange Policy? Why Solitario's Guarantee Stands Apart.",
    subtitle: 'A buyer\'s guide to understanding diamond exchange policies, and what real commitment looks like.',
    excerpt: 'When you invest in a diamond, you are placing your trust — financial, emotional, and relational — in a brand. And trust, like a diamond, should be built to last.',
    image: '/solitario/blog/Desktop - exchange, resale , keep.png',
    mobileImage: '/solitario/blog/Mobile - exchange, resale , keep.png',
    date: 'November 2024',
    readTime: '7 min read',
    category: 'Lifestyle',
    author: { name: 'The Solitario Promise', role: 'Brand Commitment Series' },
    relatedPosts: ['lab-grown-diamonds-last-forever', 'diamond-clarity-guide'],
    body: [
      { type: 'p', content: 'When you invest in a diamond, you are not just buying a stone. You are placing your trust, financial, emotional, and relational in a brand. And trust, like a diamond, should be built to last. Yet for years, the fine jewellery industry has operated on policies that quietly favour the house over the buyer. The lifetime diamond exchange policy is a different kind of promise — one built around the buyer\'s long-term interests.' },
      { type: 'h2', content: 'What Is a Lifetime Diamond Exchange Policy?' },
      { type: 'p', content: 'A lifetime diamond exchange policy is a commitment from a jewellery brand that allows a customer to return a diamond purchased from them, at any point in the future and exchange it for another diamond or piece of jewellery, typically at the original purchase value or at current market value. In practical terms, it means the diamond you buy today does not become a locked, illiquid asset the moment you walk out of the store.' },
      { type: 'quote', content: 'A lifetime exchange policy transforms a diamond purchase from a transaction into a relationship. It is the brand\'s way of saying: we stand behind this diamond not just today, but for every year of your life.' },
      { type: 'h2', content: 'What to Watch Out For in Standard Industry Policies' },
      { type: 'list', items: [
        'Short return windows disguised as "exchange" policies (30–90 days)',
        'Exchange value set at a fraction of purchase price, often 50–70% of original',
        'No exchange permitted if the piece has been worn, resized, or engraved',
        'Mandatory certificate requirements with no assistance if documents are lost',
        'Hidden depreciation clauses applied at the brand\'s discretion',
      ]},
      { type: 'h2', content: 'Standard Industry Policies vs Solitario\'s Lifetime Exchange: A Direct Comparison' },
      {
        type: 'table',
        headers: ['Policy Feature', 'Standard Industry', 'Solitario Guarantee'],
        rows: [
          ['Exchange Duration', '30–90 days (most brands)', '✔ Genuine lifetime, no expiry date'],
          ['Exchange Value', '50–80% of original price', '✔ 100% of original invoice value'],
          ['Condition Requirements', 'Unworn only; original packaging', '✔ Normal wear accepted; no penalty'],
          ['Certificate Required', 'Mandatory, loss voids policy', '✔ Certificate support provided'],
          ['Design Flexibility', 'Exchange within same collection', '✔ Exchange across entire Solitario range'],
          ['Upgrade Pathways', 'Rarely offered; by negotiation', '✔ Structured upgrade programme available'],
          ['Transparency', 'Terms vary; fine print applies', '✔ Clear, written, no-ambiguity policy'],
          ['Lab-Grown Diamonds', 'Often excluded from exchange', '✔ All lab-grown diamonds fully covered'],
        ],
      },
      { type: 'h2', content: 'The Three Pillars of Solitario\'s Exchange Guarantee' },
      { type: 'h3', content: 'Pillar 1: Transparency — No Hidden Terms, No Fine Print Surprises' },
      { type: 'p', content: 'Solitario publishes its complete exchange policy upfront, in plain language, without the hedging and qualifications that characterise industry-standard policies. Every Solitario customer receives a complete written summary of their exchange entitlement at the point of purchase.' },
      { type: 'h3', content: 'Pillar 2: Flexibility — For Every Chapter of Your Life' },
      { type: 'p', content: 'Our exchange programme is not a return window — it is a living relationship between you and your diamond. Exchange across Solitario\'s full jewellery range, upgrade pathways with credit toward higher carat weights or clarity grades, and setting changes to reset your diamond in a new design without losing value.' },
      { type: 'h3', content: 'Pillar 3: Long-Term Value — A Diamond That Works for You' },
      { type: 'p', content: 'When you buy a diamond with a genuine lifetime exchange guarantee, you are not simply purchasing a piece of jewellery. You are purchasing a diamond with a defined, guaranteed future value pathway. This is particularly relevant in the Indian market, where jewellery purchases have historically carried both emotional and financial weight.' },
      { type: 'h2', content: 'How Solitario\'s Lifetime Exchange Process Works' },
      { type: 'list', items: [
        'Step 1: Initiate Your Exchange — Contact Solitario\'s exchange team online, by phone, or in our experience centre.',
        'Step 2: Diamond Evaluation — Your diamond is evaluated by our in-house gemologists and exchange credit is confirmed.',
        'Step 3: Choose Your New Piece — Browse Solitario\'s full collection with your exchange credit applied.',
        'Step 4: Complete the Exchange — Exchange is processed with full documentation. If your new piece is of greater value, you pay only the difference.',
      ]},
      { type: 'tip', content: 'Trust is the rarest luxury of all — rarer, even, than the diamonds we sell. Solitario\'s lifetime exchange policy exists because we believe that when you buy a diamond from us, you deserve to feel as certain about that decision in ten years as you do today.' },
      { type: 'cta', content: 'Buy with complete confidence. Explore Solitario\'s certified lab-grown diamond collection — every piece backed by our lifetime exchange guarantee.', href: '/lab-grown-diamonds', label: 'Explore Collection' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RENDER HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function renderSection(section: BlogSection, idx: number) {
  switch (section.type) {
    case 'h2':
      return (
        <h2 key={idx} className="text-2xl md:text-3xl font-montserrat font-bold text-brand-900 mt-12 mb-4 leading-tight">
          {section.content}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={idx} className="text-lg md:text-xl font-montserrat font-bold text-brand-800 mt-8 mb-3 leading-snug">
          {section.content}
        </h3>
      );
    case 'p':
      return (
        <p key={idx} className="font-montserrat text-gray-600 leading-[1.85] mb-5 text-[15px] md:text-base">
          {section.content}
        </p>
      );
    case 'quote':
      return (
        <blockquote key={idx} className="my-8 pl-6 border-l-4 border-classic-green">
          <p className="font-montserrat text-brand-800 text-lg font-semibold leading-[1.6] italic">
            {section.content}
          </p>
        </blockquote>
      );
    case 'tip':
      return (
        <div key={idx} className="my-8 p-6 bg-classic-green/5 border border-classic-green/20 rounded-2xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-classic-green shrink-0 mt-0.5" />
            <p className="font-montserrat text-gray-700 text-sm leading-relaxed">{section.content}</p>
          </div>
        </div>
      );
    case 'list':
      return (
        <ul key={idx} className="my-5 space-y-3">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] md:text-base font-montserrat text-gray-600 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-classic-green shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div key={idx} className="my-8 overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm font-montserrat">
            <thead>
              <tr className="bg-brand-900 text-white">
                {section.headers?.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold text-xs tracking-wider uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows?.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-gray-700 border-t border-gray-100">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'cta':
      return (
        <div key={idx} className="my-12 p-8 bg-brand-900 rounded-3xl text-center">
          <p className="font-montserrat text-white/80 text-base mb-5 leading-relaxed">{section.content}</p>
          <Link
            href={section.href!}
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-brand-900 font-gotham font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-ivory-pearl transition-colors"
          >
            {section.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      );
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = BLOG_POSTS[slug];

  if (!post) notFound();

  const relatedPosts = post.relatedPosts
    .map((s) => BLOG_POSTS[s])
    .filter(Boolean)
    .slice(0, 2);

  // Responsive image: only load the image that matches the current viewport
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const heroSrc = mounted ? (isMobile ? post.mobileImage : post.image) : post.image;


  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Navbar spacer */}
      <div className="h-20 md:h-[100px] w-full" />

      {/* ── HERO IMAGE ────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full aspect-video rounded-[2rem] overflow-hidden mb-10 bg-gray-100"
        >
          {/* Single image — correct src chosen per viewport via useEffect */}
          <Image src={heroSrc} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category */}
          <div className="absolute top-6 left-6">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[11px] font-gotham uppercase tracking-wider rounded-full border border-white/30">
              {post.category}
            </span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 w-full px-6 pb-10 md:px-12 md:pb-12">
            <h1 className="text-2xl md:text-4xl lg:text-[2.6rem] font-montserrat font-bold text-white leading-tight max-w-3xl">
              {post.title}
            </h1>
          </div>
        </motion.div>

        {/* Layout: Article + Sidebar */}
        <div className="flex gap-12 lg:gap-16">
          {/* ── MAIN ARTICLE ─────────────────────────────────────────── */}
          <article className="flex-1 min-w-0">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-montserrat text-gray-500 hover:text-classic-green transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            {/* Author + meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-classic-green/15 border border-classic-green/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-classic-green" />
                </div>
                <div>
                  <p className="font-montserrat font-bold text-brand-800 text-sm leading-tight">{post.author.name}</p>
                  <p className="font-montserrat text-xs text-gray-400">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto text-xs font-montserrat text-gray-400">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" /> {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime}
                </span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-base md:text-lg font-montserrat text-brand-700 font-semibold leading-[1.7] mb-8 border-l-[3px] border-bronze-gold pl-5">
              {post.excerpt}
            </p>

            {/* Body */}
            <div>
              {post.body.map((section, idx) => renderSection(section, idx))}
            </div>

            {/* ── MOBILE: More Like This (sidebar is desktop-only) ───── */}
            {relatedPosts.length > 0 && (
              <div className="lg:hidden mt-14 pt-10 border-t border-gray-100">
                <h4 className="font-montserrat font-bold text-brand-800 text-sm mb-6 uppercase tracking-wider">
                  More Like This
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedPosts.map((related) => (
                    <Link
                      href={`/blog/${related.slug}`}
                      key={related.id}
                      className="group flex gap-4 items-start p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-gotham uppercase tracking-wider text-classic-green">
                          {related.category}
                        </span>
                        <p className="font-montserrat text-sm font-bold text-brand-800 leading-snug group-hover:text-classic-green transition-colors line-clamp-2 mt-1">
                          {related.title}
                        </p>
                        <p className="text-[10px] font-montserrat text-gray-400 mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {related.readTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ── SIDEBAR ──────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-6 w-72 shrink-0">
            {/* About Solitario */}
            <div className="sticky top-[120px] flex flex-col gap-6">
              <div className="bg-brand-900 rounded-2xl p-6 text-white">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-4 h-4 text-bronze-gold" />
                </div>
                <h4 className="font-montserrat font-bold text-base mb-2">About Solitario</h4>
                <p className="font-montserrat text-white/65 text-xs leading-relaxed mb-5">
                  India&apos;s premier destination for luxury lab-grown diamond jewellery. Every piece is certified, ethically sourced, and crafted to perfection.
                </p>
                <Link
                  href="/products"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-brand-900 font-gotham text-[11px] uppercase tracking-wider rounded-lg font-bold hover:bg-ivory-pearl transition-colors"
                >
                  Shop Collection <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div>
                  <h4 className="font-montserrat font-bold text-brand-800 text-sm mb-4 uppercase tracking-wider">Related Articles</h4>
                  <div className="flex flex-col gap-4">
                    {relatedPosts.map((related) => (
                      <Link href={`/blog/${related.slug}`} key={related.id} className="group flex gap-3 items-start">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image src={related.image} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-montserrat text-xs font-bold text-brand-800 leading-snug group-hover:text-classic-green transition-colors line-clamp-2">
                            {related.title}
                          </p>
                          <p className="text-[10px] font-montserrat text-gray-400 mt-1">{related.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
