import type { Metadata } from 'next';
import { getActiveFestival } from '@/lib/festival-config';

const festival = getActiveFestival();

export const metadata: Metadata = {
  title: festival
    ? `${festival.tagline} — The Solitario`
    : 'Festival Collection — The Solitario',
  description: festival
    ? festival.subtitle
    : 'Shop our curated festival collection of lab-grown diamond jewellery.',
  alternates: { canonical: '/festival' },
  openGraph: {
    title: festival ? `${festival.tagline} — The Solitario` : 'Festival Collection — The Solitario',
    description: festival
      ? festival.subtitle
      : 'Curated festival pieces in lab-grown diamonds from The Solitario.',
    url: 'https://thesolitario.com/festival',
  },
};

export default function FestivalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
