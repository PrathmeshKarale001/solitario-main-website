'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function PromoBanner2() {
  return (
    <section className="relative h-[600px] bg-[#f5f5f5] overflow-hidden">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1 relative z-10 p-6 md:p-12 bg-white shadow-xl max-w-xl"
          >
            <span className="text-bronze-gold font-gotham text-xs uppercase tracking-[0.3em] mb-6 block">
              Craftsmanship
            </span>
            <h2 className="text-4xl md:text-6xl font-aguila text-gray-900 mb-6">
              Luxury <br />
              <span className="italic font-light">Reimagined</span>
            </h2>
            <p className="text-gray-600 font-montserrat mb-8 leading-relaxed">
              Every Solitario diamond is cut to perfection, ensuring maximum brilliance and fire. Our master craftsmen dedicate hours to perfecting each facet.
            </p>
            <Link
              href="/about"
              className="inline-block border-b border-gray-900 pb-1 text-xs font-gotham uppercase tracking-[0.2em] hover:text-bronze-gold hover:border-bronze-gold transition-colors"
            >
              Read Our Story
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2 relative h-[400px] md:h-[600px] w-full"
          >
            <div className="absolute top-0 right-0 w-full h-full md:w-[120%] bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1596942514194-22e8d3566b2a?q=80&w=1000&auto=format&fit=crop"
                alt="Jewelry Craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
