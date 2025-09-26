import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileText,
  CreditCard,
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  url: string;
  image?: string;
  weight?: number; // Mock weight for calculation
}

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart data from localStorage
    const savedCart = localStorage.getItem('orderData');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Add mock weight to items for display
      const cartWithWeight = parsedCart.items.map((item: CartItem) => ({
        ...item,
        weight: Math.round((Math.random() * 2 + 0.5) * 100) / 100 // Mock weight between 0.5-2.5 kg
      }));
      setCartItems(cartWithWeight);
    } else {
      // No cart data, redirect back to create order
      navigate('/create-order');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalWeight = () => {
    return cartItems.reduce((total, item) => total + ((item.weight || 1) * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToPay = () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions to proceed');
      return;
    }

    // Get existing order data from localStorage (set by CreateOrder page)
    const existingOrderData = localStorage.getItem('orderData');
    if (!existingOrderData) {
      alert('Order data not found. Please create order again.');
      navigate('/create-order');
      return;
    }

    navigate('/payment', { state: { type: 'local' } });
  };

  const handleProceedToRefund = () => {
    // TODO: Implement refund process
    alert('Refund process will be implemented. This is a placeholder for the refund flow.');
  };

  const handleBackToCart = () => {
    navigate('/create-order');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-8 w-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No order found</h3>
          <p className="text-gray-600 mb-4">Please create an order first.</p>
          <button
            onClick={() => navigate('/create-order')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToCart}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Cart</span>
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmation</h1>
          </div>
          <p className="text-gray-600">
            Please review your order details before proceeding to payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Color:</span>
                            <p>{item.color}</p>
                          </div>
                          <div>
                            <span className="font-medium">Size:</span>
                            <p>{item.size}</p>
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span>
                            <p>{item.quantity}</p>
                          </div>
                          {/* <div>
                            <span className="font-medium">Weight:</span>
                            <p>{item.weight} kg</p>
                          </div> */}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm text-gray-600">
                            Unit Price: ₹{item.price.toLocaleString()}
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{getTotalItems()}</span>
                </div>

                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Total Weight:</span>
                  <span className="font-medium">{getTotalWeight().toFixed(2)} kg</span>
                </div> */}

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{getTotalPrice().toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Processing Fee:</span>
                  <span>₹0</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Terms & Conditions
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
                <div className="text-sm text-gray-700 space-y-2">
                  <p>1. All orders are subject to product availability and verification.</p>
                  <p>2. Prices are in Indian Rupees (INR) and may vary based on market conditions.</p>
                  <p>3. International shipping charges will be calculated separately.</p>
                  <p>4. Items will be stored in your vault for up to 90 days free of charge.</p>
                  <p>5. Prohibited items cannot be shipped and will be returned or disposed of.</p>
                  <p>6. Customs duties and taxes are the responsibility of the recipient.</p>
                  <p>7. JustShopAndShip is not liable for delays due to customs or carrier issues.</p>
                  <p>8. Refunds are subject to our refund policy and processing fees may apply.</p>
                </div>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the terms and conditions, privacy policy, and shipping guidelines.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleProceedToPay}
                disabled={!acceptedTerms}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                <span>Proceed to Payment</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* <button
                onClick={handleProceedToRefund}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Request Refund Instead</span>
              </button> */}
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Orders will be processed within 1-2 business days</li>
                <li>• You'll receive email updates on order status</li>
                <li>• International shipping costs will be calculated separately</li>
                <li>• Contact support for any order modifications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;