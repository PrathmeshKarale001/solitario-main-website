'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Saves scroll position to sessionStorage keyed by pathname.
 * Restores scroll position when navigating back to a page.
 * 
 * Usage: Place <ScrollPositionManager /> in any page/layout that needs scroll restoration.
 */
export default function ScrollPositionManager() {
    const pathname = usePathname();

    useEffect(() => {
        // Try to restore scroll position for this route
        const savedPosition = sessionStorage.getItem(`scrollPos:${pathname}`);
        if (savedPosition) {
            const scrollY = parseInt(savedPosition, 10);
            // Use requestAnimationFrame to wait for DOM to render, then restore
            // Multiple frames needed because of lazy-loaded content
            const restore = () => {
                window.scrollTo(0, scrollY);
            };
            // Try restoring after a short delay to let content render
            const timer = setTimeout(restore, 100);
            // Also try after a longer delay for lazy-loaded content
            const timer2 = setTimeout(restore, 300);

            // Clean up the saved position so forward navigation still scrolls to top
            sessionStorage.removeItem(`scrollPos:${pathname}`);

            return () => {
                clearTimeout(timer);
                clearTimeout(timer2);
            };
        }
    }, [pathname]);

    useEffect(() => {
        // Save scroll position before the user navigates away
        const saveScrollPosition = () => {
            sessionStorage.setItem(`scrollPos:${pathname}`, String(window.scrollY));
        };

        // Save on every scroll (debounced via browser)
        // We use beforeunload for hard navigations and popstate for back/forward
        // But the most reliable way is to save on every click that might trigger navigation
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (anchor && anchor.href && !anchor.href.startsWith('#')) {
                saveScrollPosition();
            }
        };

        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, [pathname]);

    return null;
}
