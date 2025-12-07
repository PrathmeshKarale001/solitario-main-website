import { NextResponse } from 'next/server';
import { shopifyAdminFetch } from '@/lib/shopify';

// Step 1: Create product without variants
const CREATE_PRODUCT_MUTATION = `
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        handle
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Step 2: Publish product to sales channels
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

// Get publications (sales channels)
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

export async function POST() {
  try {
    if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'Admin API token not configured',
      }, { status: 500 });
    }

    // Step 1: Create the product
    const productResult = await shopifyAdminFetch(CREATE_PRODUCT_MUTATION, {
      input: {
        title: 'Solitaire Diamond Ring - Demo',
        descriptionHtml: `
          <p>A stunning solitaire diamond ring featuring a brilliant-cut lab-grown diamond set in 18K white gold.</p>
          <ul>
            <li>1.5 carat lab-grown diamond</li>
            <li>IGI Certified</li>
            <li>18K White Gold band</li>
            <li>Lifetime warranty</li>
          </ul>
        `,
        vendor: 'Solitario',
        productType: 'Rings',
        tags: ['diamond', 'solitaire', 'engagement', 'lab-grown', 'demo'],
        status: 'ACTIVE',
      },
    });

    if (productResult.errors || productResult.data?.productCreate?.userErrors?.length > 0) {
      return NextResponse.json({
        success: false,
        step: 'productCreate',
        errors: productResult.errors || productResult.data?.productCreate?.userErrors,
      }, { status: 400 });
    }

    const productId = productResult.data?.productCreate?.product?.id;

    // Step 2: Get publications and publish product
    const pubResult = await shopifyAdminFetch(GET_PUBLICATIONS_QUERY);
    const publications = pubResult.data?.publications?.edges || [];
    
    // Publish to all available channels
    if (publications.length > 0) {
      const publishInput = publications.map((pub: { node: { id: string } }) => ({
        publicationId: pub.node.id,
      }));

      await shopifyAdminFetch(PUBLISH_PRODUCT_MUTATION, {
        id: productId,
        input: publishInput,
      });
    }

    return NextResponse.json({
      success: true,
      product: productResult.data?.productCreate?.product,
      publications: publications.map((p: { node: { id: string; name: string } }) => p.node.name),
      message: 'Demo product created and published! Check your Shopify admin and refresh the products page.',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
