import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF] px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-8xl font-montserrat font-bold font-bold text-classic-green">404</h1>
        </div>
        <h2 className="text-2xl font-montserrat font-bold font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-classic-green text-white rounded-lg hover:bg-classic-green/90 transition-colors font-medium"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 border border-classic-green text-classic-green rounded-lg hover:bg-classic-green/5 transition-colors font-medium"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
