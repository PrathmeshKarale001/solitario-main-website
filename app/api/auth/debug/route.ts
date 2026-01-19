import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ 
        status: 'not_authenticated',
        message: 'No session found'
      });
    }

    const user = session.user as any;
    
    return NextResponse.json({
      status: 'authenticated',
      user: {
        email: user.email,
        name: user.name,
        hasShopifyCustomerId: !!user.shopifyCustomerId,
        hasShopifyAccessToken: !!user.shopifyAccessToken,
        shopifyCustomerId: user.shopifyCustomerId,
        shopifyTokenExpires: user.shopifyTokenExpires,
      },
      session: {
        expires: session.expires,
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to check session'
    }, { status: 500 });
  }
}
