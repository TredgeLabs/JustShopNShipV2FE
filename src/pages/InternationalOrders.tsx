import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService, InternationalOrder, InternationalOrderItem } from '../api/services/orderService';
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


const InternationalOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<InternationalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInternationalOrders = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await orderService.getInternationalOrders();
        
        if (response.success && response.orders) {
          setOrders(response.orders);
        } else {
          setError('Failed to load international orders');
        }
      } catch (err) {
        setError('Error loading international orders. Please try again.');
        console.error('Error loading international orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInternationalOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'shipped': return 'Shipped';
      case 'in-transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'shipped': return <Truck className="h-5 w-5" />;
      case 'in-transit': return <Plane className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'cancelled': return <AlertTriangle className="h-5 w-5" />;
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

  const getTotalWeight = (order: InternationalOrder) => {
    return order.shipment_weight_gm / 1000; // Convert grams to kg
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
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
                  {orders.filter(order => order.shipping_status === 'delivered').length}
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
                  {orders.filter(order => ['shipped', 'in-transit'].includes(order.shipping_status)).length}
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
                  ₹{orders.reduce((sum, order) => sum + parseFloat(order.total_cost), 0).toFixed(2)}
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
                    <div className={`p-2 rounded-lg ${getStatusColor(order.shipping_status)}`}>
                      {getStatusIcon(order.shipping_status)}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order ID: {order.id}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {formatDate(order.createdAt)}</span>
                        </div>
                        {order.tracking_id && (
                          <div className="flex items-center space-x-1">
                            <Truck className="h-4 w-4" />
                            <span>{order.tracking_id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.shipping_status)}`}>
                        {getStatusText(order.shipping_status)}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        ₹{parseFloat(order.total_cost).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">Weight: {getTotalWeight(order).toFixed(1)} kg</p>
                    </div>
                    
                    {order.tracking_link && (
                      <a
                        href={order.tracking_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Track</span>
                      </a>
                    )}
                    
                    <button
                      onClick={() => handleViewDetails(order.id.toString())}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Details</span>
                    </button>
                    
                    <button
                      onClick={() => toggleOrderExpansion(order.id.toString())}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedOrders.has(order.id.toString()) ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items (Expandable) */}
              {expandedOrders.has(order.id.toString()) && order.international_order_items && (
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Shipped Items</h4>
                    <div className="text-sm text-gray-600">
                      Total Weight: {getTotalWeight(order).toFixed(1)} kg
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      This order contains {order.international_order_items.length} vault item(s) 
                      with a total weight of {getTotalWeight(order).toFixed(1)} kg.
                    </p>
                    <div className="mt-2 space-y-1">
                      {order.international_order_items.map((item, index) => (
                        <div key={item.id} className="text-xs text-blue-700">
                          Vault Item ID: {item.vault_item_id}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Shipping Timeline */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-4">Shipping Timeline</h5>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Order Processed</span>
                          <span className="text-gray-500 ml-2">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          ['shipped', 'in-transit', 'delivered'].includes(order.shipping_status) 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`}></div>
                        <div className="text-sm">
                          <span className="font-medium">Shipped</span>
                          {['shipped', 'in-transit', 'delivered'].includes(order.shipping_status) && (
                            <span className="text-gray-500 ml-2">{formatDate(order.updatedAt)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          ['in-transit', 'delivered'].includes(order.shipping_status) 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`}></div>
                        <div className="text-sm">
                          <span className="font-medium">In Transit</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          order.shipping_status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="text-sm">
                          <span className="font-medium">Delivered</span>
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