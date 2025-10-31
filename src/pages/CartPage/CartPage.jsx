// pages/CartPage.js
import React, { useState, useEffect } from 'react';
import { useCart } from '../../../src/context/CartContext';
import toast from "react-hot-toast";

const CartPage = () => {
  const { 
    cartItems, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    getTotalPrice,
    getTotalItems,
    formatImagePath,
    initializePayment,
    verifyPayment
  } = useCart();
  
  const [imageErrors, setImageErrors] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryAddress: '',
    deliveryPhone: ''
  });
  const [paymentStatus, setPaymentStatus] = useState(null);

  // ✅ Check for payment return on page load
  useEffect(() => {
    const checkPaymentReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get('reference') || urlParams.get('trxref');
      
      if (reference) {
        await handlePaymentVerification(reference);
      }
    };

    checkPaymentReturn();
  }, []);

  // ✅ Payment verification - uses backend verifyPayment controller
  const handlePaymentVerification = async (reference) => {
    try {
      setCheckoutLoading(true);
      const result = await verifyPayment(reference);
      
      if (result.success) {
        if (result.data.status === "paid" || result.data.status === "already_paid") {
          toast.success('Payment successful! Your order has been confirmed.');
          setPaymentStatus('success');
          
          setTimeout(() => {
            window.location.href = '/order-success';
          }, 2000);
        }
      } else {
        toast.error(result.message || 'Payment verification failed');
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Payment verification failed. Please contact support.');
      setPaymentStatus('failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ✅ Checkout process - uses backend initializePayment controller
  const handleCheckout = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to proceed with checkout');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!deliveryInfo.deliveryAddress || !deliveryInfo.deliveryPhone) {
      toast.error('Please fill in delivery address and phone number');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(deliveryInfo.deliveryPhone)) {
      toast.error('Please enter a valid 11-digit phone number');
      return;
    }

    if (deliveryInfo.deliveryAddress.length < 10) {
      toast.error('Please enter a complete delivery address (at least 10 characters)');
      return;
    }

    setCheckoutLoading(true);
    try {
      const result = await initializePayment(deliveryInfo);

      if (result.success) {
        toast.success('Redirecting to payment gateway...');
        
        // Store order info
        localStorage.setItem('currentOrder', JSON.stringify({
          amount: result.data.amount,
          reference: result.data.reference,
          items: cartItems
        }));
        
        // Redirect to Paystack
        setTimeout(() => {
          window.location.href = result.data.authorization_url;
        }, 1000);
      } else {
        // Handle backend validation errors
        if (result.missingFields) {
          if (result.missingFields.includes('email')) {
            toast.error('Email not found in your profile. Please update your account.');
          }
          if (result.missingFields.includes('userId')) {
            toast.error('Authentication failed. Please login again.');
            setTimeout(() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }, 2000);
          }
        } else {
          toast.error(result.message || 'Payment initialization failed');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ✅ Quantity change handler
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      const result = await updateCartItem(itemId, newQuantity);
      if (!result.success) {
        toast.error(result.error);
      }
    }
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const getImageUrl = (watch) => {
    if (!watch) return 'https://via.placeholder.com/100x100?text=No+Image';
    return watch.imageUrl || formatImagePath(watch.image);
  };

  // Calculate totals (matches backend calculation)
  const shippingFee = 1000;
  const taxRate = 0.075;
  const subtotal = getTotalPrice();
  const tax = subtotal * taxRate;
  const total = subtotal + shippingFee + tax;

  if (loading) return <div className="text-center py-8">Loading cart...</div>;

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Payment Successful!</h2>
          <p className="text-green-600 mb-6">Your order has been confirmed and will be delivered soon.</p>
          <button 
            onClick={() => window.location.href = '/accessories'}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <button 
            onClick={() => window.location.href = '/accessories'}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {imageErrors[item._id] ? (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    ) : (
                      <img 
                        src={getImageUrl(item.watch)} 
                        alt={item.watch?.name || 'Watch'}
                        className="w-20 h-20 object-cover rounded"
                        onError={() => handleImageError(item._id)}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.watch?.name || 'Unknown Watch'}</h3>
                    <p className="text-gray-600">{item.watch?.brand || 'No Brand'}</p>
                    <p className="text-blue-600 font-bold">₦{(item.watch?.price || 0).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-right font-semibold">
                  Subtotal: ₦{((item.watch?.price || 0) * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md border h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items ({getTotalItems()}):</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₦{shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (7.5%):</span>
                <span>₦{tax.toLocaleString()}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            {!showCheckoutForm ? (
              <button 
                onClick={() => {
                  if (!localStorage.getItem('token')) {
                    toast.error('Please login first');
                    return;
                  }
                  setShowCheckoutForm(true);
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.deliveryAddress}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your full delivery address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={deliveryInfo.deliveryPhone}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, deliveryPhone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="08012345678"
                    required
                  />
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ₦${total.toLocaleString()}`
                  )}
                </button>
                
                <button 
                  onClick={() => setShowCheckoutForm(false)}
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;