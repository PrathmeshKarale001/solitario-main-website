import { MetadataRoute } from 'next';

const BASE_URL = 'https://thesolitario.com';

// All public static pages
const staticPages = [
  { path: '', priority: 1, changeFrequency: 'daily' as const },
  { path: '/products', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/stores', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/lab-grown-diamonds', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/certifications', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/sustainability', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/franchise', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/diy-recipes', priority: 0.6, changeFrequency: 'weekly' as const },
  { path: '/warner-bros', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/christmas-sale', priority: 0.6, changeFrequency: 'weekly' as const },
  { path: '/wishlist', priority: 0.3, changeFrequency: 'weekly' as const },
  { path: '/regulatory-disclosures', priority: 0.4, changeFrequency: 'yearly' as const },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/returns', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/shipping', priority: 0.3, changeFrequency: 'yearly' as const },
];

// Static blog post pages (all 5 real posts)
const blogPostPages = [
  { slug: 'diamond-clarity-guide', date: '2025-03-01' },
  { slug: 'lab-grown-diamonds-last-forever', date: '2025-02-01' },
  { slug: '14k-vs-18k-gold-diamond-jewellery', date: '2025-01-01' },
  { slug: 'diamond-earrings-face-shape-guide', date: '2024-12-01' },
  { slug: 'lifetime-diamond-exchange-policy', date: '2024-11-01' },
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
  let blogUrls: MetadataRoute.Sitemap = [];

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

    // Fetch blog posts for dynamic URLs
    const blogController = new AbortController();
    const blogTimeout = setTimeout(() => blogController.abort(), 2500);

    try {
      const blogResponse = await fetch(`${productsApiBaseUrl}/api/blog`, {
        next: { revalidate: 3600 },
        signal: blogController.signal,
      });

      if (blogResponse.ok) {
        const blogData = (await blogResponse.json()) as { posts?: Array<{ slug: string; updatedAt?: string }> };
        const posts = Array.isArray(blogData.posts) ? blogData.posts : [];

        blogUrls = posts.map((post) => ({
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      }
    } catch {
      // Ignore: blog sitemap is best-effort.
    } finally {
      clearTimeout(blogTimeout);
    }
  }

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Category pages
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/products/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Blog post static URLs
  const blogPostUrls: MetadataRoute.Sitemap = blogPostPages.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...staticUrls, ...categoryUrls, ...blogPostUrls, ...productUrls, ...blogUrls];
}

