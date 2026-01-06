'use client';

import Link from 'next/link';
import { ThreeDImageRing, ImageItem } from '@/components/lightswind/3d-image-ring';

// Solitario spotted celebrities (URL-encoded paths for spaces)
const CELEBRITY_IMAGES: ImageItem[] = [
  { src: '/images/Solitario%20spotted%20celebrities/Zareen%20Khan/DSC00348.jpg', name: 'Zareen Khan', href: '/products' },
  { src: '/images/Solitario%20spotted%20celebrities/Sunny%20leone/14.jpg', name: 'Sunny Leone', href: '/products' },
  { src: '/images/Solitario%20spotted%20celebrities/Nargis%20Fakri/IMG_0153%20copy.jpg', name: 'Nargis Fakhri', href: '/products' },
  { src: '/images/Solitario%20spotted%20celebrities/Karishma%20tanna/14.jpg', name: 'Karishma Tanna', href: '/products' },
  { src: '/images/Solitario%20spotted%20celebrities/Esha%20deol/2.jpg', name: 'Esha Deol', href: '/products' },
  { src: '/images/Solitario%20spotted%20celebrities/Sonam%20Kapoor/WhatsApp%20Image%202025-03-03%20at%2023.38.10_5a4446bd.jpg', name: 'Sonam Kapoor', href: '/products' },
  { src: '/images/Solitario%20spotted%20celebrities/Taha%20Shah/8.8.2025%20Solitario1750.jpg', name: 'Taha Shah', href: '/products' },
  { src: '/images/Solitario%20spotted%20celebrities/Parth%20samthaan/IMG_3236.PNG', name: 'Parth Samthaan', href: '/products' },
  { src: '/images/Solitario%20spotted%20celebrities/Riddhima%20pandit/8.jpg', name: 'Riddhima Pandit', href: '/products' },
];

export default function LifestyleShowcase() {
  return (
    <section className="bg-white py-12 md:py-16 w-full">
      {/* Section Header - Centered */}
      <div className="flex flex-col items-center mb-6 md:mb-8 text-center px-4">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-gotham text-bronze-gold mb-2 block">
          Radiate Elegance
        </span>
        <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-classic-green mb-4" style={{ letterSpacing: '-0.02em' }}>
          Celebrity Cameo with Solitario
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze-gold to-transparent" />
      </div>

      {/* 3D Image Ring - Full Viewport Width, Reduced Vertical Space */}
      <div className="h-[200px] md:h-[400px] lg:h-[420px] w-screen relative left-1/2 -translate-x-1/2 flex items-center justify-center overflow-visible">
        <ThreeDImageRing 
          images={CELEBRITY_IMAGES}
          width={390}
          imageDistance={570}
          perspective={2200}
          animationDuration={1.4}
          staggerDelay={0.1}
          hoverOpacity={0.4}
          mobileScaleFactor={0.5}
          mobileBreakpoint={768}
          inertiaPower={0.7}
          inertiaTimeConstant={350}
          inertiaVelocityMultiplier={16}
          autoRotate={true}
          autoRotateSpeed={12}
          autoRotateDelay={4000}
          autoRotateStepDuration={900}
          autoRotatePause={1500}
          containerClassName="w-full h-full"
          imageClassName="rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.25)]"
          backgroundColor="transparent"
        />
      </div>
      
      {/* Instruction Text */}
      <div className="text-center mt-4 md:mt-6">
        <p className="text-brand-500 font-montserrat text-sm md:text-base">
          ← Drag to Explore →
        </p>
      </div>
    </section>
  );
}
