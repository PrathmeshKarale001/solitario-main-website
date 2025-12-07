import {
  AboutHero,
  OurStory,
  VisionMission,
  Founders,
  Promise,
} from '@/components/about';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <AboutHero />
      <OurStory />
      <VisionMission />
      <Founders />
      <Promise />
      
      {/* CTA Section - Dark Theme - Compact */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 bg-gradient-to-b from-black to-gray-900/30">
        <div className="max-w-3xl sm:max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-didot text-white mb-3 sm:mb-4 md:mb-6">
            Ready to Discover Your <span className="text-bronze-gold">Perfect Piece</span>?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/80 mb-4 sm:mb-6 md:mb-8 font-montserrat hidden sm:block">
            Explore our collection of ethically crafted lab-grown diamond jewellery 
            and find the piece that tells your story.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-white font-gotham uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs md:text-sm rounded-lg transition-all duration-500 hover:scale-105 group bg-bronze-gold/20 border border-bronze-gold/40 hover:border-bronze-gold/60 backdrop-blur-sm touch-manipulation"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-white font-gotham uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs md:text-sm rounded-lg transition-all duration-500 hover:scale-105 group relative overflow-hidden touch-manipulation"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


