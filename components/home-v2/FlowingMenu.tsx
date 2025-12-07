'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const menuItems = [
  { 
    link: '/products', 
    text: 'Explore Products', 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop&q=80'
  },
  { 
    link: '/about', 
    text: 'Our Story', 
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop&q=80'
  },
  { 
    link: '/contact', 
    text: 'Get In Touch', 
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=600&fit=crop&q=80'
  },
];

export default function FlowingMenu() {
  return (
    <section className="bg-white py-0">
      <div className="grid grid-cols-1 md:grid-cols-3 h-[60vh] min-h-[500px]">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.link}
            className="group relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-gray-100 last:border-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={item.image}
                alt={item.text}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="overflow-hidden mb-2">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="block text-white/60 font-gotham text-xs uppercase tracking-[0.2em]"
                >
                  Discover
                </motion.span>
              </div>
              <h3 className="text-3xl md:text-4xl font-aguila text-white mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                {item.text}
              </h3>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/30 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
