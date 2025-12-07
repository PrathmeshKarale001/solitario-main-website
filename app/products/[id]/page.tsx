import { getProductByHandle } from '@/lib/shopify-data';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductByHandle(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <ProductDetail product={product} />
    </div>
  );
}

