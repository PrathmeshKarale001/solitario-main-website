import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about The Solitario\'s lab-grown diamond jewellery, shipping, returns, certifications, and more.',
    alternates: { canonical: '/faq' },
    openGraph: {
        title: 'FAQ — The Solitario',
        description: 'Find answers about lab-grown diamonds, shipping, returns, and more.',
        url: 'https://thesolitario.com/faq',
    },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
    return children;
}
