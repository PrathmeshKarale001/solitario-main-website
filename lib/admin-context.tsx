'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { isAdmin, getAdminUser, hasPermission, AdminUser, AdminRole } from './admin-auth';

interface AdminContextType {
  isAdminUser: boolean;
  adminUser: AdminUser | null;
  isVerified: boolean;
  verifyAccess: (code: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdminUser: false,
  adminUser: null,
  isVerified: false,
  verifyAccess: () => false,
  logout: () => {},
  hasPermission: () => false,
  loading: true,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email;
  const isAdminUser = isAdmin(userEmail);
  const adminUser = getAdminUser(userEmail);

  useEffect(() => {
    if (status === 'loading') return;
    
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
  }, [status, userEmail, isAdminUser]);

  const verifyAccess = (code: string): boolean => {
    // Simple PIN verification - in production, use proper 2FA
    const validPins = ['123456', 'ADMIN1', 'SOL2024']; // Change these!
    
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
