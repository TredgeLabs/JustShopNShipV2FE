import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingCart, Package, Star } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateOrder = () => {
    navigate('/create-order');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-blue-100 text-lg">Ready to shop from your favorite Indian stores?</p>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-2">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <p className="text-sm text-blue-100">4 Active Orders</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-2">
              <Package className="h-6 w-6" />
            </div>
            <p className="text-sm text-blue-100">₹15,300 Saved</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-2">
              <Star className="h-6 w-6" />
            </div>
            <p className="text-sm text-blue-100">Gold Member</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button onClick={handleCreateOrder} className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors">
          <ShoppingCart className="h-5 w-5" />
          <span>Create New Order</span>
        </button>
        <button onClick={handleViewProfile} className="flex items-center justify-center space-x-2 px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold rounded-lg transition-colors">
          <User className="h-5 w-5" />
          <span>View Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Welcome;