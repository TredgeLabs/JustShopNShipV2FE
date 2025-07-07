import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, ExternalLink, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import OrderItemCard from '../components/orders/OrderItemCard';
import OrderSummaryCard from '../components/orders/OrderSummaryCard';

interface LocalOrderItem {
  id: string;
  name: string;
  image: string;
  inventoryLink: string;
  onlineLink: string;
  status: 'delivered' | 'pending' | 'cancelled' | 'processing';
  price: number;
  color: string;
  size: string;
  quantity: number;
}

interface LocalOrder {
  id: string;
  customerName: string;
  status: 'completed' | 'partial' | 'pending' | 'cancelled';
  orderDate: string;
  totalItems: number;
  deliveredItems: number;
  partialRefundAmount: number;
  totalAmount: number;
  items: LocalOrderItem[];
  notes?: string;
  estimatedDelivery?: string;
  seller?: string;
}

const LocalOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<LocalOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock order data - replace with actual API call
        const mockOrder: LocalOrder = {
          id: orderId,
          customerName: 'John Doe',
          status: 'completed',
          orderDate: '2024-01-20',
          totalItems: 3,
          deliveredItems: 3,
          partialRefundAmount: 0,
          totalAmount: 15200,
          seller: 'Multiple Sellers',
          estimatedDelivery: '2024-01-25',
          notes: 'Customer requested express processing for wedding event.',
          items: [
            {
              id: 'DI-001',
              name: 'Traditional Silk Saree - Royal Blue',
              image: 'https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/saree-royal-blue',
              onlineLink: 'https://craftsvilla.com/saree-royal-blue',
              status: 'delivered',
              price: 3500,
              color: 'Royal Blue',
              size: 'Free Size',
              quantity: 1
            },
            {
              id: 'DI-002',
              name: 'Ayurvedic Skincare Gift Set',
              image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/ayurvedic-skincare',
              onlineLink: 'https://nykaa.com/ayurvedic-skincare',
              status: 'delivered',
              price: 2100,
              color: 'Natural',
              size: 'Standard',
              quantity: 1
            },
            {
              id: 'DI-003',
              name: 'Handcrafted Silver Jewelry Set',
              image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/silver-jewelry',
              onlineLink: 'https://tanishq.co.in/silver-jewelry',
              status: 'delivered',
              price: 9600,
              color: 'Silver',
              size: 'Adjustable',
              quantity: 1
            }
          ]
        };
        
        setOrder(mockOrder);
      } catch (err) {
        setError('Failed to load order details. Please try again.');
        console.error('Error loading order:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  const handleCorrectOrder = () => {
    navigate(`/order-correction/${orderId}`);
  };

  const handleRefreshOrder = () => {
    // Reload order data
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The order you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/domestic-orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/domestic-orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Domestic Orders</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefreshOrder}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={handleCorrectOrder}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Correct Order</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">Domestic order details and status</p>
            </div>
            <OrderStatusBadge status={order.status} type="local" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <OrderSummaryCard
              orderId={order.id}
              customerName={order.customerName}
              orderDate={order.orderDate}
              totalItems={order.totalItems}
              totalAmount={order.totalAmount}
              status={order.status}
              type="local"
            />

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                <span className="text-sm text-gray-600">
                  {order.deliveredItems} of {order.totalItems} items delivered
                </span>
              </div>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <OrderItemCard
                    key={item.id}
                    item={{
                      ...item,
                      url: item.onlineLink
                    }}
                    showStatus={true}
                  />
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Items Received at Vault</p>
                    <p className="text-sm text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order Completed</p>
                    <p className="text-sm text-gray-600">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{order.totalAmount.toLocaleString()}</span>
                </div>
                
                {order.partialRefundAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund:</span>
                    <span className="font-medium text-green-600">-₹{order.partialRefundAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{(order.totalAmount - order.partialRefundAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Seller</p>
                  <p className="font-medium">{order.seller || 'Multiple Sellers'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Order Type</p>
                  <p className="font-medium">Domestic Order</p>
                </div>
                
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                )}
                
                {order.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-medium text-sm">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleCorrectOrder}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Correct Order</span>
                </button>
                
                <a
                  href="/contact-support"
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalOrderDetailsPage;