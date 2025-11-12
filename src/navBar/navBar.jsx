import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, MapPin, User, LogOut, Menu, X } from "lucide-react";
import logo from "../../public/uploads/DanTechy-watch.jpeg";

function Navbar({ cartCount, onLogout, isLoggedIn }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar - Added max-w-7xl mx-auto and responsive padding */}
      <nav className="bg-brand-navy text-white px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 shadow-2xl bg-gradient-to-r from-[#3D2B1F] to-[#523522] backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* MOBILE MENU BUTTON - Left side */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-3 rounded-xl bg-blue-800/30 hover:bg-blue-700/50 border border-blue-600/30 hover:border-blue-500/50 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-blue-200" />
              ) : (
                <Menu size={20} className="text-blue-200" />
              )}
            </button>
          </div>

          {/* LEFT SIDE - Navigation Links (Hidden on mobile, visible on lg+) */}
          <div className="hidden lg:flex gap-8 items-center">
            <Link 
              to="/international"
              className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20 text-base"
            >
              International
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              to="/brand"
              className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20 text-base"
            >
              Our Brand
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Accessories Link - Now visible on desktop */}
            <Link 
              to="/accessories?openSearch=true" 
              className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20 border border-transparent hover:border-blue-400/30 text-base"
            >
              Accessories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* CENTER LOGO - Adjusts position based on screen size */}
          <div className="lg:flex-1 lg:flex lg:justify-center">
            <Link to="/" className="group" onClick={closeMobileMenu}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <img 
                  src={logo} 
                  alt="WatchLocker Logo" 
                  width={60} 
                  className="relative z-10 object-cover transform group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
                />
              </div>
            </Link>
          </div>

          {/* RIGHT SIDE - Actions */}
          <div className="flex gap-3 sm:gap-4 lg:gap-6 items-center">
            {/* Search Icon - Always visible */}
            <Link
              to="/accessories?openSearch=true"
              className="p-2 sm:p-3 rounded-xl bg-blue-800/30 hover:bg-blue-700/50 border border-blue-600/30 hover:border-blue-500/50 transition-all duration-300 group relative"
              aria-label="Search Watches"
              onClick={closeMobileMenu}
            >
              <Search size={18} className="sm:w-5 sm:h-5 text-blue-200 group-hover:text-white transform group-hover:scale-110 transition-transform duration-300" />
            </Link>

            {/* Map Icon - Always visible */}
            <Link 
              to="/map" 
              className="p-2 sm:p-3 rounded-xl bg-purple-800/30 hover:bg-purple-700/50 border border-purple-600/30 hover:border-purple-500/50 transition-all duration-300 group relative"
              onClick={closeMobileMenu}
            >
              <MapPin size={18} className="sm:w-5 sm:h-5 text-purple-200 group-hover:text-white transform group-hover:scale-110 transition-transform duration-300" />
            </Link>

            {/* CART ICON - ALWAYS VISIBLE */}
            <Link 
              to="/cart" 
              className="relative p-2 sm:p-3 rounded-xl bg-amber-800/30 hover:bg-amber-700/50 border border-amber-600/30 hover:border-amber-500/50 transition-all duration-300 group"
              onClick={closeMobileMenu}
            >
              <ShoppingCart size={18} className="sm:w-5 sm:h-5 text-amber-200 group-hover:text-white transform group-hover:scale-110 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 min-w-[20px] sm:min-w-[24px] h-5 sm:h-6 flex items-center justify-center shadow-lg border-2 border-gray-900 animate-pulse text-[10px] sm:text-xs">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User/Auth Section - Adjusts based on screen size */}
            {isLoggedIn ? (
              <>
                {/* Logout - Text hidden on mobile, visible on sm+ */}
                <button
                  onClick={() => {
                    onLogout();
                    closeMobileMenu();
                  }}
                  className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-red-900/30 hover:bg-red-800/50 border border-red-600/30 hover:border-red-500/50 text-red-200 hover:text-white font-semibold transition-all duration-300 group"
                >
                  <LogOut size={18} className="sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm sm:text-base">Logout</span>
                </button>
                {/* Mobile logout icon only */}
                <button
                  onClick={() => {
                    onLogout();
                    closeMobileMenu();
                  }}
                  className="sm:hidden p-2 sm:p-3 rounded-xl bg-red-900/30 hover:bg-red-800/50 border border-red-600/30 hover:border-red-500/50 text-red-200 hover:text-white transition-all duration-300"
                  aria-label="Logout"
                >
                  <LogOut size={18} className="sm:w-5 sm:h-5" />
                </button>
              </>
            ) : (
              /* Login/User */
              <Link 
                to="/login" 
                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-green-800/30 hover:bg-green-700/50 border border-green-600/30 hover:border-green-500/50 text-green-200 hover:text-white font-semibold transition-all duration-300 group"
                onClick={closeMobileMenu}
              >
                <User size={18} className="sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm sm:text-base">User/Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu}>
          <div className="absolute top-0 left-0 w-80 h-full bg-gradient-to-b from-[#3D2B1F] to-[#523522] shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg bg-red-800/30 hover:bg-red-700/50 border border-red-600/30 text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-4">
              <Link 
                to="/international"
                className="flex items-center gap-3 p-4 rounded-xl bg-blue-800/30 hover:bg-blue-700/50 border border-blue-600/30 text-blue-100 hover:text-white font-medium transition-all duration-300 group"
                onClick={closeMobileMenu}
              >
                <div className="w-1 h-8 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors duration-300"></div>
                International
              </Link>
              
              <Link 
                to="/brand"
                className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/30 hover:bg-purple-700/50 border border-purple-600/30 text-purple-100 hover:text-white font-medium transition-all duration-300 group"
                onClick={closeMobileMenu}
              >
                <div className="w-1 h-8 bg-purple-400 rounded-full group-hover:bg-purple-300 transition-colors duration-300"></div>
                Our Brand
              </Link>

              {/* Accessories Link in Mobile Menu */}
              <Link 
                to="/accessories?openSearch=true" 
                className="flex items-center gap-3 p-4 rounded-xl bg-amber-800/30 hover:bg-amber-700/50 border border-amber-600/30 text-amber-100 hover:text-white font-medium transition-all duration-300 group"
                onClick={closeMobileMenu}
              >
                <div className="w-1 h-8 bg-amber-400 rounded-full group-hover:bg-amber-300 transition-colors duration-300"></div>
                Accessories
              </Link>

              {/* Search Link in Mobile Menu */}
              <Link 
                to="/accessories?openSearch=true"
                className="flex items-center gap-3 p-4 rounded-xl bg-blue-800/30 hover:bg-blue-700/50 border border-blue-600/30 text-blue-100 hover:text-white font-medium transition-all duration-300 group"
                onClick={closeMobileMenu}
              >
                <div className="w-1 h-8 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors duration-300"></div>
                <Search size={20} />
                Search
              </Link>

              {/* Map Link in Mobile Menu */}
              <Link 
                to="/map" 
                className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/30 hover:bg-purple-700/50 border border-purple-600/30 text-purple-100 hover:text-white font-medium transition-all duration-300 group"
                onClick={closeMobileMenu}
              >
                <div className="w-1 h-8 bg-purple-400 rounded-full group-hover:bg-purple-300 transition-colors duration-300"></div>
                <MapPin size={20} />
                Map
              </Link>

              {/* Cart Link in Mobile Menu */}
              <Link 
                to="/cart" 
                className="flex items-center gap-3 p-4 rounded-xl bg-amber-800/30 hover:bg-amber-700/50 border border-amber-600/30 text-amber-100 hover:text-white font-medium transition-all duration-300 group relative"
                onClick={closeMobileMenu}
              >
                <div className="w-1 h-8 bg-amber-400 rounded-full group-hover:bg-amber-300 transition-colors duration-300"></div>
                <ShoppingCart size={20} />
                Cart
                {cartCount > 0 && (
                  <span className="absolute right-4 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] h-6 flex items-center justify-center shadow-lg border-2 border-gray-900">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Admin Dashboard - Now only in mobile menu */}
              <Link 
                to="/admin"
                className="flex items-center gap-3 p-4 rounded-xl bg-pink-800/30 hover:bg-pink-700/50 border border-pink-600/30 text-pink-100 hover:text-white font-medium transition-all duration-300 group"
                onClick={closeMobileMenu}
              >
                <div className="w-1 h-8 bg-pink-400 rounded-full group-hover:bg-pink-300 transition-colors duration-300"></div>
                Admin Dashboard
              </Link>

              {/* Mobile Login/User if not logged in */}
              {!isLoggedIn && (
                <Link 
                  to="/login" 
                  className="flex items-center gap-3 p-4 rounded-xl bg-green-800/30 hover:bg-green-700/50 border border-green-600/30 text-green-100 hover:text-white font-medium transition-all duration-300 group mt-4"
                  onClick={closeMobileMenu}
                >
                  <div className="w-1 h-8 bg-green-400 rounded-full group-hover:bg-green-300 transition-colors duration-300"></div>
                  <User size={20} />
                  User/Login
                </Link>
              )}

              {/* Mobile Logout if logged in */}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    onLogout();
                    closeMobileMenu();
                  }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-800/30 hover:bg-red-700/50 border border-red-600/30 text-red-100 hover:text-white font-medium transition-all duration-300 group mt-4"
                >
                  <div className="w-1 h-8 bg-red-400 rounded-full group-hover:bg-red-300 transition-colors duration-300"></div>
                  <LogOut size={20} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;