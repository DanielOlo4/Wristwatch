import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CheckCircle, Package, Truck, Download } from "lucide-react";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://wristwatch-app-backend.onrender.com/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#C5A572] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    </div>
  );
  
  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
      <div className="text-center">
        <Package size={64} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order not found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <Link
          to="/accessories"
          className="bg-[#C5A572] text-white px-6 py-3 rounded-lg hover:bg-[#b8945f] transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );

  const { orderItems, shippingAddress, totalPrice, paymentMethod, orderStatus, trackingNumber, invoiceUrl } = order;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="bg-white p-8 rounded-2xl shadow-md text-center border border-green-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-700 text-lg mb-6">Thank you for your purchase. Your order has been confirmed.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-semibold text-gray-900">{order._id.slice(-8)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-semibold text-green-600">{orderStatus}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="font-semibold text-gray-900">₦{totalPrice.toLocaleString()}</p>
            </div>
          </div>

          {invoiceUrl && (
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#C5A572] hover:text-[#b8945f] mt-6 font-medium"
            >
              <Download size={20} />
              Download Invoice
            </a>
          )}
        </div>

        {/* Order Tracking */}
        {trackingNumber && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Truck size={24} className="text-[#C5A572]" />
              <h2 className="text-xl font-semibold text-gray-800">Tracking Information</h2>
            </div>
            <p className="text-gray-700">
              <span className="font-medium">Tracking Number:</span> {trackingNumber}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              You will receive shipping updates via email and SMS.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.product} className="flex gap-4 items-center">
                  <img
                    src={item.image?.startsWith("http") ? item.image : `https://wristwatch-app-backend.onrender.com/uploads/${item.image?.replace(/^\/+/, "")}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <p className="font-medium text-gray-900">{paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
                <p className="text-gray-700">{shippingAddress.address}</p>
                <p className="text-gray-700">{shippingAddress.city}, {shippingAddress.state}</p>
                <p className="text-gray-700">{shippingAddress.country}</p>
                <p className="text-gray-700">Phone: {shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center pt-8">
          <Link
            to="/accessories"
            className="bg-[#C5A572] text-white px-8 py-3 rounded-lg hover:bg-[#b8945f] transition duration-300 font-medium inline-flex items-center gap-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;