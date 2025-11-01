// components/BulkAddToCart.js
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const BulkAddToCart = ({ watches }) => {
  const { addMultipleToCart, addToCart } = useCart();
  const [selectedWatches, setSelectedWatches] = useState({});
  const [loading, setLoading] = useState(false);

  // FIXED: Universal getImageUrl function that works with ANY watch
  const getImageUrl = (watch) => {
    // If imageUrl is provided (new watches from admin), use it
    if (watch.imageUrl) return watch.imageUrl;
    
    // If image is provided (default watches or old watches), construct URL
    if (watch.image) return `https://wristwatch-app-backend.onrender.com/uploads/${watch.image}`;
    
    // Fallback
    return "https://via.placeholder.com/150";
  };

  // FIXED: Get display image for a watch - handles ALL cases
  const getDisplayImage = (watch) => {
    // Case 1: watch has imageUrl (new watches from admin)
    if (watch.imageUrl) {
      return watch.imageUrl;
    }
    
    // Case 2: watch has image (default watches or old watches)
    if (watch.image) {
      return `https://wristwatch-app-backend.onrender.com/uploads/${watch.image}`;
    }
    
    // Case 3: No images found
    return "https://via.placeholder.com/150";
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
          quantity: quantity,
          // Include watch data for proper cart display
          watchData: {
            name: watch.name,
            brand: watch.brand,
            price: watch.price,
            image: watch.image || watch.imageUrl
          }
        };
      });

    if (itemsToAdd.length === 0) {
      toast.error('Please select at least one watch');
      return;
    }

    setLoading(true);
    
    try {
      // If addMultipleToCart exists, use it, otherwise fall back to individual adds
      if (addMultipleToCart) {
        const result = await addMultipleToCart(itemsToAdd);
        
        if (result.success) {
          toast.success(`${itemsToAdd.length} items added to cart successfully!`);
          setSelectedWatches({});
        } else {
          toast.error('Failed to add items: ' + result.error);
        }
      } else {
        // Fallback: Add items individually
        let successCount = 0;
        let errorCount = 0;

        for (const item of itemsToAdd) {
          try {
            const result = await addToCart(
              item.itemId, 
              item.quantity, 
              item.watchData
            );
            
            if (result.success) {
              successCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            console.error(`Error adding watch to cart:`, error);
            errorCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`✅ Added ${successCount} item(s) to cart successfully!`);
        }
        if (errorCount > 0) {
          toast.error(`❌ Failed to add ${errorCount} item(s) to cart`);
        }
        
        setSelectedWatches({});
      }
    } catch (error) {
      console.error('Bulk add error:', error);
      toast.error('❌ Error adding items to cart');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total items and price
  const getSelectedCount = () => {
    return Object.values(selectedWatches).filter(qty => qty > 0).length;
  };

  const getTotalPrice = () => {
    return Object.entries(selectedWatches)
      .filter(([_, quantity]) => quantity > 0)
      .reduce((total, [index, quantity]) => {
        const watch = watches[parseInt(index)];
        return total + (watch?.price || 0) * quantity;
      }, 0);
  };

  const selectAll = () => {
    const allSelected = {};
    watches.forEach((_, index) => {
      allSelected[index] = 1;
    });
    setSelectedWatches(allSelected);
  };

  const clearAll = () => {
    setSelectedWatches({});
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Add Multiple Watches</h3>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Selection Summary */}
      {getSelectedCount() > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-700 font-medium">
              {getSelectedCount()} item(s) selected
            </span>
            <span className="text-blue-800 font-bold">
              ${getTotalPrice().toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
        {watches.map((watch, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 border rounded-lg transition ${
              selectedWatches[index] 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <input
                type="checkbox"
                checked={!!selectedWatches[index]}
                onChange={() => toggleWatchSelection(index)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <img 
                src={getDisplayImage(watch)} 
                alt={watch.name} 
                className="w-12 h-12 object-cover rounded border"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{watch.name}</h4>
                <p className="text-gray-600 text-sm">${watch.price?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 truncate">{watch.brand} • {watch.type}</p>
              </div>
            </div>
            
            {selectedWatches[index] && (
              <div className="flex items-center gap-2 ml-2">
                <button 
                  onClick={() => updateQuantity(index, (selectedWatches[index] || 1) - 1)}
                  className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-medium">{selectedWatches[index]}</span>
                <button 
                  onClick={() => updateQuantity(index, (selectedWatches[index] || 1) + 1)}
                  className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm hover:bg-gray-300 transition"
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
        disabled={loading || getSelectedCount() === 0}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
          loading || getSelectedCount() === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : (
          `Add ${getSelectedCount()} Item(s) to Cart`
        )}
      </button>

      <div className="text-xs text-gray-500 text-center mt-2">
        Select multiple watches and add them all to your cart at once
      </div>
    </div>
  );
};

export default BulkAddToCart;