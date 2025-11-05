import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../public/uploads/Rolex2.jpeg";
import { useCart } from "../context/CartContext"; // Add CartContext import
import toast from "react-hot-toast";

function DetailWatches() {
  const [watches, setWatches] = useState([]);
  const [watch, setWatch] = useState(null);
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all-watches");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const { addToCart } = useCart(); // Add cart functionality

  const categories = {
    "all-watches": "All watches",
    "collectors-corner": "Collector's Corner",
    "classic-watches": "Classic Watches",
    "gift-watches": "Gift watches",
    "sport-watches": "Sport watches",
    "diamond-watches": "Diamond Watches",
    "colorful-watches": "Colorful watches",
    "styled-blue": "Styled in blue",
    "gold-watches": "Gold watches",
    "black-watches": "Black watches",
    "gmt-watches": "GMT watches",
    "power-reserve": "Power reserve",
    "automatic-watches": "Automatic watches",
    "moonphase-watches": "Moonphase watches",
    "chronograph-watches": "Chronograph Watches"
  };

  const collections = [
    "CONQUEST",
    "HERITAGE", 
    "MINI DOLCEVITA",
    "DANTECHY",
    "STC CS3 PM"
  ];

  // Handle add to cart with proper watch data
  const handleAddToCart = async (watch) => {
    try {
      const result = await addToCart(watch._id, 1, {
        name: watch.name,
        brand: watch.brand,
        price: watch.price,
        image: watch.image
      });
      
      if (result.success) {
        toast.success('✅ Added to cart successfully!');
      } else {
        toast.err(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.err('❌ Failed to add item to cart');
    }
  };

  // Show search if query param present
  useEffect(() => {
    const open = searchParams.get("openSearch") || searchParams.get("search");
    setShowSearch(Boolean(open));
  }, [searchParams]);

  // FETCH WATCHES - FIXED FOR YOUR BACKEND STRUCTURE
  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log("🔄 Fetching watches from backend...");
    
    axios
      .get("https://wristwatch-app-backend.onrender.com/api/watches")
      .then((res) => {
        console.log("✅ Backend response:", res.data);
        
        // YOUR BACKEND RETURNS: { success: true, data: watches }
        if (res.data.success && Array.isArray(res.data.data)) {
          console.log(`🎯 Found ${res.data.data.length} watches from backend`);
          
          // Add categories to each watch for filtering
          const watchesWithCategories = res.data.data.map(watch => ({
            ...watch,
            category: generateCategoriesFromWatch(watch)
          }));
          
          setWatches(watchesWithCategories);
        } else {
          console.log("❌ Unexpected response format:", res.data);
          setError("Unexpected response format from server");
          setWatches([]);
        }
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
        setError(`Failed to load watches: ${err.message}`);
        setWatches([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Helper function to generate categories based on watch data
  const generateCategoriesFromWatch = (watch) => {
    const categories = [];
    
    if (watch.type) {
      const typeLower = watch.type.toLowerCase();
      if (typeLower.includes("luxury") || typeLower.includes("classic")) 
        categories.push("classic-watches");
      if (typeLower.includes("sport") || typeLower.includes("chronograph")) 
        categories.push("sport-watches");
      if (typeLower.includes("automatic")) 
        categories.push("automatic-watches");
      if (typeLower.includes("diamond")) 
        categories.push("diamond-watches");
    }
    
    if (watch.brand) {
      const brandLower = watch.brand.toLowerCase();
      if (brandLower.includes("rolex") || brandLower.includes("heritage")) 
        categories.push("classic-watches");
      if (brandLower.includes("elegance")) 
        categories.push("gold-watches");
      if (brandLower.includes("conquest")) 
        categories.push("sport-watches");
    }
    
    if (watch.price > 100000) {
      categories.push("luxury-watches");
    }
    
    // Always include all-watches for basic filtering
    categories.push("all-watches");
    
    return [...new Set(categories)]; // Remove duplicates
  };

  // Fetch a single watch by ID - FIXED FOR YOUR BACKEND
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    axios
      .get(`https://wristwatch-app-backend.onrender.com/api/watches/${id}`)
      .then((res) => {
        console.log("✅ Single watch response:", res.data);
        // Your backend returns: { success: true, data: watch }
        if (res.data.success) {
          setWatch(res.data.data);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching single watch:", err);
        setError("Failed to load watch details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Autofocus the search input when it appears
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showSearch]);

  // Filtering logic that works with your data structure
  const filteredWatches = watches.filter((w) => {
    // Always show all watches if "all-watches" is selected
    if (selectedCategory === "all-watches") {
      if (!searchTerm) return true;
      
      const q = searchTerm.toLowerCase();
      return (
        (w.name || "").toLowerCase().includes(q) ||
        (w.brand || "").toLowerCase().includes(q) ||
        (w.type || "").toLowerCase().includes(q) ||
        (w.description || "").toLowerCase().includes(q) ||
        (w.price || "").toString().toLowerCase().includes(q)
      );
    }
    
    // For specific categories, check if watch has that category
    const hasCategory = w.category && w.category.includes(selectedCategory);
    
    if (!searchTerm) return hasCategory;
    
    if (!hasCategory) return false;
    
    const q = searchTerm.toLowerCase();
    const searchMatch = (
      (w.name || "").toLowerCase().includes(q) ||
      (w.brand || "").toLowerCase().includes(q) ||
      (w.type || "").toLowerCase().includes(q) ||
      (w.description || "").toLowerCase().includes(q) ||
      (w.price || "").toString().toLowerCase().includes(q)
    );
    
    return searchMatch;
  });

  // Enhanced image resolver with better error handling
  const resolveImageSrc = (img) => {
    console.log('Resolving image:', img);
    
    if (!img) {
      console.log('No image provided, using placeholder');
      return "https://via.placeholder.com/300x300/FFE4E6/DC2626?text=No+Image";
    }
    
    if (typeof img !== "string") {
      console.log('Invalid image format, using placeholder');
      return "https://via.placeholder.com/300x300/FFE4E6/DC2626?text=Invalid+Image";
    }
    
    // If it's already a full URL, return as is
    if (img.startsWith("http://") || img.startsWith("https://")) {
      console.log('Full URL detected:', img);
      return img;
    }
    
    // Your backend serves images from /uploads route
    const resolvedUrl = `https://wristwatch-app-backend.onrender.com/uploads/${img}`;
    console.log('Resolved image URL:', resolvedUrl);
    return resolvedUrl;
  };

  // Add image error handler
  const handleImageError = (e, watchName) => {
    console.error(`Image failed to load for watch: ${watchName}`);
    e.target.src = "https://via.placeholder.com/300x300/FFE4E6/DC2626?text=Image+Not+Found";
    e.target.alt = `Image not available for ${watchName}`;
  };

  console.log("📦 Current watches:", watches);
  console.log("🔎 Filtered watches:", filteredWatches);
  console.log("⏳ Loading:", loading);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Elegant Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-10">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3D2B1F] to-[#523522] bg-clip-text text-transparent">
                DanTechy
              </h1>
              <nav className="hidden md:flex space-x-8">
                <Link 
                  to="/womens-watches" 
                  className="text-gray-700 hover:text-[#3D2B1F] font-semibold transition-colors duration-300 relative group"
                >
                  All Watches
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3D2B1F] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/our-universe" 
                  className="text-gray-700 hover:text-[#3D2B1F] font-semibold transition-colors duration-300 relative group"
                >
                  Our Universe
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3D2B1F] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>
            </div>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search luxury watches..."
                className="pl-12 pr-6 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#3D2B1F] focus:border-[#523522] focus:outline-none transition-all duration-300 w-80 bg-white/90 backdrop-blur-sm shadow-lg group-hover:shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#3D2B1F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Luxury Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-pink-100 p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#3D2B1F] to-[#523522] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-lg">⌚</span>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#3D2B1F] to-[#523522] bg-clip-text text-transparent">Categories</h2>
              </div>
              
              {/* Main Categories */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">DANTECHY WATCHES</h3>
                  <div className="space-y-2 ml-2">
                    <button
                      onClick={() => setSelectedCategory("all-watches")}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium ${
                        selectedCategory === "all-watches"
                          ? "bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white shadow-lg transform -translate-y-0.5"
                          : "text-gray-700 hover:bg-[#3D2B1F] hover:text-white border border-transparent hover:border-[#523522]"
                      }`}
                    >
                      ✨ All watches
                    </button>
                    <button
                      onClick={() => setSelectedCategory("collectors-corner")}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium ${
                        selectedCategory === "collectors-corner"
                          ? "bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white shadow-lg transform -translate-y-0.5"
                          : "text-gray-700 hover:bg-[#3D2B1F] hover:text-white border border-transparent hover:border-[#523522]"
                      }`}
                    >
                      💎 Collector's Corner
                    </button>
                  </div>
                </div>

                {/* Master Collection Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 bg-gradient-to-r from-[#3D2B1F] to-[#523522] px-3 py-2 rounded-lg">
                    MASTER COLLECTIONS
                  </h3>
                  <nav className="space-y-2 ml-2">
                    {["classic-watches", "gift-watches", "sport-watches", "diamond-watches"].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white shadow-lg transform -translate-y-0.5"
                            : "text-gray-700 hover:bg-[#3D2B1F] hover:text-white border border-transparent hover:border-[#523522]"
                        }`}
                      >
                        {category === "classic-watches" && "👑 "}
                        {category === "gift-watches" && "🎁 "}
                        {category === "sport-watches" && "⚡ "}
                        {category === "diamond-watches" && "💎 "}
                        {categories[category]}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Colorful Watches Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 bg-gradient-to-r from-[#3D2B1F] to-[#523522] px-3 py-2 rounded-lg">
                    Colorful Collection
                  </h3>
                  <nav className="space-y-2 ml-2">
                    {["styled-blue", "gold-watches", "black-watches"].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white shadow-lg transform -translate-y-0.5"
                            : "text-gray-700 hover:bg-[#3D2B1F] hover:text-white border border-transparent hover:border-[#523522]"
                        }`}
                      >
                        {category === "styled-blue" && "🔵 "}
                        {category === "gold-watches" && "🟡 "}
                        {category === "black-watches" && "⚫ "}
                        {categories[category]}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Technical Watches Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 bg-gradient-to-r from-[#3D2B1F] to-[#523522] px-3 py-2 rounded-lg">
                    Technical Mastery
                  </h3>
                  <nav className="space-y-2 ml-2">
                    {["power-reserve", "automatic-watches", "moonphase-watches", "chronograph-watches"].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white shadow-lg transform -translate-y-0.5"
                            : "text-gray-700 hover:bg-[#3D2B1F] hover:text-white border border-transparent hover:border-[#523522]"
                        }`}
                      >
                        {category === "power-reserve" && "🔋 "}
                        {category === "automatic-watches" && "⚙️ "}
                        {category === "moonphase-watches" && "🌙 "}
                        {category === "chronograph-watches" && "⏱️ "}
                        {categories[category]}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Status Info */}
              <div className="border-t border-pink-200 pt-6 mt-6">
                <div className="text-xs space-y-2">
                  <div className="font-semibold text-gray-500 uppercase tracking-wider mb-2">Collection Status</div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Pieces:</span>
                    <span className="font-bold text-[#3D2B1F]">{watches.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Displaying:</span>
                    <span className="font-bold text-[#3D2B1F]">{filteredWatches.length}</span>
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
                      <div className="text-green-600 text-xs font-medium">⚠️ {error}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Elegant Page Header with Background Image */}
            <div className="mb-12 text-center relative py-24 rounded-2xl overflow-hidden shadow-2xl">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${logo})`,
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              
              {/* Content positioned absolutely over the background */}
              <div className="relative z-10">
                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  DanTechy Luxury Watches
                </h1>
                <h2 className="text-2xl font-semibold text-white mb-6 drop-shadow-md">{categories[selectedCategory]}</h2>
                <div className="w-32 h-1.5 bg-white rounded-full mx-auto shadow-lg"></div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-800">Connection Issue</h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#3D2B1F] border-t-[#523522] mb-4"></div>
                <p className="text-lg text-gray-600 font-semibold">Loading Luxury Collection...</p>
                <p className="text-sm text-gray-500 mt-2">Discovering exquisite timepieces</p>
              </div>
            )}

            {/* Results Count */}
            {!loading && !error && (
              <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
                <p className="text-gray-700 font-semibold">
                  Showing <span className="text-[#3D2B1F] font-bold text-lg">{filteredWatches.length}</span> of{" "}
                  <span className="text-gray-900 font-bold">{watches.length}</span> luxury pieces
                </p>
                <div className="flex items-center space-x-4">
                  <select className="bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-[#3D2B1F] focus:border-[#523522] focus:outline-none shadow-sm font-medium">
                    <option>✨ Featured Collection</option>
                    <option>💰 Price: Low to High</option>
                    <option>💎 Price: High to Low</option>
                    <option>🆕 Newest Arrivals</option>
                  </select>
                </div>
              </div>
            )}

            {/* Single Watch View */}
            {!loading && id && watch ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 border border-pink-100">
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                    {/* Image Gallery */}
                    <div className="flex-1">
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 shadow-inner">
                        <img
                          src={resolveImageSrc(watch.image)}
                          alt={watch.name}
                          className="w-64 h-64 object-cover rounded-xl shadow-2xl mx-auto hover:scale-105 transition-transform duration-500"
                          onError={(e) => handleImageError(e, watch.name)}
                        />
                      </div>
                    </div>
                    
                    {/* Watch Details */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <span className="inline-block bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white px-4 py-1.5 rounded-full text-sm font-bold mb-3 shadow-lg">
                          {watch.brand}
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{watch.name}</h2>
                        <p className="text-lg text-[#3D2B1F] font-semibold">{watch.type}</p>
                      </div>
                      
                      <p className="text-gray-600 text-lg leading-relaxed">{watch.description}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-pink-200">
                        <div>
                          <p className="text-3xl font-bold text-gray-900">₦{watch.price?.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Premium Luxury Piece</p>
                        </div>
                        {/* FIXED: Changed from Link to actual button with addToCart functionality */}
                        <button 
                          onClick={() => handleAddToCart(watch)}
                          className="bg-gradient-to-r from-[#3D2B1F] to-[#523522] hover:from-[#523522] hover:to-[#3D2B1F] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Add to Collection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Luxury Watch Grid */
              !loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredWatches.length > 0 ? (
                    filteredWatches.map((watch) => (
                      <div
                        key={watch._id}
                        className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-pink-100 hover:border-[#523522] hover:transform hover:-translate-y-2"
                      >
                        {/* Watch Image */}
                        <div className="relative mb-6">
                          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 shadow-inner">
                            <img
                              src={resolveImageSrc(watch.image)}
                              alt={watch.name}
                              className="w-48 h-48 object-cover rounded-lg mx-auto group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => handleImageError(e, watch.name)}
                            />
                          </div>
                          {/* Premium Badge */}
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {watch.brand}
                          </div>
                        </div>

                        {/* Watch Details */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#3D2B1F] transition-colors duration-300 line-clamp-1">
                            {watch.name}
                          </h3>
                          <p className="text-[#3D2B1F] font-semibold text-sm">{watch.type}</p>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {watch.description}
                          </p>
                          
                          {/* Price and Action */}
                          <div className="flex items-center justify-between pt-4 border-t border-pink-100">
                            <div>
                              <p className="text-2xl font-bold text-gray-900">₦{watch.price?.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">Luxury Investment</p>
                            </div>
                            <Link 
                              to={`/watches/${watch._id}`}
                              className="bg-gradient-to-r from-[#3D2B1F] to-[#523522] hover:from-[#523522] hover:to-[#3D2B1F] text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    !error && (
                      <div className="col-span-3 text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="text-3xl text-[#3D2B1F]">💎</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {watches.length === 0 ? "Collection Empty" : "No Matching Pieces"}
                        </h3>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">
                          {watches.length === 0 
                            ? "Our luxury collection is being curated. Check back soon for exquisite timepieces." 
                            : "Adjust your search criteria to discover our luxury collection."}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )
            )}

            {/* Load More Button */}
            {!loading && filteredWatches.length > 0 && !id && (
              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-[#3D2B1F] to-[#523522] hover:from-[#523522] hover:to-[#3D2B1F] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                  Load More Luxury Pieces
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
<footer className="mt-12 bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white rounded-2xl p-6">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* About Us */}
      <div>
        <h3 className="text-base font-bold mb-3">ABOUT US</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          DanTechy is your one-stop online watch store for genuine affordable luxury watches from global brands.
        </p>
      </div>

      {/* Policy */}
      <div>
        <h3 className="text-base font-semibold mb-3">POLICY</h3>
        <ul className="space-y-1 text-gray-300 text-sm">
          <li>Returns & Refunds</li>
          <li>Terms & Conditions</li>
          <li>Career</li>
        </ul>
      </div>

      {/* Store Locations */}
      <div>
        <h3 className="text-base font-semibold mb-3">OUR STORES</h3>
        <div className="space-y-2 text-gray-300 text-sm">
          <div>
            <p className="font-medium">Main Office:</p>
            <p>15, Awoyaya Shopping Complex, Eti-Osa, Lagos.</p>
          </div>
          <div>
            <p className="font-medium">Ipaja Store:</p>
            <p>Ipaja Market Plaza, Ayobo Road, Lagos</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-base font-semibold mb-3">CONTACT US</h3>
        <div className="space-y-1 text-gray-300 text-sm">
          <p>+2348037262477</p>
          <p>+2348157991888</p>
          <p>dantechy130@gmail.com</p>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t border-gray-700 mt-6 pt-4 text-center">
      <p className="text-gray-400 text-sm">© 2025 All Rights Reserved.</p>
    </div>
  </div>
</footer>
    </div>
  );
}

export default DetailWatches;