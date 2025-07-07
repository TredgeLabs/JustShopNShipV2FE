import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Package, 
  ExternalLink, 
  Truck, 
  Eye, 
  MapPin, 
  Calendar, 
  DollarSign,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface ShippingItem {
  id: string;
  name: string;
  images: string[];
  weight: number;
  orderDetailsLink: string;
  originalPrice: number;
}

interface InternationalOrder {
  id: string;
  transitId: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'customs' | 'delivered' | 'exception';
  trackingLink: string;
  totalShippingPrice: number;
  shippingDate: string;
  estimatedDelivery: string;
  destination: string;
  carrier: string;
  items: ShippingItem[];
  isExpanded: boolean;
}

const InternationalOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<InternationalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Mock data - replace with actual API call
  useEffect(() => {
    const loadInternationalOrders = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders: InternationalOrder[] = [
        {
          id: 'IO-001',
          transitId: 'JSS-INT-2024-001',
          status: 'delivered',
          trackingLink: 'https://tracking.example.com/JSS-INT-2024-001',
          totalShippingPrice: 125.50,
          shippingDate: '2024-01-15',
          estimatedDelivery: '2024-01-25',
          destination: 'Toronto, Canada',
          carrier: 'DHL Express',
          isExpanded: false,
          items: [
            {
              id: 'SI-001',
              name: 'Traditional Silk Saree - Royal Blue',
              images: [
                'https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=200',
                'https://images.pexels.com/photos/8148580/pexels-photo-8148580.jpeg?auto=compress&cs=tinysrgb&w=200'
              ],
              weight: 0.8,
              orderDetailsLink: '/orders/domestic/DO-001',
              originalPrice: 3500
            },
            {
              id: 'SI-002',
              name: 'Ayurvedic Skincare Gift Set',
              images: [
                'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=200'
              ],
              weight: 1.2,
              orderDetailsLink: '/orders/domestic/DO-001',
              originalPrice: 2100
            }
          ]
        },
        {
          id: 'IO-002',
          transitId: 'JSS-INT-2024-002',
          status: 'in-transit',
          trackingLink: 'https://tracking.example.com/JSS-INT-2024-002',
          totalShippingPrice: 89.75,
          shippingDate: '2024-01-20',
          estimatedDelivery: '2024-01-30',
          destination: 'London, UK',
          carrier: 'FedEx International',
          isExpanded: false,
          items: [
            {
              id: 'SI-003',
              name: 'Handcrafted Silver Jewelry Set',
              images: [
                'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=200',
                'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=200'
              ],
              weight: 0.3,
              orderDetailsLink: '/orders/domestic/DO-002',
              originalPrice: 8500
            }
          ]
        },
        {
          id: 'IO-003',
          transitId: 'JSS-INT-2024-003',
          status: 'customs',
          trackingLink: 'https://tracking.example.com/JSS-INT-2024-003',
          totalShippingPrice: 156.25,
          shippingDate: '2024-01-22',
          estimatedDelivery: '2024-02-02',
          destination: 'Sydney, Australia',
          carrier: 'UPS Worldwide',
          isExpanded: false,
          items: [
            {
              id: 'SI-004',
              name: 'Organic Spice Collection',
              images: [
                'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=200'
              ],
              weight: 2.5,
              orderDetailsLink: '/orders/domestic/DO-003',
              originalPrice: 1200
            },
            {
              id: 'SI-005',
              name: 'Cotton Kurta Set',
              images: [
                'https://images.pexels.com/photos/8148582/pexels-photo-8148582.jpeg?auto=compress&cs=tinysrgb&w=200'
              ],
              weight: 0.6,
              orderDetailsLink: '/orders/domestic/DO-003',
              originalPrice: 2500
            }
          ]
        },
        {
          id: 'IO-004',
          transitId: 'JSS-INT-2024-004',
          status: 'processing',
          trackingLink: '',
          totalShippingPrice: 198.00,
          shippingDate: '2024-01-28',
          estimatedDelivery: '2024-02-08',
          destination: 'New York, USA',
          carrier: 'DHL Express',
          isExpanded: false,
          items: [
            {
              id: 'SI-006',
              name: 'Wooden Handicrafts',
              images: [
                'https://images.pexels.com/photos/4465126/pexels-photo-4465126.jpeg?auto=compress&cs=tinysrgb&w=200'
              ],
              weight: 2.8,
              orderDetailsLink: '/orders/domestic/DO-004',
              originalPrice: 2800
            },
            {
              id: 'SI-007',
              name: 'Traditional Paintings',
              images: [
                'https://images.pexels.com/photos/4465127/pexels-photo-4465127.jpeg?auto=compress&cs=tinysrgb&w=200'
              ],
              weight: 1.5,
              orderDetailsLink: '/orders/domestic/DO-004',
              originalPrice: 2700
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
      setIsLoading(false);
    };

    loadInternationalOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'customs': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-gray-100 text-gray-800';
      case 'exception': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in-transit': return 'In Transit';
      case 'shipped': return 'Shipped';
      case 'customs': return 'At Customs';
      case 'processing': return 'Processing';
      case 'exception': return 'Exception';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'in-transit': return <Plane className="h-5 w-5" />;
      case 'shipped': return <Truck className="h-5 w-5" />;
      case 'customs': return <AlertTriangle className="h-5 w-5" />;
      case 'processing': return <Clock className="h-5 w-5" />;
      case 'exception': return <AlertTriangle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
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

  const handleViewDetails = (orderId: string) => {
    navigate(`/international-order/${orderId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalWeight = (items: ShippingItem[]) => {
    return items.reduce((sum, item) => sum + item.weight, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your international orders...</p>
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
            <Plane className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">International Shipping Orders</h1>
          </div>
          <p className="text-gray-600">
            Track your international shipments from your vault to your doorstep worldwide.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => ['in-transit', 'shipped', 'customs'].includes(order.status)).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Shipping</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.totalShippingPrice, 0).toFixed(2)}
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
                    <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Transit ID: {order.transitId}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Shipped: {formatDate(order.shippingDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{order.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Truck className="h-4 w-4" />
                          <span>{order.carrier}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        ${order.totalShippingPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ETA: {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                    
                    {order.trackingLink && (
                      <a
                        href={order.trackingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Track</span>
                      </a>
                    )}
                    
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Details</span>
                    </button>
                    
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
                    <h4 className="text-lg font-medium text-gray-900">Shipped Items</h4>
                    <div className="text-sm text-gray-600">
                      Total Weight: {getTotalWeight(order.items).toFixed(1)} kg
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            {item.images.length > 1 && (
                              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                +{item.images.length - 1}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm leading-tight mb-2">
                              {item.name}
                            </h5>
                            
                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex justify-between">
                                <span>Weight:</span>
                                <span className="font-medium">{item.weight} kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Original Price:</span>
                                <span className="font-medium">₹{item.originalPrice.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex space-x-2 mb-2">
                                <button
                                  onClick={() => handleViewDetails(order.id)}
                                  className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-800"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>Details</span>
                                </button>
                              </div>
                              <a
                                href={item.orderDetailsLink}
                                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                              >
                                <Eye className="h-3 w-3" />
                                <span>Order Details</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Shipping Timeline */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-4">Shipping Timeline</h5>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Order Processed</span>
                          <span className="text-gray-500 ml-2">{formatDate(order.shippingDate)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          ['shipped', 'in-transit', 'customs', 'delivered'].includes(order.status) 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`}></div>
                        <div className="text-sm">
                          <span className="font-medium">Shipped</span>
                          {['shipped', 'in-transit', 'customs', 'delivered'].includes(order.status) && (
                            <span className="text-gray-500 ml-2">{formatDate(order.shippingDate)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          ['in-transit', 'customs', 'delivered'].includes(order.status) 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`}></div>
                        <div className="text-sm">
                          <span className="font-medium">In Transit</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="text-sm">
                          <span className="font-medium">Delivered</span>
                          <span className="text-gray-500 ml-2">ETA: {formatDate(order.estimatedDelivery)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No international orders found</h3>
            <p className="text-gray-600">Ship items from your vault to see tracking information here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternationalOrders;