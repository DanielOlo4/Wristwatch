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

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const isAuthenticated = () => {
    return !!user || !!localStorage.getItem('token');
  };

  // Helper function to format image paths - FIXED VERSION
  const formatImagePath = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100x100?text=No+Image';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // For all other cases, use the correct server URL with uploads path
    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000'
      : window.location.origin; // Use current domain for production
    
    return `${baseUrl}/uploads/${imagePath}`;
  };

  // Fetch cart - FIXED VERSION
  const fetchCart = async () => {
    if (!isAuthenticated()) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: getAuthHeader()
      });
      
      if (response.data.success) {
        const items = response.data.data || [];
        
        // Ensure all items have proper image URLs
        const validatedItems = items.map(item => ({
          ...item,
          watch: item.watch ? {
            ...item.watch,
            imageUrl: formatImagePath(item.watch.image)
          } : null
        }));
        
        setCartItems(validatedItems);
        console.log('Cart items loaded with images:', validatedItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (watchId, quantity = 1, watchData = null) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      const payload = { watchId, quantity };
      
      const response = await axios.post(
        'http://localhost:5000/api/cart/add', 
        payload,
        { headers: getAuthHeader() }
      );
      
      if (response.data.success) {
        await fetchCart();
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Add multiple items
  const addMultipleToCart = async (items) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/addItemToCart', 
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
      const errorMessage = error.response?.data?.message || 'Failed to add items to cart';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Update item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to update cart' };
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/cart/update',
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
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to remove items from cart' };
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/cart/remove/${itemId}`,
        { headers: getAuthHeader() }
      );
      
      if (response.data.success) {
        await fetchCart();
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Error removing from cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Checkout
  const checkout = async () => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to checkout' };
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/checkout', 
        {},
        { headers: getAuthHeader() }
      );
      
      if (response.data.success) {
        setCartItems([]);
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Error during checkout:', error);
      const errorMessage = error.response?.data?.message || 'Checkout failed';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Clear cart (local only)
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.watch?.price || 0;
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

  // Sync cart when component mounts and authentication changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  const value = {
    // State
    cartItems,
    loading,
    
    // Actions
    fetchCart,
    addToCart,
    addMultipleToCart,
    updateCartItem,
    removeFromCart,
    checkout,
    clearCart,
    
    // Getters
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    isInCart,
    
    // Utilities
    isAuthenticated,
    formatImagePath // Export for use in components
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;