/**
 * Shopify Discount Code Generator
 * Creates unique, single-use welcome discount codes via the Shopify Admin API.
 * Used by the Clerk user.created webhook to give new customers 20% off their first order.
 */

import { shopifyAdminFetch } from './shopify';

const DISCOUNT_CODE_CREATE_MUTATION = `
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            codes(first: 1) {
              edges {
                node {
                  code
                }
              }
            }
            startsAt
            endsAt
            customerSelection {
              ... on DiscountCustomerAll {
                allCustomers
              }
            }
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
              }
            }
            usageLimit
          }
        }
      }
      userErrors {
        field
        code
        message
      }
    }
  }
`;

/**
 * Generates a unique welcome discount code in the format WELCOME-XXXXXX
 */
function generateWelcomeCode(): string {
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WELCOME-${suffix}`;
}

export interface WelcomeDiscount {
  code: string;
  expiresAt: string; // ISO date string
  percentOff: number;
}

/**
 * Creates a single-use 20% off welcome discount code in Shopify for a new customer.
 * The code expires 30 days from creation.
 */
export async function createWelcomeDiscount(
  _clerkUserId: string
): Promise<WelcomeDiscount> {
  const code = generateWelcomeCode();
  const percentOff = parseInt(process.env.WELCOME_DISCOUNT_PERCENT || '20', 10);
  const validityDays = parseInt(process.env.WELCOME_DISCOUNT_VALIDITY_DAYS || '30', 10);

  const startsAt = new Date().toISOString();
  const expiresAt = new Date(
    Date.now() + validityDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const input = {
    title: `Welcome Discount — ${code}`,
    code,
    startsAt,
    endsAt: expiresAt,
    usageLimit: 1,
    appliesOncePerCustomer: true,
    customerSelection: {
      all: true,
    },
    customerGets: {
      value: {
        percentage: percentOff / 100, // Shopify expects 0.20 for 20%
      },
      items: {
        all: true,
      },
    },
  };

  const result = await shopifyAdminFetch<{
    discountCodeBasicCreate: {
      codeDiscountNode: {
        id: string;
        codeDiscount: {
          codes: { edges: Array<{ node: { code: string } }> };
        };
      } | null;
      userErrors: Array<{ field: string; code: string; message: string }>;
    };
  }>(DISCOUNT_CODE_CREATE_MUTATION, { basicCodeDiscount: input });

  const userErrors = result.data?.discountCodeBasicCreate?.userErrors;
  if (userErrors && userErrors.length > 0) {
    throw new Error(
      `Shopify discount creation failed: ${userErrors.map((e) => e.message).join(', ')}`
    );
  }

  const createdNode = result.data?.discountCodeBasicCreate?.codeDiscountNode;
  if (!createdNode) {
    throw new Error('Shopify did not return a discount node');
  }

  return { code, expiresAt, percentOff };
}
