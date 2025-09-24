import React from 'react';
import { ExternalLink, Eye } from 'lucide-react';
import { getStatusConfig } from '../../components/orders/OrderStatusBadge';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  weight?: number;
  status?: string;
  url?: string;
  inventoryLink?: string;
}

interface OrderItemCardProps {
  item: OrderItem;
  showWeight?: boolean;
  showStatus?: boolean;
  className?: string;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  showWeight = false,
  showStatus = false,
  className = ''
}) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start space-x-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2">
            {item.name}
          </h3>

          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Color:</span>
              <span className="font-medium">{item.color}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium">{item.size}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span className="font-medium">{item.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="font-medium">₹{item.price.toLocaleString()}</span>
            </div>
            {showWeight && item.weight && (
              <div className="flex justify-between">
                <span>Weight:</span>
                <span className="font-medium">{item.weight} kg</span>
              </div>
            )}
            {showStatus && item.status && (
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`px-2 py-1 text-xs font-medium capitalize ${getStatusConfig(item.status, 'local_item').color}`}> {getStatusConfig(item.status, 'local_item').text}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2 mt-3">
            {item.inventoryLink && (
              <a
                href={item.inventoryLink}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-3 w-3" />
                <span>Inventory</span>
              </a>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-800"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Original</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default OrderItemCard;