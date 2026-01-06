// Warner Bros Collectibles Configuration
// Update these paths with actual assets from /public/images/warnerbroassets/

export const WARNER_BROS_CONFIG = {
  // Hero Banner Configuration
  hero: {
    desktop: '/images/warnerbroassets/hero-banner-desktop.jpg',
    mobile: '/images/warnerbroassets/hero-banner-mobile.jpg',
    alt: 'Solitario x Warner Bros Collection',
  },

  // Brand Logos for Legends Unleashed Section
  brands: [
    {
      id: 'dc',
      name: 'DC',
      logo: '/images/warnerbroassets/dc-logo.webp',
      alt: 'DC Comics',
      tag: 'dc', // Used for product filtering
    },
    {
      id: 'tom-jerry',
      name: 'Tom & Jerry',
      logo: '/images/warnerbroassets/tom-jerry-logo.webp',
      alt: 'Tom & Jerry',
      tag: 'tom-jerry', // Used for product filtering
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
