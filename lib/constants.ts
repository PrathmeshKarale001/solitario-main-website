// Brand Colors
export const COLORS = {
  classicGreen: '#146552',
  bronzeGold: '#ac884b',
  softBronze: '#c39275',
  ivoryPearl: '#f8eee7',
  teal: '#107571',
} as const;

// Navigation Links
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

// Product Categories - slugs match our internal product.category values
export const CATEGORIES = [
  { id: 'all', label: 'All', slug: 'all' },
  { id: 'rings', label: 'Rings', slug: 'rings' },
  { id: 'earrings', label: 'Earrings', slug: 'earrings' },
  { id: 'necklaces', label: 'Necklaces', slug: 'necklaces' },
  { id: 'pendants', label: 'Pendants', slug: 'pendants' },
  { id: 'bracelets', label: 'Bracelets', slug: 'bracelets' },
] as const;

// Hero Text Reveals
export const HERO_TEXTS = [
  "Sparkle endlessly with exclusive lab grown diamond designs",
  "Crafted for modern & future generations",
  "Luxury that doesn't cost the Earth"
] as const;

// Lab Grown Benefits
export const LAB_GROWN_BENEFITS = [
  {
    id: 'sensual',
    title: 'Sensual',
    description: 'The same brilliance, fire, and sparkle as natural diamonds',
    icon: 'sparkles'
  },
  {
    id: 'sustainable',
    title: 'Sustainable',
    description: 'Eco-friendly, conflict-free, and ethically created',
    icon: 'leaf'
  },
  {
    id: 'smart',
    title: 'Smart',
    description: 'Up to 40% more value for the same quality and beauty',
    icon: 'brain'
  },
] as const;

// Awards
export const AWARDS = [
  {
    year: '2024',
    title: 'ET Top 50 Jewellery Brands of India',
    description: 'Solitario',
    image: '/images/Awards/B2D557F6-4CEC-4EB5-A4CA-20A081038F36.png'
  },
  {
    year: '2024',
    title: 'Great Places to Work - Top 100 SME Companies',
    description: 'Solitario',
    image: '/images/Awards/e7c62ddf-4b55-4199-acb7-dc45df14d356.jpg'
  },
  {
    year: '2024',
    title: 'Business Prism - Best Corporate Leaders in Asia',
    description: 'Kamini Singh',
    image: '/images/Awards/4df9f9a4-d1a8-488a-92f4-1021e4e0a413.jpg'
  },
  {
    year: '2024',
    title: 'Digital Icons - Top 30 CMOs of India',
    description: 'Kabir Kate',
    image: '/images/Awards/7069EA4D-48E7-44E4-A515-1109BB36CBCE.png'
  },
] as const;

// Service Promises
export const PROMISES = [
  {
    id: 'bespoke',
    title: 'Bespoke Designs',
    description: 'Custom-crafted pieces tailored to your story',
    icon: 'gem'
  },
  {
    id: 'exchange',
    title: '100% Lifetime Exchange',
    description: 'Complete lifetime exchange guarantee on all purchases',
    icon: 'refresh-cw'
  },
  {
    id: 'certificate',
    title: 'IGI & SGL Certified',
    description: 'Every lab grown diamond certified by international institutes',
    icon: 'badge-check'
  },
  {
    id: 'quality',
    title: 'Premium Quality',
    description: '14K & 18K gold, 925 sterling silver with authenticity guarantee',
    icon: 'sparkles'
  },
  {
    id: 'loyalty',
    title: 'Loyalty Club',
    description: 'Exclusive benefits and rewards for our patrons',
    icon: 'wand-sparkles'
  },
  {
    id: 'ethical',
    title: 'Ethical Procedures',
    description: '100% ethical Lab Grown Diamonds, conflict-free and sustainable',
    icon: 'heart-handshake'
  },
] as const;

// FAQ
export const FAQS = [
  {
    question: 'What are lab-grown diamonds?',
    answer:
      'Lab-grown diamonds are real diamonds created in controlled laboratories using advanced technology that replicates the natural diamond-forming process. They have the same physical, chemical, and optical properties as mined diamonds.',
  },
  {
    question: 'Are lab-grown diamonds real diamonds?',
    answer:
      'Yes. Lab-grown diamonds are 100% real diamonds. They are certified, test positive on diamond testers, and are graded by international gemological laboratories just like mined diamonds.',
  },
  {
    question: 'Do lab-grown diamonds hold resale value?',
    answer:
      'Like all luxury goods, resale depends on market demand. However, lab-grown diamonds deliver significantly higher value at the time of purchase since you get a larger, better diamond at a better price.',
  },
  {
    question: 'Do you offer customization?',
    answer:
      'Yes! Solitario specializes in bespoke engagement rings, personalized jewellery, and custom diamond setting services.',
  },
  {
    question: 'What metals do you use?',
    answer:
      'We use 14K & 18K gold, Vermeil (18K gold-plated 925 silver), and 925 sterling silver. All metals are hypoallergenic and designed for everyday comfort.',
  },
  {
    question: 'What is your return & exchange policy?',
    answer:
      'Solitario offers a 7–15 day return/exchange window. Custom pieces are not returnable but can be altered.',
  },
  {
    question: 'Are Solitario diamonds certified?',
    answer:
      'Yes. Every Solitario diamond comes with international certifications such as IGI and SGL, along with an authenticity guarantee.',
  },
] as const;


