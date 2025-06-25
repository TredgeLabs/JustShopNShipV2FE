import React, { useState } from 'react';
import { Calculator, Package, MapPin, Truck } from 'lucide-react';

const ShippingCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [destination, setDestination] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const calculateShipping = () => {
    if (weight && destination) {
      // Simple calculation logic (replace with actual API call)
      const baseRate = 15; // USD per kg
      const weightNum = parseFloat(weight);
      const cost = baseRate * weightNum;
      setEstimatedCost(cost);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shipping Calculator
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get an instant estimate for your international shipping costs
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calculator Form */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Calculator className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Calculate Your Shipping</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="inline h-4 w-4 mr-2" />
                    Package Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter weight in kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Destination Country
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select destination</option>
                    <option value="usa">United States</option>
                    <option value="canada">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="australia">Australia</option>
                    <option value="germany">Germany</option>
                    <option value="uae">United Arab Emirates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (cm) - Optional
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Length"
                    />
                    <input
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Width"
                    />
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Height"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateShipping}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Truck className="inline h-5 w-5 mr-2" />
                  Calculate Shipping Cost
                </button>
              </div>

              {/* Results */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Estimated Cost</h3>
                
                {estimatedCost !== null ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        ${estimatedCost.toFixed(2)}
                      </div>
                      <p className="text-gray-600">Estimated shipping cost</p>
                    </div>
                    
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base shipping rate:</span>
                        <span className="font-medium">${(estimatedCost * 0.8).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance & handling:</span>
                        <span className="font-medium">${(estimatedCost * 0.2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-3">
                        <span>Total:</span>
                        <span className="text-blue-600">${estimatedCost.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>💡 Pro Tip:</strong> Consolidate multiple orders to save up to 70% on shipping costs!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter package details to see estimated shipping cost</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingCalculator;