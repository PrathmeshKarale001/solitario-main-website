import type { Metadata } from 'next';

// This mirrors the data in the listing page — used for OG tags & JSON-LD
const BLOG_META: Record<string, { title: string; description: string; keywords: string[] }> = {
  'diamond-clarity-guide': {
    title: 'What Is Diamond Clarity? A Complete Visual Guide | Solitario',
    description:
      'A complete guide to diamond clarity grades, charts, and what to look for when buying diamond jewellery in India. VS, VVS, FL explained.',
    keywords: ['diamond clarity', 'diamond clarity chart', 'lab-grown diamonds India', 'VS diamond jewellery', 'Solitario'],
  },
  'lab-grown-diamonds-last-forever': {
    title: 'Do Lab-Grown Diamonds Last Forever? 10-Year Durability Guide | Solitario',
    description:
      'Science-backed answer to whether lab-grown diamonds last, fade, or cloud over time. Mohs hardness, resale value, and care tips.',
    keywords: ['lab-grown diamonds', 'do lab-grown diamonds last', 'lab-grown diamond durability', 'Solitario diamonds'],
  },
  '14k-vs-18k-gold-diamond-jewellery': {
    title: '14K vs 18K Gold: Which Is Better for Diamond Jewellery? | Solitario',
    description:
      'The definitive guide comparing 14K vs 18K gold for diamond jewellery. Colour, durability, skin safety, and the 18K gold vermeil advantage.',
    keywords: ['14K vs 18K gold', '18K gold diamond jewellery India', 'gold vermeil diamond jewellery India'],
  },
  'diamond-earrings-face-shape-guide': {
    title: 'How to Choose Diamond Earrings for Your Face Shape | Solitario',
    description:
      'Your complete style guide to finding the perfect diamond earrings for round, oval, heart, square, and long face shapes.',
    keywords: ['diamond earrings', 'earrings for face shape', 'diamond earrings India', 'Solitario earrings'],
  },
  'lifetime-diamond-exchange-policy': {
    title: "What Is a Lifetime Diamond Exchange Policy? Solitario's Guarantee Explained",
    description:
      "A buyer's guide to understanding lifetime diamond exchange policies and why Solitario's guarantee sets a new benchmark for Indian luxury jewellery.",
    keywords: ['lifetime diamond exchange', 'diamond exchange policy', 'lab-grown diamond exchange India'],
  },
};

export async function generateStaticParams() {
  return Object.keys(BLOG_META).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = BLOG_META[slug];
  if (!meta) return { title: 'Blog | Solitario' };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      siteName: 'Solitario',
    },
    alternates: { canonical: `https://solitario.in/blog/${slug}` },
  };
}

export default async function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
