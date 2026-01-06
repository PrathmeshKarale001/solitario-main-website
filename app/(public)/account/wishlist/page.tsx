'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to main wishlist page
export default function AccountWishlistPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/wishlist');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bronze-gold"></div>
    </div>
  );
}
