'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  ChevronDown,
  CheckCircle,
  Sparkles,
  Award,
  Shield,
  Star,
  Send,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SPAIN_DISTRIBUTORS } from '@/lib/stores-data';

// ---------------------------------------------------------------------------
// 4 C's DATA
// ---------------------------------------------------------------------------
const FOUR_CS = [
  {
    id: 'color',
    label: 'Color',
    emoji: '🎨',
    body: `La evaluación del color en un diamante se basa en la ausencia de color. Cuanto más incoloro, mayor es su valor. La escala de clasificación va de D (incoloro) a Z (tonos amarillos o marrones visibles), siendo los diamantes D-F los más valorados por su pureza óptica.

Aunque la mayoría de los diamantes varían entre blanco y amarillo, también existen los diamantes fancy color, con tonos vibrantes como azul, rosa o amarillo intenso, apreciados por su exclusividad y profundidad de color.

En Solitario, ofrecemos una selección de diamantes cultivados en laboratorio con tonalidades excepcionales, principalmente en acabados E, F y G, garantizando belleza, brillo y calidad en cada elección.`,
  },
  {
    id: 'claridad',
    label: 'Claridad',
    emoji: '🔬',
    body: `La claridad de un diamante hace referencia a su pureza. Cuanto más limpio y libre de imperfecciones, mayor es su clasificación y valor.

Durante su crecimiento, los diamantes pueden desarrollar características internas llamadas inclusiones y externas conocidas como "blemishes" (imperfecciones superficiales). La evaluación de la claridad se basa en la cantidad, tamaño, posición y visibilidad de estas características, así como en su impacto en la apariencia general de la gema.

En Solitario, nuestros diamantes cultivados en laboratorio presentan una claridad excepcional, garantizando una pureza y brillo extraordinarios en cada pieza.`,
  },
  {
    id: 'talla',
    label: 'Talla',
    emoji: '💎',
    body: `La talla es, quizás, el aspecto más importante en la calidad de un diamante, ya que determina su belleza y brillo. No se refiere a la forma de la piedra, sino a la precisión de sus ángulos, proporciones, simetría y acabado, elementos clave para potenciar su brillo, fuego y centelleo.

Un diamante bien tallado refleja la luz de manera óptima, logrando un destello inigualable. En Solitario, seleccionamos diamantes cultivados con tallas excepcionales para garantizar el máximo resplandor en cada pieza.`,
  },
  {
    id: 'quilate',
    label: 'Quilate',
    emoji: '⚖️',
    body: `El quilate (ct) es la unidad de medida que indica el peso de un diamante. Por ejemplo, un diamante redondo de 1 ct mide aproximadamente 6.5 mm de diámetro.

Factores como la densidad, la forma y la proporción pueden influir en el peso de una piedra sin afectar su tamaño visual. Cuando una joya incluye más de un diamante o gema, se utiliza el término Total Carat Weight (TCW) para referirse al peso total de todas las piedras combinadas.

En Solitario, ofrecemos una variedad de quilates para que encuentres el equilibrio perfecto entre tamaño, brillo y elegancia.`,
  },
];

// All Geresa touch points
const GERESA_DISTRIBUTOR = SPAIN_DISTRIBUTORS.find((d) => d.name === 'Geresa')!;

// ---------------------------------------------------------------------------
// CONTACT FORM COMPONENT
// ---------------------------------------------------------------------------
function ContactForm() {
  const [formState, setFormState] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    mensaje: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-8"
      >
        <div className="w-16 h-16 rounded-full bg-classic-green/15 border border-classic-green/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-classic-green" />
        </div>
        <h3 className="text-2xl font-montserrat font-bold text-brand-800 mb-3">
          ¡Mensaje enviado!
        </h3>
        <p className="text-brand-600 font-montserrat">
          Nos pondremos en contacto contigo en breve.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-brand-700 text-sm font-montserrat font-semibold mb-1.5">
            Nombre
          </label>
          <input
            type="text"
            required
            value={formState.nombre}
            onChange={(e) => setFormState((s) => ({ ...s, nombre: e.target.value }))}
            placeholder="Tu nombre"
            className="w-full px-4 py-3 rounded-xl bg-white border border-brand-200 text-brand-800 font-montserrat text-sm focus:border-classic-green focus:ring-2 focus:ring-classic-green/20 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-brand-700 text-sm font-montserrat font-semibold mb-1.5">
            Apellidos
          </label>
          <input
            type="text"
            required
            value={formState.apellidos}
            onChange={(e) => setFormState((s) => ({ ...s, apellidos: e.target.value }))}
            placeholder="Tus apellidos"
            className="w-full px-4 py-3 rounded-xl bg-white border border-brand-200 text-brand-800 font-montserrat text-sm focus:border-classic-green focus:ring-2 focus:ring-classic-green/20 focus:outline-none transition-all"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-brand-700 text-sm font-montserrat font-semibold mb-1.5">
            Teléfono
          </label>
          <input
            type="tel"
            value={formState.telefono}
            onChange={(e) => setFormState((s) => ({ ...s, telefono: e.target.value }))}
            placeholder="+34 XXX XXX XXX"
            className="w-full px-4 py-3 rounded-xl bg-white border border-brand-200 text-brand-800 font-montserrat text-sm focus:border-classic-green focus:ring-2 focus:ring-classic-green/20 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-brand-700 text-sm font-montserrat font-semibold mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            required
            value={formState.email}
            onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 rounded-xl bg-white border border-brand-200 text-brand-800 font-montserrat text-sm focus:border-classic-green focus:ring-2 focus:ring-classic-green/20 focus:outline-none transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-brand-700 text-sm font-montserrat font-semibold mb-1.5">
          Mensaje
        </label>
        <textarea
          rows={5}
          value={formState.mensaje}
          onChange={(e) => setFormState((s) => ({ ...s, mensaje: e.target.value }))}
          placeholder="¿En qué podemos ayudarte?"
          className="w-full px-4 py-3 rounded-xl bg-white border border-brand-200 text-brand-800 font-montserrat text-sm focus:border-classic-green focus:ring-2 focus:ring-classic-green/20 focus:outline-none transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-classic-green to-classic-green/80 text-white font-gotham uppercase tracking-[0.2em] text-sm font-bold hover:opacity-90 transition-all disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Enviando...
          </span>
        ) : (
          <>
            Enviar consulta <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------
export default function GeresaPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [activeC, setActiveC] = useState<string | null>(null);

  // Geresa store locator data — all touch points grouped by region
  const touchPoints = GERESA_DISTRIBUTOR?.touchPoints ?? [];

  return (
    <div className="min-h-screen bg-[#F9F7F4]">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[600px] overflow-hidden flex items-end"
      >
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src="/images/geresa/geresa-hero.jpg"
            alt="Solitario España — Diamantes Cultivados en Laboratorio"
            fill
            priority
            className="object-cover object-center"
            quality={90}
            sizes="100vw"
          />
          {/* Multi-layer gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-14 md:pb-20"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-bronze-gold" />
            <span className="text-bronze-gold font-gotham text-xs uppercase tracking-[0.35em]">
              Solitario × Geresa — España
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold text-white leading-[1.05] max-w-4xl mb-6"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            El lujo sostenible
            <br />
            <span className="text-bronze-gold">aterriza en España.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-white/75 font-montserrat text-sm md:text-base max-w-xl mb-8 leading-relaxed"
          >
            Diamantes cultivados en laboratorio. Idénticos a los naturales.
            Éticos, puros, y certificados por el IGI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand-900 font-gotham uppercase tracking-[0.2em] text-xs font-bold rounded-xl hover:bg-ivory-pearl transition-all hover:scale-105"
            >
              Contactar <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#tiendas"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-gotham uppercase tracking-[0.2em] text-xs rounded-xl border border-white/25 hover:bg-white/20 transition-all"
            >
              Ver tiendas <MapPin className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/40"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ── 2. BENTO: IMAGEN MODELO + BRAND TEXT ────────────────────────── */}
      <section className="py-16 md:py-24 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left: square model image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/geresa/geresa1.jpg"
                alt="Solitario — Joyería de lujo sostenible en España"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
              />
              {/* Decorative badge */}
              <div className="absolute top-5 left-5 bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-white font-gotham text-[10px] uppercase tracking-[0.25em] mb-0.5">
                  Solitario
                </p>
                <p className="text-bronze-gold font-montserrat font-bold text-sm">
                  España
                </p>
              </div>
            </div>
            {/* Decorative offset ring */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full border border-classic-green/20 -z-10" />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full border border-classic-green/10 -z-10" />
          </motion.div>

          {/* Right: text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <span className="inline-block text-classic-green font-gotham text-[11px] uppercase tracking-[0.3em] mb-4">
              Lujo Sostenible
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-montserrat font-bold text-brand-900 leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
              Solitario: El lujo sostenible aterriza en{' '}
              <span className="text-classic-green">España</span>
            </h2>
            <div className="space-y-4 text-brand-600 font-montserrat text-[15px] leading-[1.85]">
              <p>
                Reconocida por su innovación y excelencia, Solitario revoluciona la joyería de lujo con su deslumbrante colección de diamantes cultivados en laboratorio. Estas gemas, indistinguibles de los diamantes naturales, combinan la más alta calidad con un firme compromiso con la sostenibilidad y la ética.
              </p>
              <p>
                Ahora en España, Solitario ofrece a los amantes de la alta joyería una alternativa responsable, sin comprometer el diseño ni la exclusividad. Con piezas atemporales y una artesanía excepcional, cada joya refleja un brillo puro, sin concesiones.
              </p>
              <p>
                En un mundo donde los valores evolucionan, Solitario lidera el camino hacia una joyería sostenible, construyendo un futuro basado en la ética inquebrantable. Nuestra misión es crear piezas que despierten la contemplación, enciendan la pasión y realcen la belleza sin explotación.
              </p>
            </div>

            {/* Three trust pills */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {['Certif. IGI', 'Ética & Sostenible', 'Garantía de por vida'].map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-classic-green/8 border border-classic-green/20 text-classic-green text-xs font-montserrat font-semibold"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. DIAMANTES DE LABORATORIO ─────────────────────────────────── */}
      <section className="bg-[#0F1A14] py-20 md:py-28 px-5 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="grid lg:grid-cols-2 gap-14 mb-14">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block text-bronze-gold font-gotham text-[11px] uppercase tracking-[0.3em] mb-4">
                Ciencia & Belleza
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Diamantes de
                <br />
                <span className="text-bronze-gold">Laboratorio</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="space-y-4 text-white/65 font-montserrat text-[15px] leading-[1.85]">
                <p>
                  En los últimos años, la conciencia sobre el impacto de la minería de diamantes ha crecido significativamente, impulsando a los consumidores a buscar una alternativa más ética y sostenible. Los diamantes cultivados en laboratorio ofrecen exactamente eso: belleza, pureza y calidad sin los efectos negativos de la extracción minera.
                </p>
                <p>
                  Visual, química y físicamente idénticos a los diamantes naturales, estos diamantes se desarrollan a partir de pequeñas semillas mediante dos métodos innovadores que replican las condiciones geológicas de la Tierra: Alta Presión-Temperatura (HPHT) y Deposición Química de Vapor (CVD).
                </p>
              </div>
            </motion.div>
          </div>

          {/* Method cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-14">
            {[
              {
                label: 'HPHT',
                title: 'Alta Presión-Temperatura',
                body: 'Recrea las condiciones de alta presión y temperatura del interior del planeta para formar diamantes auténticos.',
              },
              {
                label: 'CVD ✦ Solitario',
                title: 'Deposición Química de Vapor',
                body: 'Técnica de alta precisión que forma el diamante capa por capa en una cámara de vapor rica en carbono, permitiendo obtener gemas éticas, de gran pureza y extraordinaria calidad.',
                highlighted: true,
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`rounded-2xl p-7 border ${
                  card.highlighted
                    ? 'border-bronze-gold/30 bg-bronze-gold/5'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-gotham uppercase tracking-widest mb-4 ${
                    card.highlighted
                      ? 'bg-bronze-gold/20 text-bronze-gold'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {card.label}
                </span>
                <h3 className="text-white font-montserrat font-bold text-lg mb-3">{card.title}</h3>
                <p className="text-white/55 font-montserrat text-sm leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Key facts bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { stat: '100%', desc: 'Libres de conflictos' },
              { stat: 'IGI', desc: 'Certificación internacional' },
              { stat: '≡', desc: 'Idénticos a los naturales' },
              { stat: '↓ CO₂', desc: 'Huella ambiental reducida' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center"
              >
                <p className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-1.5">{item.stat}</p>
                <p className="text-white/50 font-montserrat text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Video embed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden border border-white/10 aspect-video w-full max-w-4xl mx-auto"
          >
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID_HERE?rel=0&modestbranding=1"
              title="Proceso CVD — Cómo se crean los diamantes de laboratorio Solitario"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </motion.div>
          <p className="text-white/25 font-montserrat text-xs text-center mt-3">
            Proceso CVD con subtítulos en español
          </p>
        </div>
      </section>

      {/* ── 4. LAS 4 C's ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-10 bg-[#F9F7F4]">
        <div className="max-w-7xl mx-auto">
          {/* 4C diagram + intro */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden bg-[#F0EDE8] border border-brand-200 p-2"
            >
              <Image
                src="/images/geresa/4c.png"
                alt="Las 4 C's del diamante — Talla, Color, Claridad y Quilate"
                width={700}
                height={400}
                className="w-full h-auto object-contain"
                quality={90}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block text-classic-green font-gotham text-[11px] uppercase tracking-[0.3em] mb-4">
                Guía de Calidad
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-montserrat font-bold text-brand-900 leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
                Las <span className="text-classic-green">4 C's</span>
              </h2>
              <p className="text-brand-600 font-montserrat text-[15px] leading-[1.85] mb-8">
                Las 4 C's —Talla, Color, Claridad y Quilate— son los estándares universalmente aceptados que determinan la calidad y el valor de un diamante. Encontrar la armonía perfecta entre estas características te ayudará a equilibrar belleza y valor al elegir tu diamante ideal.
              </p>

              {/* C pill buttons */}
              <div className="flex flex-wrap gap-2.5">
                {FOUR_CS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveC(activeC === c.id ? null : c.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-montserrat font-semibold transition-all border ${
                      activeC === c.id
                        ? 'bg-brand-900 text-white border-brand-900 shadow-sm'
                        : 'bg-white text-brand-600 border-brand-200 hover:border-brand-400'
                    }`}
                  >
                    <span>{c.emoji}</span>
                    {c.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        activeC === c.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Expandable detail accordion */}
          <AnimatePresence>
            {activeC && (
              <motion.div
                key={activeC}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {FOUR_CS.filter((c) => c.id === activeC).map((c) => (
                  <div
                    key={c.id}
                    className="rounded-3xl bg-white border border-brand-200 p-8 md:p-12 shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{c.emoji}</div>
                      <div>
                        <p className="text-xs font-gotham text-classic-green uppercase tracking-[0.25em] mb-1">
                          La C de
                        </p>
                        <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-brand-900">
                          {c.label}
                        </h3>
                      </div>
                    </div>
                    <div className="text-brand-600 font-montserrat text-[15px] leading-[1.9] space-y-4 max-w-3xl">
                      {c.body.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── 5. CERTIFICACIÓN IGI ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left: heading + body */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-classic-green" />
                <span className="text-classic-green font-gotham text-[11px] uppercase tracking-[0.3em]">
                  Autenticidad Garantizada
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-montserrat font-bold text-brand-900 leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                Certificación y
                <br />
                <span className="text-classic-green">Autenticidad</span>
              </h2>
              <div className="space-y-4 text-brand-600 font-montserrat text-[15px] leading-[1.85]">
                <p>
                  En Solitario, la calidad es nuestra prioridad. Contamos con la tecnología más avanzada para crear diamantes cultivados en laboratorio impecables, en una amplia variedad de formas y tamaños.
                </p>
                <p>
                  Nuestros diamantes se califican con los mismos estándares que los diamantes naturales, evaluándose según las 4 C's: Color, Talla, Claridad y Quilate.
                </p>
                <p>
                  Para garantizar su autenticidad, Solitario certifica sus diamantes a través del{' '}
                  <strong className="text-brand-900">International Gemological Institute (IGI)</strong>,
                  una de las instituciones gemológicas más reconocidas del mundo. IGI también certifica diamantes naturales, lo que refuerza el reconocimiento y legitimidad de los diamantes de laboratorio dentro de los estándares internacionales de calidad.
                </p>
              </div>
            </motion.div>

            {/* Right: IGI badge card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 p-8 md:p-10 text-center">
                {/* IGI logo placeholder */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white border border-brand-200 shadow-sm flex items-center justify-center">
                  <Award className="w-10 h-10 text-classic-green" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-brand-900 mb-2">
                  International Gemological Institute
                </h3>
                <p className="text-classic-green font-gotham text-xs uppercase tracking-widest mb-5">
                  IGI Certificado
                </p>
                <div className="space-y-3">
                  {[
                    'Certificado independiente y reconocido mundialmente',
                    'Mismos estándares que los diamantes naturales',
                    'Informe detallado de cada gema',
                    'Validado internacionalmente',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-left">
                      <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
                      <span className="text-brand-700 font-montserrat text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. GARANTÍA DE POR VIDA ─────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-5 md:px-10 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0F1A14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(205,154,78,0.06),transparent_60%)]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-bronze-gold/15 border border-bronze-gold/30 mb-8">
              <Shield className="w-8 h-8 text-bronze-gold" />
            </div>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-12 h-px bg-bronze-gold/40" />
              <span className="text-bronze-gold font-gotham text-[11px] uppercase tracking-[0.3em]">
                Nuestra Promesa
              </span>
              <div className="w-12 h-px bg-bronze-gold/40" />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-montserrat font-bold text-white leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
              Garantía de
              <span className="text-bronze-gold"> por vida</span>
            </h2>
            <p className="text-white/65 font-montserrat text-base md:text-lg leading-[1.9] max-w-3xl mx-auto mb-12">
              En Solitario, cada joya está respaldada por una garantía de por vida, que incluye la reposición de la piedra en cualquier momento. Nos hacemos responsables de su sustitución, tanto en caso de pérdida como de reparación, asegurando así la durabilidad, tranquilidad y confianza en cada una de nuestras joyas.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { icon: Star, title: 'Para siempre', body: 'Sin fecha de caducidad' },
                { icon: Shield, title: 'Reposición total', body: 'Pérdida o reparación cubierta' },
                { icon: Sparkles, title: 'Brillo eterno', body: 'Garantía de calidad perpetua' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center"
                >
                  <item.icon className="w-6 h-6 text-bronze-gold mx-auto mb-3" />
                  <p className="text-white font-montserrat font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-white/45 font-montserrat text-xs">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 7. STORE LOCATOR ────────────────────────────────────────────── */}
      <section id="tiendas" className="py-20 md:py-28 px-5 md:px-10 bg-[#F9F7F4]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-classic-green font-gotham text-[11px] uppercase tracking-[0.3em] mb-4">
              Dónde Encontrarnos
            </span>
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-900 mb-4" style={{ letterSpacing: '-0.02em' }}>
              Puntos de venta en{' '}
              <span className="text-classic-green">España</span>
            </h2>
            <p className="text-brand-500 font-montserrat text-base max-w-xl mx-auto">
              Descubre nuestra colección en las mejores joyerías de España, distribuidas a través de Geresa.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 rounded-3xl overflow-hidden border border-brand-200 shadow-sm"
              style={{ minHeight: '480px' }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6372843.665657453!2d-9.3949976!3d40.3360641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1893da4d626b21%3A0x390acf4ff55c2a5!2sEspa%C3%B1a!5e0!3m2!1ses!2ses!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '480px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="Solitario España — Mapa de distribuidores"
              />
            </motion.div>

            {/* Minimal store list */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-gotham text-brand-400 uppercase tracking-widest mb-0.5">
                    Distribuidor
                  </p>
                  <h3 className="text-lg font-montserrat font-bold text-brand-800">
                    Geresa — {touchPoints.length} tiendas
                  </h3>
                </div>
                <a
                  href={GERESA_DISTRIBUTOR?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-montserrat font-semibold text-classic-green hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Web
                </a>
              </div>

              {/* Scrollable store list */}
              <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 space-y-1 scrollbar-thin">
                {touchPoints.map((point, i) => (
                  <motion.div
                    key={point.name}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white border border-brand-100 hover:border-classic-green/30 hover:shadow-sm transition-all group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-classic-green flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-montserrat font-semibold text-brand-800 text-xs truncate">
                        {point.name}
                      </p>
                      <p className="font-montserrat text-brand-500 text-[11px] mt-0.5 line-clamp-1">
                        {point.address}
                      </p>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(point.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-400 group-hover:text-classic-green transition-colors flex-shrink-0"
                      title="Cómo llegar"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 8. CONTACT FORM ─────────────────────────────────────────────── */}
      <section id="contacto" className="py-20 md:py-28 px-5 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left: heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5"
            >
              <span className="inline-block text-classic-green font-gotham text-[11px] uppercase tracking-[0.3em] mb-4">
                Hablemos
              </span>
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-900 leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                Formulario de{' '}
                <span className="text-classic-green">consulta</span>
              </h2>
              <p className="text-brand-600 font-montserrat text-[15px] leading-[1.85] mb-8">
                ¿Tienes alguna pregunta sobre nuestros diamantes cultivados en laboratorio o quieres conocer el punto de venta más cercano? Escríbenos y te responderemos a la mayor brevedad.
              </p>

              {/* Contact info block */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-classic-green/10 border border-classic-green/20 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-classic-green" />
                  </div>
                  <div>
                    <p className="text-xs font-gotham text-brand-400 uppercase tracking-widest mb-0.5">Distribuidor España</p>
                    <a
                      href={GERESA_DISTRIBUTOR?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-800 font-montserrat font-semibold text-sm hover:text-classic-green transition-colors"
                    >
                      grupocadarso.com/marcas/solitario
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-classic-green/10 border border-classic-green/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-classic-green" />
                  </div>
                  <div>
                    <p className="text-xs font-gotham text-brand-400 uppercase tracking-widest mb-0.5">Puntos de venta</p>
                    <p className="text-brand-800 font-montserrat font-semibold text-sm">
                      {touchPoints.length} tiendas en toda España
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 rounded-3xl bg-brand-50 border border-brand-200 p-8 md:p-10 shadow-sm"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER STRIP ────────────────────────────────────────────────── */}
      <div className="bg-[#0F1A14] py-6 px-5 text-center">
        <p className="text-white/30 font-montserrat text-xs">
          © {new Date().getFullYear()} Solitario. Distribuido en España por{' '}
          <a
            href={GERESA_DISTRIBUTOR?.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white/70 transition-colors"
          >
            Geresa / Grupo Cadarso
          </a>
          .
        </p>
      </div>
    </div>
  );
}
