import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Read The Solitario\'s privacy policy. Learn how we collect, use, and protect your personal information.',
    alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
