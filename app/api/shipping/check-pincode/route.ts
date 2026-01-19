import { NextRequest, NextResponse } from 'next/server';
import { checkPincodeServiceability } from '@/lib/delhivery';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');

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
