'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Shield, 
  Users, 
  Key, 
  Bell, 
  Globe, 
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_USERS, ROLE_PERMISSIONS, AdminRole } from '@/lib/admin-auth';

export default function AdminSettingsPage() {
  const { adminUser, hasPermission } = useAdmin();
  const [activeTab, setActiveTab] = useState('security');
  const [showPin, setShowPin] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'admins', label: 'Admin Users', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Settings', icon: Key },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isSuperAdmin = adminUser?.role === 'super_admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-didot text-brand-800 mb-1">Settings</h1>
          <p className="text-brand-500 font-montserrat text-sm">
            Manage admin panel configuration and security
          </p>
        </div>
        {saved && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-classic-green/10 text-classic-green rounded-xl font-montserrat text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Settings saved
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-montserrat text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-classic-green text-white'
                : 'bg-white text-brand-600 border border-brand-200 hover:border-classic-green'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-brand border border-brand-100 overflow-hidden">
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-didot text-brand-800 mb-4">Security Settings</h2>
              
              {/* Current PIN */}
              <div className="bg-brand-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-montserrat text-sm text-brand-700">Admin PIN</label>
                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="text-brand-500 hover:text-brand-700"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value="123456"
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border border-brand-200 rounded-lg font-montserrat text-sm"
                  />
                  <button className="p-2 hover:bg-brand-100 rounded-lg transition-colors">
                    <Copy className="w-4 h-4 text-brand-500" />
                  </button>
                </div>
                <p className="text-xs text-brand-400 font-montserrat mt-2">
                  This PIN is required for admin panel access. Change it in the code for security.
                </p>
              </div>

              {/* Security Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
                  <div>
                    <p className="font-montserrat text-brand-800 text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-brand-500 font-montserrat">Require 2FA for all admin logins</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-classic-green"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
                  <div>
                    <p className="font-montserrat text-brand-800 text-sm">Session Timeout</p>
                    <p className="text-xs text-brand-500 font-montserrat">Auto-logout after inactivity</p>
                  </div>
                  <select className="px-3 py-2 bg-white border border-brand-200 rounded-lg font-montserrat text-sm">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
                  <div>
                    <p className="font-montserrat text-brand-800 text-sm">IP Restriction</p>
                    <p className="text-xs text-brand-500 font-montserrat">Limit admin access to specific IPs</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-classic-green"></div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat text-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}

        {/* Admin Users Tab */}
        {activeTab === 'admins' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-didot text-brand-800">Admin Users</h2>
              {isSuperAdmin && (
                <button className="flex items-center gap-2 px-4 py-2 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat text-sm">
                  <Plus className="w-4 h-4" />
                  Add Admin
                </button>
              )}
            </div>

            {!isSuperAdmin && (
              <div className="bg-bronze-gold/10 border border-bronze-gold/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-bronze-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-montserrat text-brand-800 text-sm">Limited Access</p>
                  <p className="text-xs text-brand-500 font-montserrat">
                    Only Super Admins can manage admin users. Contact your administrator for changes.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {Object.values(ADMIN_USERS).map((user) => (
                <div key={user.email} className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-classic-green/10 rounded-full flex items-center justify-center">
                      <span className="text-classic-green font-gotham text-sm">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-montserrat text-brand-800 text-sm">{user.name || 'Admin'}</p>
                      <p className="text-xs text-brand-500 font-montserrat">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-gotham uppercase ${
                      user.role === 'super_admin' ? 'bg-bronze-gold/10 text-bronze-gold' :
                      user.role === 'admin' ? 'bg-classic-green/10 text-classic-green' :
                      'bg-brand-200 text-brand-600'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                    {isSuperAdmin && user.email !== adminUser?.email && (
                      <button className="p-2 hover:bg-error/10 rounded-lg transition-colors text-error">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Role Permissions */}
            <div className="mt-8">
              <h3 className="font-didot text-brand-800 mb-4">Role Permissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-brand-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Role</th>
                      <th className="text-left px-4 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
                      <tr key={role}>
                        <td className="px-4 py-3">
                          <span className="font-montserrat text-brand-800 text-sm capitalize">
                            {role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {permissions.map((perm) => (
                              <span key={perm} className="px-2 py-1 bg-brand-100 rounded text-xs font-montserrat text-brand-600">
                                {perm === '*' ? 'All Permissions' : perm.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-didot text-brand-800 mb-4">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
                <div>
                  <p className="font-montserrat text-brand-800 text-sm">New Order Alerts</p>
                  <p className="text-xs text-brand-500 font-montserrat">Get notified when a new order is placed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-classic-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
                <div>
                  <p className="font-montserrat text-brand-800 text-sm">Low Stock Alerts</p>
                  <p className="text-xs text-brand-500 font-montserrat">Alert when product stock is low</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-classic-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
                <div>
                  <p className="font-montserrat text-brand-800 text-sm">Customer Reviews</p>
                  <p className="text-xs text-brand-500 font-montserrat">Notify when customers leave reviews</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-classic-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
                <div>
                  <p className="font-montserrat text-brand-800 text-sm">Security Alerts</p>
                  <p className="text-xs text-brand-500 font-montserrat">Failed login attempts and suspicious activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-classic-green"></div>
                </label>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat text-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}

        {/* API Settings Tab */}
        {activeTab === 'api' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-didot text-brand-800 mb-4">API Configuration</h2>
            
            <div className="bg-brand-50 rounded-xl p-4">
              <label className="block font-montserrat text-sm text-brand-700 mb-2">Shopify Store Domain</label>
              <input
                type="text"
                value="solitarioind.myshopify.com"
                readOnly
                className="w-full px-4 py-2 bg-white border border-brand-200 rounded-lg font-montserrat text-sm"
              />
            </div>

            <div className="bg-brand-50 rounded-xl p-4">
              <label className="block font-montserrat text-sm text-brand-700 mb-2">Storefront API Status</label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-classic-green rounded-full animate-pulse"></div>
                <span className="text-classic-green font-montserrat text-sm">Connected</span>
              </div>
            </div>

            <div className="bg-bronze-gold/10 border border-bronze-gold/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-bronze-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-montserrat text-brand-800 text-sm">API Keys are Protected</p>
                  <p className="text-xs text-brand-500 font-montserrat">
                    API keys are stored securely in environment variables and cannot be viewed here. 
                    Contact your developer to update API credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
