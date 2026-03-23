import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solitario España — Diamantes Cultivados en Laboratorio | Geresa',
  description:
    'Descubre Solitario en España a través de Geresa. Diamantes cultivados en laboratorio certificados por IGI — la misma pureza, brillo y calidad, con un compromiso ético y sostenible.',
  keywords: [
    'diamantes de laboratorio España',
    'diamantes cultivados laboratorio',
    'Solitario España',
    'Geresa joyería',
    'diamantes éticos España',
    'joyería sostenible',
    'diamantes IGI certificados',
  ],
  openGraph: {
    title: 'Solitario España — Diamantes Cultivados en Laboratorio',
    description:
      'El lujo sostenible aterriza en España. Diamantes cultivados en laboratorio certificados, con garantía de por vida.',
    locale: 'es_ES',
    type: 'website',
    siteName: 'Solitario',
  },
};

export default function GeresaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
