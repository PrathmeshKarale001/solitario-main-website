#!/usr/bin/env node
/**
 * Upload static home hero images to Shopify Home hero metaobject entries.
 * Uses fileCreate with public image URLs (no stagedUploadsCreate scope needed).
 *
 * Run from project root: node scripts/upload-static-heroes-to-metaobjects.js
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

// Static heroes – images must be reachable at SITE_URL + /images/home-hero/ + filename
const STATIC_HEROES = [
  { desktop: 'Home_Herofeb 1171277230.webp', mobile: 'Mobile_Banner_1.webp', order: 1, ctaText: 'Shop Now', ctaLink: '/products' },
  { desktop: 'Home_Herofeb 1171277231.webp', mobile: 'Mobile_Banner_2.webp', order: 2, ctaText: 'Shop Now', ctaLink: '/products' },
  { desktop: 'Home_Herofeb 1171277232.webp', mobile: 'Mobile_Banner_3.webp', order: 3, ctaText: 'Shop Now', ctaLink: '/products' },
  { desktop: 'Home_Herofeb 1171277233.webp', mobile: 'Mobile_Banner_4.webp', order: 4, ctaText: 'Shop Now', ctaLink: '/products' },
];

// Full URL for CTA (metaobject url field often requires absolute URL)
function fullCtaLink(path) {
  if (!path || path.startsWith('http')) return path || '';
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function graphql(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fileCreateFromUrl(imageUrl, alt, filename) {
  const data = await graphql(
    `mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files { id fileStatus }
        userErrors { message }
      }
    }`,
    {
      files: [{
        contentType: 'IMAGE',
        originalSource: imageUrl,
        alt: alt || 'Home hero',
        ...(filename && { filename }),
      }],
    }
  );
  const errs = data?.fileCreate?.userErrors;
  if (errs?.length) throw new Error(errs.map(e => e.message).join('; '));
  const file = data?.fileCreate?.files?.[0];
  if (!file?.id) throw new Error('File create returned no id');
  return file.id;
}

async function metaobjectCreate(handle, fields) {
  const data = await graphql(
    `mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject { id handle }
        userErrors { message }
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
    }
  );
  const errs = data?.metaobjectCreate?.userErrors;
  if (errs?.length) throw new Error(errs.map(e => e.message).join('; '));
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
    // Build image URL: path with space encoded as %20 (Shopify expects a valid link)
    const imagePath = `/images/home-hero/${hero.desktop.replace(/ /g, '%20')}`;
    const imageUrl = `${SITE_URL}${imagePath}`;

    try {
      console.log(`[${hero.order}] ${hero.desktop} -> ${handle}`);

      let fileId = null;
      if (!NO_IMAGE) {
        try {
          fileId = await fileCreateFromUrl(imageUrl, `Home hero ${hero.order}`, hero.desktop);
        } catch (fileErr) {
          console.error(`    fileCreate failed: ${fileErr.message}`);
          console.error(`    Image URL used: ${imageUrl}`);
          console.error('    Run with --no-image to create entries without images, then add images in Shopify Admin.\n');
          continue;
        }
      }

      const fields = {
        title: `Static Hero ${hero.order}`,
        media_type: 'image',
        cta_text: hero.ctaText,
        cta_link: fullCtaLink(hero.ctaLink),
        is_active: true,
        display_order: hero.order,
      };
      if (fileId) fields.background_image = fileId;

      const meta = await metaobjectCreate(handle, fields);

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
