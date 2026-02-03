// Warner Bros Collectibles Configuration
// Hero slides: WB_PC for desktop, WB_Mob for mobile (auto-rotate every 4s)

const HERO_BASE = '/images/warnerbroassets';

export const WARNER_BROS_CONFIG = {
  // Hero Banner Configuration - rotating slides
  hero: {
    desktopSlides: [
      `${HERO_BASE}/1%20(WB_PC).jpg`,
      `${HERO_BASE}/2%20(WB_PC).jpg`,
      `${HERO_BASE}/3%20(WB_PC).jpg`,
      `${HERO_BASE}/4%20(WB_PC).jpg`,
      `${HERO_BASE}/5%20(WB_PC).jpg`,
      `${HERO_BASE}/6%20(WB_PC).jpg`,
      `${HERO_BASE}/7%20(WB_PC).jpg`,
    ],
    mobileSlides: [
      `${HERO_BASE}/1%20(WB_Mob).jpeg`,
      `${HERO_BASE}/2%20(WB_Mob).jpeg`,
      `${HERO_BASE}/3%20(WB_Mob).jpeg`,
      `${HERO_BASE}/4%20(WB_Mob).jpg`,
      `${HERO_BASE}/5%20(WB_Mob).jpg`,
      `${HERO_BASE}/6%20(WB_Mob).jpg`,
      `${HERO_BASE}/7%20(WB_Mob).jpg`,
    ],
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
