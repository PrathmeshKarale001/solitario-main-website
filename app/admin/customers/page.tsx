'use client';

import Link from 'next/link';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { 
  Users, 
  ExternalLink,
  UserPlus,
  Mail,
  ShoppingBag,
  Heart,
  AlertCircle
} from 'lucide-react';

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair text-brand-800 mb-1">Customers</h1>
          <p className="text-brand-500 font-montserrat text-sm">Manage your customer base</p>
        </div>
        <Link
          href="https://admin.shopify.com/store/solitarioind/customers"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat text-sm w-fit"
        >
          <ExternalLink className="w-4 h-4" />
          Open Shopify Customers
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-brand border border-brand-100 p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-soft-bronze/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-soft-bronze" />
          </div>
          <h2 className="text-xl font-playfair text-brand-800 mb-2">Customer Management via Shopify</h2>
          <p className="text-brand-500 font-montserrat text-sm mb-6">
            All customer data is securely managed through your Shopify admin panel. 
            View customer profiles, order history, and communication preferences.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="w-4 h-4 text-classic-green" />
                <span className="font-montserrat text-sm text-brand-700">New Customers</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">View recent signups</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-4 h-4 text-teal" />
                <span className="font-montserrat text-sm text-brand-700">Order History</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">Track purchase patterns</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-bronze-gold" />
                <span className="font-montserrat text-sm text-brand-700">Email Marketing</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">Manage subscriptions</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-error" />
                <span className="font-montserrat text-sm text-brand-700">VIP Customers</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">Identify top buyers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bronze-gold/10 border border-bronze-gold/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-bronze-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-montserrat text-brand-800 text-sm font-medium">Customer Data Privacy</p>
            <p className="text-xs text-brand-500 font-montserrat mt-1">
              Customer data is stored securely in Shopify with GDPR compliance. 
              Access customer information responsibly and in accordance with privacy policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
