import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Eye,
  CheckCircle,
  Users,
  Package,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService, AdminOrder } from '../services/adminApiService';
import { formatDate, formatCurrency } from '../utils/adminHelpers';

const OrdersList: React.FC = () => {
  const navigate = useNavigate();
  const [localOrders, setLocalOrders] = useState<AdminOrder[]>([]);
  const [internationalOrders, setInternationalOrders] = useState<AdminOrder[]>([]);
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

  const handleEvaluateOrder = (orderId: string, status: string) => {
    if (status === 'accepted') {
      navigate(`/admin/evaluation-detail/${orderId}`);
    } else {
      navigate(`/admin/local-order-evaluation/${orderId}`);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {localOrders.filter(order => order.status === 'created' || order.status === 'under_review').length}
                </p>
              </div>
            </div>
          </div>

          {/* Commneted down below code for now later will update in phase two */}
          {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency([...localOrders, ...internationalOrders].reduce((sum, order) => sum + order.totalAmount, 0))}
                </p>
              </div>
            </div>
          </div> */}
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
                            <div className="text-sm text-gray-500">{formatDate(order.orderDate)}</div>
                            <div className="text-sm font-semibold text-gray-900">{formatCurrency(order?.totalAmount || 0)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                            <div className="text-sm text-gray-500">{order.userEmail}</div>
                            <div className="text-sm text-gray-500">{order.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            Order Items
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={order?.status || ''} type='local' />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEvaluateOrder(order.id.toString(), order?.status || '')}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span>{order?.status === 'accepted' || order?.status === 'delivered' ? 'Details' : 'Evaluate'}</span>
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
                            <div className="text-sm text-gray-500">{formatDate(order.orderDate)}</div>
                            <div className="text-sm font-semibold text-gray-900">{formatCurrency(order?.totalAmount || 0)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                            <div className="text-sm text-gray-500">{order.userEmail}</div>
                            <div className="text-sm text-gray-500">{order.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            Order Items
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={order?.status || ''} type='international' />
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
                            {order?.status === 'delivered' && (
                              <span className="flex items-center space-x-1 text-green-600 opacity-70 cursor-not-allowed select-none">
                                <CheckCircle className="h-4 w-4" />
                                <span>Completed</span>
                              </span>
                            )}
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