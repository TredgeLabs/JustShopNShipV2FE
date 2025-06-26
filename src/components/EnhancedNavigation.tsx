import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Menu, X, LogOut, ShoppingCart } from 'lucide-react';

const EnhancedNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    console.log('User logging out...');
    // In a real app, you would:
    // 1. Call logout API
    // 2. Clear localStorage/sessionStorage
    // 3. Redirect to login page
    // userService.logout();
    // navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">JustShopAndShip</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <ShoppingCart className="h-4 w-4" />
                <span>Create Order</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/dashboard') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
                <button className="block w-full text-left px-3 py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EnhancedNavigation;