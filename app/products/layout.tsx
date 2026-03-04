import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop Lab Grown Diamond Jewellery — Rings, Necklaces, Earrings & More',
    description: 'Shop The Solitario\'s curated collection of lab-grown diamond jewellery. Browse rings, necklaces, earrings, bracelets, and pendants — all crafted with certified lab-grown diamonds. Free shipping across India.',
    keywords: ['lab grown diamond jewellery', 'buy diamond jewellery online', 'The Solitario shop', 'diamond rings', 'diamond necklaces', 'diamond earrings India'],
    alternates: { canonical: '/products' },
    openGraph: {
        title: 'Shop Lab Grown Diamond Jewellery — The Solitario',
        description: 'Browse rings, necklaces, earrings, bracelets, and pendants crafted with certified lab-grown diamonds.',
        url: 'https://thesolitario.com/products',
        siteName: 'The Solitario',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shop Lab Grown Diamond Jewellery — The Solitario',
        description: 'Browse rings, necklaces, earrings, bracelets, and pendants crafted with certified lab-grown diamonds.',
    },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return children;
}

