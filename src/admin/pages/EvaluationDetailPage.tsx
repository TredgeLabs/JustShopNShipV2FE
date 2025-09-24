import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  DollarSign,
  Package,
  AlertCircle,
  ExternalLink,
  FileText
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { adminApiService, LocalOrderDetails } from '../services/adminApiService';
import { formatDate, formatCurrency } from '../utils/adminHelpers';
import { DENY_REASONS } from '../constants/adminConstants';

const EvaluationDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<LocalOrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminApiService.getOrderDetails(orderId!);
      if (response.success) {
        setOrderDetails(response.data);
      } else {
        setError('Failed to load order details');
      }
    } catch (err) {
      setError(`Error loading order details: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDenyReasonText = (reasonId: number): string => {
    return DENY_REASONS[reasonId - 1] || 'Unknown reason';
  };

  const getApprovedItemsCount = () => {
    return orderDetails?.items.filter(item => item.status === 'accepted').length || 0;
  };

  const getDeniedItemsCount = () => {
    return orderDetails?.items.filter(item => item.status === 'denied').length || 0;
  };

  const getTotalEvaluatedValue = () => {
    return orderDetails?.items.reduce((total, item) => total + (parseFloat(item.final_price || item.price) * item.quantity), 0) || 0;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner text="Loading evaluation details..." />
        </div>
      </AdminLayout>
    );
  }

  if (!orderDetails) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
          <p className="text-gray-600 mb-4">The requested order could not be loaded.</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Evaluation Details</h1>
              <p className="text-gray-600">Order #{orderDetails.id} evaluation results</p>
            </div>
            <StatusBadge status={orderDetails.order_status} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer & Order Information */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900 font-medium">{orderDetails.user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{orderDetails.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{orderDetails.user.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vault ID</label>
                  <p className="text-gray-900 font-mono">{orderDetails.user.vault_id}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-green-600" />
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{formatDate(orderDetails.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{orderDetails.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved Items:</span>
                  <span className="font-medium text-green-600">{getApprovedItemsCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Denied Items:</span>
                  <span className="font-medium text-red-600">{getDeniedItemsCount()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Total:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(orderDetails.total_price))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Evaluated Total:</span>
                    <span className="font-medium">{formatCurrency(getTotalEvaluatedValue())}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {orderDetails.admin_notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Admin Notes
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{orderDetails.admin_notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Evaluation Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Evaluation Results</h3>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{item.product_name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Original Price:</span>
                              <p>{formatCurrency(parseFloat(item.price))}</p>
                            </div>
                            <div>
                              <span className="font-medium">Final Price:</span>
                              <p>{formatCurrency(parseFloat(item.final_price || item.price))}</p>
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span>
                              <p>{item.quantity}</p>
                            </div>
                            <div>
                              <span className="font-medium">Total:</span>
                              <p>{formatCurrency(parseFloat(item.final_price || item.price) * item.quantity)}</p>
                            </div>
                          </div>
                          
                          {item.color && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Color:</span> {item.color}
                            </div>
                          )}
                          
                          {item.size && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Size:</span> {item.size}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <StatusBadge status={item.status} />
                          <a
                            href={item.product_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Product</span>
                          </a>
                        </div>
                      </div>

                      {/* Evaluation Decision */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          {item.status === 'accepted' ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-900">Item Approved</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-600" />
                              <span className="font-medium text-red-900">Item Denied</span>
                            </>
                          )}
                        </div>

                        {/* Deny Reasons */}
                        {item.status === 'denied' && item.deny_reasons && item.deny_reasons.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Deny Reasons:</p>
                            <div className="space-y-1">
                              {item.deny_reasons.map((reasonId, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-sm text-red-800">{getDenyReasonText(reasonId)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price Adjustment */}
                        {item.final_price && parseFloat(item.final_price) !== parseFloat(item.price) && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">Price Adjustment:</p>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-600">Original: {formatCurrency(parseFloat(item.price))}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-gray-900 font-medium">Final: {formatCurrency(parseFloat(item.final_price))}</span>
                              <span className={`font-medium ${parseFloat(item.final_price) > parseFloat(item.price) ? 'text-red-600' : 'text-green-600'}`}>
                                ({parseFloat(item.final_price) > parseFloat(item.price) ? '+' : ''}{formatCurrency(parseFloat(item.final_price) - parseFloat(item.price))})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{orderDetails.items.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getApprovedItemsCount()}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{getDeniedItemsCount()}</div>
              <div className="text-sm text-gray-600">Denied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalEvaluatedValue())}</div>
              <div className="text-sm text-gray-600">Final Value</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EvaluationDetailPage;