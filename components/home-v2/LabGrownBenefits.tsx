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

export default function LabGrownBenefits() {
  return (
    <section className="bg-gray-900 py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B8860B' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-bronze-gold/20 to-transparent rounded-full blur-3xl" />
              <Image
                src="https://images.unsplash.com/photo-1617038220319-276d3cf66958?q=80&w=1000&auto=format&fit=crop"
                alt="Lab Grown Diamond Close up"
                fill
                className="object-cover rounded-2xl shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-bronze-gold rounded-full flex items-center justify-center z-20 shadow-xl">
                <div className="text-center text-black">
                  <span className="block text-2xl font-bold font-didot">100%</span>
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
              <span className="text-bronze-gold font-gotham text-xs uppercase tracking-[0.3em] mb-4 block">
                Why Lab Grown?
              </span>
              <h2 className="text-4xl md:text-5xl font-didot text-white mb-6">
                The Future of <span className="italic text-gray-400">Luxury</span>
              </h2>
              <p className="text-gray-400 font-montserrat leading-relaxed">
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
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-bronze-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-didot text-lg mb-2">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
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
