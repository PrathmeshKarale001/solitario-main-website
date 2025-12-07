# Solitario Brand Design System

## Brand Fonts

| Font | Usage | Weights |
|------|-------|--------|
| **Aguila** | Display headlines (H1, H2), hero text | 400, 500, 700 |
| **Didot LP** | Subheadings (H3), elegant accents | 400, 500, 700 |
| **Gotham** | UI elements, buttons, labels, navigation | 400, 500, 600, 700 |
| **Montserrat** | Body text, paragraphs, descriptions | 300-900 |

---

## Brand Motif Pattern

The brand motif is a sophisticated geometric chevron/diamond pattern in Copper Rose (`#c39275`) on a dark background (`#1a1714`). Use sparingly for:
- Section dividers
- Hero backgrounds (with overlay)
- Card accents
- Footer decoration

**SVG Pattern:** `/public/patterns/brand-motif.svg`

```css
/* Usage in CSS */
.brand-pattern {
  background-image: url('/patterns/brand-motif.svg');
  background-repeat: repeat;
  background-size: 120px 120px;
}
```

---

## Color Palette

### Primary Colors
| Name | Hex | Pantone | Usage |
|------|-----|---------|-------|
| **Dark Teal Green** | `#146552` | 560 C | Rich base color, headers, primary buttons |
| **Classic Bronze** | `#ac884b` | P 12-6 C | Golden highlights, CTAs, accents |
| **Copper Rose** | `#c39275` | P 42-2 C | Subtle warm accents, hover states |
| **Ivory Pearl** | `#f8eee7` | 75-9 C | Light backgrounds, neutral base |

### Secondary / Accent Colors
| Name | Hex | Pantone | Usage |
|------|-----|---------|-------|
| **Teal** | `#107571` | Green | CTAs, hover states, icons, links |
| **Teal Dark** | `#0d5f5c` | - | Hover states for teal elements |
| **Teal Light** | `#1a9994` | - | Light accents, highlights |

### Brand Neutrals (replaces gray-*)
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-50` | `#faf8f6` | Lightest backgrounds |
| `brand-100` | `#f5f0eb` | Alt backgrounds, cards |
| `brand-200` | `#e8dfd6` | Borders, dividers |
| `brand-300` | `#d4c4b5` | Disabled text, subtle borders |
| `brand-400` | `#b8a08a` | Placeholder text |
| `brand-500` | `#8c7560` | Secondary text |
| `brand-600` | `#6b5a4a` | Body text |
| `brand-700` | `#4a3f35` | Headings, emphasis |
| `brand-800` | `#2d2620` | Primary text |
| `brand-900` | `#1a1714` | Maximum emphasis |

### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| `success` | `#146552` | Success states (uses classic-green) |
| `error` | `#a84432` | Error states (warm terracotta) |
| `warning` | `#ac884b` | Warning states (uses bronze-gold) |
| `info` | `#107571` | Info states (uses teal) |

---

## Typography

### Font Families
1. **Aguila** - Display headlines (H1, H2)
2. **Didot LP** - Subheadings (H3)
3. **Montserrat** - Body text, paragraphs
4. **Gotham** - UI elements, buttons, labels

### Type Scale
| Class | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `text-display-xl` | 5rem | 0.9 | -0.03em | Hero headlines |
| `text-display-lg` | 4rem | 0.95 | -0.02em | Section headlines |
| `text-display-md` | 3rem | 1 | -0.02em | Page titles |
| `text-display-sm` | 2.25rem | 1.1 | -0.01em | Large headings |
| `text-heading-xl` | 1.875rem | 1.2 | -0.01em | Section titles |
| `text-heading-lg` | 1.5rem | 1.3 | -0.01em | Card titles |
| `text-heading-md` | 1.25rem | 1.4 | 0 | Subheadings |
| `text-heading-sm` | 1.125rem | 1.4 | 0 | Small headings |
| `text-body-lg` | 1.125rem | 1.6 | 0.01em | Lead paragraphs |
| `text-body-md` | 1rem | 1.6 | 0.01em | Body text |
| `text-body-sm` | 0.875rem | 1.5 | 0.01em | Small text |
| `text-ui` | 0.75rem | 1 | 0.2em | Buttons, labels |
| `text-ui-sm` | 0.625rem | 1 | 0.25em | Tiny labels |

---

## Components

### Buttons
```jsx
// Primary - Bronze gold, for main CTAs
<Button variant="primary">Shop Now</Button>

// Secondary - Classic green, for secondary actions
<Button variant="secondary">Learn More</Button>

// Outline - Bronze border, for tertiary actions
<Button variant="outline">View Details</Button>

// Ghost - Text only, for minimal actions
<Button variant="ghost">Cancel</Button>
```

### Cards
```jsx
// Default - Clean white
<Card variant="default">...</Card>

// Elevated - With shadow
<Card variant="elevated">...</Card>

// Outlined - With border
<Card variant="outlined">...</Card>
```

### Sections
```jsx
// Light - Ivory pearl background
<Section variant="light">...</Section>

// Dark - Classic green background
<Section variant="dark">...</Section>

// Teal - Teal accent background
<Section variant="teal">...</Section>
```

---

## Spacing & Layout

### Container Max Widths
- Default: `1600px`
- Narrow: `1200px`
- Wide: `1920px`

### Section Padding
- Small: `py-8 md:py-12`
- Medium: `py-16 md:py-24`
- Large: `py-24 md:py-32`

---

## Shadows

| Class | Usage |
|-------|-------|
| `shadow-brand-sm` | Subtle elevation |
| `shadow-brand` | Default cards |
| `shadow-brand-lg` | Elevated cards, modals |
| `shadow-brand-xl` | Popovers, dropdowns |
| `shadow-gold-glow` | Hover glow effect |
| `shadow-gold-glow-lg` | Featured items |

---

## Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-brand` | 0.5rem | Buttons, inputs |
| `rounded-brand-lg` | 1rem | Cards |
| `rounded-brand-xl` | 1.5rem | Large cards, modals |

---

## Migration Guide

### Replacing Gray Colors
| Old | New |
|-----|-----|
| `text-gray-900` | `text-brand-800` |
| `text-gray-700` | `text-brand-700` |
| `text-gray-600` | `text-brand-600` |
| `text-gray-500` | `text-brand-500` |
| `text-gray-400` | `text-brand-400` |
| `text-gray-300` | `text-brand-300` |
| `bg-gray-100` | `bg-brand-100` |
| `bg-gray-50` | `bg-brand-50` |
| `border-gray-200` | `border-brand-200` |
| `border-gray-300` | `border-brand-300` |

### Replacing Semantic Colors
| Old | New |
|-----|-----|
| `text-red-*` | `text-error` |
| `bg-red-*` | `bg-error` |
| `text-green-*` | `text-success` |
| `bg-green-*` | `bg-success` |
