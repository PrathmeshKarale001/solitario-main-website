import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, apiRateLimiter } from '@/lib/rate-limit';
import { validateForm, contactSchema } from '@/lib/validations';
import { sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import logger from '@/lib/logger';

// Contact form API endpoint with validation and rate limiting
// Demonstrates practical use of Zod validation

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
          headers: apiRateLimiter.getHeaders(rateLimit)
        }
      );
    }

    const body = await request.json();
    
    // Sanitize inputs
    if (body.email) body.email = sanitizeEmail(body.email);
    if (body.phone) body.phone = sanitizePhone(body.phone);
    
    // Validate with Zod
    const validation = validateForm(contactSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Extract validated data
    const contactData = validation.data;
    const { name, email, phone, subject, message } = contactData;

    // TODO: Send email using Resend or save to database
    logger.info('Contact form submission:', { name, email, subject });

    // For now, just log it
    console.log('Contact form:', { name, email, phone, subject, message });

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
    });
  } catch (error) {
    logger.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
