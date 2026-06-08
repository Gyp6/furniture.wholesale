const UI_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const S3_URL = process.env.NEXT_PUBLIC_S3_URL;

export const ROUTES = {
  PLACEHOLDER: '#',

  UI: (url: string) => `${UI_URL}/${url}`,
  S3: (url: string) => `${S3_URL}/${url}`,

  GITHUB: {
    ORGANIZATION: 'https://github.com/Gyp6',
    PROJECT: 'https://github.com/Gyp6/furniture.wholesale',
  },

  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  HOME: '/',
  CATALOG: '/catalog',
  BUNDLES: '/bundles',
  DASHBOARD: '/dashboard',
  PRODUCT: (id: string) => `/product/${id}`,
  PROFILE: '/profile',

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
    CATALOG: {
      PRODUCT: {
        GET_ALL: '/products',
        GET_ONE: (id: string) => `/products/${id}`,
      },
      CATEGORY: {
        GET_ALL: '/categories',
      },
      TAGS: {
        GET_ALL: '/tags',
      },
    },
  },
} as const;
