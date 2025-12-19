import { NextRequest, NextResponse } from 'next/server';
import { shopifyAdminFetch } from '@/lib/shopify';
import * as fs from 'fs';
import * as path from 'path';

// GraphQL Mutations
const CREATE_STAGED_UPLOAD_MUTATION = `
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_PRODUCT_MUTATION = `
  mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
    productCreate(input: $input, media: $media) {
      product {
        id
        title
        handle
        status
        variants(first: 1) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_VARIANT_PRICE_MUTATION = `
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      productVariant {
        id
        price
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const PUBLISH_PRODUCT_MUTATION = `
  mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable {
        availablePublicationsCount {
          count
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_PUBLICATIONS_QUERY = `
  query {
    publications(first: 10) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

interface ProductData {
  sku: string;
  title: string;
  category: string;
  productType: string;
  price: number;
  descriptionHtml: string;
  color: string;
  metal: string;
  images: string[];
  tags: string[];
}

async function uploadImageToShopify(imagePath: string): Promise<string | null> {
  try {
    const fileName = path.basename(imagePath);
    const fileBuffer = fs.readFileSync(imagePath);
    const fileSize = fileBuffer.length;
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    // Step 1: Create staged upload
    const stagedResult = await shopifyAdminFetch(CREATE_STAGED_UPLOAD_MUTATION, {
      input: [{
        filename: fileName,
        mimeType: mimeType,
        resource: 'IMAGE',
        fileSize: fileSize.toString(),
        httpMethod: 'POST',
      }],
    });

    if (stagedResult.errors || stagedResult.data?.stagedUploadsCreate?.userErrors?.length > 0) {
      console.error('Staged upload error:', stagedResult.errors || stagedResult.data?.stagedUploadsCreate?.userErrors);
      return null;
    }

    const target = stagedResult.data?.stagedUploadsCreate?.stagedTargets?.[0];
    if (!target) {
      console.error('No staged target returned');
      return null;
    }

    // Step 2: Upload file to staged URL
    const formData = new FormData();
    for (const param of target.parameters) {
      formData.append(param.name, param.value);
    }
    formData.append('file', new Blob([fileBuffer], { type: mimeType }), fileName);

    const uploadResponse = await fetch(target.url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      console.error('Upload failed:', uploadResponse.status, await uploadResponse.text());
      return null;
    }

    return target.resourceUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    return null;
  }
}

async function createProduct(product: ProductData, publications: string[]): Promise<{ success: boolean; productId?: string; error?: string }> {
  try {
    // Upload images first
    const mediaInputs: { originalSource: string; mediaContentType: string; alt: string }[] = [];
    
    for (const imagePath of product.images.slice(0, 4)) { // Limit to 4 images
      const resourceUrl = await uploadImageToShopify(imagePath);
      if (resourceUrl) {
        mediaInputs.push({
          originalSource: resourceUrl,
          mediaContentType: 'IMAGE',
          alt: product.title,
        });
      }
    }

    // Create product
    const productResult = await shopifyAdminFetch(CREATE_PRODUCT_MUTATION, {
      input: {
        title: product.title,
        descriptionHtml: product.descriptionHtml,
        vendor: 'Solitario',
        productType: product.productType,
        tags: product.tags.filter(t => t),
        status: 'ACTIVE',
        metafields: [
          {
            namespace: 'custom',
            key: 'sku',
            value: product.sku,
            type: 'single_line_text_field',
          },
          {
            namespace: 'custom',
            key: 'color',
            value: product.color,
            type: 'single_line_text_field',
          },
          {
            namespace: 'custom',
            key: 'metal',
            value: product.metal,
            type: 'single_line_text_field',
          },
        ],
      },
      media: mediaInputs.length > 0 ? mediaInputs : undefined,
    });

    if (productResult.errors || productResult.data?.productCreate?.userErrors?.length > 0) {
      return {
        success: false,
        error: JSON.stringify(productResult.errors || productResult.data?.productCreate?.userErrors),
      };
    }

    const productId = productResult.data?.productCreate?.product?.id;
    const variantId = productResult.data?.productCreate?.product?.variants?.edges?.[0]?.node?.id;

    // Update variant price and SKU
    if (variantId) {
      await shopifyAdminFetch(UPDATE_VARIANT_PRICE_MUTATION, {
        input: {
          id: variantId,
          price: product.price.toString(),
          sku: product.sku,
        },
      });
    }

    // Publish to sales channels
    if (publications.length > 0 && productId) {
      await shopifyAdminFetch(PUBLISH_PRODUCT_MUTATION, {
        id: productId,
        input: publications.map(pubId => ({ publicationId: pubId })),
      });
    }

    return { success: true, productId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'Admin API token not configured',
      }, { status: 500 });
    }

    const body = await request.json();
    const { products, startIndex = 0, batchSize = 5 } = body as {
      products: ProductData[];
      startIndex?: number;
      batchSize?: number;
    };

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({
        success: false,
        error: 'Products array is required',
      }, { status: 400 });
    }

    // Get publications
    const pubResult = await shopifyAdminFetch(GET_PUBLICATIONS_QUERY);
    const publications = (pubResult.data?.publications?.edges || [])
      .map((pub: { node: { id: string } }) => pub.node.id);

    // Process batch
    const batch = products.slice(startIndex, startIndex + batchSize);
    const results: { sku: string; title: string; success: boolean; productId?: string; error?: string }[] = [];

    for (const product of batch) {
      console.log(`Creating product: ${product.title} (${product.sku})`);
      const result = await createProduct(product, publications);
      results.push({
        sku: product.sku,
        title: product.title,
        ...result,
      });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      processed: results.length,
      successCount,
      failCount,
      nextIndex: startIndex + batchSize,
      hasMore: startIndex + batchSize < products.length,
      totalProducts: products.length,
      results,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Bulk product upload API. POST with { products: [...], startIndex: 0, batchSize: 5 }',
    example: {
      products: [
        {
          sku: 'AN1234',
          title: 'Product Name',
          category: 'rings',
          productType: 'Rings',
          price: 15000,
          descriptionHtml: '<p>Description</p>',
          color: 'Rose Gold',
          metal: '18K Vermeil Gold',
          images: ['/path/to/image1.jpg', '/path/to/image2.jpg'],
          tags: ['rings', 'lab-grown'],
        },
      ],
      startIndex: 0,
      batchSize: 5,
    },
  });
}
