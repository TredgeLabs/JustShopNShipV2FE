import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../config';

// Order status enum
export type OrderStatus = 'pending' | 'ordered' | 'received' | 'shipped' | 'delivered' | 'cancelled';

// Order interface
export interface Order {
  id: string;
  userId: string;
  productName: string;
  productUrl: string;
  seller: string;
  price: number;
  currency: string;
  status: OrderStatus;
  orderDate: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
  images?: string[];
}

// Create order request interface
export interface CreateOrderRequest {
  productName: string;
  productUrl: string;
  seller: string;
  price: number;
  currency: string;
  notes?: string;
  quantity?: number;
}

// Order list response interface
export interface OrderListResponse {
  orders: Order[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Tracking information interface
export interface TrackingInfo {
  orderId: string;
  trackingNumber: string;
  status: OrderStatus;
  events: TrackingEvent[];
  estimatedDelivery?: Date;
}

export interface TrackingEvent {
  date: Date;
  status: string;
  location: string;
  description: string;
}

class OrderService {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.post<Order>(ENDPOINTS.ORDERS.CREATE, orderData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get list of orders for the current user
   */
  async getOrders(page = 1, limit = 10, status?: OrderStatus): Promise<ApiResponse<OrderListResponse>> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
      };

      if (status) {
        params.status = status;
      }

      const response = await apiClient.get<OrderListResponse>(ENDPOINTS.ORDERS.LIST, params);
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Get order details by ID
   */
  async getOrderDetails(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.get<Order>(ENDPOINTS.ORDERS.DETAILS(orderId));
      return response;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  /**
   * Update order information
   */
  async updateOrder(orderId: string, updateData: Partial<Order>): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.put<Order>(ENDPOINTS.ORDERS.UPDATE(orderId), updateData);
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
      const response = await apiClient.post<void>(ENDPOINTS.ORDERS.CANCEL(orderId), { reason });
      return response;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  /**
   * Track an order
   */
  async trackOrder(orderId: string): Promise<ApiResponse<TrackingInfo>> {
    try {
      const response = await apiClient.get<TrackingInfo>(ENDPOINTS.ORDERS.TRACK(orderId));
      return response;
    } catch (error) {
      console.error('Error tracking order:', error);
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