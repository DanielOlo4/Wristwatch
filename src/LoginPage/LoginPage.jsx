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

// 👉 Admin Login Section (Top)
function AdminLogin({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
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
      toast.error("Username is required for admin registration!");
      return;
    }

    setLoading(true);
    
    const baseUrl = 'https://wristwatch-app-backend.onrender.com';
    const endpoint = `${baseUrl}/api/admin/${isLogin ? 'login' : 'register'}`;

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

        // ✅ ADMIN BACKEND: Returns admin data in response.admin
        const adminData = response.data.admin || {
          id: response.data.data?.admin?.id,
          username: formData.username,
          email: formData.email,
          role: 'admin'
        };

        localStorage.setItem('token', token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userData', JSON.stringify(adminData));
        
        setUser(adminData);
        toast.success(`Admin ${isLogin ? 'login' : 'registration'} successful!`);
        navigate("/admin");
      } else {
        toast.error(response.data.message || "Admin authentication failed");
      }
    } catch (error) {
      console.error('Admin auth error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.statusText;
        
        if (status === 404) {
          toast.error('Admin authentication service unavailable');
        } else if (status === 400 || status === 401) {
          toast.error(message || 'Invalid admin credentials');
        } else if (status === 403) {
          toast.error('Admin access denied');
        } else if (status === 409) {
          toast.error('Admin already exists');
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-red-100">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">🔧</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {isLogin ? "Admin Login" : "Admin Register"}
        </h2>
      </div>

      {!isLogin && (
        <input
          className="block w-full my-2 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500"
          type="text"
          name="username"
          placeholder="Admin username"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
        />
      )}
      
      <input
        className="block w-full my-2 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500"
        type="email"
        name="email"
        placeholder="Admin email"
        value={formData.email}
        onChange={handleChange}
        disabled={loading}
      />
      
      <input
        className="block w-full my-2 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500"
        type="password"
        name="password"
        placeholder="Admin password"
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
      />

      <button
        className="w-full p-3 mt-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading 
          ? `${isLogin ? 'Logging in...' : 'Registering...'}` 
          : `${isLogin ? 'Admin Login' : 'Register Admin'}`
        }
      </button>

      <p className="mt-3 text-center text-gray-600 text-sm">
        {isLogin ? "Need admin access?" : "Already an admin?"}{" "}
        <button
          className="text-red-600 hover:text-red-800 font-medium"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
  );
}

// 👉 User Login Section (Bottom)
function UserLogin({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
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
      toast.error("Username is required for signup!");
      return;
    }

    setLoading(true);
    
    const baseUrl = 'https://wristwatch-app-backend.onrender.com';
    const endpoint = `${baseUrl}/api/auth/${isLogin ? 'login' : 'register'}`;

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
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        const token = response.data.data?.token;
        
        if (!token) {
          toast.error("Authentication failed - no token received");
          return;
        }

        // ✅ USER BACKEND: Only returns token, no user data
        const userData = {
          username: formData.username || formData.email,
          email: formData.email,
          role: 'user'
        };

        localStorage.setItem('token', token);
        localStorage.setItem('userType', 'user');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
        toast.success(`User ${isLogin ? 'login' : 'signup'} successful!`);
        navigate("/accessories");
      } else {
        toast.error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error('User auth error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.statusText;
        
        if (status === 404) {
          toast.error('User authentication service unavailable');
        } else if (status === 400 || status === 401) {
          toast.error(message || 'Invalid credentials');
        } else if (status === 409) {
          toast.error('User already exists');
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">👤</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {isLogin ? "User Login" : "User Signup"}
        </h2>
      </div>

      {!isLogin && (
        <input
          className="block w-full my-2 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          type="text"
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
        />
      )}
      
      <input
        className="block w-full my-2 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        disabled={loading}
      />
      
      <input
        className="block w-full my-2 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
      />

      <button
        className="w-full p-3 mt-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading 
          ? `${isLogin ? 'Logging in...' : 'Creating account...'}` 
          : `${isLogin ? 'User Login' : 'Create Account'}`
        }
      </button>

      <p className="mt-3 text-center text-gray-600 text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign up here" : "Login here"}
        </button>
      </p>
    </div>
  );
}

// 👉 Parent page - UPDATED LAYOUT: All three side by side horizontally
function LoginPage({ setUser }) {
  return (
    <div className="flex justify-center items-center h-screen gap-8 p-5 
                    bg-gradient-to-r from-blue-100 to-pink-100 font-sans">
      {/* Wristwatch section */}
      <CountrySearch />
      
      {/* Admin Login section */}
      <div className="flex-1 max-w-[400px]">
        <AdminLogin setUser={setUser} />
      </div>

      {/* User Login section */}
      <div className="flex-1 max-w-[400px]">
        <UserLogin setUser={setUser} />
      </div>
    </div>
  );
}

export default LoginPage;