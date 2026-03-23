'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Clock, Globe, ExternalLink, Mail, ChevronDown, Store, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BlurText from '@/components/ui/BlurText';
import { LazyNearestStore } from '@/components/lazy';
import { Container } from '@/components/ui';
import {
  INDIA_OWN_STORES,
  INDIA_SIS_SHOPPERS_STOP,
  INDIA_SIS_JUST_IN_TIME,
  MALAYSIA_STORES,
  DUBAI_STORES,
  SPAIN_DISTRIBUTORS,
  type StoreLocation,
  type SpainDistributor,
} from '@/lib/stores-data';

export const dynamic = 'force-dynamic';

type Region = 'india' | 'malaysia' | 'dubai' | 'spain';
type IndiaTab = 'stores' | 'sis';
type SpainLang = 'es' | 'en';

// Spanish translations
const SPAIN_TRANSLATIONS: Record<string, Record<SpainLang, string>> = {
  distributors: { es: 'Distribuidores', en: 'Distributors' },
  touchPoints: { es: 'Puntos de venta', en: 'Touch Points' },
  viewCatalogue: { es: 'Ver catálogo', en: 'View Catalogue' },
  website: { es: 'Sitio web', en: 'Website' },
  address: { es: 'Dirección', en: 'Address' },
  phone: { es: 'Teléfono', en: 'Phone' },
  getDirections: { es: 'Cómo llegar', en: 'Get Directions' },
  ourStores: { es: 'Nuestras tiendas', en: 'Our Stores' },
  allLocations: { es: 'Todas las ubicaciones', en: 'All Locations' },
};

function t(key: string, lang: SpainLang): string {
  return SPAIN_TRANSLATIONS[key]?.[lang] ?? key;
}

// Region cards config
const REGIONS: { id: Region; label: string; subtitle: string; image: string }[] = [
  { id: 'india', label: 'Solitario India', subtitle: `${INDIA_OWN_STORES.length + INDIA_SIS_SHOPPERS_STOP.length + INDIA_SIS_JUST_IN_TIME.length}+ Stores`, image: '/images/Stores/IndiaStore.jpeg' },
  { id: 'malaysia', label: 'Solitario Malaysia', subtitle: `${MALAYSIA_STORES.length} Stores`, image: '/images/Stores/MalaysiaStore.jpeg' },
  { id: 'dubai', label: 'Solitario Dubai', subtitle: `${DUBAI_STORES.length} Store`, image: '/images/Stores/DubaiStore.jpeg' },
  { id: 'spain', label: 'Solitario Spain', subtitle: `${SPAIN_DISTRIBUTORS.reduce((sum, d) => sum + d.touchPoints.length, 0)}+ Touch Points`, image: '/images/Stores/SpainStore.jpeg' },
];

// Store card component
function StoreCard({ store, idx }: { store: StoreLocation; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
      className="rounded-2xl bg-white border border-brand-200 hover:border-classic-green/30 hover:shadow-brand-lg p-5 transition-all duration-500 flex flex-col h-full"
    >
      {store.image && (
        <div className="relative rounded-xl overflow-hidden mb-4 aspect-[4/3]">
          <Image src={store.image} alt={store.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      )}
      <h3 className="text-lg font-montserrat font-bold text-brand-800 mb-3">{store.name}</h3>
      <div className="space-y-2.5 flex-1">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-brand-700 text-sm font-montserrat leading-relaxed">{store.address}</p>
            <p className="text-brand-500 text-xs font-montserrat mt-0.5">{store.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-classic-green flex-shrink-0" />
          <a href={`tel:${store.phone}`} className="text-brand-700 text-sm font-montserrat hover:text-classic-green transition-colors">{store.phone}</a>
        </div>
        {store.email && (
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-classic-green flex-shrink-0" />
            <a href={`mailto:${store.email}`} className="text-brand-700 text-sm font-montserrat hover:text-classic-green transition-colors truncate">{store.email}</a>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-classic-green flex-shrink-0" />
          <p className="text-brand-700 text-sm font-montserrat">{store.hours}</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-brand-200">
        <a
          href={store.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-classic-green text-sm font-montserrat font-semibold uppercase tracking-wider hover:gap-3 transition-all"
        >
          Get Directions <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

// Spain touch point card
function TouchPointCard({ point, lang }: { point: { name: string; address: string; mapQuery: string; phone?: string }; lang: SpainLang }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-brand-100 last:border-0">
      <MapPin className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-montserrat font-semibold text-brand-800">{point.name}</p>
        <p className="text-xs font-montserrat text-brand-600 mt-0.5">{point.address}</p>
        {point.phone && (
          <a href={`tel:${point.phone}`} className="text-xs font-montserrat text-classic-green mt-0.5 inline-block hover:underline">{point.phone}</a>
        )}
      </div>
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(point.mapQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-classic-green hover:text-classic-green/80 transition-colors flex-shrink-0"
        title={t('getDirections', lang)}
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

export default function StoresPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const [indiaTab, setIndiaTab] = useState<IndiaTab>('stores');
  const [spainLang, setSpainLang] = useState<SpainLang>('es');
  const regionSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRegionClick = (region: Region) => {
    setActiveRegion(activeRegion === region ? null : region);
    setTimeout(() => {
      regionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const heroImageSrc = isMobile
    ? '/images/Stores/IndiaStore.jpeg'
    : '/images/general/WhatsApp Image 2024-12-10 at 11.49.40 (1).jpeg';

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Hero Section */}
      <section ref={sectionRef} className="relative min-h-[80vh] md:min-h-[91vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-gray-900/60 to-black/80 z-10" />
          <Image
            src={heroImageSrc}
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
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-montserrat font-bold text-white leading-[1.1] tracking-tight px-4"
              style={{
                fontFamily: 'var(--font-montserrat font-bold), serif',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                <BlurText text="Find" className="font-montserrat font-bold" animateBy="characters" direction="top" delay={50} stepDuration={0.4} />
                <BlurText text="Your" className="font-montserrat font-bold" animateBy="characters" direction="top" delay={150} stepDuration={0.4} />
                <BlurText text="Sparkle" className="font-montserrat font-bold" animateBy="characters" direction="top" delay={250} stepDuration={0.4} />
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

      {/* Nearest Store Section */}
      <LazyNearestStore showTitle={true} maxStores={3} />

      {/* Region Selector — 4 Cards */}
      <section className="py-12 md:py-16 bg-brand-100">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-classic-green text-xs uppercase tracking-[0.3em] font-gotham mb-4">
              All Locations
            </span>
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-800">
              Our <span className="text-classic-green">Stores</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {REGIONS.map((region, idx) => (
              <motion.button
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => handleRegionClick(region.id)}
                className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-500 text-left ${activeRegion === region.id
                  ? 'border-classic-green shadow-xl ring-2 ring-classic-green/20'
                  : 'border-brand-200 hover:border-classic-green/40 hover:shadow-lg'
                  }`}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={region.image}
                    alt={region.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-montserrat font-bold text-white mb-1">{region.label}</h3>
                  <p className="text-white/70 text-xs md:text-sm font-montserrat">{region.subtitle}</p>
                  {activeRegion === region.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2"
                    >
                      <ChevronDown className="w-5 h-5 text-classic-green animate-bounce" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </Container>
      </section>

      {/* Expanded Region Section */}
      <div ref={regionSectionRef}>
        <AnimatePresence mode="wait">
          {activeRegion && (
            <motion.section
              key={activeRegion}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {/* INDIA */}
              {activeRegion === 'india' && (
                <div className="py-12 md:py-16 bg-white">
                  <Container>
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-brand-800 mb-4">
                        Solitario <span className="text-classic-green">India</span>
                      </h2>
                      {/* Tab buttons */}
                      <div className="inline-flex rounded-xl bg-brand-100 p-1 gap-1">
                        <button
                          onClick={() => setIndiaTab('stores')}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-montserrat font-semibold transition-all duration-300 ${indiaTab === 'stores'
                            ? 'bg-classic-green text-white shadow-md'
                            : 'text-brand-600 hover:text-brand-800'
                            }`}
                        >
                          <Store className="w-4 h-4" /> Our Stores
                        </button>
                        <button
                          onClick={() => setIndiaTab('sis')}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-montserrat font-semibold transition-all duration-300 ${indiaTab === 'sis'
                            ? 'bg-classic-green text-white shadow-md'
                            : 'text-brand-600 hover:text-brand-800'
                            }`}
                        >
                          <ShoppingBag className="w-4 h-4" /> Shop-in-Shop
                        </button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {indiaTab === 'stores' && (
                        <motion.div
                          key="stores"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {INDIA_OWN_STORES.map((store, idx) => (
                              <StoreCard key={store.id} store={store} idx={idx} />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {indiaTab === 'sis' && (
                        <motion.div
                          key="sis"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Shoppers Stop */}
                          <div className="mb-10">
                            <h3 className="text-xl font-montserrat font-bold text-brand-800 mb-5 flex items-center gap-2">
                              <ShoppingBag className="w-5 h-5 text-classic-green" /> Shoppers Stop
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                              {INDIA_SIS_SHOPPERS_STOP.map((store, idx) => (
                                <StoreCard key={store.id} store={store} idx={idx} />
                              ))}
                            </div>
                          </div>

                          {/* Just In Time */}
                          <div>
                            <h3 className="text-xl font-montserrat font-bold text-brand-800 mb-5 flex items-center gap-2">
                              <Clock className="w-5 h-5 text-classic-green" /> Just In Time
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                              {INDIA_SIS_JUST_IN_TIME.map((store, idx) => (
                                <StoreCard key={store.id} store={store} idx={idx} />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Container>
                </div>
              )}

              {/* MALAYSIA */}
              {activeRegion === 'malaysia' && (
                <div className="py-12 md:py-16 bg-white">
                  <Container>
                    <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-brand-800 mb-8 text-center">
                      Solitario <span className="text-classic-green">Malaysia</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      {MALAYSIA_STORES.map((store, idx) => (
                        <StoreCard key={store.id} store={store} idx={idx} />
                      ))}
                    </div>
                  </Container>
                </div>
              )}

              {/* DUBAI */}
              {activeRegion === 'dubai' && (
                <div className="py-12 md:py-16 bg-white">
                  <Container>
                    <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-brand-800 mb-8 text-center">
                      Solitario <span className="text-classic-green">Dubai</span>
                    </h2>
                    <div className="max-w-lg mx-auto">
                      {DUBAI_STORES.map((store, idx) => (
                        <StoreCard key={store.id} store={store} idx={idx} />
                      ))}
                    </div>
                  </Container>
                </div>
              )}

              {/* SPAIN */}
              {activeRegion === 'spain' && (
                <div className="py-12 md:py-16 bg-white">
                  <Container>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-brand-800">
                        Solitario <span className="text-classic-green">España</span>
                      </h2>
                      {/* EN/ES Toggle */}
                      <div className="inline-flex rounded-lg bg-brand-100 p-0.5 gap-0.5">
                        <button
                          onClick={() => setSpainLang('es')}
                          className={`px-3 py-1.5 rounded-md text-xs font-montserrat font-bold transition-all ${spainLang === 'es'
                            ? 'bg-classic-green text-white'
                            : 'text-brand-600 hover:text-brand-800'
                            }`}
                        >
                          ES
                        </button>
                        <button
                          onClick={() => setSpainLang('en')}
                          className={`px-3 py-1.5 rounded-md text-xs font-montserrat font-bold transition-all ${spainLang === 'en'
                            ? 'bg-classic-green text-white'
                            : 'text-brand-600 hover:text-brand-800'
                            }`}
                        >
                          EN
                        </button>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {SPAIN_DISTRIBUTORS.map((distributor) => (
                        <motion.div
                          key={distributor.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="rounded-2xl bg-brand-50 border border-brand-200 overflow-hidden"
                        >
                          {/* Distributor header */}
                          <div className="p-5 md:p-6 border-b border-brand-200 bg-white">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                              <div>
                                <p className="text-xs font-montserrat text-classic-green uppercase tracking-wider font-semibold mb-1">
                                  {t('distributors', spainLang)}
                                </p>
                                <h3 className="text-xl font-montserrat font-bold text-brand-800">{distributor.name}</h3>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <a
                                  href={distributor.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-classic-green text-sm font-montserrat font-semibold hover:underline"
                                >
                                  <Globe className="w-3.5 h-3.5" /> {t('website', spainLang)}
                                </a>
                                {distributor.figmaLink && (
                                  <Link
                                    href={distributor.figmaLink}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-classic-green/10 border border-classic-green/25 text-classic-green text-xs font-gotham font-bold uppercase tracking-wider hover:bg-classic-green hover:text-white transition-all duration-300"
                                  >
                                    Solitario España <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Touch points */}
                          <div className="p-5 md:p-6">
                            <p className="text-xs font-montserrat text-brand-500 uppercase tracking-wider font-semibold mb-3">
                              {t('touchPoints', spainLang)} ({distributor.touchPoints.length})
                            </p>
                            <div className="grid md:grid-cols-2 gap-x-8">
                              {distributor.touchPoints.map((point) => (
                                <TouchPointCard key={point.name} point={point} lang={spainLang} />
                              ))}
                            </div>

                            {/* CTA Button */}
                            {distributor.ctaLink && (
                              <div className="mt-6 pt-4 border-t border-brand-200">
                                <a
                                  href={distributor.ctaLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-classic-green text-white rounded-lg text-sm font-montserrat font-semibold hover:bg-classic-green/90 transition-all"
                                >
                                  {distributor.ctaLabel || t('viewCatalogue', spainLang)} <ArrowRight className="w-4 h-4" />
                                </a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Container>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-classic-green">
        <Container size="md" className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white mb-6">
              Can&apos;t Visit a <span className="text-bronze-gold">Store</span>?
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
        </Container>
      </section>
    </div>
  );
}
