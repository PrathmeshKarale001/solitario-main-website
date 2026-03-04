import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lab Grown Diamonds — What Are Lab Grown Diamonds? | The Solitario',
    description: 'Discover lab grown diamonds at The Solitario. Learn how lab-created diamonds are made, why they\'re identical to mined diamonds, and why they\'re the sustainable choice for modern luxury jewellery in India.',
    keywords: ['lab grown diamonds', 'lab created diamonds', 'lab grown diamond jewellery', 'sustainable diamonds India', 'The Solitario lab grown', 'CVD diamonds', 'HPHT diamonds'],
    alternates: { canonical: '/lab-grown-diamonds' },
    openGraph: {
        title: 'Lab Grown Diamonds — The Solitario',
        description: 'Discover the brilliance of lab-grown diamonds. Ethically created, certified, and identical to mined diamonds.',
        url: 'https://thesolitario.com/lab-grown-diamonds',
        siteName: 'The Solitario',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lab Grown Diamonds — The Solitario',
        description: 'Discover the brilliance of lab-grown diamonds. Ethically created, certified, and identical to mined diamonds.',
    },
};

export default function LabGrownLayout({ children }: { children: React.ReactNode }) {
    return children;
}

