'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  Lock,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { AdminProvider, useAdmin } from '@/lib/admin-context';
import { isAdmin } from '@/lib/admin-auth';

function AdminVerification({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isAdminUser, adminUser, isVerified, verifyAccess, loading } = useAdmin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/admin');
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bronze-gold mx-auto mb-4"></div>
          <p className="text-white/60 font-montserrat">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not an admin
  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <h1 className="text-2xl font-aguila text-brand-800 mb-2">Access Denied</h1>
          <p className="text-brand-500 font-montserrat mb-6">
            You don't have permission to access the admin panel. 
            Please contact the administrator if you believe this is an error.
          </p>
          <p className="text-xs text-brand-400 font-montserrat mb-6">
            Logged in as: {session?.user?.email}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // Admin but not verified with PIN
  if (!isVerified) {
    const handleVerify = (e: React.FormEvent) => {
      e.preventDefault();
      if (attempts >= 5) {
        setError('Too many attempts. Please try again later.');
        return;
      }
      
      if (verifyAccess(pin)) {
        setError('');
      } else {
        setAttempts(prev => prev + 1);
        setError(`Invalid PIN. ${5 - attempts - 1} attempts remaining.`);
        setPin('');
      }
    };

    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-classic-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-classic-green" />
            </div>
            <h1 className="text-2xl font-aguila text-brand-800 mb-2">Admin Verification</h1>
            <p className="text-brand-500 font-montserrat text-sm">
              Enter your admin PIN to continue
            </p>
          </div>

          <div className="bg-brand-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-brand-600 font-montserrat">
              <strong>Welcome, {adminUser?.name || session?.user?.name || 'Admin'}</strong>
            </p>
            <p className="text-xs text-brand-400 font-montserrat mt-1">
              {session?.user?.email} • {adminUser?.role?.replace('_', ' ').toUpperCase()}
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <div className="mb-4">
              <label className="block text-sm font-montserrat text-brand-600 mb-2">
                Admin PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN"
                  maxLength={10}
                  disabled={attempts >= 5}
                  className="w-full pl-10 pr-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat tracking-widest text-center text-lg"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error text-sm font-montserrat mb-4 text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={!pin || attempts >= 5}
              className="w-full py-3 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Access
            </button>
          </form>

          <p className="text-xs text-brand-400 font-montserrat text-center mt-6">
            This additional security layer protects sensitive admin functions.
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { adminUser, logout } = useAdmin();
  const router = useRouter();

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/customers', icon: Users, label: 'Customers' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-brand-900 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-bronze-gold" />
                <span className="font-aguila text-xl text-white">Admin</span>
              </Link>
              <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors font-montserrat text-sm"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-4 mb-3">
              <p className="text-white font-montserrat text-sm truncate">
                {adminUser?.name || 'Admin'}
              </p>
              <p className="text-white/50 text-xs font-montserrat truncate">
                {adminUser?.email}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-bronze-gold/20 text-bronze-gold text-xs rounded font-gotham uppercase">
                {adminUser?.role?.replace('_', ' ')}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-error/10 text-error rounded-xl hover:bg-error/20 transition-colors font-montserrat text-sm"
            >
              <LogOut className="w-4 h-4" />
              Exit Admin
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-ivory-pearl">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-brand-100">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-brand-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-brand-600" />
            </button>
            
            <div className="flex items-center gap-2 text-sm text-brand-500 font-montserrat">
              <Link href="/" className="hover:text-classic-green transition-colors">
                View Store
              </Link>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminVerification>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminVerification>
    </AdminProvider>
  );
}
