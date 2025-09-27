import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { orderService, LocalOrder, LocalOrderItem, Product } from '../api/services/orderService';
import { DENY_REASONS } from '../admin/constants/adminConstants';

const OrderCorrection: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<LocalOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    color: '',
    size: '',
    quantity: 1,
    price: 0,
    url: '',
  });
  const [showAddItem, setShowAddItem] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load order details
  useEffect(() => {
    const loadOrderCorrectionData = async () => {
      if (!orderId) return;
      setIsLoading(true);
      const response = await orderService.getLocalOrderDetails(orderId);
      setOrderData(response.order);
      setIsLoading(false);
    };

    loadOrderCorrectionData();
  }, [orderId]);

  /** -----------------------------
   * Editing and Deleting
   * ----------------------------- */
  const handleItemEdit = (itemId: number, field: string, value: string | number) => {
    if (!orderData) return;

    setOrderData(prev => ({
      ...prev!,
      local_order_items: (prev!.local_order_items ?? []).map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const toggleItemEdit = (itemId: number) => {
    if (!orderData) return;

    setOrderData(prev => ({
      ...prev!,
      local_order_items: (prev!.local_order_items ?? []).map(item =>
        item.id === itemId ? { ...item, isEditing: !item.isEditing } : item
      ),
    }));
  };

  const deleteItem = (itemId: number) => {
    if (!orderData) return;

    const confirmed = window.confirm('Are you sure you want to remove this item from your order?');
    if (confirmed) {
      setOrderData(prev => ({
        ...prev!,
        local_order_items: (prev!.local_order_items ?? []).filter(item => item.id !== itemId),
      }));
    }
  };

  /** -----------------------------
   * Add New Item
   * ----------------------------- */
  const handleAddNewItem = () => {
    if (!newItem.name || !newItem.url || newItem.price <= 0) {
      setError('Please fill in all required fields for the new item');
      return;
    }

    const newItemData: LocalOrderItem = {
      id: Date.now(), // temporary ID
      local_order_id: orderData?.id ?? 0,
      source_type: 'user_added',
      product_name: newItem.name,
      product_link: newItem.url,
      color: newItem.color,
      size: newItem.size,
      quantity: newItem.quantity,
      price: newItem.price,
      final_price: newItem.price,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deny_reasons: [],
      image_link: '',
      isEditing: false,
    };

    setOrderData(prev => ({
      ...prev!,
      local_order_items: [...(prev!.local_order_items ?? []), newItemData],
    }));

    setNewItem({ name: '', color: '', size: '', quantity: 1, price: 0, url: '' });
    setShowAddItem(false);
    setError('');
  };

  /** -----------------------------
   * Price Calculations
   * ----------------------------- */
  const calculateCurrentTotal = () => {
    if (!orderData) return 0;
    return (orderData.local_order_items ?? []).reduce(
      (total, item) => total + item.final_price * item.quantity,
      0
    );
  };

  const calculatePriceDifference = () => {
    const currentTotal = calculateCurrentTotal();
    return currentTotal - orderData!.total_price;
  };

  function convertLocalOrderItemsToProducts(
    orderItems: LocalOrderItem[]
  ): Product[] {
    return orderItems.map(item => ({
      id: String(item.id),
      name: item.product_name,
      color: item.color ?? '',
      size: item.size ?? '',
      quantity: item.quantity,
      price: item.price,
      url: item.product_link,
      image: item.image_link ?? '',
      status: item.status
    }));
  }

  /** -----------------------------
   * Confirm Correction
   * ----------------------------- */
  const handleConfirmCorrection = async () => {
    if (!orderData) return;
    const products = convertLocalOrderItemsToProducts(orderData.local_order_items ?? []);
    const orderData1 = {
      items: products,
      totalPrice: priceDifference,
      totalItems: products.length,
      orderDate: new Date().toISOString()
    };

    localStorage.setItem('orderData', JSON.stringify(orderData1));
    navigate('/order-confirmation', { state: { flowType: 'correction', orderId: orderId } });
  };

  /** -----------------------------
   * Loading / Error states
   * ----------------------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-3 text-gray-600">Loading order correction details...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
          <button
            onClick={() => navigate('/domestic-orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const priceDifference = calculatePriceDifference();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/domestic-orders')}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold">Order Correction Required</h1>
          </div>
          <p className="text-gray-600">
            Please review and correct the issues identified in your order before we can proceed.
          </p>
        </div>

        {/* Success/Error */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {(orderData.local_order_items ?? []).map(item => {
                const hasErrors = item.deny_reasons && item.deny_reasons.length > 0;
                return (
                  <div
                    key={item.id}
                    className={`p-6 rounded-lg border ${hasErrors ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                  >
                    <div className="flex items-start space-x-6">
                      {item.image_link && (
                        <img
                          src={item.image_link}
                          alt={item.product_name}
                          className="w-24 h-24 rounded-lg border object-cover"
                        />
                      )}
                      <div className="flex-1 space-y-4">
                        {hasErrors && (
                          <div className="p-3 bg-red-100 border border-red-200 rounded text-sm text-red-800 space-y-1">
                            {item.deny_reasons?.map((reasonIndex, idx) => (
                              <div key={idx} className="flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                                {DENY_REASONS[reasonIndex - 1] || 'Unknown reason'}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Product Name with Link */}
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{item.product_name}</h3>
                          <a
                            href={item.product_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <span>View Original Product</span>
                            <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Color</label>
                            {item.isEditing ? (
                              <input
                                type="text"
                                value={item.color || ''}
                                onChange={e => handleItemEdit(item.id, 'color', e.target.value)}
                                className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              <p className="text-gray-900">{item.color || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Size</label>
                            {item.isEditing ? (
                              <input
                                type="text"
                                value={item.size || ''}
                                onChange={e => handleItemEdit(item.id, 'size', e.target.value)}
                                className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              <p className="text-gray-900">{item.size || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Quantity</label>
                            {item.isEditing ? (
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={e =>
                                  handleItemEdit(item.id, 'quantity', parseInt(e.target.value))
                                }
                                className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              <p className="text-gray-900 font-medium">{item.quantity}</p>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 block text-xs">Paid Amount</span>
                              <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-xs">Current Price</span>
                              <p className="font-semibold text-gray-900">₹{(item.final_price * item.quantity).toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-xs">Difference</span>
                              <p
                                className={`font-semibold ${(item.final_price * item.quantity) - (item.price * item.quantity) > 0
                                  ? 'text-red-600'
                                  : 'text-green-600'
                                  }`}
                              >
                                {(item.final_price * item.quantity) -
                                  (item.price * item.quantity) >
                                  0
                                  ? '+'
                                  : ''}
                                ₹
                                {Math.abs(
                                  (item.final_price * item.quantity) -
                                  (item.price * item.quantity)
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {item.status === 'denied' && <div className="flex space-x-3 pt-2">
                          <button
                            onClick={() => toggleItemEdit(item.id)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                          >
                            {item.isEditing ? 'Save Changes' : 'Edit Item'}
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                          >
                            Remove Item
                          </button>
                        </div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add new item */}
            <div className="mt-6">
              {!showAddItem ? (
                <button
                  onClick={() => setShowAddItem(true)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded"
                >
                  + Add New Item
                </button>
              ) : (
                <div className="bg-white border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Add New Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name *"
                      value={newItem.name}
                      onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="url"
                      placeholder="Product URL *"
                      value={newItem.url}
                      onChange={e => setNewItem(p => ({ ...p, url: e.target.value }))}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      placeholder="Color"
                      value={newItem.color}
                      onChange={e => setNewItem(p => ({ ...p, color: e.target.value }))}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      placeholder="Size"
                      value={newItem.size}
                      onChange={e => setNewItem(p => ({ ...p, size: e.target.value }))}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="number"
                      min={1}
                      placeholder="Quantity"
                      value={newItem.quantity}
                      onChange={e =>
                        setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) }))
                      }
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Price (₹) *"
                      value={newItem.price}
                      onChange={e =>
                        setNewItem(p => ({ ...p, price: parseFloat(e.target.value) }))
                      }
                      className="border rounded px-2 py-1"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddNewItem}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Add Item
                    </button>
                    <button
                      onClick={() => setShowAddItem(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="flex items-center font-semibold mb-4">
                Price Summary (₹)
              </h2>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span>₹{orderData.total_price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Total:</span>
                <span>₹{calculateCurrentTotal().toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                {priceDifference > 0 ? (
                  <div className="text-red-600 flex justify-between">
                    <span>Amount to Pay:</span>
                    <span>₹{priceDifference.toLocaleString()}</span>
                  </div>
                ) : priceDifference < 0 ? (
                  <div className="text-green-600 flex justify-between">
                    <span>Amount to Receive:</span>
                    <span>₹{Math.abs(priceDifference).toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span>No Additional Payment:</span>
                    <span>₹0</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleConfirmCorrection}
              disabled={isSaving}
              className="w-full py-3 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              {isSaving ? 'Submitting...' : 'Confirm Order Correction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCorrection;