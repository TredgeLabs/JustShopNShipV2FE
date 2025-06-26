import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Edit3, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  inventoryLink: string;
  onlineLink: string;
  status: 'delivered' | 'pending' | 'cancelled' | 'processing';
  price: number;
}

interface DomesticOrder {
  id: string;
  status: 'completed' | 'partial' | 'pending' | 'cancelled';
  orderDate: string;
  totalItems: number;
  deliveredItems: number;
  partialRefundAmount: number;
  totalAmount: number;
  items: OrderItem[];
  isExpanded: boolean;
}

const DomesticOrders: React.FC = () => {
  const [orders, setOrders] = useState<DomesticOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Mock data - replace with actual API call
  useEffect(() => {
    const loadDomesticOrders = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders: DomesticOrder[] = [
        {
          id: 'DO-001',
          status: 'completed',
          orderDate: '2024-01-20',
          totalItems: 3,
          deliveredItems: 3,
          partialRefundAmount: 0,
          totalAmount: 15200,
          isExpanded: false,
          items: [
            {
              id: 'DI-001',
              name: 'Traditional Silk Saree - Royal Blue',
              image: 'https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/saree-royal-blue',
              onlineLink: 'https://craftsvilla.com/saree-royal-blue',
              status: 'delivered',
              price: 3500
            },
            {
              id: 'DI-002',
              name: 'Ayurvedic Skincare Gift Set',
              image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/ayurvedic-skincare',
              onlineLink: 'https://nykaa.com/ayurvedic-skincare',
              status: 'delivered',
              price: 2100
            },
            {
              id: 'DI-003',
              name: 'Handcrafted Silver Jewelry Set',
              image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/silver-jewelry',
              onlineLink: 'https://tanishq.co.in/silver-jewelry',
              status: 'delivered',
              price: 9600
            }
          ]
        },
        {
          id: 'DO-002',
          status: 'partial',
          orderDate: '2024-01-15',
          totalItems: 4,
          deliveredItems: 2,
          partialRefundAmount: 1800,
          totalAmount: 8500,
          isExpanded: false,
          items: [
            {
              id: 'DI-004',
              name: 'Organic Spice Collection',
              image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/organic-spices',
              onlineLink: 'https://bigbasket.com/organic-spices',
              status: 'delivered',
              price: 1200
            },
            {
              id: 'DI-005',
              name: 'Cotton Kurta Set',
              image: 'https://images.pexels.com/photos/8148582/pexels-photo-8148582.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/cotton-kurta',
              onlineLink: 'https://fabindia.com/cotton-kurta',
              status: 'delivered',
              price: 2500
            },
            {
              id: 'DI-006',
              name: 'Brass Home Decor Items',
              image: 'https://images.pexels.com/photos/4465125/pexels-photo-4465125.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/brass-decor',
              onlineLink: 'https://example.com/brass-decor',
              status: 'cancelled',
              price: 1800
            },
            {
              id: 'DI-007',
              name: 'Herbal Tea Collection',
              image: 'https://images.pexels.com/photos/4198016/pexels-photo-4198016.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/herbal-tea',
              onlineLink: 'https://example.com/herbal-tea',
              status: 'pending',
              price: 3000
            }
          ]
        },
        {
          id: 'DO-003',
          status: 'pending',
          orderDate: '2024-01-25',
          totalItems: 2,
          deliveredItems: 0,
          partialRefundAmount: 0,
          totalAmount: 5500,
          isExpanded: false,
          items: [
            {
              id: 'DI-008',
              name: 'Wooden Handicrafts',
              image: 'https://images.pexels.com/photos/4465126/pexels-photo-4465126.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/wooden-handicrafts',
              onlineLink: 'https://example.com/wooden-handicrafts',
              status: 'processing',
              price: 2800
            },
            {
              id: 'DI-009',
              name: 'Traditional Paintings',
              image: 'https://images.pexels.com/photos/4465127/pexels-photo-4465127.jpeg?auto=compress&cs=tinysrgb&w=200',
              inventoryLink: '/inventory/traditional-paintings',
              onlineLink: 'https://example.com/traditional-paintings',
              status: 'processing',
              price: 2700
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
      setIsLoading(false);
    };

    loadDomesticOrders();
  }, []);

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'partial': return 'Partially Delivered';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'processing': return 'Processing';
      default: return 'Unknown';
    }
  };

  const getItemStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleCorrectOrder = (orderId: string) => {
    console.log('Requesting order correction for:', orderId);
    // TODO: Implement order correction request
    alert(`Order correction request initiated for order ${orderId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your domestic orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Domestic Orders</h1>
          </div>
          <p className="text-gray-600">
            Track and manage your domestic orders placed through JustShopAndShip within India.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Partial</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'partial').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">Placed on {formatDate(order.orderDate)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {order.deliveredItems} of {order.totalItems} items delivered
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                      {order.partialRefundAmount > 0 && (
                        <p className="text-sm text-green-600">
                          Refund: ₹{order.partialRefundAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedOrders.has(order.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items (Expandable) */}
              {expandedOrders.has(order.id) && (
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Order Items</h4>
                    <button
                      onClick={() => handleCorrectOrder(order.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Correct Your Order</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm leading-tight mb-2">
                              {item.name}
                            </h5>
                            
                            <div className="flex items-center space-x-2 mb-2">
                              {getItemStatusIcon(item.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemStatusColor(item.status)}`}>
                                {getItemStatusText(item.status)}
                              </span>
                            </div>
                            
                            <p className="text-sm font-semibold text-gray-900 mb-3">
                              ₹{item.price.toLocaleString()}
                            </p>
                            
                            <div className="flex space-x-2">
                              <a
                                href={item.inventoryLink}
                                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                              >
                                <Package className="h-3 w-3" />
                                <span>Inventory</span>
                              </a>
                              <a
                                href={item.onlineLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-800"
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span>Online</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No domestic orders found</h3>
            <p className="text-gray-600">Start shopping to see your orders here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomesticOrders;