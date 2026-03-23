import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Diamond Jewellery Education & Style Blog | Solitario',
    description: 'Expert guides on diamond clarity, 14K vs 18K gold, face shape earring styling, lab-grown diamond durability, and Solitario\'s lifetime exchange policy — by India\'s premier lab-grown diamond jewellery brand.',
    keywords: [
        'diamond clarity guide India', 'lab grown diamonds last forever', '14k vs 18k gold jewellery India',
        'diamond earrings face shape guide', 'lifetime diamond exchange policy India',
        'lab grown diamond jewellery India', 'Solitario blog', 'diamond buying guide India',
        'VS diamond jewellery', '18K gold diamond jewellery India',
    ],
    alternates: { canonical: 'https://solitario.in/blog' },
    openGraph: {
        title: 'Diamond Education & Style Blog | Solitario',
        description: 'Expert diamond guides, gold comparisons, earring style tips, and lab-grown diamond facts — by Solitario, India\'s luxury lab-grown diamond brand.',
        url: 'https://solitario.in/blog',
        siteName: 'Solitario',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Diamond Education & Style Blog | Solitario',
        description: 'Expert diamond guides, gold comparisons, earring style tips, and lab-grown diamond facts.',
    },
};


export default function BlogLayout({ children }: { children: React.ReactNode }) {
    const blogJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Solitario — Diamond Education & Style Blog',
        description: 'Expert guides on diamond clarity, gold purity, earring styling, lab-grown diamond durability, and our lifetime exchange policy.',
        url: 'https://solitario.in/blog',
        publisher: {
            '@type': 'Organization',
            name: 'Solitario',
            url: 'https://solitario.in',
            logo: { '@type': 'ImageObject', url: 'https://solitario.in/solitario/logo-green.svg' },
        },
        blogPost: [
            {
                '@type': 'BlogPosting',
                headline: 'What Is Diamond Clarity? A Complete Visual Guide for First-Time Diamond Buyers',
                description: 'A complete guide to diamond clarity grades, charts, and what to look for when buying diamond jewellery in India.',
                url: 'https://solitario.in/blog/diamond-clarity-guide',
                datePublished: '2025-03-01',
                author: { '@type': 'Organization', name: 'Solitario' },
                image: 'https://solitario.in/solitario/blog/Desktop - diamond stone purity.png',
                keywords: 'diamond clarity, diamond clarity chart, VS diamond, lab-grown diamonds India',
            },
            {
                '@type': 'BlogPosting',
                headline: 'Do Lab-Grown Diamonds Last Forever? What Happens After 10 Years.',
                description: 'Science-backed answer to whether lab-grown diamonds last, fade, or cloud over time.',
                url: 'https://solitario.in/blog/lab-grown-diamonds-last-forever',
                datePublished: '2025-02-01',
                author: { '@type': 'Organization', name: 'Solitario' },
                image: 'https://solitario.in/solitario/blog/Desktop - solitario_lab_grown_diamonds.png',
                keywords: 'lab-grown diamonds, do lab-grown diamonds last, lab-grown diamond durability',
            },
            {
                '@type': 'BlogPosting',
                headline: '14K vs 18K Gold: Which Is Better for Diamond Jewellery?',
                description: 'The definitive comparison of 14K vs 18K gold for diamond jewellery — colour, durability, skin safety, and the 18K vermeil advantage.',
                url: 'https://solitario.in/blog/14k-vs-18k-gold-diamond-jewellery',
                datePublished: '2025-01-01',
                author: { '@type': 'Organization', name: 'Solitario' },
                image: 'https://solitario.in/solitario/blog/Desktop - 14 k 18 k.png',
                keywords: '14K vs 18K gold, 18K gold diamond jewellery India, gold vermeil',
            },
            {
                '@type': 'BlogPosting',
                headline: 'How to Choose Diamond Earrings for Your Face Shape: The Ultimate Style Guide',
                description: 'Complete guide to finding the perfect diamond earrings for round, oval, heart, square, and long face shapes.',
                url: 'https://solitario.in/blog/diamond-earrings-face-shape-guide',
                datePublished: '2024-12-01',
                author: { '@type': 'Organization', name: 'Solitario' },
                image: 'https://solitario.in/solitario/blog/Desktop - Face shapes and earrings.png',
                keywords: 'diamond earrings, earrings for face shape, diamond earrings India',
            },
            {
                '@type': 'BlogPosting',
                headline: "What Is a Lifetime Diamond Exchange Policy? Why Solitario's Guarantee Stands Apart.",
                description: "A buyer's guide to understanding lifetime diamond exchange policies and why Solitario's guarantee sets a new benchmark.",
                url: 'https://solitario.in/blog/lifetime-diamond-exchange-policy',
                datePublished: '2024-11-01',
                author: { '@type': 'Organization', name: 'Solitario' },
                image: 'https://solitario.in/solitario/blog/Desktop - exchange, resale , keep.png',
                keywords: 'lifetime diamond exchange, diamond exchange policy India, lab-grown diamond exchange',
            },
        ],
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
