// Vault items API response type
import { LocalOrderItem } from './orderService';
export interface VaultItemApi {
  id: number;
  vault_id: number;
  order_item_id: number | null;
  name: string;
  description: string;
  source_type: string;
  received_date: string;
  weight_gm: number;
  status: string;
  is_returnable: boolean;
  returnable_until: string | null;
  storage_days_free: number;
  storage_fee_per_day: string;
  image_urls: string[];
  is_ready_to_ship: boolean;
  createdAt: string;
  updatedAt: string;
  order_item?: LocalOrderItem | null;
}

export interface VaultItemsApiResponse {
  success: boolean;
  vaultCode: string;
  items: VaultItemApi[];
}

class VaultService {
  async getVaultItems(): Promise<VaultItemsApiResponse> {
    try {
      const response = await apiClient.get<VaultItemsApiResponse>("vault/items");
      return (response as any).data || response;
    } catch (error) {
      console.error('Error fetching vault items:', error);
      throw error;
    }
  }
}

export const vaultService = new VaultService();
// Product details scraping API response type
export interface ProductDetailsResponse {
  success: boolean;
  source: string;
  details: {
    product_name: string;
    product_image: string;
    sizes: string[] | null;
    colors: string[] | null;
    source: string;
  };
}

class ProductService {
  async getProductDetailsByUrl(url: string): Promise<ProductDetailsResponse> {
    try {
      const response = await apiClient.get<ProductDetailsResponse>(`${ENDPOINTS.PRODUCTS.DETAILS}?url=${encodeURIComponent(url)}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();
// Update Address request/response types
export interface UpdateAddressRequest {
  is_default: boolean;
}

export interface UpdateAddressResponse {
  success: boolean;
}
// Add Address request/response types
export interface AddAddressRequest {
  title: string;
  recipient_first_name: string;
  recipient_middle_name?: string;
  recipient_last_name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  phone_country_code: string;
  phone_number: string;
  is_default?: boolean;
}

export interface AddAddressResponse {
  success: boolean;
  address: AddressApi;
}
// Address API response types
export interface AddressApiResponse {
  success: boolean;
  addresses: AddressApi[];
}

export interface RegisterResponse {
  success: boolean;
  user_id: string;
  message: string;
  vault_code: string
}

export interface AddressApi {
  id: number;
  user_id: number;
  title: string;
  recipient_first_name: string;
  recipient_middle_name?: string;
  recipient_last_name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  phone_country_code: string;
  phone_number: string;
  is_default: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  userName: string;
  userFullName: string;
  totalActiveOrders: number;
  vaultWeight: number;
  estimatedShippingCost: number;
  vaultCode: string | null;
  street: string;
  address: string;
  city: string;
  country: string;
  mobileNumber: string;
  vaultCount: number;
}

export interface UserSummaryResponse {
  success: boolean;
  data: UserSummary;
}

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

export interface Profile {
  id: number;
  vault_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  google_id: string | null;
  referral_code: string | null;
  referred_by: string | null;
  country: string | null;
  virtual_address_id: number;
  is_admin: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
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
  selectedCountry?: string;
}

export interface Data {
  data: AuthResponse;
}


export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Password change interface
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

// Forgot password interface
export interface ForgotPasswordRequest {
  phone_country_code: string;
  phone_number: string;
}

// OTP verification interface
export interface VerifyForgotPasswordOtpRequest {
  phone_country_code: string;
  phone_number: string;
  otp_code: string;
}

export interface VerifyForgotPasswordOtpResponse {
  message: string;
  resetToken: string;
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

// Update forgot password interface
export interface UpdateForgotPasswordRequest {
  token: string;
  new_password: string;
}

export interface UpdateForgotPasswordResponse {
  success: boolean;
  message: string;
}

class UserService {
  /**
   * Update an address (e.g., set as default)
   */
  async updateAddress(addressId: string, data: UpdateAddressRequest): Promise<UpdateAddressResponse> {
    try {
      const response = await apiClient.put<UpdateAddressResponse>(`${ENDPOINTS.USER.ADDRESSES}/${addressId}`, data);
      const resp = (response as any).data || response;
      if (!resp.success) {
        throw new Error('Failed to update address');
      }
      return resp;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }
 
  async getUserSummary(): Promise<UserSummaryResponse> {
    const response = await apiClient.get<UserSummaryResponse>(ENDPOINTS.USER.SUMMARY);
    return response.data;
  }

  /**
   * Update an address (e.g., set as default)
   */
  async setDefaultAddress(addressId: string, data: UpdateAddressRequest): Promise<UpdateAddressResponse> {
    try {
      const response = await apiClient.put<UpdateAddressResponse>(`${ENDPOINTS.USER.SET_DEFAULT_ADDRESSES}/${addressId}`, data);
      const resp = (response as any).data || response;
      if (!resp.success) {
        throw new Error('Failed to update address');
      }
      return resp;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  /**
   * Add a new address for the user
   */
  async addAddress(data: AddAddressRequest): Promise<AddAddressResponse> {
    try {
      const response = await apiClient.post<AddAddressResponse>(ENDPOINTS.USER.ADDRESSES, data);
      // If apiClient wraps in .data, unwrap, else use as is
      const resp = (response as any).data || response;
      if (!resp.success || !resp.address) {
        throw new Error('Failed to add address');
      }
      return resp;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }
  /**
   * User login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<Data>> {
    try {
      const response = await apiClient.post<Data>(ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Store tokens in localStorage
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
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
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const requestBody = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        country: userData.country,
        phone_number: userData.phone,
        phone_country_code: userData.selectedCountry
      };
      const response = await apiClient.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, requestBody);

      // Store tokens in localStorage
      // if (response.success && response.data) {
      //   localStorage.setItem('authToken', response.data.token);
      //   localStorage.setItem('refreshToken', response.data.refreshToken);
      //   localStorage.setItem('user', JSON.stringify(response.data.user));
      // }

      return response.data;
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
   * Verify forgot password OTP
   */
  async verifyForgotPasswordOtp(
    data: VerifyForgotPasswordOtpRequest
  ): Promise<VerifyForgotPasswordOtpResponse> {
    try {
      // The API expects a POST request with the OTP data
      const response = await apiClient.post<VerifyForgotPasswordOtpResponse>(
        ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD_OTP,
        data
      );
      // Some backends wrap response in .data, some don't
      return (response as any).data || response;
    } catch (error) {
      console.error('Error verifying forgot password OTP:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put<void>(ENDPOINTS.USER.CHANGE_PASSWORD, data);
      return response;
    } catch (error) {
      console.error('Error during password change:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<Profile>> {
    try {
      const response = await apiClient.get<ApiResponse<Profile>>(ENDPOINTS.USER.PROFILE);
      return response.data;
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
   * Update password using reset token
   */
  async updateForgotPassword(
    data: UpdateForgotPasswordRequest
  ): Promise<UpdateForgotPasswordResponse> {
    try {
      const response = await apiClient.post<UpdateForgotPasswordResponse>(
        ENDPOINTS.USER.UPDATE_PASSWORD,
        data
      );
      return (response as any).data || response;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Get address list of user
   */

  async getAddresses(): Promise<AddressApi[]> {
    try {
      // Response is { success, addresses: [...] }
      const apiRaw = await apiClient.get<any>(ENDPOINTS.USER.ADDRESSES);
      // If apiClient wraps in .data, unwrap, else use as is
      let addresses: AddressApi[] | undefined;
      let success: boolean | undefined;
      if ('addresses' in apiRaw) {
        addresses = apiRaw.addresses as AddressApi[];
        success = apiRaw.success;
      } else if (apiRaw.data && 'addresses' in apiRaw.data) {
        addresses = apiRaw.data.addresses as AddressApi[];
        success = apiRaw.data.success;
      }
      if (!success || !addresses) {
        throw new Error('Failed to fetch addresses');
      }
      return addresses;
    } catch (error) {
      console.error('Error fetching addresses:', error);
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