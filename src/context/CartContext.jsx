// contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
  const [syncing, setSyncing] = useState(false);

  // ✅ Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // ✅ Get auth headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ Format image paths
  const formatImagePath = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100x100?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://wristwatch-app-backend.onrender.com/uploads/${imagePath}`;
  };

  // ✅ Load cart from backend when user is authenticated
  const loadCartFromBackend = async () => {
    const token = getAuthToken();
    if (!user || !token) {
      loadCartFromStorage();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        'https://wristwatch-app-backend.onrender.com/api/cart/get',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.data && response.data.data.cartedItems) {
        const backendCart = response.data.data.cartedItems.map(item => ({
          _id: item._id,
          watchId: item.watch?._id || item.productId,
          quantity: item.quantity,
          watch: {
            _id: item.watch?._id || item.productId,
            name: item.watch?.name || item.name,
            price: item.watch?.price || item.price,
            brand: item.watch?.brand || item.brand,
            image: item.watch?.image || item.image,
            description: item.watch?.description || item.description
          },
          totalItemPrice: item.totalItemPrice || (item.watch?.price || item.price) * item.quantity
        }));
        
        setCartItems(backendCart);
        saveCartToStorage(backendCart);
      }
    } catch (error) {
      console.error('Error loading cart from backend:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        toast.error('Session expired. Please login again.');
      }
      loadCartFromStorage();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load cart from local storage (guest mode)
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      setCartItems([]);
    }
  };

  // ✅ Save cart to local storage
  const saveCartToStorage = (items) => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  // ✅ FIXED: Enhanced Sync local cart to backend when user logs in
  const syncCartToBackend = async () => {
    const token = getAuthToken();
    if (!user || !token) {
      console.log('Sync: No user or token');
      return;
    }

    try {
      setSyncing(true);
      const guestCart = localStorage.getItem('guestCart');
      
      if (!guestCart) {
        console.log('Sync: No guest cart found');
        return;
      }

      const localCart = JSON.parse(guestCart);
      
      if (localCart.length === 0) {
        console.log('Sync: Guest cart is empty');
        localStorage.removeItem('guestCart');
        return;
      }

      console.log(`🔄 Syncing ${localCart.length} items to backend`);
      
      let successCount = 0;
      let errorCount = 0;

      for (const item of localCart) {
        try {
          console.log(`📦 Syncing item:`, {
            watchId: item.watchId,
            quantity: item.quantity
          });

          const response = await axios.post(
            'https://wristwatch-app-backend.onrender.com/api/cart/add',
            {
              watchId: item.watchId,
              quantity: item.quantity
            },
            { 
              headers: { 'Authorization': `Bearer ${token}` },
              timeout: 10000
            }
          );

          console.log('📡 Backend response:', response.data);

          if (response.data.success) {
            successCount++;
            console.log(`✅ Successfully synced item ${item.watchId}`);
          } else {
            errorCount++;
            console.error(`❌ Backend returned error for item ${item.watchId}:`, response.data.message);
          }
        } catch (itemError) {
          errorCount++;
          console.error(`❌ Failed to sync item ${item.watchId}:`, {
            status: itemError.response?.status,
            data: itemError.response?.data,
            message: itemError.message
          });
          
          if (itemError.response?.status === 401) {
            console.log('🛑 Unauthorized, stopping sync');
            localStorage.removeItem('authToken');
            toast.error('Session expired. Please login again.');
            break;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`📊 Sync completed: ${successCount} successful, ${errorCount} failed`);
      
      if (errorCount === 0) {
        localStorage.removeItem('guestCart');
        await loadCartFromBackend();
        toast.success('Cart synced successfully!');
      } else if (successCount > 0) {
        localStorage.removeItem('guestCart');
        await loadCartFromBackend();
        toast.success(`Partially synced: ${successCount} items added, ${errorCount} failed`);
      } else {
        toast.error('Failed to sync cart items. Keeping local cart.');
      }
      
    } catch (error) {
      console.error('🛑 Sync process failed:', error);
      toast.error('Failed to sync cart. Please try adding items again.');
    } finally {
      setSyncing(false);
    }
  };

  // ✅ Add to cart - Works with both guest and authenticated users
  const addToCart = async (watchId, quantity = 1, watchData = null) => {
    try {
      setLoading(true);
      
      const newItem = {
        _id: `guest_${Date.now()}_${Math.random()}`,
        watchId,
        quantity,
        watch: watchData || { 
          _id: watchId, 
          name: 'Watch', 
          price: 0, 
          brand: 'Unknown',
          image: ''
        },
        totalItemPrice: (watchData?.price || 0) * quantity
      };

      const token = getAuthToken();
      
      // If user is authenticated, add to backend
      if (user && token) {
        try {
          const response = await axios.post(
            'https://wristwatch-app-backend.onrender.com/api/cart/add',
            {
              watchId: watchId,
              quantity: quantity
            },
            { 
              headers: { 'Authorization': `Bearer ${token}` },
              timeout: 10000
            }
          );

          console.log('➕ Add to cart backend response:', response.data);

          if (response.data.success) {
            await loadCartFromBackend();
            toast.success('Item added to cart successfully!');
            return { success: true, data: cartItems };
          } else {
            throw new Error(response.data.message || 'Failed to add item to backend cart');
          }
        } catch (error) {
          console.error('Backend cart error, using local storage:', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            toast.error('Session expired. Please login again.');
          }
          toast.error('Backend unavailable. Using local cart.');
        }
      }

      // Guest mode or backend failure - use local storage
      const updatedCart = [...cartItems];
      const existingItemIndex = updatedCart.findIndex(item => item.watchId === watchId);

      if (existingItemIndex > -1) {
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].totalItemPrice = updatedCart[existingItemIndex].watch.price * updatedCart[existingItemIndex].quantity;
      } else {
        updatedCart.push(newItem);
      }

      setCartItems(updatedCart);
      saveCartToStorage(updatedCart);
      toast.success('Item added to cart successfully!');
      
      return { success: true, data: updatedCart };
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
      return { success: false, error: 'Failed to add item to cart' };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      const itemToUpdate = cartItems.find(item => item._id === itemId);
      
      if (!itemToUpdate) {
        throw new Error('Item not found in cart');
      }

      const token = getAuthToken();
      
      // If user is authenticated, update backend
      if (user && token && !itemToUpdate._id.startsWith('guest_')) {
        try {
          await axios.put(
            `https://wristwatch-app-backend.onrender.com/api/cart/update/${itemToUpdate.watchId}`,
            { quantity },
            { 
              headers: { 'Authorization': `Bearer ${token}` },
              timeout: 10000
            }
          );
        } catch (error) {
          console.error('Backend update error, using local storage:', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            toast.error('Session expired. Please login again.');
          }
        }
      }

      const updatedCart = cartItems.map(item => {
        if (item._id === itemId) {
          return {
            ...item,
            quantity: quantity,
            totalItemPrice: item.watch.price * quantity
          };
        }
        return item;
      });

      setCartItems(updatedCart);
      saveCartToStorage(updatedCart);
      return { success: true, data: updatedCart };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false, error: 'Failed to update cart item' };
    }
  };

  // ✅ Remove item
  const removeFromCart = async (itemId) => {
    try {
      const itemToRemove = cartItems.find(item => item._id === itemId);
      
      if (!itemToRemove) {
        throw new Error('Item not found in cart');
      }

      const token = getAuthToken();
      
      // If user is authenticated, remove from backend
      if (user && token && !itemToRemove._id.startsWith('guest_')) {
        try {
          await axios.delete(
            `https://wristwatch-app-backend.onrender.com/api/cart/remove/${itemToRemove.watchId}`,
            { 
              headers: { 'Authorization': `Bearer ${token}` },
              timeout: 10000
            }
          );
        } catch (error) {
          console.error('Backend remove error, using local storage:', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            toast.error('Session expired. Please login again.');
          }
        }
      }

      const updatedCart = cartItems.filter(item => item._id !== itemId);
      setCartItems(updatedCart);
      saveCartToStorage(updatedCart);
      toast.success('Item removed from cart');
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: 'Failed to remove item from cart' };
    }
  };

  // ✅ Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('guestCart');
    
    const token = getAuthToken();
    if (user && token) {
      axios.delete('https://wristwatch-app-backend.onrender.com/api/cart/clear', {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000
      }).catch(error => {
        console.error('Error clearing backend cart:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          toast.error('Session expired. Please login again.');
        }
      });
    }
  };

  // ✅ Helper functions
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.watch?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getItemQuantity = (watchId) => {
    const item = cartItems.find(item => item.watchId === watchId);
    return item ? item.quantity : 0;
  };

  const isInCart = (watchId) => {
    return cartItems.some(item => item.watchId === watchId);
  };

  // Load cart when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadCartFromBackend();
    } else {
      loadCartFromStorage();
    }
  }, [user]);

  // Sync cart when user logs in - with better error handling
  useEffect(() => {
    const token = getAuthToken();
    if (user && token) {
      const syncTimer = setTimeout(() => {
        console.log('🔄 Starting cart sync for user:', user.email || user._id);
        syncCartToBackend();
      }, 1500);
      
      return () => clearTimeout(syncTimer);
    }
  }, [user]);

  const value = {
    cartItems,
    loading,
    syncing,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCartFromBackend,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    isInCart,
    formatImagePath
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;