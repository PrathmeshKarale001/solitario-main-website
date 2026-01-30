'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail } from 'lucide-react';

const FOUNDERS = [
  {
    id: 'ricky',
    name: 'Ricky Vasandani',
    title: 'Chief Executive Officer',
    image: '/about/IMG_0061.JPG',
    signature: '/images/Signatures/ricky-vasandani-png.png',
    bio: 'Born in Africa, Ricky is a visionary entrepreneur who has lived across four continents of the world. Hailing from a family that has successfully scaled a legacy diamond jewellery business over decades, Ricky brings his acumen in the diamond jewellery business to the fore with Solitario Diamonds. His business ventures in the Sports and F&B domains are a major success story in Spain. Ricky drives the day-to-day business at Solitario Diamonds with unmatched expertise in Marketing & Operations. ',
  },
  {
    id: 'vivek',
    name: 'Dr. Vivek Anand Oberoi',
    title: 'Co-Founder',
    image: '/about/vivek-oberoi.jpg',
    signature: '/images/Signatures/vivek-oberoi-signature.png',
    bio: 'Dr. Vivek Anand Oberoi is a distinguished actor, entrepreneur, and philanthropist. With 47 films across seven languages and an Emmy nomination for "Inside Edge," Vivek brings exceptional entrepreneurial acumen to Solitario. Recognized as one of the Top 40 Philanthropists globally, he shapes strategies that enhance profitability while aligning with ethical business conduct and social impact.',
  },
];

const CORE_TEAM = [
  {
    id: 'anurag',
    name: 'Anurag Lunia',
    title: 'Chief Operating Officer',
    image: '/about/anurag-lunia.jpg',
    email: 'anurag@thesolitario.com',
    bio: 'Visionary retail strategist driving Solitario\'s global expansion. Former Phoenix Mills leader with 67% footfall growth success.',
  },
  {
    id: 'kamini',
    name: 'Kamini Singh',
    title: 'Chief Business Officer',
    image: '/about/IMG_0373.JPG',
    email: 'kamini@thesolitario.com',
    bio: 'Expert in retail leasing and business development. Drives strategic partnerships for luxury retail expansion.',
  },
  {
    id: 'kabir',
    name: 'Kabir Kate',
    title: 'Chief Marketing Officer',
    image: '/about/kabir-kate.jpg',
    email: 'kabir@thesolitario.com',
    bio: 'Leads brand strategy and digital marketing. Creates innovative campaigns for market presence and engagement.',
  },
];

export default function Founders() {
  return (
    <section className="pt-12 pb-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-bronze-gold text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4">
            Our Founders
          </span>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-classic-green mb-4" style={{ letterSpacing: '-0.02em' }}>
            Shine with <span className="text-bronze-gold">Solitario</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto font-montserrat">
            Visionaries committed to revolutionizing the diamond industry through sustainable practices and ethical business.
          </p>
        </motion.div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {FOUNDERS.map((founder, index) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 hover:border-bronze-gold/30 shadow-lg transition-all duration-500 group"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative w-full overflow-hidden min-h-[520px] md:min-h-[610px]">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-playfair text-gray-900 mb-2">
                    {founder.name}
                  </h3>
                  <p className="text-bronze-gold font-gotham uppercase tracking-wider text-sm mb-4">
                    {founder.title}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed font-montserrat mb-4">
                    {founder.bio}
                  </p>
                  {/* Signature */}
                  {founder.signature && (
                    <div className="mt-auto pt-4">
                      <Image
                        src={founder.signature}
                        alt={`${founder.name} Signature`}
                        width={150}
                        height={60}
                        className="brightness-0 opacity-70"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-bronze-gold text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4">
            Core Team
          </span>
          <h3 className="text-xl sm:text-2xl md:text-4xl font-playfair text-classic-green" style={{ letterSpacing: '-0.02em' }}>
            The Minds Behind the <span className="text-bronze-gold">Brilliance</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CORE_TEAM.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-bronze-gold/30 shadow-lg transition-all duration-500 group text-center p-6"
            >
              {/* Image */}
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-bronze-gold/30">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                    member.id === 'kamini' ? 'scale-150 object-top' : ''
                  }`}
                />
              </div>

              {/* Content */}
              <h4 className="text-xl font-playfair text-gray-900 mb-1">
                {member.name}
              </h4>
              <p className="text-bronze-gold font-gotham uppercase tracking-wider text-xs mb-3">
                {member.title}
              </p>
              
              {/* Bio */}
              {member.bio && (
                <p className="text-gray-600 text-sm leading-relaxed font-montserrat mb-4">
                  {member.bio}
                </p>
              )}
              
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-bronze-gold text-sm font-montserrat transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                {member.email}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
