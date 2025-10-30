// pages/OrderSuccess.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = localStorage.getItem('currentOrder');
    if (orderData) {
      setOrder(JSON.parse(orderData));
      // Clear the cart data from localStorage
      localStorage.removeItem('currentOrder');
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  if (!order) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-green-200 overflow-hidden">
        <div className="bg-green-600 text-white p-6 text-center">
          <div className="text-4xl mb-2">✓</div>
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="opacity-90">Thank you for your purchase</p>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-2">Order Details</h2>
            <p><strong>Reference:</strong> {order.reference}</p>
            <p><strong>Amount Paid:</strong> ₦{order.amount?.toLocaleString()}</p>
            <p><strong>Items:</strong> {order.items.length} product(s)</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">📦 Delivery Information</h3>
            <p>Your order will be processed and shipped within 24 hours.</p>
            <p className="text-sm mt-2">You will receive a confirmation email shortly.</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/accessories')}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;