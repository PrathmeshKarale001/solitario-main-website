'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Clock, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BlurText from '@/components/ui/BlurText';

const GLOBAL_STORES = [
  {
    id: 'spain',
    name: 'Solitario Spain',
    location: 'Spain',
    country: 'Europe',
    image: '/solitario/stores/spain.jpg',
    description: 'Experience luxury lab-grown diamonds in the heart of Spain. Our European flagship brings Solitario\'s brilliance to the Mediterranean.',
    mapLink: 'https://maps.google.com/?q=' + encodeURIComponent('Solitario Spain'),
    featured: true,
  },
  {
    id: 'malaysia',
    name: 'Solitario Malaysia',
    location: 'Malaysia',
    country: 'Asia Pacific',
    image: '/solitario/stores/malaysia.jpg',
    description: 'Discover sustainable luxury in Southeast Asia. Our Malaysian store showcases the finest lab-grown diamond collections.',
    mapLink: 'https://maps.google.com/?q=' + encodeURIComponent('Solitario Malaysia'),
    featured: true,
  },
  {
    id: 'dubai',
    name: 'Solitario Dubai',
    location: 'Dubai, UAE',
    country: 'Middle East',
    image: '/solitario/stores/dubai.jpg',
    description: 'Luxury meets innovation in the jewel of the Middle East. Experience Solitario\'s exclusive collections in Dubai.',
    mapLink: 'https://maps.google.com/?q=' + encodeURIComponent('Solitario Dubai Dubai, UAE'),
    featured: true,
  },
];

const INDIA_STORES = [
  // Pune Stores
  {
    id: 'pune-phoenix-millennium',
    name: 'Phoenix Mall of the Millennium',
    address: 'Phoenix Mall of the Millennium, Wakad',
    city: 'Pune',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Mall+of+the+Millennium+Wakad,+Pune',
  },
  {
    id: 'pune-pavilion',
    name: 'Pavilion Mall',
    address: 'Pavilion Mall, Shivajinagar',
    city: 'Pune',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Pavillion+Mall,+Pune',
  },
  {
    id: 'pune-baner',
    name: 'Baner',
    address: 'Baner Road',
    city: 'Pune',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Baner,+Pune',
  },
  {
    id: 'pune-phoenix-marketcity',
    name: 'Phoenix Marketcity',
    address: 'Phoenix Marketcity, Viman Nagar',
    city: 'Pune',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Marketcity,+Pune',
  },
  {
    id: 'pune-koregaon-park',
    name: 'Koregaon Park',
    address: 'Koregaon Park',
    city: 'Pune',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Koregaon+Park,+Pune',
  },
  {
    id: 'pune-nibm',
    name: 'NIBM',
    address: 'NIBM Road',
    city: 'Pune',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+NIBM,+Pune',
  },
  // Mumbai Stores
  {
    id: 'mumbai-phoenix-kurla',
    name: 'Phoenix Marketcity Kurla',
    address: 'Phoenix Marketcity, Kurla West',
    city: 'Mumbai',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Marketcity+Kurla,+Mumbai',
  },
  {
    id: 'mumbai-sky-city-borivali',
    name: 'Sky City Mall Borivali',
    address: 'First Floor, Sky City Mall, Borivali East',
    city: 'Mumbai',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Sky+City+Mall+Borivali,+Mumbai',
  },
  {
    id: 'mumbai-infiniti-malad',
    name: 'Infiniti Mall Malad',
    address: 'Infiniti Mall, Malad West',
    city: 'Mumbai',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Infiniti+Mall+Malad,+Mumbai',
  },
  {
    id: 'mumbai-r-city-ghatkopar',
    name: 'R City Mall Ghatkopar',
    address: 'R City Mall, Ghatkopar West',
    city: 'Mumbai',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+R+City+Mall+Ghatkopar,+Mumbai',
  },
  {
    id: 'mumbai-oberoi-mall-goregaon',
    name: 'Oberoi Mall Goregaon',
    address: 'Oberoi Mall, Goregaon East',
    city: 'Mumbai',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Oberoi+Mall+Goregaon,+Mumbai',
  },
  {
    id: 'mumbai-viviana-thane',
    name: 'Viviana Mall Thane',
    address: 'Viviana Mall, Thane West',
    city: 'Mumbai',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Viviana+Mall+Thane,+Mumbai',
  },
  // Other Cities
  {
    id: 'hyderabad-sarath-city',
    name: 'Sarath City Capital Mall',
    address: 'Sarath City Capital Mall, Kondapur',
    city: 'Hyderabad',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Sarath+City+Capital+Mall,+Hyderabad',
  },
  {
    id: 'bangalore-phoenix-marketcity',
    name: 'Phoenix Marketcity',
    address: 'Phoenix Marketcity, Whitefield',
    city: 'Bangalore',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Marketcity,+Bangalore',
  },
  {
    id: 'ahmedabad-palladium',
    name: 'Palladium Mall',
    address: 'Palladium Mall, SG Highway',
    city: 'Ahmedabad',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Palladium+Mall,+Ahmedabad',
  },
  {
    id: 'surat-vr-mall',
    name: 'VR Mall',
    address: 'VR Mall, Dumas Road',
    city: 'Surat',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+VR+Mall,+Surat',
  },
  {
    id: 'indore-phoenix-citadel',
    name: 'Phoenix Citadel',
    address: 'Phoenix Citadel Mall',
    city: 'Indore',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Citadel,+Indore',
  },
  {
    id: 'lucknow-phoenix-palassio',
    name: 'Phoenix Palassio',
    address: 'Phoenix Palassio Mall',
    city: 'Lucknow',
    phone: '+91 788 788 3444',
    hours: '10:00 AM - 11:00 PM',
    mapLink: 'https://maps.google.com/?q=Solitario+Diamonds+Phoenix+Palassio,+Lucknow',
  },
];

export default function StoresPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Hero Section */}
      <section ref={sectionRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-gray-900/60 to-black/80 z-10" />
          <Image
            src="/images/general/WhatsApp Image 2024-12-10 at 11.49.40 (1).jpeg"
            alt="Solitario Stores"
            fill
            className="object-cover object-center"
            priority
            quality={85}
            sizes="100vw"
          />
        </motion.div>

        <motion.div
          className="relative z-10 text-center px-4 pt-24 md:pt-32"
          style={{ y: textY }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block text-bronze-gold text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4"
            >
              Global Takeover
            </motion.span>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair text-white leading-[1.1] tracking-tight px-4"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                <BlurText
                  text="Find"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={50}
                  stepDuration={0.4}
                />
                <BlurText
                  text="Your"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={150}
                  stepDuration={0.4}
                />
                <BlurText
                  text="Sparkle"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={250}
                  stepDuration={0.4}
                />
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-6 text-sm md:text-base lg:text-lg text-white/80 font-montserrat max-w-2xl mx-auto"
            >
              Visit our stores across the globe and experience the brilliance of lab-grown diamonds in person.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Global Stores */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-classic-green text-xs uppercase tracking-[0.3em] font-gotham mb-4">
              International Presence
            </span>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800" style={{ letterSpacing: '-0.02em' }}>
              Our <span className="text-classic-green">Global</span> Stores
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {GLOBAL_STORES.map((store, idx) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative rounded-3xl overflow-hidden"
              >
                <a
                  href={store.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`Show ${store.name} on map`}
                />
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={store.image}
                    alt={store.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  {/* Country Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-bronze-gold/90 text-white text-xs font-gotham uppercase tracking-wider rounded-full">
                      <Globe className="w-3 h-3" /> {store.country}
                    </span>
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-playfair text-white mb-2">{store.name}</h3>
                  <div className="flex items-center gap-2 text-white/70 text-sm font-montserrat mb-3">
                    <MapPin className="w-4 h-4 text-bronze-gold" />
                    {store.location}
                  </div>
                  <p className="text-white/60 text-sm font-montserrat mb-4 line-clamp-2">
                    {store.description}
                  </p>
                  <a
                    href={store.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-20 inline-flex items-center gap-2 text-bronze-gold text-sm font-gotham uppercase tracking-wider group-hover:gap-3 transition-all"
                  >
                    Show on Map <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* India Stores */}
      <section className="py-24 px-4 bg-brand-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-classic-green text-xs uppercase tracking-[0.3em] font-gotham mb-4">
              India
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair text-brand-800">
              Stores Across <span className="text-classic-green">India</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {INDIA_STORES.map((store, idx) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl bg-white border border-brand-200 hover:border-classic-green/30 hover:shadow-brand-lg p-6 transition-all duration-500"
              >
                <h3 className="text-xl font-playfair text-brand-800 mb-4">{store.name}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-classic-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-brand-700 text-sm font-montserrat">{store.address}</p>
                      <p className="text-brand-500 text-sm font-montserrat">{store.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-classic-green flex-shrink-0" />
                    <a href={`tel:${store.phone}`} className="text-brand-700 text-sm font-montserrat hover:text-classic-green transition-colors">
                      {store.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-classic-green flex-shrink-0" />
                    <p className="text-brand-700 text-sm font-montserrat">{store.hours}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-200">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address + ' ' + store.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-classic-green text-sm font-gotham uppercase tracking-wider hover:gap-3 transition-all"
                  >
                    Get Directions <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-classic-green">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-white mb-6">
              Can't Visit a <span className="text-bronze-gold">Store</span>?
            </h2>
            <p className="text-white/80 font-montserrat mb-8">
              Shop our complete collection online and get your diamonds delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 text-classic-green font-gotham uppercase tracking-[0.25em] text-sm rounded-lg bg-white hover:bg-ivory-pearl transition-all duration-500 hover:scale-105"
              >
                Shop Online <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-gotham uppercase tracking-[0.25em] text-sm rounded-lg border border-white/40 hover:bg-white/10 transition-all duration-500 hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
