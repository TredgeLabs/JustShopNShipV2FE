import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, ExternalLink, Loader2, AlertCircle, RefreshCw, User, Calendar, DollarSign } from 'lucide-react';
import { orderService, LocalOrder, ORDER_STATUSES } from '../api/services/orderService';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import OrderItemCard from '../components/orders/OrderItemCard';


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
        const response = await orderService.getLocalOrderDetails(orderId);
        
        if (response.success && response.order) {
          setOrder(response.order);
        } else {
          setError('Order not found');
        }
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

  const getDeliveredItemsCount = () => {
    return order?.local_order_items?.filter(item => item.status !== ORDER_STATUSES.denied && item.status !== ORDER_STATUSES.pending).length || 0;
  };

  const getTotalItemsCount = () => {
    return order?.local_order_items?.length || 0;
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

              {(order.order_status === ORDER_STATUSES.denied) && <button
                onClick={handleCorrectOrder}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Correct Order</span>
              </button>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">Domestic order details and status</p>
            </div>
            <OrderStatusBadge status={order.order_status} type="local" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold text-gray-900">#{order.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-gray-900">₹{parseFloat(order.total_price.toLocaleString()).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-semibold text-gray-900 capitalize">{order.payment_status}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Platform Fee</p>
                    <p className="font-semibold text-gray-900">₹{parseFloat(order.platform_fee).toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="font-semibold text-gray-900">{getTotalItemsCount()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                <span className="text-sm text-gray-600">
                  {getDeliveredItemsCount()} of {getTotalItemsCount()} items accepted
                </span>
              </div>

              {order.local_order_items && order.local_order_items.length > 0 ? (
                <div className="space-y-4">
                  {order.local_order_items.map((item) => (
                    <OrderItemCard
                      key={item.id}
                      item={{
                        id: item.id.toString(),
                        name: item.product_name,
                        image: item.image_link || '',
                        color: item.color || 'N/A',
                        size: item.size || 'N/A',
                        quantity: item.quantity,
                        price: parseFloat(item.price.toLocaleString()),
                        status: item.status,
                        url: item.product_link
                      }}
                      showStatus={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items found in this order</p>
                </div>
              )}
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {order.order_status !== ORDER_STATUSES.created && (
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${order.order_status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Order {order.order_status}</p>
                      <p className="text-sm text-gray-600">{new Date(order.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
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
                  <span className="font-medium">₹{parseFloat(order.total_price.toLocaleString()).toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium">₹{parseFloat(order.platform_fee).toLocaleString()}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{(parseFloat(order.total_price.toLocaleString()) + parseFloat(order.platform_fee)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <p className="font-medium capitalize">{order.order_status}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium capitalize">{order.payment_status}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">{new Date(order.updatedAt).toLocaleDateString()}</p>
                </div>
                
                {order.admin_notes && (
                  <div>
                    <p className="text-sm text-gray-600">Admin Notes</p>
                    <p className="font-medium text-sm">{order.admin_notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                {(order.order_status === ORDER_STATUSES.denied) && <button
                  onClick={handleCorrectOrder}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Correct Order</span>
                </button>}

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