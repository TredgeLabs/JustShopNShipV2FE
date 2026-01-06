import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Menu, X, LogOut, ShoppingCart } from 'lucide-react';
import { userService } from '../api/services/userService';
import { useCart } from '../context/CartContext'; // Assuming the context file created in Step 1

const EnhancedNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = userService.isAuthenticated();

  // Get cart count from Context
  const { getTotalCartItems } = useCart();

  const isActive = (path: string) => location.pathname === path;

  // If we are on the inventory or item details page
  const isInventoryPage = location.pathname.startsWith('/inventory');

  const handleLogout = async () => {
    if (isLoggedIn) {
      await userService.logout();
      navigate('/login', { replace: true });
    }
  };

  const handleCreateOrder = () => {
    if (isLoggedIn) {
      navigate('/create-order');
    } else {
      navigate('/login');
    }
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
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              Home
            </Link>
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                Dashboard
              </Link>) : (
              <Link
                to="/signup"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/signup')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                Sign Up
              </Link>)}

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Conditionally hide Create Order button if on Inventory page */}
              {!isInventoryPage && (
                <button
                  onClick={handleCreateOrder}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Create Order</span>
                </button>
              )}

              {/* CART ICON: ONLY VISIBLE ON INVENTORY PAGE */}
              {isInventoryPage && (
                <button
                  onClick={() => navigate('/create-order')}
                  className="relative p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {getTotalCartItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalCartItems()}
                    </span>
                  )}
                </button>
              )}

            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalCartItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {getTotalCartItems()}
                </span>
              )}
            </button>
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
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/inventory"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/inventory') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Inventory
              </Link>

              <div className="pt-4 pb-3 border-t border-gray-200">
                {isLoggedIn ? (
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700"
                  >
                    Sign In
                  </Link>
                )}

                {/* Mobile Create Order - Hidden on inventory */}
                {!isInventoryPage && (
                  <button
                    onClick={() => { handleCreateOrder(); setIsMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 mt-2 bg-blue-600 text-white rounded-lg"
                  >
                    Create Order
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EnhancedNavigation;