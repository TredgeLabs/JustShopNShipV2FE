import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Archive,
  MessageCircle,
  Settings,
  LogOut,
  Home,
  Search
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: 'Orders Management',
      href: '/admin/orders',
      icon: ShoppingCart,
      description: 'Manage local and international orders'
    },
    {
      name: 'Vault Entry',
      href: '/admin/vault-entry',
      icon: Package,
      description: 'Process incoming packages'
    },
    {
      name: 'Vault Search',
      href: '/admin/vault-search',
      icon: Search,
      description: 'Search and view vault contents'
    },
    {
      name: 'Inventory Management',
      href: '/admin/inventory',
      icon: Archive,
      description: 'Add and manage inventory items'
    },
    {
      name: 'Support Queries',
      href: '/admin/contact-support',
      icon: MessageCircle,
      description: 'Handle customer support requests'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      localStorage.removeItem('adminSession');
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin/orders" className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </Link>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                JustShopAndShip
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>User Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
              Navigation
            </h2>
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;