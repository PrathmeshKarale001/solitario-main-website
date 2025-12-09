'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const featuredStores = [
  {
    city: "New York",
    address: "5th Avenue, NY",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
  },
  {
    city: "Dubai",
    address: "Dubai Mall",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80"
  },
  {
    city: "London",
    address: "Bond Street",
    image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=800&q=80"
  }
];

export default function Stores() {
  return (
    <section className="bg-black py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-bronze-gold font-gotham text-xs uppercase tracking-[0.3em] mb-4 block">
              Visit Us
            </span>
            <h2 className="text-4xl md:text-5xl font-didot text-white">
              Find a Boutique
            </h2>
          </motion.div>
          
          <Link 
            href="/stores"
            className="hidden md:inline-flex items-center gap-2 text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-gotham text-xs uppercase tracking-wider"
          >
            View All Locations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStores.map((store, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[400px] overflow-hidden rounded-xl"
            >
              <Image
                src={store.image}
                alt={`${store.city} Store`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-bronze-gold" />
                  <span className="text-bronze-gold text-xs font-gotham uppercase tracking-wider">Flagship Store</span>
                </div>
                <h3 className="text-3xl font-didot text-white mb-1">{store.city}</h3>
                <p className="text-white/60 font-montserrat text-sm mb-6">{store.address}</p>
                
                <span className="inline-flex items-center gap-2 text-white text-xs font-gotham uppercase tracking-wider opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Get Directions <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link 
            href="/stores"
            className="inline-flex items-center gap-2 text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-gotham text-xs uppercase tracking-wider"
          >
            View All Locations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
