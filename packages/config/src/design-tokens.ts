// packages/config/src/design-tokens.ts - Design Tokens for Nairobi Sculpt

export const colors = {
  // Primary brand colors
  primary: {
    main: '#1a1a1a',      // Dark charcoal - professional, medical feel
    light: '#333333',     // Lighter variant
    lighter: '#666666',   // Even lighter for secondary text
    dark: '#000000',      // Pure black for contrast
  },

  // Accent colors (confidence, transformation)
  accent: {
    main: '#c41e3a',      // Deep red - confidence, aesthetic transformation
    light: '#d63351',
    lighter: '#e85769',
    dark: '#a01829',
  },

  // Background & Surface colors
  background: {
    primary: '#ffffff',    // Clean white
    secondary: '#f5f5f5',  // Off-white - premium feel
    tertiary: '#ebebeb',   // Light gray for hover states
  },

  // Semantic colors
  status: {
    success: '#27AE60',    // Green - healing, positive outcomes
    warning: '#E67E22',    // Orange - caution, important
    error: '#c41e3a',      // Red - danger, errors (matches accent)
    info: '#3498DB',       // Blue - trust, professionalism
  },

  // Text colors
  text: {
    primary: '#333333',    // Dark gray - primary text
    secondary: '#666666',  // Medium gray - secondary text
    tertiary: '#999999',   // Light gray - disabled, hints
    inverse: '#ffffff',    // White text on dark backgrounds
    muted: '#b0b0b0',      // Very light gray for subtle text
  },

  // Border & divider colors
  border: {
    light: '#e0e0e0',      // Light gray for borders
    medium: '#cccccc',     // Medium gray
    dark: '#999999',       // Dark gray
  },

  // Transparent variants (for overlays, backgrounds)
  transparent: {
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black50: 'rgba(0, 0, 0, 0.5)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
  },

  // Gradient combinations
  gradients: {
    accentToTransparent: 'linear-gradient(135deg, #c41e3a 0%, rgba(196, 30, 58, 0) 100%)',
    darkToPrimary: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
  },
};

export const typography = {
  // Font families
  fontFamily: {
    heading: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Courier New', monospace",
  },

  // Font sizes (px)
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.05em',
  },
};

export const spacing = {
  // Spacing scale (4px base unit)
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
};

export const borderRadius = {
  none: '0',
  sm: '4px',
  base: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  elevated: '0 20px 40px rgba(0, 0, 0, 0.15)',
};

export const transitions = {
  fast: '150ms ease-in-out',
  base: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
};

// Preset component styles
export const componentStyles = {
  button: {
    primary: {
      background: colors.accent.main,
      color: colors.text.inverse,
      hover: colors.accent.dark,
      active: colors.accent.dark,
      disabled: colors.border.light,
    },
    secondary: {
      background: colors.background.secondary,
      color: colors.text.primary,
      hover: colors.background.tertiary,
      active: colors.border.medium,
      disabled: colors.background.secondary,
    },
  },
  card: {
    background: colors.background.primary,
    border: colors.border.light,
    shadow: shadows.base,
  },
  input: {
    background: colors.background.primary,
    border: colors.border.light,
    focusBorder: colors.accent.main,
    placeholder: colors.text.tertiary,
  },
};

// Export as single object for easy usage
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  componentStyles,
};

export default designTokens;
