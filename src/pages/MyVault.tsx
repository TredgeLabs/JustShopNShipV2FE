import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaultService, VaultItemApi } from '../api/services/userService';
import { getStatusConfig } from '../components/orders/OrderStatusBadge';
import {
  Package,
  Eye,
  ExternalLink,
  Scale,
  DollarSign,
  CheckSquare,
  Square,
  RotateCcw,
  Truck,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ORDER_STATUSES } from '../api/services/orderService';

interface VaultItem {
  id: string;
  name: string;
  images: string[];
  productLink: string;
  price: number;
  weight: number;
  status: string;
  receivedDate: string;
  validityDays: number;
  storageCost: number;
  isReturnable: boolean;
  isSelected: boolean;
  color: string;
  size: string;
  quantity: number;
}

const MyVault: React.FC = () => {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageModal, setSelectedImageModal] = useState<{ item: VaultItem; imageIndex: number } | null>(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [vaultCode, setVaultCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadVaultItems = async () => {
      setIsLoading(true);
      try {
        const response = await vaultService.getVaultItems();
        if (response.success && response.items) {
          const now = new Date();
          const mappedItems: VaultItem[] = response.items.map((item: VaultItemApi) => {
            // Calculate validity days
            const receivedDate = new Date(item.received_date);
            const freeDays = item.storage_days_free;
            const validityDays = freeDays - Math.floor((now.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24));
            return {
              id: `VI-${item.id}`,
              name: item.name,
              images: item.image_urls.map((url: string) => url.startsWith('http') ? url : `http://localhost:4000${url}`),
              productLink: item.order_item?.product_link ?? "#",
              price: item.order_item?.price ?? 0,
              weight: item.weight_gm ? item.weight_gm / 1000 : 0,
              status: (item.status) as VaultItem['status'],
              receivedDate: item.received_date,
              validityDays,
              storageCost: 0, // No storage cost in API, set to 0 or calculate if needed
              isReturnable: item.is_returnable,
              isSelected: false,
              color: item.order_item?.color || '',
              size: item.order_item?.size || '',
              quantity: item.order_item?.quantity || 1
            };
          });
          setVaultCode(response.vaultCode);
          setVaultItems(mappedItems);
        }
      } catch (err) {
        // Optionally handle error
      }
      setIsLoading(false);
    };
    loadVaultItems();
  }, []);

  const handleItemSelection = (itemId: string) => {
    setVaultItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  const handleSelectAll = () => {
    const allSelected = vaultItems.every(item => item.isSelected);
    setVaultItems(prev => prev.map(item => ({ ...item, isSelected: !allSelected })));
  };

  const calculateShipping = async () => {
    setIsCalculatingShipping(true);
    // Simulate API call for shipping calculation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedItems = vaultItems.filter(item => item.isSelected);
    const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
    const baseRate = 15; // USD per kg
    const calculatedCost = totalWeight * baseRate;

    setShippingCost(calculatedCost);
    setIsCalculatingShipping(false);
  };

  const handleShipItems = () => {
    const selectedItems = vaultItems.filter(item => item.isSelected);

    if (selectedItems.length === 0) {
      alert('Please select at least one item to ship');
      return;
    }

    // Create international order directly
    createInternationalOrder(selectedItems);
  };

  const createInternationalOrder = async (selectedItems: VaultItem[]) => {
    try {
      setIsCalculatingShipping(true);

      // Calculate totals
      const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight * 1000, 0); // Convert to grams
      const shippingCost = totalWeight * 0.02; // Mock calculation
      const storageCost = selectedItems.reduce((sum, item) => sum + item.storageCost, 0);
      const platformFee = (shippingCost + storageCost) * 0.05;
      const totalCost = shippingCost + storageCost + platformFee;

      const orderRequest = {
        orderData: {
          vault_id: vaultCode, // This should come from user's vault
          shipping_address_id: '', // This should come from user's default address
          shipment_weight_gm: totalWeight,
          shipping_cost: shippingCost,
          storage_cost: storageCost,
          platform_fee: platformFee,
          total_cost: totalCost,
          shipping_status: ORDER_STATUSES.pending
        },
        vaultItemIds: selectedItems.map(item => parseInt(item.id.replace('VI-', ''))) // Extract numeric IDs
      };

      // For now, just show confirmation - in production, call the API
      const shipmentData = {
        items: selectedItems,
        destination: 'United States',
        shippingService: 'Standard International',
        orderRequest
      };

      localStorage.setItem('shipmentData', JSON.stringify(shipmentData));
      navigate('/address-selection');

    } catch (err) {
      alert('Failed to create international order. Please try again.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleReturnItem = (itemId: string) => {
    console.log('Returning item:', itemId);
    // TODO: Implement return process
    alert('Return process initiated for item: ' + itemId);
  };

  const openImageModal = (item: VaultItem, imageIndex: number = 0) => {
    setSelectedImageModal({ item, imageIndex });
  };

  const closeImageModal = () => {
    setSelectedImageModal(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImageModal) return;

    const { item, imageIndex } = selectedImageModal;
    const newIndex = direction === 'prev'
      ? (imageIndex - 1 + item.images.length) % item.images.length
      : (imageIndex + 1) % item.images.length;

    setSelectedImageModal({ item, imageIndex: newIndex });
  };

  const selectedItems = vaultItems.filter(item => item.isSelected);
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
  const totalStorageCost = vaultItems.reduce((sum, item) => sum + item.storageCost, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your vault items...</p>
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
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Vault</h1>
          </div>
          <p className="text-gray-600">
            Manage items stored in your vault. Select items to calculate shipping costs and initiate international delivery.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{vaultItems.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Selected Weight</p>
                <p className="text-2xl font-bold text-gray-900">{totalWeight.toFixed(1)} kg</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Storage Costs</p>
                <p className="text-2xl font-bold text-gray-900">${totalStorageCost}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckSquare className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Selected Items</p>
                <p className="text-2xl font-bold text-gray-900">{selectedItems.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {vaultItems.every(item => item.isSelected) ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-sm font-medium">
                  {vaultItems.every(item => item.isSelected) ? 'Deselect All' : 'Select All'}
                </span>
              </button>

              <div className="text-sm text-gray-600">
                {selectedItems.length} of {vaultItems.length} items selected
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={calculateShipping}
                disabled={selectedItems.length === 0 || isCalculatingShipping}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                {isCalculatingShipping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Scale className="h-4 w-4" />
                )}
                <span>Calculate Shipping</span>
              </button>

              {shippingCost !== null && (
                <div className="text-lg font-bold text-green-600">
                  Shipping: ${shippingCost.toFixed(2)}
                </div>
              )}

              <button
                onClick={handleShipItems}
                disabled={selectedItems.length === 0}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                <Truck className="h-4 w-4" />
                <span>Get it Shipped</span>
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaultItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Item Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  {(item.status !== ORDER_STATUSES.in_transit) && <button
                    onClick={() => handleItemSelection(item.id)}
                    className="flex items-center space-x-2"
                  >
                    {item.isSelected ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>}

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusConfig(item.status, 'vault_item').color}`}>
                    {getStatusConfig(item.status, 'vault_item').text}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h3>
              </div>

              {/* Item Image */}
              <div className="relative">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => openImageModal(item, 0)}
                />
                {item.images.length > 1 && (
                  <button
                    onClick={() => openImageModal(item, 0)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>+{item.images.length - 1}</span>
                  </button>
                )}
              </div>

              {/* Item Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weight:</span>
                  <span className="font-medium text-gray-900">{item.weight} kg</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Validity:</span>
                  <span className={`font-medium ${item.validityDays < 0 ? 'text-red-600' : item.validityDays < 30 ? 'text-orange-600' : 'text-green-600'}`}>
                    {item.validityDays < 0 ? `${Math.abs(item.validityDays)} days overdue` : `${item.validityDays} days left`}
                  </span>
                </div>

                {item.storageCost > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage Cost:</span>
                    <span className="font-medium text-red-600">${item.storageCost}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 space-y-2">
                  <a
                    href={item.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Product</span>
                  </a>

                  {item.isReturnable && (
                    <button
                      onClick={() => handleReturnItem(item.id)}
                      className="flex items-center justify-center space-x-2 w-full py-2 px-3 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors text-sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Return Item</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {vaultItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items in your vault</h3>
            <p className="text-gray-600">Start shopping to see your items here!</p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="h-6 w-6" />
              </button>

              <img
                src={selectedImageModal.item.images[selectedImageModal.imageIndex]}
                alt={selectedImageModal.item.name}
                className="max-w-full max-h-full object-contain"
              />

              {selectedImageModal.item.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                    {selectedImageModal.imageIndex + 1} of {selectedImageModal.item.images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVault;