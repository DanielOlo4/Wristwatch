import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// 👉 CountrySearch (left side) - unchanged
function CountrySearch() {
  const countries = [
    "NIGERIA",
    "LONDON",
    "SPAIN",
    "ITALY",
    "CANADA",
    "TOGO",
    "CAMEROON",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % countries.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [countries.length]);

  return (
    <div
      className="flex flex-1 max-w-[500px] h-[500px] p-8 rounded-xl shadow-lg 
                 text-center justify-center items-center bg-transparent
                 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/uploads/Rolex2.jpeg')" }}
    >
      <style>{`
        .country-anim {
          display: inline-block;
          color: #800020 ;
          animation: countryFade 700ms ease;
        }
        @keyframes countryFade {
          0% { opacity: 0; transform: translateY(-8px); }
          50% { opacity: 0.6; transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <h2 className=" text-[46px] font-bold text-white drop-shadow-lg">
        WHAT IS THE TIME IN <br />
        <span className="country-anim" key={index}>
          {countries[index]}
        </span>
        ?
      </h2>
    </div>
  );
}

// 👉 Unified Login Component
function UnifiedLogin({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("user"); // "user" or "admin"
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required!");
      return;
    }

    if (!isLogin && !formData.username) {
      toast.error("Username is required!");
      return;
    }

    setLoading(true);
    
    const baseUrl = 'https://wristwatch-app-backend.onrender.com';
    
    // Choose endpoint based on user type
    const endpoint = userType === "admin" 
      ? `${baseUrl}/api/admin/${isLogin ? 'login' : 'register'}`
      : `${baseUrl}/api/auth/${isLogin ? 'login' : 'register'}`;

    try {
      let requestData = isLogin ? {
        email: formData.email,
        password: formData.password
      } : {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await axios.post(endpoint, requestData, {
        timeout: 50000,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        const token = response.data.data?.token;
        
        if (!token) {
          toast.error("Authentication failed - no token received");
          return;
        }

        // Prepare user data based on user type
        const userData = userType === "admin" 
          ? response.data.admin || {
              id: response.data.data?.admin?.id,
              username: formData.username,
              email: formData.email,
              role: 'admin'
            }
          : {
              username: formData.username || formData.email,
              email: formData.email,
              role: 'user'
            };

        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
        
        // Navigate to appropriate page based on user type
        const redirectPath = userType === "admin" ? "/admin" : "/accessories";
        toast.success(`${userType === "admin" ? "Admin" : "User"} ${isLogin ? 'login' : 'registration'} successful!`);
        navigate(redirectPath);
      } else {
        toast.error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.statusText;
        
        if (status === 404) {
          toast.error('Authentication service unavailable');
        } else if (status === 400 || status === 401) {
          toast.error(message || 'Invalid credentials');
        } else if (status === 403) {
          toast.error('Access denied');
        } else if (status === 409) {
          toast.error(userType === "admin" ? 'Admin already exists' : 'User already exists');
        } else {
          toast.error(message || `Server error: ${status}`);
        }
      } else if (error.request) {
        toast.error('No response from server. Please try again.');
      } else {
        toast.error(error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form when switching between login/signup or user types
  useEffect(() => {
    setFormData({ username: "", email: "", password: "" });
  }, [isLogin, userType]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
      {/* User Type Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            userType === "user" 
              ? "bg-blue-600 text-white shadow" 
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setUserType("user")}
        >
          👤 User
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            userType === "admin" 
              ? "bg-red-600 text-white shadow" 
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setUserType("admin")}
        >
          🔧 Admin
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
          userType === "admin" ? "bg-red-100" : "bg-blue-100"
        }`}>
          <span className="text-xl">{userType === "admin" ? "🔧" : "👤"}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {userType === "admin" ? "Admin" : "User"} {isLogin ? "Login" : "Sign Up"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {userType === "admin" 
            ? "Manage your watch inventory" 
            : "Browse our watch collection"
          }
        </p>
      </div>

      {/* Form */}
      {!isLogin && (
        <input
          className="block w-full my-3 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:outline-none transition"
          style={{ 
            focusRingColor: userType === "admin" ? "#dc2626" : "#2563eb" 
          }}
          type="text"
          name="username"
          placeholder={userType === "admin" ? "Admin username" : "Choose a username"}
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
        />
      )}
      
      <input
        className="block w-full my-3 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:outline-none transition"
        style={{ 
          focusRingColor: userType === "admin" ? "#dc2626" : "#2563eb" 
        }}
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        disabled={loading}
      />
      
      <input
        className="block w-full my-3 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:outline-none transition"
        style={{ 
          focusRingColor: userType === "admin" ? "#dc2626" : "#2563eb" 
        }}
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
      />

      {/* Submit Button */}
      <button
        className={`w-full p-3 mt-2 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50 ${
          userType === "admin" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading 
          ? `${isLogin ? 'Logging in...' : 'Creating account...'}` 
          : `${userType === "admin" ? "Admin" : "User"} ${isLogin ? "Login" : "Sign Up"}`
        }
      </button>

      {/* Toggle between Login/Signup */}
      <p className="mt-4 text-center text-gray-600 text-sm">
        {isLogin 
          ? `Don't have an ${userType} account?` 
          : `Already have an ${userType} account?`
        }{" "}
        <button
          className={`font-medium hover:underline ${
            userType === "admin" ? "text-red-600 hover:text-red-800" : "text-blue-600 hover:text-blue-800"
          }`}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign up here" : "Login here"}
        </button>
      </p>
    </div>
  );
}

// 👉 Parent page - Simplified layout
function LoginPage({ setUser }) {
  return (
    <div className="flex justify-center items-center min-h-screen gap-8 p-5 
                    bg-gradient-to-r from-blue-100 to-pink-100 font-sans">
      {/* Wristwatch section */}
      <CountrySearch />
      
      {/* Unified Login section */}
      <div className="flex justify-center items-center">
        <UnifiedLogin setUser={setUser} />
      </div>
    </div>
  );
}

export default LoginPage;