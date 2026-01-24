import { getProductByHandle } from '@/lib/shopify-data';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';
import { ProductSchema } from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ProductErrorBoundary } from '@/components/ui/ErrorBoundary';

interface ProductPageProps {
  params: Promise<{ id: string }>;
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
    <div>
      <ProductSchema
        name={product.name}
        description={product.description}
        image={product.image}
        price={product.price}
        currency={product.currency}
        sku={product.sku}
        brand="The Solitario"
        availability={product.inStock ? 'InStock' : 'OutOfStock'}
        url={`https://www.thesolitario.com/products/${id}`}
      />
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <ProductErrorBoundary>
        <ProductDetail product={product} />
      </ProductErrorBoundary>
    </div>
  );
}

