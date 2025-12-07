'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Eleanor P.",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80",
    text: "The brilliance of these lab-grown diamonds is unmatched. I was hesitant at first, but the quality and ethical sourcing made it an easy choice.",
    rating: 5,
    product: "Emerald Cut Ring"
  },
  {
    id: 2,
    name: "Sarah M.",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
    text: "Absolutely stunning piece. The craftsmanship is impeccable, and knowing it's sustainable makes it even more beautiful to wear.",
    rating: 5,
    product: "Tennis Bracelet"
  },
  {
    id: 3,
    name: "James W.",
    location: "Sydney, AU",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
    text: "Service was exceptional from start to finish. The packaging, the certification, and the ring itself exceeded all my expectations.",
    rating: 5,
    product: "Solitaire Studs"
  }
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={containerRef} className="bg-black py-24 sm:py-32 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bronze-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-bronze-gold font-gotham text-xs uppercase tracking-[0.3em] block mb-4">
            Client Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-didot text-white">
            Moments of <span className="italic text-white/50">Brilliance</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-b from-bronze-gold/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-500 h-full flex flex-col">
                <Quote className="w-10 h-10 text-bronze-gold/20 mb-6 group-hover:text-bronze-gold/40 transition-colors" />
                
                <p className="text-white/80 font-montserrat leading-relaxed mb-8 flex-grow">
                  "{item.text}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-didot text-lg">{item.name}</h4>
                    <p className="text-white/40 text-xs font-gotham uppercase tracking-wider">{item.location}</p>
                  </div>
                </div>

                <div className="absolute top-8 right-8 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-bronze-gold fill-bronze-gold" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
