import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  MessageCircle,
  Download,
  Home,
  Package,
  Loader2
} from 'lucide-react';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  amount?: number;
  paymentMethod?: string;
  timestamp?: string;
  error?: string;
}

const PaymentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const type = location.state?.type ?? 'local';

  useEffect(() => {
    // Load payment result from localStorage
    const savedResult = localStorage.getItem('paymentResult');
    if (savedResult) {
      setPaymentResult(JSON.parse(savedResult));
    } else {
      // No payment result found, redirect to create order
      navigate('/create-order');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  const handleRetryPayment = () => {
    // Clear the failed payment result and go back to payment
    localStorage.removeItem('paymentResult');
    navigate('/payment');
  };

  const handleContactSupport = () => {
    navigate('/contact-support');
  };

  const handleGoToDashboard = () => {
    // Clear payment result
    localStorage.removeItem('paymentResult');
    navigate('/dashboard');
  };

  const handleViewOrders = () => {
    // Clear payment result
    localStorage.removeItem('paymentResult');
    if (type === 'international') {
      navigate('/international-orders');
    }
    else {
      navigate('/domestic-orders');
    }
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download
    alert('Receipt download will be implemented. This is a placeholder.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'razorpay': return 'Razorpay';
      case 'paypal': return 'PayPal';
      default: return method;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment result...</p>
        </div>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment result not found</h3>
          <p className="text-gray-600 mb-4">Please try making a payment again.</p>
          <button
            onClick={() => navigate('/create-order')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success State */}
          {paymentResult.success ? (
            <>
              {/* Success Header */}
              <div className="bg-green-50 border-b border-green-200 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-green-900 mb-2">Payment Successful!</h1>
                <p className="text-green-700">
                  Your order has been placed successfully and payment has been processed.
                </p>
              </div>

              {/* Success Details */}
              <div className="px-6 py-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order ID</label>
                      <p className="text-lg font-semibold text-gray-900">{paymentResult.orderId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                      <p className="text-lg font-semibold text-gray-900">{paymentResult.transactionId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                      <p className="text-lg font-semibold text-gray-900">₹{paymentResult.amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <p className="text-lg font-semibold text-gray-900">{getPaymentMethodName(paymentResult.paymentMethod || '')}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {paymentResult.timestamp && formatDate(paymentResult.timestamp)}
                    </p>
                  </div>
                </div>

                {/* What's Next */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• We'll start processing your order within 1-2 business days</li>
                    <li>• You'll receive email updates on order status and tracking</li>
                    <li>• Items will be delivered to your vault address in India</li>
                    <li>• You can track progress in your dashboard</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={handleViewOrders}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Package className="h-4 w-4" />
                      <span>View My Orders</span>
                    </button>
                    
                    <button
                      onClick={handleDownloadReceipt}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Receipt</span>
                    </button>
                  </div>

                  <button
                    onClick={handleGoToDashboard}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    <span>Go to Dashboard</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Failure State */
            <>
              {/* Failure Header */}
              <div className="bg-red-50 border-b border-red-200 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-red-900 mb-2">Payment Failed</h1>
                <p className="text-red-700">
                  We couldn't process your payment. Please try again or contact support.
                </p>
              </div>

              {/* Failure Details */}
              <div className="px-6 py-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-red-900 mb-2">Error Details</h3>
                  <p className="text-sm text-red-800">{paymentResult.error}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="text-lg font-semibold text-gray-900">{getPaymentMethodName(paymentResult.paymentMethod || '')}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Attempted On</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {paymentResult.timestamp && formatDate(paymentResult.timestamp)}
                    </p>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-900 mb-2">Common Solutions</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Check if your card has sufficient balance</li>
                    <li>• Ensure your card is enabled for online transactions</li>
                    <li>• Try using a different payment method</li>
                    <li>• Contact your bank if the issue persists</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={handleRetryPayment}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Retry Payment</span>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={handleContactSupport}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Contact Support</span>
                    </button>
                    
                    <button
                      onClick={handleGoToDashboard}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      <Home className="h-4 w-4" />
                      <span>Go to Dashboard</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{' '}
            <button
              onClick={handleContactSupport}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              support@justshopandship.com
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;