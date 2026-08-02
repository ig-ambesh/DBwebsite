import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProductSection from './components/ProductSection'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'
import { Routes, Route, useLocation } from "react-router-dom"
import Shop from './Pages/Shop'
import AboutUs from './Pages/AboutUs'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import ProductDetail from './Pages/ProductDetail'
import AdminLogin from './Pages/AdminLogin'
import AdminPanel from './Pages/AdminPanel'
import Profile from './Pages/Profile'
import Maintenance from './Pages/Maintenance'
import { useSettings } from './context/SettingsContext'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const isAdmin = sessionStorage.getItem("ecostyle_admin") === "true";
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { maintenanceMode, loading } = useSettings();

  // Admin routes render without Navbar/Footer
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        } />
      </Routes>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F4]">
        <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (maintenanceMode) {
    return <Maintenance />;
  }

  return (
    <div className="pb-16 md:pb-0">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <ProductSection />
          </>
        } />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default App
