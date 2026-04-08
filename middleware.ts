import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
    '/account(.*)',
    '/admin(.*)',
    '/wishlist(.*)',
]);

// Routes that should always be accessible (no auth redirect)
const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/products(.*)',
    '/about(.*)',
    '/contact(.*)',
    '/blog(.*)',
    '/lab-grown-diamonds(.*)',
    '/shipping(.*)',
    '/certifications(.*)',
    '/privacy(.*)',
    '/terms(.*)',
    '/refund(.*)',
    '/api(.*)',
    '/auth(.*)',
]);

// Paths that must ALWAYS work during maintenance (webhooks, payments, health checks)
const MAINTENANCE_WHITELIST = [
    '/api/',           // All API routes (Shopify webhooks, payment callbacks, etc.)
    '/maintenance',    // The maintenance page itself
    '/_next/',         // Next.js static assets
    '/logo.svg',       // Logo used on maintenance page
    '/favicon',        // Favicon
];

export default clerkMiddleware(async (auth, request) => {
    const { pathname } = request.nextUrl;

    // ── Maintenance Mode Check ──────────────────────────────────────
    const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

    if (isMaintenanceMode) {
        // Check whitelist — these paths always work
        const isWhitelisted = MAINTENANCE_WHITELIST.some(path => pathname.startsWith(path));

        // Allow admin access via secret bypass query param
        // Usage: https://yoursite.com?bypass=YOUR_SECRET
        const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET;
        const bypassParam = request.nextUrl.searchParams.get('bypass');
        const hasBypassCookie = request.cookies.get('maintenance_bypass')?.value === bypassSecret;
        const hasValidBypass = bypassSecret && (bypassParam === bypassSecret || hasBypassCookie);

        if (!isWhitelisted && !hasValidBypass) {
            // Redirect to maintenance page
            const maintenanceUrl = new URL('/maintenance', request.url);
            const response = NextResponse.redirect(maintenanceUrl, { status: 302 });

            // SEO: Tell search engines to retry later (1 hour)
            response.headers.set('Retry-After', '3600');
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return response;
        }

        // If bypass via query param, set a cookie so they don't need it on every page
        if (bypassParam === bypassSecret && bypassSecret) {
            const response = NextResponse.next();
            response.cookies.set('maintenance_bypass', bypassSecret, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 hours
            });
            return response;
        }
    }

    // ── Normal Auth Check ────────────────────────────────────────────
    if (isProtectedRoute(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
