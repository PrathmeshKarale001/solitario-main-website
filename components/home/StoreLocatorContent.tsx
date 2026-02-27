'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ExternalLink, Globe, ArrowRight, ChevronDown, Store, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import {
    INDIA_OWN_STORES,
    INDIA_SIS_SHOPPERS_STOP,
    INDIA_SIS_JUST_IN_TIME,
    MALAYSIA_STORES,
    DUBAI_STORES,
    SPAIN_DISTRIBUTORS,
    type StoreLocation,
} from '@/lib/stores-data';

type Region = 'india' | 'malaysia' | 'dubai' | 'spain';
type IndiaTab = 'stores' | 'sis';
type SpainLang = 'es' | 'en';

const SPAIN_T: Record<string, Record<SpainLang, string>> = {
    distributors: { es: 'Distribuidores', en: 'Distributors' },
    touchPoints: { es: 'Puntos de venta', en: 'Touch Points' },
    website: { es: 'Sitio web', en: 'Website' },
    getDirections: { es: 'Cómo llegar', en: 'Get Directions' },
};

const REGIONS: { id: Region; label: string; subtitle: string; image: string }[] = [
    { id: 'india', label: 'India', subtitle: `${INDIA_OWN_STORES.length + INDIA_SIS_SHOPPERS_STOP.length + INDIA_SIS_JUST_IN_TIME.length}+ Stores`, image: '/images/Stores/IndiaStore.jpeg' },
    { id: 'malaysia', label: 'Malaysia', subtitle: `${MALAYSIA_STORES.length} Stores`, image: '/images/Stores/MalaysiaStore.jpeg' },
    { id: 'dubai', label: 'Dubai', subtitle: `${DUBAI_STORES.length} Store`, image: '/images/Stores/DubaiStore.jpeg' },
    { id: 'spain', label: 'Spain', subtitle: `${SPAIN_DISTRIBUTORS.reduce((s, d) => s + d.touchPoints.length, 0)}+ Points`, image: '/images/Stores/SpainStore.jpeg' },
];

function MiniStoreCard({ store }: { store: StoreLocation }) {
    return (
        <div className="rounded-xl bg-white border border-brand-200 p-4 hover:border-classic-green/30 hover:shadow-md transition-all duration-300">
            {store.image && (
                <div className="relative rounded-lg overflow-hidden mb-3 aspect-[16/10]">
                    <Image src={store.image} alt={store.name} fill className="object-cover" sizes="300px" />
                </div>
            )}
            <h4 className="text-sm font-montserrat font-bold text-brand-800 mb-2">{store.name}</h4>
            <div className="space-y-1.5 text-xs font-montserrat text-brand-600">
                <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-classic-green flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-classic-green flex-shrink-0" />
                    <a href={`tel:${store.phone}`} className="hover:text-classic-green transition-colors">{store.phone}</a>
                </div>
                {store.email && (
                    <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-classic-green flex-shrink-0" />
                        <a href={`mailto:${store.email}`} className="hover:text-classic-green transition-colors truncate">{store.email}</a>
                    </div>
                )}
            </div>
            <div className="mt-3 pt-2 border-t border-brand-100">
                <a href={store.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-classic-green text-xs font-montserrat font-semibold hover:gap-2.5 transition-all">
                    Get Directions <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}

export default function StoreLocatorContent({ initialRegion }: { initialRegion?: Region | null }) {
    const [activeRegion, setActiveRegion] = useState<Region | null>(initialRegion ?? null);
    const [indiaTab, setIndiaTab] = useState<IndiaTab>('stores');
    const [spainLang, setSpainLang] = useState<SpainLang>('es');

    return (
        <div className="p-5 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
                <span className="inline-block text-classic-green text-[10px] uppercase tracking-[0.3em] font-gotham mb-2">All Locations</span>
                <h2 className="text-xl md:text-2xl font-montserrat font-bold text-brand-800">
                    Our <span className="text-classic-green">Stores</span>
                </h2>
            </div>

            {/* Region Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {REGIONS.map((region) => (
                    <button
                        key={region.id}
                        onClick={() => setActiveRegion(activeRegion === region.id ? null : region.id)}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 text-left ${activeRegion === region.id
                            ? 'border-classic-green ring-1 ring-classic-green/20 shadow-lg'
                            : 'border-brand-200 hover:border-classic-green/40'
                            }`}
                    >
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image src={region.image} alt={region.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="text-sm font-montserrat font-bold text-white">{region.label}</h3>
                            <p className="text-white/70 text-[10px] font-montserrat">{region.subtitle}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Expanded Content */}
            <AnimatePresence mode="wait">
                {activeRegion && (
                    <motion.div
                        key={activeRegion}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                    >
                        {/* INDIA */}
                        {activeRegion === 'india' && (
                            <div>
                                <div className="flex items-center justify-center gap-2 mb-5">
                                    <div className="inline-flex rounded-lg bg-brand-100 p-0.5 gap-0.5">
                                        <button onClick={() => setIndiaTab('stores')} className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-montserrat font-semibold transition-all ${indiaTab === 'stores' ? 'bg-classic-green text-white' : 'text-brand-600 hover:text-brand-800'}`}>
                                            <Store className="w-3.5 h-3.5" /> Our Stores
                                        </button>
                                        <button onClick={() => setIndiaTab('sis')} className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-montserrat font-semibold transition-all ${indiaTab === 'sis' ? 'bg-classic-green text-white' : 'text-brand-600 hover:text-brand-800'}`}>
                                            <ShoppingBag className="w-3.5 h-3.5" /> Shop-in-Shop
                                        </button>
                                    </div>
                                </div>
                                <AnimatePresence mode="wait">
                                    {indiaTab === 'stores' ? (
                                        <motion.div key="own" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {INDIA_OWN_STORES.map((s) => <MiniStoreCard key={s.id} store={s} />)}
                                        </motion.div>
                                    ) : (
                                        <motion.div key="sis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <div className="mb-5">
                                                <h4 className="text-sm font-montserrat font-bold text-brand-800 mb-3 flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-classic-green" /> Shoppers Stop</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {INDIA_SIS_SHOPPERS_STOP.map((s) => <MiniStoreCard key={s.id} store={s} />)}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-montserrat font-bold text-brand-800 mb-3 flex items-center gap-1.5"><Clock className="w-4 h-4 text-classic-green" /> Just In Time</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {INDIA_SIS_JUST_IN_TIME.map((s) => <MiniStoreCard key={s.id} store={s} />)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* MALAYSIA */}
                        {activeRegion === 'malaysia' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                                {MALAYSIA_STORES.map((s) => <MiniStoreCard key={s.id} store={s} />)}
                            </div>
                        )}

                        {/* DUBAI */}
                        {activeRegion === 'dubai' && (
                            <div className="max-w-md mx-auto">
                                {DUBAI_STORES.map((s) => <MiniStoreCard key={s.id} store={s} />)}
                            </div>
                        )}

                        {/* SPAIN */}
                        {activeRegion === 'spain' && (
                            <div>
                                <div className="flex justify-end mb-4">
                                    <div className="inline-flex rounded-md bg-brand-100 p-0.5 gap-0.5">
                                        <button onClick={() => setSpainLang('es')} className={`px-2.5 py-1 rounded text-[10px] font-montserrat font-bold transition-all ${spainLang === 'es' ? 'bg-classic-green text-white' : 'text-brand-600'}`}>ES</button>
                                        <button onClick={() => setSpainLang('en')} className={`px-2.5 py-1 rounded text-[10px] font-montserrat font-bold transition-all ${spainLang === 'en' ? 'bg-classic-green text-white' : 'text-brand-600'}`}>EN</button>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    {SPAIN_DISTRIBUTORS.map((dist) => (
                                        <div key={dist.name} className="rounded-xl bg-brand-50 border border-brand-200 overflow-hidden">
                                            <div className="p-4 border-b border-brand-200 bg-white flex items-center justify-between flex-wrap gap-2">
                                                <div>
                                                    <p className="text-[10px] font-montserrat text-classic-green uppercase tracking-wider font-semibold">{SPAIN_T.distributors[spainLang]}</p>
                                                    <h4 className="text-base font-montserrat font-bold text-brand-800">{dist.name}</h4>
                                                </div>
                                                <a href={dist.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-classic-green text-xs font-montserrat font-semibold hover:underline">
                                                    <Globe className="w-3 h-3" /> {SPAIN_T.website[spainLang]}
                                                </a>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-[10px] font-montserrat text-brand-500 uppercase tracking-wider font-semibold mb-2">{SPAIN_T.touchPoints[spainLang]} ({dist.touchPoints.length})</p>
                                                <div className="grid md:grid-cols-2 gap-x-6">
                                                    {dist.touchPoints.map((pt) => (
                                                        <div key={pt.name} className="flex items-start gap-2 py-2 border-b border-brand-100 last:border-0">
                                                            <MapPin className="w-3.5 h-3.5 text-classic-green flex-shrink-0 mt-0.5" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-montserrat font-semibold text-brand-800">{pt.name}</p>
                                                                <p className="text-[11px] font-montserrat text-brand-600">{pt.address}</p>
                                                                {pt.phone && <a href={`tel:${pt.phone}`} className="text-[11px] font-montserrat text-classic-green hover:underline">{pt.phone}</a>}
                                                            </div>
                                                            <a href={`https://maps.google.com/?q=${encodeURIComponent(pt.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="text-classic-green flex-shrink-0"><ExternalLink className="w-3 h-3" /></a>
                                                        </div>
                                                    ))}
                                                </div>
                                                {dist.ctaLink && (
                                                    <div className="mt-4 pt-3 border-t border-brand-200">
                                                        <a href={dist.ctaLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-classic-green text-white rounded-lg text-xs font-montserrat font-semibold hover:bg-classic-green/90 transition-all">
                                                            {dist.ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
