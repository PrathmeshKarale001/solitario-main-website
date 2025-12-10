import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Check if request is from shop subdomain
  const isShopSubdomain = hostname.startsWith('shop.') || hostname.includes('shop.thesolitario.com');

  // Redirect /checkout to /shop-checkout for shop subdomain
  if (isShopSubdomain && pathname === '/checkout') {
    return NextResponse.redirect(new URL('/shop-checkout', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|solitario|product-hero-assets).*)',
  ],
};
