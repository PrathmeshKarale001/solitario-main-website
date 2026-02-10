'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Only load on desktop to save mobile bundle
const SmoothScrollDesktop = dynamic(() => import('@/components/ui/SmoothScrollDesktop'), {
  ssr: false,
});

export default function SmoothScrollWrapper({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Always render the same wrapper so server and client match; only switch content after mount
  if (!mounted || !isDesktop) {
    return <>{children}</>;
  }

  return <SmoothScrollDesktop>{children}</SmoothScrollDesktop>;
}
