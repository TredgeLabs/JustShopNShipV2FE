import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle, 
  DollarSign,
  Package,
  Loader2
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  paidPrice: number;
  currentPrice: number;
  url: string;
  image?: string;
  hasError: boolean;
  errorMessage?: string;
  isEditing?: boolean;
}

interface OrderCorrectionData {
  orderId: string;
  totalPaidAmount: number;
  currentTotalAmount: number;
  items: OrderItem[];
}

const OrderCorrection: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderCorrectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    color: '',
    size: '',
    quantity: 1,
    price: 0,
    url: ''
  });
  const [showAddItem, setShowAddItem] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock data - replace with actual API call
  useEffect(() => {
    const loadOrderCorrectionData = async () => {
      if (!orderId) return;
      
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: OrderCorrectionData = {
        orderId: orderId,
        totalPaidAmount: 15200,
        currentTotalAmount: 16800,
        items: [
          {
            id: 'item-1',
            name: 'Traditional Silk Saree - Royal Blue',
            color: 'Royal Blue',
            size: 'Free Size',
            quantity: 1,
            price: 3500,
            paidPrice: 3500,
            currentPrice: 4200,
            url: 'https://example.com/saree',
            image: 'https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=200',
            hasError: true,
            errorMessage: 'Price has increased from ₹3,500 to ₹4,200',
            isEditing: false
          },
          {
            id: 'item-2',
            name: 'Ayurvedic Skincare Gift Set',
            color: 'Natural',
            size: 'Standard',
            quantity: 1,
            price: 2100,
            paidPrice: 2100,
            currentPrice: 2100,
            url: 'https://example.com/skincare',
            image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=200',
            hasError: false,
            isEditing: false
          },
          {
            id: 'item-3',
            name: 'Handcrafted Silver Jewelry Set',
            color: 'Silver',
            size: 'Medium',
            quantity: 2,
            price: 8500,
            paidPrice: 9600,
            currentPrice: 8500,
            url: 'https://example.com/jewelry',
            image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=200',
            hasError: true,
            errorMessage: 'Requested quantity (2) not available. Only 1 piece in stock.',
            isEditing: false
          }
        ]
      };
      
      setOrderData(mockData);
      setIsLoading(false);
    };

    loadOrderCorrectionData();
  }, [orderId]);

  const handleItemEdit = (itemId: string, field: string, value: string | number) => {
    if (!orderData) return;
    
    setOrderData(prev => ({
      ...prev!,
      items: prev!.items.map(item => 
        item.id === itemId 
          ? { ...item, [field]: value }
          : item
      )
    }));
  };

  const toggleItemEdit = (itemId: string) => {
    if (!orderData) return;
    
    setOrderData(prev => ({
      ...prev!,
      items: prev!.items.map(item => 
        item.id === itemId 
          ? { ...item, isEditing: !item.isEditing }
          : item
      )
    }));
  };

  const deleteItem = (itemId: string) => {
    if (!orderData) return;
    
    const confirmed = window.confirm('Are you sure you want to remove this item from your order?');
    if (confirmed) {
      setOrderData(prev => ({
        ...prev!,
        items: prev!.items.filter(item => item.id !== itemId)
      }));
    }
  };

  const handleAddNewItem = () => {
    if (!newItem.name || !newItem.url || newItem.price <= 0) {
      setError('Please fill in all required fields for the new item');
      return;
    }

    const newItemData: OrderItem = {
      id: `new-item-${Date.now()}`,
      ...newItem,
      paidPrice: 0,
      currentPrice: newItem.price,
      hasError: false,
      isEditing: false
    };

    setOrderData(prev => ({
      ...prev!,
      items: [...prev!.items, newItemData]
    }));

    setNewItem({
      name: '',
      color: '',
      size: '',
      quantity: 1,
      price: 0,
      url: ''
    });
    setShowAddItem(false);
    setError('');
  };

  const calculateCurrentTotal = () => {
    if (!orderData) return 0;
    return orderData.items.reduce((total, item) => total + (item.currentPrice * item.quantity), 0);
  };

  const calculatePriceDifference = () => {
    const currentTotal = calculateCurrentTotal();
    return currentTotal - orderData!.totalPaidAmount;
  };

  const handleConfirmCorrection = async () => {
    if (!orderData) return;

    try {
      setIsSaving(true);
      setError('');

      // Mock API call - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, use:
      // const response = await orderService.submitOrderCorrection(orderId, orderData);
      
      setSuccess('Order correction submitted successfully!');
      
      setTimeout(() => {
        navigate('/domestic-orders');
      }, 2000);
    } catch (err) {
      setError('Failed to submit order correction. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order correction details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
          <p className="text-gray-600 mb-4">The order correction data could not be loaded.</p>
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
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Order Correction Required</h1>
          </div>
          <p className="text-gray-600">
            Please review and correct the issues identified in your order before we can proceed.
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
                <div className="text-sm text-gray-600">
                  Order ID: <span className="font-medium">{orderData.orderId}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div key={item.id} className={`border rounded-lg p-4 ${
                    item.hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start space-x-4">
                      {/* Item Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        {/* Error Message */}
                        {item.hasError && item.errorMessage && (
                          <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-800">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            {item.errorMessage}
                          </div>
                        )}

                        {/* Item Name */}
                        <h3 className="font-medium text-gray-900 mb-3">{item.name}</h3>
                        
                        {/* Editable Fields */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                            {item.isEditing && item.hasError ? (
                              <input
                                type="text"
                                value={item.color}
                                onChange={(e) => handleItemEdit(item.id, 'color', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{item.color}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                            {item.isEditing && item.hasError ? (
                              <input
                                type="text"
                                value={item.size}
                                onChange={(e) => handleItemEdit(item.id, 'size', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{item.size}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                            {item.isEditing && item.hasError ? (
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemEdit(item.id, 'quantity', parseInt(e.target.value))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{item.quantity}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Current Price</label>
                            <p className="text-sm font-semibold text-gray-900">₹{item.currentPrice.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Price Information */}
                        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-600">Paid Price:</span>
                            <p className="font-medium">₹{item.paidPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Current Price:</span>
                            <p className="font-medium">₹{(item.currentPrice * item.quantity).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Difference:</span>
                            <p className={`font-medium ${
                              (item.currentPrice * item.quantity) - item.paidPrice > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {(item.currentPrice * item.quantity) - item.paidPrice > 0 ? '+' : ''}
                              ₹{((item.currentPrice * item.quantity) - item.paidPrice).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                          {item.hasError && (
                            <button
                              onClick={() => toggleItemEdit(item.id)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                            >
                              {item.isEditing ? (
                                <>
                                  <Save className="h-3 w-3" />
                                  <span>Save</span>
                                </>
                              ) : (
                                <>
                                  <Edit3 className="h-3 w-3" />
                                  <span>Edit</span>
                                </>
                              )}
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Item */}
              <div className="mt-6 border-t pt-6">
                {!showAddItem ? (
                  <button
                    onClick={() => setShowAddItem(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Item</span>
                  </button>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Add New Item</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input
                          type="text"
                          value={newItem.name}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter product name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product URL *</label>
                        <input
                          type="url"
                          value={newItem.url}
                          onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter product URL"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                          type="text"
                          value={newItem.color}
                          onChange={(e) => setNewItem(prev => ({ ...prev, color: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter color"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <input
                          type="text"
                          value={newItem.size}
                          onChange={(e) => setNewItem(prev => ({ ...prev, size: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter size"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                        <input
                          type="number"
                          min="0"
                          value={newItem.price}
                          onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter price"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddNewItem}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Item</span>
                      </button>
                      <button
                        onClick={() => setShowAddItem(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Price Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-gray-900">₹{orderData.totalPaidAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Total:</span>
                  <span className="font-semibold text-gray-900">₹{calculateCurrentTotal().toLocaleString()}</span>
                </div>
                
                <div className="border-t pt-4">
                  {priceDifference > 0 ? (
                    <div className="flex justify-between text-red-600">
                      <span className="font-medium">Amount to Pay:</span>
                      <span className="font-bold text-lg">₹{priceDifference.toLocaleString()}</span>
                    </div>
                  ) : priceDifference < 0 ? (
                    <div className="flex justify-between text-green-600">
                      <span className="font-medium">Amount to Receive:</span>
                      <span className="font-bold text-lg">₹{Math.abs(priceDifference).toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-gray-600">
                      <span className="font-medium">No Additional Payment:</span>
                      <span className="font-bold text-lg">₹0</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmCorrection}
              disabled={isSaving}
              className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting Correction...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Confirm Order Correction</span>
                </>
              )}
            </button>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Only items with errors can be edited</li>
                <li>• Price differences will be calculated automatically</li>
                <li>• Additional payment may be required if total increases</li>
                <li>• Refunds will be processed if total decreases</li>
                <li>• Order will be re-evaluated after correction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCorrection;