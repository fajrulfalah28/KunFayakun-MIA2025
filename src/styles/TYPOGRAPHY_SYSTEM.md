# KiosKu Typography System

## Overview
This document describes the standardized typography system extracted from the Figma design file and implemented in the KiosKu project.

**Figma Source:** [Typography System](https://www.figma.com/design/ARfIQCRjPPTJILvSiz4O4w/MIA-2025?node-id=9-19)

---

## Font Families

### Nunito
**Usage:** Display text, branding, major headings (like "KiosKu" logo)
**Weights:** Black (900)

### DM Sans
**Usage:** UI elements, body text, labels, form inputs, buttons
**Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)

---

## Typography Categories

The typography system is organized into three main categories:

### 1. Display (Nunito Black)
Use for branding and hero text. All use `font-black` (900 weight).

| Name | Size | Tailwind Class | Usage |
|------|------|---------------|--------|
| H1 | 96px | `text-display-h1` | Large hero text |
| H2 | 60px | `text-display-h2` | Secondary hero text |
| H3 | 48px | `text-display-h3` | KiosKu logo (tablet+) |
| H4 | 36px | `text-display-h4` | KiosKu logo (mobile) |
| Large | 30px | `text-base-large` | Large display text |
| Medium | 24px | `text-base-medium` | Medium display text |
| Regular | 18px | `text-base-regular` | Regular display text |
| Small | 14px | `text-base-small` | Small display text |
| Tiny | 12px | `text-base-tiny` | Tiny display text |

### 2. Heading (DM Sans)
Use for section headings with various weights.

| Name | Size | Tailwind Class | Weights Available |
|------|------|---------------|-------------------|
| H1 | 96px | `text-display-h1` | regular, medium, semibold, bold |
| H2 | 60px | `text-display-h2` | regular, medium, semibold, bold |
| H3 | 48px | `text-display-h3` | regular, medium, semibold, bold |
| H4 | 36px | `text-display-h4` | regular, medium, semibold, bold |

### 3. Base (DM Sans) - MOST COMMONLY USED
Use for all UI elements, body text, buttons, and inputs.

| Name | Size | Tailwind Class | Primary Usage |
|------|------|---------------|---------------|
| Large | 30px | `text-base-large` | Large UI text |
| Medium | 24px | `text-base-medium` | Section titles |
| Regular | 18px | `text-base-regular` | Body text |
| **Small** | **14px** | **`text-base-small`** | **Labels, buttons, inputs** ⭐ |
| Tiny | 12px | `text-base-tiny` | Helper text, captions, errors |

> **Note:** `text-base-small` (14px) is the primary size for most UI elements in the KiosKu design system.

---

## Usage Examples

### Logo (Display - Nunito)
```tsx
<h1 className="font-nunito font-black text-5xl sm:text-6xl lg:text-8xl text-neutral-13">
  KiosKu
</h1>
```

### Form Label (Base - DM Sans Bold)
```tsx
<label className="font-dm-sans font-bold text-sm text-neutral-13">
  Nama Depan
</label>
```

### Input Text (Base - DM Sans Regular)
```tsx
<input 
  className="font-dm-sans font-regular text-sm text-neutral-13"
  placeholder="Masukkan Nama"
/>
```

### Button Text (Base - DM Sans Bold)
```tsx
<button className="font-dm-sans font-bold text-sm text-white">
  Daftar Sekarang
</button>
```

### Error/Helper Text (Base - DM Sans Regular)
```tsx
<p className="font-dm-sans font-regular text-xs text-primary-500">
  Password minimal 8 karakter
</p>
```

### Body Text (Base - DM Sans Regular)
```tsx
<p className="font-dm-sans font-regular text-sm text-neutral-7">
  Sudah mempunyai akun? <span className="font-bold">Log in.</span>
</p>
```

---

## Implementation Files

### 1. `src/styles/typography.ts`
Contains the complete typography system with:
- Font family definitions
- Typography scales for all three categories (display, heading, base)
- Helper functions to get typography styles
- Pre-defined style objects for easy consumption

### 2. `tailwind.config.cjs`
Extended with:
- Custom font size classes (`text-display-h1`, `text-base-small`, etc.)
- Font weight classes (`font-regular`, `font-medium`, `font-semibold`, `font-bold`, `font-black`)
- Font family classes (`font-nunito`, `font-dm-sans`)

### 3. Components Updated
All UI components now use the standardized typography:
- `src/components/ui/Input.tsx`
- `src/components/ui/Button.tsx`
- `src/pages/SignUpForm.tsx`
- `src/pages/LoginPage.tsx`

---

## Quick Reference

### Common Typography Patterns

```tsx
// Logo/Branding
font-nunito font-black text-5xl sm:text-6xl lg:text-8xl

// Page Title
font-dm-sans font-bold text-3xl

// Section Title
font-dm-sans font-bold text-2xl

// Form Label
font-dm-sans font-bold text-sm

// Input/Button Text
font-dm-sans font-regular text-sm

// Body Text
font-dm-sans font-regular text-base

// Helper/Error Text
font-dm-sans font-regular text-xs
```

---

## Font Weight Reference

| Weight | Value | Tailwind Class |
|--------|-------|----------------|
| Regular | 400 | `font-regular` |
| Medium | 500 | `font-medium` |
| SemiBold | 600 | `font-semibold` |
| Bold | 700 | `font-bold` |
| Black | 900 | `font-black` |

---

## Design Guidelines

### When to Use Nunito (Display)
- Logo and brand text ("KiosKu")
- Hero sections
- Major promotional headings
- Display typography for marketing content

### When to Use DM Sans (Base/Heading)
- All UI components (buttons, inputs, labels)
- Body text and paragraphs
- Form elements
- Navigation
- Metadata and captions
- Error messages
- Helper text

### Responsive Typography Example
```tsx
// Logo that scales from mobile to desktop
<h1 className="font-nunito font-black text-display-h4 sm:text-display-h3 lg:text-display-h2">
  KiosKu
</h1>

// Body text that scales
<p className="font-dm-sans font-regular text-base-tiny sm:text-base-small lg:text-base-regular">
  Welcome to KiosKu
</p>
```

---

## Migration Notes

All hardcoded font sizes have been replaced with **standard Tailwind font size classes**:

| Size | Tailwind Class | Usage |
|------|----------------|--------|
| 12px | `text-xs` | Error/helper text |
| 14px | `text-sm` | Labels, buttons, inputs (PRIMARY UI SIZE) |
| 16px | `text-base` | Standard body text |
| 18px | `text-lg` | Large body text |
| 20px | `text-xl` | Small headings |
| 24px | `text-2xl` | Medium headings |
| 30px | `text-3xl` | Large headings |
| 36px | `text-4xl` | Display text |
| 48px | `text-5xl` | Large display (KiosKu logo mobile) |
| 60px | `text-6xl` | XL display (KiosKu logo tablet) |
| 72px | `text-7xl` | XXL display |
| 96px | `text-8xl` | Huge display (KiosKu logo desktop) |
| 128px | `text-9xl` | Maximum display |

---

## Resources

- **Figma Typography Specs:** [View in Figma](https://www.figma.com/design/ARfIQCRjPPTJILvSiz4O4w/MIA-2025?node-id=9-19)
- **Design System Rules:** `.cursor/rules/design-system.md`
- **Color Palette:** `src/styles/colors.ts`
- **Typography System:** `src/styles/typography.ts`

---

**Last Updated:** 2025-01-08
**Based on:** Figma MIA-2025 Design System

