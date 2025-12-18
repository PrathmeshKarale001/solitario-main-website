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

  // Dynamic product URLs are best-effort. During CI/build the API may not be reachable and
  // we must not fail or hang the build.
  const productsApiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (productsApiBaseUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(`${productsApiBaseUrl}/api/products`, {
        next: { revalidate: 3600 },
        signal: controller.signal,
      });

      if (response.ok) {
        const data = (await response.json()) as { products?: Array<{ id: string }> };
        const products = Array.isArray(data.products) ? data.products : [];

        productUrls = products.map((product) => ({
          url: `${BASE_URL}/products/${product.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      }
    } catch {
      // Ignore: sitemap must still generate quickly.
    } finally {
      clearTimeout(timeout);
    }
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
