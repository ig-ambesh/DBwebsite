
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiSend,
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-[#16341d] text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-16">

        {/* Newsletter */}
        <div className="mb-10 md:mb-16 rounded-3xl bg-[#214728] p-6 md:p-10">
          <div className="grid items-center gap-6 md:gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold">
                Join Our Newsletter
              </h2>
              <p className="mt-2 md:mt-3 text-sm md:text-base text-green-100">
                Get updates on new arrivals, exclusive offers and sustainable
                fashion tips.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 rounded-2xl sm:rounded-full bg-transparent sm:bg-white p-0 sm:p-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 rounded-xl sm:rounded-full px-5 py-3 sm:py-3 text-black outline-none w-full border-2 sm:border-0 border-white/20 sm:border-transparent bg-white"
              />
              <button className="flex justify-center items-center gap-2 rounded-xl sm:rounded-full bg-green-700 px-6 py-3 sm:py-0 text-white transition hover:bg-green-800 w-full sm:w-auto font-semibold">
                Subscribe
                <FiSend />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <FaLeaf className="text-3xl text-green-400" />
              <div>
                <h3 className="text-3xl font-serif font-bold">EcoStyle</h3>
                <p className="text-green-200">Sustainable Fashion</p>
              </div>
            </div>

            <p className="mt-5 leading-7 text-gray-300">
              Creating timeless fashion with ethical sourcing and eco-friendly
              materials for a greener future.
            </p>

            <div className="mt-6 flex gap-4 text-xl">
              <FiFacebook className="cursor-pointer hover:text-green-400" />
              <FiInstagram className="cursor-pointer hover:text-green-400" />
              <FiTwitter className="cursor-pointer hover:text-green-400" />
              <FiLinkedin className="cursor-pointer hover:text-green-400" />
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-xl font-semibold">Shop</h4>
            <ul className="space-y-3 text-gray-300">
              <li>Men</li>
              <li>Women</li>
              <li>Accessories</li>
              <li>New Arrivals</li>
              <li>Sale</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xl font-semibold">Company</h4>
            <ul className="space-y-3 text-gray-300">
              <li>About Us</li>
              <li>Our Mission</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xl font-semibold">Support</h4>
            <ul className="space-y-3 text-gray-300">
              <li>Help Center</li>
              <li>Shipping</li>
              <li>Returns</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 md:mt-16 border-t border-green-800 pt-6 text-center text-xs md:text-sm text-gray-400">
          © 2026 EcoStyle. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
