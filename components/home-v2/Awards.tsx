'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const awards = [
  { name: "Luxury Brand of the Year", year: "2024", icon: "/images/awards/award1.png" },
  { name: "Sustainable Excellence", year: "2023", icon: "/images/awards/award2.png" },
  { name: "Best Diamond Jewellery", year: "2023", icon: "/images/awards/award3.png" },
  { name: "Innovation in Design", year: "2022", icon: "/images/awards/award4.png" }
];

export default function Awards() {
  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gray-400 font-gotham text-[10px] uppercase tracking-[0.2em]">
            Recognition
          </span>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           {/* Since we don't have actual award images, using placeholders with text */}
           {awards.map((award, index) => (
             <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
             >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 border border-gray-200 rounded-full flex items-center justify-center group-hover:border-bronze-gold transition-colors">
                  <span className="font-playfair text-2xl text-gray-300 group-hover:text-bronze-gold">{index + 1}</span>
                </div>
                <h4 className="font-playfair text-gray-900 text-sm md:text-base mb-1">{award.name}</h4>
                <p className="font-gotham text-[10px] text-gray-400">{award.year}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
