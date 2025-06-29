import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService } from '../services/adminApiService';
import { formatDate, formatCurrency, copyToClipboard } from '../utils/adminHelpers';
import { DENY_REASONS } from '../constants/adminConstants';

interface OrderItem {
  id: string;
  name: string;
  cost: number;
  link: string;
  size: string;
  quantity: number;
  color: string;
  actualPrice: number;
  status: string;
}

interface OrderDetails {
  id: string;
  orderDate: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  vaultAddress: {
    name: string;
    vaultId: string;
    street: string;
    address: string;
    city: string;
    country: string;
    phone: string;
  };
  items: OrderItem[];
}

interface EvaluationData {
  [itemId: string]: {
    actualPrice: number;
    decision: 'accept' | 'deny';
    denyReasons: string[];
    shipmentDate: string;
  };
}

const LocalOrderEvaluation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({});
  const [paymentReturnDone, setPaymentReturnDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await adminApiService.getOrderDetails(orderId!);
      if (response.success) {
        setOrderDetails(response.data);
        // Initialize evaluation data
        const initialEvaluation: EvaluationData = {};
        response.data.items.forEach((item: OrderItem) => {
          initialEvaluation[item.id] = {
            actualPrice: item.cost,
            decision: 'accept',
            denyReasons: [],
            shipmentDate: new Date().toISOString().split('T')[0]
          };
        });
        setEvaluationData(initialEvaluation);
      } else {
        setError('Failed to load order details');
      }
    } catch (err) {
      setError('Error loading order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemEvaluationChange = (itemId: string, field: string, value: any) => {
    setEvaluationData(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleDenyReasonToggle = (itemId: string, reason: string) => {
    setEvaluationData(prev => {
      const currentReasons = prev[itemId]?.denyReasons || [];
      const newReasons = currentReasons.includes(reason)
        ? currentReasons.filter(r => r !== reason)
        : [...currentReasons, reason];
      
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          denyReasons: newReasons
        }
      };
    });
  };

  const handleCopyVaultAddress = async () => {
    if (!orderDetails) return;
    
    const address = `${orderDetails.vaultAddress.name}
Vault ID: ${orderDetails.vaultAddress.vaultId}
${orderDetails.vaultAddress.street}
${orderDetails.vaultAddress.address}
${orderDetails.vaultAddress.city}
${orderDetails.vaultAddress.country}
Phone: ${orderDetails.vaultAddress.phone}`;

    const copied = await copyToClipboard(address);
    if (copied) {
      setSuccess('Vault address copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!orderDetails) return;

    // Validate evaluation data
    const hasInvalidData = Object.values(evaluationData).some(itemEvaluation => {
      return itemEvaluation.decision === 'deny' && itemEvaluation.denyReasons.length === 0;
    });

    if (hasInvalidData) {
      setError('Please provide deny reasons for all denied items');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      const submissionData = {
        orderId: orderDetails.id,
        evaluations: evaluationData,
        paymentReturnDone
      };

      const response = await adminApiService.submitOrderEvaluation(orderDetails.id, submissionData);
      
      if (response.success) {
        setSuccess('Order evaluation submitted successfully!');
        setTimeout(() => {
          navigate('/admin/orders');
        }, 2000);
      } else {
        setError('Failed to submit evaluation');
      }
    } catch (err) {
      setError('Error submitting evaluation');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner text="Loading order details..." />
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
              <h1 className="text-3xl font-bold text-gray-900">Order Evaluation</h1>
              <p className="text-gray-600">Evaluate and process local order #{orderDetails.id}</p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{orderDetails.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{orderDetails.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{orderDetails.userPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Date</label>
                  <p className="text-gray-900">{formatDate(orderDetails.orderDate)}</p>
                </div>
              </div>
            </div>

            {/* Vault Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Vault Address</h3>
                <button
                  onClick={handleCopyVaultAddress}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-1 text-sm">
                  <div className="font-semibold text-blue-900">{orderDetails.vaultAddress.name}</div>
                  <div className="text-blue-800">Vault ID: {orderDetails.vaultAddress.vaultId}</div>
                  <div className="text-blue-800">{orderDetails.vaultAddress.street}</div>
                  <div className="text-blue-800">{orderDetails.vaultAddress.address}</div>
                  <div className="text-blue-800">{orderDetails.vaultAddress.city}</div>
                  <div className="text-blue-800">{orderDetails.vaultAddress.country}</div>
                  <div className="text-blue-800">Phone: {orderDetails.vaultAddress.phone}</div>
                </div>
              </div>
            </div>

            {/* Payment Return */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentReturnDone}
                  onChange={(e) => setPaymentReturnDone(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Payment Return Done (for partial/full refund if required)
                </span>
              </label>
            </div>
          </div>

          {/* Items Evaluation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Items Evaluation</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Original Cost:</span>
                            <p>{formatCurrency(item.cost)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Size:</span>
                            <p>{item.size}</p>
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span>
                            <p>{item.quantity}</p>
                          </div>
                          <div>
                            <span className="font-medium">Color:</span>
                            <p>{item.color}</p>
                          </div>
                        </div>
                      </div>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Product</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Actual Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <DollarSign className="inline h-4 w-4 mr-1" />
                          Actual Item Price (1x)
                        </label>
                        <input
                          type="number"
                          value={evaluationData[item.id]?.actualPrice || item.cost}
                          onChange={(e) => handleItemEvaluationChange(item.id, 'actualPrice', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter actual price"
                        />
                      </div>

                      {/* Shipment Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Shipment Date
                        </label>
                        <input
                          type="date"
                          value={evaluationData[item.id]?.shipmentDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => handleItemEvaluationChange(item.id, 'shipmentDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Decision */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`decision-${item.id}`}
                              value="accept"
                              checked={evaluationData[item.id]?.decision === 'accept'}
                              onChange={(e) => handleItemEvaluationChange(item.id, 'decision', e.target.value)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700 flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                              Accept
                            </span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`decision-${item.id}`}
                              value="deny"
                              checked={evaluationData[item.id]?.decision === 'deny'}
                              onChange={(e) => handleItemEvaluationChange(item.id, 'decision', e.target.value)}
                              className="h-4 w-4 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700 flex items-center">
                              <XCircle className="h-4 w-4 text-red-600 mr-1" />
                              Deny
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Deny Reasons */}
                    {evaluationData[item.id]?.decision === 'deny' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deny Reasons (Select all that apply)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {DENY_REASONS.map((reason) => (
                            <label key={reason} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={evaluationData[item.id]?.denyReasons?.includes(reason) || false}
                                onChange={() => handleDenyReasonToggle(item.id, reason)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">{reason}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSubmitEvaluation}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <LoadingSpinner size="sm" text="" />
                        <span>Submitting Evaluation...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Submit Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LocalOrderEvaluation;