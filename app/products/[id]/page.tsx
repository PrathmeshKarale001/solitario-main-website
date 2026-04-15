import type { Metadata } from 'next';
import { getProductByHandle } from '@/lib/shopify-data';
import { notFound } from 'next/navigation';
import { LazyProductDetail } from '@/components/lazy';
import { ProductSchema } from '@/components/seo/JsonLd';
import { BreadcrumbJsonLd } from '@/components/seo/ProductJsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ProductErrorBoundary } from '@/components/ui/ErrorBoundary';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByHandle(id);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const title = `${product.name} — Lab Grown Diamond ${product.category || 'Jewellery'} | The Solitario`;
  const description = product.description
    ? `${product.description.slice(0, 150)}... Shop at The Solitario.`
    : `Buy ${product.name} — premium lab-grown diamond ${product.category || 'jewellery'} by The Solitario. Certified, sustainable, and crafted for modern luxury.`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${id}` },
    openGraph: {
      title: product.name,
      description,
      url: `https://thesolitario.com/products/${id}`,
      siteName: 'The Solitario',
      type: 'website',
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductByHandle(id);

  if (!product) {
    notFound();
  }

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Products', href: '/products' },
    { label: product.name, href: `/products/${id}` },
  ];

  return (
    <div className="bg-white min-h-screen">
      <ProductSchema
        name={product.name}
        description={product.description}
        image={product.image}
        price={product.price}
        currency={product.currency}
        sku={product.sku}
        brand="The Solitario"
        availability={product.inStock ? 'InStock' : 'OutOfStock'}
        url={`https://thesolitario.com/products/${id}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://thesolitario.com' },
          { name: 'Shop', url: 'https://thesolitario.com/products' },
          ...(product.category ? [{ name: product.category, url: `https://thesolitario.com/products/category/${product.category.toLowerCase()}` }] : []),
          { name: product.name, url: `https://thesolitario.com/products/${id}` },
        ]}
      />
      <ProductErrorBoundary>
        <LazyProductDetail product={product} />
      </ProductErrorBoundary>
    </div>
  );
}

