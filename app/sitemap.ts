import { MetadataRoute } from 'next';

const BASE_URL = 'https://thesolitario.com';

// Static pages
const staticPages = [
  '',
  '/products',
  '/about',
  '/contact',
  '/stores',
];

// Product categories
const categories = [
  'rings',
  'earrings',
  'necklaces',
  'bracelets',
  'pendants',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch products for dynamic URLs
  let productUrls: MetadataRoute.Sitemap = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const data = await response.json();
    const products = data.products || [];
    
    productUrls = products.map((product: { id: string }) => ({
      url: `${BASE_URL}/products/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' as const : 'weekly' as const,
    priority: page === '' ? 1 : 0.9,
  }));

  // Category pages
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/products?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
