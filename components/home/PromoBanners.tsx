'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Banner 1 - "Forever diamonds, ethically crafted" - Links to Lab Grown Diamonds
export function PromoBanner1() {
  return (
    <section className="py-4 sm:py-6 md:py-8 px-0">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/products"
          className="block relative overflow-hidden group"
        >
          <Image
              src="/images/banners/banner2-v2.png"
              alt="Forever diamonds, ethically crafted"
              width={1920}
              height={600}
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
              sizes="100vw"
              quality={90}
              priority
            />
        </Link>
      </motion.div>
    </section>
  );
}

// Banner 2 - "Shine of luxury, without compromise" - Links to Products
export function PromoBanner2() {
  return (
    <section className="pb-4 sm:pb-6 md:pb-8 px-0 bg-ivory-pearl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/lab-grown-diamonds"
          className="block relative overflow-hidden group"
        >
          <Image
              src="/images/banners/banner1-v2.jpg"
              alt="Shine of luxury, without compromise"
              width={1920}
              height={600}
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
              sizes="100vw"
              quality={90}
              priority
            />
        </Link>
      </motion.div>
    </section>
  );
}

// Default export for backward compatibility
export default function PromoBanners() {
  return (
    <>
      <PromoBanner1 />
      <PromoBanner2 />
    </>
  );
}
