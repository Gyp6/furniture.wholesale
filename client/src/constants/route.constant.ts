const UI_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const S3_URL = process.env.NEXT_PUBLIC_S3_URL;

export const ROUTES = {
  PLACEHOLDER: '#',

  UI: (url: string) => `${UI_URL}/${url}`,
  S3: (url: string) => `${S3_URL}/furniture-wholesale-bucket/${url}`,

  GITHUB: {
    ORGANIZATION: 'https://github.com/Gyp6',
    PROJECT: 'https://github.com/Gyp6/furniture.wholesale',
  },

  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD: 'reset-password',
  },

  HOME: '/',
  CATALOG: '/catalog',

  PROFILE: (id: string) => `profile/${id}`,
  DASHBOARD: 'dashboard',

  NAV: [
    { label: 'Marketplace', href: '/catalog' },
    { label: 'Bundles', href: '/bundles' },
    { label: 'Dashboards', href: '/dashboard' },
  ],

  API: {
    CORE: {
      WELCOME: '/',
      HEALTH: '/health',
    },
    USER: {
      ME: '/user/me',
      VERIFY_EMAIL: '/user/verify-email',
      RESEND_OTP: '/user/resend-otp',
    },
  },
} as const;