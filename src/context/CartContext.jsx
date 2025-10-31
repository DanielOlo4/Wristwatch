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

  // ✅ Get auth header
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

  // ✅ Format image paths to match backend structure
  const formatImagePath = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100x100?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}/uploads/${imagePath}`;
  };

  // ✅ Fetch cart - matches backend getCart controller
  const fetchCart = async () => {
    if (!isAuthenticated()) {
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
        
        // Format items to match backend response structure
        const formattedItems = items.map(item => ({
          ...item,
          watch: item.watch ? {
            ...item.watch,
            imageUrl: item.watch.imageUrl || formatImagePath(item.watch.image)
          } : null
        }));
        
        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartError(error.response?.data?.message || error.message);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add to cart - matches backend addItem controller
  const addToCart = async (watchId, quantity = 1) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/cart/add`, 
        { watchId, quantity },
        { headers: getAuthHeader() }
      );
      
      if (response.data.success) {
        await fetchCart();
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add item to cart' 
      };
    }
  };

  // ✅ Add multiple items - matches backend addItemToCart controller
  const addMultipleToCart = async (items) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/cart/addItemToCart`, 
        { cartedItems: items },
        { headers: getAuthHeader() }
      );
      
      if (response.data.success) {
        await fetchCart();
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Error adding multiple items:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add items to cart' 
      };
    }
  };

  // ✅ Update item - matches backend updateItem controller
  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to update cart' };
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/cart/update`,
        { itemId, quantity },
        { headers: getAuthHeader() }
      );
      
      if (response.data.success) {
        await fetchCart();
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update cart item' 
      };
    }
  };

  // ✅ Remove item - matches backend removeItem controller
  const removeFromCart = async (itemId) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to remove items from cart' };
    }

    try {
      const response = await axios.delete(
        `${BASE_URL}/api/cart/remove/${itemId}`,
        { headers: getAuthHeader() }
      );
      
      if (response.data.success) {
        await fetchCart();
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to remove item from cart' 
      };
    }
  };

  // ✅ Initialize payment - matches backend initializePayment controller
  const initializePayment = async (deliveryInfo) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to proceed with payment' };
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/cart/initialize-payment`,
        deliveryInfo,
        { headers: getAuthHeader() }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error initializing payment:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Payment initialization failed'
      };
    }
  };

  // ✅ Verify payment - matches backend verifyPayment controller
  const verifyPayment = async (reference) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/cart/verify-payment/${reference}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Payment verification failed'
      };
    }
  };

  // ✅ Get payment status - matches backend getPaymentStatus controller
  const getPaymentStatus = async (reference) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to check payment status' };
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/api/cart/payment-status/${reference}`,
        { headers: getAuthHeader() }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to get payment status'
      };
    }
  };

  // ✅ Helper functions
  const clearCart = () => {
    setCartItems([]);
    setCartError(null);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.watch?.price || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getItemQuantity = (watchId) => {
    const item = cartItems.find(item => item.watch?._id === watchId);
    return item ? item.quantity : 0;
  };

  const isInCart = (watchId) => {
    return cartItems.some(item => item.watch?._id === watchId);
  };

  // Sync cart when component mounts
  useEffect(() => {
    fetchCart();
  }, [user]);

  const value = {
    // State
    cartItems,
    loading,
    cartError,
    
    // Actions - directly mapped to backend controllers
    fetchCart,
    addToCart,
    addMultipleToCart,
    updateCartItem,
    removeFromCart,
    initializePayment,
    verifyPayment,
    getPaymentStatus,
    clearCart,
    
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