# Fix for Client Component Route Config Error

## Problem
Getting error: `Invalid revalidate value "function() {...}" on "/account/addresses", must be a non-negative number or false`

## Root Cause
In Next.js 16 (and all versions), **route segment config exports are NOT valid in client components**:
- `export const dynamic = 'force-dynamic'`
- `export const revalidate = 0`
- `export const dynamicParams = true`

These exports only work in Server Components (files without `'use client'`).

## Solution Applied
Removed all route segment config exports from client components:

### Fixed Files:
1. `/app/(public)/account/addresses/page.tsx`
2. `/app/(public)/account/page.tsx`
3. `/app/(public)/warner-bros/page.tsx` (kept as Server Component with config)

## Why This Works
- Client components are always rendered dynamically on the client side
- They don't need `dynamic = 'force-dynamic'` because they're never statically generated
- The Suspense boundary wrapping handles the SSR issue with `useSearchParams`

## Alternative Approaches (if needed)

### 1. Split into Server + Client Component
```typescript
// page.tsx (Server Component)
import { Suspense } from 'react';
import AddressesPageContent from './AddressesPageContent';

export const dynamic = 'force-dynamic';

export default function AddressesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddressesPageContent />
    </Suspense>
  );
}

// AddressesPageContent.tsx (Client Component)
'use client';
// All your component logic here
```

### 2. Import Dynamic-Forcing Functions
```typescript
'use client';

import { cookies } from 'next/headers'; // Forces dynamic rendering

// No need for route config exports
```

## Current Status
✅ All client component route config exports removed
✅ Error should be resolved
✅ Pages will still render dynamically due to client-side nature

## Testing
1. Run `npm run dev`
2. Visit `/account/addresses`
3. Should load without the revalidate error
4. All functionality should work as expected

---

**Note**: The warner-bros page remains a Server Component with route config because it doesn't need `'use client'` for its core functionality.
