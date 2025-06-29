import { ApiResponse } from '../../api/config';

// Admin-specific API service
class AdminApiService {
  private baseUrl = '/api/admin';

  // Orders API
  async getLocalOrders(): Promise<ApiResponse<any[]>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 'LO-001',
              orderDate: '2024-01-25',
              userName: 'John Doe',
              userEmail: 'john@example.com',
              location: 'Mumbai, India',
              items: 'Traditional Silk Saree, Ayurvedic Skincare Set',
              status: 'pending',
              totalAmount: 5600,
              itemCount: 2
            },
            {
              id: 'LO-002',
              orderDate: '2024-01-24',
              userName: 'Jane Smith',
              userEmail: 'jane@example.com',
              location: 'Delhi, India',
              items: 'Handcrafted Jewelry, Organic Spices',
              status: 'processing',
              totalAmount: 9700,
              itemCount: 2
            }
          ]
        });
      }, 1000);
    });
  }

  async getInternationalOrders(): Promise<ApiResponse<any[]>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 'IO-001',
              orderDate: '2024-01-20',
              userName: 'Mike Johnson',
              userEmail: 'mike@example.com',
              location: 'Toronto, Canada',
              items: 'Silk Saree, Silver Jewelry',
              shippingLink: 'https://tracking.dhl.com/TRK123456',
              status: 'shipped',
              totalAmount: 8500,
              itemCount: 2
            }
          ]
        });
      }, 1000);
    });
  }

  async getOrderDetails(orderId: string): Promise<ApiResponse<any>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: orderId,
            orderDate: '2024-01-25',
            userName: 'John Doe',
            userEmail: 'john@example.com',
            userPhone: '+1-555-123-4567',
            vaultAddress: {
              name: 'John Doe',
              vaultId: 'JSS-UD-2024-001',
              street: 'JustShopAndShip Warehouse',
              address: 'Plot No. 45, Sector 18, Gurgaon',
              city: 'Gurgaon, Haryana 122001',
              country: 'India',
              phone: '+91 9876543210'
            },
            items: [
              {
                id: 'item-1',
                name: 'Traditional Silk Saree - Royal Blue',
                cost: 3500,
                link: 'https://example.com/saree',
                size: 'Free Size',
                quantity: 1,
                color: 'Royal Blue',
                actualPrice: 3500,
                status: 'pending'
              },
              {
                id: 'item-2',
                name: 'Ayurvedic Skincare Gift Set',
                cost: 2100,
                link: 'https://example.com/skincare',
                size: 'Standard',
                quantity: 1,
                color: 'Natural',
                actualPrice: 2100,
                status: 'pending'
              }
            ]
          }
        });
      }, 1000);
    });
  }

  async submitOrderEvaluation(orderId: string, evaluationData: any): Promise<ApiResponse<void>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Submitting evaluation for order:', orderId, evaluationData);
        resolve({
          success: true,
          data: undefined,
          message: 'Order evaluation submitted successfully'
        });
      }, 1500);
    });
  }

  // Vault Entry API
  async validateVaultId(vaultId: string): Promise<ApiResponse<any>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = vaultId.startsWith('JSS-UD-');
        if (isValid) {
          resolve({
            success: true,
            data: {
              vaultId,
              userName: 'John Doe',
              userEmail: 'john@example.com',
              userPhone: '+1-555-123-4567',
              transitItems: [
                {
                  id: 'transit-1',
                  name: 'Traditional Silk Saree',
                  orderId: 'LO-001',
                  expectedQuantity: 1,
                  color: 'Royal Blue',
                  size: 'Free Size'
                }
              ]
            }
          });
        } else {
          resolve({
            success: false,
            data: null,
            error: 'Invalid Vault ID'
          });
        }
      }, 1000);
    });
  }

  async enterVaultItem(vaultId: string, itemData: any): Promise<ApiResponse<void>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Entering vault item:', vaultId, itemData);
        resolve({
          success: true,
          data: undefined,
          message: 'Item entered in vault successfully'
        });
      }, 1500);
    });
  }

  // Shipping Order Update API
  async getShippingOrderDetails(shippingOrderId: string): Promise<ApiResponse<any>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: shippingOrderId,
            userName: 'Mike Johnson',
            userEmail: 'mike@example.com',
            selectedAddress: {
              name: 'Mike Johnson',
              line1: '123 Main Street',
              line2: 'Apt 4B',
              city: 'Toronto',
              state: 'ON',
              zipCode: 'M5V 3A8',
              country: 'Canada',
              phone: '+1-416-555-0123'
            },
            vaultItems: [
              {
                id: 'vault-1',
                name: 'Traditional Silk Saree',
                image: 'https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=200',
                vaultItemId: 'VI-001',
                weight: 0.8
              },
              {
                id: 'vault-2',
                name: 'Silver Jewelry Set',
                image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=200',
                vaultItemId: 'VI-002',
                weight: 0.3
              }
            ],
            totalWeight: 1.1,
            currentShippingLink: '',
            currentShippingId: ''
          }
        });
      }, 1000);
    });
  }

  async updateShippingOrder(shippingOrderId: string, updateData: any): Promise<ApiResponse<void>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Updating shipping order:', shippingOrderId, updateData);
        resolve({
          success: true,
          data: undefined,
          message: 'Shipping order updated successfully'
        });
      }, 1500);
    });
  }

  // Inventory API
  async createInventoryItem(itemData: any): Promise<ApiResponse<void>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Creating inventory item:', itemData);
        resolve({
          success: true,
          data: undefined,
          message: 'Inventory item created successfully'
        });
      }, 1500);
    });
  }

  // Contact Support API
  async getSupportQueries(): Promise<ApiResponse<any[]>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 'query-1',
              userName: 'Alice Brown',
              userEmail: 'alice@example.com',
              subject: 'Shipping Delay Inquiry',
              message: 'My order has been delayed for over a week. Can you please provide an update?',
              priority: 'high',
              status: 'pending',
              submittedAt: '2024-01-25T10:30:00Z'
            },
            {
              id: 'query-2',
              userName: 'Bob Wilson',
              userEmail: 'bob@example.com',
              subject: 'Product Quality Issue',
              message: 'The item I received is not as described. I would like to return it.',
              priority: 'medium',
              status: 'pending',
              submittedAt: '2024-01-24T15:45:00Z'
            }
          ]
        });
      }, 1000);
    });
  }

  async replyToSupportQuery(queryId: string, replyData: any): Promise<ApiResponse<void>> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Replying to support query:', queryId, replyData);
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