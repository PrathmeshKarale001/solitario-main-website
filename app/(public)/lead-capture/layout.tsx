import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invest in Solitario — Franchise & Investment Opportunities',
  description:
    'Partner with The Solitario — India\'s premium lab-grown diamond jewellery brand. Explore franchise and investment opportunities with high returns and full brand support.',
  alternates: { canonical: '/lead-capture' },
  openGraph: {
    title: 'Invest in Solitario — Franchise Opportunities',
    description:
      'Own a premium lab-grown diamond jewellery franchise. High growth market, established brand, complete support.',
    url: 'https://thesolitario.com/lead-capture',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeadCaptureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
