import apiClient from '../apiClient';
import { ApiResponse } from '../config';

// Order status enum
export type OrderStatus = 'created' | 'pending' | 'processing' | 'completed' | 'shipped' | 'delivered' | 'cancelled' | 'denied';

// Local Order Item interface (matching backend structure)
export interface LocalOrderItem {
  id: number;
  local_order_id: number;
  source_type: string;
  product_name: string;
  product_link: string;
  inventory_item_id?: number | null;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
  final_price: number;
  status: string;
  deny_reasons?: number[] | null;
  image_link?: string;
  createdAt: string;
  updatedAt: string;
  isEditing: boolean;
  hasError?: boolean; // For frontend use
  errorMessage?: string; // For frontend use
}

// Local Order interface (matching backend structure)
export interface LocalOrder {
  id: number;
  user_id: number;
  vault_id?: number | null;
  order_status: string;
  payment_status: string;
  total_price: number;
  platform_fee: string;
  admin_notes?: string;
  createdAt: string;
  updatedAt: string;
  local_order_items?: LocalOrderItem[];
}

// International Order Item interface
export interface InternationalOrderItem {
  id: number;
  international_order_id: number;
  name: string;
  imageUrls?: string[];
  color?: string;
  size?: string;
  quantity: number;
  price: number;
  product_link: string;
  status: string;
  inventory_item_id?: number | null;
  vault_item_id: number;
  createdAt: string;
  updatedAt: string;
}

// International Order interface (matching backend structure)
export interface InternationalOrder {
  id: number;
  user_id: number;
  vault_id: number;
  vaultId: number;
  shipping_address_id: number;
  shipment_weight_gm: number;
  shipping_cost: string;
  storage_cost: string;
  platform_fee: string;
  total_cost: string;
  tracking_id?: string;
  tracking_link?: string;
  shipping_status: string;
  createdAt: string;
  updatedAt: string;
  actualDelivery?: string;
  estimatedDelivery?: string;
  international_order_items?: InternationalOrderItem[];
  selectedAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phone?: string;
  };
}

// Create local order request interface
export interface CreateLocalOrderRequest {
  orderData: {
    order_status: string;
    payment_status: string;
    total_price: number;
    platform_fee: number;
    admin_notes?: string;
  };
  items: Array<{
    source_type: string;
    product_name: string;
    product_link: string;
    color?: string;
    size?: string;
    quantity: number;
    price: number;
    final_price: number;
    status: string;
    deny_reasons?: number[];
    image_link?: string;
  }>;
}

export interface UpdateLocalOrderCorrectionRequest {
  orderData: {
    order_status: string;
    payment_status: string;
    total_price: number;
    platform_fee: number;
    admin_notes?: string;
  };
  items: CreateLocalOrderRequest['items'];
}


// Create international order request interface
export interface CreateInternationalOrderRequest {
  orderData: {
    vault_id: number;
    shipping_address_id: number;
    shipment_weight_gm: number;
    shipping_cost: number;
    storage_cost: number;
    platform_fee: number;
    total_cost: number;
    tracking_id?: string;
    tracking_link?: string;
    shipping_status: string;
  };
  vaultItemIds: number[];
}

// Order list response interfaces
export interface LocalOrderListResponse {
  success: boolean;
  orders: LocalOrder[];
}

export interface InternationalOrderListResponse {
  success: boolean;
  orders: InternationalOrder[];
}

// Order details response interfaces
export interface LocalOrderDetailsResponse {
  success: boolean;
  order: LocalOrder;
}

export interface InternationalOrderDetailsResponse {
  success: boolean;
  data: InternationalOrder;
}

class OrderService {
  /**
   * Create a new local order
   */
  async createLocalOrder(orderData: CreateLocalOrderRequest): Promise<ApiResponse<LocalOrder>> {
    try {
      const response = await apiClient.post<{ success: boolean; order: LocalOrder }>('local-orders', orderData);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.order
        };
      }
      
      throw new Error('Failed to create local order');
    } catch (error) {
      console.error('Error creating local order:', error);
      throw error;
    }
  }

  async submitLocalOrderCorrection(
    orderId: string,
    payload: UpdateLocalOrderCorrectionRequest
  ): Promise<ApiResponse<LocalOrder>> {
    const response = await apiClient.put<{ success: boolean; order: LocalOrder }>(
      `local-orders/${orderId}`,
      payload
    );

    if (response.success && response.data) {
      return { success: true, data: response.data.order };
    }

    throw new Error('Failed to submit order correction');
  }


  /**
   * Create a new international order
   */
  async createInternationalOrder(orderData: CreateInternationalOrderRequest): Promise<ApiResponse<InternationalOrder>> {
    try {
      const response = await apiClient.post<{ success: boolean; order: InternationalOrder }>('international-orders', orderData);

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.order
        };
      }

      throw new Error('Failed to create international order');
    } catch (error) {
      console.error('Error creating international order:', error);
      throw error;
    }
  }

  /**
   * Get list of local orders for the current user
   */
  async getLocalOrders(): Promise<LocalOrderListResponse> {
    try {
      const response = await apiClient.get<LocalOrderListResponse>('local-orders');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching local orders:', error);
      throw error;
    }
  }

  /**
   * Get list of international orders for the current user
   */
  async getInternationalOrders(): Promise<InternationalOrderListResponse> {
    try {
      const response = await apiClient.get<InternationalOrderListResponse>('international-orders');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching international orders:', error);
      throw error;
    }
  }

  /**
   * Get local order details by ID
   */
  async getLocalOrderDetails(orderId: string): Promise<LocalOrderDetailsResponse> {
    try {
      const response = await apiClient.get<LocalOrderDetailsResponse>(`local-orders/${orderId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching local order details:', error);
      throw error;
    }
  }

  /**
   * Get international order details by ID
   */
  async getInternationalOrderDetails(orderId: string): Promise<InternationalOrderDetailsResponse> {
    try {
      const response = await apiClient.get<InternationalOrderDetailsResponse>(`international-orders/${orderId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching international order details:', error);
      throw error;
    }
  }

  /**
   * Update order information
   */
  async updateOrder(orderId: string, updateData: Partial<LocalOrder>): Promise<ApiResponse<LocalOrder>> {
    try {
      const response = await apiClient.put<LocalOrder>(`local-orders/${orderId}`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(`local-orders/${orderId}/cancel`, { reason });
      return response;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  /**
   * Get order statistics for dashboard
   */
  async getOrderStats(): Promise<ApiResponse<{
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    totalSaved: number;
  }>> {
    try {
      const response = await apiClient.get('/orders/stats');
      return response;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
export default orderService;