import React, { useState, useEffect } from 'react';
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

interface OrderData {
  items: any[];
  totalPrice: number;
  totalWeight: number;
  totalItems: number;
  orderDate: string;
}

const AddressSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [addresses, setAddresses] = useState<AddressApi[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Load order data from localStorage
    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
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
            returnTo: '/address-selection',
            orderData: orderData
          }
        });
        return;
      }

      setAddresses(userAddresses);
      
      // Auto-select default address if available
      const defaultAddress = userAddresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id.toString());
      }
    } catch (err) {
      setError('Failed to load addresses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleAddNewAddress = () => {
    navigate('/add-address', {
      state: {
        totalAddress: addresses.length,
        returnTo: '/address-selection',
        orderData: orderData
      }
    });
  };

  const handleProceedToConfirmation = () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }

    // Store selected address ID with order data
    const updatedOrderData = {
      ...orderData,
      selectedAddressId: selectedAddressId
    };
    
    localStorage.setItem('orderData', JSON.stringify(updatedOrderData));
    navigate('/order-confirmation');
  };

  const handleBackToCart = () => {
    navigate('/create-order');
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
            onClick={handleBackToCart}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Cart</span>
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Select Delivery Address</h1>
          </div>
          <p className="text-gray-600">
            Choose where you want your order to be delivered after it arrives in your vault.
          </p>
        </div>

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
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAddressId === address.id.toString()
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAddressSelect(address.id.toString())}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          selectedAddressId === address.id.toString() ? 'bg-blue-100' : 'bg-gray-100'
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
                        {selectedAddressId === address.id.toString() && (
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
            {orderData && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{orderData.totalItems}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Weight:</span>
                    <span className="font-medium">{orderData.totalWeight.toFixed(2)} kg</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">₹{orderData.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Address Preview */}
            {selectedAddressId && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Address</h3>
                
                {(() => {
                  const selectedAddress = addresses.find(addr => addr.id.toString() === selectedAddressId);
                  if (!selectedAddress) return null;
                  
                  return (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {getAddressIcon(selectedAddress.title)}
                        <span className="font-medium text-green-900">{selectedAddress.title}</span>
                      </div>
                      <div className="text-sm text-green-800 space-y-1">
                        <p className="font-medium">{selectedAddress.recipient_first_name} {selectedAddress.recipient_last_name}</p>
                        <p>{formatFullAddress(selectedAddress)}</p>
                        <p>{selectedAddress.phone_country_code} {selectedAddress.phone_number}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Proceed Button */}
            <button
              onClick={handleProceedToConfirmation}
              disabled={!selectedAddressId}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Proceed to Confirmation</span>
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