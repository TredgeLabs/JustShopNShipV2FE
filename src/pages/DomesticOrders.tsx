import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService, LocalOrder } from '../api/services/orderService';
import { getStatusConfig } from '../components/orders/OrderStatusBadge';
import {
  ShoppingCart,
  Eye,
  ExternalLink,
  Edit3,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';


const DomesticOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDomesticOrders = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await orderService.getLocalOrders();

        if (response.success && response.orders) {
          setOrders(response.orders);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        setError('Error loading orders. Please try again.');
        console.error('Error loading domestic orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDomesticOrders();
  }, []);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleCorrectOrder = (orderId: string) => {
    console.log('Requesting order correction for:', orderId);
    navigate(`/order-correction/${orderId}`);
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/local-order/${orderId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDeliveredItemsCount = (order: LocalOrder) => {
    return order.local_order_items?.filter(item => item.status !== 'denied' && item.status !== 'pending').length || 0;
  };

  const getTotalItemsCount = (order: LocalOrder) => {
    return order.local_order_items?.length || 0;
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your domestic orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
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
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Domestic Orders</h1>
          </div>
          <p className="text-gray-600">
            Track and manage your domestic orders placed through JustShopAndShip within India.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Accepted Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.reduce((total, order) => total + getDeliveredItemsCount(order), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.order_status === 'created' || order.order_status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Denied Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.order_status === 'denied').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(order.order_status, 'local').color}`}>
                      {getStatusConfig(order.order_status, 'local').text}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {getDeliveredItemsCount(order)} of {getTotalItemsCount(order)} items accepted
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{parseFloat(order.total_price.toLocaleString())}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleOrderExpansion(order.id.toString())}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedOrders.has(order.id.toString()) ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items (Expandable) */}
              {expandedOrders.has(order.id.toString()) && order.local_order_items && (
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Order Items</h4>
                    {(order.order_status === 'denied') && <button
                      onClick={() => handleCorrectOrder(order.id.toString())}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Correct Your Order</span>
                    </button>}

                    <button
                      onClick={() => handleViewDetails(order.id.toString())}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.local_order_items.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          {item.image_link && (
                            <img
                              src={item.image_link}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}

                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm leading-tight mb-2">
                              {item.product_name}
                            </h5>

                            <div className="flex items-center space-x-2 mb-2">
                              {React.createElement(getStatusConfig(item.status, 'local_item').icon)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusConfig(item.status, 'local_item').color}`}>
                                {getStatusConfig(item.status, 'local_item').text}
                              </span>
                            </div>

                            <p className="text-sm font-semibold text-gray-900 mb-3">
                              ₹{parseFloat(item.price.toLocaleString())}
                            </p>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(order.id.toString())}
                                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                              >
                                <Eye className="h-3 w-3" />
                                <span>Details</span>
                              </button>
                              <a
                                href={item.product_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-800"
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span>Product</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No domestic orders found</h3>
            <p className="text-gray-600">Start shopping to see your orders here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomesticOrders;