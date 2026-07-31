import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F8F8F4] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <FiShoppingBag className="text-4xl text-green-700" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Explore our sustainable collection!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-4 rounded-xl hover:bg-green-800 transition font-semibold"
          >
            <FiShoppingBag /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F4] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-green-700 mb-4 transition"
          >
            <FiArrowLeft /> Continue Shopping
          </button>
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <p className="text-gray-500 mt-2">{cartCount} item{cartCount !== 1 ? "s" : ""} in your cart</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const maxStock = item.stock ?? Infinity;
              const atMax = item.quantity >= maxStock;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 hover:shadow-md transition relative"
                >
                  {/* Remove - Absolute on mobile, normal on desktop */}
                  <button
                    onClick={() => removeFromCart((item.cartId || item.id))}
                    className="absolute top-4 right-4 sm:static p-2 text-gray-400 hover:text-red-500 transition sm:order-last"
                  >
                    <FiTrash2 size={18} />
                  </button>

                  {/* Image */}
                  <div className="flex gap-4 w-full sm:w-auto">
                    <Link to={`/product/${item.id}`} className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 block">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <FiShoppingBag size={24} />
                        </div>
                      )}
                    </Link>

                    {/* Details - Moved next to image on mobile */}
                    <div className="flex-1 min-w-0 sm:hidden">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-base font-semibold truncate hover:text-green-700 transition pr-6">{item.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        {item.category && <p className="text-xs text-gray-400">{item.category}</p>}
                        {item.selectedSize && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Size: {item.selectedSize}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg font-bold text-green-700">₹{item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details - Desktop only */}
                  <div className="hidden sm:block flex-1 min-w-0">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-lg font-semibold truncate hover:text-green-700 transition">{item.name}</h3>
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      {item.category && <p className="text-sm text-gray-400">{item.category}</p>}
                      {item.selectedSize && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Size: {item.selectedSize}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xl font-bold text-green-700">₹{item.price?.toFixed(2)}</p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">₹{item.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                    {item.stock != null && item.stock <= 5 && (
                      <p className="text-xs text-yellow-600 font-semibold mt-1">Only {item.stock} in stock</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 border-2 border-green-700 rounded-xl overflow-hidden h-10 md:h-10">
                      <button
                        onClick={() => updateQuantity((item.cartId || item.id), item.quantity - 1)}
                        className="w-10 h-full flex items-center justify-center hover:bg-green-50 transition text-green-700"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-base md:text-lg text-green-700">{item.quantity}</span>
                      <button
                        onClick={() => { if (!atMax) updateQuantity((item.cartId || item.id), item.quantity + 1); }}
                        disabled={atMax}
                        className="w-10 h-full flex items-center justify-center hover:bg-green-50 transition text-green-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right sm:w-28 flex-shrink-0">
                      <p className="text-lg md:text-xl font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm h-fit sticky top-8">
            <h2 className="text-lg md:text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 pb-6 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-semibold text-black">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>

            <div className="flex justify-between py-6 text-xl font-bold">
              <span>Total</span>
              <span className="text-green-700">₹{cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              🌿 Eco-friendly packaging • Free returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
