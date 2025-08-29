import React, { useState } from 'react';
import { X, Package, Save, Scale, Image as ImageIcon } from 'lucide-react';
import { LocalOrderItem, VaultItemRequest } from '../services/adminApiService';

interface AddToVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LocalOrderItem;
  vaultId: string;
  onSubmit: (vaultId: string, itemData: VaultItemRequest) => Promise<void>;
}

const AddToVaultModal: React.FC<AddToVaultModalProps> = ({
  isOpen,
  onClose,
  item,
  vaultId,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.name,
    weight_gm: 500,
    storage_days_free: 90,
    storage_fee_per_day: 2,
    is_returnable: false,
    image_urls: item.image_url ? [item.image_url] : []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Please enter item name');
      return;
    }

    if (formData.weight_gm <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const vaultItemData: VaultItemRequest = {
        vault_id: vaultId,
        name: formData.name,
        description: formData.description,
        source_type: 'user_sent',
        received_date: new Date().toISOString(),
        weight_gm: formData.weight_gm,
        status: 'received',
        is_returnable: formData.is_returnable,
        returnable_until: formData.is_returnable ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        storage_days_free: formData.storage_days_free,
        storage_fee_per_day: formData.storage_fee_per_day,
        image_urls: formData.image_urls,
        is_ready_to_ship: true
      };

      await onSubmit(vaultId, vaultItemData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to vault');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Add Item to Vault
          </h2>
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
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter item description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Scale className="inline h-4 w-4 mr-1" />
                  Weight (grams) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.weight_gm}
                  onChange={(e) => handleInputChange('weight_gm', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Weight in grams"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Days Free
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.storage_days_free}
                  onChange={(e) => handleInputChange('storage_days_free', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_returnable}
                  onChange={(e) => handleInputChange('is_returnable', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Item is returnable</span>
              </label>
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
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Add to Vault</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToVaultModal;