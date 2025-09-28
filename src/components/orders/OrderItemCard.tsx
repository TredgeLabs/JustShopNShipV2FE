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
  shipment_date?: string;
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
    <div className={`bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-xl flex-shrink-0 shadow-sm"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-3 line-clamp-2">
            {item.name}
          </h3>

          {/* Shipment Date - Prominent Display */}
          {item.shipment_date && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">
                  Expected Delivery: {new Date(item.shipment_date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Color:</span>
              <span className="font-medium text-gray-900">{item.color}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Size:</span>
              <span className="font-medium text-gray-900">{item.size}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium text-gray-900">{item.quantity}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold text-lg text-green-600">₹{item.price.toLocaleString()}</span>
            </div>
            {showWeight && item.weight && (
              <div className="flex justify-between py-1 col-span-2">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium text-gray-900">{item.weight} kg</span>
              </div>
            )}
            {showStatus && item.status && (
              <div className="flex justify-between items-center py-1 col-span-2">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 text-sm font-medium capitalize rounded-full shadow-sm ${getStatusConfig(item.status, 'local_item').color}`}>
                  {getStatusConfig(item.status, 'local_item').text}
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-3 mt-4 pt-3 border-t border-gray-100">
            {item.inventoryLink && (
              <a
                href={item.inventoryLink}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Inventory</span>
              </a>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Original</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;