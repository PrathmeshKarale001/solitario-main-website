import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipping Policy',
    description: 'Learn about The Solitario\'s shipping policy. Free insured shipping across India on all lab-grown diamond jewellery orders.',
    alternates: { canonical: '/shipping' },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
