// API Endpoints Configuration
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: 'users/login',
    REGISTER: 'users/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: 'users/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_FORGOT_PASSWORD_OTP: 'users/verify-forgot-password-otp',
  },

  // User Management
  USER: {
    PROFILE: 'users/profile',
    UPDATE_PROFILE: 'users/profile',
    VAULT_INFO: '/user/vault',
    PREFERENCES: '/user/preferences',
    CHANGE_PASSWORD: 'users/change-password',
    UPDATE_PASSWORD: 'users/update-password',
    ADDRESSES: 'users/addresses',
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAILS: (id: string) => `/orders/${id}`,
    UPDATE: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    TRACK: (id: string) => `/orders/${id}/track`,
  },

  // Shipping
  SHIPPING: {
    CALCULATE: '/shipping/calculate',
    RATES: '/shipping/rates',
    CONSOLIDATE: '/shipping/consolidate',
    TRACK: (trackingNumber: string) => `/shipping/track/${trackingNumber}`,
  },

  // Chat Support
  CHAT: {
    SEND_MESSAGE: '/chat/message',
    GET_HISTORY: '/chat/history',
    START_SESSION: '/chat/session',
    END_SESSION: (sessionId: string) => `/chat/session/${sessionId}/end`,
  },

  // Miscellaneous
  MISC: {
    COUNTRIES: '/misc/countries',
    EXCHANGE_RATES: '/misc/exchange-rates',
    NOTIFICATIONS: '/misc/notifications',
  },
} as const;