import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Charcoal (trust, professionalism, medical)
        primary: {
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#d9d9d9',
          300: '#c2c2c2',
          400: '#8b8b8b',
          500: '#555555',
          600: '#3d3d3d',
          700: '#2c2c2c',
          800: '#1a1a1a',
          900: '#0d0d0d',
        },

        // Accent - Gold/Mustard (premium, luxury, transformation)
        accent: {
          50: '#fffbf0',
          100: '#fef5dd',
          200: '#fde9bb',
          300: '#fcd699',
          400: '#f9bf55',
          500: '#d4af37',
          600: '#c9a961',
          700: '#b89346',
          800: '#8f7035',
          900: '#6b5429',
        },

        // Secondary - Teal (clinical, trust, action)
        secondary: {
          50: '#f0fafb',
          100: '#d4eef3',
          200: '#a8dce8',
          300: '#7ccadd',
          400: '#50b8d2',
          500: '#2b8b9b',
          600: '#258397',
          700: '#1f6d7a',
          800: '#1a575c',
          900: '#0d2e33',
        },

        // Neutral - Gray scale (UI elements, text hierarchy)
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#ebebeb',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },

        // Semantic colors (status, feedback)
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',

        // Clinical/Medical specific
        alert: '#fca5a5',
        'alert-dark': '#dc2626',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', ...defaultTheme.fontFamily.sans],
        heading: ['Segoe UI', 'Helvetica Neue', 'Arial', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.2' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.5' }],
        xl: ['20px', { lineHeight: '1.5' }],
        '2xl': ['24px', { lineHeight: '1.2' }],
        '3xl': ['30px', { lineHeight: '1.2' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
        '5xl': ['48px', { lineHeight: '1.2' }],
        '6xl': ['60px', { lineHeight: '1.2' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        base: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        'nav-height': '64px',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        base: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        elevated: '0 20px 40px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '350ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
