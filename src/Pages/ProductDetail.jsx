import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiShoppingBag, FiMinus, FiPlus, FiHeart, FiShare2, FiTruck, FiRotateCcw, FiShield, FiChevronRight } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity, getProductQuantity, updateQuantity, removeFromCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, "products", id));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProduct(data);
          setSelectedImage(0);
          setSelectedSize(null);

          // Fetch related products
          if (data.category) {
            const relQ = query(
              collection(db, "products"),
              where("category", "==", data.category),
              limit(5)
            );
            const relSnap = await getDocs(relQ);
            setRelatedProducts(
              relSnap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter((p) => p.id !== id)
                .slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#F8F8F4] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-green-200 border-t-green-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#F8F8F4] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">Product Not Found</h2>
          <button onClick={() => navigate("/shop")} className="bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition mt-4">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const isSoldOut = product.stock === 0;
  const isLowStock = product.stock != null && product.stock > 0 && product.stock <= 5;
  const maxStock = product.stock ?? Infinity;

  const cartId = selectedSize ? `${product.id}-${selectedSize}` : product.id;
  const cartQty = getItemQuantity(cartId);
  const totalProductQty = getProductQuantity ? getProductQuantity(product.id) : cartQty;
  const maxAllowedToAct = maxStock - (totalProductQty - cartQty);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isSoldOut) return;
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    const productToAdd = selectedSize ? { ...product, selectedSize } : product;
    // We append the size to the ID so that different sizes of the same product count as different cart items
    if (selectedSize) {
      productToAdd.cartId = `${product.id}-${selectedSize}`;
    } else {
      productToAdd.cartId = product.id;
    }
    addToCart(productToAdd, 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-[#F8F8F4] min-h-screen pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl md:px-8 md:py-8">
        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 md:mb-8 whitespace-nowrap overflow-x-auto pb-2 scrollbar-hide">
          <Link to="/" className="hover:text-green-700 transition">Home</Link>
          <FiChevronRight className="text-[10px] md:text-xs" />
          <Link to="/shop" className="hover:text-green-700 transition">Shop</Link>
          <FiChevronRight className="text-[10px] md:text-xs" />
          {product.category && (
            <>
              <span className="hover:text-green-700 transition">{product.category}</span>
              <FiChevronRight className="text-[10px] md:text-xs" />
            </>
          )}
          <span className="text-gray-800 font-medium truncate max-w-[150px] md:max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid md:gap-10 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="md:space-y-4">
            <div className="relative overflow-hidden md:rounded-3xl bg-white md:shadow-sm h-[60vh] md:h-full md:max-h-[600px] w-full">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50">
                  <FiShoppingBag className="text-7xl text-green-300" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isSoldOut && (
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    SOLD OUT
                  </span>
                )}
                {isLowStock && !isSoldOut && (
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Only {product.stock} left!
                  </span>
                )}
                {discount > 0 && !isSoldOut && (
                  <span className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Sold out overlay */}
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold tracking-widest opacity-60 rotate-[-15deg]">SOLD OUT</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto px-4 pt-4 md:px-0 md:pt-0 pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i
                      ? "border-green-700 shadow-lg shadow-green-200/50 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 md:space-y-6 px-4 pt-5 md:px-0 md:pt-0">
            {product.category && (
              <span className="text-xs md:text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">{product.category}</span>
            )}

            <h1 className="text-2xl md:text-4xl font-serif font-bold leading-tight">{product.name}</h1>

            {/* Price */}
            <div className="flex items-end gap-2 md:gap-3">
              <span className="text-xl md:text-3xl font-bold text-green-700">₹{product.price?.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg md:text-xl text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                  <span className="text-xs md:text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Stock Status */}
            {isSoldOut ? (
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                Out of Stock
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                Only {product.stock} left in stock — order soon!
              </div>
            ) : product.stock != null ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                In Stock ({product.stock} available)
              </div>
            ) : null}

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-6 md:leading-7 text-base md:text-lg">{product.description}</p>
            )}

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 md:mb-3 text-base md:text-lg">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((sizeObj) => {
                    const sName = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
                    const sStock = typeof sizeObj === 'string' ? 1 : sizeObj.stock; // If string, assume legacy in-stock
                    const isSizeSoldOut = isSoldOut || sStock === 0;

                    return (
                      <button
                        key={sName}
                        onClick={() => setSelectedSize(sName)}
                        disabled={isSizeSoldOut}
                        className={`w-14 h-14 rounded-xl font-semibold transition-all ${isSizeSoldOut
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed relative overflow-hidden"
                          : selectedSize === sName
                            ? "bg-green-700 text-white shadow-lg shadow-green-200/50 scale-105"
                            : "bg-white border-2 border-gray-200 hover:border-green-700 hover:text-green-700"
                          }`}
                      >
                        {isSizeSoldOut && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[120%] h-[2px] bg-gray-300 rotate-45 absolute"></div>
                          </div>
                        )}
                        {sName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart (Sticky on Mobile) */}
            <div className="fixed bottom-[60px] left-0 w-full bg-white p-4 border-t border-gray-100 z-40 flex gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:static md:bottom-auto md:w-auto md:bg-transparent md:p-0 md:border-none md:shadow-none md:z-auto md:flex-row md:items-center md:gap-4 md:pt-2">
              {cartQty > 0 ? (
                <>
                  <div className="flex w-full sm:w-auto items-center justify-between gap-1 bg-white rounded-xl border-2 border-green-700 overflow-hidden h-[48px] md:h-[56px] px-2">
                    <button
                      onClick={() => updateQuantity(cartId, cartQty - 1)}
                      className="w-10 md:w-12 h-full flex items-center justify-center hover:bg-green-50 transition text-green-700"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-10 md:w-12 text-center font-bold text-base md:text-lg text-green-700">{cartQty}</span>
                    <button
                      onClick={() => {
                        if (cartQty < maxAllowedToAct) updateQuantity(cartId, cartQty + 1);
                      }}
                      disabled={cartQty >= maxAllowedToAct}
                      className="w-10 md:w-12 h-full flex items-center justify-center hover:bg-green-50 transition text-green-700 disabled:opacity-30"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full sm:flex-1 bg-green-700 text-white h-[48px] md:h-[56px] rounded-xl font-bold text-base md:text-lg hover:bg-green-800 transition flex items-center justify-center gap-2"
                  >
                    <FiShoppingBag /> View Cart ({cartQty})
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className={`w-full flex items-center justify-center gap-3 h-[48px] md:h-[56px] rounded-xl font-bold text-base md:text-lg transition-all ${isSoldOut
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : addedFeedback
                      ? "bg-green-100 text-green-700"
                      : "bg-green-700 text-white hover:bg-green-800 shadow-lg shadow-green-200/50"
                    }`}
                >
                  <FiShoppingBag className="text-xl" />
                  {isSoldOut ? "Sold Out" : addedFeedback ? "Added to Cart ✓" : "Add to Cart"}
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:border-green-700 hover:text-green-700 transition bg-white">
                <FiHeart /> Wishlist
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:border-green-700 hover:text-green-700 transition bg-white">
                <FiShare2 /> Share
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {[
                { icon: <FiTruck />, label: "Free Shipping", sub: "On orders over ₹500" },
                { icon: <FiRotateCcw />, label: "Easy Returns", sub: "30 days" },
                { icon: <FiShield />, label: "Secure", sub: "Safe checkout" },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700 mx-auto mb-2">{f.icon}</div>
                  <p className="text-sm font-semibold">{f.label}</p>
                  <p className="text-xs text-gray-400">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 md:mt-20 px-4 md:px-0 border-t border-gray-200 md:border-none pt-8 md:pt-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">You May Also Like</h2>
            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => {
                const pSoldOut = p.stock === 0;
                return (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-lg group"
                  >
                    <div className="relative h-48 md:h-72 overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                          <FiShoppingBag className="text-3xl md:text-4xl text-green-300" />
                        </div>
                      )}
                      {pSoldOut && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">SOLD OUT</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 md:p-5">
                      <h3 className="font-semibold text-sm md:text-base line-clamp-1">{p.name}</h3>
                      <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
                        <span className="text-base md:text-xl font-bold text-green-700">₹{p.price?.toFixed(2)}</span>
                        {p.originalPrice && (
                          <span className="text-[10px] md:text-sm text-gray-400 line-through">₹{p.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
