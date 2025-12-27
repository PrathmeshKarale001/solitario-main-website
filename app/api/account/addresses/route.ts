import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

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

// GET - Fetch user addresses
export async function GET(request: NextRequest) {
  try {
    console.log('Addresses API: GET');
    
    const { userId } = getAuth(request);
    console.log('Addresses API: userId:', userId);
    
    if (!userId) {
      console.log('Addresses API: Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return empty addresses
    // TODO: Implement Clerk metadata storage
    console.log('Addresses API: Returning empty addresses');
    return NextResponse.json({ addresses: [] });
    
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

    // TODO: Implement actual address saving
    return NextResponse.json({ success: true, message: 'Address saved (TODO: implement)' });
    
  } catch (error) {
    console.error('POST address error:', error);
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}