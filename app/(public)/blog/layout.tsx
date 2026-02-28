import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog — Diamond Jewellery Insights',
    description: 'Explore The Solitario\'s blog for insights on lab-grown diamonds, jewellery trends, styling tips, and sustainable luxury.',
    alternates: { canonical: '/blog' },
    openGraph: {
        title: 'Blog — The Solitario',
        description: 'Insights on lab-grown diamonds, jewellery trends, and sustainable luxury.',
        url: 'https://thesolitario.com/blog',
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
