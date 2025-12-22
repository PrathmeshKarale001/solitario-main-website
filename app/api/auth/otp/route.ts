import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOTPToken(email: string, otp: string): string {
  return jwt.sign(
    { 
      email, 
      otp: crypto.createHash('sha256').update(otp).digest('hex'),
      type: 'email_verification'
    },
    JWT_SECRET,
    { expiresIn: '10m' }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOTP();

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'Solitario <noreply@thesolitario.com>',
      to: [email],
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #146552; font-size: 32px; margin-bottom: 10px;">Solitario</h1>
            <p style="color: #666; font-size: 16px;">Verify Your Email Address</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Your verification code is:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; display: inline-block;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #146552;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">This code will expire in 10 minutes.</p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>If you didn't request this code, please ignore this email.</p>
            <p> 2024 Solitario. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }

    // Return token with OTP (client needs to return OTP for verification)
    const token = generateOTPToken(email, otp);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      token,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}

// Verify OTP endpoint
export async function PUT(request: NextRequest) {
  try {
    const { email, otp, token } = await request.json();

    if (!email || !otp || !token) {
      return NextResponse.json({ error: 'Email, OTP, and token are required' }, { status: 400 });
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Check if token is for email verification and matches email
    if (decoded.type !== 'email_verification' || decoded.email !== email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Verify OTP by hashing and comparing with stored hash
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashedOTP !== decoded.otp) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Generate verification token for signup completion
    const verificationToken = jwt.sign(
      { email, verified: true, type: 'signup_verified' },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      verificationToken,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 });
  }
}
