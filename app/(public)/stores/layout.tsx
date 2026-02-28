import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Store Locations — Find The Solitario Near You',
    description: 'Find The Solitario diamond jewellery stores near you. Visit us at our showrooms across India for an in-person experience.',
    alternates: { canonical: '/stores' },
    openGraph: {
        title: 'Store Locations — The Solitario',
        description: 'Find our diamond jewellery showrooms across India.',
        url: 'https://thesolitario.com/stores',
    },
};

export default function StoresLayout({ children }: { children: React.ReactNode }) {
    return children;
}
