'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Smart scroll manager:
 * - Forward navigation (user clicks a link): saves scroll, then scrolls to top
 * - Back/forward navigation (browser buttons): restores saved scroll position
 * 
 * Strategy: Use a "forward navigation" flag. Only link clicks set it.
 * If the flag isn't set when pathname changes, it's a back/forward navigation.
 */
export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname();
  const isForwardNav = useRef(false);
  const prevPathname = useRef<string | null>(null);

  // Intercept all link clicks → mark as forward navigation + save scroll
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (
        anchor &&
        anchor.href &&
        !anchor.href.startsWith('javascript') &&
        !anchor.getAttribute('href')?.startsWith('#') &&
        // Only internal navigation (same origin)
        anchor.href.startsWith(window.location.origin)
      ) {
        // Save current scroll position keyed by current pathname
        const currentPath = window.location.pathname;
        sessionStorage.setItem(`__scrollY:${currentPath}`, String(window.scrollY));
        // Flag that the next route change is a forward navigation
        isForwardNav.current = true;
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // On back/forward, save the current scroll and DON'T set the forward flag
  useEffect(() => {
    const handlePopState = () => {
      // Save scroll for current page before it changes
      const currentPath = window.location.pathname;
      sessionStorage.setItem(`__scrollY:${currentPath}`, String(window.scrollY));
      // Explicitly mark as NOT forward
      isForwardNav.current = false;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // React to pathname changes
  useEffect(() => {
    // Skip initial mount
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }

    // Skip if pathname hasn't actually changed
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    if (isForwardNav.current) {
      // Forward navigation → scroll to top
      isForwardNav.current = false;

      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });

      const t = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);

      return () => clearTimeout(t);
    } else {
      // Back/forward navigation → restore saved scroll position
      const savedY = sessionStorage.getItem(`__scrollY:${pathname}`);

      if (savedY) {
        const y = parseInt(savedY, 10);

        // Multiple restoration attempts because content loads asynchronously
        // and Lenis smooth scroll might interfere
        const attempts = [0, 50, 150, 300, 500, 800, 1200];
        const timers: ReturnType<typeof setTimeout>[] = [];

        attempts.forEach((delay) => {
          if (delay === 0) {
            window.scrollTo(0, y);
          } else {
            timers.push(setTimeout(() => {
              window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
            }, delay));
          }
        });

        // Clean up
        sessionStorage.removeItem(`__scrollY:${pathname}`);

        return () => {
          timers.forEach(clearTimeout);
        };
      }
    }
  }, [pathname]);

  return null;
}
