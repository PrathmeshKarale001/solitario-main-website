'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { Section, Container } from '@/components/ui';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// Mock order data
const mockOrder: Order = {
  id: '1',
  orderNumber: 'SOL-2024-001',
  date: '2024-12-01',
  status: 'shipped',
  subtotal: 125000,
  shipping: 0,
  tax: 22500,
  total: 147500,
  items: [
    { 
      id: '1', 
      name: 'Solitaire Diamond Ring', 
      image: '/images/products/imgi_8_IZRG0086_AP.png', 
      price: 125000, 
      quantity: 1,
      variant: 'Size 6'
    }
  ],
  shippingAddress: {
    name: 'John Doe',
    phone: '+91 98765 43210',
    address: '123, Diamond Heights, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  },
  trackingNumber: 'SOLI1234567890',
  estimatedDelivery: '2024-12-08',
};

const statusSteps = [
  { key: 'processing', label: 'Order Placed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderDetailPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect_url=/account/orders');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch('/api/account/orders');
        if (response.ok) {
          const data = await response.json();
          // Decode the URL-encoded order ID
          const decodedId = decodeURIComponent(params.id as string);
          const foundOrder = data.orders?.find((o: any) => o.id === decodedId);
          if (foundOrder) {
            setOrder(foundOrder);
          }
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isLoaded && isSignedIn && params.id) {
      fetchOrder();
    }
  }, [params.id, isLoaded, isSignedIn]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const copyTrackingNumber = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bronze-gold"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24">
        <Container>
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-brand-300 mx-auto mb-4" />
            <h1 className="text-2xl font-playfair text-brand-800 mb-2">Order not found</h1>
            <Link href="/account/orders" className="text-classic-green hover:underline font-montserrat">
              Back to Orders
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-20">
      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link href="/account/orders" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-700 mb-6 font-montserrat transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Orders
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-playfair text-brand-800 mb-1">
                  Order {order.orderNumber}
                </h1>
                <p className="text-brand-500 font-montserrat">Placed on {formatDate(order.date)}</p>
              </div>
              <button className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-lg hover:bg-brand-200 transition-colors font-montserrat text-sm">
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
            </motion.div>

            {/* Order Status Timeline */}
            {order.status !== 'cancelled' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 mb-6"
              >
                <h2 className="font-playfair text-lg text-brand-800 mb-6">Order Status</h2>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-brand-200">
                    <div 
                      className="h-full bg-classic-green transition-all duration-500"
                      style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                  
                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const StepIcon = step.icon;
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                            isCompleted 
                              ? 'bg-classic-green text-white' 
                              : 'bg-brand-100 text-brand-400'
                          } ${isCurrent ? 'ring-4 ring-classic-green/20' : ''}`}>
                            <StepIcon className="w-5 h-5" />
                          </div>
                          <p className={`mt-2 text-sm font-montserrat ${
                            isCompleted ? 'text-brand-800' : 'text-brand-400'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="mt-6 pt-6 border-t border-brand-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-brand-500 font-montserrat">Tracking Number</p>
                        <p className="font-gotham text-brand-800">{order.trackingNumber}</p>
                      </div>
                      <button
                        onClick={copyTrackingNumber}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-100 text-brand-600 rounded-lg hover:bg-brand-200 transition-colors text-sm font-montserrat"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    {order.estimatedDelivery && (
                      <p className="mt-2 text-sm text-classic-green font-montserrat">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Estimated delivery: {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 bg-white rounded-2xl shadow-brand border border-brand-100 p-6"
              >
                <h2 className="font-playfair text-lg text-brand-800 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-brand-50 rounded-xl">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-white flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-playfair text-brand-800">{item.name}</h3>
                        {item.variant && (
                          <p className="text-sm text-brand-500 font-montserrat">{item.variant}</p>
                        )}
                        <p className="text-sm text-brand-500 font-montserrat">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-gotham text-classic-green font-semibold">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-brand-100 space-y-2">
                  <div className="flex justify-between text-brand-600 font-montserrat">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-brand-600 font-montserrat">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-brand-600 font-montserrat">
                    <span>Tax (GST)</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-gotham text-brand-800 pt-2 border-t border-brand-100">
                    <span>Total</span>
                    <span className="text-classic-green">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 h-fit"
              >
                <h2 className="font-playfair text-lg text-brand-800 mb-4">Shipping Address</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-classic-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-montserrat text-brand-800 font-medium">{order.shippingAddress.name}</p>
                      <p className="text-sm text-brand-600 font-montserrat">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                        {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-classic-green flex-shrink-0" />
                    <p className="text-sm text-brand-600 font-montserrat">{order.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Help */}
                <div className="mt-6 pt-6 border-t border-brand-100">
                  <p className="text-sm text-brand-500 font-montserrat mb-3">Need help with your order?</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-classic-green hover:text-classic-green/80 font-montserrat text-sm transition-colors"
                  >
                    Contact Support
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
