import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, apiRateLimiter } from '@/lib/rate-limit';
import { validateForm, leadCaptureSchema } from '@/lib/validations';
import { sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import logger from '@/lib/logger';

// Lead capture form API endpoint for Performance Marketing campaigns
// Validates with Zod, rate-limits, sanitizes inputs

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimit = apiRateLimiter.check(identifier);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: apiRateLimiter.getHeaders(rateLimit),
        }
      );
    }

    const body = await request.json();

    // Sanitize inputs
    if (body.email) body.email = sanitizeEmail(body.email);
    if (body.phone) body.phone = sanitizePhone(body.phone);

    // Validate with Zod
    const validation = validateForm(leadCaptureSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: (validation as { success: false; error: string }).error },
        { status: 400 }
      );
    }

    // Extract validated data
    const { name, email, phone, city, investmentInterest, message } = validation.data;

    // Log submission
    logger.info('Lead capture submission:', {
      name,
      email,
      phone,
      city,
      investmentInterest,
      source: 'performance-marketing',
    });

    console.log('Lead capture:', { name, email, phone, city, investmentInterest, message });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! Our team will contact you shortly.',
    });
  } catch (error) {
    logger.error('Error processing lead capture form:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
