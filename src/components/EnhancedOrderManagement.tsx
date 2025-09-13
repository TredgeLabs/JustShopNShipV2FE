import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Truck, Plane, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { getStatusConfig } from '../components/orders/OrderStatusBadge';
import { orderService, LocalOrder, InternationalOrder } from '../api/services/orderService';

const EnhancedOrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [localOrders, setLocalOrders] = useState<LocalOrder[]>([]);
  const [internationalOrders, setInternationalOrders] = useState<InternationalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [localResponse, internationalResponse] = await Promise.all([
        orderService.getLocalOrders().catch(() => ({ success: false, orders: [] })),
        orderService.getInternationalOrders().catch(() => ({ success: false, orders: [] }))
      ]);

      if (localResponse.success) {
        setLocalOrders(localResponse.orders || []);
      }

      if (internationalResponse.success) {
        setInternationalOrders(internationalResponse.orders || []);
      }
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusClick = (status: string) => {
    if (status === 'created' || status === 'pending' || status === 'received') {
      navigate('/domestic-orders');
    } else if (status === 'shipped' || status === 'delivered') {
      navigate('/international-orders');
    }
  };

  const handleCreateOrder = () => {
    navigate('/create-order');
  };

  const handleViewOrderDetails = (orderId: string, type: 'local' | 'international') => {
    if (type === 'local') {
      navigate(`/local-order/${orderId}`);
    } else {
      navigate(`/international-order/${orderId}`);
    }
  };

  const getOrderCounts = () => {
    const pendingLocal = localOrders.filter(order =>
      order.order_status === 'created' || order.order_status === 'pending' || order.order_status === 'denied'
    ).length;

    const receivedLocal = localOrders.filter(order =>
      order.local_order_items?.some(item => item.status === 'in_vault')
    ).length;

    const shippedInternational = internationalOrders.filter(order =>
      order.shipping_status === 'shipped' || order.shipping_status === 'in_transit'
    ).length;

    const deliveredInternational = internationalOrders.filter(order =>
      order.shipping_status === 'delivered'
    ).length;

    return { pendingLocal, receivedLocal, shippedInternational, deliveredInternational };
  };

  const { pendingLocal, receivedLocal, shippedInternational, deliveredInternational } = getOrderCounts();
  const recentOrders = [...localOrders, ...internationalOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Truck className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        </div>
        <button
          onClick={handleCreateOrder}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => handleStatusClick('pending')}
          className="bg-yellow-50 hover:bg-yellow-100 rounded-lg p-4 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-yellow-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold text-yellow-900">{pendingLocal}</p>
              <p className="text-sm text-yellow-700">Orders Placed</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleStatusClick('received')}
          className="bg-blue-50 hover:bg-blue-100 rounded-lg p-4 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold text-blue-900">{receivedLocal}</p>
              <p className="text-sm text-blue-700">At Vault</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleStatusClick('shipped')}
          className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <Plane className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold text-purple-900">{shippedInternational}</p>
              <p className="text-sm text-purple-700">In Transit</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleStatusClick('delivered')}
          className="bg-green-50 hover:bg-green-100 rounded-lg p-4 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold text-green-900">{deliveredInternational}</p>
              <p className="text-sm text-green-700">Delivered</p>
            </div>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Loading recent orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-4">Create your first order to get started!</p>
            <button
              onClick={handleCreateOrder}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Order
            </button>
          </div>
        ) : (
          recentOrders.map((order) => {
            const isLocal = 'order_status' in order;
            const status = isLocal ? order.order_status : order.shipping_status;
            const price = isLocal ? parseFloat(order?.total_price?.toLocaleString()) : parseFloat(order.total_cost);
            const orderDate = order.createdAt;
            const trackingNumber = isLocal ? undefined : order.tracking_id;

            return (
              <div key={`${isLocal ? 'local' : 'international'}-${order.id}`} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{isLocal ? 'L' : 'I'}{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusConfig(status, isLocal ? 'local' : 'international').color} cursor-pointer`} onClick={() => handleStatusClick(status)}>
                      {getStatusConfig(status, isLocal ? 'local' : 'international').text}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusConfig(status, isLocal ? 'local' : 'international').color}
                    <span className="text-sm text-gray-500">{new Date(orderDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {isLocal ? 'Local Order' : 'International Shipment'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isLocal
                        ? `${order.local_order_items?.length || 0} items`
                        : `${order.international_order_items?.length || 0} vault items`
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Order Value</p>
                  </div>
                  <div className="text-right">
                    {trackingNumber && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">Tracking: {trackingNumber}</p>
                      </div>
                    )}
                    <button
                      onClick={() => handleViewOrderDetails(order.id.toString(), isLocal ? 'local' : 'international')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EnhancedOrderManagement;