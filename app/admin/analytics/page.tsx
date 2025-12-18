'use client';

import Link from 'next/link';
import { 
  BarChart3, 
  ExternalLink,
  TrendingUp,
  Eye,
  ShoppingCart,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair text-brand-800 mb-1">Analytics</h1>
          <p className="text-brand-500 font-montserrat text-sm">Track your store performance</p>
        </div>
        <Link
          href="https://admin.shopify.com/store/solitarioind/analytics"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat text-sm w-fit"
        >
          <ExternalLink className="w-4 h-4" />
          Open Shopify Analytics
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-brand border border-brand-100 p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-bronze-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-bronze-gold" />
          </div>
          <h2 className="text-xl font-playfair text-brand-800 mb-2">Analytics via Shopify</h2>
          <p className="text-brand-500 font-montserrat text-sm mb-6">
            Access comprehensive analytics and reports through your Shopify admin panel. 
            Track sales, traffic, customer behavior, and more.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-classic-green" />
                <span className="font-montserrat text-sm text-brand-700">Sales Reports</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">Revenue and order trends</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-teal" />
                <span className="font-montserrat text-sm text-brand-700">Traffic</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">Visitor analytics</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-bronze-gold" />
                <span className="font-montserrat text-sm text-brand-700">Conversion</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">Funnel performance</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-soft-bronze" />
                <span className="font-montserrat text-sm text-brand-700">Products</span>
              </div>
              <p className="text-xs text-brand-500 font-montserrat">Best sellers & inventory</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bronze-gold/10 border border-bronze-gold/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-bronze-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-montserrat text-brand-800 text-sm font-medium">Pro Tip</p>
            <p className="text-xs text-brand-500 font-montserrat mt-1">
              Connect Google Analytics 4 to your Shopify store for even deeper insights 
              into customer behavior and marketing attribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
