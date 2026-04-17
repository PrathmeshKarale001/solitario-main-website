import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier } from '@/lib/rate-limit';
import fs from 'fs/promises';
import path from 'path';
import logger from '@/lib/logger';

const TRACKING_FILE = path.join(process.cwd(), 'data', 'akshaya-tnc-logs.jsonl');

export async function POST(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString();
    const identifier = getClientIdentifier(request);
    
    // Ensure directory exists
    const dir = path.dirname(TRACKING_FILE);
    await fs.mkdir(dir, { recursive: true });

    // Create entry as a single line (JSONL format)
    const entry = JSON.stringify({
      timestamp,
      identifier: identifier.substring(0, 12),
      event: 'AKSHAYA_TNC_ACCEPTED'
    }) + '\n';

    // Append atomically to the end of the file
    await fs.appendFile(TRACKING_FILE, entry, 'utf-8');
    
    logger.info('T&C tick tracked (append-only)');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
