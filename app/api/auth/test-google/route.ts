import { NextResponse } from 'next/server';
import GoogleProvider from 'next-auth/providers/google';

export async function GET() {
  try {
    // Test if Google Provider can be initialized
    const googleProvider = GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    });

    const config = googleProvider.options;
    
    return NextResponse.json({
      status: 'ok',
      googleProvider: {
        clientId: config.clientId ? 'SET' : 'NOT_SET',
        clientSecret: config.clientSecret ? 'SET' : 'NOT_SET',
        clientIdLength: config.clientId?.length || 0,
        clientSecretLength: config.clientSecret?.length || 0,
      },
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
