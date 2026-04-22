'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ChevronLeft, Lock, CreditCard, Smartphone, Loader2, CheckCircle, AlertCircle, ShieldCheck, Gift, Edit, MessageSquare, TruckIcon, Package, Ticket, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { isPrebookingProduct, getCartItemPrice, formatPrebookingOrderNotes, PREBOOK_PRICE } from '@/lib/prebooking';
import { Container } from '@/components/ui';
import ProductRecommendations from '@/components/products/ProductRecommendations';
import { LocalCartPromotions } from '@/components/checkout/LocalCartPromotions';
import Script from 'next/script';
import { trackPaymentInitiate } from '@/lib/gtm-conversions';
import { trackMetaAddPaymentInfo } from '@/components/analytics/MetaPixel';
import { usePincodeLookup } from '@/hooks/usePincodeLookup';
import { isFestivalOfferActive, FESTIVAL_OFFER } from '@/lib/festival-offer';
// FestivalGiftItem import DELETED

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
  deliveryInstructions?: string;
  alternativePhone?: string;
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
    deliveryInstructions: '',
    alternativePhone: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<CustomerForm>>({});
  const [promotionDiscount, setPromotionDiscount] = useState(0);
  const [promotionMessages, setPromotionMessages] = useState<string[]>([]);
  const [giftProduct, setGiftProduct] = useState<{ name: string; image: string; price: number } | null>(null);
  const [isGiftLoading, setIsGiftLoading] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // PIN code auto-fill hook
  const { lookup: lookupPincode, loading: pincodeAutoFillLoading, data: pincodeData, error: pincodeError } = usePincodeLookup();
  const [isCityStateLocked, setIsCityStateLocked] = useState(false);
  // Gift product disabled - Buy 2 Get 1 Free uses discount only, no separate gift item
  const hasGift = false;

  // Festival Offer logic DELETED

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
        phone: prev.phone || userPhone.replace(/\D/g, '').slice(-10),
      }));

      // Parallelize: Load saved addresses and gift product simultaneously
      Promise.all([
        loadSavedAddresses(),
        hasGift && !giftProduct ? fetchGiftProduct() : Promise.resolve()
      ]).catch(err => {
        console.error('Error loading checkout data:', err);
      });
    } else if (isLoaded && !user) {
      // Guest checkout - show new address form by default
      setShowNewAddressForm(true);
      // Still fetch gift if needed
      if (hasGift && !giftProduct) {
        fetchGiftProduct().catch(err => console.error('Error fetching gift:', err));
      }
    }
  }, [isLoaded, user, hasGift, giftProduct]);

  // Load saved addresses from API
  const loadSavedAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch('/api/account/addresses');
      if (response.ok) {
        const data = await response.json();
        const addresses = data.addresses || [];
        setSavedAddresses(addresses);

        if (addresses.length > 0) {
          // Auto-select default address if exists
          const defaultAddr = addresses.find((addr: SavedAddress) => addr.isDefault);
          if (defaultAddr) {
            selectSavedAddress(defaultAddr);
          } else {
            // Select first address if no default
            selectSavedAddress(addresses[0]);
          }
          setShowNewAddressForm(false);
        } else {
          // No saved addresses, show new address form
          setShowNewAddressForm(true);
        }
      } else {
        console.error('Failed to fetch addresses:', response.status);
        setShowNewAddressForm(true);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
      setShowNewAddressForm(true);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Select a saved address
  const selectSavedAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    setShowNewAddressForm(false);
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
    // Clear form errors
    setFormErrors({});
    // Auto-check pincode for selected address
    if (address.pincode.length === 6) {
      checkPincode(address.pincode);
    }
  };

  // Switch to new address form
  const handleAddNewAddress = () => {
    setSelectedAddressId('');
    setShowNewAddressForm(true);
    // Clear address fields but keep contact info
    setCustomer(prev => ({
      ...prev,
      address1: '',
      address2: '',
      city: '',
      state: '',
      pincode: '',
    }));
    setPincodeCheck({
      checked: false,
      serviceable: false,
      cod: false,
      prepaid: false,
      loading: false,
    });
  };

  // Extract gift fetching to a reusable function for parallelization
  const fetchGiftProduct = async () => {
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
  };

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

  // Handle PIN code blur - auto-fetch city/state
  const handlePincodeBlur = async () => {
    if (customer.pincode.length === 6 && /^\d{6}$/.test(customer.pincode)) {
      await fetchCityState(customer.pincode);
    }
  };

  // Fetch city and state from PIN code
  const fetchCityState = async (pincode: string) => {
    if (!/^\d{6}$/.test(pincode)) return;

    const result = await lookupPincode(pincode);
    if (result.success && result.city && result.state) {
      setCustomer(prev => ({
        ...prev,
        city: result.city || prev.city,
        state: result.state || prev.state,
      }));
      setIsCityStateLocked(true);
      // Clear city/state errors if they were set
      setFormErrors(prev => ({
        ...prev,
        city: undefined,
        state: undefined
      }));
    }
  };

  // Unlock city/state fields for manual editing
  const unlockCityState = () => {
    setIsCityStateLocked(false);
  };

  // Handle input change
  const handleInputChange = async (field: keyof CustomerForm, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Reset pincode check and unlock fields when pincode changes
    if (field === 'pincode') {
      setPincodeCheck({
        checked: false,
        serviceable: false,
        cod: false,
        prepaid: false,
        loading: false,
      });
      // Unlock city/state when PIN code changes
      setIsCityStateLocked(false);
    }
    // If city/state are locked, prevent manual changes
    if ((field === 'city' || field === 'state') && isCityStateLocked) {
      return; // Don't allow changes when locked
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

    // Track Payment Initiate conversion (Google Ads)
    // grandTotal is already in rupees (e.g., 10999 for ₹10,999)
    trackPaymentInitiate(grandTotal);
    // Track Add Payment Info (Meta Pixel)
    trackMetaAddPaymentInfo({
      content_ids: items.map(item => item.product.id),
      value: grandTotal,
      currency: 'INR',
    });

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare order data with SKU for shipping
      // Use prebooking price for Warner Bros products
      const orderItems = items.map(item => ({
        productId: item.product.id,
        variantId: item.product.variantId,
        sku: item.product.sku || item.product.id, // Use SKU if available
        name: item.product.name,
        price: getCartItemPrice(item.product), // Use prebooking price for WB items
        quantity: item.quantity,
        image: item.product.image,
        isPrebook: isPrebookingProduct(item.product),
      }));

      // Identify prebooking items for order notes
      const prebookingItems = items
        .filter(item => isPrebookingProduct(item.product))
        .map(item => ({ name: item.product.name, quantity: item.quantity }));

      const customerName = `${customer.firstName} ${customer.lastName}`;
      const prebookingNotes = formatPrebookingOrderNotes(customerName, prebookingItems);
      const hasPrebookingItems = prebookingItems.length > 0;

      const customerData = {
        name: customerName,
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
          prebookingNotes: prebookingNotes || undefined,
          hasPrebookingItems,
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
        description: hasPrebookingItems ? 'Prebooking Order - Warner Bros Collection' : 'Diamond Jewellery Purchase',
        image: '/logo.svg',
        order_id: data.order.id,
        prefill: {
          name: customerData.name,
          email: customerData.email,
          contact: customerData.phone,
        },
        notes: {
          address: `${customer.address1}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
          ...(hasPrebookingItems ? { order_type: 'prebooking', prebooking_items: prebookingItems.map(i => i.name).join(', ') } : {}),
        },
        theme: {
          color: hasPrebookingItems ? '#7c3aed' : '#146552', // Purple for prebooking
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
                  prebookingNotes: prebookingNotes || undefined,
                  hasPrebookingItems,
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
              // Pass order value for GTM tracking (grandTotal is already in rupees, e.g., 10999 for ₹10,999)
              router.push(`/checkout/success?orderId=${verifyData.order.orderId}&paymentId=${response.razorpay_payment_id}&value=${grandTotal}${waybillParam}`);
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
            <h1 className="font-montserrat font-bold text-display-sm text-brand-800 mb-4">No Items in Cart</h1>
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
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-classic-green transition-colors font-montserrat"
              >
                <ChevronLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-classic-green hover:text-classic-green/80 transition-colors font-montserrat"
              >
                <Edit className="w-4 h-4" />
                Edit Cart
              </Link>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4 md:space-x-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-classic-green text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <span className="ml-2 text-sm font-medium text-gray-900 hidden md:inline">Address</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300 max-w-[60px] md:max-w-[100px]"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <span className="ml-2 text-sm font-medium text-gray-500 hidden md:inline">Review</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300 max-w-[60px] md:max-w-[100px]"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <span className="ml-2 text-sm font-medium text-gray-500 hidden md:inline">Payment</span>
                </div>
              </div>
            </div>

            <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-900">Secure Checkout</h1>
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
                <h2 className="font-montserrat font-bold text-xl text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={customer.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                        className={`w-full px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                      />
                    </div>
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
                <h2 className="font-montserrat font-bold text-xl text-gray-900 mb-6">Shipping Address</h2>

                {loadingAddresses ? (
                  <div className="p-8 flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-classic-green" />
                    <span className="text-gray-600">Loading your addresses...</span>
                  </div>
                ) : (
                  <>
                    {/* Saved Addresses - Amazon Style with Radio Buttons */}
                    {user && savedAddresses.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Your Addresses</h3>
                        <div className="space-y-3">
                          {savedAddresses.map((address) => (
                            <label
                              key={address.id}
                              className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddressId === address.id && !showNewAddressForm
                                ? 'border-classic-green bg-classic-green/5'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="address"
                                  checked={selectedAddressId === address.id && !showNewAddressForm}
                                  onChange={() => selectSavedAddress(address)}
                                  className="mt-1 w-4 h-4 text-classic-green focus:ring-classic-green"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">{address.name}</span>
                                    {address.isDefault && (
                                      <span className="px-2 py-0.5 bg-classic-green/10 text-classic-green text-xs font-medium rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {address.line1}
                                    {address.line2 && `, ${address.line2}`}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {address.city}, {address.state} - {address.pincode}
                                  </p>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>

                        {/* Add New Address Option */}
                        <label
                          className={`block p-4 rounded-lg border-2 cursor-pointer transition-all mt-3 ${showNewAddressForm
                            ? 'border-classic-green bg-classic-green/5'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={showNewAddressForm}
                              onChange={handleAddNewAddress}
                              className="w-4 h-4 text-classic-green focus:ring-classic-green"
                            />
                            <span className="font-medium text-gray-900">+ Add a new address</span>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* New Address Form - Only show when selected or no saved addresses */}
                    {showNewAddressForm && (
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                          <input
                            type="text"
                            value={customer.address1}
                            onChange={(e) => handleInputChange('address1', e.target.value)}
                            placeholder="House/Flat No., Building Name, Street"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${formErrors.address1 ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                          {/* PIN Code - First for auto-fill flow */}
                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              PIN Code *
                              {pincodeAutoFillLoading && (
                                <span className="ml-2 text-xs text-classic-green font-normal">Fetching...</span>
                              )}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={customer.pincode}
                                onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                onBlur={handlePincodeBlur}
                                placeholder="400001"
                                className={`w-full px-4 py-3 pr-24 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all ${formErrors.pincode ? 'border-red-300 bg-red-50' : pincodeCheck.checked && pincodeCheck.serviceable ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                  }`}
                              />
                              <button
                                type="button"
                                onClick={() => fetchCityState(customer.pincode)}
                                disabled={customer.pincode.length !== 6 || pincodeAutoFillLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium bg-classic-green hover:bg-classic-green/90 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-md transition-colors flex items-center justify-center min-w-[70px]"
                                title="Fetch City & State"
                              >
                                {pincodeAutoFillLoading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  'Fetch'
                                )}
                              </button>
                            </div>
                            {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
                            {pincodeError && !pincodeAutoFillLoading && (
                              <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>Could not auto-fill. Please enter manually.</span>
                              </p>
                            )}
                            {pincodeData?.success && (
                              <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>City & State auto-filled</span>
                              </p>
                            )}
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
                          {/* City - Auto-filled from PIN code */}
                          <div className="sm:col-span-1">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                City *
                                {pincodeAutoFillLoading && (
                                  <Loader2 className="inline w-3 h-3 ml-2 animate-spin text-classic-green" />
                                )}
                              </label>
                              {isCityStateLocked && (
                                <button
                                  type="button"
                                  onClick={unlockCityState}
                                  className="text-xs text-classic-green hover:text-classic-green/80 font-medium"
                                  title="Click to edit manually"
                                >
                                  Unlock
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={customer.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              disabled={isCityStateLocked}
                              placeholder={isCityStateLocked ? "Auto-filled from PIN code" : "Enter PIN code to auto-fill"}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat transition-all ${isCityStateLocked
                                ? 'bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300'
                                : formErrors.city
                                  ? 'border-red-300 bg-red-50 text-gray-800'
                                  : customer.city && pincodeData?.success
                                    ? 'border-green-200 bg-green-50/50 text-gray-800'
                                    : 'border-gray-200 text-gray-800'
                                }`}
                            />
                            {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                          </div>
                          {/* State - Auto-filled from PIN code */}
                          <div className="sm:col-span-1">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                State *
                                {pincodeAutoFillLoading && (
                                  <Loader2 className="inline w-3 h-3 ml-2 animate-spin text-classic-green" />
                                )}
                              </label>
                              {isCityStateLocked && (
                                <button
                                  type="button"
                                  onClick={unlockCityState}
                                  className="text-xs text-classic-green hover:text-classic-green/80 font-medium"
                                  title="Click to edit manually"
                                >
                                  Unlock
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={customer.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              disabled={isCityStateLocked}
                              placeholder={isCityStateLocked ? "Auto-filled from PIN code" : "Enter PIN code to auto-fill"}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat transition-all ${isCityStateLocked
                                ? 'bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300'
                                : formErrors.state
                                  ? 'border-red-300 bg-red-50 text-gray-800'
                                  : customer.state && pincodeData?.success
                                    ? 'border-green-200 bg-green-50/50 text-gray-800'
                                    : 'border-gray-200 text-gray-800'
                                }`}
                            />
                            {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                          </div>
                        </div>

                        {/* Delivery Instructions */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MessageSquare className="w-4 h-4 inline mr-2" />
                            Delivery Instructions (Optional)
                          </label>
                          <textarea
                            value={customer.deliveryInstructions || ''}
                            onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                            placeholder="E.g., Leave at door, Call before delivery, Landmark details..."
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green font-montserrat text-gray-800 placeholder:text-gray-400 transition-all resize-none"
                          />
                        </div>

                        {/* Alternative Phone */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alternative Phone Number (Optional)
                          </label>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-classic-green/30 focus-within:border-classic-green transition-all">
                            <span className="px-3 py-3 bg-gray-50 text-gray-500 border-r border-gray-200 font-montserrat text-sm">+91</span>
                            <input
                              type="tel"
                              value={customer.alternativePhone || ''}
                              onChange={(e) => handleInputChange('alternativePhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                              placeholder="Backup contact number"
                              className="flex-1 px-4 py-3 focus:outline-none font-montserrat text-gray-800 placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
                <h2 className="font-montserrat font-bold text-xl text-gray-900 mb-4">Payment</h2>
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
                <h2 className="font-montserrat font-bold text-xl text-gray-900 mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                  {items.map((item) => {
                    const isPrebook = isPrebookingProduct(item.product);
                    const itemPrice = getCartItemPrice(item.product);
                    return (
                      <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                          />
                          {isPrebook && (
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[6px] px-1 py-0.5 font-bold uppercase rounded-bl">
                              Prebook
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                            {item.product.name}
                          </p>
                          {isPrebook && (
                            <span className="inline-flex items-center gap-1 mb-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-semibold uppercase tracking-wide rounded">
                              <Ticket className="w-2.5 h-2.5" />
                              Prebooking
                            </span>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            <p className={`font-semibold text-sm ${isPrebook ? 'text-purple-600' : 'text-classic-green'}`}>
                              {formatPrice(itemPrice * item.quantity, item.product.currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

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
                  {/* Akshaya Tritiya Gift Item DELETED */}
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
                  {/* Akshaya Tritiya Banner DELETED */}

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
                  {/* Prebooking Info Banner */}
                  {items.some(item => isPrebookingProduct(item.product)) && (
                    <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 px-4 py-3 rounded-lg text-xs border border-purple-200">
                      <div className="flex items-start gap-2">
                        <Ticket size={16} className="shrink-0 mt-0.5 text-purple-600" />
                        <div>
                          <p className="font-semibold mb-1">Prebooking Order - Warner Bros Collection</p>
                          <p className="text-purple-600 text-[11px]">
                            This order includes prebooking items at ₹{PREBOOK_PRICE.toLocaleString('en-IN')}/item.
                            Full payment will be collected upon product availability.
                          </p>
                        </div>
                      </div>
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
                  {/* Festival Discount Rows DELETED */}
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

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">GST (Included)</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(tax, '₹')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-300 mb-2">
                  <span className="font-montserrat font-bold text-lg text-gray-900">Total</span>
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
