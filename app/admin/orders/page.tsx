'use client';

import { useState } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { 
  ShoppingCart, 
  ExternalLink,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair text-brand-800 mb-1">Orders</h1>
          <p className="text-brand-500 font-montserrat text-sm">Manage customer orders</p>
        </div>
        <Link
          href="https://admin.shopify.com/store/solitarioind/orders"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat text-sm w-fit"
        >
          <ExternalLink className="w-4 h-4" />
          Open Shopify Orders
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-brand border border-brand-100 p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-teal" />
          </div>
          <h2 className="text-xl font-playfair text-brand-800 mb-2">Orders Managed via Shopify</h2>
          <p className="text-brand-500 font-montserrat text-sm mb-6">
            All orders are processed and managed through your Shopify admin panel. 
            Click the button above to view, fulfill, and manage orders.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-bronze-gold" />
                <span className="font-montserrat text-sm text-brand-700">Pending</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">View orders awaiting fulfillment</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-classic-green" />
                <span className="font-montserrat text-sm text-brand-700">Fulfilled</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">Track shipped orders</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-teal" />
                <span className="font-montserrat text-sm text-brand-700">Shipping</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">Manage shipping labels</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-classic-green" />
                <span className="font-montserrat text-sm text-brand-700">Completed</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">View order history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bronze-gold/10 border border-bronze-gold/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-bronze-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-montserrat text-brand-800 text-sm font-medium">Why Shopify for Orders?</p>
            <p className="text-xs text-brand-500 font-montserrat mt-1">
              Shopify provides robust order management with payment processing, inventory tracking, 
              shipping integrations, and customer notifications - all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
