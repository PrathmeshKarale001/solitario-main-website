# Solitario Bulk Product Upload

This script uploads products from the Excel spreadsheet to Shopify.

## Setup

```bash
# Install dependencies
cd scripts/bulk-upload
npm install
```

## Usage

### Dry Run (Preview without uploading)
```bash
npx ts-node upload-products.ts --dry-run
```

### Upload All Products
```bash
npx ts-node upload-products.ts
```

### Upload with Limits
```bash
# Upload first 5 products only
npx ts-node upload-products.ts --limit=5

# Start from product 10, upload 5
npx ts-node upload-products.ts --start=10 --limit=5
```

## Data Mapping

| Spreadsheet Column | Shopify Field |
|-------------------|---------------|
| Product Name | title |
| Description (long) | body_html |
| Category | product_type |
| Tag Price | variants[0].price |
| Style No. | variants[0].sku |
| Total Weight (Grams) | variants[0].weight |
| Jewel Code | Used to find image folder |

### Tags Generated From:
- Category
- Subcategory  
- Gender
- Occasion Type
- Colour
- Metal Type

### Metafields Created:
- `custom.jewel_code`
- `custom.style_number`
- `custom.subcategory`
- `custom.occasion`
- `custom.gender`
- `specifications.metal_type`
- `specifications.metal_color`
- `specifications.diamond_count`
- `specifications.diamond_weight`
- `specifications.color_stone_weight`

## Image Handling

Images are loaded from folders named by Jewel Code:
```
Slot 1 Vermeil Renders OG/
├── AN2481/
│   ├── ANVPD0564_A.jpg
│   ├── ANVPD0564_B.jpg
│   └── ANVPD0564_C.jpg
├── AN2482/
│   └── ...
```

Images are uploaded as base64 attachments to Shopify.

## Troubleshooting

### Rate Limiting
The script includes a 600ms delay between uploads to respect Shopify's rate limits (2 req/sec).

### Missing Images
Products with missing image folders will still be created, but without images.

### Failed Uploads
Check the error summary at the end. Common issues:
- Invalid price format
- Missing required fields
- API token permissions
