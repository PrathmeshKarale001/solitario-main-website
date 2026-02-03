// Warner Bros Collectibles Configuration
// Hero slides: use literal paths (no %20) so static serving works in production.
// Desktop uses same slides as mobile (WB_Mob) since WB_PC files may not be deployed; both work everywhere.

const HERO_BASE = '/images/warnerbroassets';

const HERO_MOBILE_SLIDES = [
  `${HERO_BASE}/1 (WB_Mob).jpeg`,
  `${HERO_BASE}/2 (WB_Mob).jpeg`,
  `${HERO_BASE}/3 (WB_Mob).jpeg`,
  `${HERO_BASE}/4 (WB_Mob).jpg`,
  `${HERO_BASE}/5 (WB_Mob).jpg`,
  `${HERO_BASE}/6 (WB_Mob).jpg`,
  `${HERO_BASE}/7 (WB_Mob).jpg`,
];

export const WARNER_BROS_CONFIG = {
  // Hero Banner Configuration - rotating slides (same assets for desktop & mobile for reliable production loading)
  hero: {
    desktopSlides: HERO_MOBILE_SLIDES,
    mobileSlides: HERO_MOBILE_SLIDES,
    alt: 'Solitario x Warner Bros Collection',
    rotationIntervalMs: 4000,
  },

  // Brand Logos for Legends Unleashed Section
  brands: [
    {
      id: 'dc',
      name: 'DC',
      logo: '/images/warnerbroassets/dc-logo.webp',
      alt: 'DC Comics',
      tag: 'dc', // Used for product filtering
      tagVariants: ['dc', 'dc-comics', 'dccomics', 'batman', 'superman', 'wonder-woman'], // Additional matching tags
    },
    {
      id: 'tom-jerry',
      name: 'Tom & Jerry',
      logo: '/images/warnerbroassets/tom-jerry-logo.webp',
      alt: 'Tom & Jerry',
      tag: 'tom&jerry', // Used for product filtering
      tagVariants: ['tom&jerry', 'tom-jerry', 'tomandjerry', 'tom-and-jerry', 'tom jerry'], // Additional matching tags
    },
  ],

  // Floating Button Configuration
  floatingButton: {
    images: [
      '/images/warnerbroassets/dc-logo.webp',
      '/images/warnerbroassets/tom-jerry-logo.webp',
    ],
    intervalMs: 2000, // Alternate every 2 seconds
  },

  // Page Metadata
  meta: {
    title: 'Solitario x Warner Bros Collectibles | Legends Unleashed',
    description: 'Step into iconic worlds with our exclusive Warner Bros collaboration. Discover luxury diamond jewellery inspired by DC Comics and Tom & Jerry.',
  },

  // Theme Colors (Dark cinematic theme)
  theme: {
    background: '#0a0a0a',
    surface: '#111111',
    accent: '#C6A664', // Solitario gold
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
      muted: '#6b7280',
    },
    border: '#1f1f1f',
  },
} as const;

export type WarnerBrosBrand = typeof WARNER_BROS_CONFIG.brands[number];
