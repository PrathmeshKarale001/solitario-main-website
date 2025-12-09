# Quick Deployment Guide - Temporary Setup

## Deploy to Vercel (5 minutes)

### Step 1: Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

Run this from the project root:

```bash
cd /Users/prathmeshkarale/Developer/SolitarioWebsite
vercel --prod
```

**During deployment, answer:**
- Set up and deploy? `Y`
- Which scope? Select your account
- Link to existing project? `N` (for new) or `Y` (if already exists)
- Project name: `solitario-shop` (or your preference)
- Directory: `./` (current directory)
- Override settings? `N`

### Step 4: Note the Deployment URL

After deployment completes, you'll get a URL like:
```
https://solitario-shop.vercel.app
```

Or if you have a custom domain configured:
```
https://solitario-eod.vercel.app
```

---

## Environment Variables on Vercel

If this is a new project, add these environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project → Settings → Environment Variables
3. Add these:

| Variable | Value |
|----------|-------|
| `SHOPIFY_STORE_DOMAIN` | `solitarioind` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | `0129488e0dd3478d62582972320de2ca` |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | `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` |
| `NEXTAUTH_URL` | `https://your-deployment-url.vercel.app` |
| `NEXTAUTH_SECRET` | `Tiz4cGy1jwTxmuu6vb2gf8ue1kndTRbsckKpLy5FdYw=` |
| `GOOGLE_CLIENT_ID` | `582285322370-t4m0bej30artfvvinf6cqcv2h8baprcj.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `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` |
| `USE_SHOPIFY_PRODUCTS` | `true` |
| `USE_SHOPIFY_CART` | `true` |

---

## Share with WordPress Developer

Once deployed, share this information:

### For Subdomain Setup (shop.thesolitario.com)

**DNS Record to Add:**
```
Type: CNAME
Name: shop
Value: cname.vercel-dns.com
TTL: 3600
```

**Shop URL:** `https://shop.thesolitario.com/products`

### For Direct Link (Temporary)

If DNS isn't ready yet, they can directly link to:
```
https://solitario-shop.vercel.app/products
```

---

## Verify Deployment

After deploying, test these URLs:

1. **Home:** https://your-url.vercel.app
2. **Products:** https://your-url.vercel.app/products
3. **Product Detail:** https://your-url.vercel.app/products/[any-product-id]

---

## Redeploy After Changes

```bash
vercel --prod
```

Or push to connected Git repository for automatic deployment.
