import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom"

// Static fallback array
const defaultWatches = [
  {
    name: "Rolex Soweto",
    brand: "Rolex",
    type: "Luxury",
    price: 12000,
    description: "Classic diving watch",
    image: "imageCover-2a5af63e-fdc8-482a-8fb7-b52e67c94147.jpeg"
  },
  {
    name: "Rolex Submariner",
    brand: "Rolex",
    type: "Luxury",
    description: "A stylish diving watch",
    price: 45000,
    image: "imageCover-89f77bc9-4600-4794-8157-e5117731c584.jpeg"
  },
  {
    name: "Knox Submax",
    brand: "Knox",
    type: "Luxury",
    description: "A stylish diving watch",
    price: 45000,
    image: "imageCover-3d39ac00-0fff-49af-b3ed-7189d52840f4.jpeg"
  },
  {
    name: "Rolex Soweto",
    brand: "Rolex",
    type: "Luxury",
    price: 12000,
    description: "Classic diving watch",
    image: "imageCover-2a5af63e-fdc8-482a-8fb7-b52e67c94147.jpeg"
  },
  {
    name: "Rolex Submariner",
    brand: "Rolex",
    type: "Luxury",
    description: "A stylish diving watch",
    price: 45000,
    image: "imageCover-89f77bc9-4600-4794-8157-e5117731c584.jpeg"
  },
  
  {
    name: "Knox Submax",
    brand: "Knox",
    type: "Luxury",
    description: "A stylish diving watch",
    price: 45000,
    image: "imageCover-3d39ac00-0fff-49af-b3ed-7189d52840f4.jpeg"
  },
  {
    name: "Rolex Soweto",
    brand: "Rolex",
    type: "Luxury",
    price: 12000,
    description: "Classic diving watch",
    image: "imageCover-2a5af63e-fdc8-482a-8fb7-b52e67c94147.jpeg"
  },
  {
    name: "Rolex Submariner",
    brand: "Rolex",
    type: "Luxury",
    description: "A stylish diving watch",
    price: 45000,
    image: "imageCover-89f77bc9-4600-4794-8157-e5117731c584.jpeg"
  },
  {
    name: "Knox Submax",
    brand: "Knox",
    type: "Luxury",
    description: "A stylish diving watch",
    price: 45000,
    image: "imageCover-3d39ac00-0fff-49af-b3ed-7189d52840f4.jpeg"
  },
  
];


function Accessories() {
  const [watches, setWatches] = useState([]);
  const [watch, setWatch] = useState(null);
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  // // Show search if query param present
  useEffect(() => {
    const open = searchParams.get("openSearch") || searchParams.get("search");
    setShowSearch(Boolean(open));
  }, [searchParams]);

 useEffect(() => {
  axios
    .get("http://localhost:5000/api/watches")
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
      .get(`http://localhost:5000/api/watches/${id}`)
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

  // Helper for images
  const resolveImageSrc = (img) => {
    if (!img) return "https://via.placeholder.com/150";
    if (typeof img !== "string") return "https://via.placeholder.com/150";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `http://localhost:5000${img.startsWith("/") ? img : `/uploads/${img}`}`;
  };

  // 🧩 Added console logs here
  console.log("📦 Watches before render:", watches);
  console.log("🔎 Filtered watches:", filteredWatches);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Elegant Header Section with Watch Background */}
      <div 
        className="text-center mb-12 py-36 rounded-2xl shadow-lg relative overflow-hidden"
        style={{
          backgroundImage: "url('/uploads/Rolex2.jpeg')",
          backgroundSize: '100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            DanTechy Luxury Timepieces
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto drop-shadow-md">
            Discover our exquisite collection of premium wristwatches, crafted with precision and timeless elegance
          </p>
        </div>
      </div>

      {/* 🔍 Search Input */}
      {showSearch && (
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search watches by name, brand, type, description or price..."
              className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-400"
              aria-label="Search watches"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      {!id && (
        <div className="flex justify-between items-center mb-8 px-4">
          <p className="text-gray-600 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredWatches.length}</span> watches
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">Sort by:</span>
            <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Image Gallery */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex gap-4 justify-center overflow-x-auto mb-4">
                    {(watch.images || [watch.image] || []).map((img, i) => (
                      <img
                        key={i}
                        src={resolveImageSrc(img)}
                        alt={`${watch.name} ${i + 1}`}
                        className="w-48 h-48 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Watch Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-2">
                    {watch.brand}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{watch.name}</h2>
                  <p className="text-lg text-blue-600 font-semibold mb-4">{watch.type}</p>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed">{watch.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">${watch.price?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Including VAT</p>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 📦 All watches grid */
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredWatches.map((watch, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-blue-200 hover:transform hover:-translate-y-2"
            >
              {/* Watch Image */}
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                  <div className="flex gap-2 justify-center overflow-x-auto">
                    {(watch.images || [watch.image] || []).map((img, i) => (
                      <img
                        key={i}
                        src={resolveImageSrc(img)}
                        alt={`${watch.name} ${i + 1}`}
                        className="w-32 h-32 object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                      />
                    ))}
                  </div>
                </div>
                {/* Brand Badge */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {watch.brand}
                </div>
              </div>

              {/* Watch Details */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                  {watch.name}
                </h3>
                <p className="text-blue-500 font-semibold text-sm">{watch.type}</p>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {watch.description}
                </p>
                
                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">${watch.price?.toLocaleString()}</p>
                  <Link 
                    to={`/watchdetail/${watch._id}`}
                    className="bg-gradient-to-r from-[#3D2B1F] to-[#523522] hover:to-purple-600 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredWatches.length === 0 && !id && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No watches found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchTerm ? "Try adjusting your search terms or browse all categories" : "No watches available at the moment"}
          </p>
        </div>
      )}

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

export default Accessories;