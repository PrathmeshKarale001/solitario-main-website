'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ChevronLeft, Lock, CreditCard, Smartphone, Loader2, CheckCircle, AlertCircle, ShieldCheck, Gift } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui';
import ProductRecommendations from '@/components/product/ProductRecommendations';
import { LocalCartPromotions } from '@/components/checkout/LocalCartPromotions';
import Script from 'next/script';

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

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
}

interface PincodeCheck {
  checked: boolean;
  serviceable: boolean;
  cod: boolean;
  prepaid: boolean;
  loading: boolean;
  eta?: string;
  error?: string;
}

interface SavedAddress {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user, isLoaded } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [pincodeCheck, setPincodeCheck] = useState<PincodeCheck>({
    checked: false,
    serviceable: false,
    cod: false,
    prepaid: false,
    loading: false,
  });
  
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
  });

  const [formErrors, setFormErrors] = useState<Partial<CustomerForm>>({});
  const [promotionDiscount, setPromotionDiscount] = useState(0);
  const [promotionMessages, setPromotionMessages] = useState<string[]>([]);
  const [giftProduct, setGiftProduct] = useState<{ name: string; image: string; price: number } | null>(null);
  const [isGiftLoading, setIsGiftLoading] = useState(false);
  // Gift only for exactly 2 items, not 3+
  const hasGift = items.reduce((sum, item) => sum + item.quantity, 0) === 2;

  // Auto-fill user info and load saved addresses
  useEffect(() => {
    if (isLoaded && user) {
      // Auto-fill email and phone from Clerk user data
      const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || '';
      const userPhone = user.phoneNumbers.find(p => p.id === user.primaryPhoneNumberId)?.phoneNumber || '';
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      
      setCustomer(prev => ({
        ...prev,
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
        email: prev.email || userEmail,
        phone: prev.phone || userPhone.replace(/\D/g, ''),
      }));

      // Load saved addresses
      loadSavedAddresses();
    }
  }, [isLoaded, user]);

  // Load saved addresses from API
  const loadSavedAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch('/api/account/addresses');
      if (response.ok) {
        const data = await response.json();
        setSavedAddresses(data.addresses || []);
        
        // Auto-select default address if exists
        const defaultAddr = data.addresses?.find((addr: SavedAddress) => addr.isDefault);
        if (defaultAddr) {
          selectSavedAddress(defaultAddr);
        }
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Select a saved address
  const selectSavedAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    const nameParts = address.name.split(' ');
    setCustomer(prev => ({
      ...prev,
      firstName: nameParts[0] || prev.firstName,
      lastName: nameParts.slice(1).join(' ') || prev.lastName,
      address1: address.line1,
      address2: address.line2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    }));
    // Auto-check pincode for selected address
    if (address.pincode.length === 6) {
      checkPincode(address.pincode);
    }
  };

  useEffect(() => {
    async function fetchGift() {
      if (hasGift && !giftProduct) {
        setIsGiftLoading(true);
        try {
          const response = await fetch('/api/products/gift');
          if (response.ok) {
            const data = await response.json();
            setGiftProduct({
              name: data.name,
              image: data.image,
              price: 5000
            });
          }
        } catch (err) {
          console.error('Error fetching gift:', err);
        } finally {
          setIsGiftLoading(false);
        }
      }
    }
    fetchGift();
  }, [hasGift, giftProduct]);

  // Shipping cost calculation
  const shipping = 0;
  const tax = Math.round(total * 0.03); // 3% GST (already included, shown for transparency)
  const discountedTotal = total - (promotionDiscount / 100);
  const grandTotal = Math.max(0, discountedTotal + shipping);

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
    // Reset pincode check when pincode changes
    if (field === 'pincode') {
      setPincodeCheck({
        checked: false,
        serviceable: false,
        cod: false,
        prepaid: false,
        loading: false,
      });
    }
  };

  // Check pincode serviceability
  const checkPincode = async (pincode: string) => {
    if (!/^\d{6}$/.test(pincode)) return;
    
    setPincodeCheck(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      const response = await fetch(`/api/shipping/check-pincode?pincode=${pincode}`);
      const data = await response.json();
      
      if (data.success) {
        setPincodeCheck({
          checked: true,
          serviceable: data.serviceable,
          cod: data.cod || false,
          prepaid: data.prepaid || false,
          eta: data.eta,
          loading: false,
        });
        
        if (!data.serviceable) {
          setError('Sorry, delivery is not available to this pincode. Please try a different address.');
        } else {
          setError(null);
        }
      } else {
        setPincodeCheck({
          checked: true,
          serviceable: false,
          cod: false,
          prepaid: false,
          loading: false,
          error: data.error || 'Failed to check pincode',
        });
      }
    } catch (err) {
      setPincodeCheck({
        checked: true,
        serviceable: false,
        cod: false,
        prepaid: false,
        loading: false,
        error: 'Failed to verify delivery availability',
      });
    }
  };

  // Initialize Razorpay payment
  const initiatePayment = async () => {
    if (!validateForm()) {
      setError('Please fill all required fields correctly');
      return;
    }
    
    // Check pincode serviceability before payment
    if (!pincodeCheck.checked) {
      await checkPincode(customer.pincode);
      // Re-check after async call
      if (!pincodeCheck.serviceable && pincodeCheck.checked) {
        setError('Please verify delivery availability for your pincode before proceeding.');
        return;
      }
    }
    
    if (pincodeCheck.checked && !pincodeCheck.serviceable) {
      setError('Delivery is not available to this pincode. Please use a different address.');
      return;
    }
    
    if (!razorpayLoaded) {
      setError('Payment gateway is still loading. Please wait a moment and try again.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      // Prepare order data with SKU for shipping
      const orderItems = items.map(item => ({
        productId: item.product.id,
        variantId: item.product.variantId,
        sku: item.product.sku || item.product.id, // Use SKU if available
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const customerData = {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone.replace(/\D/g, ''),
        address: {
          line1: customer.address1,
          line2: customer.address2,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          country: 'India',
        },
      };

      // Create Razorpay order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          customer: customerData,
          subtotal: total,
          shipping,
          tax,
          total: grandTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Solitario',
        description: 'Diamond Jewellery Purchase',
        image: '/logo.svg',
        order_id: data.order.id,
        prefill: {
          name: customerData.name,
          email: customerData.email,
          contact: customerData.phone,
        },
        notes: {
          address: `${customer.address1}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
        },
        theme: {
          color: '#146552',
        },
        handler: async function (response: any) {
          // Verify payment on server
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                ...(user?.id ? { 'x-clerk-user-id': user.id } : {})
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  items: orderItems,
                  customer: customerData,
                  subtotal: total,
                  shipping,
                  tax,
                  total: grandTotal,
                  receiptId: data.order.receipt,
                },
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Clear cart and redirect to success page with tracking info
              clearCart();
              const waybillParam = verifyData.order.delhiveryWaybill 
                ? `&waybill=${verifyData.order.delhiveryWaybill}` 
                : '';
              router.push(`/checkout/success?orderId=${verifyData.order.orderId}&paymentId=${response.razorpay_payment_id}${waybillParam}`);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (verifyError) {
            console.error('Verification error:', verifyError);
            router.push(`/checkout/failed?reason=verification_failed`);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setError('Payment was cancelled. Please try again.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        router.push(`/checkout/failed?reason=${response.error.code}&description=${encodeURIComponent(response.error.description)}`);
      });
      razorpay.open();
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <Container>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h1 className="font-playfair text-display-sm text-brand-800 mb-4">No Items in Cart</h1>
            <p className="text-brand-600 font-montserrat text-body-md mb-8">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-classic-green hover:bg-classic-green/90 text-white px-8 py-4 font-gotham text-ui uppercase tracking-luxury rounded-lg shadow-lg hover:shadow-xl transition-all duration-500"
            >
              Continue Shopping
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      {/* Load Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => setError('Failed to load payment gateway')}
      />

      <div className="min-h-screen bg-gray-50 pt-24">
        <Container className="py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-classic-green transition-colors font-montserrat mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="font-playfair text-3xl md:text-4xl text-gray-900">Secure Checkout</h1>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-montserrat text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
                <h2 className="font-playfair text-xl text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={customer.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${
                          formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={customer.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${
                          formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${
                        formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-gray-500 font-montserrat">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        className={`w-full px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${
                          formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
                <h2 className="font-playfair text-xl text-gray-900 mb-6">Shipping Address</h2>
                
                {/* Saved Addresses Selection */}
                {user && savedAddresses.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select a saved address
                    </label>
                    <div className="space-y-2">
                      {savedAddresses.map((address) => (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => selectSavedAddress(address)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            selectedAddressId === address.id
                              ? 'border-classic-green bg-classic-green/5'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{address.name}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {address.line1}
                                {address.line2 && `, ${address.line2}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                            {address.isDefault && (
                              <span className="ml-2 px-2 py-1 bg-classic-green/10 text-classic-green text-xs font-medium rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Or enter a new address below
                    </p>
                  </div>
                )}

                {loadingAddresses && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-600">Loading saved addresses...</span>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      value={customer.address1}
                      onChange={(e) => handleInputChange('address1', e.target.value)}
                      placeholder="House/Flat No., Building Name, Street"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${
                        formErrors.address1 ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.address1 && <p className="text-red-500 text-xs mt-1">{formErrors.address1}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      value={customer.address2}
                      onChange={(e) => handleInputChange('address2', e.target.value)}
                      placeholder="Landmark, Area (optional)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Mumbai"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${
                          formErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        value={customer.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Maharashtra"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${
                          formErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customer.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="400001"
                          className={`w-full px-4 py-3 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${
                            formErrors.pincode ? 'border-red-300 bg-red-50' : pincodeCheck.checked && pincodeCheck.serviceable ? 'border-green-500 bg-green-50' : 'border-gray-200'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => checkPincode(customer.pincode)}
                          disabled={customer.pincode.length !== 6 || pincodeCheck.loading}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-md transition-colors flex items-center justify-center min-w-[60px]"
                        >
                          {pincodeCheck.loading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            'Check'
                          )}
                        </button>
                      </div>
                      {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
                      {pincodeCheck.checked && (
                        <div className={`mt-1 text-xs ${pincodeCheck.serviceable ? 'text-green-600' : 'text-red-500'}`}>
                          {pincodeCheck.serviceable ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Delivery available</span>
                                {pincodeCheck.prepaid && <span className="ml-1 text-gray-500">• Prepaid ✓</span>}
                              </div>
                              {pincodeCheck.eta && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <span className="font-medium">🚚 {pincodeCheck.eta}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              <span>Delivery not available to this pincode</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
                <h2 className="font-playfair text-xl text-gray-900 mb-4">Payment</h2>
                <div className="flex items-center gap-4 p-4 bg-classic-green/5 border border-classic-green/20 rounded-lg">
                  <ShieldCheck className="w-8 h-8 text-classic-green" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment via Razorpay</p>
                    <p className="text-sm text-gray-600">UPI, Cards, Net Banking, Wallets - All payment methods accepted</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Image src="/payment-icons/visa.svg" alt="Visa" width={40} height={25} className="opacity-70" />
                  <Image src="/payment-icons/mastercard.svg" alt="Mastercard" width={40} height={25} className="opacity-70" />
                  <Image src="/payment-icons/upi.svg" alt="UPI" width={40} height={25} className="opacity-70" />
                  <Image src="/payment-icons/rupay.svg" alt="RuPay" width={40} height={25} className="opacity-70" />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="font-playfair text-xl text-gray-900 mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                          {item.product.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="font-semibold text-sm text-classic-green">
                            {formatPrice(item.product.price * item.quantity, item.product.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Gift Item Display - Clean, Minimal Design */}
                  {hasGift && (
                    <div className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 relative">
                      {isGiftLoading ? (
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-200 animate-pulse" />
                      ) : giftProduct ? (
                        <>
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={giftProduct.image}
                              alt={giftProduct.name}
                              fill
                              className="object-contain p-2"
                            />
                            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[6px] px-1 py-0.5 font-bold uppercase rounded-bl">
                              Gift
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Gift size={12} className="text-amber-500 shrink-0" />
                              <p className="font-medium text-sm text-gray-900 line-clamp-1">
                                {giftProduct.name}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-gotham font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100">FREE GIFT</span>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Promotions */}
                <div className="mb-6">
                  <LocalCartPromotions
                    totalItems={items.reduce((sum, item) => sum + item.quantity, 0)}
                    subtotal={total * 100}
                    onDiscountApplied={(discount, messages) => {
                      setPromotionDiscount(discount);
                      const filteredMessages = messages.filter(msg => !msg.toLowerCase().includes('free gift'));
                      setPromotionMessages(filteredMessages);
                    }}
                  />
                  {promotionMessages.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {promotionMessages.map((msg, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs border border-green-100">
                          <CheckCircle size={14} className="shrink-0" />
                          <span>{msg}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {hasGift && (
                    <div className="mt-4 flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-xs border border-amber-100">
                      <Gift size={14} className="shrink-0" />
                      <span>Free gift {giftProduct?.name ? `(${giftProduct.name})` : ''} included with your order</span>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="space-y-3 pt-4 border-t border-gray-200 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(total, '₹')}
                    </span>
                  </div>
                  {promotionDiscount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="font-medium">Discount</span>
                      <span className="font-medium">
                        -{formatPrice(promotionDiscount / 100, '₹')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? (
                        <span className="text-classic-green">FREE</span>
                      ) : (
                        formatPrice(shipping, '₹')
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Free shipping on orders above ₹5,000</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">GST (Included)</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(tax, '₹')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-300 mb-2">
                  <span className="font-playfair text-lg text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-classic-green">
                    {formatPrice(grandTotal, '₹')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-6">(All prices are inclusive of taxes)</p>

                {/* Pay Now Button */}
                <button
                  onClick={initiatePayment}
                  disabled={isProcessing || !razorpayLoaded}
                  className="w-full bg-classic-green hover:bg-classic-green/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 font-semibold uppercase tracking-wide rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay {formatPrice(grandTotal, '₹')}
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-gray-500">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Verified</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Recommendations */}
          <div className="mt-16">
            <ProductRecommendations 
              title="Products you may like"
              limit={4}
              maxPrice={15000}
              className="max-w-6xl mx-auto"
            />
          </div>
        </Container>
      </div>
    </>
  );
}
