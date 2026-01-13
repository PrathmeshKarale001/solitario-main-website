-- Promotions & Loyalty System Database Schema
-- Migration: 001_create_promotions_tables
-- Description: Create tables for users, orders, and coupons

-- Users table: Links Clerk users to Shopify customers
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  shopify_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table: Stores order history with promotion snapshots
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  shopify_cart_id TEXT,
  subtotal INTEGER NOT NULL, -- Amount in paise
  discount INTEGER NOT NULL, -- Amount in paise
  total INTEGER NOT NULL, -- Amount in paise
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'PAID', 'FAILED')),
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT,
  promo_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Coupons table: Stores loyalty coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  percent_off INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'REDEEMED', 'EXPIRED')),
  issued_month TEXT NOT NULL, -- Format: YYYY-MM
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  issued_for_order_id UUID REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_clerk_user_id ON orders(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coupons_clerk_user_id ON coupons(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);
CREATE INDEX IF NOT EXISTS idx_coupons_issued_month ON coupons(clerk_user_id, issued_month);
CREATE INDEX IF NOT EXISTS idx_coupons_expires_at ON coupons(expires_at);

-- Comments for documentation
COMMENT ON TABLE users IS 'Links Clerk authentication users to Shopify customers';
COMMENT ON TABLE orders IS 'Order history with promotion snapshots for audit trail';
COMMENT ON TABLE coupons IS 'Loyalty coupons issued after successful payments';

COMMENT ON COLUMN orders.subtotal IS 'Order subtotal in paise (₹100 = 10000 paise)';
COMMENT ON COLUMN orders.discount IS 'Total discount amount in paise';
COMMENT ON COLUMN orders.total IS 'Final order total in paise';
COMMENT ON COLUMN orders.promo_snapshot IS 'JSON snapshot of applied promotions for audit';

COMMENT ON COLUMN coupons.issued_month IS 'Calendar month when coupon was issued (YYYY-MM format)';
COMMENT ON COLUMN coupons.percent_off IS 'Discount percentage (10 = 10% off)';

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample queries for common operations

-- Get user's order count
-- SELECT COUNT(*) FROM orders WHERE clerk_user_id = 'user_xxx' AND status = 'PAID';

-- Get active coupons for user
-- SELECT * FROM coupons 
-- WHERE clerk_user_id = 'user_xxx' 
-- AND status = 'ACTIVE' 
-- AND expires_at > NOW();

-- Check if user has coupon for current month
-- SELECT EXISTS(
--   SELECT 1 FROM coupons 
--   WHERE clerk_user_id = 'user_xxx' 
--   AND issued_month = TO_CHAR(NOW(), 'YYYY-MM')
-- );

-- Get order with promotion details
-- SELECT 
--   o.*,
--   o.promo_snapshot->>'coupon_code' as coupon_code,
--   o.promo_snapshot->'applied_discounts' as discounts
-- FROM orders o
-- WHERE razorpay_order_id = 'order_xxx';
