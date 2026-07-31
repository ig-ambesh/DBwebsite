import { useState } from "react";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiChevronDown,
  FiTruck,
  FiRotateCcw,
  FiMessageCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { FaLeaf } from "react-icons/fa";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { currentUser, userProfile, loginWithGoogle, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="w-full bg-[#F8F8F4] pt-2 md:pt-2 mb-2 px-2 md:px-0 top-0 z-50">
      <div className="mx-auto max-w-[1450px] overflow-hidden rounded-[20px] md:rounded-[28px] shadow-lg bg-white relative">
        
        {/* ================= TOP BAR ================= */}
        <div className="hidden md:flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#16341d] via-[#234728] to-[#16341d] px-4 md:px-8 py-1.5 md:py-2 text-xs md:text-sm text-white text-center md:text-left gap-2 md:gap-0">
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <span>🔥</span>
            <p className="font-medium">Summer Sale is Live!</p>
            <span className="text-green-200">Up to 50% OFF</span>
          </div>
          <div className="hidden md:flex items-center gap-5">
            <p>Free Shipping on Orders Over ₹500</p>
            <span className="opacity-40">|</span>
            <button className="hover:text-green-300 duration-300">Help & Support</button>
          </div>
        </div>

        {/* ================= MAIN NAVBAR ================= */}
        <div className="px-4 md:px-8 py-3 md:py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 group z-10 flex-shrink-0">
              <div className="p-1.5 md:p-1.5 bg-gradient-to-br from-green-500 to-green-800 rounded-lg md:rounded-xl shadow-lg shadow-green-200/50 group-hover:scale-105 transition-transform duration-300">
                <FaLeaf className="text-xl md:text-2xl text-white" />
              </div>
              <div>
                <h1 className="font-serif text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-800 via-green-600 to-emerald-500 tracking-tight whitespace-nowrap">
                  DB Fashion Nagri
                </h1>
                <p className="hidden md:block text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] mt-0.5">
                  Premium Quality
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold">
              <NavLink to="/" className={({ isActive }) => isActive ? "relative font-medium text-green-700 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-green-700" : "hover:text-green-700 duration-300"}>
                Home
              </NavLink>
              <NavLink to="/shop" className={({ isActive }) => isActive ? "relative font-medium text-green-700 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-green-700" : "hover:text-green-700 duration-300"}>
                Shop
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? "relative font-medium text-green-700 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-green-700" : "hover:text-green-700 duration-300"}>
                About Us
              </NavLink>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-4 relative justify-end flex-1 md:flex-none">
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="flex items-center gap-3 rounded-full bg-gray-50 border border-gray-200 px-4 md:px-5 py-2 md:py-2.5 w-full md:w-[330px] focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100 transition-all">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent outline-none placeholder:text-gray-400 text-sm font-medium"
                />
                <button type="submit" className="text-gray-400 hover:text-green-700 transition">
                  <FiSearch className="text-lg" />
                </button>
              </form>

              {/* User Dropdown / Login (Hidden on mobile) */}
              <div className="hidden md:block">
                {currentUser ? (
                  <div className="relative group">
                    <button className="flex items-center justify-center w-10 h-10 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-green-600 shadow-md shadow-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 bg-white">
                      {userProfile?.photoURL ? (
                        <img src={userProfile.photoURL} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-700 font-bold md:text-lg">
                          {userProfile?.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden transform translate-y-2 group-hover:translate-y-0">
                      <Link to="/profile" className="block px-5 py-3 hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium border-b border-gray-50 transition">
                        My Profile
                      </Link>
                      <button onClick={logout} className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 font-medium transition">
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={loginWithGoogle}
                    className="flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 md:px-6 md:py-2.5 shadow-sm hover:shadow-md hover:border-green-600 hover:text-green-700 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <FiUser className="text-lg" />
                    <span className="hidden md:inline font-bold text-sm">Login</span>
                  </button>
                )}
              </div>

              {/* Cart (Hidden on mobile) */}
              <Link
                to="/cart"
                className="hidden md:flex relative items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 text-white shadow-lg shadow-green-200/50 hover:shadow-green-300/60 transition-all duration-300 transform hover:-translate-y-0.5 group"
              >
                <FiShoppingCart size={18} className="group-hover:scale-110 transition-transform md:text-[20px]" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-red-500 text-white text-[10px] md:text-xs font-bold shadow border-2 border-white animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>


        {/* ================= FEATURES ================= */}
        <div className="flex  sm:grid sm:grid-cols-2 justify-around gap-6 bg-[#EEF3EA] px-6 md:px-10 py-6 md:py-7 xl:grid-cols-4 hidden md:flex">
          <div className="flex items-center gap-4">
            <FiTruck className="text-2xl text-green-700" />
            <div>
              <h3 className="font-semibold text-sm md:text-base">Free Shipping</h3>
              <p className="text-gray-500 text-xs md:text-sm">On orders over ₹500</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FiRotateCcw className="text-2xl text-green-700" />
            <div>
              <h3 className="font-semibold text-sm md:text-base">Easy Returns</h3>
              <p className="text-gray-500 text-xs md:text-sm">30 Days Return Policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FiMessageCircle className="text-2xl text-green-700" />
            <div>
              <h3 className="font-semibold text-sm md:text-base">24/7 Support</h3>
              <p className="text-gray-500 text-xs md:text-sm">We're here to help</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}