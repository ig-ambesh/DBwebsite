import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiChevronDown,
  FiTruck,
  FiRotateCcw,
  FiMessageCircle,
} from "react-icons/fi";

import { FaLeaf } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full bg-[#F8F8F4] pt-5 mb-2">

      <div className="mx-auto max-w-[1450px] overflow-hidden rounded-[28px] shadow-lg">

        {/* ================= TOP BAR ================= */}

        <div className="flex items-center justify-between bg-gradient-to-r from-[#16341d] via-[#234728] to-[#16341d] px-8 py-4 text-sm text-white">

          <div className="flex items-center gap-3">

            <span>🔥</span>

            <p className="font-medium">
              Summer Sale is Live!
            </p>

            <span className="text-green-200">
              Up to 50% OFF on Selected Items
            </span>

          </div>

          <div className="hidden lg:flex items-center gap-5">

            <p>Free Shipping on Orders Over $50</p>

            <span className="opacity-40">|</span>

            <button className="hover:text-green-300 duration-300">
              Help & Support
            </button>

          </div>

        </div>

        {/* ================= MAIN NAVBAR ================= */}

        <div className="bg-white px-8 py-6">

          <div className="flex items-center justify-between">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <FaLeaf className="text-3xl text-green-700" />

              <div>

                <h1 className="font-serif text-4xl font-semibold">
                  EcoStyle
                </h1>

                <p className="text-gray-500">
                  Sustainable Fashion
                </p>

              </div>

            </div>

            {/* Navigation */}

            <nav className="hidden xl:flex items-center gap-10 text-[17px]">

              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "relative font-medium text-green-700 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-green-700"
                    : "hover:text-green-700 duration-300"
                }
              >
                Home
              </NavLink>



              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  isActive
                    ? "relative font-medium text-green-700 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-green-700"
                    : "hover:text-green-700 duration-300"
                }
              >
                Shop
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "relative font-medium text-green-700 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-green-700"
                    : "hover:text-green-700 duration-300"
                }
              >
                About Us
              </NavLink>


            </nav>

            {/* Right Side */}

            <div className="flex items-center gap-4">

              {/* Search */}

              <div className="hidden xl:flex items-center gap-3 rounded-full bg-[#F4F5F2] px-6 py-3 w-[330px]">

                <input
                  type="text"
                  placeholder="Search eco-friendly products..."
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                />

                <FiSearch className="text-xl text-gray-600" />

              </div>

              {/* User */}

              {/* <button className="rounded-full p-2 hover:bg-gray-100 duration-300">

                <FiUser size={22} />

              </button> */}

              {/* Wishlist */}

              {/* <button className="rounded-full p-2 hover:bg-gray-100 duration-300">

                <FiHeart size={22} />

              </button> */}

              {/* Cart */}

              <button className="relative rounded-full bg-[#6A9B58] p-4 text-white transition hover:bg-[#4E7B3E]">

                <FiShoppingCart size={24} />

                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-green-700 shadow">

                  0

                </span>

              </button>

            </div>

          </div>

        </div>

        {/* ================= FEATURES ================= */}

        <div className="flex grid-cols-1 justify-around bg-[#EEF3EA] px-10 py-7 md:grid-cols-2 xl:grid-cols-4">

          {/* <div className="flex items-center gap-4">

            <FaLeaf className="text-2xl text-green-700" />

            <div>

              <h3 className="font-semibold">
                Sustainable Materials
              </h3>

              <p className="text-gray-500">
                Eco-friendly & ethical
              </p>

            </div>

          </div> */}

          <div className="flex items-center gap-4">

            <FiTruck className="text-2xl text-green-700" />

            <div>

              <h3 className="font-semibold">
                Free Shipping
              </h3>

              <p className="text-gray-500">
                On orders over $50
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <FiRotateCcw className="text-2xl text-green-700" />

            <div>

              <h3 className="font-semibold">
                Easy Returns
              </h3>

              <p className="text-gray-500">
                30 Days Return Policy
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <FiMessageCircle className="text-2xl text-green-700" />

            <div>

              <h3 className="font-semibold">
                24/7 Support
              </h3>

              <p className="text-gray-500">
                We're here to help
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}