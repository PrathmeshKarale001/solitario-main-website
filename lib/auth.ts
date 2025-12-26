import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { shopifyAdminFetch, shopifyStorefrontFetch, CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION } from './shopify';
import crypto from 'crypto';

// Generate a secure random password for OAuth users
function generateSecurePassword(): string {
  return crypto.randomBytes(32).toString('base64') + '!Aa1';
}

// Create or get Shopify customer for Google OAuth users
async function createShopifyCustomerForOAuth(email: string, firstName: string, lastName: string) {
  console.log('[AUTH] Creating Shopify customer for:', email);
  
  // Check if customer exists
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

  try {
    const findResult = await shopifyAdminFetch<{
      customers: { edges: Array<{ node: { id: string; email: string; firstName: string; lastName: string } }> };
    }>(findQuery, { email: `email:${email}` });

    if (findResult.data?.customers?.edges?.length) {
      const customer = findResult.data.customers.edges[0].node;
      console.log('[AUTH] Found existing customer:', customer.id);
      return customer;
    }

    // Create new customer
    const password = generateSecurePassword();
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
        firstName: firstName || 'User',
        lastName: lastName || '',
        password,
        passwordConfirmation: password,
        emailMarketingConsent: {
          marketingState: 'NOT_SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
        },
      },
    });

    if (createResult.data?.customerCreate?.userErrors?.length) {
      console.error('[AUTH] Customer creation errors:', createResult.data.customerCreate.userErrors);
      throw new Error(createResult.data.customerCreate.userErrors[0].message);
    }

    if (createResult.data?.customerCreate?.customer) {
      console.log('[AUTH] Created new customer:', createResult.data.customerCreate.customer.id);
      return createResult.data.customerCreate.customer;
    }

    throw new Error('Failed to create customer');
  } catch (error) {
    console.error('[AUTH] Error in createShopifyCustomerForOAuth:', error);
    throw error;
  }
}

// Get Shopify access token for customer
async function getShopifyAccessToken(email: string, password: string) {
  console.log('[AUTH] Getting Shopify access token for:', email);
  
  try {
    const result = await shopifyStorefrontFetch<{
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
      input: { email, password },
    });

    if (result.data?.customerAccessTokenCreate?.customerAccessToken) {
      console.log('[AUTH] Successfully created access token');
      return result.data.customerAccessTokenCreate.customerAccessToken;
    }

    if (result.data?.customerAccessTokenCreate?.customerUserErrors?.length) {
      console.error('[AUTH] Token creation errors:', result.data.customerAccessTokenCreate.customerUserErrors);
    }

    return null;
  } catch (error) {
    console.error('[AUTH] Error getting Shopify access token:', error);
    return null;
  }
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
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
      // For Google sign-in, create Shopify customer
      if (account?.provider === 'google' && user.email) {
        console.log('[AUTH] Google sign-in detected for:', user.email);
        
        try {
          const nameParts = user.name?.split(' ') || [];
          const firstName = nameParts[0] || 'User';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Create or get Shopify customer
          const shopifyCustomer = await createShopifyCustomerForOAuth(user.email, firstName, lastName);
          
          if (shopifyCustomer) {
            (user as any).shopifyCustomerId = shopifyCustomer.id;
            console.log('[AUTH] Shopify customer ID stored:', shopifyCustomer.id);
          }
        } catch (error) {
          console.error('[AUTH] Failed to create Shopify customer:', error);
          // Don't block sign-in, but log the error
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.shopifyCustomerId = (user as any).shopifyCustomerId;
        token.shopifyAccessToken = (user as any).shopifyAccessToken;
        token.shopifyTokenExpires = (user as any).shopifyTokenExpires;
        
        console.log('[AUTH] JWT created with Shopify data:', {
          email: token.email,
          hasCustomerId: !!token.shopifyCustomerId,
          hasAccessToken: !!token.shopifyAccessToken,
        });
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).shopifyCustomerId = token.shopifyCustomerId;
        (session.user as any).shopifyAccessToken = token.shopifyAccessToken;
        (session.user as any).shopifyTokenExpires = token.shopifyTokenExpires;
        
        console.log('[AUTH] Session created with Shopify data:', {
          email: session.user.email,
          hasCustomerId: !!(session.user as any).shopifyCustomerId,
          hasAccessToken: !!(session.user as any).shopifyAccessToken,
        });
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
  debug: process.env.NODE_ENV === 'development',
};

export { loginShopifyCustomer };
