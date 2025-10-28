// components/AddToCartButton.js
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const AddToCartButton = ({ watchId, watchName, price }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    const result = await addToCart(watchId, quantity);
    
    if (result.success) {
      alert(`${quantity} ${watchName} added to cart!`);
      setQuantity(1); // Reset quantity
    } else {
      alert('Failed to add to cart: ' + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button 
          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
          className="px-3 py-2 hover:bg-gray-100"
        >
          -
        </button>
        <span className="px-4 py-2">{quantity}</span>
        <button 
          onClick={() => setQuantity(prev => prev + 1)}
          className="px-3 py-2 hover:bg-gray-100"
        >
          +
        </button>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default AddToCartButton;