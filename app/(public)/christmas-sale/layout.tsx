import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Christmas Sale — Special Offers',
    description: 'Celebrate the season with The Solitario\'s Christmas sale. Exclusive discounts on lab-grown diamond jewellery.',
    alternates: { canonical: '/christmas-sale' },
    openGraph: {
        title: 'Christmas Sale — The Solitario',
        description: 'Exclusive discounts on lab-grown diamond jewellery this Christmas.',
        url: 'https://thesolitario.com/christmas-sale',
    },
};

export default function ChristmasSaleLayout({ children }: { children: React.ReactNode }) {
    return children;
}
