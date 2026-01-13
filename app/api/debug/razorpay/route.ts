import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not set',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not set',
    publicRazorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'Not set',
    envVars: {
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID?.substring(0, 10) + '...',
      NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    }
  });
}
