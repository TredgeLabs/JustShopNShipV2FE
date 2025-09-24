import { ApiResponse } from '../../api/config';

// Admin API response types
export interface AdminLoginRequest {
  admin_code: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  admin: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AdminOrder {
  id: number;
  orderDate: string;     // e.g., "2025-08-28"
  userName: string;
  userEmail: string;
  location?: string;     // backend sometimes empty string
  items: string;         // comma-separated names: "Kurta, Socks"
  itemCount: number;
  status: string;       // e.g., "pending", "processing", "completed"
  totalAmount: number;   // note: string in API
}

export interface LocalOrderDetails {
  id: number;
  order_status: string;
  payment_status: string;
  total_price: string;      // note: string in API
  platform_fee: string;     // note: string in API
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    vault_id: string;
  };
  items: LocalOrderItem[];
}

export interface LocalOrderItem {
  id: number;
  source_type: string;         // e.g., "manual_link"
  product_name: string;
  product_link: string;
  image_link?: File;
  color?: string;
  size?: string;
  quantity: number;
  price: string;               // note: string in API
  final_price?: string;        // note: string in API
  status: string;              // e.g., "accepted" | "denied"
  deny_reasons?: number[] | null;
  // created_at / updated_at are NOT sent per item in current API
}


export interface BulkProcessRequest {
  items: Array<{
    item_id: number;
    action: 'approve' | 'deny';
    deny_reasons?: number[];
  }>;
  admin_notes?: string;
}

export interface VaultItemRequest {
  vault_id: string;
  name: string;
  description: string;
  source_type: string;
  received_date: string;
  weight_gm: number;
  status: string;
  is_returnable: boolean;
  returnable_until?: string | null;
  storage_days_free: number;
  storage_fee_per_day: number;
  is_ready_to_ship: boolean;
  images: File[];
}

export interface ShipInternationalRequest {
  tracking_id?: string;
  tracking_link?: string;
  shipping_status?: string;
}

// Admin API Service
class AdminApiService {
  private baseUrl = 'http://localhost:4000/api/admin';

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('adminToken');
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getMultiPartAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('adminToken');
    return {
      'Accept': 'application/json',
      // 'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminSession');
        window.location.href = '/admin/login';
        throw new Error('Authentication failed');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // 1. Admin Login
  async login(adminCode: string): Promise<AdminLoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_code: adminCode }),
      });

      const data = await this.handleResponse<AdminLoginResponse>(response);

      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminSession', JSON.stringify({
          authenticated: true,
          timestamp: new Date().toISOString(),
          admin: data.admin
        }));
      }

      return data;
    } catch (error) {
      console.error('Error during admin login:', error);
      throw error;
    }
  }

  // 2. Get Orders List
  async getLocalOrders(): Promise<ApiResponse<AdminOrder[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/orders?type=local`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse<ApiResponse<AdminOrder[]>>(response);
    } catch (error) {
      console.error('Error fetching local orders:', error);
      throw error;
    }
  }

  async getInternationalOrders(): Promise<ApiResponse<AdminOrder[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/orders?type=international`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<ApiResponse<AdminOrder[]>>(response);
    } catch (error) {
      console.error('Error fetching international orders:', error);
      throw error;
    }
  }

  // 3. Get Local Order Details
  async getOrderDetails(orderId: string): Promise<ApiResponse<LocalOrderDetails>> {
    try {
      const response = await fetch(`${this.baseUrl}/local-orders/${orderId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse<ApiResponse<LocalOrderDetails>>(response);
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // 4. Bulk Approve/Deny Order Items
  async bulkProcessOrderItems(orderId: string, processData: BulkProcessRequest): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/local-orders/${orderId}/bulk-process`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(processData),
      });

      await this.handleResponse<void>(response);
      return {
        success: true,
        data: undefined,
        message: 'Order items processed successfully'
      };
    } catch (error) {
      console.error('Error processing order items:', error);
      throw error;
    }
  }

  // 5. Add Vault Item from Order
  async addVaultItem(vaultId: string, itemData: any): Promise<any> {
    const formData = new FormData();

    // Append normal fields
    Object.keys(itemData).forEach((key) => {
      if (key !== 'images' && itemData[key] !== undefined && itemData[key] !== null) {
        formData.append(key, itemData[key]);
      }
    });

    // ✅ Append images if provided
    if (itemData.images && Array.isArray(itemData.images)) {
      itemData.images.forEach((file: File) => {
        formData.append('images', file);
      });
    }

    const response = await fetch(`${this.baseUrl}/vaults/${vaultId}/items`, {
      method: 'POST',
      headers: {
        ...this.getMultiPartAuthHeaders(),
      },
      body: formData,
    });
    const data = await this.handleResponse<any>(response);
    return {
      success: !!data.success,
      data: undefined,
      message: data.success ? 'Vault item created successfully' : (data.message || 'Failed to create vault item')
    };
  }


  // 6. Ship International Order
  async shipInternationalOrder(orderId: string, shippingData: ShipInternationalRequest): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/international-orders/${orderId}/ship`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(shippingData),
      });

      await this.handleResponse<void>(response);
      return {
        success: true,
        data: undefined,
        message: 'International order shipped successfully'
      };
    } catch (error) {
      console.error('Error shipping international order:', error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility (now using real API)
  async validateVaultId(vaultId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/accepted-items/${vaultId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse<any>(response);
    } catch (error) {
      console.error('Error fetching shipping order details:', error);
      throw error;
    }
  }

  async enterVaultItem(vaultId: string, itemData: any): Promise<ApiResponse<void>> {
    // This would use the addVaultItem method above
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: undefined,
          message: 'Item entered in vault successfully'
        });
      }, 1500);
    });
  }

  async getShippingOrderDetails(shippingOrderId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/international-orders/${shippingOrderId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse<any>(response);
    } catch (error) {
      console.error('Error fetching shipping order details:', error);
      throw error;
    }
  }

  async updateShippingOrder(shippingOrderId: string, updateData: any): Promise<ApiResponse<void>> {
    // This would use the shipInternationalOrder method above
    return this.shipInternationalOrder(shippingOrderId, updateData);
  }

  async createInventoryItem(itemData: any): Promise<ApiResponse<void>> {
    // itemData should include all fields and images as File or File[]
    const formData = new FormData();
    formData.append('sub_category', itemData.subCategory || '');
    for (const key in itemData) {
      if (key === 'images' && Array.isArray(itemData.images)) {
        itemData.images.forEach((file: File) => formData.append('images', file));
      } else if (key === 'images' && itemData.images instanceof File) {
        formData.append('images', itemData.images);
      } else {
        formData.append(key, itemData[key]);
      }
    }
    try {
      const response = await fetch('http://localhost:4000/api/v1/inventory', {
        method: 'POST',
        headers: {
          ...this.getMultiPartAuthHeaders(),
          // Let browser set Content-Type for FormData
          // Remove Content-Type if present
        },
        body: formData,
      });
      const data = await this.handleResponse<any>(response);
      return {
        success: !!data.success,
        data: undefined,
        message: data.success ? 'Inventory item created successfully' : (data.message || 'Failed to create inventory item')
      };
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  }

  async getSupportQueries(): Promise<ApiResponse<any[]>> {
    // Mock implementation - replace with actual API call when endpoint is available
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: []
        });
      }, 1000);
    });
  }

  async replyToSupportQuery(queryId: string, replyData: any): Promise<ApiResponse<void>> {
    // Mock implementation - replace with actual API call when endpoint is available
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: undefined,
          message: 'Reply sent successfully'
        });
      }, 1500);
    });
  }
}

export const adminApiService = new AdminApiService();
export default adminApiService;