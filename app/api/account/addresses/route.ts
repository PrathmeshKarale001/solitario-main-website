import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { shopifyStorefrontFetch } from '@/lib/shopify';
import { findOrCreateShopifyCustomer, getShopifyAccessTokenForOAuthUser } from '@/lib/auth';

// Get customer addresses
const CUSTOMER_ADDRESSES_QUERY = `
  query getCustomerAddresses($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      defaultAddress {
        id
      }
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            zip
            country
            phone
          }
        }
      }
    }
  }
`;

// Create address mutation
const CREATE_ADDRESS_MUTATION = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Update address mutation
const UPDATE_ADDRESS_MUTATION = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Delete address mutation
const DELETE_ADDRESS_MUTATION = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Set default address mutation
const SET_DEFAULT_ADDRESS_MUTATION = `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shopifyAccessToken = (session.user as any).shopifyAccessToken;
    
    if (!shopifyAccessToken) {
      return NextResponse.json({ addresses: [] });
    }

    const result = await shopifyStorefrontFetch<{
      customer: {
        defaultAddress: { id: string } | null;
        addresses: {
          edges: Array<{
            node: {
              id: string;
              firstName: string;
              lastName: string;
              company: string;
              address1: string;
              address2: string;
              city: string;
              province: string;
              zip: string;
              country: string;
              phone: string;
            };
          }>;
        };
      } | null;
    }>(CUSTOMER_ADDRESSES_QUERY, {
      customerAccessToken: shopifyAccessToken,
    });

    if (!result.data?.customer?.addresses) {
      return NextResponse.json({ addresses: [] });
    }

    const defaultAddressId = result.data.customer.defaultAddress?.id;

    const addresses = result.data.customer.addresses.edges.map(({ node }) => ({
      id: node.id,
      type: node.company?.toLowerCase().includes('office') ? 'office' : 'home',
      name: `${node.firstName} ${node.lastName}`.trim(),
      phone: node.phone || '',
      line1: node.address1,
      line2: node.address2 || '',
      city: node.city,
      state: node.province,
      pincode: node.zip,
      country: node.country,
      isDefault: node.id === defaultAddressId,
    }));

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('POST addresses - Session:', {
      email: session.user.email,
      hasShopifyAccessToken: !!(session.user as any).shopifyAccessToken,
    });

    let shopifyAccessToken = (session.user as any).shopifyAccessToken;
    
    // If no Shopify access token, try to create one for Google users
    if (!shopifyAccessToken && session.user.email) {
      try {
        console.log('No Shopify token, attempting to create customer for:', session.user.email);
        const nameParts = session.user.name?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Create customer with password for OAuth users
        const shopifyCustomer = await findOrCreateShopifyCustomer(session.user.email, firstName, lastName, true);
        console.log('Shopify customer created:', shopifyCustomer?.id, 'hasPassword:', !!shopifyCustomer?.storedPassword);
        
        if (shopifyCustomer?.storedPassword) {
          console.log('Attempting to get Shopify access token...');
          const tokenResult = await getShopifyAccessTokenForOAuthUser(session.user.email, shopifyCustomer.storedPassword);
          console.log('Token result:', tokenResult ? 'success' : 'failed');
          
          if (tokenResult) {
            shopifyAccessToken = tokenResult.accessToken;
            console.log('Shopify token generated successfully');
            // Note: We can't update the session here, but the address will work for this request
          } else {
            console.log('Token generation failed - no token result');
          }
        } else {
          console.log('Customer created but no stored password');
        }
      } catch (error) {
        console.error('Failed to create Shopify customer for Google user:', error);
        return NextResponse.json({ 
          error: `Shopify customer creation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }, { status: 400 });
      }
    }
    
    if (!shopifyAccessToken) {
      console.log('Still no Shopify token, returning error');
      return NextResponse.json({ 
        error: 'No Shopify access token. Please sign out and sign back in with Google to complete setup.' 
      }, { status: 400 });
    }

    const body = await request.json();
    console.log('Address data received:', body);
    const { name, phone, line1, line2, city, state, pincode, isDefault } = body;

    // Split name into first/last
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const result = await shopifyStorefrontFetch<{
      customerAddressCreate: {
        customerAddress: { id: string } | null;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    }>(CREATE_ADDRESS_MUTATION, {
      customerAccessToken: shopifyAccessToken,
      address: {
        firstName,
        lastName,
        address1: line1,
        address2: line2 || '',
        city,
        province: state,
        zip: pincode,
        country: 'India',
        phone,
      },
    });

    if (result.data?.customerAddressCreate?.customerUserErrors?.length) {
      const error = result.data.customerAddressCreate.customerUserErrors[0];
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const addressId = result.data?.customerAddressCreate?.customerAddress?.id;

    // Set as default if requested
    if (isDefault && addressId) {
      await shopifyStorefrontFetch(SET_DEFAULT_ADDRESS_MUTATION, {
        customerAccessToken: shopifyAccessToken,
        addressId,
      });
    }

    return NextResponse.json({ success: true, addressId });
  } catch (error) {
    console.error('Failed to create address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shopifyAccessToken = (session.user as any).shopifyAccessToken;
    
    if (!shopifyAccessToken) {
      return NextResponse.json({ error: 'No Shopify access token' }, { status: 400 });
    }

    const body = await request.json();
    const { id, name, phone, line1, line2, city, state, pincode, isDefault } = body;

    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const result = await shopifyStorefrontFetch<{
      customerAddressUpdate: {
        customerAddress: { id: string } | null;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    }>(UPDATE_ADDRESS_MUTATION, {
      customerAccessToken: shopifyAccessToken,
      id,
      address: {
        firstName,
        lastName,
        address1: line1,
        address2: line2 || '',
        city,
        province: state,
        zip: pincode,
        country: 'India',
        phone,
      },
    });

    if (result.data?.customerAddressUpdate?.customerUserErrors?.length) {
      const error = result.data.customerAddressUpdate.customerUserErrors[0];
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Set as default if requested
    if (isDefault) {
      await shopifyStorefrontFetch(SET_DEFAULT_ADDRESS_MUTATION, {
        customerAccessToken: shopifyAccessToken,
        addressId: id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shopifyAccessToken = (session.user as any).shopifyAccessToken;
    
    if (!shopifyAccessToken) {
      return NextResponse.json({ error: 'No Shopify access token' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    const result = await shopifyStorefrontFetch<{
      customerAddressDelete: {
        deletedCustomerAddressId: string | null;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    }>(DELETE_ADDRESS_MUTATION, {
      customerAccessToken: shopifyAccessToken,
      id,
    });

    if (result.data?.customerAddressDelete?.customerUserErrors?.length) {
      const error = result.data.customerAddressDelete.customerUserErrors[0];
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
