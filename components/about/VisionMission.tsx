'use client';

import { motion } from 'framer-motion';
import { Eye, Target, Sparkles, Shield } from 'lucide-react';

export default function VisionMission() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-didot text-white">
            Vision & <span className="text-bronze-gold">Mission</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/10 border border-white/20 p-8 hover:border-bronze-gold/40 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-bronze-gold/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-bronze-gold/30 to-bronze-gold/10 rounded-full flex items-center justify-center mb-6 border border-bronze-gold/30">
                <Eye className="w-8 h-8 text-bronze-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-didot text-white mb-4">Our Vision</h3>
              <p className="text-white/80 text-base leading-relaxed font-montserrat">
                At Solitario, we flip the script. Here, diamonds aren't exclusive indulgences but luxury that's accessible to all. Ethically crafted and tastefully designed, our pieces become an extension of your personality. We want your jewellery to be a tool of expression and a symbol of love, power, and joy.
              </p>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-bronze-gold/10 border border-bronze-gold/30 p-8 hover:border-bronze-gold/50 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-bronze-gold/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-bronze-gold/40 to-bronze-gold/20 rounded-full flex items-center justify-center mb-6 border border-bronze-gold/40">
                <Target className="w-8 h-8 text-bronze-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-didot text-white mb-4">Our Mission</h3>
              <p className="text-white/80 text-base leading-relaxed font-montserrat">
                We bling better. Our jewellery doesn't cost the Earth. Literally. With strong ethics powered by dynamic design, we create pieces that inspire and uplift. We take pride in our passion to make the world more consciously cool, one diamond at a time.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          {[
            { icon: Sparkles, label: 'Excellence', desc: 'Uncompromising quality' },
            { icon: Shield, label: 'Integrity', desc: 'Ethical practices' },
            { icon: Eye, label: 'Innovation', desc: 'Cutting-edge technology' },
            { icon: Target, label: 'Sustainability', desc: 'Planet-first approach' },
          ].map((item, idx) => (
            <div
              key={item.label}
              className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center"
            >
              <item.icon className="w-8 h-8 text-bronze-gold mx-auto mb-2" />
              <h4 className="text-lg font-didot text-white mb-1">{item.label}</h4>
              <p className="text-white/60 text-xs font-montserrat">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
