// pages/CheckoutPage.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, getTotalItems, formatImagePath, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    country: "Nigeria",
  });
  const [orderNote, setOrderNote] = useState("");

  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("authToken");
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const subtotal = getTotalPrice();
  const totalPrice = subtotal;

  const handlePlaceOrder = async () => {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to place an order");
      navigate("/login");
      return;
    }

    // Check token expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        toast.error("Your session has expired. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Token parsing error:", error);
      toast.error("Authentication error. Please log in again.");
      localStorage.removeItem("authToken");
      navigate("/login");
      return;
    }

    // Validate shipping information
    if (
      !shippingAddress.fullName?.trim() ||
      !shippingAddress.address?.trim() ||
      !shippingAddress.city?.trim() ||
      !shippingAddress.state?.trim() ||
      !shippingAddress.phone?.trim()
    ) {
      toast.error("Please fill in all required shipping information");
      return;
    }

    // Phone validation for Nigeria
    const phoneRegex = /^(?:\+234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(shippingAddress.phone.replace(/\s/g, ''))) {
      toast.error("Please enter a valid Nigerian phone number");
      return;
    }

    try {
      setProcessing(true);

      // Prepare order data
      const orderData = {
        shippingAddress,
        paymentMethod: "Paystack",
        shippingPrice: 0,
        orderItems: cartItems.map((item) => ({
          productId: item.watchId,
          name: item.watch?.name || "Watch",
          quantity: item.quantity,
          price: item.watch?.price || 0,
          image: item.watch?.image || "",
          totalItemPrice: item.totalItemPrice,
        })),
        itemsPrice: subtotal,
        totalPrice: totalPrice,
        ...(orderNote && { orderNote }),
      };

      console.log("Sending order data:", orderData);

      // Helper function for retry logic
      const axiosWithRetry = async (url, data, config, retries = 3) => {
        try {
          const response = await axios.post(url, data, {
            ...config,
            timeout: 30000
          });
          return response;
        } catch (error) {
          if (retries > 0 && (error.code === 'NETWORK_ERROR' || !error.response)) {
            console.log(`Retrying request... ${retries} attempts left`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return axiosWithRetry(url, data, config, retries - 1);
          }
          throw error;
        }
      };

      // Create order with retry
      const orderRes = await axiosWithRetry(
        "https://wristwatch-app-backend.onrender.com/api/orders/order",
        orderData,
        { headers: getAuthHeaders() }
      );

      console.log("Order response:", orderRes.data);

      const order = orderRes.data.order;
      if (!order || !order._id) {
        toast.error("Failed to create order - No order ID received");
        return;
      }

      // ✅ Store order ID for OrderSuccess page
      localStorage.setItem("pendingOrder", order._id);
      localStorage.setItem("orderShippingAddress", JSON.stringify(shippingAddress));
      
      // Initialize Paystack payment with retry
      const initRes = await axiosWithRetry(
        "https://wristwatch-app-backend.onrender.com/api/orders/payment/initialize",
        { orderId: order._id },
        { headers: getAuthHeaders() }
      );

      console.log("Payment initialization response:", initRes.data);

      const { authorization_url } = initRes.data;

      if (!authorization_url) {
        toast.error("Failed to get payment URL");
        return;
      }

      clearCart();
      toast.success("Redirecting to Paystack...");
      window.location.href = authorization_url;
      
    } catch (err) {
      console.error("Order creation error:", err);
      
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error ||
                            "Failed to place order";
        toast.error(errorMessage);
      } else if (err.request) {
        console.error("No response received:", err.request);
        toast.error("Network error: Unable to connect to server. Please check your internet connection.");
      } else {
        console.error("Error message:", err.message);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setProcessing(false);
    }
  };

  // ... rest of your component remains the same
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
          <Link
            to="/accessories"
            className="bg-[#C5A572] text-white px-8 py-3 rounded-lg hover:bg-[#b8945f] transition duration-300 font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[#C5A572] hover:text-[#b8945f] mb-4 font-medium"
          >
            <ArrowLeft size={20} /> Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#C5A572] rounded-full flex items-center justify-center">
                  <MapPin size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Shipping Information
                </h2>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, address: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent"
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, state: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent"
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Oyo">Oyo</option>
                      <option value="Osun">Osun</option>
                      <option value="Kwara">Kwara</option>
                      <option value="Abuja">Abuja</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent"
                    placeholder="Phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Note (Optional)
                  </label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent"
                    placeholder="Any special instructions..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={formatImagePath(item.watch?.image)}
                      alt={item.watch?.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900">
                        {item.watch?.name || "Watch"}
                      </h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₦{((item.watch?.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={20} className="text-green-600" />
                <h3 className="font-semibold text-gray-800">Secure Checkout</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your personal and payment information is encrypted and secure.
              </p>
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-[#C5A572] text-white py-4 rounded-lg font-semibold hover:bg-[#b8945f] disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order - ₦${totalPrice.toLocaleString()}`
                )}
              </button>
              <Link
                to="/cart"
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition duration-300"
              >
                <ArrowLeft size={18} /> Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;