# Solitario Shop Integration Guide

## Overview

This document provides detailed instructions for integrating the Solitario Next.js Shop application with an existing WordPress website. The shop application handles product browsing, cart functionality, and checkout via Shopify.

**Prepared by:** Solitario Development Team  
**Date:** December 2024  
**Version:** 1.0

---

## Table of Contents

1. [Integration Options Overview](#integration-options-overview)
2. [Option 1: Subdomain Approach (Recommended)](#option-1-subdomain-approach-recommended)
3. [Option 2: Reverse Proxy / Path-based Routing](#option-2-reverse-proxy--path-based-routing)
4. [Option 3: Iframe Embedding](#option-3-iframe-embedding)
5. [Post-Integration Checklist](#post-integration-checklist)
6. [Troubleshooting](#troubleshooting)
7. [Contact & Support](#contact--support)

---

## Integration Options Overview

| Option | Complexity | SEO Impact | User Experience | Recommended |
|--------|------------|------------|-----------------|-------------|
| **Subdomain** | Low | Good | Excellent | ✅ Yes |
| **Reverse Proxy** | High | Excellent | Excellent | For advanced setups |
| **Iframe** | Low | Poor | Poor | ❌ Not recommended |

---

## Option 1: Subdomain Approach (Recommended)

### Description

The shop application runs on a subdomain (e.g., `shop.thesolitario.com`) while the main WordPress site remains on the primary domain (`www.thesolitario.com` or `thesolitario.com`).

**Result:**
- WordPress Site: `https://thesolitario.com`
- Shop Application: `https://shop.thesolitario.com`

### Advantages

- ✅ Simple DNS configuration
- ✅ No changes required to WordPress server
- ✅ Independent scaling and deployment
- ✅ SSL certificates can be managed separately
- ✅ No performance impact on WordPress site

### Step-by-Step Implementation

#### Step 1: Deployment (Our Side)

We will deploy the Next.js shop application to one of these platforms:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Custom Server/VPS**

After deployment, we will provide you with:
- Deployment URL (e.g., `solitario-shop.vercel.app`)
- Any required environment configurations

#### Step 2: DNS Configuration (Your Side)

You need to add a DNS record in your domain registrar or DNS management panel.

**For Vercel Deployment:**

```
Type: CNAME
Name: shop
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

**For Netlify Deployment:**

```
Type: CNAME
Name: shop
Value: [your-site-name].netlify.app
TTL: 3600 (or Auto)
```

**For Custom Server Deployment:**

```
Type: A
Name: shop
Value: [Server IP Address]
TTL: 3600 (or Auto)
```

##### DNS Configuration Screenshots Guide

**GoDaddy:**
1. Log in to GoDaddy → My Products → DNS
2. Click "Add" under Records
3. Select Type: CNAME
4. Enter Name: `shop`
5. Enter Value: (provided deployment URL)
6. Save

**Cloudflare:**
1. Log in to Cloudflare → Select Domain → DNS
2. Click "Add Record"
3. Type: CNAME
4. Name: `shop`
5. Target: (provided deployment URL)
6. Proxy Status: DNS Only (gray cloud) initially
7. Save

**Namecheap:**
1. Log in → Domain List → Manage → Advanced DNS
2. Add New Record
3. Type: CNAME
4. Host: `shop`
5. Value: (provided deployment URL)
6. Save

#### Step 3: SSL Certificate Configuration

**If using Vercel/Netlify:**
- SSL is automatically provisioned after DNS propagation (usually 24-48 hours)
- No action required from your side

**If using custom server:**
- We will configure SSL using Let's Encrypt
- Ensure port 443 is accessible

#### Step 4: WordPress Menu Integration

Add the shop link to your WordPress navigation:

**Method 1: Using WordPress Admin**

1. Go to WordPress Admin → Appearance → Menus
2. Click "Custom Links"
3. Enter URL: `https://shop.thesolitario.com/products`
4. Enter Link Text: `Shop` or `Shop Now`
5. Click "Add to Menu"
6. Arrange menu position as needed
7. Save Menu

**Method 2: Using Code (functions.php)**

```php
// Add to your theme's functions.php
function add_shop_menu_item($items, $args) {
    if ($args->theme_location == 'primary') { // Adjust menu location
        $shop_link = '<li class="menu-item"><a href="https://shop.thesolitario.com/products">Shop</a></li>';
        $items = $items . $shop_link;
    }
    return $items;
}
add_filter('wp_nav_menu_items', 'add_shop_menu_item', 10, 2);
```

#### Step 5: Add Shop Buttons/CTAs Throughout WordPress Site

**Example HTML for buttons:**

```html
<!-- Primary CTA Button -->
<a href="https://shop.thesolitario.com/products" 
   class="shop-cta-button"
   target="_blank"
   rel="noopener">
    Shop Now
</a>

<!-- With inline styles -->
<a href="https://shop.thesolitario.com/products" 
   style="display: inline-block; 
          padding: 12px 24px; 
          background-color: #146552; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px;
          font-weight: 600;">
    Explore Collection
</a>
```

**CSS for shop buttons (add to WordPress custom CSS):**

```css
.shop-cta-button {
    display: inline-block;
    padding: 14px 32px;
    background-color: #146552; /* Solitario brand green */
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    transition: all 0.3s ease;
}

.shop-cta-button:hover {
    background-color: #0d4a3b;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 101, 82, 0.3);
}
```

#### Step 6: Verification

After DNS propagation (24-48 hours):

1. Visit `https://shop.thesolitario.com` - should load the shop
2. Test navigation from WordPress to shop
3. Test the complete purchase flow
4. Verify SSL certificate is active (padlock icon)

---

## Option 2: Reverse Proxy / Path-based Routing

### Description

Route specific URL paths from your main domain to the Next.js application:
- `https://thesolitario.com/shop/*` → Next.js Shop App

**Result:** Single domain for everything, shop appears as part of main site.

### Advantages

- ✅ Single domain - better for SEO
- ✅ Seamless user experience
- ✅ Shared cookies/sessions possible

### Disadvantages

- ❌ Requires server-level access
- ❌ More complex configuration
- ❌ May impact WordPress performance
- ❌ Debugging can be challenging

### Requirements

- Root/Admin access to WordPress server
- Nginx or Apache with mod_proxy
- Our Next.js app deployed and accessible

### Implementation for Nginx

If your WordPress runs on Nginx, add this to your server configuration:

**File:** `/etc/nginx/sites-available/thesolitario.com`

```nginx
server {
    listen 443 ssl http2;
    server_name thesolitario.com www.thesolitario.com;

    # SSL Configuration (your existing SSL setup)
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Proxy settings for shop routes
    location /shop {
        proxy_pass https://solitario-shop.vercel.app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Handle Next.js static files
        proxy_set_header X-Forwarded-Host $host;
    }

    # Static assets for shop
    location /_next {
        proxy_pass https://solitario-shop.vercel.app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_valid 200 60m;
    }

    # API routes for shop
    location /api {
        proxy_pass https://solitario-shop.vercel.app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WordPress (existing configuration)
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        # Your existing PHP configuration
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

**After editing, test and reload:**

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Implementation for Apache

If your WordPress runs on Apache, add this to your `.htaccess` or virtual host configuration:

**Option A: .htaccess (if mod_proxy is enabled)**

```apache
# Enable required modules (may need server admin)
# a2enmod proxy proxy_http

<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Proxy shop routes to Next.js app
    RewriteRule ^shop(.*)$ https://solitario-shop.vercel.app/shop$1 [P,L]
    RewriteRule ^_next/(.*)$ https://solitario-shop.vercel.app/_next/$1 [P,L]
    RewriteRule ^api/(.*)$ https://solitario-shop.vercel.app/api/$1 [P,L]
</IfModule>

<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPassReverse /shop https://solitario-shop.vercel.app/shop
    ProxyPassReverse /_next https://solitario-shop.vercel.app/_next
    ProxyPassReverse /api https://solitario-shop.vercel.app/api
</IfModule>
```

**Option B: Virtual Host Configuration**

```apache
<VirtualHost *:443>
    ServerName thesolitario.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # Proxy for shop
    ProxyPreserveHost On
    
    <Location /shop>
        ProxyPass https://solitario-shop.vercel.app/shop
        ProxyPassReverse https://solitario-shop.vercel.app/shop
    </Location>
    
    <Location /_next>
        ProxyPass https://solitario-shop.vercel.app/_next
        ProxyPassReverse https://solitario-shop.vercel.app/_next
    </Location>
    
    <Location /api>
        ProxyPass https://solitario-shop.vercel.app/api
        ProxyPassReverse https://solitario-shop.vercel.app/api
    </Location>
    
    # WordPress DocumentRoot
    DocumentRoot /var/www/html/wordpress
    
    <Directory /var/www/html/wordpress>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Enable required Apache modules:**

```bash
sudo a2enmod proxy proxy_http ssl rewrite
sudo systemctl restart apache2
```

### WordPress Configuration for Path-based

Update WordPress links to use the path-based URLs:

```php
// In functions.php - Define shop base URL
define('SOLITARIO_SHOP_URL', '/shop/products');

// Helper function
function get_shop_url($path = '') {
    return home_url('/shop' . $path);
}
```

**Menu link:** `https://thesolitario.com/shop/products`

---

## Option 3: Iframe Embedding

### ⚠️ Not Recommended

This option is provided for completeness but is **not recommended** due to:
- Poor SEO (search engines can't index iframe content properly)
- Poor user experience (scrolling issues, mobile problems)
- Security concerns (clickjacking vulnerabilities)
- No URL changes (users can't bookmark/share specific products)

### If You Must Use Iframe

**WordPress Page Template:**

Create a new page in WordPress and add this HTML:

```html
<div class="solitario-shop-container">
    <iframe 
        src="https://shop.thesolitario.com/products"
        width="100%"
        height="800px"
        frameborder="0"
        scrolling="auto"
        title="Solitario Shop"
        allow="payment"
        loading="lazy">
        <p>Your browser does not support iframes. 
           <a href="https://shop.thesolitario.com/products">Click here to visit our shop</a>
        </p>
    </iframe>
</div>

<style>
.solitario-shop-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 0;
}

.solitario-shop-container iframe {
    border: none;
    min-height: 100vh;
}

/* Responsive */
@media (max-width: 768px) {
    .solitario-shop-container iframe {
        height: 100vh;
    }
}
</style>
```

**Required: Allow Iframe Embedding (Our Side)**

We need to configure our app to allow embedding. We will add your domain to our allowed origins:

```javascript
// next.config.js - We will configure this
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://thesolitario.com'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://thesolitario.com https://www.thesolitario.com"
          }
        ]
      }
    ]
  }
}
```

---

## Post-Integration Checklist

### Functionality Testing

- [ ] Shop page loads correctly
- [ ] Product images display properly
- [ ] Product filtering works
- [ ] Search functionality works
- [ ] Add to cart works
- [ ] Cart sidebar opens/closes
- [ ] Checkout redirects to Shopify correctly
- [ ] Mobile responsiveness is intact

### Cross-Domain Testing

- [ ] Navigation from WordPress to Shop works
- [ ] Back button behavior is correct
- [ ] Cookies/sessions work as expected
- [ ] No mixed content warnings (HTTP/HTTPS)

### SEO Verification

- [ ] Shop pages are indexable (for subdomain/proxy options)
- [ ] Meta tags are present
- [ ] Canonical URLs are correct
- [ ] Sitemap includes shop pages (if applicable)

### Performance Testing

- [ ] Page load time is acceptable (<3 seconds)
- [ ] Images are optimized
- [ ] No console errors

---

## Troubleshooting

### DNS Not Propagating

**Symptoms:** Subdomain not resolving after 48 hours

**Solutions:**
1. Verify DNS record is correct using: `dig shop.thesolitario.com`
2. Clear local DNS cache: 
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`
3. Check with online tools: https://dnschecker.org

### SSL Certificate Errors

**Symptoms:** Browser shows "Not Secure" warning

**Solutions:**
1. Wait for SSL provisioning (can take up to 24 hours)
2. Verify domain ownership is complete
3. For Vercel: Check domain settings in dashboard
4. For custom server: Verify Let's Encrypt renewal

### CORS Errors

**Symptoms:** Console shows "Access-Control-Allow-Origin" errors

**Solutions:**
1. Contact us - we need to add your domain to allowed origins
2. Verify you're using HTTPS on both sites

### Proxy Not Working

**Symptoms:** 502 Bad Gateway or timeout errors

**Solutions:**
1. Verify our deployment is accessible directly
2. Check proxy configuration syntax
3. Verify required modules are enabled
4. Check server error logs:
   - Nginx: `/var/log/nginx/error.log`
   - Apache: `/var/log/apache2/error.log`

### Styling Issues

**Symptoms:** Shop looks broken or unstyled

**Solutions:**
1. Verify `/_next/static` routes are proxied correctly
2. Check for CSS blocking in browser console
3. Verify no conflicting WordPress CSS

---

## Contact & Support

### For Integration Issues

**Development Team Contact:**
- Email: [Your Email]
- Phone: [Your Phone]

### Information We Need for Support

1. Which integration option you chose
2. Your hosting provider
3. Server type (Nginx/Apache/Other)
4. Screenshot of any errors
5. Browser console logs (F12 → Console)
6. Server error logs if available

### Response Time

- Critical Issues: Within 4 hours
- General Questions: Within 24 hours

---

## Appendix

### A. Useful Commands

```bash
# Check DNS propagation
dig shop.thesolitario.com

# Test SSL certificate
openssl s_client -connect shop.thesolitario.com:443

# Test if site is accessible
curl -I https://shop.thesolitario.com

# Check Nginx configuration
sudo nginx -t

# Check Apache configuration
sudo apachectl configtest
```

### B. Important URLs

| Description | URL |
|-------------|-----|
| Shop Home | `https://shop.thesolitario.com/products` |
| Product Page | `https://shop.thesolitario.com/products/[product-id]` |
| Cart | Sidebar on shop pages |
| Checkout | Redirects to Shopify |

### C. Brand Colors (for consistent styling)

```css
:root {
    --solitario-green: #146552;
    --solitario-green-dark: #0d4a3b;
    --solitario-gold: #ac884b;
    --solitario-ivory: #FAF5EF;
    --solitario-white: #FFFFFF;
}
```

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Next Review:** As needed based on integration progress
