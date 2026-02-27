'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

// Lazy load modal — only imported when user clicks
const StoreLocatorModal = lazy(() => import('./StoreLocatorModal'));

const REGION_CARDS = [
  {
    id: 'india' as const,
    name: 'Solitario India',
    subtitle: '40+ Stores',
    image: '/images/Stores/IndiaStore.jpeg',
  },
  {
    id: 'malaysia' as const,
    name: 'Solitario Malaysia',
    subtitle: '2 Stores',
    image: '/images/Stores/MalaysiaStore.jpeg',
  },
  {
    id: 'dubai' as const,
    name: 'Solitario Dubai',
    subtitle: '1 Store',
    image: '/images/Stores/DubaiStore.jpeg',
  },
  {
    id: 'spain' as const,
    name: 'Solitario Spain',
    subtitle: '53+ Touch Points',
    image: '/images/Stores/SpainStore.jpeg',
  },
];

type Region = 'india' | 'malaysia' | 'dubai' | 'spain';

export default function Stores() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasOpenedModal, setHasOpenedModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const openModal = (region: Region) => {
    setSelectedRegion(region);
    setHasOpenedModal(true);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-8 sm:py-10 md:py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <span className="inline-block text-classic-green text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-gotham mb-2 sm:mb-4">
              Global Presence
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-brand-800 mb-2 sm:mb-4">
              Visit Our <span className="text-classic-green">Stores</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-brand-600 max-w-xl mx-auto font-montserrat hidden sm:block">
              Experience the brilliance of lab-grown diamonds in person at our stores worldwide.
            </p>
          </motion.div>

          {/* 4 Region Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {REGION_CARDS.map((region, idx) => (
              <motion.button
                key={region.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => openModal(region.id)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden text-left cursor-pointer border-2 border-transparent hover:border-classic-green/30 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg md:text-xl font-montserrat font-bold text-white mb-0.5 sm:mb-1">{region.name}</h3>
                  <div className="flex items-center gap-1.5 text-white/60 text-[10px] sm:text-xs font-montserrat">
                    <MapPin className="w-3 h-3 text-bronze-gold" />
                    {region.subtitle}
                  </div>
                  {/* Hover arrow */}
                  <div className="mt-2 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="inline-flex items-center gap-1.5 text-white text-[10px] sm:text-xs font-gotham uppercase tracking-wider">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lazy-loaded Modal — only rendered after first click */}
      {hasOpenedModal && (
        <Suspense fallback={null}>
          <StoreLocatorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialRegion={selectedRegion}
          />
        </Suspense>
      )}
    </>
  );
}
