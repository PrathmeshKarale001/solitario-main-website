import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('[TEST] Test endpoint called');
  return NextResponse.json({ 
    status: 'working',
    timestamp: new Date().toISOString(),
    message: 'If you see this, the deployment is working'
  });
}
