import { NextRequest, NextResponse } from 'next/server';
import { checkPincodeServiceability } from '@/lib/delhivery';
import { getClientIdentifier, apiRateLimiter } from '@/lib/rate-limit';
import { sanitizePincode } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimit = apiRateLimiter.check(identifier);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: apiRateLimiter.getHeaders(rateLimit)
        }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const rawPincode = searchParams.get('pincode');
    const pincode = rawPincode ? sanitizePincode(rawPincode) : null;

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: 'Valid 6-digit pincode is required' },
        { status: 400 }
      );
    }

    const result = await checkPincodeServiceability(pincode);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to check pincode' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pincode,
      serviceable: result.serviceable,
      cod: result.cod,
      prepaid: result.prepaid,
      eta: result.eta,
    });
  } catch (error) {
    console.error('Error checking pincode:', error);
    return NextResponse.json(
      { error: 'Failed to check pincode serviceability' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimit = apiRateLimiter.check(identifier);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { serviceable: false, error: 'Too many requests' },
        { 
          status: 429,
          headers: apiRateLimiter.getHeaders(rateLimit)
        }
      );
    }
    
    const body = await request.json();
    const rawPincode = body.pincode;
    const pincode = rawPincode ? sanitizePincode(rawPincode) : null;

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: 'Valid 6-digit pincode is required' },
        { status: 400 }
      );
    }

    const result = await checkPincodeServiceability(pincode);

    if (!result.success) {
      return NextResponse.json(
        { serviceable: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      serviceable: result.serviceable,
      cod: result.cod,
      prepaid: result.prepaid,
      eta: result.eta,
    });
  } catch (error) {
    console.error('Error checking pincode:', error);
    return NextResponse.json(
      { serviceable: false },
      { status: 200 }
    );
  }
}
