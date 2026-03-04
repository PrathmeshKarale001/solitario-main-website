import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/ProductJsonLd';

// Category SEO configuration - keyword-optimized metadata for each category
const CATEGORY_SEO: Record<string, {
    title: string;
    description: string;
    keywords: string[];
}> = {
    rings: {
        title: 'Lab Grown Diamond Rings — Engagement, Solitaire & Designer Rings',
        description: 'Shop stunning lab-grown diamond rings at The Solitario. From solitaire engagement rings to designer cocktail rings — ethically crafted, certified diamonds. Free shipping across India.',
        keywords: ['lab grown diamond rings', 'solitaire rings', 'engagement rings', 'diamond rings India', 'The Solitario rings'],
    },
    earrings: {
        title: 'Lab Grown Diamond Earrings — Studs, Drops & Hoops',
        description: 'Discover exquisite lab-grown diamond earrings at The Solitario. Elegant studs, drop earrings & hoops crafted with certified lab-grown diamonds. Modern luxury, sustainable choice.',
        keywords: ['lab grown diamond earrings', 'diamond studs', 'diamond drop earrings', 'The Solitario earrings'],
    },
    pendants: {
        title: 'Lab Grown Diamond Pendants — Solitaire & Designer Pendants',
        description: 'Adorn yourself with beautiful lab-grown diamond pendants from The Solitario. Solitaire, cluster & designer pendants with certified diamonds. Perfect for every occasion.',
        keywords: ['lab grown diamond pendants', 'diamond pendant necklace', 'solitaire pendant', 'The Solitario pendants'],
    },
    necklaces: {
        title: 'Lab Grown Diamond Necklaces — Tennis, Chain & Statement Necklaces',
        description: 'Explore stunning lab-grown diamond necklaces at The Solitario. Tennis necklaces, chain necklaces & statement pieces crafted with ethically created diamonds.',
        keywords: ['lab grown diamond necklaces', 'diamond tennis necklace', 'diamond chain necklace', 'The Solitario necklaces'],
    },
    bracelets: {
        title: 'Lab Grown Diamond Bracelets — Tennis, Bangle & Chain Bracelets',
        description: 'Complete your look with elegant lab-grown diamond bracelets from The Solitario. Tennis bracelets, bangles & chain bracelets with certified lab-grown diamonds.',
        keywords: ['lab grown diamond bracelets', 'diamond tennis bracelet', 'diamond bangle', 'The Solitario bracelets'],
    },
};

interface CategoryLayoutProps {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
    const { slug } = await params;
    const seo = CATEGORY_SEO[slug];
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    if (!seo) {
        return {
            title: `${categoryName} — Lab Grown Diamond Jewellery`,
            description: `Explore our collection of lab-grown diamond ${slug} at The Solitario. Ethically crafted, certified diamonds.`,
            alternates: { canonical: `/products/category/${slug}` },
        };
    }

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: { canonical: `/products/category/${slug}` },
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: `https://thesolitario.com/products/category/${slug}`,
            siteName: 'The Solitario',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.title,
            description: seo.description,
        },
    };
}

export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
    const { slug } = await params;
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    // CollectionPage JSON-LD for category pages
    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${categoryName} — Lab Grown Diamond Jewellery`,
        description: CATEGORY_SEO[slug]?.description || `Explore lab-grown diamond ${slug} at The Solitario.`,
        url: `https://thesolitario.com/products/category/${slug}`,
        isPartOf: {
            '@type': 'WebSite',
            name: 'The Solitario',
            url: 'https://thesolitario.com',
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thesolitario.com' },
                { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://thesolitario.com/products' },
                { '@type': 'ListItem', position: 3, name: categoryName, item: `https://thesolitario.com/products/category/${slug}` },
            ],
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: 'https://thesolitario.com' },
                    { name: 'Shop', url: 'https://thesolitario.com/products' },
                    { name: categoryName, url: `https://thesolitario.com/products/category/${slug}` },
                ]}
            />
            {children}
        </>
    );
}
