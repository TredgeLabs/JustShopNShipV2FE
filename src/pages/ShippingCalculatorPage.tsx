import React, { useState } from 'react';
import {
  Calculator,
  Package,
  MapPin,
  Truck,
  DollarSign,
  Info,
  Zap,
  Clock,
  Shield
} from 'lucide-react';
import { countries } from '../constants/countries';

interface ShippingRate {
  service: string;
  price: number;
  deliveryTime: string;
  features: string[];
}

const ShippingCalculatorPage: React.FC = () => {
  const [formData, setFormData] = useState({
    weight: '',
    length: '',
    width: '',
    height: '',
    destination: '',
    value: ''
  });
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateShipping = async () => {
    if (!formData.weight || !formData.destination) {
      alert('Please fill in weight and destination');
      return;
    }

    setIsCalculating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const weight = parseFloat(formData.weight);

    // Mock calculation logic
    const baseRates = {
      'US': 18,
      'CA': 16,
      'GB': 20,
      'AU': 22,
      'DE': 19,
      'AE': 15,
      'SG': 17,
      'FR': 21,
      'JP': 24,
      'NL': 20
    };

    const baseRate = baseRates[formData.destination as keyof typeof baseRates] || 20;

    const mockRates: ShippingRate[] = [
      {
        service: 'Express Shipping',
        price: Math.round((baseRate * weight * 1.5) * 100) / 100,
        deliveryTime: '3-5 business days',
        features: ['Priority handling', 'Express customs clearance', 'Premium tracking', 'Insurance included']
      },
      {
        service: 'Standard Shipping',
        price: Math.round((baseRate * weight) * 100) / 100,
        deliveryTime: '7-12 business days',
        features: ['Standard tracking', 'Basic insurance', 'Reliable delivery']
      },
      {
        service: 'Economy Shipping',
        price: Math.round((baseRate * weight * 0.7) * 100) / 100,
        deliveryTime: '12-20 business days',
        features: ['Basic tracking', 'Cost-effective', 'Longer transit time']
      }
    ];

    setShippingRates(mockRates);
    setShowResults(true);
    setIsCalculating(false);
  };

  const getDimensionalWeight = () => {
    if (!formData.length || !formData.width || !formData.height) return null;

    const length = parseFloat(formData.length);
    const width = parseFloat(formData.width);
    const height = parseFloat(formData.height);

    // Dimensional weight formula: (L × W × H) / 5000
    return Math.round((length * width * height / 5000) * 100) / 100;
  };

  const getChargeableWeight = () => {
    const actualWeight = parseFloat(formData.weight) || 0;
    const dimWeight = getDimensionalWeight() || 0;
    return Math.max(actualWeight, dimWeight);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Shipping Calculator</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get instant shipping cost estimates for your international packages.
            Enter your package details below to see available shipping options and pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Package Details</h2>

            <div className="space-y-6">
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="inline h-4 w-4 mr-2" />
                  Package Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter weight in kg"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (cm) - Optional
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Length"
                  />
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Width"
                  />
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Height"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Dimensions help calculate dimensional weight for accurate pricing
                </p>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Destination Country *
                </label>
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select destination</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Package Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-2" />
                  Package Value (USD) - Optional
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter package value for insurance"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for insurance calculation and customs declaration
                </p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateShipping}
                disabled={isCalculating || !formData.weight || !formData.destination}
                className="w-full flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Shipping Cost
                  </>
                )}
              </button>
            </div>

            {/* Weight Information */}
            {(formData.weight || getDimensionalWeight()) && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Weight Calculation</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  {formData.weight && (
                    <div className="flex justify-between">
                      <span>Actual Weight:</span>
                      <span>{formData.weight} kg</span>
                    </div>
                  )}
                  {getDimensionalWeight() && (
                    <div className="flex justify-between">
                      <span>Dimensional Weight:</span>
                      <span>{getDimensionalWeight()} kg</span>
                    </div>
                  )}
                  {getChargeableWeight() > 0 && (
                    <div className="flex justify-between font-medium border-t border-blue-200 pt-1">
                      <span>Chargeable Weight:</span>
                      <span>{getChargeableWeight()} kg</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Options</h2>

            {!showResults ? (
              <div className="text-center py-12">
                <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Enter package details to see shipping options</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shippingRates.map((rate, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {rate.service === 'Express Shipping' && <Zap className="h-5 w-5 text-yellow-500" />}
                        {rate.service === 'Standard Shipping' && <Truck className="h-5 w-5 text-blue-500" />}
                        {rate.service === 'Economy Shipping' && <Clock className="h-5 w-5 text-gray-500" />}
                        <h3 className="font-semibold text-gray-900">{rate.service}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${rate.price}</div>
                        <div className="text-sm text-gray-600">{rate.deliveryTime}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {rate.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                      Select This Option
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Info className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">How It Works</h3>
            </div>
            <p className="text-sm text-gray-600">
              Shipping costs are calculated based on weight, dimensions, destination, and service level.
              We use dimensional weight pricing to ensure fair and accurate pricing.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Insurance Included</h3>
            </div>
            <p className="text-sm text-gray-600">
              All shipments include basic insurance coverage. Higher value items can be insured
              for their full declared value for additional peace of mind.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Package className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Consolidation Savings</h3>
            </div>
            <p className="text-sm text-gray-600">
              Save up to 70% by consolidating multiple packages into one shipment.
              The more items you combine, the greater your savings!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCalculatorPage;