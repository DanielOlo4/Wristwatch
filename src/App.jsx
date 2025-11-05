import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./navBar/navBar";
import LoginPage from "./LoginPage/LoginPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import MapPage from "./pages/MapPage/MapPage";
import CartPage from "./pages/CartPage/CartPage";
import Accessories from "./pages/Accessories";
import International from "./international/internatonal";
import DetailsWatches from "./details/details";
import WomensWatches from "./brand/brand";
import AdminDashboard from "./admin/admin";
import OrderSuccess from './pages/CartPage/OrderSuccess';
import CheckoutPage from './pages/checkout';
import PaymentSuccess from './components/payment.successful';

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <CartProvider user={user}>
      <Router>
        {/* Navbar always visible */}
        <Navbar
          cartCount={cartCount}
          isLoggedIn={!!user}
          onLogout={handleLogout}
        />

        <Routes>
          {/* Default route goes to login/auth */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Auth/Login page */}
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/auth" element={<LoginPage setUser={setUser} />} />

          {/* Protected Accessories page */}
          <Route
            path="/accessories"
            element={user ? <Accessories /> : <Navigate to="/login" />}
          />
          <Route
            path="/international"
            element={user ? <International /> : <Navigate to="/login" />}
          />
          <Route
            path="/watchdetail/:id"
            element={user ? <DetailsWatches /> : <Navigate to="/login" />}
          />
          <Route
            path="/brand"
            element={user ? <WomensWatches /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={user ? <AdminDashboard /> : <Navigate to="/login" />}
          />

          {/* Other pages */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/international" element={<International />} />
          <Route path="/watchdetail/:id" element={<DetailsWatches />} />
          <Route path="/brand" element={<WomensWatches />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          
          {/* NEW ROUTES ADDED */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;