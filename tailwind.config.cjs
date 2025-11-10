/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      // Fonts - Nunito & DM Sans
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      
      // Using standard Tailwind font sizes
      // text-xs: 12px, text-sm: 14px, text-lg: 18px, text-2xl: 24px
      // text-3xl: 30px, text-4xl: 36px, text-5xl: 48px, text-6xl: 60px, text-8xl: 96px
      
      // Font Weights
      fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900,
      },
      
      // Colors - Update these with your Figma colors
      // To update: Go to Figma > Select element > Copy hex color > Paste here
      colors: {
        // Brand Colors (FROM FIGMA - KiosKu)
        brand: {
          primary: '#CD3D3D',     // KiosKu Red
          secondary: '#E0B44C',   // KiosKu Gold
          accent: '#CD3D3D',      // Same as primary
        },
        
        // Extended color palette with shades (FROM FIGMA)
        primary: {
          50: '#FAECEC',    // FROM FIGMA
          100: '#F0C3C3',   // FROM FIGMA
          200: '#E8A6A6',   // FROM FIGMA
          300: '#DE7D7D',   // FROM FIGMA
          400: '#D76464',   // FROM FIGMA
          500: '#CD3D3D',   // Base primary - FROM FIGMA
          600: '#BB3838',   // FROM FIGMA
          700: '#922B2B',   // FROM FIGMA
          800: '#712222',   // FROM FIGMA
          900: '#561A1A',   // FROM FIGMA
        },
        
        secondary: {
          50: '#FEF9EE',    // FROM FIGMA
          100: '#FCEDCA',   // FROM FIGMA
          200: '#FAE1A6',   // FROM FIGMA
          300: '#F7D57D',   // FROM FIGMA
          400: '#F5C964',   // FROM FIGMA
          500: '#E0B44C',   // Base secondary - FROM FIGMA
          600: '#CA9D35',   // FROM FIGMA
          700: '#A67F2A',   // FROM FIGMA
          800: '#826320',   // FROM FIGMA
          900: '#675323',   // FROM FIGMA
        },
        
        accent: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',   // Base accent
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        
        // Neutral/Gray colors (FROM FIGMA - KiosKu)
          neutral: {
          1: '#FFFFFF',     // FROM FIGMA
          2: '#FCFCFC',     // FROM FIGMA
          3: '#F5F5F5',     // FROM FIGMA
          4: '#F0F0F0',     // FROM FIGMA
          5: '#D9D9D9',     // FROM FIGMA
          6: '#BFBFBF',     // FROM FIGMA
          7: '#8C8C8C',     // FROM FIGMA
          8: '#595959',     // FROM FIGMA
          9: '#454545',     // FROM FIGMA
          10: '#262626',    // FROM FIGMA
          11: '#1F1F1F',    // FROM FIGMA
          12: '#141414',    // FROM FIGMA
          13: '#000000',    // FROM FIGMA
        },
        
        // Semantic colors
        success: {
          light: '#D1FAE5',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#B45309',
        },
        error: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#B91C1C',
        },
        info: {
          light: '#DBEAFE',
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
        },
      },
      
      // Spacing (keep Tailwind defaults, add custom if needed)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Border radius
      borderRadius: {
        '4xl': '2rem',
      },
      
      // Shadows
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
};
