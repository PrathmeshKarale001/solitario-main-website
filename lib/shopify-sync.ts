// Shopify Customer Sync Utility
// This will sync Clerk users with Shopify customers and addresses

import { clerkClient } from '@clerk/nextjs/server';
import { shopifyAdminFetch, shopifyStorefrontFetch } from './shopify';

// Search for existing customer query
const SEARCH_CUSTOMER_QUERY = `
  query searchCustomers($query: String!) {
    customers(first: 1, query: $query) {
      edges {
        node {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`;

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

// Generate customer access token mutation
const CUSTOMER_ACCESS_TOKEN_CREATE = `
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

// Create address mutation
const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

// Update address mutation
const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

// Delete address mutation
const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
      }
    }
  }
`;

// Generate a secure password for Shopify customer
function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

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
    const shopifyAccessToken = user.privateMetadata.shopifyAccessToken as string;

    if (shopifyCustomerId && shopifyAccessToken) {
      console.log('[Shopify Sync] User already has Shopify customer:', shopifyCustomerId);
      return { customerId: shopifyCustomerId, accessToken: shopifyAccessToken };
    }

    // Create new Shopify customer
    // First, search for existing customer
    const searchResult = await shopifyAdminFetch(SEARCH_CUSTOMER_QUERY, {
      query: `email:${email}`,
    });

    console.log('[Shopify Sync] Search result:', JSON.stringify(searchResult, null, 2));

    const existingCustomer = searchResult.data?.customers?.edges?.[0]?.node;
    let customerId: string;

    if (existingCustomer) {
      // Customer exists, use their ID
      customerId = existingCustomer.id;
      console.log('[Shopify Sync] Found existing customer:', customerId);
    } else {
      // Create new customer
      const result = await shopifyAdminFetch(CREATE_CUSTOMER_MUTATION, {
        input: {
          email,
          firstName: firstName || email.split('@')[0],
          lastName: lastName || '',
        },
      });

      console.log('[Shopify Sync] Shopify response:', JSON.stringify(result, null, 2));

      if (result.data?.customerCreate?.userErrors?.length > 0) {
        throw new Error(result.data.customerCreate.userErrors[0].message);
      }

      customerId = result.data?.customerCreate?.customer?.id;
      if (!customerId) {
        throw new Error('Failed to create Shopify customer');
      }
    }

    // For Admin API, we don't generate access tokens
    // Store only the customer ID
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        shopifyCustomerId: customerId,
        shopifyAddressIds: {}, // Map Clerk address IDs to Shopify address IDs
      },
    });

    console.log('[Shopify Sync] Created Shopify customer:', customerId);
    return { customerId, accessToken: null };

  } catch (error) {
    console.error('[Shopify Sync] Failed:', error);
    throw error;
  }
}

/**
 * Get Shopify access token for user
 */
export async function getShopifyAccessToken(userId: string, email: string, firstName?: string, lastName?: string): Promise<string> {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  
  let accessToken = user.privateMetadata.shopifyAccessToken as string;
  
  if (!accessToken) {
    const result = await syncUserWithShopify(userId, email, firstName, lastName);
    accessToken = result.accessToken;
  }
  
  return accessToken;
}

/**
 * Create a single address in Shopify
 */
export async function createShopifyAddress(userId: string, address: any) {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const accessToken = await getShopifyAccessToken(
      userId, 
      user.primaryEmailAddress?.emailAddress || '', 
      user.firstName, 
      user.lastName
    );

    const shopifyAddress = {
      firstName: address.name.split(' ')[0] || '',
      lastName: address.name.split(' ').slice(1).join(' ') || '',
      company: '',
      address1: address.line1,
      address2: address.line2 || '',
      city: address.city,
      province: address.state,
      country: 'IN',
      zip: address.pincode,
      phone: address.phone || '',
    };

    const result = await shopifyStorefrontFetch(CUSTOMER_ADDRESS_CREATE_MUTATION, {
      customerAccessToken: accessToken,
      address: shopifyAddress,
    });

    if (result.data?.customerAddressCreate?.customerUserErrors?.length > 0) {
      throw new Error(result.data.customerAddressCreate.customerUserErrors[0].message);
    }

    const shopifyAddressId = result.data?.customerAddressCreate?.customerAddress?.id;
    
    // Store mapping in Clerk metadata
    const shopifyAddressIds = (user.publicMetadata.shopifyAddressIds as Record<string, string>) || {};
    shopifyAddressIds[address.id] = shopifyAddressId;
    
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        shopifyAddressIds,
      },
    });

    console.log('[Shopify Sync] Created address in Shopify:', shopifyAddressId);
    return shopifyAddressId;

  } catch (error) {
    console.error('[Shopify Sync] Failed to create address:', error);
    throw error;
  }
}

/**
 * Update an address in Shopify
 */
export async function updateShopifyAddress(userId: string, addressId: string, address: any) {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const accessToken = await getShopifyAccessToken(
      userId, 
      user.primaryEmailAddress?.emailAddress || '', 
      user.firstName, 
      user.lastName
    );

    // Get Shopify address ID from metadata
    const shopifyAddressIds = (user.publicMetadata.shopifyAddressIds as Record<string, string>) || {};
    const shopifyAddressId = shopifyAddressIds[addressId];
    
    if (!shopifyAddressId) {
      // If no mapping exists, create new address
      return await createShopifyAddress(userId, address);
    }

    const shopifyAddress = {
      firstName: address.name.split(' ')[0] || '',
      lastName: address.name.split(' ').slice(1).join(' ') || '',
      company: '',
      address1: address.line1,
      address2: address.line2 || '',
      city: address.city,
      province: address.state,
      country: 'IN',
      zip: address.pincode,
      phone: address.phone || '',
    };

    const result = await shopifyStorefrontFetch(CUSTOMER_ADDRESS_UPDATE_MUTATION, {
      customerAccessToken: accessToken,
      id: shopifyAddressId,
      address: shopifyAddress,
    });

    if (result.data?.customerAddressUpdate?.customerUserErrors?.length > 0) {
      throw new Error(result.data.customerAddressUpdate.customerUserErrors[0].message);
    }

    console.log('[Shopify Sync] Updated address in Shopify:', shopifyAddressId);
    return result.data?.customerAddressUpdate?.customerAddress;

  } catch (error) {
    console.error('[Shopify Sync] Failed to update address:', error);
    throw error;
  }
}

/**
 * Delete an address from Shopify
 */
export async function deleteShopifyAddress(userId: string, addressId: string) {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const accessToken = await getShopifyAccessToken(
      userId, 
      user.primaryEmailAddress?.emailAddress || '', 
      user.firstName, 
      user.lastName
    );

    // Get Shopify address ID from metadata
    const shopifyAddressIds = (user.publicMetadata.shopifyAddressIds as Record<string, string>) || {};
    const shopifyAddressId = shopifyAddressIds[addressId];
    
    if (!shopifyAddressId) {
      console.log('[Shopify Sync] Address not found in Shopify, skipping delete');
      return;
    }

    const result = await shopifyStorefrontFetch(CUSTOMER_ADDRESS_DELETE_MUTATION, {
      customerAccessToken: accessToken,
      id: shopifyAddressId,
    });

    if (result.data?.customerAddressDelete?.customerUserErrors?.length > 0) {
      throw new Error(result.data.customerAddressDelete.customerUserErrors[0].message);
    }

    // Remove mapping from metadata
    delete shopifyAddressIds[addressId];
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        shopifyAddressIds,
      },
    });

    console.log('[Shopify Sync] Deleted address from Shopify:', shopifyAddressId);
    return result.data?.customerAddressDelete?.deletedCustomerAddressId;

  } catch (error) {
    console.error('[Shopify Sync] Failed to delete address:', error);
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
    
    // Ensure user has Shopify customer
    await syncUserWithShopify(
      userId, 
      user.primaryEmailAddress?.emailAddress || '', 
      user.firstName, 
      user.lastName
    );

    // Sync each address
    for (const address of addresses) {
      try {
        await createShopifyAddress(userId, address);
      } catch (error) {
        console.error('[Shopify Sync] Failed to sync address:', address.id, error);
      }
    }

  } catch (error) {
    console.error('[Shopify Sync] Failed to sync addresses:', error);
    throw error;
  }
}
