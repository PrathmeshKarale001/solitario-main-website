#!/usr/bin/env node
/**
 * Upload static home hero images to Shopify Home hero metaobject entries.
 * Uses fileCreate with public image URLs (no stagedUploadsCreate scope needed).
 *
 * Run from project root: node scripts/upload-static-heroes-to-metaobjects.js
 * Options: --no-image (create entries without images; add in Admin)
 *          --debug (log which step fails and full error details)
 *
 * Requires in .env.local:
 *   SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN
 *   SITE_URL (optional, e.g. https://thesolitario.com - where images are publicly reachable)
 *
 * Shopify Admin API scopes: write_files, write_metaobjects
 */

require('dotenv').config({ path: '.env.local' });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SITE_URL = (process.env.SITE_URL || process.env.NEXTAUTH_URL || 'https://www.thesolitario.com').replace(/\/$/, '');
const API_VERSION = '2024-01';
const GRAPHQL_URL = `https://${SHOPIFY_DOMAIN}.myshopify.com/admin/api/${API_VERSION}/graphql.json`;

// Use --no-image to only create metaobject entries (add images manually in Shopify Admin)
const NO_IMAGE = process.argv.includes('--no-image');
// Use --debug to log which API step fails and full error payload
const DEBUG = process.argv.includes('--debug');

// Static heroes – desktop + mobile images at SITE_URL/images/home-hero/
// If Home hero definition has no "Mobile Background Image" field, add it in Shopify Admin (file_reference, optional).
const STATIC_HEROES = [
  { desktop: 'Home_Herofeb 1171277230.webp', mobile: 'Mobile_Banner_1.webp', order: 1, ctaText: 'Shop Now', ctaLink: '/products' },
  { desktop: 'Home_Herofeb 1171277231.webp', mobile: 'Mobile_Banner_2.webp', order: 2, ctaText: 'Shop Now', ctaLink: '/products' },
  { desktop: 'Home_Herofeb 1171277232.webp', mobile: 'Mobile_Banner_3.webp', order: 3, ctaText: 'Shop Now', ctaLink: '/products' },
  { desktop: 'Home_Herofeb 1171277233.webp', mobile: 'Mobile_Banner_4.webp', order: 4, ctaText: 'Shop Now', ctaLink: '/products' },
];

// Full URL for CTA – Shopify metaobject url field "Value must be a valid link" = field index 3 (cta_link)
function fullCtaLink(path) {
  if (!path || typeof path !== 'string') return '';
  const trimmed = path.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const base = SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`;
  try {
    const url = new URL(trimmed.startsWith('/') ? trimmed : `/${trimmed}`, base);
    return url.href;
  } catch {
    return `${base}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
  }
}

async function graphql(query, variables = {}, step = '') {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (DEBUG && step) {
    console.error(`    [debug] ${step} response:`, JSON.stringify(json).slice(0, 500));
  }
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fileCreateFromUrl(imageUrl, alt, filename) {
  const data = await graphql(
    `mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files { id fileStatus }
        userErrors { message field }
      }
    }`,
    {
      files: [{
        contentType: 'IMAGE',
        originalSource: imageUrl,
        alt: alt || 'Home hero',
        ...(filename && { filename }),
      }],
    },
    'fileCreate'
  );
  const errs = data?.fileCreate?.userErrors;
  if (errs?.length) {
    if (DEBUG) console.error('    [debug] fileCreate userErrors:', errs);
    throw new Error(errs.map(e => (e.field ? `[${e.field}] ` : '') + e.message).join('; '));
  }
  const file = data?.fileCreate?.files?.[0];
  if (!file?.id) throw new Error('File create returned no id');
  return file.id;
}

async function metaobjectCreate(handle, fields) {
  const data = await graphql(
    `mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject { id handle }
        userErrors { message field }
      }
    }`,
    {
      metaobject: {
        type: 'home_hero',
        handle,
        fields: Object.entries(fields).map(([key, value]) => ({
          key,
          value: typeof value === 'boolean' ? String(value) : (value == null ? '' : String(value)),
        })),
      },
    },
    'metaobjectCreate'
  );
  const errs = data?.metaobjectCreate?.userErrors;
  if (errs?.length) {
    if (DEBUG) console.error('    [debug] metaobjectCreate userErrors:', errs);
    throw new Error(errs.map(e => (e.field ? `[${e.field}] ` : '') + e.message).join('; '));
  }
  return data?.metaobjectCreate?.metaobject;
}

async function main() {
  if (!SHOPIFY_DOMAIN || !ADMIN_TOKEN) {
    console.error('Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local');
    process.exit(1);
  }

  console.log('Uploading static home hero images to Shopify metaobjects...');
  console.log(`Using image base URL: ${SITE_URL}/images/home-hero/\n`);

  if (NO_IMAGE) {
    console.log('Mode: --no-image (creating entries without images; add images in Shopify Admin)\n');
  }

  for (const hero of STATIC_HEROES) {
    const handle = `home-hero-static-${hero.order}`;
    // Prefer .jpg URL – Shopify fileCreate often accepts JPEG/PNG from external URLs; webp can fail "valid link"
    const desktopJpg = hero.desktop.replace(/\.webp$/i, '.jpg');
    const imagePath = `/images/home-hero/${hero.desktop.replace(/ /g, '%20')}`;
    const imagePathJpg = `/images/home-hero/${desktopJpg.replace(/ /g, '%20')}`;
    const imageUrl = `${SITE_URL}${imagePath}`;
    const imageUrlJpg = `${SITE_URL}${imagePathJpg}`;

    try {
      console.log(`[${hero.order}] ${hero.desktop} (+ mobile: ${hero.mobile}) -> ${handle}`);

      let fileId = null;
      let mobileFileId = null;
      if (!NO_IMAGE) {
        try {
          if (DEBUG) console.error(`    [debug] fileCreate desktop: ${imageUrl}`);
          fileId = await fileCreateFromUrl(imageUrl, `Home hero ${hero.order} desktop`, hero.desktop);
        } catch (fileErr1) {
          if (DEBUG) console.error(`    [debug] fileCreate (.webp) failed, trying .jpg: ${imageUrlJpg}`);
          try {
            fileId = await fileCreateFromUrl(imageUrlJpg, `Home hero ${hero.order} desktop`, desktopJpg);
          } catch (fileErr2) {
            console.error(`    fileCreate (desktop) failed: ${fileErr1.message}`);
            console.error(`    Tried: ${imageUrl}`);
            console.error(`    And:  ${imageUrlJpg}`);
            console.error('    Run with --no-image to create entries without images, then add images in Shopify Admin.');
            if (!DEBUG) console.error('    Run with --debug for full error details.\n');
            continue;
          }
        }
        // Upload mobile viewport image
        const mobilePath = `/images/home-hero/${hero.mobile.replace(/ /g, '%20')}`;
        const mobileUrl = `${SITE_URL}${mobilePath}`;
        const mobileJpg = hero.mobile.replace(/\.webp$/i, '.jpg');
        const mobilePathJpg = `/images/home-hero/${mobileJpg.replace(/ /g, '%20')}`;
        const mobileUrlJpg = `${SITE_URL}${mobilePathJpg}`;
        try {
          if (DEBUG) console.error(`    [debug] fileCreate mobile: ${mobileUrl}`);
          mobileFileId = await fileCreateFromUrl(mobileUrl, `Home hero ${hero.order} mobile`, hero.mobile);
        } catch (mobileErr1) {
          try {
            mobileFileId = await fileCreateFromUrl(mobileUrlJpg, `Home hero ${hero.order} mobile`, mobileJpg);
          } catch {
            console.error(`    [warn] mobile image skipped (${hero.mobile}): ${mobileErr1.message}`);
          }
        }
      }

      const ctaLinkValue = fullCtaLink(hero.ctaLink);
      const fields = {
        title: `Static Hero ${hero.order}`,
        media_type: 'image',
        cta_text: hero.ctaText,
        is_active: true,
        display_order: hero.order,
      };
      if (fileId) fields.background_image = fileId;
      if (mobileFileId) fields.mobile_background_image = mobileFileId;
      // Shopify url field requires a valid link; only include if we have a proper https URL
      if (ctaLinkValue && ctaLinkValue.startsWith('https://')) {
        fields.cta_link = ctaLinkValue;
      }

      let meta = null;
      try {
        meta = await metaobjectCreate(handle, fields);
      } catch (metaErr) {
        if (metaErr.message.includes('valid link') && fields.cta_link) {
          if (DEBUG) console.error('    [debug] retry without cta_link (add it in Shopify Admin)');
          delete fields.cta_link;
          meta = await metaobjectCreate(handle, fields);
        } else {
          throw metaErr;
        }
      }

      console.log(`    -> metaobject ${meta?.handle} id ${meta?.id}\n`);
    } catch (e) {
      console.error(`    Error: ${e.message}\n`);
    }
  }

  console.log('Done. Check Shopify Admin → Content → Metaobjects → Home hero.');
  if (NO_IMAGE) console.log('Add Background Image to each entry in Shopify Admin.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
