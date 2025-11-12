import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom"
import BulkAddToCart from "../components/BulkAddToCart";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import logo from "../../public/uploads/daniel.jpg"

// Static fallback array
const defaultWatches = [
  {
    _id: "1",
    name: "Rolex Soweto",
    brand: "Rolex",
    type: "Luxury",
    price: 12000,
    description: "Classic diving watch",
    image: "imageCover-2a5af63e-fdc8-482a-8fb7-b52e67c94147.jpeg"
  },
  {
    _id: "2",
    name: "Rolex Submariner",
    brand: "Rolex",
    type: "Luxury",
    description: "A stylish diving watch",
    price: 45000,
    image: "imageCover-89f77bc9-4600-4794-8157-e5117731c584.jpeg"
  },
  {
    _id: "3",
    name: "Knox Submax",
    brand: "Knox",
    type: "Luxury",
    description: "A stylish diving watch",
    price: 45000,
    image: "imageCover-3d39ac00-0fff-49af-b3ed-7189d52840f4.jpeg"
  }
];

function Accessories() {
  const [watches, setWatches] = useState([]);
  const [watch, setWatch] = useState(null);
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);
  const { addToCart } = useCart();

  // Show search if query param present
  useEffect(() => {
    const open = searchParams.get("openSearch") || searchParams.get("search");
    setShowSearch(Boolean(open));
  }, [searchParams]);

  useEffect(() => {
    axios
      .get("https://wristwatch-app-backend.onrender.com/api/watches")
      .then((res) => {
        const data = Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data.watches)
          ? res.data.watches
          : Array.isArray(res.data)
          ? res.data
          : [];

        // If backend returns empty, use default
        if (!data || data.length === 0) {
          setWatches(defaultWatches);
        } else {
          setWatches(data);
        }
      })
      .catch((err) => {
        console.error("⚠️ Backend unreachable, using default watches:", err.message);
        setWatches(defaultWatches);
      });
  }, []);

  // ✅ Fetch a single watch by ID
  useEffect(() => {
    if (!id) return;
    axios
      .get(`https://wristwatch-app-backend.onrender.com/api/watches/${id}`)
      .then((res) => {
        console.log("✅ Single watch response:", res.data);
        const data = res.data.data || res.data;
        setWatch(data);
      })
      .catch(console.error);
  }, [id]);

  // Autofocus the search input when it appears
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showSearch]);

  // Filtering logic
  const filteredWatches = watches.filter((w) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (w.name || "").toLowerCase().includes(q) ||
      (w.brand || "").toLowerCase().includes(q) ||
      (w.type || "").toLowerCase().includes(q) ||
      (w.description || "").toLowerCase().includes(q) ||
      (w.price || "").toString().toLowerCase().includes(q)
    );
  });

  // ✅ Universal getImageUrl function
  const getImageUrl = (watch) => {
    if (watch.imageUrl) return watch.imageUrl;
    if (watch.image) return `https://wristwatch-app-backend.onrender.com/uploads/${watch.image}`;
    return "https://via.placeholder.com/150";
  };

  // ✅ Get images array for a watch
  const getWatchImages = (watch) => {
    if (watch.images && Array.isArray(watch.images) && watch.images.length > 0) {
      return watch.images;
    }
    if (watch.imageUrl) {
      return [watch.imageUrl];
    }
    if (watch.image) {
      return [watch.image];
    }
    return [];
  };

  // ✅ Enhanced add to cart with proper watch data
  const handleAddToCart = async (watch) => {
    try {
      const result = await addToCart(watch._id, 1, {
        _id: watch._id,
        name: watch.name,
        brand: watch.brand,
        price: watch.price,
        image: watch.image,
        imageUrl: watch.imageUrl,
        description: watch.description,
        type: watch.type
      });
      
      if (result.success) {
        toast.success('✅ Added to cart successfully!');
      } else {
        toast.error(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('❌ Failed to add item to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      {/* Elegant Header Section with Watch Background */}
      <div 
        className="text-center mb-8 sm:mb-12 py-32 sm:py-44 rounded-xl sm:rounded-2xl shadow-lg relative overflow-hidden"
        style={{
          backgroundImage: "url('/uploads/Rolex2.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sofia text-white mb-4 drop-shadow-lg">
            DanTechy Luxury Timepieces
          </h1>
          <p className="text-base sm:text-lg text-white max-w-2xl mx-auto drop-shadow-md">
            Discover our exquisite collection of premium wristwatches, crafted with precision and timeless elegance
          </p>
        </div>
      </div>

      {/* 🔍 Search Input */}
      {showSearch && (
        <div className="mb-6 sm:mb-8 flex justify-center px-2">
          <div className="relative w-full max-w-2xl">
            <input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search watches by name, brand, type, description or price..."
              className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-400 text-sm sm:text-base"
              aria-label="Search watches"
            />
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Results Count and Sort */}
      {!id && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 px-2 space-y-2 sm:space-y-0">
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            Showing <span className="text-blue-600 font-bold">{filteredWatches.length}</span> watches
          </p>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-gray-500 text-xs sm:text-sm">Sort by:</span>
            <select className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-full sm:w-auto">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>
      )}

      {/* 🎯 Single watch page */}
      {id && watch ? (
        <div className="max-w-4xl mx-auto px-2">
          <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-300 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center">
              {/* Image Gallery */}
              <div className="flex-1 w-full">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex gap-3 sm:gap-4 justify-start lg:justify-center overflow-x-auto mb-4 pb-2">
                    {getWatchImages(watch).map((img, i) => (
                      <img
                        key={i}
                        src={typeof img === 'string' ? getImageUrl({ imageUrl: img, image: img }) : getImageUrl(watch)}
                        alt={`${watch.name} ${i + 1}`}
                        className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-cover rounded-lg sm:rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Watch Details */}
              <div className="flex-1 w-full space-y-4 sm:space-y-6">
                <div>
                  <span className="inline-block bg-gradient-to-r from-[#3D2B1F] to-[#3D2B1F] text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-sofia mb-2">
                    {watch.brand}
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{watch.name}</h2>
                  <p className="text-base sm:text-lg text-blue-600 font-sofia mb-4">{watch.type}</p>
                </div>
                
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">{watch.description}</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 space-y-4 sm:space-y-0">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">₦{watch.price?.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Including VAT</p>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(watch)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-sm sm:text-base"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 📦 All watches grid */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Product listings */}
          <div className="lg:col-span-3">
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWatches.map((watch, index) => (
                <div
                  key={watch._id || index}
                  className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 border border-gray-100 hover:border-blue-200 hover:transform hover:-translate-y-1 sm:hover:-translate-y-2"
                >
                  {/* Watch Image */}
                  <Link to={`/watchdetail/${watch._id}`}>
                    <div className="relative mb-4 sm:mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer">
                        <div className="flex gap-2 justify-center overflow-x-auto">
                          {getWatchImages(watch).map((img, i) => (
                            <img
                              key={i}
                              src={typeof img === 'string' ? getImageUrl({ imageUrl: img, image: img }) : getImageUrl(watch)}
                              alt={`${watch.name} ${i + 1}`}
                              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover rounded-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500 flex-shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                      {/* Brand Badge */}
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {watch.brand}
                      </div>
                    </div>
                  </Link>

                  {/* Watch Details */}
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl font-sofia text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                      {watch.name}
                    </h3>
                    <p className="text-blue-500 font-semibold text-xs sm:text-sm">{watch.type}</p>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {watch.description}
                    </p>
                    
                    {/* Price and Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 space-y-2 sm:space-y-0">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">₦{watch.price?.toLocaleString()}</p>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleAddToCart(watch)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bulk add sidebar */}
          <div className="lg:col-span-1 mt-4 sm:mt-0">
            <BulkAddToCart watches={filteredWatches} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredWatches.length === 0 && !id && (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No watches found</h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
            {searchTerm ? "Try adjusting your search terms or browse all categories" : "No watches available at the moment"}
          </p>
        </div>
      )}

      {/* Footer Section */}
      <footer className="mt-8 sm:mt-12 bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* About Us */}
            <div>
              <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">ABOUT US</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                DanTechy is your one-stop online watch store for genuine affordable luxury watches from global brands.
              </p>
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
      
            {/* Policy */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">POLICY</h3>
              <ul className="space-y-1 text-gray-300 text-xs sm:text-sm">
                <li>Returns & Refunds</li>
                <li>Terms & Conditions</li>
                <li>Career</li>
              </ul>
            </div>
      
            {/* Store Locations */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">OUR STORES</h3>
              <div className="space-y-2 text-gray-300 text-xs sm:text-sm">
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
              <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">CONTACT US</h3>
              <div className="space-y-1 text-gray-300 text-xs sm:text-sm">
                <p>+2348037262477</p>
                <p>+2348157991888</p>
                <p>dantechy130@gmail.com</p>
              </div>
            </div>
          </div>
      
          {/* Copyright */}
          <div className="border-t border-gray-700 mt-4 sm:mt-6 pt-3 sm:pt-4 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">© 2025 All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Accessories;