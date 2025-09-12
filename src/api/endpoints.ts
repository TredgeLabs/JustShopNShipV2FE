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
    SET_DEFAULT_ADDRESSES: 'users/addresses/set-default',
    SUMMARY: 'users/summary',
  },

  // Orders
  ORDERS: {
    LOCAL_ORDERS: 'local-orders',
    INTERNATIONAL_ORDERS: 'international-orders',
    LOCAL_ORDER_DETAILS: (id: string) => `local-orders/${id}`,
    INTERNATIONAL_ORDER_DETAILS: (id: string) => `international-orders/${id}`,
    UPDATE: (id: string) => `local-orders/${id}`,
    CANCEL: (id: string) => `local-orders/${id}/cancel`,
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

  INVENTORY: {
    GET_INVENTORY: '/api/v1/inventory',
  },

  // Product Scraping
  PRODUCTS: {
    DETAILS: 'products/details',
  },
} as const;