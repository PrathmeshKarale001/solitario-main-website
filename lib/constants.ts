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
  { id: 'necklaces', label: 'Necklaces', slug: 'necklaces' },
  { id: 'earrings', label: 'Earrings', slug: 'earrings' },
  { id: 'bracelets', label: 'Bracelets', slug: 'bracelets' },
] as const;

// Hero Text Reveals
export const HERO_TEXTS = [
  "Sparkle endlessly with exclusive diamond designs",
  "Crafted for modern & future generations",
  "Luxury that doesn't cost the Earth"
] as const;

// Lab Grown Benefits
export const LAB_GROWN_BENEFITS = [
  {
    id: 'sensual',
    title: 'Sensual',
    description: 'The same brilliance, fire, and sparkle as mined diamonds',
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
    year: '2022',
    title: 'Italian Palladio Awards',
    description: 'Excellence in jewellery design and craftsmanship'
  },
  {
    year: '2022',
    title: 'International Jewellery Design Excellence Award',
    description: 'Recognized for innovative and sustainable designs'
  },
  {
    year: '2023',
    title: 'Luxury Jewellery Craftsmanship Award',
    description: 'Outstanding quality and attention to detail'
  },
  {
    year: '2023',
    title: 'Global Diamond Excellence Award',
    description: 'Leading the lab-grown diamond revolution'
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
    id: 'buyback',
    title: 'Lifetime Buy-back',
    description: 'Investment protection with lifetime value guarantee',
    icon: 'refresh-cw'
  },
  {
    id: 'certificate',
    title: 'IGI Certificate',
    description: 'Every diamond certified by International Gemological Institute',
    icon: 'badge-check'
  },
  {
    id: 'hallmark',
    title: 'Hallmarked Gold',
    description: 'BIS certified gold ensuring purity and quality',
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
    description: '100% real diamonds, ethically sourced and conflict-free',
    icon: 'heart-handshake'
  },
] as const;

// FAQ
export const FAQS = [
  {
    question: 'Are your diamonds ethically sourced?',
    answer: 'Yes, all our diamonds are lab-grown, which means they are 100% conflict-free and ethically created without environmental damage or human rights concerns associated with traditional mining.'
  },
  {
    question: 'Do you offer custom/bespoke services?',
    answer: 'Absolutely! We specialize in creating bespoke jewellery pieces tailored to your preferences. Our expert designers work closely with you to bring your vision to life.'
  },
  {
    question: 'What is the difference between lab-grown and mined diamonds?',
    answer: 'Lab-grown diamonds are chemically, physically, and optically identical to mined diamonds. The only difference is their origin - one is created in a lab, the other mined from the earth. Lab-grown diamonds are more sustainable and offer better value.'
  },
  {
    question: 'Do you provide certification?',
    answer: 'Yes, every diamond comes with an IGI (International Gemological Institute) certificate, and all gold is BIS hallmarked, ensuring authenticity and quality.'
  },
] as const;


