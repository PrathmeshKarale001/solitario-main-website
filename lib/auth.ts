import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { shopifyAdminFetch, shopifyStorefrontFetch, CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION } from './shopify';
import crypto from 'crypto';

// Generate a secure random password for OAuth users
function generateSecurePassword(): string {
  return crypto.randomBytes(32).toString('base64') + '!Aa1';
}

// Shopify Admin API: Find or create customer with password for OAuth
async function findOrCreateShopifyCustomer(email: string, firstName?: string, lastName?: string, createWithPassword: boolean = false) {
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
            phone
            metafield(namespace: "custom", key: "oauth_password") {
              value
            }
          }
        }
      }
    }
  `;

  const findResult = await shopifyAdminFetch<{
    customers: { edges: Array<{ node: { id: string; email: string; firstName: string; lastName: string; phone: string | null; metafield: { value: string } | null } }> };
  }>(findQuery, { email: `email:${email}` });

  if (findResult.data?.customers?.edges?.length) {
    const existingCustomer = findResult.data.customers.edges[0].node;
    // Return existing customer with stored password if available
    return {
      ...existingCustomer,
      storedPassword: existingCustomer.metafield?.value || null,
    };
  }

  // Customer not found, create new one
  const password = createWithPassword ? generateSecurePassword() : null;
  
  const createMutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          phone
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
      customer: { id: string; email: string; firstName: string; lastName: string; phone: string | null } | null;
      userErrors: Array<{ field: string; message: string }>;
    };
  }>(createMutation, {
    input: {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      ...(password && { password, passwordConfirmation: password }),
      emailMarketingConsent: {
        marketingState: 'NOT_SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
      },
      metafields: password ? [
        {
          namespace: 'custom',
          key: 'oauth_password',
          value: password,
          type: 'single_line_text_field',
        },
      ] : undefined,
    },
  });

  if (createResult.data?.customerCreate?.customer) {
    return {
      ...createResult.data.customerCreate.customer,
      storedPassword: password,
    };
  }

  if (createResult.data?.customerCreate?.userErrors?.length) {
    console.error('Failed to create Shopify customer:', createResult.data.customerCreate.userErrors);
  }

  return null;
}

// Get Shopify customer access token using stored password (for OAuth users)
async function getShopifyAccessTokenForOAuthUser(email: string, password: string): Promise<{ accessToken: string; expiresAt: string } | null> {
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
      return result.data.customerAccessTokenCreate.customerAccessToken;
    }
    return null;
  } catch (error) {
    console.error('Failed to get Shopify access token for OAuth user:', error);
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
      // For Google sign-in, upsert customer in Shopify with password for API access
      if (account?.provider === 'google' && user.email) {
        try {
          const nameParts = user.name?.split(' ') || [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Create customer with password for OAuth users
          const shopifyCustomer = await findOrCreateShopifyCustomer(user.email, firstName, lastName, true);
          
          if (shopifyCustomer) {
            (user as any).shopifyCustomerId = shopifyCustomer.id;
            
            // Get Shopify access token using the stored password
            if (shopifyCustomer.storedPassword) {
              const tokenResult = await getShopifyAccessTokenForOAuthUser(user.email, shopifyCustomer.storedPassword);
              if (tokenResult) {
                (user as any).shopifyAccessToken = tokenResult.accessToken;
                (user as any).shopifyTokenExpires = tokenResult.expiresAt;
              }
            }
          }
        } catch (error) {
          console.error('Failed to sync customer to Shopify:', error);
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.shopifyCustomerId = (user as any).shopifyCustomerId;
        token.shopifyAccessToken = (user as any).shopifyAccessToken;
        token.shopifyTokenExpires = (user as any).shopifyTokenExpires;
      }
      
      // Check if token needs refresh (for OAuth users)
      if (token.shopifyTokenExpires && trigger !== 'signIn') {
        const expiresAt = new Date(token.shopifyTokenExpires as string);
        const now = new Date();
        // Refresh if token expires in less than 1 day
        if (expiresAt.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
          try {
            // Try to renew the token
            const renewResult = await shopifyStorefrontFetch<{
              customerAccessTokenRenew: {
                customerAccessToken: { accessToken: string; expiresAt: string } | null;
                userErrors: Array<{ field: string[]; message: string }>;
              };
            }>(`
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
            `, {
              customerAccessToken: token.shopifyAccessToken,
            });
            
            if (renewResult.data?.customerAccessTokenRenew?.customerAccessToken) {
              token.shopifyAccessToken = renewResult.data.customerAccessTokenRenew.customerAccessToken.accessToken;
              token.shopifyTokenExpires = renewResult.data.customerAccessTokenRenew.customerAccessToken.expiresAt;
            }
          } catch (error) {
            console.error('Failed to renew Shopify token:', error);
          }
        }
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
  // Add domain configuration for production
  ...(process.env.NODE_ENV === 'production' && {
    url: 'https://thesolitario.com',
    // Handle both www and non-www versions
    useSecureCookies: true,
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          domain: process.env.NEXTAUTH_URL === 'https://www.thesolitario.com' ? '.thesolitario.com' : undefined,
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
        },
      },
      callbackUrl: {
        name: `__Secure-next-auth.callback-url`,
        options: {
          domain: process.env.NEXTAUTH_URL === 'https://www.thesolitario.com' ? '.thesolitario.com' : undefined,
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
        },
      },
      csrfToken: {
        name: `__Host-next-auth.csrf-token`,
        options: {
          domain: process.env.NEXTAUTH_URL === 'https://www.thesolitario.com' ? '.thesolitario.com' : undefined,
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
        },
      },
    },
  }),
};

export { findOrCreateShopifyCustomer, loginShopifyCustomer, getShopifyAccessTokenForOAuthUser };
