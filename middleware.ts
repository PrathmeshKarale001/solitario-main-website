import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

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

export default clerkMiddleware(async (auth, request) => {
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
