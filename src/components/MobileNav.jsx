import { Link, useLocation } from "react-router-dom";
import { FiHome, FiShoppingBag, FiShoppingCart, FiUser } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function MobileNav() {
  const location = useLocation();
  const { cartCount } = useCart();
  const { currentUser, userProfile, loginWithGoogle } = useAuth();

  const profileIcon = userProfile?.photoURL ? (
    <img src={userProfile.photoURL} alt="Profile" className="w-[22px] h-[22px] rounded-full object-cover border border-green-200" />
  ) : userProfile?.name ? (
    <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-700 font-bold text-[10px] border border-green-300">
      {userProfile.name.charAt(0)}
    </div>
  ) : (
    <FiUser size={22} />
  );

  const navItems = [
    { name: "Home", path: "/", icon: <FiHome size={22} /> },
    { name: "Shop", path: "/shop", icon: <FiShoppingBag size={22} /> },
    { name: "Cart", path: "/cart", icon: <FiShoppingCart size={22} />, badge: cartCount },
    currentUser 
      ? { name: "Profile", path: "/profile", icon: profileIcon }
      : { name: "Login", isAction: true, onClick: loginWithGoogle, icon: <FiUser size={22} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-2 pb-safe-offset-2 pt-2">
        {navItems.map((item) => {
          const isActive = item.path && (location.pathname === item.path || 
                           (item.path !== "/" && location.pathname.startsWith(item.path)));
          
          const commonClasses = `relative flex flex-col items-center p-2 w-16 transition-colors ${
            isActive ? "text-green-700" : "text-gray-400 hover:text-gray-600"
          }`;

          const innerContent = (
            <>
              <div className="relative">
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? "font-bold" : ""}`}>
                {item.name}
              </span>
            </>
          );

          if (item.isAction) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className={commonClasses}
              >
                {innerContent}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={commonClasses}
            >
              {innerContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
