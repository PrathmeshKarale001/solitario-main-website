import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { syncUserWithShopify } from '@/lib/shopify-sync';
import { Webhook } from 'svix';

// Clerk webhook secret - add this to .env.local
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    // Get webhook headers
    const svix_id = request.headers.get('svix-id');
    const svix_timestamp = request.headers.get('svix-timestamp');
    const svix_signature = request.headers.get('svix-signature');

    // If no headers, it's not a Clerk webhook
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse('Error: Missing svix headers', { status: 400 });
    }

    // Get the raw body
    const body = await request.text();
    
    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    // Verify the webhook
    let evt: any;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('[Webhook] Error verifying webhook:', err);
      return new NextResponse('Error: Invalid signature', { status: 400 });
    }

    // Handle the event
    const eventType = evt.type;
    console.log('[Webhook] Received event:', eventType);

    if (eventType === 'user.created') {
      const userData = evt.data;
      
      console.log('[Webhook] New user signed up:', userData.email_addresses[0]?.email_address);

      // Sync to Shopify
      try {
        const email = userData.email_addresses[0]?.email_address;
        if (!email) {
          throw new Error('No email address found');
        }

        await syncUserWithShopify(
          userData.id,
          email,
          userData.first_name,
          userData.last_name
        );

        console.log('[Webhook] Successfully synced new user to Shopify');
      } catch (error) {
        console.error('[Webhook] Failed to sync to Shopify:', error);
        // Don't fail the webhook, just log the error
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
