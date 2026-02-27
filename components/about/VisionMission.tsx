'use client';

import { motion } from 'framer-motion';
import { Eye, Target, Sparkles, Shield, Leaf } from 'lucide-react';

export default function VisionMission() {
  return (
    <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-brand-50 via-white to-brand-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-bronze-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-classic-green/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-bronze-gold text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4">
            What Drives Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold text-brand-800 mb-6" style={{ letterSpacing: '-0.02em' }}>
            Vision <span className="text-classic-green">&</span> Mission
          </h2>
        </motion.div>

        {/* Vision & Mission Cards - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Our Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden bg-white border border-brand-200 p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-500"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-classic-green/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-classic-green/10 rounded-xl flex items-center justify-center mb-6 border border-classic-green/20">
                <Eye className="w-7 h-7 text-classic-green" />
              </div>

              <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-brand-800 mb-5">
                Our Vision
              </h3>

              <p className="text-brand-700 font-montserrat leading-relaxed text-base">
                Solitario Lab Grown Diamonds envisions a world where ethics and beauty combine seamlessly. Our jewelry, a living legacy, reflects the mindful values of a transformed luxury industry, we are catalysts for change, sparking conversations on sustainable elegance and shaping a legacy beyond convention.
              </p>
            </div>
          </motion.div>

          {/* Our Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden bg-white border border-brand-200 p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-500"
          >
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-bronze-gold/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-bronze-gold/10 rounded-xl flex items-center justify-center mb-6 border border-bronze-gold/20">
                <Target className="w-7 h-7 text-bronze-gold" />
              </div>

              <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-brand-800 mb-5">
                Our Mission
              </h3>

              <p className="text-brand-700 font-montserrat leading-relaxed text-base">
                In a world where values evolve, we pioneer sustainable jewelry for a future built on unwavering ethics. Our mission is to craft adornments that provoke contemplation, ignite passion, and enhance beauty without exploitation. Our principles blend with modern day designs, as we strive for a conscious world elevating beauty with integrity.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values Grid - 4 pillars */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            { icon: Sparkles, label: 'Excellence', desc: 'Precision in every detail', color: 'classic-green' },
            { icon: Shield, label: 'Integrity', desc: 'Responsible by design', color: 'bronze-gold' },
            { icon: Eye, label: 'Innovation', desc: 'Modern materials, modern craft', color: 'classic-green' },
            { icon: Leaf, label: 'Accountability', desc: 'Measured, not marketed', color: 'bronze-gold' },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl bg-white border border-brand-200 p-5 md:p-6 hover:border-classic-green/40 hover:shadow-xl transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

              <div className="relative z-10 text-center">
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-${item.color}/10 rounded-xl flex items-center justify-center mb-3 md:mb-4 mx-auto group-hover:bg-${item.color}/20 transition-colors duration-300`}>
                  <item.icon className={`w-6 h-6 md:w-7 md:h-7 text-${item.color}`} />
                </div>
                <h4 className={`text-base md:text-lg font-montserrat font-bold text-brand-800 mb-2 group-hover:text-${item.color} transition-colors duration-300`}>
                  {item.label}
                </h4>
                <p className="text-brand-600 text-sm font-montserrat leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
