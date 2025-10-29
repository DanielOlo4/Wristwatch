import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// 👉 CountrySearch (left side)
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

// 👉 AuthPage (right side)
function AuthPage({ setUser }) {
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
    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required!");
      return;
    }

    if (!isLogin && !formData.username) {
      toast.error("Username is required for signup!");
      return;
    }

    setLoading(true);
    
    try {
      let endpoint = '';
      let requestData = {};

      // ✅ FIXED: Correct endpoints based on your backend routes
      if (userType === "admin") {
        endpoint = isLogin 
          ? 'https://wristwatch-app-backend.onrender.com/api/admin/login'  // Your actual admin login route
          : 'https://wristwatch-app-backend.onrender.com/api/admin/register'; // Your actual admin register route
      } else {
        endpoint = isLogin 
          ? 'https://wristwatch-app-backend.onrender.com/api/auth/login'    // Your actual user login route
          : 'https://wristwatch-app-backend.onrender.com/api/auth/register'; // Your actual user register route
      }

      // Prepare request data
      if (isLogin) {
        requestData = {
          email: formData.email,
          password: formData.password
        };
      } else {
        requestData = {
          username: formData.username,
          email: formData.email,
          password: formData.password
        };
      }

      console.log(`Making ${isLogin ? 'login' : 'signup'} request to:`, endpoint);
      console.log('Request data:', requestData);

      const response = await axios.post(endpoint, requestData);

      console.log('Response received:', response.data);

      if (response.data.success) {
        // Store token and user info
        const token = response.data.token || response.data.data?.token;
        
        if (!token) {
          toast.error("No token received");
          return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        
        // Store user data based on type
        if (userType === 'admin') {
          const adminData = response.data.admin || response.data.data?.admin;
          localStorage.setItem('userData', JSON.stringify(adminData));
          setUser(adminData);
        } else {
          const userData = response.data.data?.user || { 
            username: formData.username || formData.email,
            email: formData.email,
            role: 'user'
          };
          localStorage.setItem('userData', JSON.stringify(userData));
          setUser(userData);
        }

        // Show success message
        toast.success(`${userType === 'admin' ? 'Admin' : 'User'} ${isLogin ? 'login' : 'signup'} successful!`);

        // Redirect based on user type
        if (userType === 'admin') {
          navigate("/admin ");
        } else {
          navigate("/accessories");
        }
      } else {
        toast.error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          `${isLogin ? 'Login' : 'Signup'} failed`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset form when switching between login/signup or user types
  useEffect(() => {
    setFormData({ username: "", email: "", password: "" });
  }, [isLogin, userType]);

  return (
    <div className="flex-1 max-w-[400px] text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        {/* User Type Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">I am a:</h2>
          <div className="flex gap-4 justify-center">
            <button
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                userType === "user" 
                  ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold" 
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
              onClick={() => setUserType("user")}
            >
              👤 User
            </button>
            <button
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                userType === "admin" 
                  ? "border-red-500 bg-red-50 text-red-600 font-semibold" 
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
              onClick={() => setUserType("admin")}
            >
              🔧 Admin
            </button>
          </div>
        </div>

        <h1 className="mb-5 text-2xl font-bold text-gray-800">
          {userType === "admin" ? "🔧" : "🔑"} {isLogin ? "Login" : "Signup"} as {userType}
        </h1>

        {!isLogin && (
          <input
            className="block w-full my-3 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
        )}
        
        <input
          className="block w-full my-3 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        
        <input
          className="block w-full my-3 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />

        <button
          className={`w-full p-3 mt-3 rounded-lg text-white text-lg font-semibold transition disabled:opacity-50 ${
            userType === "admin" 
              ? "bg-red-600 hover:bg-red-700" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading 
            ? `${isLogin ? 'Logging in...' : 'Signing up...'}` 
            : `${isLogin ? 'Login' : 'Signup'} as ${userType}`
          }
        </button>

        <p className="mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className={`cursor-pointer hover:underline font-medium ${
              userType === "admin" ? "text-red-600" : "text-blue-600"
            }`}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
}

// 👉 Parent page
function LoginPage({ setUser }) {
  return (
    <div className="flex justify-center items-center h-screen gap-8 p-5 
                    bg-gradient-to-r from-blue-100 to-pink-100 font-sans">
      <CountrySearch />
      <AuthPage setUser={setUser} />
    </div>
  );
}

export default LoginPage;