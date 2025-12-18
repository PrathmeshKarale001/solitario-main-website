'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  Star, 
  RefreshCw, 
  ExternalLink,
  Eye,
  TrendingUp,
  ShoppingBag,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  BarChart3,
  Settings
} from 'lucide-react';
import { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { useAdmin } from '@/lib/admin-context';

interface AdminStats {
  totalProducts: number;
  featuredProducts: number;
  categories: string[];
  avgPrice: number;
}

export default function AdminDashboard() {
  const { adminUser } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    featuredProducts: 0,
    categories: [],
    avgPrice: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      const productList = data.products || [];
      setProducts(productList);
      
      const categories = [...new Set(productList.map((p: Product) => p.category))];
      const featuredCount = productList.filter((p: Product) => p.featured).length;
      const avgPrice = productList.length > 0 
        ? productList.reduce((sum: number, p: Product) => sum + p.price, 0) / productList.length 
        : 0;
      
      setStats({
        totalProducts: productList.length,
        featuredProducts: featuredCount,
        categories: categories as string[],
        avgPrice,
      });
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair text-brand-800 mb-1">
            Welcome back, {adminUser?.name || 'Admin'}
          </h1>
          <p className="text-brand-500 font-montserrat text-sm">
            Manage your Solitario store
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 text-brand-700 rounded-xl hover:bg-brand-50 transition-colors disabled:opacity-50 font-montserrat text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="https://admin.shopify.com/store/solitarioind"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Shopify Admin
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-brand border border-brand-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-classic-green/10 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-classic-green" />
            </div>
          </div>
          <p className="text-3xl font-playfair text-brand-800">{stats.totalProducts}</p>
          <p className="text-brand-500 text-sm font-montserrat">Total Products</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-brand border border-brand-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-bronze-gold/10 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-bronze-gold" />
            </div>
          </div>
          <p className="text-3xl font-playfair text-brand-800">{stats.featuredProducts}</p>
          <p className="text-brand-500 text-sm font-montserrat">Featured Items</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-brand border border-brand-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-teal" />
            </div>
          </div>
          <p className="text-3xl font-playfair text-brand-800">{stats.categories.length}</p>
          <p className="text-brand-500 text-sm font-montserrat">Categories</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-brand border border-brand-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-soft-bronze/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-soft-bronze" />
            </div>
          </div>
          <p className="text-2xl font-playfair text-brand-800">{formatPrice(stats.avgPrice, 'INR')}</p>
          <p className="text-brand-500 text-sm font-montserrat">Avg. Price</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-brand border border-brand-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-playfair text-brand-800">Quick Actions</h2>
          <Zap className="w-5 h-5 text-bronze-gold" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/products"
            className="flex flex-col items-center gap-2 p-4 bg-classic-green/5 rounded-xl hover:bg-classic-green/10 transition-colors border border-classic-green/20 group"
          >
            <div className="w-10 h-10 bg-classic-green/10 rounded-lg flex items-center justify-center group-hover:bg-classic-green/20 transition-colors">
              <Package className="w-5 h-5 text-classic-green" />
            </div>
            <span className="font-montserrat text-brand-700 text-xs text-center">Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex flex-col items-center gap-2 p-4 bg-teal/5 rounded-xl hover:bg-teal/10 transition-colors border border-teal/20 group"
          >
            <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center group-hover:bg-teal/20 transition-colors">
              <ShoppingBag className="w-5 h-5 text-teal" />
            </div>
            <span className="font-montserrat text-brand-700 text-xs text-center">Orders</span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex flex-col items-center gap-2 p-4 bg-soft-bronze/5 rounded-xl hover:bg-soft-bronze/10 transition-colors border border-soft-bronze/20 group"
          >
            <div className="w-10 h-10 bg-soft-bronze/10 rounded-lg flex items-center justify-center group-hover:bg-soft-bronze/20 transition-colors">
              <Users className="w-5 h-5 text-soft-bronze" />
            </div>
            <span className="font-montserrat text-brand-700 text-xs text-center">Customers</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex flex-col items-center gap-2 p-4 bg-bronze-gold/5 rounded-xl hover:bg-bronze-gold/10 transition-colors border border-bronze-gold/20 group"
          >
            <div className="w-10 h-10 bg-bronze-gold/10 rounded-lg flex items-center justify-center group-hover:bg-bronze-gold/20 transition-colors">
              <BarChart3 className="w-5 h-5 text-bronze-gold" />
            </div>
            <span className="font-montserrat text-brand-700 text-xs text-center">Analytics</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex flex-col items-center gap-2 p-4 bg-brand-100/50 rounded-xl hover:bg-brand-100 transition-colors border border-brand-200 group"
          >
            <div className="w-10 h-10 bg-brand-200/50 rounded-lg flex items-center justify-center group-hover:bg-brand-200 transition-colors">
              <Settings className="w-5 h-5 text-brand-600" />
            </div>
            <span className="font-montserrat text-brand-700 text-xs text-center">Settings</span>
          </Link>
          <Link
            href="https://admin.shopify.com/store/solitarioind"
            target="_blank"
            className="flex flex-col items-center gap-2 p-4 bg-brand-900/5 rounded-xl hover:bg-brand-900/10 transition-colors border border-brand-900/20 group"
          >
            <div className="w-10 h-10 bg-brand-900/10 rounded-lg flex items-center justify-center group-hover:bg-brand-900/20 transition-colors">
              <ExternalLink className="w-5 h-5 text-brand-800" />
            </div>
            <span className="font-montserrat text-brand-700 text-xs text-center">Shopify</span>
          </Link>
        </div>
      </div>

      {/* Featured Guide */}
      <div className="bg-gradient-to-r from-bronze-gold/10 to-bronze-gold/5 rounded-2xl p-6 border border-bronze-gold/20">
        <h2 className="text-lg font-playfair text-brand-800 mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-bronze-gold" />
          How to Mark Products as Featured
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-brand-600 font-montserrat text-sm">
          <p className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-classic-green mt-0.5 flex-shrink-0" />
            <span><strong>Method 1:</strong> Add the product to your "Featured" collection in Shopify Admin</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-classic-green mt-0.5 flex-shrink-0" />
            <span><strong>Method 2:</strong> Add the tag "featured" or "bestseller" to the product</span>
          </p>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl shadow-brand border border-brand-100 overflow-hidden">
        <div className="p-6 border-b border-brand-100 flex items-center justify-between">
          <h2 className="text-lg font-playfair text-brand-800">Recent Products</h2>
          <Link href="/admin/products" className="flex items-center gap-1 text-classic-green font-montserrat text-sm hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-classic-green animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-brand-100">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-brand-50/50 transition-colors">
                <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-brand-100 flex-shrink-0">
                  <Image
                    src={product.image || '/images/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-montserrat text-brand-800 text-sm truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-brand-100 rounded text-xs font-montserrat text-brand-600 capitalize">{product.category}</span>
                    {product.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bronze-gold/10 text-bronze-gold rounded text-xs font-montserrat">
                        <Star className="w-3 h-3 fill-current" />Featured
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-gotham text-classic-green text-sm font-semibold hidden sm:block">
                  {formatPrice(product.price, product.currency)}
                </p>
                <Link
                  href={`/products/${product.id}`}
                  className="p-2 hover:bg-brand-100 rounded-lg transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4 text-brand-500" />
                </Link>
              </div>
            ))}
            {recentProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-10 h-10 text-brand-300 mx-auto mb-3" />
                <p className="text-brand-500 font-montserrat text-sm">No products found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
