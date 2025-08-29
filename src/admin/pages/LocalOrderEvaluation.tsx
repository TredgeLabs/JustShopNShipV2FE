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
import { adminApiService, LocalOrderDetails, LocalOrderItem, BulkProcessRequest } from '../services/adminApiService';
import { formatDate, formatCurrency, copyToClipboard } from '../utils/adminHelpers';
import { DENY_REASONS } from '../constants/adminConstants';
import BulkProcessModal from '../components/BulkProcessModal';
import AddToVaultModal from '../components/AddToVaultModal';

interface EvaluationData {
  [itemId: number]: {
    actualPrice: number;
    decision: 'accept' | 'deny';
    denyReasons: string[];
  };
}

const LocalOrderEvaluation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<LocalOrderDetails | null>(null);
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({});
  const [adminNotes, setAdminNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [selectedVaultItem, setSelectedVaultItem] = useState<LocalOrderItem | null>(null);

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

        // Initialize evaluation data
        const initialEvaluation: EvaluationData = {};
        response.data.items.forEach((item: LocalOrderItem) => {
          initialEvaluation[item.id] = {
            actualPrice: Number(item.price),
            decision: 'accept',
            denyReasons: []
          };
        });
        setEvaluationData(initialEvaluation);
      } else {
        setError('Failed to load order details');
      }
    } catch (err) {
      setError(
        `Error loading order details: ${err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemEvaluationChange = (itemId: number, field: string, value: any) => {
    setEvaluationData(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleDenyReasonToggle = (itemId: number, reason: string) => {
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

    const address = `${orderDetails.user.name}
Vault ID: ${orderDetails.user.vault_id}
JustShopAndShip Warehouse
Plot No. 45, Sector 18, Gurgaon
Gurgaon, Haryana 122001
India
Phone: +91 9876543210`;

    const copied = await copyToClipboard(address);
    if (copied) {
      setSuccess('Vault address copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleAddToVault = async (item: LocalOrderItem) => {
    setSelectedVaultItem(item);
    setShowVaultModal(true);
  };

  const handleVaultSubmit = async (vaultId: number, itemData: any) => {
    try {
      const response = await adminApiService.addVaultItem(vaultId, itemData);

      if (response.success) {
        setSuccess(`Item "${itemData.name}" added to vault successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to add item to vault');
      }
    } catch (err) {
      setError(`Error adding item to vault: ${err instanceof Error ? err.message : 'Unknown error'}`);
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

      // Convert evaluation data to API format
      const items = Object.entries(evaluationData).map(([itemId, evaluation]) => ({
        item_id: parseInt(itemId),
        action: evaluation.decision,
        ...(evaluation.decision === 'deny' && {
          deny_reasons: evaluation.denyReasons.map((reason: any) => {
            // Map reason text to reason ID (you may need to adjust this mapping)
            const reasonIndex = DENY_REASONS.indexOf(reason as any);
            return reasonIndex >= 0 ? reasonIndex + 1 : 8; // Default to "Other"
          })
        })
      }));

      const submissionData: BulkProcessRequest = {
        items,
        admin_notes: adminNotes || `Bulk processed on ${new Date().toLocaleDateString()}`
      };

      const response = await adminApiService.bulkProcessOrderItems(orderDetails.id.toString(), submissionData);

      if (response.success) {
        setSuccess('Order evaluation submitted successfully!');
        setTimeout(() => {
          navigate('/admin/orders');
        }, 2000);
      } else {
        setError('Failed to submit evaluation');
      }
    } catch (err) {
      setError(`Error submitting evaluation: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkProcess = async () => { }

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
                  <p className="text-gray-900">{orderDetails.user.name}</p>
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
                  <label className="text-sm font-medium text-gray-500">Order Date</label>
                  <p className="text-gray-900">{formatDate(orderDetails.created_at)}</p>
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
                  <div className="font-semibold text-blue-900">{orderDetails.user.name}</div>
                  <div className="text-blue-800">Vault ID: {orderDetails.user.vault_id}</div>
                  <div className="text-blue-800">JustShopAndShip Warehouse</div>
                  <div className="text-blue-800">Plot No. 45, Sector 18, Gurgaon</div>
                  <div className="text-blue-800">Gurgaon, Haryana 122001</div>
                  <div className="text-blue-800">India</div>
                  <div className="text-blue-800">Phone: +91 9876543210</div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add notes about this evaluation..."
              />
              {orderDetails.admin_notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Previous notes:</p>
                  <p className="text-sm text-gray-800">{orderDetails.admin_notes}</p>
                </div>
              )}
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
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{item.product_name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Original Cost:</span>
                            <p>{formatCurrency(Number(item.price))}</p>
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span>
                            <p>{item.quantity}</p>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <p className="capitalize">{item.status}</p>
                          </div>
                          <div>
                            <span className="font-medium">Item ID:</span>
                            <p>#{item.id}</p>
                          </div>
                        </div>
                      </div>
                      <a
                        href={item.product_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Product</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Actual Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <DollarSign className="inline h-4 w-4 mr-1" />
                          Actual Item Price (1x)
                        </label>
                        <input
                          type="number"
                          value={evaluationData[item.id]?.actualPrice || item.price}
                          onChange={(e) => handleItemEvaluationChange(item.id, 'actualPrice', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter actual price"
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
                  {/* Admin Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add any notes about this evaluation..."
                    />
                  </div>

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

        {/* Bulk Process Modal */}
        <BulkProcessModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          items={orderDetails.items}
          onSubmit={handleBulkProcess}
        />

        {/* Add to Vault Modal */}
        {selectedVaultItem && (
          <AddToVaultModal
            isOpen={showVaultModal}
            onClose={() => {
              setShowVaultModal(false);
              setSelectedVaultItem(null);
            }}
            item={selectedVaultItem}
            vaultId={parseInt(orderDetails.user.vault_id.split('-')[2]) || 1}
            onSubmit={handleVaultSubmit}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default LocalOrderEvaluation;