import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Plus,
  CheckCircle,
  Home,
  Building,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { userService, AddressApi } from '../api/services/userService';
import { ShipmentData } from './ShipmentConfirmation';
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const norm = (v?: string) => String(v || "").trim();

const toISO2 = (value?: string) => {
  const v = norm(value);
  if (!v) return "";

  const upper = v.toUpperCase();

  // already ISO2
  if (/^[A-Z]{2}$/.test(upper)) return upper;

  // try convert from full country name -> ISO2
  const code = countries.getAlpha2Code(v, "en");
  return (code || upper).toUpperCase();
};

const displayCountry = (value?: string) => {
  const code = toISO2(value);
  if (!code) return "";
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
};

const AddressSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [addresses, setAddresses] = useState<AddressApi[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null);
  const [estimateWarning, setEstimateWarning] = useState<string>('');
  const [isEstimateMismatch, setIsEstimateMismatch] = useState(false);
  const normCountry = (c?: string) => String(c || '').trim().toUpperCase();

  const selectedAddress = useMemo(
    () => addresses.find(a => a.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const selectedAddressCountry = normCountry(selectedAddress?.country);


  useEffect(() => {
    // Load order data from localStorage
    const savedOrderData = localStorage.getItem('shipmentData');
    if (savedOrderData) {
      setShipmentData(JSON.parse(savedOrderData));
    } else {
      // No order data, redirect back to create order
      navigate('/create-order');
      return;
    }

    loadAddresses();
  }, [navigate]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      setError('');
      const userAddresses = await userService.getAddresses();

      if (userAddresses.length === 0) {
        // No addresses exist, redirect to add address page
        navigate('/add-address', {
          state: {
            totalAddress: 0,
            returnTo: '/address-selection'
          }
        });
        return;
      }

      setAddresses(userAddresses);

      // Auto-select default address if available
      const defaultAddress = userAddresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (err) {
      setError('Failed to load addresses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!shipmentData || !selectedAddressId || addresses.length === 0) return;

    const estimateRaw = localStorage.getItem("shippingEstimate");
    const estimate = estimateRaw ? JSON.parse(estimateRaw) : null;

    // Prefer explicit code fields if you have them
    const estimateCode = toISO2(
      estimate?.countryCode || estimate?.country || shipmentData.destination
    );

    const addressCode = toISO2(selectedAddress?.country);

    if (!estimateCode || !addressCode) {
      setEstimateWarning("");
      setIsEstimateMismatch(false);
      return;
    }

    if (estimateCode !== addressCode) {
      setIsEstimateMismatch(true);

      const estimateName = displayCountry(estimateCode);
      const addressName = displayCountry(addressCode);

      setEstimateWarning(
        `Your shipping estimate is for ${estimateName}, but your selected address is in ${addressName}. Please recalculate shipping or choose an address in ${estimateName}.`
      );
    } else {
      setIsEstimateMismatch(false);
      setEstimateWarning("");
    }
  }, [shipmentData, selectedAddressId, addresses, selectedAddress]);



  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId);
  };

  const handleAddNewAddress = () => {
    navigate('/add-address', {
      state: {
        totalAddress: addresses.length,
        returnTo: '/address-selection',
      }
    });
  };

  const handleProceedToConfirmation = () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }
    navigate('/shipment-confirmation', { state: { selectedAddressId } });//
  };

  const handleBackToVault = () => {
    navigate('/my-vault');
  };

  const getAddressIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'home': return <Home className="h-5 w-5" />;
      case 'office': return <Building className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const formatFullAddress = (address: AddressApi) => {
    const parts = [
      address.line1,
      address.line2,
      `${address.city}, ${address.state} ${address.zip_code}`,
      address.country
    ].filter(Boolean);

    return parts.join(', ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToVault}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Vault</span>
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Select Delivery Address</h1>
          </div>
          <p className="text-gray-600">
            Choose where you want your order to be delivered after it arrives in your vault.
          </p>
        </div>

        {estimateWarning && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span className="text-yellow-800 text-sm">{estimateWarning}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Address Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Addresses</h2>
                <button
                  onClick={handleAddNewAddress}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === address.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => handleAddressSelect(address.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${selectedAddressId === address.id ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                          {getAddressIcon(address.title)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">{address.title}</h3>
                            {address.is_default && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium">{address.recipient_first_name} {address.recipient_last_name}</p>
                            <p>{formatFullAddress(address)}</p>
                            <p>{address.phone_country_code} {address.phone_number}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {selectedAddressId === address.id && (
                          <CheckCircle className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {shipmentData && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                {(() => {
                  const totalItems = shipmentData.items.length;
                  const totalWeightKg = shipmentData.items.reduce((sum: number, item: any) => sum + (item.weight || 0), 0);

                  const shippingCost = shipmentData.pricing?.shippingCost ?? 0;
                  const storageCost = shipmentData.pricing?.storageCost ?? 0;
                  const platformFee = shipmentData.pricing?.platformFee ?? 0;
                  const totalCost = shipmentData.pricing?.totalCost ?? (shippingCost + storageCost + platformFee);

                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destination:</span>
                        <span className="font-medium">{shipmentData.destination}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-medium">{totalItems}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Weight:</span>
                        <span className="font-medium">{totalWeightKg.toFixed(2)} kg</span>
                      </div>

                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-medium">₹{shippingCost.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Storage:</span>
                          <span className="font-medium">₹{storageCost.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Platform Fee:</span>
                          <span className="font-medium">₹{platformFee.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="flex justify-between text-lg font-semibold pt-2">
                          <span>Total Amount:</span>
                          <span className="text-blue-600">₹{totalCost.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Proceed Button */}
            <button
              onClick={handleProceedToConfirmation}
              disabled={!selectedAddressId || isEstimateMismatch}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              <span>{isEstimateMismatch ? 'Recalculate Shipping to Proceed' : 'Proceed to Confirmation'}</span>
            </button>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• This address will be used for international shipping</li>
                <li>• Make sure the address is complete and accurate</li>
                <li>• You can change the default address in your profile</li>
                <li>• Customs duties may apply based on destination country</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionPage;