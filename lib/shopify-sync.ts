// Shopify Customer Sync Utility
// This will sync Clerk users with Shopify customers

import { clerkClient } from '@clerk/nextjs/server';
import { shopifyAdminFetch } from './shopify';

// Create Shopify customer mutation
const CREATE_CUSTOMER_MUTATION = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Update customer mutation
const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Create address mutation
const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

/**
 * Create or update Shopify customer for Clerk user
 */
export async function syncUserWithShopify(userId: string, email: string, firstName?: string, lastName?: string) {
  try {
    console.log('[Shopify Sync] Starting sync for user:', email);

    // Check if user already has Shopify customer ID
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const shopifyCustomerId = user.publicMetadata.shopifyCustomerId as string;

    if (shopifyCustomerId) {
      console.log('[Shopify Sync] User already has Shopify customer:', shopifyCustomerId);
      return shopifyCustomerId;
    }

    // Create new Shopify customer
    const result = await shopifyAdminFetch(CREATE_CUSTOMER_MUTATION, {
      input: {
        email,
        firstName: firstName || email.split('@')[0],
        lastName: lastName || '',
      },
    });

    if (result.data?.customerCreate?.userErrors?.length > 0) {
      throw new Error(result.data.customerCreate.userErrors[0].message);
    }

    const customerId = result.data?.customerCreate?.customer?.id;
    if (!customerId) {
      throw new Error('Failed to create Shopify customer');
    }

    // Store Shopify customer ID in Clerk metadata
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        shopifyCustomerId: customerId,
      },
    });

    console.log('[Shopify Sync] Created Shopify customer:', customerId);
    return customerId;

  } catch (error) {
    console.error('[Shopify Sync] Failed:', error);
    throw error;
  }
}

/**
 * Sync addresses from Clerk to Shopify
 */
export async function syncAddressesToShopify(userId: string, addresses: any[]) {
  try {
    console.log('[Shopify Sync] Syncing', addresses.length, 'addresses to Shopify');

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const shopifyCustomerId = user.publicMetadata.shopifyCustomerId as string;

    if (!shopifyCustomerId) {
      throw new Error('User not synced with Shopify');
    }

    // TODO: Implement address sync
    // This requires customer access token and address mutations
    console.log('[Shopify Sync] Address sync not yet implemented');

  } catch (error) {
    console.error('[Shopify Sync] Failed to sync addresses:', error);
    throw error;
  }
}
