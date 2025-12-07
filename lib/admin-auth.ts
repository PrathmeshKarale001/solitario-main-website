// Admin Authentication Configuration
// Add authorized admin emails here - these users can access /admin
export const ADMIN_EMAILS = [
  'admin@solitario.com',
  'prathmesh@solitario.com',
  'prathmeshkarale@gmail.com',
  'eodsocial@gmail.com', // Add your Google login email
  // Add more admin emails as needed
];

// Admin roles and permissions
export type AdminRole = 'super_admin' | 'admin' | 'manager' | 'viewer';

export interface AdminUser {
  email: string;
  role: AdminRole;
  name?: string;
}

// Role-based permissions
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['*'], // All permissions
  admin: ['view_dashboard', 'manage_products', 'manage_orders', 'manage_customers', 'view_analytics'],
  manager: ['view_dashboard', 'manage_products', 'view_orders', 'view_customers'],
  viewer: ['view_dashboard', 'view_products'],
};

// Admin users with their roles (in production, this should be in a database)
// IMPORTANT: Add your email here to get admin access
export const ADMIN_USERS: Record<string, AdminUser> = {
  'admin@solitario.com': { email: 'admin@solitario.com', role: 'super_admin', name: 'Super Admin' },
  'prathmesh@solitario.com': { email: 'prathmesh@solitario.com', role: 'super_admin', name: 'Prathmesh' },
  'prathmeshkarale@gmail.com': { email: 'prathmeshkarale@gmail.com', role: 'super_admin', name: 'Prathmesh Karale' },
  // Add more admin users as needed
};

// Check if user is an admin
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() in ADMIN_USERS || ADMIN_EMAILS.includes(email.toLowerCase());
}

// Get admin user details
export function getAdminUser(email: string | null | undefined): AdminUser | null {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase();
  
  if (normalizedEmail in ADMIN_USERS) {
    return ADMIN_USERS[normalizedEmail];
  }
  
  // If email is in ADMIN_EMAILS but not in ADMIN_USERS, give them viewer role
  if (ADMIN_EMAILS.includes(normalizedEmail)) {
    return { email: normalizedEmail, role: 'viewer' };
  }
  
  return null;
}

// Check if admin has specific permission
export function hasPermission(email: string | null | undefined, permission: string): boolean {
  const adminUser = getAdminUser(email);
  if (!adminUser) return false;
  
  const permissions = ROLE_PERMISSIONS[adminUser.role];
  return permissions.includes('*') || permissions.includes(permission);
}

// Generate a simple admin access code (for additional security layer)
// In production, use proper 2FA or security keys
export function generateAccessCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Validate access code (stored in session/localStorage)
export function validateAccessCode(code: string, storedCode: string): boolean {
  return code === storedCode;
}
