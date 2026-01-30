'use client';

import { motion } from 'framer-motion';
import { Eye, Target, Sparkles, Shield, Gem, Heart } from 'lucide-react';

export default function VisionMission() {
  return (
    <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-brand-50 via-white to-brand-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-bronze-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-classic-green/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-brand-800 mb-6" style={{ letterSpacing: '-0.02em' }}>
            Our <span className="text-classic-green">Vision</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-600 max-w-3xl mx-auto font-montserrat leading-relaxed">
            Redefining luxury through accessibility, ethics, and timeless design
          </p>
        </motion.div>

        {/* Enhanced Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-brand-50/50 to-classic-green/5 border border-brand-200 p-8 md:p-12 mb-16 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-classic-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-bronze-gold/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-classic-green/10 rounded-full flex items-center justify-center mb-8 mx-auto border-2 border-classic-green/20">
              <Eye className="w-10 h-10 text-classic-green" />
            </div>
            
            <h3 className="text-2xl md:text-4xl font-playfair text-brand-800 mb-8">
              Flipping the Script on <span className="text-classic-green">Luxury</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-bronze-gold/10 rounded-xl flex items-center justify-center">
                  <Gem className="w-6 h-6 text-bronze-gold" />
                </div>
                <h4 className="text-xl font-playfair text-brand-800">Accessible Luxury</h4>
                <p className="text-brand-700 font-montserrat leading-relaxed">
                  Diamonds aren't exclusive indulgences but luxury that's accessible to all, ethically crafted and tastefully designed.
                </p>
              </div>
              
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-classic-green/10 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-classic-green" />
                </div>
                <h4 className="text-xl font-playfair text-brand-800">Personal Expression</h4>
                <p className="text-brand-700 font-montserrat leading-relaxed">
                  Our pieces become an extension of your personality - tools of expression and symbols of love, power, and joy.
                </p>
              </div>
              
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-bronze-gold/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-bronze-gold" />
                </div>
                <h4 className="text-xl font-playfair text-brand-800">Conscious Impact</h4>
                <p className="text-brand-700 font-montserrat leading-relaxed">
                  We bling better with strong ethics powered by dynamic design, making the world more consciously cool.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Values Grid - Removed Sustainability */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: Sparkles, label: 'Excellence', desc: 'Uncompromising quality in every piece', color: 'classic-green' },
            { icon: Shield, label: 'Integrity', desc: 'Ethical practices and transparent business', color: 'bronze-gold' },
            { icon: Eye, label: 'Innovation', desc: 'Cutting-edge technology and design', color: 'classic-green' },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl bg-white border border-brand-200 p-6 hover:border-classic-green/40 hover:shadow-xl transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              
              <div className="relative z-10 text-center">
                <div className={`w-16 h-16 bg-${item.color}/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-${item.color}/20 transition-colors duration-300`}>
                  <item.icon className={`w-8 h-8 text-${item.color}`} />
                </div>
                <h4 className={`text-xl font-playfair text-brand-800 mb-3 group-hover:text-${item.color} transition-colors duration-300`}>
                  {item.label}
                </h4>
                <p className="text-brand-600 font-montserrat leading-relaxed">
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
