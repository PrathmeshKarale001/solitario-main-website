import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lab Grown Diamonds — Sustainable Luxury',
    description: 'Discover the brilliance of lab-grown diamonds at The Solitario. Ethically created, optically identical to mined diamonds, and more sustainable.',
    alternates: { canonical: '/lab-grown-diamonds' },
    openGraph: {
        title: 'Lab Grown Diamonds — The Solitario',
        description: 'Ethically created diamonds that are optically identical to mined diamonds.',
        url: 'https://thesolitario.com/lab-grown-diamonds',
    },
};

export default function LabGrownLayout({ children }: { children: React.ReactNode }) {
    return children;
}
