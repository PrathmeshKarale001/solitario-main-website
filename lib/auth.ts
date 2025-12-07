import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { shopifyAdminFetch, shopifyStorefrontFetch, CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION } from './shopify';

// Shopify Admin API: Find or create customer
async function findOrCreateShopifyCustomer(email: string, firstName?: string, lastName?: string) {
  // First, try to find existing customer by email
  const findQuery = `
    query findCustomer($email: String!) {
      customers(first: 1, query: $email) {
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

  const findResult = await shopifyAdminFetch<{
    customers: { edges: Array<{ node: { id: string; email: string; firstName: string; lastName: string } }> };
  }>(findQuery, { email: `email:${email}` });

  if (findResult.data?.customers?.edges?.length) {
    return findResult.data.customers.edges[0].node;
  }

  // Customer not found, create new one
  const createMutation = `
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

  const createResult = await shopifyAdminFetch<{
    customerCreate: {
      customer: { id: string; email: string; firstName: string; lastName: string } | null;
      userErrors: Array<{ field: string; message: string }>;
    };
  }>(createMutation, {
    input: {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      emailMarketingConsent: {
        marketingState: 'NOT_SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
      },
    },
  });

  if (createResult.data?.customerCreate?.customer) {
    return createResult.data.customerCreate.customer;
  }

  if (createResult.data?.customerCreate?.userErrors?.length) {
    console.error('Failed to create Shopify customer:', createResult.data.customerCreate.userErrors);
  }

  return null;
}

// Shopify Storefront API: Login customer with email/password
async function loginShopifyCustomer(email: string, password: string) {
  const result = await shopifyStorefrontFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
    input: { email, password },
  });

  if (result.data?.customerAccessTokenCreate?.customerAccessToken) {
    return result.data.customerAccessTokenCreate.customerAccessToken;
  }

  if (result.data?.customerAccessTokenCreate?.customerUserErrors?.length) {
    const error = result.data.customerAccessTokenCreate.customerUserErrors[0];
    throw new Error(error.message);
  }

  throw new Error('Login failed');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const token = await loginShopifyCustomer(credentials.email, credentials.password);
          
          // Return user object with Shopify access token
          return {
            id: credentials.email,
            email: credentials.email,
            shopifyAccessToken: token.accessToken,
            shopifyTokenExpires: token.expiresAt,
          };
        } catch (error) {
          console.error('Shopify login error:', error);
          throw new Error('Invalid email or password');
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For Google sign-in, upsert customer in Shopify
      if (account?.provider === 'google' && user.email) {
        try {
          const nameParts = user.name?.split(' ') || [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          const shopifyCustomer = await findOrCreateShopifyCustomer(user.email, firstName, lastName);
          
          if (shopifyCustomer) {
            // Attach Shopify customer ID to user object
            (user as any).shopifyCustomerId = shopifyCustomer.id;
          }
        } catch (error) {
          console.error('Failed to sync customer to Shopify:', error);
          // Don't block sign-in if Shopify sync fails
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
        token.shopifyCustomerId = (user as any).shopifyCustomerId;
        token.shopifyAccessToken = (user as any).shopifyAccessToken;
        token.shopifyTokenExpires = (user as any).shopifyTokenExpires;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).shopifyCustomerId = token.shopifyCustomerId;
        (session.user as any).shopifyAccessToken = token.shopifyAccessToken;
        (session.user as any).shopifyTokenExpires = token.shopifyTokenExpires;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export { findOrCreateShopifyCustomer, loginShopifyCustomer };
