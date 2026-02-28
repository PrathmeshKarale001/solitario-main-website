import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop Diamond Jewellery — Rings, Necklaces, Earrings & More',
    description: 'Shop The Solitario\'s collection of lab-grown diamond jewellery. Browse rings, necklaces, earrings, bracelets, and pendants crafted with sustainable luxury.',
    alternates: { canonical: '/products' },
    openGraph: {
        title: 'Shop Lab Grown Diamond Jewellery — The Solitario',
        description: 'Browse rings, necklaces, earrings, bracelets, and pendants.',
        url: 'https://thesolitario.com/products',
    },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
