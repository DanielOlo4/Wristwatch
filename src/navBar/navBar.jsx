import React from "react"; 
import { Link } from "react-router-dom";
import { Search, ShoppingCart, MapPin, User, LogOut, Menu, X } from "lucide-react";
import logo from "../../public/uploads/DanTechy-watch.jpeg";

function Navbar({ cartCount, onLogout, isLoggedIn }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-brand-navy text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 sticky top-0 z-50 shadow-2xl bg-gradient-to-r from-[#3D2B1F] to-[#523522] backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* MOBILE MENU BUTTON - Visible only on small screens */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-blue-800/30 hover:bg-blue-700/50 border border-blue-600/30 transition-all duration-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* LEFT SIDE - Navigation Links - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex gap-6 xl:gap-8 items-center">
          <Link 
            to="/international"
            className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20 text-sm xl:text-base"
          >
            International
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <Link 
            to="/brand"
            className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20 text-sm xl:text-base"
          >
            Our Brand
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link 
            to="/admin"
            className="relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20 text-sm xl:text-base"
          >
            Admin Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* CENTER LOGO - Adjusts position based on screen size */}
        <div className="flex-1 flex justify-center lg:justify-center">
          <Link to="/" className="group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <img 
                src={logo} 
                alt="WatchLocker Logo" 
                width={50} 
                className="relative z-10 object-cover transform group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl sm:w-12 lg:w-14 xl:w-16"
              />
            </div>
          </Link>
        </div>

        {/* RIGHT SIDE - Actions - Adjusts based on screen size */}
        <div className="flex gap-2 sm:gap-4 lg:gap-6 items-center">
          {/* Accessories Link - Hidden on mobile, visible on tablet+ */}
          <Link 
            to="/accessories?openSearch=true" 
            className="hidden md:block relative group font-medium text-blue-100 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-800/20 border border-transparent hover:border-blue-400/30 text-sm lg:text-base"
          >
            Accessories
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Search Icon - Always visible */}
          <Link
            to="/accessories?openSearch=true"
            className="p-2 sm:p-3 rounded-xl bg-blue-800/30 hover:bg-blue-700/50 border border-blue-600/30 hover:border-blue-500/50 transition-all duration-300 group relative"
            aria-label="Search Watches"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Search size={18} className="sm:w-5 lg:w-5 text-blue-200 group-hover:text-white transform group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Map Icon - Always visible */}
          <Link 
            to="/map" 
            className="p-2 sm:p-3 rounded-xl bg-purple-800/30 hover:bg-purple-700/50 border border-purple-600/30 hover:border-purple-500/50 transition-all duration-300 group relative"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <MapPin size={18} className="sm:w-5 lg:w-5 text-purple-200 group-hover:text-white transform group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {isLoggedIn ? (
            <>
              {/* Cart Icon - Always visible */}
              <Link 
                to="/cart" 
                className="relative p-2 sm:p-3 rounded-xl bg-amber-800/30 hover:bg-amber-700/50 border border-amber-600/30 hover:border-amber-500/50 transition-all duration-300 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart size={18} className="sm:w-5 lg:w-5 text-amber-200 group-hover:text-white transform group-hover:scale-110 transition-transform duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1 sm:px-2 py-0.5 sm:py-1 min-w-[20px] sm:min-w-[24px] h-5 sm:h-6 flex items-center justify-center shadow-lg border-2 border-gray-900 animate-pulse text-[10px] sm:text-xs">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Logout - Text hidden on mobile, icon only */}
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl bg-red-900/30 hover:bg-red-800/50 border border-red-600/30 hover:border-red-500/50 text-red-200 hover:text-white font-semibold transition-all duration-300 group"
              >
                <LogOut size={16} className="sm:w-5 lg:w-5 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline text-sm lg:text-base">Logout</span>
              </button>
            </>
          ) : (
            /* Login/User - Text hidden on mobile, icon only */
            <Link 
              to="/login" 
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl bg-green-800/30 hover:bg-green-700/50 border border-green-600/30 hover:border-green-500/50 text-green-200 hover:text-white font-semibold transition-all duration-300 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={16} className="sm:w-5 lg:w-5 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline text-sm lg:text-base">User/Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE MENU - Slides down when open */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-[#3D2B1F] to-[#523522] border-t border-white/10 shadow-2xl backdrop-blur-lg">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Navigation Links */}
            <Link 
              to="/international"
              className="block w-full text-left px-4 py-3 rounded-xl bg-blue-800/20 hover:bg-blue-700/30 border border-blue-600/20 transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              International
            </Link>
            
            <Link 
              to="/brand"
              className="block w-full text-left px-4 py-3 rounded-xl bg-purple-800/20 hover:bg-purple-700/30 border border-purple-600/20 transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Our Brand
            </Link>

            <Link 
              to="/admin"
              className="block w-full text-left px-4 py-3 rounded-xl bg-purple-800/20 hover:bg-purple-700/30 border border-purple-600/20 transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Dashboard
            </Link>

            {/* Accessories Link for Mobile */}
            <Link 
              to="/accessories?openSearch=true" 
              className="block w-full text-left px-4 py-3 rounded-xl bg-amber-800/20 hover:bg-amber-700/30 border border-amber-600/20 transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accessories
            </Link>

            {/* Additional mobile-only spacing */}
            <div className="pt-2 border-t border-white/10"></div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;