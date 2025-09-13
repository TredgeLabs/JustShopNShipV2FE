import React from 'react';
import { CheckCircle, Archive, Package, Ban, AlertCircle, Clock, Truck, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  type?: 'local' | 'international';
  className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, type = 'local', className = '' }) => {

  const { icon: Icon, text, color } = getStatusConfig(status, type);

  return (
    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${color} ${className}`}>
      <Icon className="h-4 w-4" />
      <span>{text}</span>
    </span>
  );
};

export const getStatusConfig = (status: string, type: string) => {
  if (type === 'local') {
    switch (status) {
      case 'created':
      case 'under_review':
        return {
          icon: Clock,
          text: 'Order Placed',
          color: 'bg-yellow-100 text-yellow-800',
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          text: 'Accepted',
          color: 'bg-green-100 text-green-800',
        };
      case 'denied':
        return {
          icon: XCircle,
          text: 'Denied',
          color: 'bg-red-100 text-red-800',
        };
      case 'cancelled':
        return {
          icon: Ban,
          text: 'Cancelled',
          color: 'bg-red-200 text-red-900',
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          text: 'Delivered',
          color: 'bg-green-100 text-green-800',
        };
      default:
        return {
          icon: AlertTriangle,
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
        };
    }
  } else if (type === 'local_item') {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          color: 'bg-yellow-100 text-yellow-800',
        };
      case 'accepted':
        return {
          icon: Truck,
          text: 'In Transit',
          color: 'bg-blue-100 text-blue-800',
        };
      case 'denied':
        return {
          icon: XCircle,
          text: 'Denied',
          color: 'bg-red-100 text-red-800',
        };
      case 'in_transit':
        return {
          icon: Truck,
          text: 'In Transit',
          color: 'bg-blue-100 text-blue-800',
        };
      case 'in_vault':
        return {
          icon: Archive,
          text: 'In Vault',
          color: 'bg-purple-100 text-purple-800',
        };
      default:
        return {
          icon: AlertCircle,
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
        };
    }
  } else if (type === 'vault_item') {
    switch (status) {
      case 'received':
        return {
          icon: Package,
          text: 'Received',
          color: 'bg-green-100 text-green-800',
        };
      case 'damaged':
        return {
          icon: AlertTriangle,
          text: 'Damaged',
          color: 'bg-red-100 text-red-800',
        };
      case 'returned':
        return {
          icon: RotateCcw,
          text: 'Returned',
          color: 'bg-orange-100 text-orange-800',
        };
      case 'in_transit':
        return {
          icon: Truck,
          text: 'In Transit',
          color: 'bg-blue-100 text-blue-800',
        };
      case 'ready_to_ship':
        return {
          icon: Package,
          text: 'Ready To Ship',
          color: 'bg-purple-100 text-purple-800',
        };
      default:
        return {
          icon: AlertTriangle,
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
        };
    }
  } else {
    // International order statuses
    switch (status) {
      case 'shipped':
        return {
          icon: Truck,
          text: 'Shipped',
          color: 'bg-blue-100 text-blue-800',
        };
      case 'at_customs':
        return {
          icon: AlertTriangle,
          text: 'At Customs',
          color: 'bg-orange-100 text-orange-800',
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          text: 'Delivered',
          color: 'bg-green-100 text-green-800',
        };
      case 'exception':
        return {
          icon: XCircle,
          text: 'Exception',
          color: 'bg-red-100 text-red-800',
        };
      default:
        return {
          icon: AlertTriangle,
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
        };
    }
  }
};


export default OrderStatusBadge;