import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sustainability — Ethical Diamond Jewellery',
    description: 'The Solitario is committed to sustainability. Our lab-grown diamonds have a significantly lower environmental impact than mined diamonds.',
    alternates: { canonical: '/sustainability' },
    openGraph: {
        title: 'Sustainability — The Solitario',
        description: 'Lab-grown diamonds with a lower environmental impact.',
        url: 'https://thesolitario.com/sustainability',
    },
};

export default function SustainabilityLayout({ children }: { children: React.ReactNode }) {
    return children;
}
