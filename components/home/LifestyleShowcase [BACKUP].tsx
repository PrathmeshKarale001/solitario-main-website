'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { Section, Container } from '@/components/ui';

const LIFESTYLES = [
  {
    id: 1,
    title: 'DAILY WEAR',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop',
    link: '/products?category=daily',
  },
  {
    id: 2,
    title: 'OFFICE WEAR',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
    link: '/products?category=office',
  },
  {
    id: 3,
    title: 'PARTY WEAR',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop',
    link: '/products?category=party',
  },
  {
    id: 4,
    title: 'WEDDING',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    link: '/products?category=wedding',
  }
];

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

export default function LifestyleShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
    skipSnaps: false,
  });
  const tweenFactor = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const setTweenFactor = useCallback((emblaApi: any) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi: any, eventName?: any) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slides = emblaApi.scrollSnapList();

      emblaApi.scrollSnapList().forEach((scrollSnap: any, snapIndex: number) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInView = engine.slideRegistry[snapIndex];

        // Handle loop logic
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem: any) => {
            const target = loopItem.target();

            if (snapIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue * 1.2, 0.8, 1.1);
        const opacity = numberWithinRange(tweenValue * 1.5, 0.4, 1);
        const zIndex = Math.round(tweenValue * 100);
        
        const slideNode = emblaApi.slideNodes()[snapIndex];
        if (slideNode) {
          slideNode.style.transform = `scale(${scale})`;
          slideNode.style.opacity = `${opacity}`;
          slideNode.style.zIndex = `${zIndex}`;
        }
      });
    },
    []
  );

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenFactor(emblaApi);
    tweenScale(emblaApi);
    
    emblaApi
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)
      .on('select', onSelect);

    return () => {
      emblaApi.off('reInit', setTweenFactor);
      emblaApi.off('reInit', tweenScale);
      emblaApi.off('scroll', tweenScale);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, tweenScale, setTweenFactor, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <Section className="bg-white overflow-hidden py-20">
      <Container>
        <div className="relative max-w-[1600px] mx-auto h-[600px] md:h-[700px] w-full">
          <div className="overflow-visible h-full w-full" ref={emblaRef}>
            <div className="flex touch-pan-y h-full items-center w-full ml-[-10%]">
              {LIFESTYLES.map((item, index) => {
                const isActive = index === selectedIndex;
                
                return (
                  <div
                    key={item.id}
                    className="flex-[0_0_60%] md:flex-[0_0_30%] min-w-0 relative px-4 h-[80%] md:h-[90%] transition-all duration-300"
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                  >
                    <Link href={item.link} className="block relative w-full h-full">
                      <div className="relative w-full h-full overflow-hidden shadow-2xl bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 70vw, 40vw"
                          priority={index === 0}
                        />
                        
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Text Content - Bottom Center */}
                        <div className="absolute bottom-8 left-0 right-0 text-center z-20">
                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-white uppercase tracking-widest mb-2 drop-shadow-md">
                            {item.title}
                          </h3>
                          
                          {/* Underline */}
                          <div className="w-24 h-0.5 bg-white/80 mx-auto mb-4" />

                          {/* Active Indicator Button */}
                          {isActive && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto cursor-pointer shadow-lg"
                            >
                              <ChevronUp className="w-5 h-5 text-black" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons - Floating on sides */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white hover:bg-gray-50 text-black shadow-xl flex items-center justify-center z-30 transition-transform hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white hover:bg-gray-50 text-black shadow-xl flex items-center justify-center z-30 transition-transform hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </Container>
    </Section>
  );
}
