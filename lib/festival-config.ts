/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║              FESTIVAL COLLECTION CONFIG                        ║
 * ║                                                                ║
 * ║  To add a new festival:                                        ║
 * ║  1. Create the collection in Shopify with a handle             ║
 * ║     (e.g., "akshaya-tritiya-2026")                             ║
 * ║  2. Tag products to that collection in Shopify                 ║
 * ║  3. Add a new entry below with the collection handle           ║
 * ║  4. Set `active: true` and update dates                        ║
 * ║                                                                ║
 * ║  To disable: set `active: false` or remove the entry           ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

export interface FestivalConfig {
  /** Unique ID for this festival */
  id: string;
  /** Whether this festival section is currently active */
  active: boolean;
  /** Shopify collection handle (must match exactly) */
  collectionHandle: string;
  /** Small label above the heading */
  tagline: string;
  /** Main heading */
  heading: string;
  /** Subtext below heading */
  subtitle: string;
  /** CTA button text */
  ctaText: string;
  /** CTA button link */
  ctaLink: string;
  /** Festival emoji for badge flair */
  emoji?: string;
  /** Max products to show on homepage (default: 4) */
  maxProducts?: number;
  /** Optional: auto-activate on this date (ISO string) */
  startDate?: string;
  /** Optional: auto-deactivate after this date (ISO string) */
  endDate?: string;
  /** Hero background image path for the /festival page */
  heroImage?: string;
  /** Mobile hero background image path */
  mobileHeroImage?: string;
  /** Multi-banner support: array of images */
  heroImages?: string[];
  /** Multi-banner support: array of mobile images */
  mobileHeroImages?: string[];
  /** Short dramatic tagline shown on hero image (e.g. 'AUSPICIOUS. ETERNAL. DIVINE.') */
  heroTagline?: string;
}

// ─────────────────────────────────────────────────────────────────
//  ACTIVE FESTIVALS — Edit this array for each event
// ─────────────────────────────────────────────────────────────────

export const FESTIVALS: FestivalConfig[] = [
  {
    id: 'akshaya-tritiya-2026',
    active: true,
    collectionHandle: 'akshaya-tritiya-2026',
    tagline: 'Akshaya Tritiya Special',
    heading: 'Celebrate Prosperity with Lab Grown Diamonds',
    subtitle: 'Auspicious pieces handcrafted for new beginnings.',
    ctaText: 'Shop Akshaya Tritiya',
    ctaLink: '/festival',
    emoji: '🪷',
    maxProducts: 6,
    startDate: '2026-04-10T00:00:00+05:30',
    endDate: '2026-04-30T23:59:59+05:30',
    heroImage: '/images/akshaya-tritiya/Akshay_Tritiya_All_Web.jpg.jpeg',
    mobileHeroImage: '/images/akshaya-tritiya/Akshay_Tritiya_All_Mobile.jpg.jpeg',
    heroImages: [
      '/images/akshaya-tritiya/Akshay_Tritiya_All_Web.jpg.jpeg',
      '/images/akshaya-tritiya/Akshay_Tritiya_Blue_Web.jpg.jpeg',
      '/images/akshaya-tritiya/Akshay_Tritiya_Green_Web.jpg.jpeg',
      '/images/akshaya-tritiya/Akshay_Tritiya_Red_Web.jpg.jpeg',
    ],
    mobileHeroImages: [
      '/images/akshaya-tritiya/Akshay_Tritiya_All_Mobile.jpg.jpeg',
      '/images/akshaya-tritiya/Akshay_Tritiya_Blue_Mobile.jpg.jpeg',
      '/images/akshaya-tritiya/Akshay_Tritiya_Green_Mobile.jpg.jpeg',
      '/images/akshaya-tritiya/Akshay_Tritiya_Red_Mobile.jpg.jpeg',
    ],
    heroTagline: 'AUSPICIOUS. ETERNAL. DIVINE.',
  },
];

// ── TEMPLATES — Uncomment & fill in for the next event ─────────
//  NOTE: ctaLink is ALWAYS '/festival' — the page auto-adapts to the
//  active festival config. No page changes needed!
//
// {
//   id: 'eid-2026',
//   active: false,
//   collectionHandle: 'eid-collection-2026',
//   tagline: 'Eid Mubarak',
//   heading: 'Sparkle This Eid',
//   subtitle: 'Elegant pieces for your celebrations.',
//   ctaText: 'Shop Eid Collection',
//   ctaLink: '/festival',       // ← always /festival
//   emoji: '🌙',
//   maxProducts: 4,
// },
//
// {
//   id: 'diwali-2026',
//   active: false,
//   collectionHandle: 'diwali-collection-2026',
//   tagline: 'Diwali Sparkle',
//   heading: 'Light Up Your Celebrations',
//   subtitle: 'Dazzling diamonds for the festival of lights.',
//   ctaText: 'Shop Diwali Collection',
//   ctaLink: '/festival',       // ← always /festival
//   emoji: '🪔',
//   maxProducts: 4,
// },
// ];

/**
 * Returns the currently active festival config.
 * Checks `active` flag and optional date range.
 */
export function getActiveFestival(): FestivalConfig | null {
  const now = new Date();

  for (const festival of FESTIVALS) {
    if (!festival.active) continue;

    // If dates are specified, check range
    if (festival.startDate && new Date(festival.startDate) > now) continue;
    if (festival.endDate && new Date(festival.endDate) < now) continue;

    return festival;
  }

  return null;
}
