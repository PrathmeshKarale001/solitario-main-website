import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { syncUserWithShopify, syncAddressesToShopify } from '@/lib/shopify-sync';

interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// GET - Fetch user addresses from Clerk metadata
export async function GET(request: NextRequest) {
  try {
    console.log('Addresses API: GET');
    
    const { userId } = getAuth(request);
    console.log('Addresses API: userId:', userId);
    
    if (!userId) {
      console.log('Addresses API: Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get addresses from Clerk metadata
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const addresses = (user.publicMetadata.addresses as Address[]) || [];
    
    console.log('Addresses API: Found', addresses.length, 'addresses');
    
    return NextResponse.json({ addresses });
    
  } catch (error) {
    console.error('Addresses API ERROR:', error);
    return NextResponse.json({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}

// POST - Add new address
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('POST address:', body);

    // Get existing addresses
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const addresses = (user.publicMetadata.addresses as Address[]) || [];

    // Create new address
    const newAddress: Address = {
      id: `addr_${Date.now()}`,
      name: body.name,
      line1: body.line1,
      line2: body.line2 || '',
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      isDefault: body.isDefault || addresses.length === 0,
    };

    // If this is default, unset others
    if (newAddress.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }

    addresses.push(newAddress);

    // Save to Clerk metadata
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        addresses,
      },
    });

    console.log('Saved address:', newAddress);

    // Sync with Shopify (async, don't wait)
    try {
      // Ensure user has Shopify customer
      await syncUserWithShopify(userId, user.primaryEmailAddress?.emailAddress || '', user.firstName, user.lastName);
      
      // Sync addresses to Shopify
      await syncAddressesToShopify(userId, addresses);
    } catch (shopifyError) {
      console.error('Shopify sync failed (but saved to Clerk):', shopifyError);
      // Don't fail the request if Shopify sync fails
    }

    return NextResponse.json({ 
      success: true, 
      addressId: newAddress.id,
      message: 'Address saved successfully'
    });
    
  } catch (error) {
    console.error('POST address error:', error);
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}

// PUT - Update address
export async function PUT(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    let addresses = (user.publicMetadata.addresses as Address[]) || [];

    const index = addresses.findIndex(addr => addr.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Update address
    addresses[index] = { ...addresses[index], ...updates };

    // Save to Clerk metadata
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        addresses,
      },
    });

    console.log('Updated address:', addresses[index]);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('PUT address error:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE - Remove address
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    let addresses = (user.publicMetadata.addresses as Address[]) || [];

    addresses = addresses.filter(addr => addr.id !== addressId);

    // If deleted address was default, set first as default
    if (addresses.length > 0 && !addresses.some(addr => addr.isDefault)) {
      addresses[0].isDefault = true;
    }

    // Save to Clerk metadata
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        addresses,
      },
    });

    console.log('Deleted address:', addressId);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('DELETE address error:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}