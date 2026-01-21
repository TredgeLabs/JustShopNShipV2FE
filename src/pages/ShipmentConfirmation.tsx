import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreateInternationalOrderRequest } from '../api/services/orderService';
import {
  Package,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  AlertCircle,
  FileText,
  CreditCard,
  Info,
  Truck,
  Clock,
  Loader2
} from 'lucide-react';

interface VaultItem {
  id: string;
  name: string;
  images: string[];
  color: string;
  size: string;
  quantity: number;
  weight: number; // kg
  price: number;
}

export interface ShipmentPricing {
  currency: 'INR';
  shippingCost: number;   // ✅ calculated from API slabs
  storageCost: number;
  platformFee: number;
  totalCost: number;
}

export interface ShipmentData {
  items: VaultItem[];
  destination: string;
  shippingService?: string;
  chargeableWeightKg?: number | null;
  pricing?: ShipmentPricing;
  orderRequest?: CreateInternationalOrderRequest;
}

const ShipmentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const selectedAddressId = location.state?.selectedAddressId ?? 0;

  useEffect(() => {
    const savedShipmentData = localStorage.getItem('shipmentData');
    if (savedShipmentData) {
      setShipmentData(JSON.parse(savedShipmentData));
    } else {
      navigate('/my-vault');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  const totals = useMemo(() => {
    if (!shipmentData) {
      return {
        totalWeightKg: 0,
        totalItemsQty: 0,
        totalValue: 0,
      };
    }

    const totalWeightKg = shipmentData.items.reduce(
      (total, item) => total + (item.weight || 0),
      0
    );

    const totalItemsQty = shipmentData.items.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );

    const totalValue = shipmentData.items.reduce(
      (total, item) => total + ((item.price || 0) * (item.quantity || 1)),
      0
    );

    return { totalWeightKg, totalItemsQty, totalValue };
  }, [shipmentData]);

  // ✅ Use pricing from localStorage (from MyVault createInternationalOrder)
  const pricing = useMemo(() => {
    if (!shipmentData) return null;

    // Prefer shipmentData.pricing
    if (shipmentData.pricing) return shipmentData.pricing;

    // Fallback if someone stored only orderRequest
    const fallbackShipping = (shipmentData as any)?.orderRequest?.orderData?.shipping_cost ?? 0;
    const fallbackStorage = (shipmentData as any)?.orderRequest?.orderData?.storage_cost ?? 0;
    const fallbackPlatform = (shipmentData as any)?.orderRequest?.orderData?.platform_fee ?? 0;
    const fallbackTotal = (shipmentData as any)?.orderRequest?.orderData?.total_cost ?? (fallbackShipping + fallbackStorage + fallbackPlatform);

    return {
      currency: 'INR' as const,
      shippingCost: Number(fallbackShipping) || 0,
      storageCost: Number(fallbackStorage) || 0,
      platformFee: Number(fallbackPlatform) || 0,
      totalCost: Number(fallbackTotal) || 0,
    };
  }, [shipmentData]);

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleProceedToPay = () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions to proceed');
      return;
    }
    if (!shipmentData || !pricing) return;

    // ✅ Pass the real total amount to payment page
    navigate('/payment', {
      state: {
        type: 'international',
        selectedAddressId,
        amount: pricing.totalCost,      // ✅ actual
        currency: pricing.currency,     // ✅ INR
      }
    });
  };

  const handleBackToVault = () => {
    navigate('/my-vault');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-8 w-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (!shipmentData || !pricing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shipment data found</h3>
          <p className="text-gray-600 mb-4">Please select items from your vault first.</p>
          <button
            onClick={() => navigate('/my-vault')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to My Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToVault}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Vault</span>
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Shipment Confirmation</h1>
          </div>
          <p className="text-gray-600">
            Review your shipment details and costs before proceeding to payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Items to Ship</h2>

              <div className="space-y-4">
                {shipmentData.items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        {item.images?.length > 1 && (
                          <div className="text-xs text-gray-500 text-center mt-1">
                            +{item.images.length - 1} more
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Color:</span>
                            <p className="font-medium">{item.color || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Size:</span>
                            <p className="font-medium">{item.size || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <p className="font-medium">{item.quantity || 1}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Weight:</span>
                            <p className="font-medium">{(item.weight || 0).toFixed(2)} kg</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Original Value: ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm font-medium text-blue-600">
                            Item #{index + 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipment Summary */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-3">Shipment Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total Items:</span>
                    <p className="font-semibold text-blue-900">{totals.totalItemsQty}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Total Weight:</span>
                    <p className="font-semibold text-blue-900">{totals.totalWeightKg.toFixed(2)} kg</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Destination:</span>
                    <p className="font-semibold text-blue-900">{shipmentData.destination}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Service:</span>
                    <p className="font-semibold text-blue-900">{shipmentData.shippingService || 'Standard International'}</p>
                  </div>
                </div>

                {shipmentData.chargeableWeightKg != null && (
                  <div className="mt-3 text-sm text-blue-900">
                    Chargeable Weight: <span className="font-semibold">{shipmentData.chargeableWeightKg} kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Cost Breakdown
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700">Shipping Cost</span>
                    <p className="text-xs text-gray-500">
                      Based on destination slab rates
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(pricing.shippingCost, pricing.currency)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700">Storage Cost</span>
                    <p className="text-xs text-gray-500">If applicable</p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(pricing.storageCost, pricing.currency)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700">Platform Fee</span>
                    <p className="text-xs text-gray-500">Service fee</p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(pricing.platformFee, pricing.currency)}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900">Total Cost:</span>
                    <span className="text-blue-600">
                      {formatCurrency(pricing.totalCost, pricing.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Delivery Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Transit:</span>
                  <span className="font-medium">7-12 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium">{shipmentData.shippingService || 'Standard International'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking:</span>
                  <span className="font-medium">Included</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-600" />
                Terms & Conditions
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
                <div className="text-sm text-gray-700 space-y-2">
                  <p>1. International shipping is subject to customs regulations and may incur additional duties.</p>
                  <p>2. Delivery times are estimates and may vary due to customs processing or carrier delays.</p>
                  <p>3. Prohibited items will not be shipped and may be disposed of at sender's expense.</p>
                  <p>4. Customs duties and taxes are the responsibility of the recipient.</p>
                  <p>5. Shipment tracking will be provided once the package is dispatched.</p>
                </div>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the shipping terms and conditions, and understand that customs duties may apply.
                </span>
              </label>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceedToPay}
              disabled={!acceptedTerms || isCreatingOrder}
              className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
            >
              {isCreatingOrder ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Order...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Important Notes:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Final shipping cost may vary based on actual package dimensions</li>
                    <li>• Customs duties are calculated by destination country authorities</li>
                    <li>• Delivery address cannot be changed once payment is processed</li>
                    <li>• Contact support for any questions before proceeding</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentConfirmation;