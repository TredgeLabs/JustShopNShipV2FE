import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints'; // Adjust the path if ENDPOINTS is defined elsewhere

export interface InventoryApiItem {
  id: number;
  parent_sku?: string | null;
  name: string;
  description: string;
  brand: string;
  category: string;
  sub_category: string;
  material: string;
  size?: string | null;
  color?: string | null;
  price: string;
  offer_price: string;
  offer_percentage: number;
  quantity: number;
  weight_gm: number;
  image_urls: string[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryListResponse {
  success: boolean;
  items: InventoryApiItem[];
}

export interface InventoryItemDetailsResponse {
  success: boolean;
  item: InventoryApiItem;
}

export const inventoryService = {
  async getInventoryList(): Promise<InventoryListResponse> {
    const response = await apiClient.get<InventoryListResponse>(ENDPOINTS.INVENTORY.GET_INVENTORY);
    if (response) {
      if (response.data) {
        return response.data as InventoryListResponse;
      } else {
        throw new Error('Response does not contain inventory data');
      }
    } else {
      throw new Error('Failed to fetch inventory list');
    }
  },
  async getInventoryItemDetails(itemId: string | number): Promise<InventoryItemDetailsResponse> {
    const response = await apiClient.get<InventoryItemDetailsResponse>(`inventory/${itemId}`);
    return response.data;
  },
};
