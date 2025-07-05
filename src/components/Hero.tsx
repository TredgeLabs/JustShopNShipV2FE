import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Package, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Shop from India.
            <span className="text-orange-400"> Ship Worldwide.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Get your personal vault address, consolidate your shopping, and save significantly on international shipping.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => navigate('/create-order')}
            >
              <Package className="h-5 w-5 mr-2" />
              Create Order
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold rounded-lg transition-all duration-300">
              Sign In
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <Globe className="h-8 w-8 text-orange-400" />
              <div className="text-left">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-blue-200">Countries Served</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Package className="h-8 w-8 text-orange-400" />
              <div className="text-left">
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm text-blue-200">Orders Delivered</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-8 w-8 text-orange-400" />
              <div className="text-left">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-blue-200">Secure Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;