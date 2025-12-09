import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ========================================
        // SOLITARIO BRAND COLOR PALETTE
        // ========================================
        
        // PRIMARY COLORS
        'classic-green': '#146552',    // Dark Teal Green (Pantone 560 C) - Rich base
        'bronze-gold': '#ac884b',      // Classic Bronze (Pantone P 12-6 C) - Golden highlight
        'soft-bronze': '#c39275',      // Copper Rose (Pantone P 42-2 C) - Warm accent
        'ivory-pearl': '#f8eee7',      // Ivory Pearl (Pantone 75-9 C) - Light neutral
        
        // SECONDARY / ACCENT COLORS
        'teal': '#107571',             // Pantone Green - CTAs, hover states, icons
        'teal-dark': '#0d5f5c',        // Darker teal for hover
        'teal-light': '#1a9994',       // Lighter teal for accents
        
        // BRAND NEUTRALS (replacing gray-*)
        'brand': {
          50: '#faf8f6',               // Lightest - backgrounds
          100: '#f5f0eb',              // Very light - alt backgrounds
          200: '#e8dfd6',              // Light - borders, dividers
          300: '#d4c4b5',              // Medium light - disabled text
          400: '#b8a08a',              // Medium - placeholder text
          500: '#8c7560',              // Medium dark - secondary text
          600: '#6b5a4a',              // Dark - body text
          700: '#4a3f35',              // Darker - headings
          800: '#2d2620',              // Very dark - primary text
          900: '#1a1714',              // Darkest - emphasis
        },
        
        // SEMANTIC COLORS (on-brand)
        'success': '#146552',          // Use classic-green for success
        'error': '#a84432',            // Warm terracotta red (on-brand)
        'warning': '#ac884b',          // Use bronze-gold for warnings
        'info': '#107571',             // Use teal for info
      },
      fontFamily: {
        // Brand Typography
        aguila: ['Aguila', 'Georgia', 'serif'],
        didot: ['Didot', 'Georgia', 'serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
        gotham: ['Gotham', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Brand Type Scale
        'display-xl': ['5rem', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-lg': ['4rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'heading-xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'ui': ['0.75rem', { lineHeight: '1', letterSpacing: '0.2em' }],
        'ui-sm': ['0.625rem', { lineHeight: '1', letterSpacing: '0.25em' }],
      },
      letterSpacing: {
        'luxury': '0.25em',
        'wide-luxury': '0.3em',
      },
      borderRadius: {
        'brand': '0.5rem',
        'brand-lg': '1rem',
        'brand-xl': '1.5rem',
      },
      boxShadow: {
        'brand-sm': '0 2px 8px rgba(20, 101, 82, 0.06)',
        'brand': '0 4px 16px rgba(20, 101, 82, 0.08)',
        'brand-lg': '0 8px 32px rgba(20, 101, 82, 0.12)',
        'brand-xl': '0 16px 48px rgba(20, 101, 82, 0.16)',
        'gold-glow': '0 0 24px rgba(172, 136, 75, 0.2)',
        'gold-glow-lg': '0 0 48px rgba(172, 136, 75, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #146552 0%, #107571 100%)',
        'gradient-gold': 'linear-gradient(135deg, #ac884b 0%, #c39275 100%)',
        'gradient-pearl': 'linear-gradient(180deg, #f8eee7 0%, #ffffff 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
export default config


