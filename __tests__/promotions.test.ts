import { calculatePromotions, CartLine } from '@/lib/promotions/engine';
import { OrderRepository, CouponRepository } from '@/lib/db/storage';

jest.mock('@/lib/promotions/config', () => ({
  getPromotionConfig: jest.fn().mockResolvedValue({
    enabled: true,
    first_purchase_percent: 20,
    loyalty_coupon_percent: 10,
    loyalty_coupon_validity_days: 30,
    buy2_percent: 10,
    buy3_percent: 30,
    gift_variant_id: 'gid://shopify/ProductVariant/12345',
    gift_product_name: '10-cent Diamond Gift',
    stacking_first_purchase: false,
  }),
}));

jest.mock('@/lib/db/storage');

describe('Promotion Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createCartLine = (price: number, quantity: number): CartLine => ({
    id: `line_${Math.random()}`,
    quantity,
    merchandise: {
      id: `variant_${Math.random()}`,
      title: 'Test Product',
      price: {
        amount: price.toString(),
        currencyCode: 'INR',
      },
    },
  });

  describe('No promotions', () => {
    it('should calculate correct total for single item with no promotions', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);

      const cartLines = [createCartLine(100, 1)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.subtotal).toBe(10000);
      expect(result.discounts).toHaveLength(0);
      expect(result.total).toBe(10000);
      expect(result.giftLines).toHaveLength(0);
    });
  });

  describe('Buy 2 items promotion', () => {
    it('should apply 10% discount for 2 items', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);

      const cartLines = [createCartLine(100, 2)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.subtotal).toBe(20000);
      expect(result.discounts).toHaveLength(1);
      expect(result.discounts[0].type).toBe('BUY2');
      expect(result.discounts[0].percent).toBe(10);
      expect(result.discounts[0].amount).toBe(2000);
      expect(result.total).toBe(18000);
    });

    it('should add free gift for 2 items', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);

      const cartLines = [createCartLine(100, 2)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.giftLines).toHaveLength(1);
      expect(result.giftLines[0].variant_id).toBe('gid://shopify/ProductVariant/12345');
      expect(result.giftLines[0].product_name).toBe('10-cent Diamond Gift');
      expect(result.giftLines[0].is_gift).toBe(true);
      expect(result.giftLines[0].unit_price).toBe(0);
    });
  });

  describe('Buy 3+ items promotion', () => {
    it('should apply 30% discount for 3 items', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);

      const cartLines = [createCartLine(100, 3)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.subtotal).toBe(30000);
      expect(result.discounts).toHaveLength(1);
      expect(result.discounts[0].type).toBe('BUY3');
      expect(result.discounts[0].percent).toBe(30);
      expect(result.discounts[0].amount).toBe(9000);
      expect(result.total).toBe(21000);
    });

    it('should not add gift for 3+ items', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);

      const cartLines = [createCartLine(100, 3)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.giftLines).toHaveLength(0);
    });

    it('should apply 30% discount for 5 items', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);

      const cartLines = [createCartLine(100, 5)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.discounts[0].type).toBe('BUY3');
      expect(result.discounts[0].percent).toBe(30);
    });
  });

  describe('First purchase discount', () => {
    it('should apply 20% discount for first purchase with 1 item', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(0);

      const cartLines = [createCartLine(100, 1)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.subtotal).toBe(10000);
      expect(result.discounts).toHaveLength(1);
      expect(result.discounts[0].type).toBe('FIRST_PURCHASE');
      expect(result.discounts[0].percent).toBe(20);
      expect(result.discounts[0].amount).toBe(2000);
      expect(result.total).toBe(8000);
    });

    it('should not apply first purchase discount if cart rule applies', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(0);

      const cartLines = [createCartLine(100, 2)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.discounts).toHaveLength(1);
      expect(result.discounts[0].type).toBe('BUY2');
      expect(result.appliedFlags.firstPurchase).toBe(false);
    });

    it('should not apply for guest users', async () => {
      const cartLines = [createCartLine(100, 1)];
      const result = await calculatePromotions({
        cartLines,
      });

      expect(result.discounts).toHaveLength(0);
      expect(result.appliedFlags.firstPurchase).toBe(false);
    });
  });

  describe('Loyalty coupon', () => {
    it('should apply valid loyalty coupon', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);
      (CouponRepository.findByCode as jest.Mock).mockReturnValue({
        code: 'SOLI-LOYAL-TEST',
        clerk_user_id: 'user_123',
        percent_off: 10,
        status: 'ACTIVE',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      });

      const cartLines = [createCartLine(100, 1)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
        couponCode: 'SOLI-LOYAL-TEST',
      });

      expect(result.discounts).toHaveLength(1);
      expect(result.discounts[0].type).toBe('LOYALTY_COUPON');
      expect(result.discounts[0].percent).toBe(10);
      expect(result.discounts[0].amount).toBe(1000);
      expect(result.total).toBe(9000);
    });

    it('should not stack loyalty coupon with cart rules', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);
      (CouponRepository.findByCode as jest.Mock).mockReturnValue({
        code: 'SOLI-LOYAL-TEST',
        clerk_user_id: 'user_123',
        percent_off: 10,
        status: 'ACTIVE',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      });

      const cartLines = [createCartLine(100, 2)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
        couponCode: 'SOLI-LOYAL-TEST',
      });

      expect(result.discounts).toHaveLength(1);
      expect(result.discounts[0].type).toBe('BUY2');
      expect(result.errors).toContain("This coupon can't be combined with other offers.");
    });

    it('should reject expired coupon', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);
      (CouponRepository.findByCode as jest.Mock).mockReturnValue({
        code: 'SOLI-LOYAL-EXPIRED',
        clerk_user_id: 'user_123',
        percent_off: 10,
        status: 'ACTIVE',
        expires_at: new Date(Date.now() - 86400000).toISOString(),
      });

      const cartLines = [createCartLine(100, 1)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
        couponCode: 'SOLI-LOYAL-EXPIRED',
      });

      expect(result.discounts).toHaveLength(0);
      expect(result.errors).toContain('Invalid or expired coupon code.');
    });
  });

  describe('Money calculations', () => {
    it('should handle decimal prices correctly', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);

      const cartLines = [createCartLine(99.99, 2)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.subtotal).toBe(19998);
      expect(result.discounts[0].amount).toBe(2000);
      expect(result.total).toBe(17998);
    });

    it('should round discount amounts correctly', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(0);

      const cartLines = [createCartLine(33.33, 1)];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.discounts[0].amount).toBe(667);
    });
  });

  describe('Multiple items in cart', () => {
    it('should count total quantity across different products', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);

      const cartLines = [
        createCartLine(100, 1),
        createCartLine(200, 1),
      ];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.discounts[0].type).toBe('BUY2');
      expect(result.giftLines).toHaveLength(1);
    });

    it('should apply BUY3 for mixed quantities totaling 3+', async () => {
      (OrderRepository.countPaidOrdersByClerkUserId as jest.Mock).mockReturnValue(1);

      const cartLines = [
        createCartLine(100, 2),
        createCartLine(200, 1),
      ];
      const result = await calculatePromotions({
        clerkUserId: 'user_123',
        cartLines,
      });

      expect(result.discounts[0].type).toBe('BUY3');
      expect(result.giftLines).toHaveLength(0);
    });
  });
});
