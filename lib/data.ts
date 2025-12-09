// Real Solitario Product Data from https://thesolitario.com
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  images?: string[]; // All product images
  description: string;
  featured?: boolean;
  sku?: string; // Product SKU
  inStock?: boolean; // Stock availability
  stockQuantity?: number; // Actual stock count
  variantId?: string; // Shopify variant ID for cart
}

// Helper function to get product images
const getProductImage = (category: string, index: number): string => {
  const imageMap: Record<string, string[]> = {
    rings: [
      '/images/products/imgi_8_IZRG0086_AP.png',
      '/images/products/imgi_9_IZRG0085_AP.png',
      '/images/products/imgi_10_IZRG0120_AP.png',
      '/images/products/imgi_11_IZRG0119_AP.png',
      '/images/products/imgi_12_IZRG0118_AP.png',
      '/images/products/imgi_13_IZRG0117_AP.png',
      '/images/products/imgi_14_IZRG0113_AP.png',
      '/images/products/imgi_15_IZRG0108_AP.png',
      '/images/products/imgi_16_IZRG0087_AP.png',
      '/images/products/imgi_26_ring22.png',
      '/images/products/imgi_60_IZRG0084_AP.png',
      '/images/products/imgi_61_IZRG0081_AP.png',
      '/images/products/imgi_62_IZRG0080_AP.png',
      '/images/products/imgi_63_IZRG0079_AP.png',
      '/images/products/imgi_64_IZRG0078_AP.png',
      '/images/products/imgi_65_IZRG0076_AP.png',
      '/images/products/imgi_66_IZRG0075_AP.png',
      '/images/products/imgi_67_IZRG0074_AP.png',
      '/images/products/imgi_68_IZRG0072_AP.png',
    ],
    earrings: [
      '/images/products/imgi_38_IZER0024_AP1.png',
      '/images/products/imgi_39_IZER0025_BF.png',
      '/images/products/imgi_40_IZER0029_AP1.png',
      '/images/products/imgi_41_IZER0027_AP1.png',
      '/images/products/imgi_42_IZER0036_AP1.png',
      '/images/products/imgi_43_IZER0031_AP.png',
      '/images/products/imgi_44_IZER0030_AP.png',
      '/images/products/imgi_45_IZER0040_AP.png',
      '/images/products/imgi_46_IZER0037_AP1.png',
      '/images/products/imgi_47_IZER0046_AP.png',
      '/images/products/imgi_48_IZER0052_AP1.png',
      '/images/products/imgi_49_IZER0057_AP.png',
      '/images/products/imgi_50_IZER0056_AP1.png',
      '/images/products/imgi_51_IZER0060_AP1.png',
      '/images/products/imgi_52_IZER0059_AP.png',
      '/images/products/imgi_53_IZER0078_AP.png',
      '/images/products/imgi_54_IZER0062_AP1.png',
      '/images/products/imgi_55_IZER0079_AP.png',
      '/images/products/imgi_56_IZER0080_AP.png',
    ],
    necklaces: [
      '/images/products/imgi_27_ANVER1599_A.png',
      '/images/products/imgi_28_ANVER1412_A.png',
      '/images/products/imgi_29_ANVER1412_A(1).png',
      '/images/products/imgi_30_ANVER1408_A.png',
      '/images/products/imgi_31_ANVER1406_A.png',
      '/images/products/imgi_32_anver1404_A.png',
      '/images/products/imgi_33_anver1403_A.png',
      '/images/products/imgi_34_ANVER1405_A.png',
      '/images/products/imgi_35_anver1402_A.png',
      '/images/products/imgi_36_ANVER1595_A.png',
      '/images/products/imgi_36_IZNK0003_AF.png',
      '/images/products/imgi_37_IZNK0002_AF.png',
      '/images/products/imgi_38_IZNK0005_AF.png',
      '/images/products/imgi_39_IZNK0004_AF.png',
      '/images/products/imgi_40_IZNK0026_AF.png',
      '/images/products/imgi_41_IZNK0018_AF.png',
      '/images/products/imgi_42_IZNK0022_AF.png',
      '/images/products/imgi_43_IZNK0025_AF.png',
      '/images/products/imgi_44_IZNK0032_AF.png',
    ],
    bracelets: [
      '/images/products/imgi_27_IZBR0039_AP.png',
      '/images/products/imgi_28_IZBR0043_AP.png',
      '/images/products/imgi_29_IZBR0032_AP.png',
      '/images/products/imgi_30_IZBR0038_AP.png',
      '/images/products/imgi_31_IZBR0036_AP.png',
      '/images/products/imgi_32_IZBR0030_AP.png',
      '/images/products/imgi_33_IZBR0031_AP.png',
      '/images/products/imgi_34_IZBR0026_AP.png',
      '/images/products/imgi_35_IZBR0024_AP.png',
      '/images/products/imgi_37_IZBR0019_AP.png',
      '/images/products/imgi_38_IZBR0016_AP.png',
      '/images/products/imgi_39_IZBR0002_DR.png',
      '/images/products/imgi_40_IZBR0017_AP.png',
      '/images/products/imgi_41_IZBR0011_AP.png',
      '/images/products/imgi_42_IZBR0018_AP.png',
      '/images/products/imgi_43_IZBR0012_AP.png',
      '/images/products/imgi_44_IZBR0015_AP.png',
      '/images/products/imgi_45_IZBR0005_AP.png',
    ],
  };

  const images = imageMap[category] || ['/images/placeholder.svg'];
  return images[index % images.length];
};

export const PRODUCTS: Product[] = [
  // Rings - from https://thesolitario.com/collection-rings
  {
    id: 'solaris-burst-ring',
    name: 'Solaris Burst Ring',
    category: 'rings',
    price: 78499,
    currency: '₹',
    image: getProductImage('rings', 0),
    description: 'Radiant design that captures light with every movement',
    featured: true
  },
  {
    id: 'bezel-blaze-ring',
    name: 'Bezel Blaze Ring',
    category: 'rings',
    price: 68000,
    currency: '₹',
    image: getProductImage('rings', 1),
    description: 'Modern bezel setting with brilliant lab-grown diamonds',
    featured: true
  },
  {
    id: 'triad-beam-ring',
    name: 'Triad Beam Ring',
    category: 'rings',
    price: 68000,
    currency: '₹',
    image: getProductImage('rings', 2),
    description: 'Three-stone elegance in a contemporary design'
  },
  {
    id: 'nova-eye-ring',
    name: 'Nova Eye Ring',
    category: 'rings',
    price: 75000,
    currency: '₹',
    image: getProductImage('rings', 3),
    description: 'Eye-catching design with exceptional sparkle',
    featured: true
  },
  {
    id: 'chateau-gleam-ring',
    name: 'Château Gleam Ring',
    category: 'rings',
    price: 83000,
    currency: '₹',
    image: getProductImage('rings', 4),
    description: 'Luxurious design inspired by architectural elegance'
  },
  {
    id: 'citylight-ring',
    name: 'Citylight Ring',
    category: 'rings',
    price: 174000,
    currency: '₹',
    image: getProductImage('rings', 5),
    description: 'Statement piece that illuminates with urban sophistication'
  },
  {
    id: 'gilded-noir-ring',
    name: 'Gilded Noir Ring',
    category: 'rings',
    price: 36000,
    currency: '₹',
    image: getProductImage('rings', 6),
    description: 'Bold contrast of gold and dark elegance'
  },
  {
    id: 'celtic-square-ring',
    name: 'Celtic Square Ring',
    category: 'rings',
    price: 31000,
    currency: '₹',
    image: getProductImage('rings', 7),
    description: 'Geometric beauty with Celtic-inspired patterns'
  },
  {
    id: 'golden-rhapsody-ring',
    name: 'Golden Rhapsody Ring',
    category: 'rings',
    price: 59000,
    currency: '₹',
    image: getProductImage('rings', 8),
    description: 'Symphony of gold and diamonds in perfect harmony'
  },
  {
    id: 'empress-arc-ring',
    name: 'Empress Arc Ring',
    category: 'rings',
    price: 42000,
    currency: '₹',
    image: getProductImage('rings', 9),
    description: 'Regal design fit for an empress'
  },
  {
    id: 'lustro-deco-ring',
    name: 'Lustro Deco Ring',
    category: 'rings',
    price: 68000,
    currency: '₹',
    image: getProductImage('rings', 10),
    description: 'Art Deco inspired brilliance'
  },
  {
    id: 'black-orbit-ring',
    name: 'Black Orbit Ring',
    category: 'rings',
    price: 31000,
    currency: '₹',
    image: getProductImage('rings', 11),
    description: 'Modern celestial design with dark elegance'
  },
  {
    id: 'white-eclipse-ring',
    name: 'White Eclipse Ring',
    category: 'rings',
    price: 60000,
    currency: '₹',
    image: getProductImage('rings', 12),
    description: 'Radiant white diamonds in an eclipse formation'
  },
  {
    id: 'twin-souls-ring',
    name: 'Twin Souls Ring',
    category: 'rings',
    price: 62000,
    currency: '₹',
    image: getProductImage('rings', 13),
    description: 'Two souls united in eternal sparkle'
  },
  {
    id: 'vow-embrace-ring',
    name: 'Vow Embrace Ring',
    category: 'rings',
    price: 67000,
    currency: '₹',
    image: getProductImage('rings', 14),
    description: 'A ring that embraces your commitment'
  },
  {
    id: 'light-mosaic-ring',
    name: 'Light Mosaic Ring',
    category: 'rings',
    price: 70000,
    currency: '₹',
    image: getProductImage('rings', 15),
    description: 'Mosaic of light and diamonds'
  },
  {
    id: 'golden-swirl-ring',
    name: 'Golden Swirl Ring',
    category: 'rings',
    price: 60000,
    currency: '₹',
    image: getProductImage('rings', 16),
    description: 'Elegant swirling design in gold'
  },
  {
    id: 'wrap-royale-ring',
    name: 'Wrap Royale Ring',
    category: 'rings',
    price: 60000,
    currency: '₹',
    image: getProductImage('rings', 17),
    description: 'Royal wrap design with premium diamonds'
  },
  {
    id: 'geo-glow-ring',
    name: 'Geo Glow Ring',
    category: 'rings',
    price: 52000,
    currency: '₹',
    image: getProductImage('rings', 18),
    description: 'Geometric patterns that glow with brilliance'
  },
  {
    id: 'gatsby-glow-ring',
    name: 'Gatsby Glow Ring',
    category: 'rings',
    price: 59000,
    currency: '₹',
    image: getProductImage('rings', 19),
    description: 'Roaring twenties elegance reimagined'
  },

  // Earrings - from https://thesolitario.com/collection-earrings
  {
    id: 'diamond-dahlia',
    name: 'Diamond Dahlia',
    category: 'earrings',
    price: 71000,
    currency: '₹',
    image: getProductImage('earrings', 0),
    description: 'Floral elegance in diamond form',
    featured: true
  },
  {
    id: 'nova-halo',
    name: 'Nova Halo',
    category: 'earrings',
    price: 59000,
    currency: '₹',
    image: getProductImage('earrings', 1),
    description: 'Halo design that creates a nova of light',
    featured: true
  },
  {
    id: 'blue-orchid',
    name: 'Blue Orchid',
    category: 'earrings',
    price: 81000,
    currency: '₹',
    image: getProductImage('earrings', 2),
    description: 'Exotic beauty with blue diamond accents'
  },
  {
    id: 'orvee-hoops',
    name: 'Orvée Hoops',
    category: 'earrings',
    price: 24000,
    currency: '₹',
    image: getProductImage('earrings', 3),
    description: 'Classic hoops with modern diamond details'
  },
  {
    id: 'illume-twin',
    name: 'Illume Twin',
    category: 'earrings',
    price: 79000,
    currency: '₹',
    image: getProductImage('earrings', 4),
    description: 'Twin diamonds that illuminate your beauty'
  },
  {
    id: 'triform',
    name: 'Triform',
    category: 'earrings',
    price: 76000,
    currency: '₹',
    image: getProductImage('earrings', 5),
    description: 'Three-part harmony in elegant design'
  },
  {
    id: 'clarityx',
    name: 'Clarityx',
    category: 'earrings',
    price: 72000,
    currency: '₹',
    image: getProductImage('earrings', 6),
    description: 'Maximum clarity and brilliance'
  },
  {
    id: 'eternal-duet',
    name: 'Eternal Duet',
    category: 'earrings',
    price: 69000,
    currency: '₹',
    image: getProductImage('earrings', 7),
    description: 'A duet of diamonds for eternity'
  },
  {
    id: 'duo-beam',
    name: 'Duo Beam',
    category: 'earrings',
    price: 80000,
    currency: '₹',
    image: getProductImage('earrings', 8),
    description: 'Two beams of light in perfect sync'
  },
  {
    id: 'vortisse-earrings',
    name: 'Vortisse Earrings',
    category: 'earrings',
    price: 102000,
    currency: '₹',
    image: getProductImage('earrings', 9),
    description: 'Dramatic vortex design with exceptional sparkle'
  },
  {
    id: 'vinelet-earrings',
    name: 'Vinelet Earrings',
    category: 'earrings',
    price: 111000,
    currency: '₹',
    image: getProductImage('earrings', 10),
    description: 'Delicate vine-inspired design'
  },
  {
    id: 'trueheart-studs',
    name: 'Trueheart Studs',
    category: 'earrings',
    price: 11000,
    currency: '₹',
    image: getProductImage('earrings', 11),
    description: 'Classic studs with heart-shaped diamonds'
  },
  {
    id: 'rubis-lumiere-studs',
    name: 'Rubis Lumiere Studs',
    category: 'earrings',
    price: 39000,
    currency: '₹',
    image: getProductImage('earrings', 12),
    description: 'Ruby and diamond studs with luminous beauty'
  },
  {
    id: 'rosabelle-studs',
    name: 'Rosabelle Studs',
    category: 'earrings',
    price: 25000,
    currency: '₹',
    image: getProductImage('earrings', 13),
    description: 'Rose-inspired studs with delicate beauty'
  },
  {
    id: 'clara-heart-studs',
    name: 'Clara Heart Studs',
    category: 'earrings',
    price: 20000,
    currency: '₹',
    image: getProductImage('earrings', 14),
    description: 'Clear heart-shaped diamonds in elegant studs'
  },
  {
    id: 'trine-spark-studs',
    name: 'Trine Spark Studs',
    category: 'earrings',
    price: 15000,
    currency: '₹',
    image: getProductImage('earrings', 15),
    description: 'Three-part sparkle in stud design'
  },
  {
    id: 'adoreline-hoops',
    name: 'Adoreline Hoops',
    category: 'earrings',
    price: 15000,
    currency: '₹',
    image: getProductImage('earrings', 16),
    description: 'Adorable hoops with diamond accents'
  },
  {
    id: 'petal-drop-hoops',
    name: 'Petal Drop Hoops',
    category: 'earrings',
    price: 28000,
    currency: '₹',
    image: getProductImage('earrings', 17),
    description: 'Petal-shaped drops in elegant hoops'
  },
  {
    id: 'geoluxe-hoops',
    name: 'GeoLuxe Hoops',
    category: 'earrings',
    price: 24000,
    currency: '₹',
    image: getProductImage('earrings', 18),
    description: 'Geometric luxury in hoop design'
  },
  {
    id: 'coastline-catch-studs',
    name: 'Coastline Catch Studs',
    category: 'earrings',
    price: 12000,
    currency: '₹',
    image: getProductImage('earrings', 19),
    description: 'Coastal-inspired studs with natural beauty'
  },

  // Necklaces/Pendants - from https://thesolitario.com/collection-pendants
  {
    id: 'strata-necklace',
    name: 'Strata Necklace',
    category: 'necklaces',
    price: 77000,
    currency: '₹',
    image: getProductImage('necklaces', 0),
    description: 'Layered elegance in a sophisticated design',
    featured: true
  },
  {
    id: 'cherish-pendant',
    name: 'Cherish Pendant',
    category: 'necklaces',
    price: 39000,
    currency: '₹',
    image: getProductImage('necklaces', 1),
    description: 'A pendant to cherish forever',
    featured: true
  },
  {
    id: 'eternelle-pendant',
    name: 'Eternelle Pendant',
    category: 'necklaces',
    price: 49000,
    currency: '₹',
    image: getProductImage('necklaces', 2),
    description: 'Eternal beauty in a timeless pendant'
  },
  {
    id: 'blush-crest-pendant',
    name: 'Blush Crest Pendant',
    category: 'necklaces',
    price: 55000,
    currency: '₹',
    image: getProductImage('necklaces', 3),
    description: 'Delicate blush tones with diamond crest'
  },
  {
    id: 'eclipse-garden-pendant',
    name: 'Eclipse Garden Pendant',
    category: 'necklaces',
    price: 56000,
    currency: '₹',
    image: getProductImage('necklaces', 4),
    description: 'Garden-inspired design with eclipse elegance'
  },
  {
    id: 'flora-radiance-pendant',
    name: 'Flora Radiance Pendant',
    category: 'necklaces',
    price: 33000,
    currency: '₹',
    image: getProductImage('necklaces', 5),
    description: 'Floral radiance in diamond form'
  },
  {
    id: 'cloverlight-pendant',
    name: 'Cloverlight Pendant',
    category: 'necklaces',
    price: 71000,
    currency: '₹',
    image: getProductImage('necklaces', 6),
    description: 'Lucky clover design with brilliant light'
  },
  {
    id: 'tresse-glow-pendant',
    name: 'Tresse Glow Pendant',
    category: 'necklaces',
    price: 12000,
    currency: '₹',
    image: getProductImage('necklaces', 7),
    description: 'Braided design that glows with elegance'
  },
  {
    id: 'fourfold-spark-pendant',
    name: 'Fourfold Spark Pendant',
    category: 'necklaces',
    price: 17000,
    currency: '₹',
    image: getProductImage('necklaces', 8),
    description: 'Four-fold sparkle in one pendant'
  },
  {
    id: 'zenith-line-pendant',
    name: 'Zenith Line Pendant',
    category: 'necklaces',
    price: 17000,
    currency: '₹',
    image: getProductImage('necklaces', 9),
    description: 'Reach the zenith of elegance'
  },
  {
    id: 'helia-pendant',
    name: 'Helia Pendant',
    category: 'necklaces',
    price: 19000,
    currency: '₹',
    image: getProductImage('necklaces', 10),
    description: 'Sun-inspired pendant with radiant beauty'
  },
  {
    id: 'chainlight-pendant',
    name: 'Chainlight Pendant',
    category: 'necklaces',
    price: 18000,
    currency: '₹',
    image: getProductImage('necklaces', 11),
    description: 'Chain design that lights up your style'
  },
  {
    id: 'glimmer-row-pendant',
    name: 'Glimmer Row Pendant',
    category: 'necklaces',
    price: 17000,
    currency: '₹',
    image: getProductImage('necklaces', 12),
    description: 'Row of diamonds that glimmer beautifully'
  },
  {
    id: 'honeyline-pendant',
    name: 'Honeyline Pendant',
    category: 'necklaces',
    price: 20000,
    currency: '₹',
    image: getProductImage('necklaces', 13),
    description: 'Sweet honey-toned elegance'
  },
  {
    id: 'bar-blink-pendant',
    name: 'Bar Blink Pendant',
    category: 'necklaces',
    price: 21000,
    currency: '₹',
    image: getProductImage('necklaces', 14),
    description: 'Modern bar design with blinking brilliance'
  },
  {
    id: 'balance-point-pendant',
    name: 'Balance Point Pendant',
    category: 'necklaces',
    price: 19000,
    currency: '₹',
    image: getProductImage('necklaces', 15),
    description: 'Perfect balance of design and elegance'
  },
  {
    id: 'cosmic-pattern-pendant',
    name: 'Cosmic Pattern Pendant',
    category: 'necklaces',
    price: 23000,
    currency: '₹',
    image: getProductImage('necklaces', 16),
    description: 'Cosmic patterns in diamond form'
  },
  {
    id: 'whimsy-love-pendant',
    name: 'Whimsy Love Pendant',
    category: 'necklaces',
    price: 18000,
    currency: '₹',
    image: getProductImage('necklaces', 17),
    description: 'Whimsical design expressing love'
  },
  {
    id: 'triad-glow-pendant',
    name: 'Triad Glow Pendant',
    category: 'necklaces',
    price: 21000,
    currency: '₹',
    image: getProductImage('necklaces', 18),
    description: 'Three-part glow in elegant pendant'
  },
  {
    id: 'chevron-love-pendant',
    name: 'Chevron Love Pendant',
    category: 'necklaces',
    price: 16000,
    currency: '₹',
    image: getProductImage('necklaces', 19),
    description: 'Chevron pattern expressing love'
  },

  // Bracelets - from https://thesolitario.com/collection-bracelets
  {
    id: 'sienna-orb-bracelet',
    name: 'Sienna Orb Bracelet',
    category: 'bracelets',
    price: 18000,
    currency: '₹',
    image: getProductImage('bracelets', 0),
    description: 'Sienna-toned orbs in elegant bracelet design',
    featured: true
  },
  {
    id: 'astra-charm-bracelet',
    name: 'Astra Charm Bracelet',
    category: 'bracelets',
    price: 36000,
    currency: '₹',
    image: getProductImage('bracelets', 1),
    description: 'Stellar charms in a celestial design',
    featured: true
  },
  {
    id: 'interlink-bracelet',
    name: 'Interlink Bracelet',
    category: 'bracelets',
    price: 18000,
    currency: '₹',
    image: getProductImage('bracelets', 2),
    description: 'Interlinked design with seamless elegance'
  },
  {
    id: 'sunspire-bloom-bracelet',
    name: 'Sunspire Bloom Bracelet',
    category: 'bracelets',
    price: 26000,
    currency: '₹',
    image: getProductImage('bracelets', 3),
    description: 'Blooming design inspired by the sun'
  },
  {
    id: 'dahlia-crest-bracelet',
    name: 'Dahlia Crest Bracelet',
    category: 'bracelets',
    price: 52000,
    currency: '₹',
    image: getProductImage('bracelets', 4),
    description: 'Dahlia flower crest in bracelet form'
  },
  {
    id: 'aurea-links-bracelet',
    name: 'Aurea Links Bracelet',
    category: 'bracelets',
    price: 24000,
    currency: '₹',
    image: getProductImage('bracelets', 5),
    description: 'Golden links in elegant bracelet'
  },
  {
    id: 'halo-link-bracelet',
    name: 'Halo Link Bracelet',
    category: 'bracelets',
    price: 18000,
    currency: '₹',
    image: getProductImage('bracelets', 6),
    description: 'Halo design in linked bracelet'
  },
  {
    id: 'jardin-secret-bracelet',
    name: 'Jardin Secret Bracelet',
    category: 'bracelets',
    price: 19000,
    currency: '₹',
    image: getProductImage('bracelets', 7),
    description: 'Secret garden inspired bracelet'
  },
  {
    id: 'onyx-orbit-bracelet',
    name: 'Onyx Orbit Bracelet',
    category: 'bracelets',
    price: 19000,
    currency: '₹',
    image: getProductImage('bracelets', 8),
    description: 'Onyx and diamond orbit design'
  },
  {
    id: 'starlore-bracelet',
    name: 'Starlore Bracelet',
    category: 'bracelets',
    price: 16000,
    currency: '₹',
    image: getProductImage('bracelets', 9),
    description: 'Lore of the stars in bracelet form'
  },
  {
    id: 'cadenza-bracelet',
    name: 'Cadenza Bracelet',
    category: 'bracelets',
    price: 27000,
    currency: '₹',
    image: getProductImage('bracelets', 10),
    description: 'Musical cadenza in elegant design'
  },
  {
    id: 'soleia-orbit-bracelet',
    name: 'Soleia Orbit Bracelet',
    category: 'bracelets',
    price: 25000,
    currency: '₹',
    image: getProductImage('bracelets', 11),
    description: 'Solar orbit in bracelet design'
  },
  {
    id: 'aurora-trio-bracelet',
    name: 'Aurora Trio Bracelet',
    category: 'bracelets',
    price: 14000,
    currency: '₹',
    image: getProductImage('bracelets', 12),
    description: 'Aurora-inspired trio of diamonds'
  },
  {
    id: 'aurielle-bracelet',
    name: 'Aurielle Bracelet',
    category: 'bracelets',
    price: 41000,
    currency: '₹',
    image: getProductImage('bracelets', 13),
    description: 'Elegant bracelet with aurora beauty'
  },
  {
    id: 'solstice-bracelet',
    name: 'Solstice Bracelet',
    category: 'bracelets',
    price: 25000,
    currency: '₹',
    image: getProductImage('bracelets', 14),
    description: 'Solstice-inspired design with seasonal elegance'
  },
  {
    id: 'petaline-loop-bracelet',
    name: 'Petaline Loop Bracelet',
    category: 'bracelets',
    price: 28000,
    currency: '₹',
    image: getProductImage('bracelets', 15),
    description: 'Petal loops in elegant bracelet'
  },
  {
    id: 'prism-dance-bracelet',
    name: 'Prism Dance Bracelet',
    category: 'bracelets',
    price: 23000,
    currency: '₹',
    image: getProductImage('bracelets', 16),
    description: 'Prismatic dance of light and diamonds'
  },
  {
    id: 'fifth-light-bracelet',
    name: 'Fifth Light Bracelet',
    category: 'bracelets',
    price: 42000,
    currency: '₹',
    image: getProductImage('bracelets', 17),
    description: 'Fifth element of light in bracelet form'
  },
  {
    id: 'roselight-frame-bracelet',
    name: 'Roselight Frame Bracelet',
    category: 'bracelets',
    price: 21000,
    currency: '₹',
    image: getProductImage('bracelets', 18),
    description: 'Rose light framed in elegant bracelet'
  },
  {
    id: 'eclipse-core-bracelet',
    name: 'Eclipse Core Bracelet',
    category: 'bracelets',
    price: 25000,
    currency: '₹',
    image: getProductImage('bracelets', 19),
    description: 'Eclipse core design with dramatic beauty'
  },
  {
    id: 'midnight-radiance-bracelet',
    name: 'Midnight Radiance Bracelet',
    category: 'bracelets',
    price: 27000,
    currency: '₹',
    image: getProductImage('bracelets', 20),
    description: 'Midnight radiance in elegant bracelet'
  },
];

// Testimonials
export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  companyLogo?: string;
  rating: number;
  text: string;
  image?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Shruti Rana',
    title: 'Verified Customer',
    company: 'Google Review',
    rating: 5,
    text: 'The staff was very friendly nature and price is very affordable. Debasmita was given excellent service!',
    // image: '/reviews/shruti-rana.jpg'
  },
  {
    id: 'test-2',
    name: 'Om',
    title: 'Verified Customer',
    company: 'Google Review',
    rating: 5,
    text: 'Nice collection. Nikita is too good staff and the vermeil collection is super price. We afford the price. Thank you Solitario!',
    // image: '/reviews/om.jpg'
  },
  {
    id: 'test-3',
    name: 'Gargi Lodwal',
    title: 'Verified Customer',
    company: 'Google Review',
    rating: 4,
    text: 'I recently visited this store and I\'m genuinely impressed. The brilliance and clarity are amazing, you honestly can\'t tell the difference from a mined diamond. It\'s eco-friendly, ethically sourced, and much more affordable. Highly recommend for anyone looking for a beautiful, responsible choice!',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'
  },
  {
    id: 'test-4',
    name: 'Yashshree Bhagwat',
    title: 'Verified Customer',
    company: 'Google Review',
    rating: 5,
    text: 'I recently visited Solitario on Linking Road, Mumbai, and had an absolutely wonderful experience. The designs were stunning, and the team—Pooja ma\'am, Gautam sir, and Sushil sir—welcomed us with such warmth. They patiently guided me through the options and helped me choose a design that truly suited me. Highly recommended!',
    image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'
  },
  {
    id: 'test-5',
    name: 'Prashant Dhavale',
    title: 'Verified Customer',
    company: 'Google Review',
    rating: 5,
    text: 'Got a men\'s customized band in vermeil gold. The quality feels solid and already getting compliments. Would definitely recommend!',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'
  },
];

// Founders
export interface Founder {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
}

export const FOUNDERS: Founder[] = [
  {
    id: 'founder-1',
    name: 'Ricky Vasandani',
    title: 'Co-Founder & CEO',
    bio: 'Visionary entrepreneur with a passion for sustainable luxury. Ricky leads Solitario\'s mission to revolutionize the diamond industry through ethical practices and innovative design.',
    image: '/images/placeholder.svg'
  },
  {
    id: 'founder-2',
    name: 'Dr. Vivek Anand Oberoi',
    title: 'Co-Founder & Brand Ambassador',
    bio: 'Acclaimed actor and philanthropist committed to sustainable business practices. Vivek brings star power and social consciousness to Solitario\'s brand vision.',
    image: '/images/placeholder.svg'
  },
];
