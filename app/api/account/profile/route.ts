import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  notifications: {
    email: boolean;
    sms: boolean;
    promotions: boolean;
  };
}

// GET - Fetch user profile from Clerk
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    
    // Get profile data from Clerk metadata
    const profileData = user.publicMetadata.profile as UserProfile | undefined;

    return NextResponse.json({
      profile: {
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: profileData?.phone || user.primaryPhoneNumber?.phoneNumber || '',
        birthday: profileData?.birthday || '',
        notifications: profileData?.notifications || {
          email: true,
          sms: false,
          promotions: true,
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT - Update user profile in Clerk
export async function PUT(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, birthday, notifications } = body;

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    // Parse name into first/last
    const nameParts = (name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update Clerk user
    await clerk.users.updateUser(userId, {
      firstName,
      lastName,
      publicMetadata: {
        ...user.publicMetadata,
        profile: {
          phone: phone || '',
          birthday: birthday || '',
          notifications: notifications || {
            email: true,
            sms: false,
            promotions: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
