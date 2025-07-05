// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:4000/api/v1/',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Common headers for all API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Authentication headers (to be added when user is logged in)
export const getAuthHeaders = (token?: string) => ({
  ...DEFAULT_HEADERS,
  ...(token && { Authorization: `Bearer ${token}` }),
});

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}