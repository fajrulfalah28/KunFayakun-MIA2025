/**
 * KiosKu Color Palette
 * Extracted from Figma Design System
 * Source: https://www.figma.com/design/ARfIQCRjPPTJILvSiz4O4w/MIA-2025?node-id=152-1651
 */

export const colors = {
  // PRIMARY COLORS (Red)
  primary: {
    50: '#FAECEC',   // Lightest red
    100: '#F0C3C3',
    200: '#E8A6A6',
    300: '#DE7D7D',
    400: '#D76464',
    500: '#CD3D3D',  // Base primary (KiosKu Red)
    600: '#BB3838',
    700: '#922B2B',
    800: '#712222',
    900: '#561A1A',  // Darkest red
  },

  // SECONDARY COLORS (Gold/Yellow)
  secondary: {
    50: '#FEF9EE',   // Lightest gold
    100: '#FCEDCA',
    200: '#FAE1A6',
    300: '#F7D57D',
    400: '#F5C964',
    500: '#E0B44C',  // Base secondary (KiosKu Gold)
    600: '#CA9D35',
    700: '#A67F2A',
    800: '#826320',
    900: '#675323',  // Darkest gold/brown
  },

  // NEUTRAL COLORS (Grayscale)
  neutral: {
    1: '#FFFFFF',    // White
    2: '#FCFCFC',    // Off-white
    3: '#F5F5F5',    // Very light gray
    4: '#F0F0F0',    // Light gray (Input backgrounds)
    5: '#D9D9D9',    // Light-medium gray
    6: '#BFBFBF',    // Medium gray
    7: '#8C8C8C',    // Gray (Placeholders)
    8: '#595959',    // Dark gray
    9: '#454545',    // Darker gray
    10: '#262626',   // Very dark gray
    11: '#1F1F1F',   // Almost black
    12: '#141414',   // Black (Buttons, text)
    13: '#000000',   // Pure black
  },
} as const;

export type ColorScale = keyof typeof colors;
export type PrimaryShade = keyof typeof colors.primary;
export type SecondaryShade = keyof typeof colors.secondary;
export type NeutralShade = keyof typeof colors.neutral;

// Brand colors (shortcuts)
export const brandColors = {
  primary: colors.primary[500],    // #CD3D3D
  secondary: colors.secondary[500], // #E0B44C
  white: colors.neutral[1],         // #FFFFFF
  black: colors.neutral[13],        // #000000
} as const;

// Semantic colors
export const semanticColors = {
  // Text
  textPrimary: colors.neutral[13],   // #000000
  textSecondary: colors.neutral[7],  // #8C8C8C
  textDisabled: colors.neutral[6],   // #BFBFBF
  textOnDark: colors.neutral[1],     // #FFFFFF
  
  // Backgrounds
  bgPrimary: colors.neutral[1],      // #FFFFFF
  bgSecondary: colors.neutral[2],    // #FCFCFC
  bgTertiary: colors.neutral[4],     // #F0F0F0
  bgDark: colors.neutral[12],        // #141414
  
  // Borders
  borderLight: colors.neutral[4],    // #F0F0F0
  borderMedium: colors.neutral[5],   // #D9D9D9
  borderDark: colors.neutral[7],     // #8C8C8C
  
  // States
  error: colors.primary[500],        // #CD3D3D
  errorLight: colors.primary[100],   // #F0C3C3
  errorDark: colors.primary[700],    // #922B2B
  
  warning: colors.secondary[500],    // #E0B44C
  warningLight: colors.secondary[100], // #FCEDCA
  warningDark: colors.secondary[700],  // #A67F2A
} as const;

export default colors;

