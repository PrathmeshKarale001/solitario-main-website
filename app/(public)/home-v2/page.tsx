import { Hero } from '@/components/home';
import { Promise } from '@/components/about';
import {
  ShopByCategoryOriginal,
  ProductCategories,
  PromoBanner1,
  Testimonials,
  FlowingMenu,
  LabGrownBenefits,
  PromoBanner2,
  Stores,
  FAQ,
  BrandStory,
  Awards,
  HeadOffice,
} from '@/components/home-v2';

export default function HomeV2() {
  return (
    <main>
      {/* 1. HERO (Existing - Dark) */}
      <Hero />
      
      {/* 2. SHOP BY CATEGORY (Remade - Dark to match Hero) */}
      <ShopByCategoryOriginal />
      
      {/* 3. PRODUCT COLLECTIONS (Remade - Transition to Light) */}
      <ProductCategories />
      
      {/* 4. PROMO BANNER (Remade - Dark Luxury) */}
      <PromoBanner1 />
      
      {/* 5. PROMISE (Existing - Dark) - Kept high for trust */}
      <Promise />
      
      {/* 6. FLOWING MENU (Remade - Visual Break) */}
      <FlowingMenu />
      
      {/* 7. LAB GROWN BENEFITS (Remade - Dark/Green) */}
      <LabGrownBenefits />
      
      {/* 8. SECOND PROMO BANNER (Remade - Light) */}
      <PromoBanner2 />
      
      {/* 9. STORES (Remade - Dark) */}
      <Stores />
      
      {/* 10. FAQ (Remade - Light) */}
      <FAQ />
      
      {/* 11. BRAND STORY (Remade - Dark) */}
      <BrandStory />
      
      {/* 12. AWARDS (Remade - Light) */}
      <Awards />
      
      {/* 13. TESTIMONIALS (Remade - Dark/Gold) */}
      <Testimonials />
      
      {/* 14. HEAD OFFICE (Remade - Light) */}
      <HeadOffice />
    </main>
  );
}
