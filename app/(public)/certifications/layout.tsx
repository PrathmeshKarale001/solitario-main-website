import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Certifications — Quality Assurance',
    description: 'Our lab-grown diamonds are certified by leading gemological institutes. Every piece of The Solitario jewellery comes with a certificate of authenticity.',
    alternates: { canonical: '/certifications' },
    openGraph: {
        title: 'Certifications — The Solitario',
        description: 'Certified lab-grown diamond jewellery with authenticity guaranteed.',
        url: 'https://thesolitario.com/certifications',
    },
};

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
