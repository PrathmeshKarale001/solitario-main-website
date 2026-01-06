'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export default function WarnerBrosDisabled() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after a short delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-playfair text-white mb-4">Coming Soon</h1>
          <p className="text-gray-400 mb-8">
            This exclusive collection is being prepared. Check back soon for amazing Warner Bros collectibles!
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-[#C6A664] hover:bg-[#B8945F] text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/products')}
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Shop Our Collection
          </Button>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          You will be redirected automatically...
        </p>
      </motion.div>
    </div>
  );
}
