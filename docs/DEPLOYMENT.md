# Deployment Guide - Solitario Website

## 🚀 Recommended: Vercel (Best for Next.js)

### Why Vercel?
- ✅ Made by Next.js creators
- ✅ Zero configuration needed
- ✅ Free tier with generous limits
- ✅ Automatic deployments from Git
- ✅ Global CDN for fast loading
- ✅ Preview deployments for branches
- ✅ Easy custom domain setup

### Step-by-Step Deployment

#### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**
   ```bash
   # If you haven't initialized git yet
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/solitario-website.git
   git push -u origin main
   ```

2. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" and use your GitHub account

3. **Import your project**
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at `your-project.vercel.app`

#### Option 2: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name? **solitario-website** (or your choice)
   - Directory? **./** (current directory)
   - Override settings? **No**

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### After Deployment

Your site will be live at:
- **Preview URL**: `https://solitario-website-xxxxx.vercel.app`
- **Production URL**: `https://solitario-website.vercel.app` (after first production deploy)

### Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

---

## 🌐 Alternative Options

### Netlify (Also Great for Next.js)

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy"

**Note**: Netlify requires a `netlify.toml` file for Next.js. Create one:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Railway (Simple Alternative)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Railway auto-detects Next.js and deploys

### Render (Another Option)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Click "Create Web Service"

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Your code is pushed to GitHub/GitLab/Bitbucket
- [ ] `package.json` has correct build scripts
- [ ] No sensitive data in code (use environment variables)
- [ ] `.gitignore` includes `node_modules`, `.next`, etc.
- [ ] Test build locally: `npm run build`
- [ ] Test production build: `npm start`

---

## 🔧 Environment Variables (If Needed)

If you need environment variables:

1. Go to your Vercel project settings
2. Click "Environment Variables"
3. Add your variables
4. Redeploy

---

## 🎯 Quick Deploy Commands

```bash
# Test build locally first
npm run build
npm start

# Deploy to Vercel (if using CLI)
vercel

# Deploy to production
vercel --prod
```

---

## 📊 Free Tier Limits

### Vercel Free Tier:
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ✅ Preview deployments
- ✅ Custom domains
- ✅ Edge functions

### Netlify Free Tier:
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic SSL
- ✅ Custom domains

---

## 🆘 Troubleshooting

### Build Fails?
- Check build logs in Vercel dashboard
- Test locally: `npm run build`
- Ensure all dependencies are in `package.json`

### Images Not Loading?
- Check image paths (use `/images/...` not `./images/...`)
- Ensure images are in `public/` folder

### Fonts Not Loading?
- Check font paths in `app/layout.tsx`
- Ensure fonts are in `public/fonts/` or using Google Fonts

---

## 🎉 Success!

Once deployed, share your live URL with your client:
- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-project.netlify.app`
- **Railway**: `https://your-project.up.railway.app`

---

**Recommended for this project: Vercel** ⭐

It's the easiest, fastest, and best optimized for Next.js!

