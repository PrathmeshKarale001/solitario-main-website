'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, CheckCircle, AlertCircle, ShieldCheck, Truck, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui';

interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod' | 'online';
}

export default function ShopCheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [customer, setCustomer] = useState<CustomerForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  const [formErrors, setFormErrors] = useState<Partial<CustomerForm>>({});

  // No additional charges - free shipping
  const grandTotal = total;

  // Wait for cart to load from localStorage before checking if empty
  useEffect(() => {
    // Give cart context time to load from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if cart is empty (only after loading)
  useEffect(() => {
    if (!isLoading && items.length === 0 && !success) {
      router.push('/products');
    }
  }, [items, router, success, isLoading]);

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<CustomerForm> = {};
    
    if (!customer.firstName.trim()) errors.firstName = 'First name is required';
    if (!customer.lastName.trim()) errors.lastName = 'Last name is required';
    if (!customer.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errors.email = 'Invalid email';
    if (!customer.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(customer.phone.replace(/\D/g, ''))) errors.phone = 'Invalid phone number';
    if (!customer.address1.trim()) errors.address1 = 'Address is required';
    if (!customer.city.trim()) errors.city = 'City is required';
    if (!customer.state.trim()) errors.state = 'State is required';
    if (!customer.pincode.trim()) errors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(customer.pincode)) errors.pincode = 'Invalid PIN code';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleInputChange = (field: keyof CustomerForm, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      setError('Please fill all required fields correctly');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderData = {
        customer: {
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          phone: customer.phone,
          address: {
            line1: customer.address1,
            line2: customer.address2,
            city: customer.city,
            state: customer.state,
            pincode: customer.pincode,
          },
        },
        items: items.map(item => ({
          name: item.product.name,
          variant: item.selectedSize || '',
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images?.[0] || item.product.image || '',
        })),
        subtotal: total,
        shipping: 0,
        grandTotal,
        paymentMethod: customer.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Pending)',
        orderDate: new Date().toISOString(),
      };

      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit order');
      }

      setSuccess(true);
      clearCart();
      
      // Redirect to success page
      router.push(`/shop-checkout/success?orderId=${result.orderId}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading while cart is being loaded from localStorage
  if (isLoading || (items.length === 0 && !success)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-classic-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24 pb-16">
      <Container>
        {/* Back Button */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-classic-green transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Customer Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-playfair text-classic-green mb-2">
                Checkout
              </h1>
              <p className="text-gray-600 text-sm">
                Complete your order details below
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Customer Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={customer.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green transition-colors ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="John"
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={customer.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green transition-colors ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Doe"
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green transition-colors ${
                      formErrors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green transition-colors ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="9876543210"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={customer.address1}
                    onChange={(e) => handleInputChange('address1', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green transition-colors ${
                      formErrors.address1 ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="House/Flat No., Building Name"
                  />
                  {formErrors.address1 && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.address1}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={customer.address2}
                    onChange={(e) => handleInputChange('address2', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green transition-colors"
                    placeholder="Street, Landmark (Optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green transition-colors ${
                        formErrors.city ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Mumbai"
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={customer.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green transition-colors ${
                        formErrors.state ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Maharashtra"
                    />
                    {formErrors.state && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                    )}
                  </div>
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={customer.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green transition-colors ${
                      formErrors.pincode ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="400001"
                    maxLength={6}
                  />
                  {formErrors.pincode && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    customer.paymentMethod === 'cod'
                      ? 'border-classic-green bg-classic-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={customer.paymentMethod === 'cod'}
                    onChange={() => handleInputChange('paymentMethod', 'cod')}
                    className="w-4 h-4 text-classic-green focus:ring-classic-green"
                  />
                  <Banknote className="w-5 h-5 text-classic-green" />
                  <div>
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    customer.paymentMethod === 'online'
                      ? 'border-classic-green bg-classic-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={customer.paymentMethod === 'online'}
                    onChange={() => handleInputChange('paymentMethod', 'online')}
                    className="w-4 h-4 text-classic-green focus:ring-classic-green"
                  />
                  <CreditCard className="w-5 h-5 text-classic-green" />
                  <div>
                    <p className="font-medium text-gray-900">Online Payment</p>
                    <p className="text-sm text-gray-500">Our team will contact you with payment details</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product.images?.[0] || item.product.image || '/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">{item.selectedSize}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium text-classic-green">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-classic-green">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span className="text-classic-green">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={isProcessing}
                className="w-full mt-6 bg-classic-green text-white py-4 rounded-lg font-semibold hover:bg-classic-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>Insured Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
