'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Section, Container, Button } from '@/components/ui';

export default function BrandStory() {
  return (
    <Section variant="light" padding="sm" className="bg-brand-100">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold mb-4 sm:mb-6 md:mb-8 text-brand-800" style={{ letterSpacing: '-0.02em' }}>
              Designed for Today. Inspired by Tomorrow.
            </h2>
            <div className="space-y-3 sm:space-y-4 md:space-y-6 text-xs sm:text-sm md:text-base text-brand-700 leading-relaxed">
              <p>
                Solitario was born from a vision to redefine modern luxury. We craft heirloom-worthy pieces using advanced diamond technology, delivering exceptional brilliance with uncompromising quality.
              </p>
              <p>
                Our lab-grown diamonds possess the same optical, physical, and chemical properties as mined diamonds, perfected through precision and innovation.
              </p>
              <p className="font-semibold text-classic-green">
                Luxury, reimagined for a new generation.
              </p>
            </div>
            <Link href="/about">
              <Button
                variant="primary"
                size="md"
                className="mt-4 sm:mt-6 md:mt-8 group text-xs sm:text-sm"
              >
                Read Our Story
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Image/Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="aspect-[4/5] sm:aspect-square rounded-lg overflow-hidden shadow-luxury-lg">
              <Image
                src={require('@/public/images/general/30.6.2025 Soltario0693.jpg')}
                alt="Model wearing modern jewelry"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: '80% center' }}
              />
              {/* Overlay gradient for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Decorative Elements - Smaller on mobile */}
            <div className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 w-20 h-20 sm:w-40 sm:h-40 border-2 border-classic-green/30 rounded-lg -z-10 shadow-brand" />
            <div className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 w-20 h-20 sm:w-40 sm:h-40 border-2 border-classic-green/20 rounded-lg -z-10 shadow-brand" />
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}


