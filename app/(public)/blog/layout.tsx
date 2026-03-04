import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lab Grown Diamond Blog — Insights, Trends & Guides | The Solitario',
    description: 'Read The Solitario\'s blog for expert insights on lab-grown diamonds, celebrity jewellery trends, engagement ring guides, and sustainable diamond luxury in India.',
    keywords: ['lab grown diamonds blog', 'diamond jewellery trends', 'lab grown vs mined diamonds', 'engagement ring guide', 'The Solitario blog', 'sustainable diamonds'],
    alternates: { canonical: '/blog' },
    openGraph: {
        title: 'Lab Grown Diamond Blog — The Solitario',
        description: 'Expert insights on lab-grown diamonds, celebrity jewellery trends, and sustainable luxury.',
        url: 'https://thesolitario.com/blog',
        siteName: 'The Solitario',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lab Grown Diamond Blog — The Solitario',
        description: 'Expert insights on lab-grown diamonds, celebrity jewellery trends, and sustainable luxury.',
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    // Blog JSON-LD structured data
    const blogJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'The Solitario Blog — Bling Blogs',
        description: 'Expert insights on lab-grown diamonds, jewellery trends, and sustainable luxury.',
        url: 'https://thesolitario.com/blog',
        publisher: {
            '@type': 'Organization',
            name: 'The Solitario',
            url: 'https://thesolitario.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://thesolitario.com/logo.svg',
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
            />
            {children}
        </>
    );
}

