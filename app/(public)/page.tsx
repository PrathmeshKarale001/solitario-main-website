import dynamic from 'next/dynamic';
import {
  ProductCategories,
  ShopByCategoryOriginal,
  LifestyleShowcase,
  // PromoBanner1, // Disabled
} from '@/components/home';
import DynamicHero from '@/components/home/DynamicHero';
import { Promise } from '@/components/about';
import OffersMarquee from '@/components/ui/OffersMarquee';

const LoginPopup = dynamic(() => import('@/components/home/LoginPopup'));
import UnifiedOfferBanner from '@/components/ui/UnifiedOfferBanner';

// Lazy load below-fold components for better performance and reduced initial bundle
const FlowingMenuClient = dynamic(() => import('@/components/home/FlowingMenuClient'), {
  loading: () => <div className="h-[40vh] bg-[#FAF5EF]" />,
});
const LabGrownBenefits = dynamic(() => import('@/components/home/LabGrownBenefits'), {
  loading: () => <div className="h-[60vh] bg-gradient-to-b from-white to-ivory-pearl/30" />,
});
const Stores = dynamic(() => import('@/components/home/Stores'), {
  loading: () => <div className="h-[80vh] bg-white" />,
});
const FAQ = dynamic(() => import('@/components/home/FAQ'), {
  loading: () => <div className="h-[60vh] bg-gradient-to-b from-ivory-pearl/30 to-white" />,
});
const BrandStory = dynamic(() => import('@/components/home/BrandStory'), {
  loading: () => <div className="h-[70vh] bg-white" />,
});
const Awards = dynamic(() => import('@/components/home/Awards'), {
  loading: () => <div className="h-[60vh] bg-gradient-to-b from-white to-ivory-pearl/30" />,
});
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  loading: () => <div className="h-[70vh] bg-white" />,
});


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
      {/* Marketing Login Popup for first-time visitors */}
      <LoginPopup />

      {/* 1. DYNAMIC HERO - First impression with CTA */}
      <DynamicHero />

      {/* SEO: Server-rendered H1 + content for crawlers. Visually hidden but accessible. */}
      <div className="sr-only" aria-hidden="false">
        <h1>The Solitario — Lab Grown Diamond Jewellery | Modern Luxury</h1>
        <p>
          Welcome to The Solitario, India&apos;s most loved new-age diamond jewellery brand.
          Since 1984, we have been crafting exquisite lab-grown diamond jewellery that combines
          timeless elegance with sustainable luxury. Our collection features stunning diamond rings,
          necklaces, earrings, bracelets, and pendants, all created with certified lab-grown diamonds
          that are optically, chemically, and physically identical to mined diamonds.
          At The Solitario, we believe that luxury should be both beautiful and responsible.
          Our lab-grown diamonds have a significantly lower environmental impact while delivering
          the same brilliance, fire, and sparkle you expect from the finest diamonds.
          Every piece of The Solitario jewellery comes with an international certification of authenticity.
          Visit our stores across India or shop online to discover premium diamond jewellery
          for engagements, weddings, anniversaries, and everyday luxury. Experience the future
          of sustainable diamond jewellery with The Solitario.
        </p>
      </div>
      <OffersMarquee />

      {/* 2. SHOP BY CATEGORY - Immediate product access */}
      <ShopByCategoryOriginal />

      {/* 3. PRODUCT COLLECTIONS - Browse & filter products */}
      <div id="explore-section">
        <ProductCategories />
      </div>

      {/* 3a. LIFESTYLE SHOWCASE - Shop by Occasion */}
      <LifestyleShowcase />

      {/* 4. PROMO BANNER - Drive urgency/offers (DISABLED) */}
      {/* <PromoBanner1 /> */}

      {/* 5. PROMISE - Brand values (kept high for trust) */}
      <Promise />

      {/* 5a. UNIFIED OFFERS - Consistent offer messaging across funnel */}
      <UnifiedOfferBanner variant="homepage" />

      {/* 6. QUICK NAVIGATION - Easy access to key pages */}
      <section className="relative bg-[#FAF5EF] pt-4 sm:pt-5 md:pt-4">
        <FlowingMenuClient items={menuItems} />
      </section>

      {/* 7. LAB GROWN BENEFITS - Key selling point (brief) */}
      <LabGrownBenefits />

      {/* 8. SECOND PROMO BANNER - Another conversion opportunity (DISABLED) */}
      {/* <PromoBanner2 /> */}

      {/* 9. STORES - Where to buy */}
      <Stores />

      {/* 11. BRAND STORY - For interested customers */}
      <BrandStory />

      {/* 12. AWARDS & TRUST - Credibility */}
      <Awards />

      {/* 13. TESTIMONIALS - Social proof */}
      <Testimonials />



      {/* 10. FAQ - Remove purchase objections */}
      <FAQ />

      {/* REMOVED: ScrollReveal (decorative, slows journey to products) */}
    </div>
  );
}

