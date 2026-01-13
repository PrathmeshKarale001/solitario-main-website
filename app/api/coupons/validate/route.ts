import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { CouponRepository } from '@/lib/db/storage';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const body = await request.json();
    const { couponCode, subtotal } = body;

    if (!couponCode) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const coupon = CouponRepository.findByCode(couponCode.toUpperCase());

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check if coupon belongs to user (if authenticated)
    if (userId && coupon.clerk_user_id !== userId) {
      return NextResponse.json(
        { error: 'This coupon does not belong to you' },
        { status: 403 }
      );
    }

    // Check if coupon is active
    if (coupon.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'This coupon has already been used or is expired' },
        { status: 400 }
      );
    }

    // Check if coupon is expired
    const now = new Date();
    const expiresAt = new Date(coupon.expires_at);
    if (expiresAt < now) {
      return NextResponse.json(
        { error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      percentOff: coupon.percent_off,
      code: coupon.code,
      expiresAt: coupon.expires_at,
    });
  } catch (error) {
    logger.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
