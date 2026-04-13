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
  /** Shopify collection handle to pull products from */
  collectionHandle: string;
  /** Small label above the heading (e.g., "Limited Edition") */
  tagline: string;
  /** Main heading displayed in the section */
  heading: string;
  /** Subtext below heading */
  subtitle: string;
  /** CTA button text */
  ctaText: string;
  /** CTA button link */
  ctaLink: string;
  /** Theme colors */
  theme: {
    /** Accent color for highlights, badges, CTA (hex) */
    accent: string;
    /** Accent hover state */
    accentHover: string;
    /** Tagline text color */
    taglineColor: string;
    /** Heading text color */
    headingColor: string;
    /** Optional gradient for section background */
    bgGradient?: string;
  };
  /** Optional: festival emoji for badge flair */
  emoji?: string;
  /** Optional: max products to show (default: 4) */
  maxProducts?: number;
  /** Optional: start/end date for auto-activation (ISO strings) */
  startDate?: string;
  endDate?: string;
}

// ─────────────────────────────────────────────────────────────────
//  ACTIVE FESTIVALS — Edit this array for each event
// ─────────────────────────────────────────────────────────────────

export const FESTIVALS: FestivalConfig[] = [
  {
    id: 'akshaya-tritiya-2026',
    active: true,
    collectionHandle: 'akshaya-tritiya',
    tagline: 'Akshaya Tritiya Special',
    heading: 'Celebrate Prosperity with Gold & Diamonds',
    subtitle: 'Auspicious pieces handcrafted for new beginnings. First 100 guests receive a diamond free.',
    ctaText: 'Shop Akshaya Tritiya',
    ctaLink: '/products?collection=akshaya-tritiya',
    theme: {
      accent: '#1A5319',
      accentHover: '#14410F',
      taglineColor: '#C4A35A',
      headingColor: '#1A5319',
      bgGradient: 'linear-gradient(180deg, #FFFDF7 0%, #FFF9EC 50%, #FFFDF7 100%)',
    },
    emoji: '🪷',
    maxProducts: 4,
    startDate: '2026-04-10T00:00:00+05:30',
    endDate: '2026-04-30T23:59:59+05:30',
  },

  // ── Template for next festival ──────────────────────────────────
  // Uncomment and fill in when the next event arrives:
  //
  // {
  //   id: 'eid-2026',
  //   active: false,
  //   collectionHandle: 'eid-collection',
  //   tagline: 'Eid Mubarak',
  //   heading: 'Sparkle This Eid',
  //   subtitle: 'Elegant pieces for your celebrations.',
  //   ctaText: 'Shop Eid Collection',
  //   ctaLink: '/products?collection=eid-collection',
  //   theme: {
  //     accent: '#2D6A4F',
  //     accentHover: '#1B4332',
  //     taglineColor: '#C4A35A',
  //     headingColor: '#2D6A4F',
  //     bgGradient: 'linear-gradient(180deg, #F0FFF4 0%, #E6FFF0 50%, #F0FFF4 100%)',
  //   },
  //   emoji: '🌙',
  //   maxProducts: 4,
  // },
  //
  // {
  //   id: 'diwali-2026',
  //   active: false,
  //   collectionHandle: 'diwali-collection',
  //   tagline: 'Diwali Sparkle',
  //   heading: 'Light Up Your Celebrations',
  //   subtitle: 'Dazzling diamonds for the festival of lights.',
  //   ctaText: 'Shop Diwali Collection',
  //   ctaLink: '/products?collection=diwali-collection',
  //   theme: {
  //     accent: '#B8860B',
  //     accentHover: '#996F0A',
  //     taglineColor: '#FF6B35',
  //     headingColor: '#B8860B',
  //     bgGradient: 'linear-gradient(180deg, #FFFBEB 0%, #FFF3CD 50%, #FFFBEB 100%)',
  //   },
  //   emoji: '🪔',
  //   maxProducts: 4,
  // },
];

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
