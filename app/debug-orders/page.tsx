'use client';

import { useState } from 'react';

export default function DebugOrdersPage() {
  const [email, setEmail] = useState('pkarale002@gmail.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/debug/check-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to fetch', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Orders - Check Shopify Customer</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter email"
            />
            <button
              onClick={checkCustomer}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Checking...' : 'Check Customer'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>

            {result.success && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Summary:</h3>
                <div className="space-y-2">
                  <p><strong>Customer ID:</strong> {result.customer?.id}</p>
                  <p><strong>Email:</strong> {result.customer?.email}</p>
                  <p><strong>Name:</strong> {result.customer?.firstName} {result.customer?.lastName}</p>
                  <p><strong>Total Orders:</strong> {result.totalOrders}</p>
                  
                  {result.orders && result.orders.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-bold mb-2">Orders:</h4>
                      <div className="space-y-2">
                        {result.orders.map((order: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-green-500 pl-4 py-2">
                            <p><strong>Order #{order.orderNumber}</strong> ({order.name})</p>
                            <p className="text-sm text-gray-600">
                              {order.total.amount} {order.total.currencyCode} - {order.financialStatus} - {order.fulfillmentStatus}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(order.processedAt).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
