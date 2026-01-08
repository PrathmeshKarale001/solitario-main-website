import { Metadata } from 'next';
import { Suspense } from 'react';
import { WARNER_BROS_CONFIG } from '@/lib/warner-bros-config';
import WarnerBrosClient from './WarnerBrosClient';
import { notFound } from 'next/navigation';
import Redirect from '@/components/ui/Redirect';

// Route segment config for dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export const metadata: Metadata = {
  title: WARNER_BROS_CONFIG.meta.title,
  description: WARNER_BROS_CONFIG.meta.description,
};

export default function WarnerBrosPage() {
  // Warner Bros page temporarily disabled
  return <Redirect to="/" />;
  
  // return (
  //   <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C6A664]"></div></div>}>
  //     <WarnerBrosClient />
  //   </Suspense>
  // );
}
