import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Loader2,
} from 'lucide-react';
import {
  orderService,
  LocalOrder,
  LocalOrderItem,
  UpdateLocalOrderCorrectionRequest
} from '../api/services/orderService';
import { DENY_REASONS } from '../admin/constants/adminConstants';

type CorrectionDraft = {
  edits: Record<number, Partial<{ color: string; size: string; quantity: number; final_price: number }>>;
  deletedIds: number[];
};

const readDraft = (orderId: string): CorrectionDraft | null => {
  try {
    const raw = localStorage.getItem(draftKey(orderId));
    return raw ? (JSON.parse(raw) as CorrectionDraft) : null;
  } catch {
    return null;
  }
};

const writeDraft = (orderId: string, draft: CorrectionDraft) => {
  localStorage.setItem(draftKey(orderId), JSON.stringify(draft));
};

const draftKey = (orderId: string) => `orderCorrectionDraft:${orderId}`;
const clearDraft = (orderId: string) => localStorage.removeItem(draftKey(orderId));

const confirmDiscardDraft = () => {
  return window.confirm(
    "You have unsaved changes in this correction.\n\nIf you go back now, your draft will be cleared. Continue?"
  );
};


const upsertDraftEdit = (orderId: string, itemId: number, field: string, value: any) => {
  const d: CorrectionDraft = readDraft(orderId) ?? { edits: {}, deletedIds: [] };
  d.edits[itemId] = { ...(d.edits[itemId] || {}), [field]: value };
  // if user edits an item, ensure it’s not marked deleted
  d.deletedIds = d.deletedIds.filter((id) => id !== itemId);
  writeDraft(orderId, d);
};

const markDraftDeleted = (orderId: string, itemId: number) => {
  const d: CorrectionDraft = readDraft(orderId) ?? { edits: {}, deletedIds: [] };
  if (!d.deletedIds.includes(itemId)) d.deletedIds.push(itemId);
  delete d.edits[itemId];
  writeDraft(orderId, d);
};

const applyDraftToOrder = (order: any, draft: CorrectionDraft) => {
  const deleted = new Set(draft.deletedIds || []);
  const items = (order.local_order_items ?? [])
    .filter((it: any) => !deleted.has(it.id))
    .map((it: any) => {
      const patch = draft.edits?.[it.id];
      return patch ? { ...it, ...patch } : it;
    });

  return { ...order, local_order_items: items };
};


const OrderCorrection: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<LocalOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const backGuardArmedRef = useRef(false);

  const armBackGuard = () => {
    if (backGuardArmedRef.current) return;
    window.history.pushState({ __guard: true }, "", window.location.href);
    backGuardArmedRef.current = true;
  };

  const disarmBackGuard = () => {
    backGuardArmedRef.current = false;
  };
  // ---------- Helpers ----------
  const isUserAddedItem = (item: LocalOrderItem) =>
    item.source_type === 'user_added' || item.status === 'new';

  // "Accepted" = no deny reasons AND not user added
  const isAcceptedItem = (item: LocalOrderItem) => {
    const deny = item.deny_reasons ?? [];
    return !isUserAddedItem(item) && deny.length === 0;
  };

  // price mismatch = deny reason text contains "price"
  const hasPriceMismatch = (item: LocalOrderItem) => {
    const deny = item.deny_reasons ?? [];
    return deny.some((reasonIndex) => {
      const text = (DENY_REASONS[reasonIndex - 1] || '').toLowerCase();
      return text.includes('price');
    });
  };
  const handleBackToOrders = () => {
    if (!orderId) return navigate("/domestic-orders");

    if (!hasUnsavedDraft()) {
      clearDraft(orderId); // safe cleanup
      navigate("/domestic-orders");
      return;
    }

    const ok = confirmDiscardDraft();
    if (!ok) return;

    clearDraft(orderId);
    navigate("/domestic-orders");
  };

  const hasUnsavedDraft = () => {
    if (!orderId) return false;
    const d = readDraft(orderId);
    if (!d) return false;
    const editsCount = Object.keys(d.edits || {}).length;
    const deletedCount = (d.deletedIds || []).length;
    return editsCount > 0 || deletedCount > 0;
  };

  useEffect(() => {
    if (!orderId) return;

    // ✅ Arm guard only if draft exists (ex: user refreshed and came back)
    if (hasUnsavedDraft()) {
      window.history.pushState({ __guard: true }, "", window.location.href);
    }

    const onPopState = () => {
      // ✅ If no draft, do nothing (allow normal back)
      if (!hasUnsavedDraft()) return;

      const ok = confirmDiscardDraft();
      if (!ok) {
        // keep user here
        window.history.pushState({ __guard: true }, "", window.location.href);
        return;
      }

      clearDraft(orderId);

      // ✅ go back to previous page (because first back just removed guard entry)
      window.history.back();
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [orderId]);


  // Load order details
  useEffect(() => {
    const loadOrderCorrectionData = async () => {
      if (!orderId) return;
      setIsLoading(true);
      const response = await orderService.getLocalOrderDetails(orderId);
      const fetchedOrder = response.order;
      const draft = readDraft(orderId);
      const merged = draft ? applyDraftToOrder(fetchedOrder, draft) : fetchedOrder;

      setOrderData(merged);
      setIsLoading(false);
    };

    loadOrderCorrectionData();
  }, [orderId]);

  /** -----------------------------
   * Editing and Deleting
   * ----------------------------- */
  const handleItemEdit = (itemId: number, field: string, value: string | number) => {
    if (!orderData || !orderId) return;

    // update UI
    setOrderData(prev => ({
      ...prev!,
      local_order_items: (prev!.local_order_items ?? []).map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));

    // ✅ persist draft
    upsertDraftEdit(orderId, itemId, field, value);

    // ✅ arm browser-back guard (only once)
    armBackGuard();
  };


  const toggleItemEdit = (itemId: number) => {
    if (!orderData) return;

    const item = (orderData.local_order_items ?? []).find(i => i.id === itemId);
    if (!item) return;

    if (isAcceptedItem(item)) {
      setError('Accepted items cannot be edited.');
      return;
    }

    setOrderData(prev => ({
      ...prev!,
      local_order_items: (prev!.local_order_items ?? []).map(item =>
        item.id === itemId ? { ...item, isEditing: !item.isEditing } : item
      ),
    }));
  };

  const deleteItem = (itemId: number) => {
    if (!orderData) return;

    const item = (orderData.local_order_items ?? []).find(i => i.id === itemId);
    if (!item) return;

    if (isAcceptedItem(item)) {
      setError('Accepted items cannot be removed.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to remove this item from your order?');
    if (confirmed) {
      if (orderId) {
        markDraftDeleted(orderId, itemId);
        armBackGuard();
      }
      setOrderData(prev => ({
        ...prev!,
        local_order_items: (prev!.local_order_items ?? []).filter(item => item.id !== itemId),
      }));
      if (orderId && hasUnsavedDraft()) {
        window.history.pushState({ __guard: true }, "", window.location.href);
      }
    }
  };

  /** -----------------------------
   * Price Calculations
   * ----------------------------- */
  const calculateCurrentTotal = () => {
    if (!orderData) return 0;
    return (orderData.local_order_items ?? []).reduce(
      (total, item) => total + (Number(item.final_price) || 0) * item.quantity,
      0
    );
  };

  const calculatePriceDifference = () => {
    const currentTotal = calculateCurrentTotal();
    return currentTotal - orderData!.total_price;
  };

  /** -----------------------------
   * Confirm Correction
   * ----------------------------- */
  const handleConfirmCorrection = async () => {
    if (!orderData || !orderId) return;

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const items = orderData.local_order_items ?? [];
      if (items.length === 0) {
        setError('Please keep at least one item in the order.');
        return;
      }

      const correctedTotal = calculateCurrentTotal();
      const platformFee = Math.round(correctedTotal * 0.05);

      const payload: UpdateLocalOrderCorrectionRequest = {
        orderData: {
          order_status: 'under_review',
          payment_status: 'pending',
          total_price: correctedTotal,
          platform_fee: platformFee,
          admin_notes: `User submitted correction on ${new Date().toLocaleDateString()} with ${items.length} items.`,
        },
        items: items.map((item) => ({
          source_type: item.source_type || 'manual_link',
          product_name: item.product_name,
          product_link: item.product_link,
          color: item.color || '',
          size: item.size || '',
          quantity: item.quantity,
          price: Number(item.price) || 0,
          final_price: Number(item.final_price) || 0,
          status: 'pending',
          deny_reasons: [], // clear deny reasons
          image_link: item.image_link || '',
        })),
      };

      // ✅ IMPORTANT: if additional payment required -> go to payment first, DO NOT call update API here
      const additionalAmount = Math.max(0, correctedTotal - orderData.total_price);
      if (additionalAmount > 0) {
        localStorage.setItem(
          'correctionPayment',
          JSON.stringify({ orderId, amount: additionalAmount, currency: 'INR' })
        );

        // Save correction payload to be submitted after payment
        localStorage.setItem(
          'pendingOrderCorrection',
          JSON.stringify({ orderId, payload })
        );
        clearDraft(orderId);

        navigate('/payment', {
          state: { type: 'correction', orderId, amount: additionalAmount, currency: 'INR' }
        });
        return;
      }

      // ✅ No additional payment -> update immediately
      const res = await orderService.submitLocalOrderCorrection(orderId, payload);

      if (!res.success) {
        setError('Failed to submit order correction. Please try again.');
        return;
      }

      setSuccess('Order correction submitted successfully!');
      clearDraft(orderId);
      setTimeout(() => navigate('/domestic-orders'), 1200);
    } catch (err) {
      setError('Failed to submit order correction. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
            onClick={handleBackToOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const priceDifference = calculatePriceDifference();
  const needsAdditionalPayment = priceDifference > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToOrders}
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
                const hasErrors = !!(item.deny_reasons && item.deny_reasons.length > 0);
                const accepted = isAcceptedItem(item);
                const priceMismatch = hasPriceMismatch(item);

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
                          className="w-24 h-24 rounded-lg border"
                        />
                      )}

                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{item.product_name}</h3>

                          {accepted && (
                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                              Accepted
                            </span>
                          )}
                        </div>

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

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs text-gray-500">Color</label>
                            {item.isEditing ? (
                              <input
                                type="text"
                                value={item.color || ''}
                                onChange={e => handleItemEdit(item.id, 'color', e.target.value)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              <p>{item.color}</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs text-gray-500">Size</label>
                            {item.isEditing ? (
                              <input
                                type="text"
                                value={item.size || ''}
                                onChange={e => handleItemEdit(item.id, 'size', e.target.value)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              <p>{item.size}</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs text-gray-500">Quantity</label>
                            {item.isEditing ? (
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={e =>
                                  handleItemEdit(item.id, 'quantity', parseInt(e.target.value || '1', 10))
                                }
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              <p>{item.quantity}</p>
                            )}
                          </div>

                          {/* ✅ price mismatch allows editing unit price */}
                          {item.isEditing && priceMismatch && (
                            <div className="md:col-span-3">
                              <label className="text-xs text-gray-500">Current Unit Price (₹)</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={Number(item.final_price) || 0}
                                onChange={e =>
                                  handleItemEdit(item.id, 'final_price', parseFloat(e.target.value || '0'))
                                }
                                className="w-full px-2 py-1 border rounded"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Edit only if admin marked a price mismatch.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Paid:</span>
                            <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Current:</span>
                            <p>₹{(item.final_price * item.quantity).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Difference:</span>
                            <p
                              className={
                                (item.final_price * item.quantity) - (item.price * item.quantity) > 0
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }
                            >
                              {(item.final_price * item.quantity) - (item.price * item.quantity) > 0 ? '+' : ''}
                              ₹{((item.final_price * item.quantity) - (item.price * item.quantity)).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Disable edit/remove for accepted items */}
                        {!accepted && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => toggleItemEdit(item.id)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                            >
                              {item.isEditing ? 'Save' : 'Edit'}
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="flex items-center font-semibold mb-4">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Price Summary
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
              {isSaving
                ? 'Submitting...'
                : needsAdditionalPayment
                  ? 'Confirm & Proceed to Payment'
                  : 'Confirm Order Correction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCorrection;
