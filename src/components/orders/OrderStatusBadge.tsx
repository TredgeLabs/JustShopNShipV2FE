import React from 'react';
import { CheckCircle, Ban, FilePlus, Clock, Truck, Plane, AlertTriangle, XCircle, Package } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  type?: 'local' | 'international';
  className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, type = 'local', className = '' }) => {
  const getStatusConfig = () => {
    if (type === 'local') {
      switch (status) {
        case 'ordered':
          return {
            icon: Clock,
            text: 'Order Placed',
            color: 'bg-yellow-100 text-yellow-800'
          };
        case 'received':
          return {
            icon: Package,
            text: 'Received at Vault',
            color: 'bg-blue-100 text-blue-800'
          };
        case 'shipped':
          return {
            icon: Truck,
            text: 'Shipped Internationally',
            color: 'bg-purple-100 text-purple-800'
          };
        case 'delivered':
          return {
            icon: CheckCircle,
            text: 'Delivered',
            color: 'bg-green-100 text-green-800'
          };
        case 'cancelled':
          return {
            icon: XCircle,
            text: 'Cancelled',
            color: 'bg-red-100 text-red-800'
          };
        case 'processing':
          return {
            icon: Clock,
            text: 'Processing',
            color: 'bg-orange-100 text-orange-800'
          };
        case 'created':
          return {
            icon: FilePlus, // ✅ distinct icon for created
            text: 'Created',
            color: 'bg-blue-100 text-blue-800' // ✅ blue instead of orange
          };
        case 'denied':
          return {
            icon: Ban, // 🚫 clearly shows admin denial
            text: 'Denied',
            color: 'bg-red-200 text-red-900'
          };
        default:
          return {
            icon: AlertTriangle,
            text: 'Unknown',
            color: 'bg-gray-100 text-gray-800'
          };
      }
    } else {
      // International order statuses
      switch (status) {
        case 'processing':
          return {
            icon: Clock,
            text: 'Processing',
            color: 'bg-yellow-100 text-yellow-800'
          };
        case 'shipped':
          return {
            icon: Truck,
            text: 'Shipped',
            color: 'bg-blue-100 text-blue-800'
          };
        case 'in-transit':
          return {
            icon: Plane,
            text: 'In Transit',
            color: 'bg-purple-100 text-purple-800'
          };
        case 'customs':
          return {
            icon: AlertTriangle,
            text: 'At Customs',
            color: 'bg-orange-100 text-orange-800'
          };
        case 'delivered':
          return {
            icon: CheckCircle,
            text: 'Delivered',
            color: 'bg-green-100 text-green-800'
          };
        case 'exception':
          return {
            icon: XCircle,
            text: 'Exception',
            color: 'bg-red-100 text-red-800'
          };
        default:
          return {
            icon: AlertTriangle,
            text: 'Unknown',
            color: 'bg-gray-100 text-gray-800'
          };
      }
    }
  };

  const { icon: Icon, text, color } = getStatusConfig();

  return (
    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${color} ${className}`}>
      <Icon className="h-4 w-4" />
      <span>{text}</span>
    </span>
  );
};

export default OrderStatusBadge;