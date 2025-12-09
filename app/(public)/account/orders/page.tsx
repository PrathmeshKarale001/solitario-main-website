'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronLeft, Search, Filter, Eye, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Section, Container } from '@/components/ui';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
}

// Orders will be fetched from Shopify

const statusConfig = {
  processing: { icon: Clock, color: 'text-bronze-gold', bg: 'bg-bronze-gold/10', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-teal', bg: 'bg-teal/10', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-classic-green', bg: 'bg-classic-green/10', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-error', bg: 'bg-error/10', label: 'Cancelled' },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/account/orders');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch real orders from Shopify
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/account/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          // No orders or error - show empty state
          setOrders([]);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bronze-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-20">
      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link href="/account" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-700 mb-6 font-montserrat transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Account
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-playfair text-brand-800 mb-2">My Orders</h1>
              <p className="text-brand-500 font-montserrat">Track and manage your orders</p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat bg-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat bg-white"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </motion.div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-brand border border-brand-100 p-12 text-center"
              >
                <Package className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                <h2 className="text-xl font-playfair text-brand-800 mb-2">No orders found</h2>
                <p className="text-brand-500 font-montserrat mb-6">
                  {searchQuery || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start shopping to see your orders here'}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat"
                >
                  Browse Products
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, index) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-brand border border-brand-100 overflow-hidden hover:shadow-brand-lg transition-shadow"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-brand-100 bg-brand-50/50">
                        <div className="flex items-center gap-4 mb-2 sm:mb-0">
                          <div>
                            <p className="font-gotham text-brand-800">{order.orderNumber}</p>
                            <p className="text-sm text-brand-500 font-montserrat">{formatDate(order.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-montserrat ${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig[order.status].label}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-brand-50 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-playfair text-brand-800 truncate">{item.name}</h3>
                              <p className="text-sm text-brand-500 font-montserrat">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-gotham text-classic-green font-semibold">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="flex items-center justify-between p-4 border-t border-brand-100 bg-brand-50/30">
                        <div>
                          <p className="text-sm text-brand-500 font-montserrat">Total</p>
                          <p className="font-gotham text-lg text-brand-800">{formatPrice(order.total)}</p>
                        </div>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-classic-green/10 text-classic-green rounded-lg hover:bg-classic-green/20 transition-colors font-montserrat text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
