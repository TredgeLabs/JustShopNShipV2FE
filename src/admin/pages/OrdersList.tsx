import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Eye,
  CheckCircle,
  ExternalLink,
  Users,
  Package,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService, AdminLocalOrder, AdminInternationalOrder } from '../services/adminApiService';
import { formatDate, formatCurrency } from '../utils/adminHelpers';

const OrdersList: React.FC = () => {
  const navigate = useNavigate();
  const [localOrders, setLocalOrders] = useState<AdminLocalOrder[]>([]);
  const [internationalOrders, setInternationalOrders] = useState<AdminInternationalOrder[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);
  const [isLoadingInternational, setIsLoadingInternational] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLocalOrders();
    loadInternationalOrders();
  }, []);

  const loadLocalOrders = async () => {
    try {
      setIsLoadingLocal(true);
      setError('');
      const response = await adminApiService.getLocalOrders();
      if (response.success && Array.isArray(response.data)) {
        setLocalOrders(response.data);
      } else {
        setError('Failed to load local orders');
      }
    } catch (err) {
      setError(`Error loading local orders: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoadingLocal(false);
    }
  };

  const loadInternationalOrders = async () => {
    try {
      setIsLoadingInternational(true);
      setError('');
      const response = await adminApiService.getInternationalOrders();
      if (response.success && Array.isArray(response.data)) {
        setInternationalOrders(response.data);
      } else {
        setError('Failed to load international orders');
      }
    } catch (err) {
      setError(`Error loading international orders: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoadingInternational(false);
    }
  };

  const handleEvaluateOrder = (orderId: string) => {
    navigate(`/admin/local-order-evaluation/${orderId}`);
  };

  const handleCompleteOrder = async (orderId: string) => {
    const confirmed = window.confirm('Are you sure you want to mark this order as completed?');
    if (confirmed) {
      try {
        // TODO: Implement order completion API call when endpoint is available
        alert(`Order ${orderId} marked as completed`);
        loadInternationalOrders(); // Refresh the list
      } catch (err) {
        setError(`Error completing order: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const handleUpdateShippingOrder = (orderId: string) => {
    navigate(`/admin/shipping-order-update/${orderId}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          </div>
          <p className="text-gray-600">
            Manage and process local and international orders from customers.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Local Orders</p>
                <p className="text-2xl font-bold text-gray-900">{localOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">International Orders</p>
                <p className="text-2xl font-bold text-gray-900">{internationalOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Evaluations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {localOrders.filter(order => order.order_status === 'created' || order.order_status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    localOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0) +
                    internationalOrders.reduce((sum, order) => sum + parseFloat(order.total_cost), 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Local Orders Section */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Local Orders (Domestic India)
            </h2>
          </div>

          <div className="p-6">
            {isLoadingLocal ? (
              <LoadingSpinner text="Loading local orders..." />
            ) : localOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No local orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {localOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                            <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                            <div className="text-sm font-semibold text-gray-900">{formatCurrency(parseFloat(order.total_price))}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">User #{order.user_id}</div>
                            <div className="text-sm text-gray-500">Vault: {order.vault_id || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.local_order_items?.length || 0} item(s)
                          </div>
                          <div className="text-sm text-gray-500">
                            Status: {order.order_status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={order.order_status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEvaluateOrder(order.id.toString())}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Evaluate</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* International Orders Section */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
              International Orders (Shipping)
            </h2>
          </div>

          <div className="p-6">
            {isLoadingInternational ? (
              <LoadingSpinner text="Loading international orders..." />
            ) : internationalOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No international orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shipping
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {internationalOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                            <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                            <div className="text-sm font-semibold text-gray-900">{formatCurrency(parseFloat(order.total_cost))}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">User #{order.user_id}</div>
                            <div className="text-sm text-gray-500">Vault: {order.vault_id}</div>
                            <div className="text-sm text-gray-500">Address: {order.shipping_address_id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.international_order_items?.length || 0} vault item(s)
                          </div>
                          <div className="text-sm text-gray-500">
                            Weight: {(order.shipment_weight_gm / 1000).toFixed(1)} kg
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={order.shipping_status} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateShippingOrder(order.id.toString())}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Update</span>
                            </button>
                            <button
                              onClick={() => handleCompleteOrder(order.id.toString())}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-900 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Complete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersList;