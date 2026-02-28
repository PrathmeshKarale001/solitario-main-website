import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with The Solitario. Visit our stores, call us, or send a message. We\'re here to help with all your diamond jewellery needs.',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Contact The Solitario',
        description: 'Visit our stores or reach out online. We\'re here to help with all your diamond jewellery needs.',
        url: 'https://thesolitario.com/contact',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
