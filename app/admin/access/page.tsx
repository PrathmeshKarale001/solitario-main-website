'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Shield, Users, Plus, Trash2, Crown, User, Eye } from 'lucide-react';
import { ADMIN_USERS, ADMIN_EMAILS, AdminUser, AdminRole } from '@/lib/admin-auth';

export default function AdminAccessPage() {
  const { user, isSignedIn } = useUser();
  const [adminUsers, setAdminUsers] = useState<Record<string, AdminUser>>(ADMIN_USERS);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('viewer');
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Check if current user is admin
  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
  const currentUser = currentUserEmail ? adminUsers[currentUserEmail.toLowerCase()] : null;
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const addAdminUser = () => {
    if (!newEmail.trim() || !newName.trim()) return;

    const normalizedEmail = newEmail.toLowerCase();
    const updatedAdmins = {
      ...adminUsers,
      [normalizedEmail]: {
        email: normalizedEmail,
        role: newRole,
        name: newName.trim(),
      },
    };

    setAdminUsers(updatedAdmins);
    setNewEmail('');
    setNewName('');
    setNewRole('viewer');
    setIsAdding(false);
  };

  const removeAdminUser = (email: string) => {
    if (email === currentUserEmail?.toLowerCase()) {
      alert('You cannot remove yourself from admin access');
      return;
    }
    
    const updatedAdmins = { ...adminUsers };
    delete updatedAdmins[email];
    setAdminUsers(updatedAdmins);
  };

  const getRoleIcon = (role: AdminRole) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'manager': return <Users className="w-4 h-4 text-green-500" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: AdminRole) => {
    const styles = {
      super_admin: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      admin: 'bg-blue-100 text-blue-800 border-blue-200',
      manager: 'bg-green-100 text-green-800 border-green-200',
      viewer: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[role]}`}>
        {role.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (!isSignedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="font-playfair text-3xl text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-4xl text-gray-900 mb-2">Admin Access Management</h1>
          <p className="text-gray-600 font-montserrat">Manage who has access to the admin panel</p>
        </div>

        {/* Current User Info */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-classic-green/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-classic-green" />
              </div>
              <div>
                <p className="font-medium text-gray-900">You are logged in as:</p>
                <p className="text-sm text-gray-600">{currentUserEmail}</p>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleIcon(currentUser.role)}
                  {getRoleBadge(currentUser.role)}
                </div>
              </div>
            </div>
            {isSuperAdmin && (
              <div className="text-sm text-gray-500">
                <p className="font-medium">Super Admin</p>
                <p>Full access to all settings</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Users List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-xl text-gray-900">Admin Users</h2>
              {isSuperAdmin && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-4 py-2 bg-classic-green hover:bg-classic-green/90 text-white text-sm font-medium rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Admin
                </button>
              )}
            </div>
          </div>

          {/* Add New Admin Form */}
          {isAdding && isSuperAdmin && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Add New Admin User</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green"
                />
                <input
                  type="text"
                  placeholder="Full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green"
                >
                  <option value="viewer">Viewer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={addAdminUser}
                    disabled={!newEmail.trim() || !newName.trim()}
                    className="px-4 py-2 bg-classic-green hover:bg-classic-green/90 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewEmail('');
                      setNewName('');
                      setNewRole('viewer');
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admin Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                  {isSuperAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(adminUsers).map(([email, adminUser]) => (
                  <tr key={email} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{adminUser.name || 'Unknown'}</span>
                        {email === currentUserEmail?.toLowerCase() && (
                          <span className="text-xs bg-classic-green/10 text-classic-green px-2 py-1 rounded-full">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(adminUser.role)}
                        {getRoleBadge(adminUser.role)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        {adminUser.role === 'super_admin' && 'Full access to everything'}
                        {adminUser.role === 'admin' && 'Can manage products, orders, customers'}
                        {adminUser.role === 'manager' && 'Can manage products, view orders'}
                        {adminUser.role === 'viewer' && 'Can view dashboard and products'}
                      </div>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-6 py-4">
                        {email !== currentUserEmail?.toLowerCase() && (
                          <button
                            onClick={() => removeAdminUser(email)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove admin access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Descriptions */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="font-playfair text-lg text-gray-900 mb-4">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-yellow-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Super Admin</p>
                <p className="text-sm text-gray-600">Full access to all settings, can manage other admins</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Admin</p>
                <p className="text-sm text-gray-600">Can manage products, orders, customers, and view analytics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Manager</p>
                <p className="text-sm text-gray-600">Can manage products, view orders and customers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Viewer</p>
                <p className="text-sm text-gray-600">Can view dashboard and products only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">How to Update Admin Access</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Use this interface to add/remove admin users (Super Admin only)</li>
            <li>Or manually edit <code className="bg-blue-100 px-1 rounded">lib/admin-auth.ts</code></li>
            <li>Changes here are temporary - restart server to reset to file values</li>
            <li>For production, consider storing admin users in a database</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
