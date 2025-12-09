'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  Star, 
  Search, 
  RefreshCw, 
  ExternalLink,
  Edit,
  Eye,
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  LayoutGrid,
  List,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
  Zap
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
  const { adminUser, hasPermission } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'not-featured'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesFeatured = filterFeatured === 'all' || 
      (filterFeatured === 'featured' && product.featured) ||
      (filterFeatured === 'not-featured' && !product.featured);
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  // Mock data for demo
  const recentActivity = [
    { type: 'order', message: 'New order #SOL-2024-042', time: '5 min ago', icon: ShoppingBag },
    { type: 'product', message: 'Product "Diamond Ring" updated', time: '1 hour ago', icon: Package },
    { type: 'customer', message: 'New customer registered', time: '2 hours ago', icon: Users },
    { type: 'order', message: 'Order #SOL-2024-041 shipped', time: '3 hours ago', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair text-brand-800 mb-1">
            Welcome back, {adminUser?.name || 'Admin'}
          </h1>
          <p className="text-brand-500 font-montserrat text-sm">
            Here's what's happening with your store today
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
            <span className="flex items-center gap-1 text-classic-green text-xs font-montserrat">
              <ArrowUpRight className="w-3 h-3" />
              +12%
            </span>
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
            <span className="flex items-center gap-1 text-bronze-gold text-xs font-montserrat">
              <ArrowUpRight className="w-3 h-3" />
              +5%
            </span>
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
              <ShoppingBag className="w-6 h-6 text-teal" />
            </div>
            <span className="flex items-center gap-1 text-teal text-xs font-montserrat">
              <ArrowUpRight className="w-3 h-3" />
              +18%
            </span>
          </div>
          <p className="text-3xl font-playfair text-brand-800">24</p>
          <p className="text-brand-500 text-sm font-montserrat">Orders Today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-brand border border-brand-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-soft-bronze/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-soft-bronze" />
            </div>
            <span className="flex items-center gap-1 text-classic-green text-xs font-montserrat">
              <ArrowUpRight className="w-3 h-3" />
              +23%
            </span>
          </div>
          <p className="text-2xl font-playfair text-brand-800">₹4.2L</p>
          <p className="text-brand-500 text-sm font-montserrat">Revenue Today</p>
        </motion.div>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-brand border border-brand-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-playfair text-brand-800">Quick Actions</h2>
            <Zap className="w-5 h-5 text-bronze-gold" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="https://admin.shopify.com/store/solitarioind/products/new"
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 bg-classic-green/5 rounded-xl hover:bg-classic-green/10 transition-colors border border-classic-green/20 group"
            >
              <div className="w-10 h-10 bg-classic-green/10 rounded-lg flex items-center justify-center group-hover:bg-classic-green/20 transition-colors">
                <Package className="w-5 h-5 text-classic-green" />
              </div>
              <span className="font-montserrat text-brand-700 text-xs text-center">Add Product</span>
            </Link>
            <Link
              href="https://admin.shopify.com/store/solitarioind/orders"
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 bg-teal/5 rounded-xl hover:bg-teal/10 transition-colors border border-teal/20 group"
            >
              <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                <ShoppingBag className="w-5 h-5 text-teal" />
              </div>
              <span className="font-montserrat text-brand-700 text-xs text-center">View Orders</span>
            </Link>
            <Link
              href="https://admin.shopify.com/store/solitarioind/customers"
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 bg-soft-bronze/5 rounded-xl hover:bg-soft-bronze/10 transition-colors border border-soft-bronze/20 group"
            >
              <div className="w-10 h-10 bg-soft-bronze/10 rounded-lg flex items-center justify-center group-hover:bg-soft-bronze/20 transition-colors">
                <Users className="w-5 h-5 text-soft-bronze" />
              </div>
              <span className="font-montserrat text-brand-700 text-xs text-center">Customers</span>
            </Link>
            <Link
              href="https://admin.shopify.com/store/solitarioind/analytics"
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 bg-bronze-gold/5 rounded-xl hover:bg-bronze-gold/10 transition-colors border border-bronze-gold/20 group"
            >
              <div className="w-10 h-10 bg-bronze-gold/10 rounded-lg flex items-center justify-center group-hover:bg-bronze-gold/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-bronze-gold" />
              </div>
              <span className="font-montserrat text-brand-700 text-xs text-center">Analytics</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-brand border border-brand-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-playfair text-brand-800">Recent Activity</h2>
            <Activity className="w-5 h-5 text-classic-green" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'order' ? 'bg-teal/10' :
                  activity.type === 'product' ? 'bg-classic-green/10' : 'bg-soft-bronze/10'
                }`}>
                  <activity.icon className={`w-4 h-4 ${
                    activity.type === 'order' ? 'text-teal' :
                    activity.type === 'product' ? 'text-classic-green' : 'text-soft-bronze'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-brand-700 font-montserrat truncate">{activity.message}</p>
                  <p className="text-xs text-brand-400 font-montserrat flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
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

      {/* Products Section */}
      <div className="bg-white rounded-2xl shadow-brand border border-brand-100 overflow-hidden">
        <div className="p-6 border-b border-brand-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <h2 className="text-lg font-playfair text-brand-800">Products</h2>
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat text-sm"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 font-montserrat text-sm bg-white"
              >
                <option value="all">All Categories</option>
                {stats.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value as any)}
                className="px-3 py-2 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 font-montserrat text-sm bg-white"
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="not-featured">Not Featured</option>
              </select>
              <div className="flex items-center gap-1 bg-brand-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                >
                  <List className="w-4 h-4 text-brand-600" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                >
                  <LayoutGrid className="w-4 h-4 text-brand-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-classic-green animate-spin" />
          </div>
        ) : (
          <>
            <div className="px-6 py-3 bg-brand-50 text-sm text-brand-500 font-montserrat border-b border-brand-100">
              Showing {filteredProducts.length} of {products.length} products
            </div>

            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-brand-50 border-b border-brand-100">
                    <tr>
                      <th className="text-left px-6 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Product</th>
                      <th className="text-left px-6 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Category</th>
                      <th className="text-left px-6 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Price</th>
                      <th className="text-left px-6 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Status</th>
                      <th className="text-left px-6 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-brand-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-brand-100 flex-shrink-0">
                              <Image
                                src={product.image || '/images/placeholder.svg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-montserrat text-brand-800 text-sm">{product.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-brand-100 rounded text-xs font-montserrat text-brand-600 capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-montserrat text-brand-800 text-sm">
                          {formatPrice(product.price, product.currency)}
                        </td>
                        <td className="px-6 py-4">
                          {product.featured ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-bronze-gold/10 text-bronze-gold rounded text-xs font-montserrat">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </span>
                          ) : (
                            <span className="text-brand-400 text-xs font-montserrat">Standard</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/products/${product.id}`}
                              className="p-1.5 hover:bg-brand-100 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4 text-brand-500" />
                            </Link>
                            <Link
                              href={`https://admin.shopify.com/store/solitarioind/products?query=${encodeURIComponent(product.name)}`}
                              target="_blank"
                              className="p-1.5 hover:bg-brand-100 rounded-lg transition-colors"
                              title="Edit in Shopify"
                            >
                              <Edit className="w-4 h-4 text-brand-500" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-brand-50 rounded-xl overflow-hidden hover:shadow-brand transition-shadow"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={product.image || '/images/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.featured && (
                        <div className="absolute top-2 right-2 bg-bronze-gold text-white px-2 py-0.5 rounded-full text-xs font-gotham flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-montserrat text-brand-800 text-sm mb-1 truncate">{product.name}</h3>
                      <p className="font-gotham text-classic-green text-sm font-semibold">
                        {formatPrice(product.price, product.currency)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1 text-center py-1.5 bg-white hover:bg-brand-100 rounded-lg text-xs font-montserrat text-brand-700 transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`https://admin.shopify.com/store/solitarioind/products?query=${encodeURIComponent(product.name)}`}
                          target="_blank"
                          className="flex-1 text-center py-1.5 bg-classic-green/10 hover:bg-classic-green/20 rounded-lg text-xs font-montserrat text-classic-green transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Package className="w-12 h-12 text-brand-300 mx-auto mb-4" />
                <p className="text-brand-500 font-montserrat">No products found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
