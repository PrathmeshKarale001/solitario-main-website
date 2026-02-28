'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Lazy Loading Components
// Audit Recommendation: 3.2 & 6.2 - Lazy Load Heavy Components, Code Splitting

// Loading skeleton component
function LoadingSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} w-full bg-brand-100 animate-pulse rounded-lg flex items-center justify-center`}>
      <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
    </div>
  );
}

// Lazy loaded NearestStore component (uses Radar API)
export const LazyNearestStore = dynamic(
  () => import('@/components/stores/NearestStore').then((mod) => mod.default),
  {
    loading: () => <LoadingSkeleton height="h-48" />,
  }
);

// Lazy loaded TrackingTimeline component
export const LazyTrackingTimeline = dynamic(
  () => import('@/components/orders/TrackingTimeline').then((mod) => mod.default),
  {
    loading: () => <LoadingSkeleton height="h-32" />,
  }
);

// Lazy loaded ProductDetail component (heavy with images)
export const LazyProductDetail = dynamic(
  () => import('@/components/products/ProductDetail').then((mod) => mod.default),
  {
    loading: () => <LoadingSkeleton height="h-[600px]" />,
  }
);

// Lazy loaded ProductRecommendations
export const LazyProductRecommendations = dynamic(
  () => import('@/components/products/ProductRecommendations').then((mod) => mod.default),
  {
    loading: () => <LoadingSkeleton height="h-64" />,
  }
);

// Lazy loaded 3D Ring component (Three.js - heavy)
export const Lazy3DRing = dynamic(
  () => import('@/components/lightswind/3d-image-ring').then((mod) => mod.ThreeDImageRing),
  {
    loading: () => <LoadingSkeleton height="h-[400px]" />,
    ssr: false,
  }
);

// Lazy loaded CartSidebar
export const LazyCartSidebar = dynamic(
  () => import('@/components/cart/CartSidebar').then((mod) => mod.default),
  {
    loading: () => <LoadingSkeleton height="h-full" />,
  }
);

// Export loading skeleton for reuse
export { LoadingSkeleton };
