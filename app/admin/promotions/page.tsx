'use client';

import { useState, useEffect } from 'react';
import { Tag, Gift, Percent, Calendar, Trash2, RefreshCw, CheckCircle, XCircle, Clock, Plus, X } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  clerk_user_id: string;
  percent_off: number;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED';
  issued_month: string;
  issued_at: string;
  expires_at: string;
  redeemed_at: string | null;
  issued_for_order_id: string;
}

interface Order {
  id: string;
  clerk_user_id: string;
  subtotal: number;
  discount: number;
  total: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  razorpay_order_id: string;
  promo_snapshot: {
    applied_discounts: any[];
    coupon_code: string | null;
    first_purchase_discount: boolean;
    cart_rule_applied: string | null;
    total_items: number;
  };
  created_at: string;
  paid_at: string | null;
}

export default function PromotionsAdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'coupons' | 'orders' | 'config'>('coupons');
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    percent_off: 10,
    clerk_user_id: 'all',
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [couponsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/promotions/coupons'),
        fetch('/api/admin/promotions/orders'),
      ]);

      if (couponsRes.ok) {
        const couponsData = await couponsRes.json();
        setCoupons(couponsData.coupons || []);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const res = await fetch(`/api/admin/promotions/coupons/${couponId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCoupons(coupons.filter(c => c.id !== couponId));
      } else {
        alert('Failed to delete coupon');
      }
    } catch (error) {
      alert('Error deleting coupon');
    }
  };

  const createCoupon = async () => {
    try {
      const res = await fetch('/api/admin/promotions/coupons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });

      if (res.ok) {
        setIsAddingCoupon(false);
        setNewCoupon({
          code: '',
          percent_off: 10,
          clerk_user_id: 'all',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create coupon');
      }
    } catch (error) {
      alert('Error creating coupon');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (paise: number) => {
    return `₹${(paise / 100).toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      REDEEMED: 'bg-blue-100 text-blue-800 border-blue-200',
      EXPIRED: 'bg-gray-100 text-gray-800 border-gray-200',
      PAID: 'bg-green-100 text-green-800 border-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const stats = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.status === 'ACTIVE').length,
    redeemedCoupons: coupons.filter(c => c.status === 'REDEEMED').length,
    totalOrders: orders.length,
    paidOrders: orders.filter(o => o.status === 'PAID').length,
    totalRevenue: orders.filter(o => o.status === 'PAID').reduce((sum, o) => sum + o.total, 0),
    totalDiscounts: orders.filter(o => o.status === 'PAID').reduce((sum, o) => sum + o.discount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-montserrat font-bold text-4xl text-gray-900 mb-2">Promotions & Loyalty</h1>
          <p className="text-gray-600 font-montserrat">Manage coupons, view orders, and configure promotions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Active Coupons</span>
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeCoupons}</p>
            <p className="text-xs text-gray-500 mt-1">of {stats.totalCoupons} total</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Redeemed</span>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.redeemedCoupons}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalCoupons > 0 ? Math.round((stats.redeemedCoupons / stats.totalCoupons) * 100) : 0}% redemption rate
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Revenue</span>
              <Gift className="w-5 h-5 text-classic-green" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatAmount(stats.totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.paidOrders} paid orders</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Discounts</span>
              <Percent className="w-5 h-5 text-bronze-gold" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatAmount(stats.totalDiscounts)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalRevenue > 0 ? Math.round((stats.totalDiscounts / (stats.totalRevenue + stats.totalDiscounts)) * 100) : 0}% avg discount
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'coupons'
                    ? 'border-classic-green text-classic-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Tag className="w-4 h-4 inline mr-2" />
                Coupons ({coupons.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-classic-green text-classic-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Gift className="w-4 h-4 inline mr-2" />
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'config'
                    ? 'border-classic-green text-classic-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Percent className="w-4 h-4 inline mr-2" />
                Configuration
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-classic-green" />
              </div>
            ) : (
              <>
                {/* Coupons Tab */}
                {activeTab === 'coupons' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-montserrat font-bold text-xl text-gray-900">Loyalty Coupons</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsAddingCoupon(true)}
                          className="px-4 py-2 text-sm bg-classic-green text-white rounded-lg flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Coupon
                        </button>
                        <button
                          onClick={loadData}
                          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Refresh
                        </button>
                      </div>
                    </div>

                    {isAddingCoupon && (
                      <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-xl relative">
                        <button
                          onClick={() => setIsAddingCoupon(false)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <h3 className="font-medium text-gray-900 mb-4">Create Manual Coupon</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Coupon Code</label>
                            <input
                              type="text"
                              value={newCoupon.code}
                              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                              placeholder="e.g. SAVE10"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-classic-green/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Discount %</label>
                            <input
                              type="number"
                              value={newCoupon.percent_off}
                              onChange={(e) => setNewCoupon({ ...newCoupon, percent_off: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-classic-green/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">User ID (or 'all')</label>
                            <input
                              type="text"
                              value={newCoupon.clerk_user_id}
                              onChange={(e) => setNewCoupon({ ...newCoupon, clerk_user_id: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-classic-green/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="date"
                              value={newCoupon.expires_at}
                              onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-classic-green/30"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={createCoupon}
                            disabled={!newCoupon.code}
                            className="px-6 py-2 bg-classic-green text-white rounded-lg hover:bg-classic-green/90 disabled:opacity-50"
                          >
                            Create Coupon
                          </button>
                        </div>
                      </div>
                    )}

                    {coupons.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No coupons issued yet</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {coupons.map((coupon) => (
                              <tr key={coupon.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{coupon.code}</code>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{coupon.clerk_user_id.slice(0, 12)}...</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{coupon.percent_off}%</td>
                                <td className="px-4 py-3">{getStatusBadge(coupon.status)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(coupon.issued_at)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(coupon.expires_at)}</td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => deleteCoupon(coupon.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete coupon"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-montserrat font-bold text-xl text-gray-900">Orders with Promotions</h2>
                      <button
                        onClick={loadData}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No orders yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-mono text-sm text-gray-600 mb-1">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                              </div>
                              {getStatusBadge(order.status)}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                                <p className="font-medium text-gray-900">{formatAmount(order.subtotal)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Discount</p>
                                <p className="font-medium text-green-600">-{formatAmount(order.discount)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Total</p>
                                <p className="font-bold text-gray-900">{formatAmount(order.total)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Items</p>
                                <p className="font-medium text-gray-900">{order.promo_snapshot.total_items}</p>
                              </div>
                            </div>

                            {order.promo_snapshot.applied_discounts.length > 0 && (
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <p className="text-xs font-medium text-green-800 mb-2">Applied Promotions:</p>
                                <div className="space-y-1">
                                  {order.promo_snapshot.applied_discounts.map((discount: any, idx: number) => (
                                    <p key={idx} className="text-xs text-green-700">
                                      • {discount.description} ({discount.percent}% off)
                                    </p>
                                  ))}
                                </div>
                                {order.promo_snapshot.coupon_code && (
                                  <p className="text-xs text-green-700 mt-2">
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    Coupon: <code className="bg-white px-1 rounded">{order.promo_snapshot.coupon_code}</code>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Configuration Tab */}
                {activeTab === 'config' && (
                  <div>
                    <h2 className="font-montserrat font-bold text-xl text-gray-900 mb-4">Promotion Configuration</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-800">
                        Configuration is managed via environment variables in <code className="bg-white px-2 py-1 rounded">.env.local</code>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">First Purchase Discount</h3>
                        <p className="text-sm text-gray-600">20% off for first-time buyers</p>
                        <p className="text-xs text-gray-500 mt-1">Env: <code>PROMO_FIRST_PURCHASE_PERCENT</code></p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Buy 2 Items</h3>
                        <p className="text-sm text-gray-600">10% off + Free gift</p>
                        <p className="text-xs text-gray-500 mt-1">Env: <code>PROMO_BUY2_PERCENT</code></p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Buy 3+ Items</h3>
                        <p className="text-sm text-gray-600">30% off</p>
                        <p className="text-xs text-gray-500 mt-1">Env: <code>PROMO_BUY3_PERCENT</code></p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Loyalty Coupon</h3>
                        <p className="text-sm text-gray-600">10% off, valid 30 days, max 1 per month</p>
                        <p className="text-xs text-gray-500 mt-1">Env: <code>PROMO_LOYALTY_PERCENT</code>, <code>PROMO_LOYALTY_VALIDITY_DAYS</code></p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Gift Product</h3>
                        <p className="text-sm text-gray-600">10 Cent Diamond</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Variant ID: <code>gid://shopify/ProductVariant/10264124457235</code>
                        </p>
                        <a
                          href="https://admin.shopify.com/store/solitarioind/products/10264124457235"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View in Shopify →
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
