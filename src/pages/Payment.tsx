import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard,
  ArrowLeft,
  Shield,
  AlertCircle,
  Loader2,
  Lock
} from 'lucide-react';

import { orderService, CreateLocalOrderRequest } from '../api/services/orderService';
import { ShipmentData } from './ShipmentConfirmation';

interface OrderData {
  items: any[];
  totalPrice: number;
  totalWeight: number;
  totalItems: number;
  orderDate: string;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'paypal' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // ✅ now supports: local | international | correction
  const type = location.state?.type ?? 'local';

  const selectedAddressId = location.state?.selectedAddressId ?? '';
  const amountFromState = Number(location.state?.amount ?? 0);
  const currencyFromState = (location.state?.currency ?? 'INR') as string;

  // ✅ correction order id (passed from OrderCorrection)
  const correctionOrderId = String(location.state?.orderId ?? '');

  const [totalPrice, setTotalPrice] = useState(0);
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null);
  const [correctionItemsCount, setCorrectionItemsCount] = useState<number>(0);

  const totalItems =
    type === 'international'
      ? shipmentData?.items.length
      : type === 'correction'
        ? correctionItemsCount
        : orderData?.totalItems || 0;

  useEffect(() => {
    // ---- INTERNATIONAL ----
    if (type === 'international') {
      const savedShipmentData = localStorage.getItem('shipmentData');
      if (savedShipmentData) {
        const parsed: ShipmentData = JSON.parse(savedShipmentData);
        setShipmentData(parsed);

        const fallbackTotal =
          (parsed as any)?.pricing?.totalCost ??
          (parsed as any)?.orderRequest?.orderData?.total_cost ??
          0;

        setTotalPrice(amountFromState > 0 ? amountFromState : Number(fallbackTotal) || 0);
      } else {
        navigate('/my-vault');
        return;
      }
      return;
    }

    // ---- CORRECTION ----
    if (type === 'correction') {
      let fallbackAmount = 0;
      try {
        const raw = localStorage.getItem('correctionPayment');
        if (raw) fallbackAmount = Number(JSON.parse(raw)?.amount ?? 0);
      } catch { }

      const finalAmount = amountFromState > 0 ? amountFromState : fallbackAmount;
      setTotalPrice(finalAmount);

      if (correctionOrderId) {
        orderService
          .getLocalOrderDetails(correctionOrderId)
          .then((res: any) => {
            const count = res?.order?.local_order_items?.length ?? 0;
            setCorrectionItemsCount(count);
          })
          .catch(() => {
          });
      }

      return;
    }

    // ---- LOCAL ----
    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
      const parsed: OrderData = JSON.parse(savedOrderData);
      setTotalPrice(parsed.totalPrice);
      setOrderData(parsed);
    } else {
      navigate('/create-order');
    }
  }, [navigate, type, amountFromState, correctionOrderId]);

  const handlePaymentMethodSelect = (method: 'razorpay' | 'paypal') => {
    setSelectedPaymentMethod(method);
    setError('');
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    // ✅ validation per flow
    if (type === 'local' && !orderData) {
      setError('Order data not found');
      return;
    }
    if (type === 'international' && !shipmentData) {
      setError('Shipment data not found');
      return;
    }
    if (type === 'correction' && totalPrice <= 0) {
      setError('Payment amount not found');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      let response: any;

      if (type === 'international') {
        if (!shipmentData || !shipmentData.orderRequest) {
          setError('Shipment data not found');
          setIsProcessing(false);
          return;
        }
        shipmentData.orderRequest.orderData.shipping_address_id = selectedAddressId;
        response = await orderService.createInternationalOrder(shipmentData.orderRequest);
      } else if (type === 'correction') {
        // ✅ Payment success mocked (same style as your current code)
        response = { success: true };

        if (!response.success) {
          setError('Payment failed. Please try again.');
          return;
        }

        const raw = localStorage.getItem('pendingOrderCorrection');
        const parsed = raw ? JSON.parse(raw) : null;

        const payload = parsed?.payload;
        const storedOrderId = String(parsed?.orderId ?? '');
        const finalOrderId = correctionOrderId || storedOrderId;

        if (!finalOrderId || !payload) {
          setError('Correction details not found. Please go back and try again.');
          return;
        }

        const updateRes = await orderService.submitLocalOrderCorrection(finalOrderId, payload);

        if (!updateRes?.success) {
          setError('Payment succeeded, but failed to update the order. Please contact support.');
          return;
        }
      } else {
        const platformFee = Math.round(totalPrice * 0.05);
        const orderRequest: CreateLocalOrderRequest = {
          orderData: {
            order_status: 'created',
            payment_status: 'pending',
            total_price: totalPrice,
            platform_fee: platformFee,
            admin_notes: `Order created on ${new Date().toLocaleDateString()} with ${orderData!.items.length} items`
          },
          items: orderData!.items.map(item => ({
            source_type: 'manual_link',
            product_name: item.name,
            product_link: item.url,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            final_price: item.price,
            status: 'pending',
            deny_reasons: [],
            image_link: item.image
          }))
        };
        response = await orderService.createLocalOrder(orderRequest);
      }

      const gatewayFee = Math.round(totalPrice * 0.02);
      const payableAmount = totalPrice + gatewayFee;

      if (response.success) {
        const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const paymentResult = {
          success: true,
          transactionId,
          orderId: type === 'correction' && correctionOrderId ? correctionOrderId : `ORD${Date.now()}`,
          amount: payableAmount,
          currency: currencyFromState,
          paymentMethod: selectedPaymentMethod,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('paymentResult', JSON.stringify(paymentResult));

        // Clear stored data per flow
        if (type === 'international') {
          localStorage.removeItem('shipmentData');
        } else if (type === 'correction') {
          localStorage.removeItem('correctionPayment');
          localStorage.removeItem('pendingOrderCorrection');
        } else {
          localStorage.removeItem('orderData');
        }
        navigate('/payment-result?status=success', {
          state: { type },
        });
      } else {
        const paymentResult = {
          success: false,
          error: 'Payment was declined by your bank. Please try again or use a different payment method.',
          paymentMethod: selectedPaymentMethod,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('paymentResult', JSON.stringify(paymentResult));
        navigate('/payment-result?status=failure', {
          state: { type },
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToConfirmation = () => {
    if (type === 'international') {
      navigate('/shipment-confirmation', { state: { selectedAddressId } });
      return;
    }
    if (type === 'correction') {
      navigate(`/order-correction/${correctionOrderId || ''}`);
      return;
    }
    navigate('/order-confirmation');
  };

  // ✅ loading rules per flow
  const isLoadingState =
    (type === 'local' && !orderData) ||
    (type === 'international' && !shipmentData) ||
    (type === 'correction' && totalPrice <= 0);

  if (isLoadingState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const gatewayFee = Math.round(totalPrice * 0.02);
  const payableAmount = totalPrice + gatewayFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToConfirmation}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Order Confirmation</span>
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          </div>
          <p className="text-gray-600">
            Choose your preferred payment method to complete your order.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {type === 'correction' ? `Additional Payment` : `Items (${totalItems})`}:
                </span>
                <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Processing Fee:</span>
                <span className="font-medium">₹0</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Payment Gateway Fee:</span>
                <span className="font-medium">₹{gatewayFee.toLocaleString()}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{payableAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Select Payment Method</h2>

            <div className="space-y-4">
              {/* Razorpay Option */}
              <label className="block cursor-pointer">
                <div className={`border-2 rounded-lg p-4 transition-all ${selectedPaymentMethod === 'razorpay'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={selectedPaymentMethod === 'razorpay'}
                      onChange={() => handlePaymentMethodSelect('razorpay')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">RP</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Razorpay</h3>
                          <p className="text-sm text-gray-600">Credit/Debit Cards, UPI, Net Banking, Wallets</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                        <Shield className="h-3 w-3" />
                        <span>Secured by Razorpay • Recommended for Indian payments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </label>

              {/* PayPal Option */}
              <label className="block cursor-pointer">
                <div className={`border-2 rounded-lg p-4 transition-all ${selectedPaymentMethod === 'paypal'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={selectedPaymentMethod === 'paypal'}
                      onChange={() => handlePaymentMethodSelect('paypal')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PP</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">PayPal</h3>
                          <p className="text-sm text-gray-600">International payments, Credit/Debit Cards</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                        <Shield className="h-3 w-3" />
                        <span>Secured by PayPal • Best for international customers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-green-800">
                  Your payment information is encrypted and secure. We never store your card details.
                  All transactions are processed through certified payment gateways.
                </p>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || isProcessing}
            className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>Pay ₹{payableAmount.toLocaleString()}</span>
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-500">
            <p>By clicking "Pay", you agree to our terms of service and privacy policy.</p>
            <p className="mt-1">You will be redirected to the selected payment gateway to complete your transaction.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;