import React from 'react';
import { TrendingDown, DollarSign, Package, Truck, Calculator } from 'lucide-react';

interface ComparisonProduct {
  name: string;
  image: string;
  category: string;
  usPrice: number;
  indiaPrice: number;
  shippingCost: number;
  customsDuty: number;
  totalJSSCost: number;
  savings: number;
  savingsPercentage: number;
}

const comparisonProducts: ComparisonProduct[] = [
  {
    name: "Premium Smartphone",
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "Electronics",
    usPrice: 1000,
    indiaPrice: 650,
    shippingCost: 45,
    customsDuty: 55,
    totalJSSCost: 750,
    savings: 250,
    savingsPercentage: 25
  },
  {
    name: "Designer Silk Saree",
    image: "https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "Fashion",
    usPrice: 400,
    indiaPrice: 180,
    shippingCost: 25,
    customsDuty: 15,
    totalJSSCost: 220,
    savings: 180,
    savingsPercentage: 45
  },
  {
    name: "Ayurvedic Skincare Set",
    image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "Beauty & Health",
    usPrice: 150,
    indiaPrice: 60,
    shippingCost: 15,
    customsDuty: 8,
    totalJSSCost: 83,
    savings: 67,
    savingsPercentage: 45
  },
  {
    name: "Traditional Jewelry Set",
    image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "Jewelry",
    usPrice: 800,
    indiaPrice: 450,
    shippingCost: 35,
    customsDuty: 40,
    totalJSSCost: 525,
    savings: 275,
    savingsPercentage: 34
  }
];

const CostComparison: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See How Much You Can Save
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare the total cost of buying products in the US vs. ordering from India through JustShopAndShip
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {comparisonProducts.map((product, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm font-bold">{product.savingsPercentage}% OFF</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{product.name}</h3>

                <div className="grid grid-cols-2 gap-6">
                  {/* US Purchase */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      US Purchase
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product Price:</span>
                        <span className="font-medium">${product.usPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax & Fees:</span>
                        <span className="font-medium">Included</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-red-900">
                        <span>Total Cost:</span>
                        <span>${product.usPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* JustShopAndShip */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      JustShopAndShip
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">India Price:</span>
                        <span className="font-medium">${product.indiaPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">${product.shippingCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customs:</span>
                        <span className="font-medium">${product.customsDuty}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-green-900">
                        <span>Total Cost:</span>
                        <span>${product.totalJSSCost}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings Summary */}
                <div className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Calculator className="h-5 w-5" />
                    <span className="font-semibold">Your Savings</span>
                  </div>
                  <div className="text-2xl font-bold">${product.savings}</div>
                  <div className="text-sm opacity-90">Save {product.savingsPercentage}% with JustShopAndShip</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Average Savings Across Categories</h3>
            <p className="text-gray-600">Based on real customer orders and market analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-3">
                <Package className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">37%</div>
              <div className="text-sm text-gray-600">Average Savings</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-3">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">$193</div>
              <div className="text-sm text-gray-600">Average Saved per Order</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-3">
                <Truck className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">70%</div>
              <div className="text-sm text-gray-600">Shipping Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-3">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">$2.1M</div>
              <div className="text-sm text-gray-600">Total Customer Savings</div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Your Savings
          </button>
        </div>
      </div>
    </section>
  );
};

export default CostComparison;