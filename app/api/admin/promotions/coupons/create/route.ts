import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { CouponRepository } from '@/lib/db/storage';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, percent_off, clerk_user_id, expires_at } = body;

    if (!code || !percent_off || !clerk_user_id || !expires_at) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existing = CouponRepository.findByCode(code.toUpperCase());
    if (existing) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    const coupon = CouponRepository.create({
      code: code.toUpperCase(),
      clerk_user_id,
      percent_off: Number(percent_off),
      status: 'ACTIVE',
      issued_month: new Date().toISOString().slice(0, 7),
      issued_at: new Date().toISOString(),
      expires_at: new Date(expires_at).toISOString(),
      redeemed_at: null,
      issued_for_order_id: 'MANUAL',
    });

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error) {
    logger.error('Error creating manual coupon:', error);
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
