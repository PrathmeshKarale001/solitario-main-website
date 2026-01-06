import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { syncUserWithShopify } from '@/lib/shopify-sync';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const email = user.primaryEmailAddress?.emailAddress || '';

    console.log('[Manual Sync] Starting manual Shopify sync for:', email);

    // Force sync with Shopify
    const result = await syncUserWithShopify(
      userId,
      email,
      user.firstName || undefined,
      user.lastName || undefined
    );

    console.log('[Manual Sync] Result:', result);

    return NextResponse.json({
      success: true,
      message: 'Synced successfully',
      shopifyCustomerId: result.customerId,
      hasAccessToken: !!result.accessToken,
    });

  } catch (error) {
    console.error('[Manual Sync] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
