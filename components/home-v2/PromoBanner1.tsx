'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function PromoBanner1() {
  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=2940&auto=format&fit=crop"
          alt="Luxury Jewelry Model"
          fill
          className="object-cover object-center opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-bronze-gold font-gotham text-xs md:text-sm uppercase tracking-[0.3em] mb-4 md:mb-6 block pl-1">
              Exclusive Collection
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-montserrat font-bold text-white mb-6 md:mb-8 leading-[0.9]">
              Timeless<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/20 italic">
                Elegance
              </span>
            </h2>
            <p className="text-white/80 font-montserrat text-sm md:text-lg leading-relaxed max-w-md mb-10 pl-1 border-l border-bronze-gold/30 pl-6">
              Discover our latest masterpiece collection, where sustainable luxury meets unparalleled craftsmanship. Each piece tells a story of brilliance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pl-1">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-gotham text-xs uppercase tracking-[0.2em] hover:bg-bronze-gold hover:text-white transition-all duration-500"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-4 font-gotham text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-500 backdrop-blur-sm"
              >
                View Lookbook
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
