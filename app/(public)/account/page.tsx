'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { Section, Container, Button } from '@/components/ui';

export default function AccountPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect_url=/account');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Fetch orders when user is available
      fetchOrders();
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      // TODO: Fetch orders from Shopify using customer access token
      // For now, we'll show empty state
      setOrders([]);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bronze-gold"></div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return null;
  }

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/account/orders', description: 'View and track your orders' },
    { icon: Heart, label: 'Wishlist', href: '/account/wishlist', description: 'Your saved items' },
    { icon: MapPin, label: 'Addresses', href: '/account/addresses', description: 'Manage delivery addresses' },
    { icon: User, label: 'Profile Settings', href: '/account/settings', description: 'Update your information' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-pearl via-white to-bronze-gold/5 pt-24 pb-16">
      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h1 className="font-playfair text-4xl md:text-5xl text-brand-800 mb-3">My Account</h1>
              <p className="text-brand-600 font-montserrat text-lg">
                Welcome back, <span className="text-bronze-gold font-semibold">{user.fullName || user.primaryEmailAddress?.emailAddress}</span>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-brand-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.fullName || 'Profile'}
                          className="w-full h-full rounded-xl object-cover object-center border-2 border-bronze-gold/20"
                        />
                      ) : (
                        <div className="w-full h-full bg-bronze-gold/10 rounded-xl flex items-center justify-center">
                          <User className="w-10 h-10 text-bronze-gold" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-playfair text-heading-md text-brand-800">{user.fullName || 'Customer'}</h2>
                      <p className="text-body-sm text-brand-500 font-montserrat">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 text-error hover:text-white bg-white hover:bg-error py-3.5 border-2 border-error/30 hover:border-error rounded-xl transition-all duration-300 font-montserrat font-medium shadow-sm hover:shadow-md"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>

              {/* Menu Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-brand-100 overflow-hidden">
                  {menuItems.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-bronze-gold/5 hover:to-transparent transition-all duration-300 group ${
                        index !== menuItems.length - 1 ? 'border-b border-brand-100' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-bronze-gold/10 to-bronze-gold/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <item.icon className="w-6 h-6 text-bronze-gold" />
                        </div>
                        <div>
                          <h3 className="font-gotham text-brand-800 font-semibold text-lg">{item.label}</h3>
                          <p className="text-body-sm text-brand-500 font-montserrat">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-brand-400 group-hover:text-bronze-gold group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-3xl text-brand-800">Recent Orders</h2>
                <Link href="/account/orders" className="text-teal hover:text-teal-dark font-montserrat text-body-sm transition-colors">
                  View All
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-brand-100 p-8">
                {isLoadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bronze-gold"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-brand-300 mx-auto mb-4" />
                    <h3 className="font-playfair text-heading-md text-brand-800 mb-2">No orders yet</h3>
                    <p className="text-brand-500 font-montserrat text-body-md mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Link href="/products">
                      <Button variant="primary" className="px-8 py-3 text-base">Browse Collection</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-brand-100 rounded-brand">
                        <div>
                          <p className="font-gotham text-brand-800">Order #{order.orderNumber}</p>
                          <p className="text-body-sm text-brand-500 font-montserrat">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-gotham text-brand-800">{order.total}</p>
                          <p className="text-body-sm text-brand-500 font-montserrat">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
