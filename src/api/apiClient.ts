import { API_CONFIG, DEFAULT_HEADERS, getAuthHeaders, ApiResponse, ApiError } from './config';

// Custom error class for API errors
export class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

// Request interceptor type
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

// Response interceptor type
type ResponseInterceptor = (response: any) => any | Promise<any>;

// Request configuration interface
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.setupDefaultInterceptors();
  }

  private setupDefaultInterceptors() {
    // Default request interceptor
    this.addRequestInterceptor((config) => {
      // Add authentication token if available
      const token = localStorage.getItem('authToken');
      config.headers = {
        ...config.headers,
        ...getAuthHeaders(token || undefined),
      };
      return config;
    });

    // Default response interceptor
    this.addResponseInterceptor(async (response) => {
      // Handle token refresh if needed
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            // Implement token refresh logic here
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            console.log('Token refresh needed');
          } catch (error) {
            // Refresh failed, redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }
      }
      return response;
    });
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  private async executeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      // Apply request interceptors
      let finalConfig = config;
      for (const interceptor of this.requestInterceptors) {
        finalConfig = await interceptor(finalConfig);
      }

      // Build URL with params
      const url = new URL(finalConfig.url, this.baseURL);
      if (finalConfig.params) {
        Object.entries(finalConfig.params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }

      // Create fetch options
      const fetchOptions: RequestInit = {
        method: finalConfig.method,
        headers: finalConfig.headers,
        signal: AbortSignal.timeout(this.timeout),
      };

      if (finalConfig.data && finalConfig.method !== 'GET') {
        fetchOptions.body = JSON.stringify(finalConfig.data);
      }

      // Execute request
      let response = await fetch(url.toString(), fetchOptions);

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      // Parse response
      const responseData = await response.json();

      if (!response.ok) {
        throw new ApiClientError(
          responseData.message || 'Request failed',
          response.status,
          responseData.code
        );
      }

     return { success: true, data: responseData };
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      // Handle network errors
      throw new ApiClientError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    }
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({
      method: 'GET',
      url,
      params,
    });
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({
      method: 'POST',
      url,
      data,
    });
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({
      method: 'PUT',
      url,
      data,
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({
      method: 'DELETE',
      url,
    });
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({
      method: 'PATCH',
      url,
      data,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;