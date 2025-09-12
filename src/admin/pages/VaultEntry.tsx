import React, { useState } from 'react';
import {
  Package,
  Search,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  User,
  Scale,
  Image as ImageIcon,
  X
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService } from '../services/adminApiService';

interface UserDetails {
  vaultId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  transitItems: TransitItem[];
}

interface TransitItem {
  id: string;
  name: string;
  orderId: string;
  expectedQuantity: number;
  color: string;
  size: string;
}

interface VaultItemDetails {
  name: string;
  description: string;
  quantity: number;
  color: string;
  size: string;
  weight: number;
  images: File[];
}

const VaultEntry: React.FC = () => {
  const [vaultId, setVaultId] = useState('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedTransitItem, setSelectedTransitItem] = useState<TransitItem | null>(null);
  const [vaultItemDetails, setVaultItemDetails] = useState<VaultItemDetails>({
    name: '',
    description: '',
    quantity: 1,
    color: '',
    size: '',
    weight: 0,
    images: []
  });
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVaultIdSubmit = async () => {
    if (!vaultId.trim()) {
      setError('Please enter a Vault ID');
      return;
    }

    try {
      setIsValidating(true);
      setError('');
      setUserDetails(null);

      const response = await adminApiService.validateVaultId(vaultId);

      if (response.success) {
        setUserDetails(response.data);
        setSuccess('Vault ID validated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Invalid Vault ID');
        // Clear form if invalid
        setVaultId('');
      }
    } catch (err) {
      setError('Error validating Vault ID');
    } finally {
      setIsValidating(false);
    }
  };

  const handleTransitItemSelect = (item: TransitItem) => {
    setSelectedTransitItem(item);
    setVaultItemDetails({
      name: item.name,
      description: '',
      quantity: item.expectedQuantity,
      color: item.color,
      size: item.size,
      weight: 0,
      images: []
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVaultItemDetails(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setVaultItemDetails(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleItemDetailsChange = (field: keyof VaultItemDetails, value: any) => {
    setVaultItemDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEnterItem = async () => {
    if (!userDetails || !vaultItemDetails.name.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (vaultItemDetails.weight <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      // Convert form data to API format
      const itemData = {
        vault_id: userDetails.vaultId, // Extract vault ID number
        name: vaultItemDetails.name,
        description: vaultItemDetails.description || vaultItemDetails.name,
        source_type: 'user_sent',
        received_date: new Date().toISOString(),
        weight_gm: Math.round(vaultItemDetails.weight * 1000), // Convert kg to grams
        status: 'received',
        is_returnable: false,
        returnable_until: null,
        storage_days_free: 90,
        storage_fee_per_day: 2,
        image_urls: [], // In production, upload images and get URLs
        is_ready_to_ship: true,
        local_order_item_id: selectedTransitItem ? selectedTransitItem.id : '',
      };

      const response = await adminApiService.addVaultItem(itemData.vault_id, itemData);

      if (response.success) {
        setSuccess('Item entered in vault successfully!');

        // Reset form
        setVaultItemDetails({
          name: '',
          description: '',
          quantity: 1,
          color: '',
          size: '',
          weight: 0,
          images: []
        });
        setSelectedTransitItem(null);

        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to enter item in vault');
      }
    } catch (err) {
      setError(`Error entering item in vault: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setVaultId('');
    setUserDetails(null);
    setSelectedTransitItem(null);
    setVaultItemDetails({
      name: '',
      description: '',
      quantity: 1,
      color: '',
      size: '',
      weight: 0,
      images: []
    });
    setError('');
    setSuccess('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Vault Entry</h1>
          </div>
          <p className="text-gray-600">
            Process incoming packages and enter items into customer vaults.
          </p>
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

        {/* Vault ID Entry */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vault ID Validation</h2>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Vault ID
              </label>
              <input
                type="text"
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., JSS-UD-2024-001"
                disabled={isValidating}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleVaultIdSubmit}
                disabled={isValidating || !vaultId.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
              >
                {isValidating ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span>Validate</span>
              </button>
            </div>
            {userDetails && (
              <div className="flex items-end">
                <button
                  onClick={resetForm}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Details */}
        {userDetails && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Customer Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900 font-medium">{userDetails.userName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{userDetails.userEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{userDetails.userPhone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Transit Items */}
        {userDetails && userDetails.transitItems.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Items in Transit</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userDetails.transitItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleTransitItemSelect(item)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedTransitItem?.id === item.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Order: #{item.orderId}</p>
                    <p>Quantity: {item.expectedQuantity}</p>
                    <p>Color: {item.color}</p>
                    <p>Size: {item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vault Item Details */}
        {userDetails && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Vault Item Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={vaultItemDetails.name}
                    onChange={(e) => handleItemDetailsChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={vaultItemDetails.description}
                    onChange={(e) => handleItemDetailsChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter item description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={vaultItemDetails.quantity}
                      onChange={(e) => handleItemDetailsChange('quantity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Scale className="inline h-4 w-4 mr-1" />
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={vaultItemDetails.weight}
                      onChange={(e) => handleItemDetailsChange('weight', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      value={vaultItemDetails.color}
                      onChange={(e) => handleItemDetailsChange('color', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <input
                      type="text"
                      value={vaultItemDetails.size}
                      onChange={(e) => handleItemDetailsChange('size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter size"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  Item Images
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload images or drag and drop
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </span>
                  </label>
                </div>

                {/* Image Preview */}
                {vaultItemDetails.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Images ({vaultItemDetails.images.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {vaultItemDetails.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleEnterItem}
                disabled={isSaving || !vaultItemDetails.name.trim() || vaultItemDetails.weight <= 0}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" text="" />
                    <span>Entering Item...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Enter Item in Vault</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default VaultEntry;