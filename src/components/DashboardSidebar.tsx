import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  Plane, 
  ShoppingBag, 
  Search,
  AlertTriangle,
  HelpCircle,
  Calculator,
  BookOpen,
  Map,
  Menu,
  X,
  User,
  LifeBuoy
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const accountShortcuts = [
    {
      icon: Package,
      title: "My Vault",
      description: "View your vault address",
      color: "text-blue-600 hover:text-blue-700",
      bgColor: "hover:bg-blue-50",
      href: "/my-vault"
    },
    {
      icon: ShoppingCart,
      title: "Create Order / Shop Now",
      description: "Start a new order",
      color: "text-green-600 hover:text-green-700",
      bgColor: "hover:bg-green-50",
      href: "/inventory"
    },
    {
      icon: Truck,
      title: "Domestic Orders",
      description: "Orders within India",
      color: "text-orange-600 hover:text-orange-700",
      bgColor: "hover:bg-orange-50",
      href: "/domestic-orders"
    },
    {
      icon: Plane,
      title: "International Transit Orders",
      description: "Orders being shipped internationally",
      color: "text-purple-600 hover:text-purple-700",
      bgColor: "hover:bg-purple-50",
      href: "/international-orders"
    },
    {
      icon: ShoppingBag,
      title: "Order Offline",
      description: "Items not available online",
      color: "text-indigo-600 hover:text-indigo-700",
      bgColor: "hover:bg-indigo-50",
      href: "/order-offline"
    },
    {
      icon: Search,
      title: "Check Our Inventory",
      description: "Browse available items",
      color: "text-teal-600 hover:text-teal-700",
      bgColor: "hover:bg-teal-50",
      href: "/inventory"
    }
  ];

  const helpShortcuts = [
    {
      icon: AlertTriangle,
      title: "Prohibited Items",
      description: "Items we cannot ship",
      color: "text-red-600 hover:text-red-700",
      bgColor: "hover:bg-red-50",
      href: "/prohibited-items"
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Frequently asked questions",
      color: "text-yellow-600 hover:text-yellow-700",
      bgColor: "hover:bg-yellow-50",
      href: "/faq"
    },
    {
      icon: Calculator,
      title: "Shipping Calculator",
      description: "Calculate shipping costs",
      color: "text-pink-600 hover:text-pink-700",
      bgColor: "hover:bg-pink-50",
      href: "/shipping-calculator"
    },
    {
      icon: BookOpen,
      title: "Blog",
      description: "Tips and updates",
      color: "text-cyan-600 hover:text-cyan-700",
      bgColor: "hover:bg-cyan-50",
      href: "/blog"
    },
    {
      icon: Map,
      title: "Here's Your Guide",
      description: "Complete user guide",
      color: "text-emerald-600 hover:text-emerald-700",
      bgColor: "hover:bg-emerald-50",
      href: "/guide"
    }
  ];

  const handleShortcutClick = (href: string) => {
    navigate(href);
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* My Account Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4 px-4">
          <User className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">My Account</h3>
        </div>
        <div className="space-y-1">
          {accountShortcuts.map((shortcut, index) => (
            <button
              key={index}
              onClick={() => handleShortcutClick(shortcut.href)}
              className={`w-full text-left px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${shortcut.bgColor} group`}
            >
              <div className="flex items-center space-x-3">
                <shortcut.icon className={`h-5 w-5 ${shortcut.color} transition-colors`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-gray-800">
                    {shortcut.title}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {shortcut.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Help & Resources Section */}
      <div>
        <div className="flex items-center space-x-2 mb-4 px-4">
          <LifeBuoy className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Help & Resources</h3>
        </div>
        <div className="space-y-1">
          {helpShortcuts.map((shortcut, index) => (
            <button
              key={index}
              onClick={() => handleShortcutClick(shortcut.href)}
              className={`w-full text-left px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${shortcut.bgColor} group`}
            >
              <div className="flex items-center space-x-3">
                <shortcut.icon className={`h-5 w-5 ${shortcut.color} transition-colors`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-gray-800">
                    {shortcut.title}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {shortcut.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-gray-600" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-80 lg:bg-white lg:border-r lg:border-gray-200 lg:pt-20 lg:pb-4 lg:overflow-y-auto ${className}`}>
        <div className="flex-1 px-4 py-6">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-20 pb-4 overflow-y-auto">
              <div className="px-4 py-6">
                <SidebarContent />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;