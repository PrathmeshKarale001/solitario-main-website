import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier } from '@/lib/rate-limit';
import fs from 'fs/promises';
import path from 'path';
import logger from '@/lib/logger';

const TRACKING_FILE = path.join(process.cwd(), 'data', 'akshaya-tnc-logs.json');

export async function POST(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString();
    const identifier = getClientIdentifier(request);
    
    // Ensure directory exists
    const dir = path.dirname(TRACKING_FILE);
    await fs.mkdir(dir, { recursive: true });

    let existing: any[] = [];
    try {
      const raw = await fs.readFile(TRACKING_FILE, 'utf-8');
      existing = JSON.parse(raw);
    } catch {
      // Start fresh
    }

    // Add new entry (minimal info to avoid PII)
    existing.push({
      timestamp,
      identifier: identifier.substring(0, 12), // Masked identifier for counting unique users
      event: 'AKSHAYA_TNC_ACCEPTED'
    });

    await fs.writeFile(TRACKING_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    
    logger.info('T&C tick tracked');

    return NextResponse.json({ success: true, count: existing.length });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
