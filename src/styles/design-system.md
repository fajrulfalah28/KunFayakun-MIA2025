# KiosKu Design System Rules

## Overview
This document defines the design system rules for the KiosKu project based on Figma designs. Follow these guidelines when building UI components.

**Figma Source:** [MIA-2025 Design System](https://www.figma.com/design/ARfIQCRjPPTJILvSiz4O4w/MIA-2025?node-id=152-1651)

---

## 1. Color System

### Brand Colors
```typescript
Primary (Red):   #CD3D3D  // primary-500
Secondary (Gold): #E0B44C  // secondary-500
White:           #FFFFFF  // neutral-1
Black:           #000000  // neutral-13
```

### Color Usage Rules

**Primary (Red) - Use for:**
- Primary CTAs
- Error states
- Important highlights
- Brand elements

**Secondary (Gold) - Use for:**
- Secondary CTAs
- Accents
- Warnings
- Hover states

**Neutral (Grayscale) - Use for:**
- Text: `neutral-13` (#000000), `neutral-7` (#8C8C8C)
- Backgrounds: `neutral-1` (#FFFFFF), `neutral-2` (#FCFCFC), `neutral-4` (#F0F0F0)
- Borders: `neutral-4` (#F0F0F0), `neutral-5` (#D9D9D9)
- Buttons: `neutral-12` (#141414)

### Color Scale
Each color has a complete scale from 50 (lightest) to 900 (darkest):
- **Primary**: 50, 100, 200, 300, 400, **500** (base), 600, 700, 800, 900
- **Secondary**: 50, 100, 200, 300, 400, **500** (base), 600, 700, 800, 900
- **Neutral**: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13

### Tailwind CSS Usage
```tsx
// Text colors
className="text-neutral-13"      // Black text
className="text-neutral-7"       // Gray text (placeholders)
className="text-primary-500"     // Red text

// Background colors
className="bg-neutral-1"         // White background
className="bg-neutral-4"         // Light gray background (inputs)
className="bg-neutral-12"        // Black background (buttons)
className="bg-primary-500"       // Red background

// Border colors
className="border-neutral-4"     // Light gray border
```

---

## 2. Typography

**Figma Typography Source:** [Typography System](https://www.figma.com/design/ARfIQCRjPPTJILvSiz4O4w/MIA-2025?node-id=9-19)

### Font Families
```css
Nunito: Display text, brand elements, major headings
DM Sans: Body text, labels, form inputs, UI elements
```

### Font Weights
- **Black (900)**: Nunito display text, brand logo
- **Bold (700)**: Labels, subheadings, button text
- **SemiBold (600)**: Emphasized text
- **Medium (500)**: Secondary emphasis
- **Regular (400)**: Body text, placeholders

### Typography Scale (FROM FIGMA)

The typography system is organized into three categories:

#### 1. Display (Nunito Black) - For branding and hero text
```tsx
// H1: 96px
className="font-nunito font-black text-display-h1"

// H2: 60px
className="font-nunito font-black text-display-h2"

// H3: 48px (KiosKu Logo on mobile/tablet)
className="font-nunito font-black text-display-h3"

// H4: 36px (KiosKu Logo on mobile)
className="font-nunito font-black text-display-h4"

// Large: 30px
className="font-nunito font-black text-base-large"

// Medium: 24px
className="font-nunito font-black text-base-medium"

// Regular: 18px
className="font-nunito font-black text-base-regular"

// Small: 14px
className="font-nunito font-black text-base-small"

// Tiny: 12px
className="font-nunito font-black text-base-tiny"
```

#### 2. Heading (DM Sans) - For section headings
```tsx
// H1: 96px
className="font-dm-sans font-bold text-display-h1"
className="font-dm-sans font-semibold text-display-h1"
className="font-dm-sans font-medium text-display-h1"
className="font-dm-sans font-regular text-display-h1"

// H2: 60px
className="font-dm-sans font-bold text-display-h2"
className="font-dm-sans font-semibold text-display-h2"

// H3: 48px
className="font-dm-sans font-bold text-display-h3"
className="font-dm-sans font-semibold text-display-h3"

// H4: 36px
className="font-dm-sans font-bold text-display-h4"
className="font-dm-sans font-semibold text-display-h4"
```

#### 3. Base (DM Sans) - For UI elements (MOST COMMONLY USED)
```tsx
// Large: 30px - Large UI text
className="font-dm-sans font-bold text-base-large"
className="font-dm-sans font-semibold text-base-large"
className="font-dm-sans font-medium text-base-large"
className="font-dm-sans font-regular text-base-large"

// Medium: 24px - Section titles
className="font-dm-sans font-bold text-base-medium"
className="font-dm-sans font-semibold text-base-medium"

// Regular: 18px - Body text
className="font-dm-sans font-bold text-base-regular"
className="font-dm-sans font-regular text-base-regular"

// Small: 14px - UI elements, buttons, inputs, labels (PRIMARY UI SIZE)
className="font-dm-sans font-bold text-base-small"
className="font-dm-sans font-regular text-base-small"

// Tiny: 12px - Helper text, captions
className="font-dm-sans font-regular text-base-tiny"
```

### Usage Examples
```tsx
// Logo (Display) - Using standard Tailwind sizes
<h1 className="font-nunito font-black text-5xl sm:text-6xl lg:text-8xl">
  KiosKu
</h1>

// Form Label
<label className="font-dm-sans font-bold text-sm text-neutral-13">
  Nama Depan
</label>

// Input text
<input placeholder="Masukkan Nama" 
  className="font-dm-sans font-regular text-sm text-neutral-13" 
/>

// Button text
<button className="font-dm-sans font-bold text-sm text-white">
  Daftar Sekarang
</button>

// Helper/Error text
<p className="font-dm-sans font-regular text-xs text-primary-500">
  Password minimal 8 karakter
</p>
```

---

## 3. Component Design Patterns

### Input Fields (FROM FIGMA)

**Specifications:**
- Height: `39px` (h-[39px])
- Border radius: `12px` (rounded-[12px])
- Background: `#F0F0F0` (bg-neutral-4)
- Padding: `px-3 py-[6px]` (12px horizontal, 6px vertical)
- Gap between icons and text: `10px` (gap-[10px])
- Border: NONE (no border, no focus ring)
- Text: DM Sans Regular 14px, `#000000` (text-neutral-13)
- Placeholder: DM Sans Regular 14px, `#8C8C8C` (text-neutral-7)

**Component Structure:**
```tsx
<div className="flex flex-col gap-[6px] w-full">
  {/* Label */}
  <label className="font-dm-sans font-bold text-sm text-neutral-13">
    Nama Depan
  </label>
  
  {/* Input Container */}
  <div className="bg-neutral-4 rounded-[12px] flex items-center gap-[10px] h-[39px] px-3 py-[6px] w-full">
    {/* Left Icon (optional) */}
    <div className="flex items-center shrink-0 text-neutral-7">
      <KeyIcon />
    </div>
    
    {/* Input */}
    <input
      className="flex-1 bg-transparent text-neutral-13 
                 font-dm-sans font-regular text-sm
                 placeholder:text-neutral-7
                 border-0 outline-0 focus:outline-none focus:ring-0"
      placeholder="Masukkan Nama Depan"
    />
    
    {/* Right Icon (optional) */}
    <div className="flex items-center shrink-0">
      <EyeIcon />
    </div>
  </div>
</div>
```

### Buttons (FROM FIGMA)

#### Primary Button (Main CTA)
**Specifications:**
- Height: `39px` (h-[39px])
- Border radius: `100px` (rounded-[100px]) - Full pill shape
- Background: `#141414` (bg-neutral-12)
- Padding: `px-6 py-[6px]` (24px horizontal, 6px vertical)
- Text: DM Sans Bold 14px, White
- Hover: `#000000` (bg-neutral-13)

```tsx
<button className="bg-neutral-12 hover:bg-neutral-13 text-white 
                   h-[39px] px-6 py-[6px] rounded-[100px]
                   font-dm-sans font-bold text-sm
                   flex items-center justify-center gap-[10px]
                   transition-all w-full">
  Daftar Sekarang
</button>
```

#### Secondary Button (Text Link)
```tsx
<button className="text-neutral-12 hover:bg-neutral-50 
                   h-[37px] px-4 py-2 rounded-md
                   font-dm-sans font-bold text-sm">
  <span className="font-regular">Sudah mempunyai akun? </span>
  <span className="font-bold">Log in.</span>
</button>
```

### Icons

**Standard Size:** `16.667px` (w-[16.667px] h-[16.667px])
**Logo Size:** `47px` (w-[47px] h-[47px])
**Color:** `#8C8C8C` (neutral-7) for form icons

---

## 4. Spacing System

### Component Spacing (FROM FIGMA)
```tsx
// Form field spacing
gap-[6px]   // Between label and input
gap-[24px]  // Between form fields
gap-[10px]  // Inside input (between icons and text)

// Section spacing
gap-[64px]  // Between major sections
p-[32px]    // Section padding
py-[128px]  // Vertical padding for main sections
px-[64px]   // Horizontal padding for main sections
```

### Layout Spacing
```tsx
// Common gaps
gap-[8px]   // Tight spacing
gap-[16px]  // Normal spacing
gap-[24px]  // Comfortable spacing
gap-[32px]  // Section spacing
gap-[64px]  // Major section spacing
```

---

## 5. Layout Patterns

### Split-Screen Layout (Sign Up / Login)
```tsx
<div className="flex min-h-screen bg-white">
  {/* Left - Image */}
  <div className="hidden lg:flex lg:flex-1 relative">
    <div className="absolute inset-0 bg-cover bg-center">
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50" />
    </div>
  </div>
  
  {/* Right - Form */}
  <div className="flex-1 flex flex-col items-center justify-center px-16 py-32 bg-white">
    {/* Content */}
  </div>
</div>
```

---

## 6. Component Library Structure

### File Organization
```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── icons/           # Icon components
│   │   ├── KeyIcon.tsx
│   │   ├── EyeIcon.tsx
│   │   └── ShopIcon.tsx
│   └── [Feature]Form.tsx # Feature-specific components
├── styles/
│   └── colors.ts        # Color definitions
└── pages/               # Page components
```

### Component Props Pattern
```typescript
// Extend native HTML elements
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

---

## 7. Accessibility

### Color Contrast
- All text on white backgrounds must use `neutral-13` (#000000)
- Placeholder text uses `neutral-7` (#8C8C8C) - meets AA standard
- Button text on dark backgrounds uses white

### Interactive Elements
- All buttons and inputs must have focus states
- Form labels are required for all inputs
- Error messages must be clearly visible

---

## 8. Responsive Design

### Breakpoints
```tsx
// Mobile first
className="px-4 py-8"                    // Mobile
className="md:px-8 md:py-16"            // Tablet
className="lg:px-16 lg:py-32"           // Desktop

// Split screen visibility
className="hidden lg:flex"               // Show on desktop only
```

---

## 9. State Management Patterns

### Form State
```typescript
const [formData, setFormData] = useState({
  field: '',
});

const [errors, setErrors] = useState<Record<string, string>>({});
const [isLoading, setIsLoading] = useState(false);

// Password visibility
const [showPassword, setShowPassword] = useState(false);
```

---

## 10. Form Validation Rules

### Field Validation Specifications

All form inputs include both client-side validation and real-time input filtering to ensure data integrity.

#### **Nama Depan & Nama Belakang (First & Last Name)**
```typescript
// Validation Rules
- Required: Yes
- Allowed Characters: Alphabets (a-z, A-Z) and spaces only
- Min Length: 1 character
- Max Length: 50 characters
- Auto-filtering: Removes numbers and special characters on input

// Error Messages
- Empty: "Nama depan/belakang wajib diisi"
- Invalid: "Hanya huruf yang diperbolehkan"
- Too long: "Maksimal 50 karakter"
```

#### **Kontak (Phone Number)**
```typescript
// Validation Rules
- Required: Yes
- Prefix: +62 (Indonesia, displayed but not editable)
- Format: XXX-XXXX-XXXX (auto-formatted with dashes)
- Allowed Characters: Numbers (0-9) only
- Exact Length: 11 digits (after +62)
- Input Type: tel
- Auto-filtering: Removes all non-numeric characters
- Auto-formatting: Adds dashes automatically as user types

// Error Messages
- Empty: "Kontak wajib diisi"
- Invalid length: "Harus 11 digit (XXX-XXXX-XXXX)"

// Display Format
+62 123-4567-8910  ✓

// Format Breakdown
- +62 = Country code (fixed, displayed as left icon)
- 123 = First 3 digits
- 4567 = Next 4 digits
- 8910 = Last 4 digits
Total: 11 digits after +62
```

#### **Password**
```typescript
// Validation Rules (Sign Up)
- Required: Yes
- Min Length: 8 characters
- Max Length: 64 characters
- Must contain:
  - At least 1 uppercase letter (A-Z)
  - At least 1 lowercase letter (a-z)
  - At least 1 number (0-9)
- No character restrictions (allows special characters)

// Validation Rules (Login)
- Required: Yes
- Min Length: 8 characters
- Max Length: 64 characters
- No complexity check (login doesn't verify composition)

// Error Messages
- Empty: "Password wajib diisi"
- Too short: "Minimal 8 karakter"
- Too long: "Maksimal 64 karakter"
- Invalid composition: "Harus ada huruf besar, kecil & angka"

// Password Security Features
- Toggle visibility with eye icon
- Type: password (hidden by default)
- Confirmation field (sign up only)
```

#### **Konfirmasi Password (Password Confirmation)**
```typescript
// Validation Rules
- Required: Yes (sign up only)
- Max Length: 64 characters
- Must match: Password field

// Error Messages
- Empty: "Konfirmasi password wajib diisi"
- Mismatch: "Password tidak cocok"
```

### Implementation Example

#### Real-time Input Filtering
```tsx
// Name fields - Only alphabets
<Input
  value={formData.namaDepan}
  onChange={(e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    if (value.length <= 50) {
      handleChange('namaDepan', value);
    }
  }}
  maxLength={50}
/>

// Phone number - Auto-formatted with dashes
const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
};

<Input
  type="tel"
  placeholder="123-4567-8910"
  value={formData.contact}
  onChange={(e) => {
    const formatted = formatPhoneNumber(e.target.value);
    handleChange('contact', formatted);
  }}
  maxLength={13}
  leftIcon={<span>+62</span>}
/>

// Password - Length limit only
<Input
  type="password"
  value={formData.password}
  onChange={(e) => {
    const value = e.target.value;
    if (value.length <= 64) {
      handleChange('password', value);
    }
  }}
  maxLength={64}
/>
```

#### Validation Function
```tsx
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  // Name validation
  if (!formData.namaDepan.trim()) {
    newErrors.namaDepan = 'Nama depan wajib diisi';
  } else if (!/^[a-zA-Z\s]+$/.test(formData.namaDepan)) {
    newErrors.namaDepan = 'Hanya huruf yang diperbolehkan';
  } else if (formData.namaDepan.length > 50) {
    newErrors.namaDepan = 'Maksimal 50 karakter';
  }

  // Phone validation (format: XXX-XXXX-XXXX = 11 digits)
  const contactDigits = formData.contact.replace(/\D/g, '');
  if (!formData.contact.trim()) {
    newErrors.contact = 'Kontak wajib diisi';
  } else if (contactDigits.length !== 11) {
    newErrors.contact = 'Harus 11 digit (XXX-XXXX-XXXX)';
  }

  // Password validation (Sign Up)
  if (!formData.password) {
    newErrors.password = 'Password wajib diisi';
  } else if (formData.password.length < 8) {
    newErrors.password = 'Minimal 8 karakter';
  } else if (formData.password.length > 64) {
    newErrors.password = 'Maksimal 64 karakter';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    newErrors.password = 'Harus ada huruf besar, kecil & angka';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Error Message Display
- Position: Right-aligned, below input field
- Color: `semanticColors.error` (primary-500, #CD3D3D)
- Font: DM Sans Regular, text-xs (12px)
- Layout: Absolute positioning to avoid affecting form spacing
- Display: Only shown when validation fails

### Validation Timing
- **On Submit**: Full validation runs when form is submitted
- **Real-time Filtering**: Input is filtered as user types
- **Error Clearing**: Errors clear when user starts typing in field
- **Confirmation Match**: Checked on blur and submit

---

## 11. Quick Reference

### Most Common Classes
```tsx
// Text (Using standard Tailwind sizes)
"font-dm-sans font-bold text-sm text-neutral-13"          // Labels
"font-dm-sans font-regular text-sm text-neutral-7"        // Placeholders
"font-dm-sans font-regular text-xs text-primary-500"      // Error text
"font-nunito font-black text-5xl sm:text-6xl lg:text-8xl" // Logo

// Backgrounds
"bg-neutral-1"    // White
"bg-neutral-4"    // Light gray (inputs)
"bg-neutral-12"   // Black (buttons)

// Layout
"flex flex-col gap-[6px]"      // Form field
"flex items-center gap-[10px]" // Input with icons
"rounded-[12px]"               // Input corners
"rounded-[100px]"              // Button (pill)
"h-[39px]"                     // Standard height
```

---

## 12. Design System Maintenance

### Updating from Figma
1. Extract colors from Figma variables
2. Update `src/styles/colors.ts`
3. Update `tailwind.config.cjs`
4. Test components with new colors
5. Update documentation

### Adding New Components
1. Extract specs from Figma (sizes, colors, spacing)
2. Create TypeScript interface extending HTML elements
3. Follow existing component patterns
4. Export from `src/components/ui/index.ts`
5. Document usage examples

---

## 13. Common Mistakes to Avoid

❌ **DON'T:**
- Use arbitrary colors not in the design system
- Add borders to inputs (Figma design has none)
- Use focus rings on inputs (design is flat)
- Mix font families incorrectly
- Use padding instead of gap for flex layouts

✅ **DO:**
- Use exact hex values from Figma
- Follow spacing guidelines (6px, 10px, 24px, etc.)
- Use semantic color names (neutral-7, not #8C8C8C directly)
- Keep components reusable
- Test on multiple screen sizes

---

**Last Updated:** Based on Figma file node-id=152-1651
**Tech Stack:** React 19 + TypeScript + Tailwind CSS 4 + Vite

