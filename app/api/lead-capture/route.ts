import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, apiRateLimiter } from '@/lib/rate-limit';
import { validateForm, leadCaptureSchema } from '@/lib/validations';
import { sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import logger from '@/lib/logger';
import { sendLeadNotification } from '@/lib/email';
import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// Lead capture form API endpoint for Performance Marketing campaigns
// Validates with Zod, rate-limits, sanitizes inputs, persists to JSON

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

/** Mask email to domain only (e.g. "john@gmail.com" → "***@gmail.com") */
function maskEmail(email: string): string {
  const parts = email.split('@');
  return parts.length === 2 ? `***@${parts[1]}` : '***';
}

/** Mask phone to last 4 digits (e.g. "+91 98765 43210" → "****3210") */
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `****${digits.slice(-4)}`;
}

/** Generate a non-reversible hash for correlating submissions without exposing PII */
function hashPII(email: string, phone: string): string {
  return createHash('sha256').update(`${email}:${phone}`).digest('hex').slice(0, 12);
}

/** Persist lead to data/leads.json */
async function saveLead(lead: Record<string, unknown>): Promise<void> {
  const dir = path.dirname(LEADS_FILE);
  await fs.mkdir(dir, { recursive: true });

  let existing: Record<string, unknown>[] = [];
  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf-8');
    existing = JSON.parse(raw);
  } catch {
    // File doesn't exist yet — start fresh
  }

  existing.push(lead);
  await fs.writeFile(LEADS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
}

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

    // Log submission with masked PII
    const leadId = hashPII(email, phone);
    logger.info('Lead capture submission:', {
      leadId,
      maskedEmail: maskEmail(email),
      maskedPhone: maskPhone(phone),
      city,
      investmentInterest,
      source: 'performance-marketing',
    });

    // Persist lead data
    try {
      await saveLead({
        leadId,
        name,
        email,
        phone,
        city,
        investmentInterest,
        message: message || '',
        source: 'performance-marketing',
        submittedAt: new Date().toISOString(),
      });
    } catch (persistError) {
      logger.error('Failed to persist lead:', { leadId, error: persistError });
      return NextResponse.json(
        { error: 'Failed to save your enquiry. Please try again.' },
        { status: 500 }
      );
    }

    // Send email notification to franchise team (non-blocking — lead already persisted)
    const submittedAt = new Date().toISOString();
    sendLeadNotification({ name, email, phone, city, investmentInterest, message, submittedAt })
      .then((result) => {
        if (!result.success) {
          logger.error('Lead notification email failed:', { leadId, error: result.error });
        }
      })
      .catch((err) => {
        logger.error('Lead notification email error:', { leadId, error: err });
      });

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
