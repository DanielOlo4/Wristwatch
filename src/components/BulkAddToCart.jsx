// components/BulkAddToCart.js
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const BulkAddToCart = ({ watches }) => {
  const { addMultipleToCart } = useCart();
  const [selectedWatches, setSelectedWatches] = useState({});
  const [loading, setLoading] = useState(false);

  // Add the same image resolver function
  const resolveImageSrc = (img) => {
    if (!img) return "https://via.placeholder.com/150";
    if (typeof img !== "string") return "https://via.placeholder.com/150";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `https://wristwatch-app-backend.onrender.com${img.startsWith("/") ? img : `/uploads/${img}`}`;
  };

  // Use index since watches might not have _id
  const toggleWatchSelection = (index) => {
    setSelectedWatches(prev => ({
      ...prev,
      [index]: prev[index] ? 0 : 1
    }));
  };

  const updateQuantity = (index, quantity) => {
    setSelectedWatches(prev => ({
      ...prev,
      [index]: Math.max(0, quantity)
    }));
  };

  const handleBulkAddToCart = async () => {
    const itemsToAdd = Object.entries(selectedWatches)
      .filter(([_, quantity]) => quantity > 0)
      .map(([index, quantity]) => {
        const watch = watches[parseInt(index)];
        return {
          itemId: watch._id || watch.id || `watch-${index}`, // Fallback IDs
          quantity: quantity
        };
      });

    if (itemsToAdd.length === 0) {
      alert('Please select at least one watch');
      return;
    }

    setLoading(true);
    const result = await addMultipleToCart(itemsToAdd);
    
    if (result.success) {
      alert(`${itemsToAdd.length} items added to cart successfully!`);
      setSelectedWatches({});
    } else {
      alert('Failed to add items: ' + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Add Multiple Watches to Cart</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {watches.map((watch, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={!!selectedWatches[index]}
                onChange={() => toggleWatchSelection(index)}
                className="w-4 h-4"
              />
              <img 
                src={resolveImageSrc(watch.image)} 
                alt={watch.name} 
                className="w-12 h-12 object-cover rounded"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <div>
                <h4 className="font-semibold">{watch.name}</h4>
                <p className="text-gray-600">${watch.price}</p>
              </div>
            </div>
            
            {selectedWatches[index] && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateQuantity(index, (selectedWatches[index] || 1) - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-8 text-center">{selectedWatches[index]}</span>
                <button 
                  onClick={() => updateQuantity(index, (selectedWatches[index] || 1) + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleBulkAddToCart}
        disabled={loading}
        className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
      >
        {loading ? 'Adding Items...' : `Add Selected Items to Cart`}
      </button>
    </div>
  );
};

export default BulkAddToCart;