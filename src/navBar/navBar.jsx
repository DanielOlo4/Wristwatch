import React from "react"; 
import { Link } from "react-router-dom";
import { Search, ShoppingCart, MapPin, User, LogOut } from "lucide-react";
import logo from "../../public/uploads/Rolex3.jpeg"

function Navbar({ cartCount, onLogout, isLoggedIn }) {
  return (
    <nav className="bg-brand-navy text-white px-8 py-4 sticky top-0 z-50 shadow-2xl bg-gradient-to-r from-[#3D2B1F] to-[#523522] backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LEFT SIDE - Navigation Links */}
        <div className="flex gap-8 items-center">
          <Link 
            to="/international"
            className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20"
          >
            International
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <Link 
            to="/brand"
            className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20"
          >
            Our Brand
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link 
            to="/admin"
            className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20"
          >
            Admin Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* CENTER LOGO */}
        <div className="flex-1 flex justify-center">
          <Link to="/" className="group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <img 
                src={logo} 
                alt="WatchLocker Logo" 
                width={60} 
                className="relative z-10 transform group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
              />
            </div>
          </Link>
        </div>

        {/* RIGHT SIDE - Actions */}
        <div className="flex gap-6 items-center">
          {/* Accessories Link */}
          <Link 
            to="/accessories?openSearch=true" 
            className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-blue-800/20 border border-transparent hover:border-blue-400/30"
          >
            Accessories
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Search Icon */}
          <Link
            to="/accessories?openSearch=true"
            className="p-3 rounded-xl bg-blue-800/30 hover:bg-blue-700/50 border border-blue-600/30 hover:border-blue-500/50 transition-all duration-300 group relative"
            aria-label="Search Watches"
          >
            <Search size={20} className="text-blue-200 group-hover:text-white transform group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Map Icon */}
          <Link 
            to="/map" 
            className="p-3 rounded-xl bg-purple-800/30 hover:bg-purple-700/50 border border-purple-600/30 hover:border-purple-500/50 transition-all duration-300 group relative"
          >
            <MapPin size={20} className="text-purple-200 group-hover:text-white transform group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {isLoggedIn ? (
            <>
              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="relative p-3 rounded-xl bg-amber-800/30 hover:bg-amber-700/50 border border-amber-600/30 hover:border-amber-500/50 transition-all duration-300 group"
              >
                <ShoppingCart size={20} className="text-amber-200 group-hover:text-white transform group-hover:scale-110 transition-transform duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] h-6 flex items-center justify-center shadow-lg border-2 border-gray-900 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-900/30 hover:bg-red-800/50 border border-red-600/30 hover:border-red-500/50 text-red-200 hover:text-white font-semibold transition-all duration-300 group"
              >
                <LogOut size={18} className="transform group-hover:scale-110 transition-transform duration-300" />
                Logout
              </button>
            </>
          ) : (
            /* Login/User */
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800/30 hover:bg-green-700/50 border border-green-600/30 hover:border-green-500/50 text-green-200 hover:text-white font-semibold transition-all duration-300 group"
            >
              <User size={18} className="transform group-hover:scale-110 transition-transform duration-300" />
              User/Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;