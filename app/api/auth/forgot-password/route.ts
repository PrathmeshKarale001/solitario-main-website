import { NextRequest, NextResponse } from 'next/server';
import { shopifyStorefrontFetch } from '@/lib/shopify';

const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Use Shopify's customerRecover mutation to send password reset email
    const result = await shopifyStorefrontFetch<{
      customerRecover: {
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    }>(CUSTOMER_RECOVER_MUTATION, {
      email,
    });

    if (result.errors) {
      console.error('Shopify GraphQL errors:', result.errors);
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }

    if (result.data?.customerRecover?.customerUserErrors?.length) {
      const error = result.data.customerRecover.customerUserErrors[0];
      
      if (error.code === 'NOT_FOUND') {
        // Don't reveal if email exists or not for security
        return NextResponse.json({
          success: true,
          message: 'If an account exists with this email, you will receive password reset instructions.',
        });
      }
      
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
