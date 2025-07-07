import React from 'react';
import { Calendar, User, Package, DollarSign, MapPin, Truck } from 'lucide-react';

interface OrderSummaryProps {
  orderId: string;
  customerName: string;
  orderDate: string;
  totalItems: number;
  totalAmount: number;
  status: string;
  destination?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  type: 'local' | 'international';
}

const OrderSummaryCard: React.FC<OrderSummaryProps> = ({
  orderId,
  customerName,
  orderDate,
  totalItems,
  totalAmount,
  status,
  destination,
  carrier,
  trackingNumber,
  estimatedDelivery,
  type
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold text-gray-900">{orderId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-semibold text-gray-900">{customerName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold text-gray-900">{formatDate(orderDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="font-semibold text-gray-900">{totalItems}</p>
            </div>
          </div>
          
          {type === 'international' && destination && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-semibold text-gray-900">{destination}</p>
              </div>
            </div>
          )}
          
          {type === 'international' && carrier && (
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Carrier</p>
                <p className="font-semibold text-gray-900">{carrier}</p>
              </div>
            </div>
          )}
          
          {type === 'international' && trackingNumber && (
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                <p className="font-semibold text-gray-900">{trackingNumber}</p>
              </div>
            </div>
          )}
          
          {type === 'international' && estimatedDelivery && (
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-semibold text-gray-900">{formatDate(estimatedDelivery)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;