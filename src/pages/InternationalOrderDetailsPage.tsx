import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, InternationalOrder } from '../api/services/orderService';
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Truck,
  Package,
  Calendar,
  Weight,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import OrderStatusBadge, { getStatusConfig } from '../components/orders/OrderStatusBadge';


const InternationalOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<InternationalOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await orderService.getInternationalOrderDetails(orderId);

        if (response.success && response.data) {
          response.data.international_order_items?.map(item => {
            if (item.imageUrls) {
              item.imageUrls = item.imageUrls.map(url => url.startsWith('http') ? url : `http://localhost:4000${url}`);
            }
          });
          setOrder(response.data);
        } else {
          setError('International order not found');
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

  const handleRefreshOrder = () => {
    // Reload order data
    window.location.reload();
  };

  const getTotalWeight = () => {
    return order ? order.shipment_weight_gm : 0; // Convert grams to kg
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

              {order.tracking_link && (
                <a
                  href={order.tracking_link}
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
              <h1 className="text-3xl font-bold text-gray-900">International Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">International shipping order details</p>
            </div>
            <OrderStatusBadge status={order.shipping_status} type="international" />
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
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold text-gray-900">#{order.id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Created Date</p>
                    <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="font-semibold text-gray-900">₹{parseFloat(order.total_cost).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Vault Items</p>
                    <p className="font-semibold text-gray-900">{order.international_order_items?.length || 0}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Weight</p>
                    <p className="font-semibold text-gray-900">{getTotalWeight().toFixed(1)} kg</p>
                  </div>

                  {order.tracking_id && (
                    <div>
                      <p className="text-sm text-gray-600">Tracking ID</p>
                      <p className="font-semibold text-gray-900">{order.tracking_id}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipped Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Shipped Items</h2>
                <span className="text-sm text-gray-600">
                  Total Weight: {getTotalWeight().toFixed(1)} kg
                </span>
              </div>


              {order.international_order_items && order.international_order_items.length > 0 ? (
                <div className="space-y-4">
                  {order.international_order_items.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="p-5">
                        <div className="flex items-start space-x-4">
                          {/* Image Gallery Section */}
                          <div className="flex-shrink-0">
                            {item.imageUrls && item.imageUrls.length > 0 ? (
                              <div className="relative">
                                <img
                                  src={item.imageUrls[0]}
                                  alt={item.name}
                                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                />
                                {item.imageUrls.length > 1 && (
                                  <button
                                    onClick={() => {
                                      // Add your modal/gallery logic here
                                      console.log('Show all images:', item.imageUrls);
                                    }}
                                    className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-opacity-80 transition-all"
                                  >
                                    +{item.imageUrls.length - 1} more
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Item Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-gray-900 text-lg leading-tight">
                                  {item.name}
                                </h5>

                                {item.description && (
                                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                  <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-xs text-gray-500 flex items-center">
                                      <Weight className="h-3 w-3 mr-1" />
                                      Weight
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                      {(item.weight / 1000).toFixed(2)} kg
                                    </p>
                                  </div>

                                  <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-xs text-gray-500 flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Added
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  </div>

                                  <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-xs text-gray-500 flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Status
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                      {getStatusConfig(item.status, 'vault_item').text}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No items found in this shipment</p>
                </div>
              )}
            </div>

            {/* Shipping Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Timeline</h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order Processed</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${['shipped', 'in_transit', 'delivered'].includes(order.shipping_status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                    }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Shipped</p>
                    {['shipped', 'in_transit', 'delivered'].includes(order.shipping_status) && (
                      <p className="text-sm text-gray-600">{new Date(order.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${['in_transit', 'delivered'].includes(order.shipping_status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                    }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">In Transit</p>
                    {['in_transit', 'customs', 'delivered'].includes(order.shipping_status) && (
                      <p className="text-sm text-gray-600">Package in transit</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${order.shipping_status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
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
                <div>
                  <p className="text-sm text-gray-600">Vault ID</p>
                  <p className="font-medium">{order.vault_id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Shipping Address ID</p>
                  <p className="font-medium">{order.shipping_address_id}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Weight</p>
                    <p className="font-medium">{getTotalWeight().toFixed(1)} kg</p>
                  </div>
                </div>

                {order.tracking_id && (
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tracking ID</p>
                      <p className="font-medium">{order.tracking_id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Costs</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee:</span>
                  <span className="font-medium">₹{parseFloat(order.shipping_cost).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Cost:</span>
                  <span className="font-medium">₹{parseFloat(order.storage_cost).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium">₹{parseFloat(order.platform_fee).toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Cost:</span>
                    <span>₹{parseFloat(order.total_cost).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                {order.tracking_link && (
                  <a
                    href={order.tracking_link}
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