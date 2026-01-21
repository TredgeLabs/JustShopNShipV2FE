import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, InternationalOrder } from '../api/services/orderService';
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertCircle,
  Package,
  Copy,
  Check,
} from 'lucide-react';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';

const InternationalOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<InternationalOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyTrackingId = async () => {
    if (!order?.tracking_id) return;

    try {
      await navigator.clipboard.writeText(order.tracking_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = order.tracking_id;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };


  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await orderService.getInternationalOrderDetails(orderId);

        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError('International order not found');
        }
      } catch (err) {
        setError('Failed to load order details. Please try again.');
        console.error('Error loading order:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  const getTotalWeight = () => {
    return order ? order.shipment_weight_gm : 0; // Convert grams to kg
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The order you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/international-orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/international-orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to International Orders</span>
            </button>

            <div className="flex items-center space-x-3">

              {order.tracking_link && (
                <a
                  href={order.tracking_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Track Package</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">International Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">International shipping order details</p>
            </div>
            <OrderStatusBadge status={order.shipping_status} type="international" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold text-gray-900">#{order.id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Created Date</p>
                    <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="font-semibold text-gray-900">₹{parseFloat(order.total_cost).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Vault Items</p>
                    <p className="font-semibold text-gray-900">{order.international_order_items?.length || 0}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Weight</p>
                    <p className="font-semibold text-gray-900">{getTotalWeight().toFixed(1)} kg</p>
                  </div>

                  {order.tracking_id && (
                    <div>
                      <p className="text-sm text-gray-600">Tracking ID</p>
                      <p className="font-semibold text-gray-900">{order.tracking_id}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipped Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Shipped Items</h2>
                <span className="text-sm text-gray-600">
                  Total Weight: {getTotalWeight().toFixed(1)} kg
                </span>
              </div>

              {order.international_order_items && order.international_order_items.length > 0 ? (
                <div className="space-y-4">
                  {order.international_order_items.map((item) => (
                    // <OrderItemCard
                    //   key={item.id}
                    //   item={{
                    //     id: item.id.toString(),
                    //     name: item.name,
                    //     image: item.imageUrls?.[0] || '',
                    //     color: item.color || 'N/A',
                    //     size: item.size || 'N/A',
                    //     quantity: item.quantity || 0,
                    //     price: parseFloat(item?.price?.toLocaleString()),
                    //     status: item.status || '',
                    //     url: item.product_link || ''
                    //   }}
                    //   showStatus={true}
                    // />
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">Vault Item #{item.id}</h5>
                          <p className="text-sm text-gray-600">{item.name}</p>
                          <p className="text-sm text-gray-600">Added on {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/vault-item/${item.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No items found in this shipment</p>
                </div>
              )}
            </div>

            {/* Shipping Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Timeline</h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order Processed</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${['shipped', 'in_transit', 'delivered'].includes(order.shipping_status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                    }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Shipped</p>
                    {['shipped', 'in_transit', 'delivered'].includes(order.shipping_status) && (
                      <p className="text-sm text-gray-600">{new Date(order.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${['shipped', 'in_transit', 'delivered'].includes(order.shipping_status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                    }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">In Transit</p>
                    {['in_transit', 'customs', 'delivered'].includes(order.shipping_status) && (
                      <p className="text-sm text-gray-600">Package in transit</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${order.shipping_status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Delivered</p>
                    {order.actualDelivery ? (
                      <p className="text-sm text-gray-600">{new Date(order.actualDelivery).toLocaleDateString()}</p>
                    ) : (
                      <p className="text-sm text-gray-600">ETA: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>

              {/* ✅ REPLACE everything below with this */}
              <div className="divide-y divide-gray-100">
                {/* Vault ID */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">Vault ID</p>
                  <p className="text-sm font-semibold text-gray-900 break-all text-right">
                    {order.vaultId}
                  </p>
                </div>

                {/* Selected Address */}
                <div className="py-3 flex items-start justify-between gap-4">
                  <p className="text-sm text-gray-600 mt-0.5">Selected Address</p>

                  <div className="text-right max-w-[70%]">
                    {order.selectedAddress?.line1 && (
                      <p className="text-sm text-gray-700 break-words">{order.selectedAddress.line1}, {order.selectedAddress.line2}</p>
                    )}

                    {order.selectedAddress?.line2 && (
                      <p className="text-sm text-gray-700 break-words"></p>
                    )}

                    {(order.selectedAddress?.city || order.selectedAddress?.state || order.selectedAddress?.zipCode || order.selectedAddress?.country) && (
                      <p className="text-sm text-gray-700 break-words">
                        {order.selectedAddress?.city ? `${order.selectedAddress.city}, ` : ''}
                        {order.selectedAddress?.state ? `${order.selectedAddress.state}, ` : ''}
                        {order.selectedAddress?.country ? `${order.selectedAddress.country}-` : ''}
                        {order.selectedAddress?.zipCode || ''}
                      </p>
                    )}

                    {order.selectedAddress?.phone && (
                      <p className="text-sm text-gray-700 break-words">Phone: {order.selectedAddress.phone}</p>
                    )}
                  </div>
                </div>


                {/* Total Weight */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">Total Weight</p>
                  <p className="text-sm font-semibold text-gray-900 text-right">
                    {getTotalWeight().toFixed(1)} kg
                  </p>
                </div>

                {/* Tracking ID + Copy */}
                {order.tracking_id && (
                  <div className="py-3 flex items-start justify-between gap-4">
                    <p className="text-sm text-gray-600 mt-0.5">Tracking ID</p>

                    <div className="flex items-center gap-2 max-w-[70%]">
                      <p className="text-sm font-semibold text-gray-900 break-all text-right">
                        {order.tracking_id}
                      </p>

                      <button
                        type="button"
                        onClick={handleCopyTrackingId}
                        className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition shrink-0"
                        aria-label="Copy tracking ID"
                        title={copied ? 'Copied!' : 'Copy'}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* Pricing Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Costs</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee:</span>
                  <span className="font-medium">₹{parseFloat(order.shipping_cost).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Cost:</span>
                  <span className="font-medium">₹{parseFloat(order.storage_cost).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium">₹{parseFloat(order.platform_fee).toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Cost:</span>
                    <span>₹{parseFloat(order.total_cost).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                {order.tracking_link && (
                  <a
                    href={order.tracking_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Track Package</span>
                  </a>
                )}

                <a
                  href="/contact-support"
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternationalOrderDetailsPage;