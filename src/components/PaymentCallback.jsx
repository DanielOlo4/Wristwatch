// components/PaymentCallback.js
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const reference = queryParams.get("reference");
        const orderId = localStorage.getItem("pendingOrder");

        if (!reference || !orderId) {
          toast.error("Payment information not found");
          navigate("/cart");
          return;
        }

        // Verify payment with backend
        const token = localStorage.getItem("authToken");
        const res = await axios.post(
          "https://wristwatch-app-backend.onrender.com/api/orders/confirm-payment",
          { orderId, reference },
          { 
            headers: { 
              Authorization: `Bearer ${token}` 
            } 
          }
        );

        if (res.data.success) {
          toast.success("Payment successful!");
          // ✅ Redirect directly to OrderSuccess page
          navigate(`/order-success/${orderId}`);
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        console.error("Payment callback error:", error);
        toast.error("Payment verification failed. Please contact support.");
        navigate("/cart");
      }
    };

    handlePaymentCallback();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#C5A572] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Processing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentCallback;