# Brand Fonts Setup

This directory should contain your brand font files.

## Required Font Files

### Aguila Font
Place the following Aguila font files here:
- `Aguila-Regular.woff2` (weight: 400)
- `Aguila-Medium.woff2` (weight: 500) - optional
- `Aguila-Bold.woff2` (weight: 700) - optional

### Didot LP Font
Place the following Didot LP font files here:
- `Didot-LP-Regular.woff2` (weight: 400)
- `Didot-LP-Medium.woff2` (weight: 500) - optional
- `Didot-LP-Bold.woff2` (weight: 700) - optional

### Gotham Font (Optional)
If you have Gotham font files, place them here and update `app/layout.tsx` to use localFont instead of Inter.

## Font File Formats

Preferred format: `.woff2` (most efficient)
Alternative formats: `.woff`, `.ttf`, `.otf`

If you have different file names or formats, update the font paths in `app/layout.tsx`.

## After Adding Fonts

1. Place your font files in this directory
2. Ensure file names match exactly (case-sensitive)
3. Restart your development server
4. The fonts will automatically load

## Note

If font files are not found, the system will fall back to serif fonts. Make sure to add your brand font files to enable the proper typography.

