'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDisabled() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to home page
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
