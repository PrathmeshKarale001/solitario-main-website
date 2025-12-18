import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { shopifyStorefrontFetch, shopifyAdminFetch } from '@/lib/shopify';

// Get customer profile using Storefront API
const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      createdAt
      defaultAddress {
        id
        firstName
        lastName
        phone
        address1
        address2
        city
        province
        zip
        country
      }
    }
  }
`;

// Update customer using Storefront API
const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Admin API: Update customer (for fields not available in Storefront API)
const ADMIN_CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
        metafield(namespace: "custom", key: "birthday") {
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

// Admin API: Get customer with metafields
const ADMIN_CUSTOMER_QUERY = `
  query getCustomer($id: ID!) {
    customer(id: $id) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
      createdAt
      metafield(namespace: "custom", key: "birthday") {
        value
      }
      metafield2: metafield(namespace: "custom", key: "notification_sms") {
        value
      }
      metafield3: metafield(namespace: "custom", key: "notification_promotions") {
        value
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
    const shopifyCustomerId = (session.user as any).shopifyCustomerId;
    
    // Try Storefront API first if we have an access token
    if (shopifyAccessToken) {
      const result = await shopifyStorefrontFetch<{
        customer: {
          id: string;
          firstName: string;
          lastName: string;
          email: string;
          phone: string | null;
          acceptsMarketing: boolean;
          createdAt: string;
          defaultAddress: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string;
            address1: string;
            address2: string;
            city: string;
            province: string;
            zip: string;
            country: string;
          } | null;
        } | null;
      }>(CUSTOMER_QUERY, {
        customerAccessToken: shopifyAccessToken,
      });

      if (result.data?.customer) {
        const customer = result.data.customer;
        
        // Try to get additional metafields from Admin API
        let birthday = '';
        let notificationSms = false;
        let notificationPromotions = true;
        
        if (shopifyCustomerId) {
          try {
            const adminResult = await shopifyAdminFetch<{
              customer: {
                metafield: { value: string } | null;
                metafield2: { value: string } | null;
                metafield3: { value: string } | null;
              } | null;
            }>(ADMIN_CUSTOMER_QUERY, { id: shopifyCustomerId });
            
            if (adminResult.data?.customer) {
              birthday = adminResult.data.customer.metafield?.value || '';
              notificationSms = adminResult.data.customer.metafield2?.value === 'true';
              notificationPromotions = adminResult.data.customer.metafield3?.value !== 'false';
            }
          } catch (error) {
            console.error('Failed to fetch customer metafields:', error);
          }
        }
        
        return NextResponse.json({
          profile: {
            id: customer.id,
            name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            email: customer.email,
            phone: customer.phone || '',
            birthday,
            acceptsMarketing: customer.acceptsMarketing,
            notifications: {
              email: customer.acceptsMarketing,
              sms: notificationSms,
              promotions: notificationPromotions,
            },
            createdAt: customer.createdAt,
            defaultAddress: customer.defaultAddress,
          },
        });
      }
    }

    // Fallback: Return basic session data if no Shopify token
    return NextResponse.json({
      profile: {
        id: null,
        name: session.user.name || '',
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        email: session.user.email || '',
        phone: '',
        birthday: '',
        acceptsMarketing: false,
        notifications: {
          email: true,
          sms: false,
          promotions: true,
        },
        createdAt: null,
        defaultAddress: null,
      },
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shopifyAccessToken = (session.user as any).shopifyAccessToken;
    const shopifyCustomerId = (session.user as any).shopifyCustomerId;
    
    const body = await request.json();
    const { name, phone, birthday, notifications } = body;

    // Parse name into first/last
    const nameParts = (name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update via Storefront API if we have access token
    if (shopifyAccessToken) {
      const result = await shopifyStorefrontFetch<{
        customerUpdate: {
          customer: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            acceptsMarketing: boolean;
          } | null;
          customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
        };
      }>(CUSTOMER_UPDATE_MUTATION, {
        customerAccessToken: shopifyAccessToken,
        customer: {
          firstName,
          lastName,
          phone: phone || null,
          acceptsMarketing: notifications?.email ?? true,
        },
      });

      if (result.data?.customerUpdate?.customerUserErrors?.length) {
        const error = result.data.customerUpdate.customerUserErrors[0];
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    // Update metafields via Admin API if we have customer ID
    if (shopifyCustomerId) {
      try {
        await shopifyAdminFetch(ADMIN_CUSTOMER_UPDATE_MUTATION, {
          input: {
            id: shopifyCustomerId,
            firstName,
            lastName,
            phone: phone || null,
            acceptsMarketing: notifications?.email ?? true,
            metafields: [
              {
                namespace: 'custom',
                key: 'birthday',
                value: birthday || '',
                type: 'single_line_text_field',
              },
              {
                namespace: 'custom',
                key: 'notification_sms',
                value: String(notifications?.sms ?? false),
                type: 'single_line_text_field',
              },
              {
                namespace: 'custom',
                key: 'notification_promotions',
                value: String(notifications?.promotions ?? true),
                type: 'single_line_text_field',
              },
            ],
          },
        });
      } catch (error) {
        console.error('Failed to update customer metafields:', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
