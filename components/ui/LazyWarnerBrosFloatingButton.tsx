'use client';

import dynamic from 'next/dynamic';

// ssr: false is only allowed in Client Components; root layout is a Server Component.
const WarnerBrosFloatingButton = dynamic(
  () => import('@/components/ui/WarnerBrosFloatingButton'),
  { ssr: false }
);

export default function LazyWarnerBrosFloatingButton() {
  return <WarnerBrosFloatingButton />;
}
