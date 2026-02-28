import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'Read The Solitario\'s terms and conditions for purchasing lab-grown diamond jewellery online and in-store.',
    alternates: { canonical: '/terms' },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
