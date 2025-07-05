import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../config';

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country: string;
  createdAt: Date;
  isVerified: boolean;
  membershipTier: 'basic' | 'silver' | 'gold' | 'platinum';
}

// Vault information interface
export interface VaultInfo {
  id: string;
  userId: string;
  name: string;
  street: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isActive: boolean;
}

// Authentication interfaces
export interface LoginRequest {
  email?: string;
  login?: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Password change interface
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Forgot password interface
export interface ForgotPasswordRequest {
  email: string;
}

// User preferences interface
export interface UserPreferences {
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  shipping: {
    defaultCountry: string;
    preferredCarrier: string;
  };
}

class UserService {
  /**
   * User login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Store tokens in localStorage
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  /**
   * User registration
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const requestBody = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        country: userData.country,
        phone_number: userData.phone,
        phone_country_code: '+91'
      };
      const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, requestBody);
      
      // Store tokens in localStorage
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
      return response;
    } catch (error) {
      console.error('Error during forgot password:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(ENDPOINTS.AUTH.RESET_PASSWORD, data);
      return response;
    } catch (error) {
      console.error('Error during password change:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<User>(ENDPOINTS.USER.PROFILE);
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put<User>(ENDPOINTS.USER.UPDATE_PROFILE, userData);
      
      // Update stored user data
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get vault information
   */
  async getVaultInfo(): Promise<ApiResponse<VaultInfo>> {
    try {
      const response = await apiClient.get<VaultInfo>(ENDPOINTS.USER.VAULT_INFO);
      return response;
    } catch (error) {
      console.error('Error fetching vault info:', error);
      throw error;
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    try {
      const response = await apiClient.get<UserPreferences>(ENDPOINTS.USER.PREFERENCES);
      return response;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    try {
      const response = await apiClient.put<UserPreferences>(ENDPOINTS.USER.PREFERENCES, preferences);
      return response;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const userService = new UserService();
export default userService;