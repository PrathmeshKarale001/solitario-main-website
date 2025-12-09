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


