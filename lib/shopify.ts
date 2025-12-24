// Shopify client helpers for Storefront and Admin APIs
// Environment variables must be set:
// SHOPIFY_STORE_DOMAIN
// SHOPIFY_STOREFRONT_ACCESS_TOKEN
// SHOPIFY_ADMIN_ACCESS_TOKEN

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRangeV2: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        sku: string | null;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        } | null;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  collections?: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: {
    url: string;
    altText: string | null;
  };
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          __typename: string;
          id: string;
          title: string;
          product: {
            id: string;
            title: string;
            handle: string;
          };
          variant?: {
            id: string;
            title: string;
            sku: string | null;
            price: {
              amount: string;
              currencyCode: string;
            };
            availableForSale: boolean;
            selectedOptions: Array<{
              name: string;
              value: string;
            }>;
          };
        };
        cost: {
          amountPerQuantity: {
            amount: string;
            currencyCode: string;
          };
          totalAmount: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
  estimatedCost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount: {
      amount: string;
      currencyCode: string;
    };
    totalDutyAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Shopify config validation happens at runtime, not module load

const STOREFRONT_API_VERSION = '2024-01';
const ADMIN_API_VERSION = '2024-01';

// Storefront API GraphQL client
export async function shopifyStorefrontFetch<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<{ data?: T; errors?: any[] }> {
  if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront API not configured');
  }

  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}.myshopify.com/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
      next: { revalidate: 0 }, // Force fresh data in Next.js
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify Storefront API error: ${response.status}`);
  }

  const json = await response.json();
  return json;
}

// Admin API GraphQL client
export async function shopifyAdminFetch<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<{ data?: T; errors?: any[] }> {
  if (!SHOPIFY_DOMAIN || !ADMIN_TOKEN) {
    throw new Error('Shopify Admin API not configured');
  }

  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}.myshopify.com/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify Admin API error: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
  }
  return json;
}

// Common queries
export const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          vendor
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          collections(first: 5) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            sku
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  }
`;

export const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE_QUERY = `
  query getCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 3) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Cart queries
export const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              __typename
              ... on ProductVariant {
                id
                title
                sku
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
                product {
                  id
                  title
                  handle
                }
              }
            }
            cost {
              amountPerQuantity {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
      estimatedCost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

// Cart mutations
export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                __typename
                ... on ProductVariant {
                  id
                  title
                  sku
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                    handle
                  }
                }
              }
              cost {
                amountPerQuantity {
                  amount
                  currencyCode
                }
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        estimatedCost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
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

export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                __typename
                ... on ProductVariant {
                  id
                  title
                  sku
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                    handle
                  }
                }
              }
              cost {
                amountPerQuantity {
                  amount
                  currencyCode
                }
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        estimatedCost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
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

export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                __typename
                ... on ProductVariant {
                  id
                  title
                  sku
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                    handle
                  }
                }
              }
              cost {
                amountPerQuantity {
                  amount
                  currencyCode
                }
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        estimatedCost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
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

export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                __typename
                ... on ProductVariant {
                  id
                  title
                  sku
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                    handle
                  }
                }
              }
              cost {
                amountPerQuantity {
                  amount
                  currencyCode
                }
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        estimatedCost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
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

// Customer mutations for auth
export const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_RENEW_MUTATION = `
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Admin API: Create/update customer
export const ADMIN_CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADMIN_CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Helper function to fetch related products by category
export async function getRelatedProducts(category: string, currentProductId: string, limit: number = 6) {
  try {
    // Query products by category tag
    const query = `tag:${category}`;
    
    const response = await shopifyStorefrontFetch(GET_PRODUCTS_QUERY, {
      first: limit + 10, // Fetch more to filter out current product
      query: query
    });

    if (!response.data?.products?.edges) {
      return [];
    }

    // Transform Shopify products to our Product interface
    const products = response.data.products.edges
      .map((edge: any) => {
        const node = edge.node;
        const variant = node.variants.edges[0]?.node;
        
        return {
          id: node.id,
          name: node.title,
          category: category,
          price: parseFloat(variant?.price?.amount || '0'),
          currency: variant?.price?.currencyCode || 'INR',
          image: node.images.edges[0]?.node?.url || '',
          images: node.images.edges.map((img: any) => img.node.url),
          description: node.description,
          sku: variant?.sku,
          inStock: variant?.availableForSale || false,
          variantId: variant?.id,
        };
      })
      .filter((product: any) => product.id !== currentProductId) // Exclude current product
      .slice(0, limit); // Limit to requested number

    return products;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}
