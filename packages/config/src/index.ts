// Brand colors
export const BRAND_COLORS = {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // Main brand purple
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  accent: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Accent red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
};

// Routes
export const ROUTES = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  PATIENTS: '/patients',
  DOCTORS: '/doctors',
  APPOINTMENTS: '/appointments',
  PROCEDURES: '/procedures',
  ADMIN: '/admin',
};

// User Roles
export const USER_ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  FRONTDESK: 'FRONTDESK',
  ADMIN: 'ADMIN',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  RESCHEDULED: 'RESCHEDULED',
};
