import React from 'react';
import { getStatusColor } from '../utils/adminHelpers';
import { getStatusConfig } from '../../components/orders/OrderStatusBadge';

interface StatusBadgeProps {
  status: string;
  type: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, className = '' }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {getStatusConfig(status, type).text}
    </span>
  );
};

export default StatusBadge;