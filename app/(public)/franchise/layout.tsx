import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Franchise Opportunities — Join The Solitario',
    description: 'Partner with The Solitario and own a premium lab-grown diamond jewellery franchise. Explore franchise opportunities across India.',
    alternates: { canonical: '/franchise' },
    openGraph: {
        title: 'Franchise Opportunities — The Solitario',
        description: 'Own a premium lab-grown diamond jewellery franchise.',
        url: 'https://thesolitario.com/franchise',
    },
};

export default function FranchiseLayout({ children }: { children: React.ReactNode }) {
    return children;
}
