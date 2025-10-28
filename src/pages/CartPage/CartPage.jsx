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
    formatImagePath 
  } = useCart();
  
  const [imageErrors, setImageErrors] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryAddress: '',
    deliveryPhone: ''
  });

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

  // ✅ SIMPLIFIED: Use the formatImagePath from context
  const getImageUrl = (watch) => {
    if (!watch) return 'https://via.placeholder.com/100x100?text=No+Image';
    return watch.imageUrl || formatImagePath(watch.image);
  };

  // Handle checkout and payment initialization
  const handleCheckout = async () => {
    if (!deliveryInfo.deliveryAddress || !deliveryInfo.deliveryPhone) {
      toast.error('Please fill in delivery address and phone number');
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/cart/initialize-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(deliveryInfo)
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to Paystack payment page
        window.location.href = result.data.authorization_url;
      } else {
        toast.error(result.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading cart...</div>;

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
                    <p className="text-blue-600 font-bold">${item.watch?.price || 0}</p>
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
                  Subtotal: ${((item.watch?.price || 0) * item.quantity).toFixed(2)}
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
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${(getTotalPrice() + 10 + getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout with delivery info form */}
            {!showCheckoutForm ? (
              <button 
                onClick={() => setShowCheckoutForm(true)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.deliveryAddress}
                    onChange={(e) => setDeliveryInfo(prev => ({
                      ...prev,
                      deliveryAddress: e.target.value
                    }))}
                    placeholder="Enter your full delivery address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    minLength="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={deliveryInfo.deliveryPhone}
                    onChange={(e) => setDeliveryInfo(prev => ({
                      ...prev,
                      deliveryPhone: e.target.value
                    }))}
                    placeholder="Enter your phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    minLength="11"
                  />
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? 'Processing...' : 'Pay Now'}
                </button>
                <button 
                  onClick={() => setShowCheckoutForm(false)}
                  className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
            
            <button 
              onClick={() => window.location.href = '/accessories'}
              className="w-full mt-2 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;