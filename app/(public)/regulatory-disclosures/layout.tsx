import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Regulatory Disclosures',
    description: 'View The Solitario\'s regulatory disclosures, annual returns, and corporate governance documents.',
    alternates: { canonical: '/regulatory-disclosures' },
};

export default function RegulatoryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
