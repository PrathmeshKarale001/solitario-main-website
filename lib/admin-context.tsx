'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { isAdmin, getAdminUser, hasPermission, AdminUser, AdminRole } from './admin-auth';

interface AdminContextType {
  isAdminUser: boolean;
  adminUser: AdminUser | null;
  isVerified: boolean;
  appliedCoupon: string | null;
  setAppliedCoupon: (code: string | null) => void;
  verifyAccess: (code: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdminUser: false,
  adminUser: null,
  isVerified: false,
  appliedCoupon: null,
  setAppliedCoupon: () => {},
  verifyAccess: () => false,
  logout: () => {},
  hasPermission: () => false,
  loading: true,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isVerified, setIsVerified] = useState(false);
  const [appliedCoupon, setAppliedCouponState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminUser = isAdmin(userEmail);
  const adminUser = getAdminUser(userEmail);

  // Load from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCoupon = sessionStorage.getItem('applied_coupon');
      if (savedCoupon) setAppliedCouponState(savedCoupon);
    }
  }, []);

  const setAppliedCoupon = (code: string | null) => {
    setAppliedCouponState(code);
    if (code) {
      sessionStorage.setItem('applied_coupon', code);
    } else {
      sessionStorage.removeItem('applied_coupon');
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    
    // Check if already verified in this session
    const verified = sessionStorage.getItem('admin_verified');
    const verifiedEmail = sessionStorage.getItem('admin_verified_email');
    
    if (verified === 'true' && verifiedEmail === userEmail && isAdminUser) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
      sessionStorage.removeItem('admin_verified');
      sessionStorage.removeItem('admin_verified_email');
    }
    
    setLoading(false);
  }, [loading, userEmail, isAdminUser]);

  const verifyAccess = (code: string): boolean => {
    // Simple PIN verification - in production, use proper 2FA
    const validPins = ['Payment@thesolitario.com', 'SOL2024']; // Change these!
    
    if (validPins.includes(code.toUpperCase())) {
      setIsVerified(true);
      sessionStorage.setItem('admin_verified', 'true');
      sessionStorage.setItem('admin_verified_email', userEmail || '');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsVerified(false);
    sessionStorage.removeItem('admin_verified');
    sessionStorage.removeItem('admin_verified_email');
  };

  const checkPermission = (permission: string): boolean => {
    return hasPermission(userEmail, permission);
  };

  return (
    <AdminContext.Provider value={{
      isAdminUser,
      adminUser,
      isVerified,
      appliedCoupon,
      setAppliedCoupon,
      verifyAccess,
      logout,
      hasPermission: checkPermission,
      loading,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
