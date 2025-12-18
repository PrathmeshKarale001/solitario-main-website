// Razorpay Integration Configuration
// Add your API keys in .env.local:
// RAZORPAY_KEY_ID=rzp_test_xxxxx (or rzp_live_xxxxx for production)
// RAZORPAY_KEY_SECRET=xxxxx
// NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

import Razorpay from 'razorpay';

// Server-side Razorpay instance
export const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay API keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local');
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Order creation options
export interface CreateOrderOptions {
  amount: number; // Amount in paise (₹100 = 10000 paise)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

// Razorpay order response
export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

// Payment verification
export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Customer details for checkout
export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

// Cart item for order
export interface CartItemForOrder {
  productId: string;
  variantId?: string;
  sku?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Complete order data
export interface OrderData {
  items: CartItemForOrder[];
  customer: CustomerDetails;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
}

// Verify Razorpay signature
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean => {
  const crypto = require('crypto');
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');
  
  return expectedSignature === signature;
};

// Format amount for display
export const formatAmountForDisplay = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Convert rupees to paise for Razorpay
export const rupeesToPaise = (rupees: number): number => {
  return Math.round(rupees * 100);
};

// Convert paise to rupees
export const paiseToRupees = (paise: number): number => {
  return paise / 100;
};

// Generate unique receipt ID
export const generateReceiptId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `SOL_${timestamp}_${randomStr}`.toUpperCase();
};

// Razorpay checkout options for frontend
export const getRazorpayCheckoutOptions = (
  order: RazorpayOrder,
  customer: CustomerDetails,
  onSuccess: (response: PaymentVerification) => void,
  onFailure: (error: any) => void
) => {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Solitario',
    description: 'Diamond Jewellery Purchase',
    image: '/logo.svg', // Your logo
    order_id: order.id,
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone,
    },
    notes: order.notes,
    theme: {
      color: '#146552', // Solitario brand green
      backdrop_color: 'rgba(0, 0, 0, 0.8)',
    },
    modal: {
      ondismiss: () => {
        // Payment modal closed by user
      },
      confirm_close: true,
      escape: false,
    },
    handler: onSuccess,
    'prefill.method': 'upi', // Default to UPI for Indian customers
  };
};
