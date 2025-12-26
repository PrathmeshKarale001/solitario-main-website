# Clerk Authentication Setup

We've switched from NextAuth + Google OAuth to Clerk for a more reliable authentication system.

## Setup Instructions

### 1. Create Clerk Account
1. Go to https://dashboard.clerk.com
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys
From your Clerk dashboard:
1. Go to **API Keys** in the sidebar
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)

### 3. Add Environment Variables

Add these to your `.env.local` file:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/account
```

### 4. Add to Vercel (Production)
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add all the Clerk variables above
4. **Redeploy** your application

### 5. Configure Clerk Dashboard
In your Clerk dashboard:
1. Go to **Paths** settings
2. Set sign-in path: `/auth/login`
3. Set sign-up path: `/auth/signup`
4. Set after sign-in redirect: `/account`
5. Set after sign-up redirect: `/account`

### 6. Enable Social Providers (Optional)
In Clerk dashboard:
1. Go to **User & Authentication** > **Social Connections**
2. Enable Google, Facebook, etc. as needed
3. No additional configuration needed - Clerk handles it!

## Features Enabled

✅ Email/Password authentication
✅ Social login (Google, Facebook, etc.) - optional
✅ Email verification
✅ Password reset
✅ User profile management
✅ Session management
✅ Protected routes
✅ Beautiful pre-built UI components

## Testing

1. Start development server: `npm run dev`
2. Visit http://localhost:3000/auth/login
3. Try signing up with email
4. Try signing in

## Migration Notes

- Old NextAuth sessions will be invalid
- Users need to create new accounts with Clerk
- No Shopify integration in auth flow (cleaner separation)
- Can add Shopify customer creation via webhooks later

## Support

- Clerk Docs: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord
