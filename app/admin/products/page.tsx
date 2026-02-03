'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
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
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X
} from 'lucide-react';
import { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'not-featured'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      const productList = data.products || [];
      setProducts(productList);
      const cats = [...new Set(productList.map((p: Product) => p.category))];
      setCategories(cats as string[]);
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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterFeatured]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-brand-800 mb-1">Products</h1>
          <p className="text-brand-500 font-montserrat text-sm">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 text-brand-700 rounded-xl hover:bg-brand-50 transition-colors disabled:opacity-50 font-montserrat text-sm">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link href="https://admin.shopify.com/store/solitarioind/products/new" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat text-sm">
            <ExternalLink className="w-4 h-4" />
            Add in Shopify
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-brand border border-brand-100 overflow-hidden">
        <div className="p-4 border-b border-brand-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat text-sm" />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 font-montserrat text-sm bg-white">
                <option value="all">All Categories</option>
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              <select value={filterFeatured} onChange={(e) => setFilterFeatured(e.target.value as any)} className="px-4 py-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 font-montserrat text-sm bg-white">
                <option value="all">All Status</option>
                <option value="featured">Featured</option>
                <option value="not-featured">Standard</option>
              </select>
              <div className="flex items-center gap-1 bg-brand-100 rounded-xl p-1">
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}>
                  <List className="w-4 h-4 text-brand-600" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}>
                  <LayoutGrid className="w-4 h-4 text-brand-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-brand-50 text-sm text-brand-500 font-montserrat border-b border-brand-100">
          Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-classic-green animate-spin" />
          </div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-50 border-b border-brand-100">
                <tr>
                  <th className="text-left px-4 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Product</th>
                  <th className="text-left px-4 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Price</th>
                  <th className="text-left px-4 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600 hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-gotham text-xs uppercase tracking-wider text-brand-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-brand-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-brand-100 flex-shrink-0">
                          <Image src={product.image || '/images/placeholder.svg'} alt={product.name} fill className="object-cover" />
                        </div>
                        <p className="font-montserrat text-brand-800 text-sm truncate max-w-[200px]">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-1 bg-brand-100 rounded text-xs font-montserrat text-brand-600 capitalize">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 font-montserrat text-brand-800 text-sm">{formatPrice(product.price, product.currency)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {product.featured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-bronze-gold/10 text-bronze-gold rounded text-xs font-montserrat">
                          <Star className="w-3 h-3 fill-current" />Featured
                        </span>
                      ) : (
                        <span className="text-brand-400 text-xs font-montserrat">Standard</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/products/${product.id}`} className="p-1.5 hover:bg-brand-100 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-brand-500" />
                        </Link>
                        <Link href={`https://admin.shopify.com/store/solitarioind/products?query=${encodeURIComponent(product.name)}`} target="_blank" className="p-1.5 hover:bg-brand-100 rounded-lg transition-colors" title="Edit in Shopify">
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
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => (
              <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-brand-50 rounded-xl overflow-hidden hover:shadow-brand transition-shadow">
                <div className="aspect-square relative">
                  <Image src={product.image || '/images/placeholder.svg'} alt={product.name} fill className="object-cover" />
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-bronze-gold text-white px-2 py-0.5 rounded-full text-xs font-gotham flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />Featured
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-montserrat text-brand-800 text-sm mb-1 truncate">{product.name}</h3>
                  <p className="font-gotham text-classic-green text-sm font-semibold">{formatPrice(product.price, product.currency)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Link href={`/products/${product.id}`} className="flex-1 text-center py-1.5 bg-white hover:bg-brand-100 rounded-lg text-xs font-montserrat text-brand-700 transition-colors">View</Link>
                    <Link href={`https://admin.shopify.com/store/solitarioind/products?query=${encodeURIComponent(product.name)}`} target="_blank" className="flex-1 text-center py-1.5 bg-classic-green/10 hover:bg-classic-green/20 rounded-lg text-xs font-montserrat text-classic-green transition-colors">Edit</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {paginatedProducts.length === 0 && !loading && (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-brand-300 mx-auto mb-4" />
            <p className="text-brand-500 font-montserrat">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-4 border-t border-brand-100 flex items-center justify-between">
            <p className="text-sm text-brand-500 font-montserrat hidden sm:block">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-1 mx-auto sm:mx-0">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-brand-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronsLeft className="w-4 h-4 text-brand-600" />
              </button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-brand-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4 text-brand-600" />
              </button>
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded-lg font-montserrat text-sm transition-colors ${currentPage === pageNum ? 'bg-classic-green text-white' : 'hover:bg-brand-100 text-brand-600'}`}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-brand-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4 text-brand-600" />
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-brand-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronsRight className="w-4 h-4 text-brand-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
