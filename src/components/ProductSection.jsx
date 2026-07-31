import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiStar, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const categories = ["All", "Men", "Women", "Accessories"];

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart, getProductQuantity, updateQuantity } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(8));
        const snap = await getDocs(q);
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="bg-[#F8F8F4] py-10 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:items-center justify-between gap-6 md:flex-row">
          <div>
            <p className="font-medium text-green-700">Featured Collection</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold">Discover Our Best Sellers</h2>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setActiveCategory(item)}
                className={`rounded-full border px-4 md:px-5 py-2 transition text-sm md:text-base ${
                  activeCategory === item
                    ? "bg-green-700 text-white border-green-700"
                    : "hover:bg-green-700 hover:text-white bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 md:mt-14 grid gap-4 md:gap-8 grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl bg-white shadow-md animate-pulse">
                <div className="h-48 md:h-80 bg-gray-200"></div>
                <div className="p-5 md:p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 md:h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 md:mt-14 text-center py-16 md:py-20">
            <p className="text-gray-500 text-base md:text-lg">No products found in this category.</p>
            <p className="text-gray-400 text-xs md:text-sm mt-2">Add products via the Admin Panel.</p>
          </div>
        ) : (
          <div className="mt-10 md:mt-14 grid gap-4 md:gap-8 grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => {
              const isSoldOut = product.stock === 0;
              const cartQty = getProductQuantity(product.id);
              const maxStock = product.stock ?? Infinity;
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className={`overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl ${isSoldOut ? "opacity-75" : ""}`}
                >
                  <Link to={`/product/${product.id}`} className="block relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-48 md:h-80 w-full object-cover" />
                    ) : (
                      <div className="h-48 md:h-80 w-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                        <FiShoppingBag className="text-3xl md:text-5xl text-green-300" />
                      </div>
                    )}

                    <button className="absolute right-3 md:right-4 top-3 md:top-4 rounded-full bg-white p-2 md:p-3 shadow hover:scale-110 transition" onClick={(e) => e.preventDefault()}>
                      <FiHeart />
                    </button>

                    <div className="absolute left-3 md:left-4 top-3 md:top-4 flex flex-col gap-2">
                      {isSoldOut ? (
                        <span className="rounded-full bg-red-600 px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-bold text-white">SOLD OUT</span>
                      ) : (
                        <>
                          {product.category && (
                            <span className="rounded-full bg-green-700 px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-semibold text-white">{product.category}</span>
                          )}
                          {discount > 0 && (
                            <span className="rounded-full bg-yellow-500 px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-bold text-white">{discount}% OFF</span>
                          )}
                        </>
                      )}
                    </div>

                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-white text-xl md:text-2xl font-bold opacity-50 rotate-[-15deg]">SOLD OUT</span>
                      </div>
                    )}
                  </Link>

                  <div className="p-3 md:p-6">
                    <div className="mb-1 md:mb-3 flex text-yellow-500 text-[10px] md:text-base">
                      <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
                    </div>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-sm md:text-xl font-semibold hover:text-green-700 transition line-clamp-1">{product.name}</h3>
                    </Link>

                    <div className="mt-1 md:mt-2 flex items-center gap-1 md:gap-2">
                      <span className="text-base md:text-2xl font-bold text-green-700">₹{product.price?.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] md:text-sm text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    {product.stock != null && !isSoldOut && product.stock <= 5 && (
                      <p className="text-[10px] md:text-xs text-yellow-600 font-semibold mt-1">Only {product.stock} left!</p>
                    )}

                    {/* Quantity Controls or Add to Cart */}
                    {isSoldOut ? (
                      <button disabled className="mt-4 md:mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gray-200 py-2.5 md:py-3 text-sm md:text-base font-semibold text-gray-400 cursor-not-allowed">
                        Sold Out
                      </button>
                    ) : cartQty > 0 ? (
                      <div className="mt-4 md:mt-6 flex items-center justify-between rounded-full border-2 border-green-700 overflow-hidden h-[44px] md:h-[52px]">
                        <button
                          onClick={() => updateQuantity(product.id, cartQty - 1)}
                          className="w-12 h-full flex items-center justify-center text-green-700 hover:bg-green-50 transition"
                        >
                          <FiMinus />
                        </button>
                        <span className="font-bold text-base md:text-lg text-green-700">{cartQty}</span>
                        <button
                          onClick={() => { if (cartQty < maxStock) updateQuantity(product.id, cartQty + 1); }}
                          disabled={cartQty >= maxStock}
                          className="w-12 h-full flex items-center justify-center text-green-700 hover:bg-green-50 transition disabled:opacity-30"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="mt-4 md:mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-700 py-2.5 md:py-3 text-sm md:text-base font-semibold text-white transition hover:bg-green-800"
                      >
                        <FiShoppingBag /> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 md:mt-20 rounded-3xl md:rounded-[36px] bg-gradient-to-r from-green-700 to-green-900 px-6 md:px-10 py-10 md:py-16 text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold">Save up to 50% this Season</h2>
          <p className="mx-auto mt-3 md:mt-4 max-w-2xl text-sm md:text-base text-green-100">
            Shop sustainable fashion with premium quality, ethical sourcing, and fast delivery.
          </p>
          <Link to="/shop" className="mt-6 md:mt-8 inline-block rounded-full bg-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold text-green-700 transition hover:scale-105 shadow-xl shadow-green-900/50">
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
