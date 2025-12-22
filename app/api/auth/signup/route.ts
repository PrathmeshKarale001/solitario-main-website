import { NextRequest, NextResponse } from 'next/server';
import { shopifyStorefrontFetch, CUSTOMER_CREATE_MUTATION } from '@/lib/shopify';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Create customer via Shopify Storefront API
    const result = await shopifyStorefrontFetch<{
      customerCreate: {
        customer: { id: string; email: string; firstName: string; lastName: string } | null;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    }>(CUSTOMER_CREATE_MUTATION, {
      input: {
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        password,
        acceptsMarketing: false,
      },
    });

    if (result.errors) {
      console.error('Shopify GraphQL errors:', JSON.stringify(result.errors, null, 2));
      return NextResponse.json({ 
        error: 'Failed to create account',
        details: result.errors.map((e: any) => e.message).join(', ')
      }, { status: 500 });
    }

    if (result.data?.customerCreate?.customerUserErrors?.length) {
      const error = result.data.customerCreate.customerUserErrors[0];
      
      // Handle specific error codes
      if (error.code === 'TAKEN') {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
      }
      if (error.code === 'TOO_SHORT') {
        return NextResponse.json({ error: 'Password is too short' }, { status: 400 });
      }
      
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!result.data?.customerCreate?.customer) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: result.data.customerCreate.customer.id,
        email: result.data.customerCreate.customer.email,
        firstName: result.data.customerCreate.customer.firstName,
        lastName: result.data.customerCreate.customer.lastName,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
