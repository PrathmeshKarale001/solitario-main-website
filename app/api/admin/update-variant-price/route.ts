import { NextResponse } from 'next/server';
import { shopifyAdminFetch } from '@/lib/shopify';

// Get product with its variants
const GET_PRODUCT_VARIANTS = `
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      title
      variants(first: 1) {
        edges {
          node {
            id
            price
            sku
          }
        }
      }
    }
  }
`;

// Update variant price using bulk update
const UPDATE_VARIANTS_MUTATION = `
  mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
        price
        sku
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(request: Request) {
  try {
    const { productId, price, sku } = await request.json();

    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId required' }, { status: 400 });
    }

    // Get the product's default variant
    const productResult = await shopifyAdminFetch(GET_PRODUCT_VARIANTS, { id: productId });
    
    if (productResult.errors || !productResult.data?.product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found',
        details: productResult.errors,
      }, { status: 404 });
    }

    const variantId = productResult.data.product.variants.edges[0]?.node?.id;
    
    if (!variantId) {
      return NextResponse.json({ success: false, error: 'No variant found' }, { status: 404 });
    }

    // Update the variant using bulk update (sku not supported in bulk input)
    const updateResult = await shopifyAdminFetch(UPDATE_VARIANTS_MUTATION, {
      productId,
      variants: [{
        id: variantId,
        price: price || '125000.00',
      }],
    });

    if (updateResult.errors || updateResult.data?.productVariantsBulkUpdate?.userErrors?.length > 0) {
      return NextResponse.json({
        success: false,
        errors: updateResult.errors || updateResult.data?.productVariantsBulkUpdate?.userErrors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      variant: updateResult.data?.productVariantsBulkUpdate?.productVariants?.[0],
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
