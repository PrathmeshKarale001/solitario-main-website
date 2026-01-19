import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Debug Auth: Starting...');
    
    // Check environment variables
    console.log('Debug Auth: Checking env vars...');
    console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY exists:', !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    console.log('CLERK_SECRET_KEY exists:', !!process.env.CLERK_SECRET_KEY);
    
    // Try to get auth
    const { userId } = getAuth(request);
    console.log('Debug Auth: userId:', userId);
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'No userId found',
        authHeader: request.headers.get('authorization'),
        cookieHeader: request.headers.get('cookie')
      });
    }
    
    // Try to get Clerk client
    console.log('Debug Auth: Getting Clerk client...');
    const clerk = await clerkClient();
    console.log('Debug Auth: Got Clerk client');
    
    // Try to get user
    console.log('Debug Auth: Getting user...');
    const user = await clerk.users.getUser(userId);
    console.log('Debug Auth: Got user:', user.id);
    
    return NextResponse.json({ 
      success: true,
      userId,
      userEmail: user.primaryEmailAddress?.emailAddress,
      metadata: user.publicMetadata
    });
    
  } catch (error) {
    console.error('Debug Auth Error:', error);
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
