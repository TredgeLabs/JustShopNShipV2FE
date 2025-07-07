import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  MapPin, 
  Truck, 
  Calendar,
  Package,
  Plane
} from 'lucide-react';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import OrderItemCard from '../components/orders/OrderItemCard';
import OrderSummaryCard from '../components/orders/OrderSummaryCard';

interface InternationalOrderItem {
  id: string;
  name: string;
  images: string[];
  weight: number;
  orderDetailsLink: string;
  originalPrice: number;
  color: string;
  size: string;
  quantity: number;
}

interface InternationalOrder {
  id: string;
  transitId: string;
  customerName: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'customs' | 'delivered' | 'exception';
  trackingLink: string;
  totalShippingPrice: number;
  shippingDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  destination: string;
  carrier: string;
  items: InternationalOrderItem[];
  notes?: string;
  customsInfo?: {
    declarationNumber: string;
    customsValue: number;
    dutyPaid: number;
  };
}

const InternationalOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<InternationalOrder | null>(null);
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
        const mockOrder: InternationalOrder = {
          id: orderId,
          transitId: 'JSS-INT-2024-001',
          customerName: 'John Doe',
          status: 'delivered',
          trackingLink: 'https://tracking.example.com/JSS-INT-2024-001',
          totalShippingPrice: 125.50,
          shippingDate: '2024-01-15',
          estimatedDelivery: '2024-01-25',
          actualDelivery: '2024-01-24',
          destination: 'Toronto, Canada',
          carrier: 'DHL Express',
          notes: 'Express delivery requested for urgent delivery.',
          customsInfo: {
            declarationNumber: 'CD-2024-001234',
            customsValue: 5600,
            dutyPaid: 280
          },
          items: [
            {
              id: 'SI-001',
              name: 'Traditional Silk Saree - Royal Blue',
              images: [
                'https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=200',
                'https://images.pexels.com/photos/8148580/pexels-photo-8148580.jpeg?auto=compress&cs=tinysrgb&w=200'
              ],
              weight: 0.8,
              orderDetailsLink: '/local-order/DO-001',
              originalPrice: 3500,
              color: 'Royal Blue',
              size: 'Free Size',
              quantity: 1
            },
            {
              id: 'SI-002',
              name: 'Ayurvedic Skincare Gift Set',
              images: [
                'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=200'
              ],
              weight: 1.2,
              orderDetailsLink: '/local-order/DO-001',
              originalPrice: 2100,
              color: 'Natural',
              size: 'Standard',
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

  const handleRefreshOrder = () => {
    // Reload order data
    window.location.reload();
  };

  const getTotalWeight = () => {
    return order?.items.reduce((sum, item) => sum + item.weight * item.quantity, 0) || 0;
  };

  const getTotalValue = () => {
    return order?.items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0) || 0;
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
            onClick={() => navigate('/international-orders')}
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
              onClick={() => navigate('/international-orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to International Orders</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefreshOrder}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              
              {order.trackingLink && (
                <a
                  href={order.trackingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Track Package</span>
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transit ID: {order.transitId}</h1>
              <p className="text-gray-600 mt-1">International shipping order details</p>
            </div>
            <OrderStatusBadge status={order.status} type="international" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <OrderSummaryCard
              orderId={order.transitId}
              customerName={order.customerName}
              orderDate={order.shippingDate}
              totalItems={order.items.length}
              totalAmount={order.totalShippingPrice}
              status={order.status}
              destination={order.destination}
              carrier={order.carrier}
              trackingNumber={order.transitId}
              estimatedDelivery={order.estimatedDelivery}
              type="international"
            />

            {/* Shipped Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Shipped Items</h2>
                <span className="text-sm text-gray-600">
                  Total Weight: {getTotalWeight().toFixed(1)} kg
                </span>
              </div>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <OrderItemCard
                    key={item.id}
                    item={{
                      ...item,
                      image: item.images[0],
                      price: item.originalPrice,
                      url: item.orderDetailsLink
                    }}
                    showWeight={true}
                  />
                ))}
              </div>
            </div>

            {/* Shipping Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order Processed</p>
                    <p className="text-sm text-gray-600">{new Date(order.shippingDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    ['shipped', 'in-transit', 'customs', 'delivered'].includes(order.status) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Shipped</p>
                    {['shipped', 'in-transit', 'customs', 'delivered'].includes(order.status) && (
                      <p className="text-sm text-gray-600">{new Date(order.shippingDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    ['in-transit', 'customs', 'delivered'].includes(order.status) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">In Transit</p>
                    {['in-transit', 'customs', 'delivered'].includes(order.status) && (
                      <p className="text-sm text-gray-600">Package in transit</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Delivered</p>
                    {order.actualDelivery ? (
                      <p className="text-sm text-gray-600">{new Date(order.actualDelivery).toLocaleDateString()}</p>
                    ) : (
                      <p className="text-sm text-gray-600">ETA: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-medium">{order.destination}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Carrier</p>
                    <p className="font-medium">{order.carrier}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Weight</p>
                    <p className="font-medium">{getTotalWeight().toFixed(1)} kg</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Costs</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee:</span>
                  <span className="font-medium">${(order.totalShippingPrice * 0.8).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance & Handling:</span>
                  <span className="font-medium">${(order.totalShippingPrice * 0.2).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Shipping:</span>
                    <span>${order.totalShippingPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customs Information */}
            {order.customsInfo && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customs Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Declaration Number</p>
                    <p className="font-medium">{order.customsInfo.declarationNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Declared Value</p>
                    <p className="font-medium">₹{order.customsInfo.customsValue.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Duty Paid</p>
                    <p className="font-medium">₹{order.customsInfo.dutyPaid.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {order.trackingLink && (
                  <a
                    href={order.trackingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Track Package</span>
                  </a>
                )}
                
                <a
                  href="/contact-support"
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
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

export default InternationalOrderDetailsPage;