import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiMail, FiMapPin, FiFileText, FiShoppingBag } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";

export default function Checkout() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setForm((prev) => ({
        ...prev,
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        street: userProfile.savedAddress?.street || "",
        city: userProfile.savedAddress?.city || "",
        state: userProfile.savedAddress?.state || "",
        pincode: userProfile.savedAddress?.pincode || "",
      }));
    }
  }, [userProfile]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid 10-digit phone number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.street.trim()) errs.street = "Street address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.pincode.trim()) errs.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode))
      errs.pincode = "Enter a valid 6-digit pincode";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const decreaseStock = async () => {
    for (const item of cartItems) {
      try {
        const productRef = doc(db, "products", item.id);
        const snap = await getDoc(productRef);
        if (snap.exists()) {
          const currentStock = snap.data().stock;
          if (currentStock != null) {
            const newStock = Math.max(0, currentStock - item.quantity);
            await updateDoc(productRef, { stock: newStock });
          }
        }
      } catch (err) {
        console.error(`Error updating stock for ${item.name}:`, err);
      }
    }
  };

  const buildWhatsAppMessage = () => {
    let msg = "";
    msg += "🛍️ *NEW ORDER — DB Fashion Nagri*\n";
    msg += "━━━━━━━━━━━━━━━━━━━━\n\n";

    msg += "👤 *Customer Details*\n";
    msg += `• Name: ${form.name}\n`;
    msg += `• Phone: ${form.phone}\n`;
    if (form.email) msg += `• Email: ${form.email}\n`;
    msg += "\n";

    msg += "📍 *Delivery Address*\n";
    msg += `• ${form.street}\n`;
    msg += `• ${form.city}, ${form.state} ${form.pincode}\n\n`;

    msg += "🛒 *Order Items*\n";
    msg += "┌─────────────────────────\n";
    cartItems.forEach((item, i) => {
      msg += `│ ${i + 1}. ${item.name}\n`;
      msg += `│    ID: ${item.id}\n`;
      if (item.category) msg += `│    Category: ${item.category}\n`;
      if (item.selectedSize) msg += `│    Size: ${item.selectedSize}\n`;
      msg += `│    Qty: ${item.quantity} × ₹${item.price.toFixed(2)} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
      if (item.originalPrice && item.originalPrice > item.price) {
        const savings = ((item.originalPrice - item.price) * item.quantity).toFixed(2);
        msg += `│    (Savings: ₹${savings})\n`;
      }
    });
    msg += "└─────────────────────────\n\n";

    msg += "💰 *Order Summary*\n";
    msg += `• Items: ${cartCount}\n`;
    msg += `• Subtotal: ₹${cartTotal.toFixed(2)}\n`;
    msg += `• Shipping: Free\n`;
    msg += `• *Total: ₹${cartTotal.toFixed(2)}*\n\n`;

    if (form.notes.trim()) {
      msg += `📝 *Notes:* ${form.notes}\n\n`;
    }

    msg += "━━━━━━━━━━━━━━━━━━━━\n";
    msg += "Thank you for shopping with EcoStyle! 🌿";

    return encodeURIComponent(msg);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setPlacing(true);

    try {
      // Decrease stock in Firestore
      await decreaseStock();

      // Save order to Firestore if user is logged in
      if (currentUser) {
        await addDoc(collection(db, "orders"), {
          userId: currentUser.uid,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize || null,
            imageUrl: item.imageUrl || (item.images?.length > 0 ? item.images[0] : null)
          })),
          total: cartTotal,
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            pincode: form.pincode
          },
          status: "pending",
          createdAt: new Date().toISOString()
        });
      }

      const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919870963343";
      const message = buildWhatsAppMessage();
      const url = `https://wa.me/${whatsappNumber}?text=${message}`;

      window.open(url, "_blank");
      clearCart();
      navigate("/");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F8F8F4] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <FiShoppingBag className="text-4xl text-green-700" />
          </div>
          <h2 className="text-3xl font-bold mb-3">No Items to Checkout</h2>
          <p className="text-gray-500 mb-8">Add some items to your cart first!</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-green-700 text-white px-8 py-4 rounded-xl hover:bg-green-800 transition font-semibold"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F4] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-500 mb-10">Complete your order and we'll confirm via WhatsApp</p>

        <form onSubmit={handleOrder}>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* Customer Details Form */}
            <div className="space-y-8">
              {/* Personal Info */}
              <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm">
                <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">1</div>
                  Personal Information
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUser className="inline mr-2 text-green-700" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe"
                      className={`w-full border rounded-xl px-4 py-3 outline-none transition ${errors.name ? "border-red-400 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-green-500 bg-white"}`} />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiPhone className="inline mr-2 text-green-700" />
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210"
                      className={`w-full border rounded-xl px-4 py-3 outline-none transition ${errors.phone ? "border-red-400 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-green-500 bg-white"}`} />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div className="mt-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMail className="inline mr-2 text-green-700" />
                      Email
                    </label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@email.com"
                      className={`w-full border rounded-xl px-4 py-3 outline-none transition ${errors.email ? "border-red-400 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-green-500 bg-white"}`} />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm">
                <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">2</div>
                  Delivery Address
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMapPin className="inline mr-2 text-green-700" />
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="123 Main Street, Apartment 4B"
                      className={`w-full border rounded-xl px-4 py-3 outline-none transition ${errors.street ? "border-red-400 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-green-500 bg-white"}`} />
                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                  </div>
                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiMapPin className="inline mr-2 text-green-700" />
                        City <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Mumbai"
                        className={`w-full border rounded-xl px-4 py-3 outline-none transition ${errors.city ? "border-red-400 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-green-500 bg-white"}`} />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiMapPin className="inline mr-2 text-green-700" />
                        State <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Maharashtra"
                        className={`w-full border rounded-xl px-4 py-3 outline-none transition ${errors.state ? "border-red-400 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-green-500 bg-white"}`} />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiMapPin className="inline mr-2 text-green-700" />
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="400001"
                        className={`w-full border rounded-xl px-4 py-3 outline-none transition ${errors.pincode ? "border-red-400 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-green-500 bg-white"}`} />
                      {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">3</div>
                  Order Notes (Optional)
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiFileText className="inline mr-2 text-green-700" />
                    Special Instructions
                  </label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Please deliver before 5pm, gift wrap requested..." rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 bg-white transition resize-none" />
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="h-fit sticky top-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300"><FiShoppingBag /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}{item.selectedSize ? ` • Size: ${item.selectedSize}` : ""}</p>
                      </div>
                      <p className="font-semibold flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-black">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                </div>

                <div className="flex justify-between py-6 text-xl font-bold border-t border-gray-100 mt-4">
                  <span>Total</span>
                  <span className="text-green-700">₹{cartTotal.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={placing}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg shadow-green-200/50 text-lg disabled:opacity-60"
                >
                  {placing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <FaWhatsapp className="text-2xl" />
                      Order via WhatsApp
                    </>
                  )}
                </button>

                <p className="text-center text-gray-400 text-xs mt-4 leading-5">
                  Your order details will be sent via WhatsApp for confirmation. Stock will be updated automatically.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
