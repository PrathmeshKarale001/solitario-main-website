/**
 * AI Search Demo Page
 * 
 * Demonstrates the AI-powered product search functionality
 */

import { redirect } from 'next/navigation';
import AIProductSearch from '@/components/ai/AIProductSearch';
import { isMCPEnabled } from '@/lib/feature-flags';

export default function AISearchPage() {
  // Redirect if MCP feature is disabled
  if (!isMCPEnabled()) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-classic-green/10 rounded-full mb-4">
            <span className="text-classic-green font-semibold text-sm">AI-Powered Search</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-900 mb-4">
            Find Your Perfect Jewellery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ask me anything about our collection. I understand natural language!
          </p>
        </div>

        {/* Search Component */}
        <div className="mb-16">
          <AIProductSearch />
        </div>

        {/* Example Queries */}
        <div className="mb-16">
          <h2 className="text-2xl font-montserrat font-bold text-gray-900 mb-6 text-center">
            Try These Examples
          </h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              'Diamond rings under ₹20,000',
              'Gold earrings for everyday wear',
              'Elegant necklaces for special occasions',
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (input) {
                    input.value = example;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    const form = input.closest('form');
                    if (form) {
                      form.requestSubmit();
                    }
                  }
                }}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-classic-green hover:shadow-md transition-all text-left"
              >
                <p className="text-gray-700 font-medium">{example}</p>
              </button>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-montserrat font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-classic-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-classic-green">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ask Naturally</h3>
              <p className="text-gray-600 text-sm">
                Type your question in plain English. No need for specific keywords or filters.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-classic-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-classic-green">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Understands</h3>
              <p className="text-gray-600 text-sm">
                Our AI analyzes your query and searches our entire catalog intelligently.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-classic-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-classic-green">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Results</h3>
              <p className="text-gray-600 text-sm">
                See relevant products with images, prices, and descriptions instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
