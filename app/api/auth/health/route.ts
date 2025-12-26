import { NextResponse } from 'next/server';

export async function GET() {
  const env = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json({
    status: 'ok',
    environment: env,
    timestamp: new Date().toISOString(),
  });
}
