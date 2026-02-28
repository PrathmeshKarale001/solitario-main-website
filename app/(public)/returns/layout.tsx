import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Return Policy',
    description: 'The Solitario\'s return and exchange policy. Learn about our hassle-free return process for lab-grown diamond jewellery.',
    alternates: { canonical: '/returns' },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
