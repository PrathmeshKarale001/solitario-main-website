import dynamic from 'next/dynamic';
import {
  Hero,
  ProductCategories,
  ShopByCategoryOriginal,
  LifestyleShowcase,
  PromoBanner1,
} from '@/components/home';
import { Promise } from '@/components/about';

// Lazy load below-fold components for better performance
const FlowingMenuClient = dynamic(() => import('@/components/home/FlowingMenuClient'), {
  loading: () => <div className="h-[40vh] bg-[#FAF5EF]" />,
});
const LabGrownBenefits = dynamic(() => import('@/components/home/LabGrownBenefits'));
const PromoBanner2 = dynamic(() => import('@/components/home/PromoBanners').then(mod => ({ default: mod.PromoBanner2 })));
const Stores = dynamic(() => import('@/components/home/Stores'));
const FAQ = dynamic(() => import('@/components/home/FAQ'));
const BrandStory = dynamic(() => import('@/components/home/BrandStory'));
const Awards = dynamic(() => import('@/components/home/Awards'));
const Testimonials = dynamic(() => import('@/components/home/Testimonials'));
const HeadOffice = dynamic(() => import('@/components/home/HeadOffice'));

const menuItems = [
  { 
    link: '/products', 
    text: 'Explore Products', 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&q=80'
  },
  { 
    link: '/about', 
    text: 'Our Story', 
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop&q=80'
  },
  { 
    link: '/contact', 
    text: 'Get In Touch', 
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop&q=80'
  },
];

export default function Home() {
  return (
    <div>
      {/* 1. HERO - First impression with CTA */}
      <Hero />
      
      {/* 2. SHOP BY CATEGORY - Immediate product access */}
      <ShopByCategoryOriginal />
      
      {/* 3. PRODUCT COLLECTIONS - Browse & filter products */}
      <div id="explore-section">
        <ProductCategories />
      </div>

      {/* 3a. LIFESTYLE SHOWCASE - Shop by Occasion */}
      <LifestyleShowcase />
      
      {/* 4. PROMO BANNER - Drive urgency/offers */}
      <PromoBanner1 />
      
      {/* 5. PROMISE - Brand values (kept high for trust) */}
      <Promise />
      
      {/* 6. QUICK NAVIGATION - Easy access to key pages */}
      <section className="relative pt-6 sm:pt-8 md:pt-6 h-[35vh] sm:h-[40vh] md:h-[50vh] min-h-[280px] sm:min-h-[320px] md:min-h-[400px]">
        <FlowingMenuClient items={menuItems} />
      </section>
      
      {/* 7. LAB GROWN BENEFITS - Key selling point (brief) */}
      <LabGrownBenefits />
      
      {/* 8. SECOND PROMO BANNER - Another conversion opportunity */}
      <PromoBanner2 />
      
      {/* 9. STORES - Where to buy */}
      <Stores />
      
      {/* 10. FAQ - Remove purchase objections */}
      <FAQ />
      
      {/* 11. BRAND STORY - For interested customers */}
      <BrandStory />
      
      {/* 12. AWARDS & TRUST - Credibility */}
      <Awards />
      
      {/* 13. TESTIMONIALS - Social proof */}
      <Testimonials />
      
      {/* 14. HEAD OFFICE - Contact info */}
      <HeadOffice />
      
      {/* REMOVED: ScrollReveal (decorative, slows journey to products) */}
    </div>
  );
}

