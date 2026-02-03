'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 'rings',
    name: 'Rings',
    subtitle: 'Shop',
    image: '/category-home/Ring.png',
    href: '/products/category/rings',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    subtitle: 'Shop',
    image: '/category-home/Earrings.png',
    href: '/products/category/earrings',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    subtitle: 'Shop',
    image: '/category-home/Bracelet.png',
    href: '/products/category/bracelets',
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    subtitle: 'Shop',
    image: '/category-home/Necklace.png',
    href: '/products/category/necklaces',
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#FDF8F3] to-[#FAF5EF] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B8860B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-gotham text-bronze-gold mb-2 block">
            Explore Our Collection
          </span>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-montserrat font-bold text-classic-green" style={{ letterSpacing: '-0.02em' }}>
            Shop by Category
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
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
                className="group block"
              >
                <div className="relative">
                  {/* Circular Frame with Gold Border */}
                  <div className="relative aspect-square mx-auto max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]">
                    {/* Outer decorative ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-bronze-gold/30 group-hover:border-bronze-gold/60 transition-colors duration-500" />
                    
                    {/* Inner gold ring with gradient */}
                    <div className="absolute inset-2 sm:inset-3 rounded-full bg-gradient-to-br from-bronze-gold/20 via-transparent to-bronze-gold/10 group-hover:from-bronze-gold/30 group-hover:to-bronze-gold/20 transition-all duration-500" />
                    
                    {/* Main image container */}
                    <div className="absolute inset-3 sm:inset-4 rounded-full overflow-hidden bg-gradient-to-br from-[#F5EDE4] to-[#EDE5DC] shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 280px"
                      />
                      
                      {/* Subtle overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Category Label */}
                  <div className="mt-4 sm:mt-6 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-gotham text-bronze-gold/70 mb-0.5">
                        {category.subtitle}
                      </span>
                      <div className="relative">
                        {/* Decorative lines */}
                        <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-bronze-gold/30 -translate-y-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" style={{ width: '120%', left: '-10%' }} />
                        <h3 className="relative font-montserrat font-bold text-lg sm:text-xl md:text-2xl text-classic-green px-4 bg-gradient-to-b from-[#FDF8F3] to-[#FAF5EF] group-hover:text-bronze-gold transition-colors duration-300">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center mt-10 sm:mt-14 md:mt-16"
        >
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-bronze-gold/50" />
          <div className="mx-3 sm:mx-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-bronze-gold/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
            </svg>
          </div>
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-bronze-gold/50" />
        </motion.div>
      </div>
    </section>
  );
}
