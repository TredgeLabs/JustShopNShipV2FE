import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Truck, Plane, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  productName: string;
  seller: string;
  price: number;
  status: 'ordered' | 'received' | 'shipped' | 'delivered';
  orderDate: string;
  trackingNumber?: string;
}

const EnhancedOrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      productName: 'Traditional Silk Saree',
      seller: 'Craftsvilla',
      price: 3500,
      status: 'delivered',
      orderDate: '2024-01-15',
      trackingNumber: 'JSS-TK-2024-001'
    },
    {
      id: 'ORD-002',
      productName: 'Ayurvedic Skincare Set',
      seller: 'Nykaa',
      price: 2100,
      status: 'shipped',
      orderDate: '2024-01-20',
      trackingNumber: 'JSS-TK-2024-002'
    },
    {
      id: 'ORD-003',
      productName: 'Handcrafted Jewelry',
      seller: 'Tanishq',
      price: 8500,
      status: 'received',
      orderDate: '2024-01-25'
    },
    {
      id: 'ORD-004',
      productName: 'Organic Spices Bundle',
      seller: 'BigBasket',
      price: 1200,
      status: 'ordered',
      orderDate: '2024-01-28'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ordered': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'received': return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Plane className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ordered': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ordered': return 'Order Placed';
      case 'received': return 'Received at Vault';
      case 'shipped': return 'Shipped Internationally';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  const handleStatusClick = (status: string) => {
    console.log(`Navigating to ${status} orders page`);
    if (status === 'ordered' || status === 'received') {
      navigate('/domestic-orders');
    } else if (status === 'shipped' || status === 'delivered') {
      navigate('/international-orders');
    }
  };

  const handleCreateOrder = () => {
    console.log('Navigating to create order page');
    navigate('/create-order');
  };

  const handleViewOrderDetails = (orderId: string, status: string) => {
    // Determine if it's a local or international order based on status
    if (status === 'ordered' || status === 'received') {
      navigate(`/local-order/${orderId}`);
    } else if (status === 'shipped' || status === 'delivered') {
      navigate(`/international-order/${orderId}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Truck className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        </div>
        <button 
          onClick={handleCreateOrder}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => handleStatusClick('ordered')}
          className="bg-yellow-50 hover:bg-yellow-100 rounded-lg p-4 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-yellow-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold text-yellow-900">1</p>
              <p className="text-sm text-yellow-700">Orders Placed</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleStatusClick('received')}
          className="bg-blue-50 hover:bg-blue-100 rounded-lg p-4 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold text-blue-900">1</p>
              <p className="text-sm text-blue-700">At Vault</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleStatusClick('shipped')}
          className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <Plane className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold text-purple-900">1</p>
              <p className="text-sm text-purple-700">In Transit</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleStatusClick('delivered')}
          className="bg-green-50 hover:bg-green-100 rounded-lg p-4 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold text-green-900">1</p>
              <p className="text-sm text-green-700">Delivered</p>
            </div>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">#{order.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className="text-sm text-gray-500">{order.orderDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{order.productName}</h3>
                <p className="text-sm text-gray-600">Seller: {order.seller}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">₹{order.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Order Value</p>
              </div>
              <div className="text-right">
                {order.trackingNumber && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">Tracking: {order.trackingNumber}</p>
                  </div>
                )}
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  <span onClick={() => handleViewOrderDetails(order.id, order.status)} className="cursor-pointer">
                    View Details →
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedOrderManagement;