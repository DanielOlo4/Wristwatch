// contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  const BASE_URL = 'https://wristwatch-app-backend.onrender.com';

  // ✅ IMPROVED: Get auth header with validation
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token && token !== 'undefined' && token !== 'null';
  };

  // ✅ FIXED: Helper function to format image paths
  const formatImagePath = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100x100?text=No+Image';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    return `${BASE_URL}/uploads/${imagePath}`;
  };

  // ✅ IMPROVED: Fetch cart with better error handling
  const fetchCart = async () => {
    if (!isAuthenticated()) {
      console.log('🛒 User not authenticated, skipping cart fetch');
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      setCartError(null);
      
      const response = await axios.get(`${BASE_URL}/api/cart`, {
        headers: getAuthHeader(),
        timeout: 10000
      });
      
      if (response.data.success) {
        const items = response.data.data || [];
        
        console.log('🛒 Cart fetched successfully:', items.length, 'items');
        
        // Ensure all items have proper image URLs
        const validatedItems = items.map(item => ({
          ...item,
          watch: item.watch ? {
            ...item.watch,
            imageUrl: formatImagePath(item.watch.image)
          } : null
        }));
        
        setCartItems(validatedItems);
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      setCartError(error.response?.data?.message || error.message);
      
      if (error.response?.status === 401) {
        console.log('🔐 Authentication failed, clearing token');
        localStorage.removeItem('token');
        setCartItems([]);
      }
      
      // Don't throw error for fetch, just log it
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPROVED: Add to cart with better response handling
  const addToCart = async (watchId, quantity = 1) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      const payload = { watchId, quantity };
      
      console.log('🛒 Adding to cart:', payload);
      
      const response = await axios.post(
        `${BASE_URL}/api/cart/add`, 
        payload,
        { 
          headers: getAuthHeader(),
          timeout: 10000
        }
      );
      
      if (response.data.success) {
        console.log('✅ Item added to cart successfully');
        await fetchCart(); // Refresh cart
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // ✅ IMPROVED: Add multiple items
  const addMultipleToCart = async (items) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      console.log('🛒 Adding multiple items to cart:', items);
      
      const response = await axios.post(
        `${BASE_URL}/api/cart/addItemToCart`, 
        { cartedItems: items },
        { 
          headers: getAuthHeader(),
          timeout: 10000
        }
      );
      
      if (response.data.success) {
        console.log('✅ Multiple items added to cart successfully');
        await fetchCart();
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('❌ Error adding multiple items:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add items to cart';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // ✅ IMPROVED: Update item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to update cart' };
    }

    try {
      console.log('🛒 Updating cart item:', { itemId, quantity });
      
      const response = await axios.put(
        `${BASE_URL}/api/cart/update`,
        { itemId, quantity },
        { 
          headers: getAuthHeader(),
          timeout: 10000
        }
      );
      
      if (response.data.success) {
        console.log('✅ Cart item updated successfully');
        await fetchCart();
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('❌ Error updating cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // ✅ IMPROVED: Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to remove items from cart' };
    }

    try {
      console.log('🛒 Removing item from cart:', itemId);
      
      const response = await axios.delete(
        `${BASE_URL}/api/cart/remove/${itemId}`,
        { 
          headers: getAuthHeader(),
          timeout: 10000
        }
      );
      
      if (response.data.success) {
        console.log('✅ Item removed from cart successfully');
        await fetchCart();
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // ✅ IMPROVED: Checkout function (for direct checkout without payment)
  const checkout = async (checkoutData = {}) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to checkout' };
    }

    try {
      console.log('🛒 Processing checkout:', checkoutData);
      
      const response = await axios.post(
        `${BASE_URL}/api/cart/checkout`, 
        checkoutData,
        { 
          headers: getAuthHeader(),
          timeout: 10000
        }
      );
      
      if (response.data.success) {
        console.log('✅ Checkout completed successfully');
        setCartItems([]);
        return { success: true, message: response.data.message, data: response.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('❌ Error during checkout:', error);
      const errorMessage = error.response?.data?.message || 'Checkout failed';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Clear cart (local only)
  const clearCart = () => {
    console.log('🛒 Clearing local cart');
    setCartItems([]);
    setCartError(null);
  };

  // Calculate total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.watch?.price || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Get item quantity for a specific watch
  const getItemQuantity = (watchId) => {
    const item = cartItems.find(item => item.watch?._id === watchId);
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isInCart = (watchId) => {
    return cartItems.some(item => item.watch?._id === watchId);
  };

  // ✅ NEW: Initialize payment (connects to your backend initializePayment)
  const initializePayment = async (deliveryInfo) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to proceed with payment' };
    }

    try {
      console.log('💳 Initializing payment with delivery info:', deliveryInfo);
      
      const response = await axios.post(
        `${BASE_URL}/api/cart/initialize-payment`,
        deliveryInfo,
        { 
          headers: getAuthHeader(),
          timeout: 15000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ Error initializing payment:', error);
      const errorMessage = error.response?.data?.message || 'Payment initialization failed';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { 
        success: false, 
        message: errorMessage,
        error: errorMessage
      };
    }
  };

  // ✅ NEW: Verify payment (connects to your backend verifyPayment)
  const verifyPayment = async (reference) => {
    try {
      console.log('🔍 Verifying payment with reference:', reference);
      
      const response = await axios.get(
        `${BASE_URL}/api/cart/verify-payment/${reference}`,
        { timeout: 10000 }
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Payment verification failed'
      };
    }
  };

  // Sync cart when component mounts and authentication changes
  useEffect(() => {
    console.log('🔄 CartProvider mounted, fetching cart...');
    fetchCart();
  }, [user]);

  const value = {
    // State
    cartItems,
    loading,
    cartError,
    
    // Actions
    fetchCart,
    addToCart,
    addMultipleToCart,
    updateCartItem,
    removeFromCart,
    checkout,
    clearCart,
    initializePayment, // ✅ NEW
    verifyPayment,     // ✅ NEW
    
    // Getters
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    isInCart,
    
    // Utilities
    isAuthenticated,
    formatImagePath
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;