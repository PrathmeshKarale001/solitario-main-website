'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    id: 'rings',
    name: 'Rings',
    subtitle: 'Shop Collection',
    image: '/category-home/Ring.png',
    href: '/products?category=rings',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    subtitle: 'Shop Collection',
    image: '/category-home/Earrings.png',
    href: '/products?category=earrings',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    subtitle: 'Shop Collection',
    image: '/category-home/Bracelet.png',
    href: '/products?category=bracelets',
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    subtitle: 'Shop Collection',
    image: '/category-home/Necklace.png',
    href: '/products?category=necklaces',
  },
];

export default function ShopByCategoryOriginal() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-bronze-gold/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-gotham text-bronze-gold mb-3 block">
            Curated For You
          </span>
          <h2 className="text-3xl md:text-5xl font-playfair text-white" style={{ letterSpacing: '-0.02em' }}>
            Featured Categories
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={category.href}
                className="group block relative h-full"
              >
                <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-white/10 hover:border-bronze-gold/30 hover:shadow-[0_0_30px_rgba(184,134,11,0.1)]">
                  {/* Hover Accent */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-bronze-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Top Header */}
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-gotham group-hover:text-bronze-gold transition-colors">
                      0{index + 1}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-bronze-gold group-hover:rotate-45 transition-all duration-500" />
                  </div>

                  {/* Image Container */}
                  <div className="relative aspect-square mb-6">
                    <div className="absolute inset-0 bg-bronze-gold/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-75 group-hover:scale-100" />
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="text-center relative z-10">
                    <h3 className="text-xl md:text-2xl font-playfair text-white mb-2 group-hover:text-bronze-gold transition-colors duration-300">
                      {category.name}
                    </h3>
                    <div className="h-px w-8 bg-white/20 mx-auto group-hover:w-16 group-hover:bg-bronze-gold/50 transition-all duration-500" />
                    <span className="inline-block mt-3 text-[10px] uppercase tracking-wider text-white/40 font-gotham group-hover:text-white/80 transition-colors">
                      {category.subtitle}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
