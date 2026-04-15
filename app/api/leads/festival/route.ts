import { NextRequest, NextResponse } from 'next/server';
import { FestivalLeadRepository } from '@/lib/db/storage';
import { sendFestivalLeadNotification } from '@/lib/email';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  city: z.string().min(2, 'City is required'),
  campaign_id: z.string().default('akshaya-tritiya-2024'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = leadSchema.parse(body);

    // Save to database
    const lead = FestivalLeadRepository.create({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      city: validatedData.city,
      campaign_id: validatedData.campaign_id,
    });

    // Send email notification
    await sendFestivalLeadNotification({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      city: lead.city,
      campaignId: lead.campaign_id,
      submittedAt: lead.created_at,
    });

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
      id: lead.id,
    });
  } catch (error) {
    console.error('Lead capture error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
