import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Save, AlertTriangle } from 'lucide-react';
import { LocalOrderItem, BulkProcessRequest } from '../services/adminApiService';
import { DENY_REASONS } from '../constants/adminConstants';

interface BulkProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LocalOrderItem[];
  onSubmit: (data: BulkProcessRequest) => Promise<void>;
}

interface ItemDecision {
  item_id: number;
  action: 'approve' | 'deny';
  deny_reasons?: number[];
}

const BulkProcessModal: React.FC<BulkProcessModalProps> = ({
  isOpen,
  onClose,
  items,
  onSubmit
}) => {
  const [decisions, setDecisions] = useState<Record<number, ItemDecision>>({});
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize decisions
  React.useEffect(() => {
    if (items.length > 0) {
      const initialDecisions: Record<number, ItemDecision> = {};
      items.forEach(item => {
        initialDecisions[item.id] = {
          item_id: item.id,
          action: 'approve'
        };
      });
      setDecisions(initialDecisions);
    }
  }, [items]);

  const handleDecisionChange = (itemId: number, action: 'approve' | 'deny') => {
    setDecisions(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        action,
        ...(action === 'deny' ? { deny_reasons: [] } : {})
      }
    }));
  };

  const handleDenyReasonToggle = (itemId: number, reasonIndex: number) => {
    setDecisions(prev => {
      const currentReasons = prev[itemId]?.deny_reasons || [];
      const newReasons = currentReasons.includes(reasonIndex)
        ? currentReasons.filter(r => r !== reasonIndex)
        : [...currentReasons, reasonIndex];
      
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          deny_reasons: newReasons
        }
      };
    });
  };

  const handleSubmit = async () => {
    // Validate that denied items have reasons
    const invalidItems = Object.values(decisions).filter(decision => 
      decision.action === 'deny' && (!decision.deny_reasons || decision.deny_reasons.length === 0)
    );

    if (invalidItems.length > 0) {
      setError('Please provide deny reasons for all denied items');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const bulkData: BulkProcessRequest = {
        items: Object.values(decisions),
        admin_notes: adminNotes || `Bulk processed on ${new Date().toLocaleDateString()}`
      };

      await onSubmit(bulkData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process items');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Process Order Items</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Price: ₹{item.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDecisionChange(item.id, 'approve')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                        decisions[item.id]?.action === 'approve'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleDecisionChange(item.id, 'deny')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                        decisions[item.id]?.action === 'deny'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                      }`}
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Deny</span>
                    </button>
                  </div>
                </div>

                {/* Deny Reasons */}
                {decisions[item.id]?.action === 'deny' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <label className="block text-sm font-medium text-red-900 mb-2">
                      Deny Reasons (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DENY_REASONS.map((reason, index) => (
                        <label key={reason} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={decisions[item.id]?.deny_reasons?.includes(index + 1) || false}
                            onChange={() => handleDenyReasonToggle(item.id, index + 1)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-red-800">{reason}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add notes about this bulk processing..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Process Items</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkProcessModal;