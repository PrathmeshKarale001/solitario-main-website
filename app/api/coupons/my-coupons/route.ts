import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { CouponRepository } from '@/lib/db/storage';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const activeCoupons = CouponRepository.findActiveByClerkUserId(userId);

    const coupons = activeCoupons.map(coupon => ({
      code: coupon.code,
      percentOff: coupon.percent_off,
      issuedAt: coupon.issued_at,
      expiresAt: coupon.expires_at,
      daysRemaining: Math.ceil(
        (new Date(coupon.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
    }));

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error) {
    logger.error('Error fetching user coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}
