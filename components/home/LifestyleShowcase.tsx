'use client';

import { ThreeDImageRing } from '@/components/lightswind/3d-image-ring';

// Optimized Solitario images from /public/carouselgrid
const LIFESTYLE_IMAGES = [
  '/carouselgrid/optimized-30.6.2025-Soltario0079-1.jpg',
  '/carouselgrid/optimized-30.6.2025-Soltario0183-1.jpg',
  '/carouselgrid/optimized-30.6.2025-Soltario0193-1.jpg',
  '/carouselgrid/optimized-30.6.2025-Soltario0245.jpg',
  '/carouselgrid/optimized-30.6.2025-Soltario0298-1.jpg',
  '/carouselgrid/optimized-30.6.2025-Soltario0353.jpg',
  '/carouselgrid/optimized-30.6.2025-Soltario0542.jpg',
];

export default function LifestyleShowcase() {
  return (
    <section className="bg-white py-16 md:py-20 w-full">
      {/* Section Header - Centered */}
      <div className="flex flex-col items-center mb-8 md:mb-10 text-center px-4">
        <span className="text-bronze-gold uppercase tracking-[0.2em] text-sm font-gotham mb-3">
          Shop By Occasion
        </span>
        <h2 className="font-didot text-4xl md:text-5xl lg:text-6xl text-brand-800 mb-6">
          Find Your Perfect Match
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze-gold to-transparent" />
      </div>

      {/* 3D Image Ring - Full Viewport Width, Reduced Vertical Space */}
      <div className="h-[430px] md:h-[500px] lg:h-[560px] w-screen relative left-1/2 -translate-x-1/2 flex items-center justify-center overflow-visible">
        <ThreeDImageRing 
          images={LIFESTYLE_IMAGES}
          width={370}
          imageDistance={570}
          perspective={2200}
          animationDuration={1.4}
          staggerDelay={0.1}
          hoverOpacity={0.4}
          mobileScaleFactor={0.55}
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
      <div className="text-center mt-5 md:mt-8">
        <p className="text-brand-500 font-montserrat text-sm md:text-base">
          ← Drag to Explore →
        </p>
      </div>
    </section>
  );
}
