'use client';

import { motion } from 'framer-motion';
import { Gem, Leaf, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

const benefits = [
  {
    icon: Leaf,
    title: "Eco-Conscious",
    description: "Ethically created with zero mining impact on our planet."
  },
  {
    icon: Gem,
    title: "Pure Brilliance",
    description: "Identical optical, physical, and chemical properties to mined diamonds."
  },
  {
    icon: ShieldCheck,
    title: "Certified Quality",
    description: "Every diamond comes with certification from leading gemological institutes."
  },
  {
    icon: Zap,
    title: "Future Forward",
    description: "Advanced technology meeting timeless luxury."
  }
];

export default function LabGrownBenefitsV2() {
  return (
    <section className="bg-[#FAF5EF] py-24 relative overflow-hidden">
      {/* Background Pattern - Light theme */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23146552' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative aspect-square max-w-lg mx-auto flex items-center justify-center">
              {/* Logo Frame with solid background */}
              <div className="relative w-3/4 aspect-square bg-classic-green rounded-2xl shadow-2xl flex items-center justify-center p-8">
                <Image
                  src="/logo.svg"
                  alt="Solitario Logo"
                  width={300}
                  height={100}
                  className="w-full h-auto brightness-0 invert"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FAF5EF] border border-bronze-gold/30 rounded-full flex items-center justify-center z-20 shadow-xl">
                <div className="text-center text-brand-800">
                  <span className="block text-2xl font-bold font-playfair">100%</span>
                  <span className="text-[10px] uppercase font-gotham tracking-wider">Conflict Free</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="text-classic-green font-gotham text-xs uppercase tracking-[0.3em] mb-4 block">
                Why Lab Grown?
              </span>
              <h2 className="text-4xl md:text-5xl font-playfair text-brand-800 mb-6">
                The Future of <span className="italic text-classic-green">Luxury</span>
              </h2>
              <p className="text-brand-600 font-montserrat leading-relaxed">
                Experience the perfect union of science and art. Our lab-grown diamonds offer the same brilliance and durability as mined diamonds, but with a lighter footprint on the earth.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {benefits.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-classic-green/10 border border-classic-green/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-classic-green" />
                  </div>
                  <div>
                    <h4 className="text-brand-800 font-playfair text-lg mb-2">{item.title}</h4>
                    <p className="text-brand-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
