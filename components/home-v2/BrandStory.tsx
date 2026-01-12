'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function BrandStory() {
  return (
    <section className="bg-gray-900 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <span className="text-bronze-gold font-gotham text-xs uppercase tracking-[0.3em] mb-6 block">
              Our Legacy
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white mb-8 leading-tight">
              Crafting <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Tomorrow's</span> <br />
              Heirlooms
            </h2>
            <div className="space-y-6 text-gray-400 font-montserrat leading-relaxed">
              <p>
                Solitario was born from a vision to redefine luxury for the modern era. We believe that true beauty should not come at the cost of our planet or its people.
              </p>
              <p>
                By harnessing the power of advanced technology, we create lab grown diamonds that are physically, chemically, and optically identical to mined diamonds, yet free from the ethical and environmental concerns of traditional mining.
              </p>
            </div>
            
            <div className="mt-10">
              <Image 
                src="/images/signature.png" 
                alt="Founder Signature" 
                width={200} 
                height={80} 
                className="opacity-60 invert"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
              <div className="absolute inset-0 border border-white/10 transform translate-x-4 translate-y-4" />
              <div className="absolute inset-0 bg-gray-800">
                <Image
                  src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop"
                  alt="Jewelry Making Process"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
