import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  User,
  MapPin,
  Package,
  Scale,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService, ShipInternationalRequest } from '../services/adminApiService';

interface VaultItem {
  id: string;
  name: string;
  image: string;
  vaultItemId: string;
  weight: number;
}

interface Address {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface ShippingOrderDetails {
  id: string;
  userName: string;
  userEmail: string;
  selectedAddress: Address;
  vaultItems: VaultItem[];
  totalWeight: number;
  currentShippingLink: string;
  currentShippingId: string;
  shipping_status: string;
}

const ShippingOrderUpdate: React.FC = () => {
  const { shippingOrderId } = useParams<{ shippingOrderId: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<ShippingOrderDetails | null>(null);
  const [shippingLink, setShippingLink] = useState('');
  const [shippingId, setShippingId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (shippingOrderId) {
      loadShippingOrderDetails();
    }
  }, [shippingOrderId]);

  const loadShippingOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await adminApiService.getShippingOrderDetails(shippingOrderId!);
      if (response.success) {
        setOrderDetails(response.data);
        setShippingLink(response.data.currentShippingLink);
        setShippingId(response.data.currentShippingId);
      } else {
        setError('Failed to load shipping order details');
      }
    } catch (err) {
      setError('Error loading shipping order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!orderDetails) return;

    try {
      const confirmed = window.confirm('Are you sure you want to mark this order as completed?');
      if (confirmed) {
        setIsSaving(true);
        setError('');

        const updateData: ShipInternationalRequest = {
          shipping_status: 'delivered',
        };

        const response = await adminApiService.shipInternationalOrder(orderDetails.id, updateData);

        if (response.success) {
          setSuccess('Shipping order delivered successfully!');
          setTimeout(() => {
            navigate('/admin/orders');
          }, 2000);
        } else {
          setError('Failed to update delivery status');
        }
      }
    } catch (err) {
      setError(`Error updating delivery status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!orderDetails) return;

    if (!shippingLink.trim() || !shippingId.trim()) {
      setError('Please fill in both shipping link and shipping ID');
      return;
    }

    // Validate URL format
    try {
      new URL(shippingLink);
    } catch {
      setError('Please enter a valid tracking URL');
      return;
    }
    try {
      setIsSaving(true);
      setError('');

      const updateData: ShipInternationalRequest = {
        tracking_link: shippingLink.trim(),
        tracking_id: shippingId.trim(),
        shipping_status: 'shipped'
      };

      const response = await adminApiService.shipInternationalOrder(orderDetails.id, updateData);

      if (response.success) {
        setSuccess('Shipping order updated successfully!');
        setTimeout(() => {
          navigate('/admin/orders');
        }, 2000);
      } else {
        setError('Failed to update shipping order');
      }
    } catch (err) {
      setError(`Error updating shipping order: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner text="Loading shipping order details..." />
        </div>
      </AdminLayout>
    );
  }

  if (!orderDetails) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping order not found</h3>
          <p className="text-gray-600 mb-4">The requested shipping order could not be loaded.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Update Shipping Order</h1>
              <p className="text-gray-600">
                Update shipping information for order #{orderDetails.id}
              </p>
            </div>

            {/* ✅ Mark Delivered Button (only visible if tracking info is present) */}
            {orderDetails.currentShippingLink && orderDetails.currentShippingId && (
              <button
                onClick={handleMarkDelivered}
                disabled={isSaving || orderDetails.shipping_status === 'delivered'}
                className="mt-3 flex items-center justify-center space-x-2 py-3 px-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {orderDetails.shipping_status === 'delivered' ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Delivered</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark Delivered</span>
                  </>
                )}
              </button>
            )}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer & Address Information */}
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
                  <p className="text-gray-900 font-medium">{orderDetails.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{orderDetails.userEmail}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Shipping Address
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-1 text-sm">
                  <div className="font-semibold text-gray-900">{orderDetails.selectedAddress.name}</div>
                  <div className="text-gray-700">{orderDetails.selectedAddress.line1}</div>
                  {orderDetails.selectedAddress.line2 && (
                    <div className="text-gray-700">{orderDetails.selectedAddress.line2}</div>
                  )}
                  <div className="text-gray-700">
                    {orderDetails.selectedAddress.city}, {orderDetails.selectedAddress.state} {orderDetails.selectedAddress.zipCode}
                  </div>
                  <div className="text-gray-700">{orderDetails.selectedAddress.country}</div>
                  <div className="text-gray-700 font-medium">Phone: {orderDetails.selectedAddress.phone}</div>
                </div>
              </div>
            </div>

            {/* Total Weight */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Scale className="h-5 w-5 mr-2 text-purple-600" />
                Shipment Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Items</label>
                  <p className="text-2xl font-bold text-gray-900">{orderDetails.vaultItems.length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Weight</label>
                  <p className="text-2xl font-bold text-gray-900">{orderDetails.totalWeight.toFixed(2)} kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vault Items & Shipping Update */}
          <div className="space-y-6">
            {/* Vault Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-orange-600" />
                Vault Items
              </h3>

              <div className="space-y-4">
                {orderDetails.vaultItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Vault ID:</span>
                            <p>{item.vaultItemId}</p>
                          </div>
                          <div>
                            <span className="font-medium">Weight:</span>
                            <p>{item.weight} kg</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information Update */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Shipping Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    International Shipping Link *
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={shippingLink}
                      onChange={(e) => setShippingLink(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://tracking.carrier.com/..."
                    />
                    {shippingLink && (
                      <a
                        href={shippingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the tracking URL from the shipping carrier
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    International Shipping ID *
                  </label>
                  <input
                    type="text"
                    value={shippingId}
                    onChange={(e) => setShippingId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., DHL123456789, FDX987654321"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the tracking number or shipment ID
                  </p>
                </div>

                {/* Current Values */}
                {(orderDetails.currentShippingLink || orderDetails.currentShippingId) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Values:</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {orderDetails.currentShippingLink && (
                        <div>
                          <span className="font-medium">Link:</span> {orderDetails.currentShippingLink}
                        </div>
                      )}
                      {orderDetails.currentShippingId && (
                        <div>
                          <span className="font-medium">ID:</span> {orderDetails.currentShippingId}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Update Button */}
                <button
                  onClick={handleUpdateOrder}
                  disabled={isSaving || !shippingLink.trim() || !shippingId.trim()}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size="sm" text="" />
                      <span>Updating Order...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShippingOrderUpdate;