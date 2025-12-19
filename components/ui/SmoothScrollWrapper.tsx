'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Only load on desktop to save mobile bundle
const SmoothScrollDesktop = dynamic(() => import('@/components/ui/SmoothScrollDesktop'), {
  ssr: false,
});

export default function SmoothScrollWrapper({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Only render smooth scroll on desktop
  if (isDesktop) {
    return <SmoothScrollDesktop>{children}</SmoothScrollDesktop>;
  }

  return <>{children}</>;
}
