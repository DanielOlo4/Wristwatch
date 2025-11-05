import React, { useState, useEffect } from 'react';
import { useCart } from '../../../src/context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

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
  const navigate = useNavigate();

  // ✅ Quantity change handler
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const getImageUrl = (watch) => {
    if (!watch) return 'https://via.placeholder.com/100x100?text=No+Image';
    return watch.imageUrl || formatImagePath(watch.image);
  };

  // Calculate totals
  const subtotal = getTotalPrice();
  const shippingFee = subtotal > 0 ? 1000 : 0;
  const total = subtotal + shippingFee;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C5A572] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">Review your items and proceed to checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any watches to your cart yet.
            </p>
            <Link
              to="/accessories"
              className="bg-[#C5A572] text-white px-8 py-3 rounded-lg hover:bg-[#b8945f] transition duration-300 font-medium inline-flex items-center gap-2"
            >
              <ArrowRight size={20} /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map(item => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {imageErrors[item._id] ? (
                        <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      ) : (
                        <img 
                          src={getImageUrl(item.watch)} 
                          alt={item.watch?.name || 'Watch'}
                          className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                          onError={() => handleImageError(item._id)}
                        />
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {item.watch?.name || 'Unknown Watch'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">{item.watch?.brand || 'No Brand'}</p>
                          <p className="text-lg font-bold text-[#C5A572]">
                            ₦{(item.watch?.price || 0).toLocaleString()}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors duration-200"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-6 py-2 text-gray-700 font-medium min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Item Total</p>
                          <p className="text-lg font-bold text-gray-900">
                            ₦{((item.watch?.price || 0) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({getTotalItems()})</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingFee > 0 ? `₦${shippingFee.toLocaleString()}` : 'Free'}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#C5A572] text-white py-4 rounded-lg font-semibold hover:bg-[#b8945f] transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <Link 
                  to="/accessories"
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition duration-300 mt-3"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;