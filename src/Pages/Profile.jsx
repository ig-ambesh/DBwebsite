import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMapPin, FiShoppingBag, FiLogOut, FiEdit3 } from "react-icons/fi";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function Profile() {
  const { currentUser, userProfile, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  
  // Details state
  const [phone, setPhone] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);
  
  // Address state
  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "" });
  const [savingAddress, setSavingAddress] = useState(false);
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!currentUser && userProfile === null) {
      // Small timeout to allow auth state to resolve
      const t = setTimeout(() => {
        navigate("/");
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [currentUser, userProfile, navigate]);

  useEffect(() => {
    if (userProfile) {
      setPhone(userProfile.phone || "");
      if (userProfile.savedAddress) {
        setAddress(userProfile.savedAddress);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    if (activeTab === "orders" && currentUser) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const q = query(
            collection(db, "orders"),
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc")
          );
          const snap = await getDocs(q);
          setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
          console.error("Error fetching orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, currentUser]);

  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen bg-[#F8F8F4] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSaveDetails = async () => {
    setSavingDetails(true);
    await updateProfile({ phone });
    setSavingDetails(false);
    alert("Details updated successfully!");
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    await updateProfile({ savedAddress: address });
    setSavingAddress(false);
    alert("Address saved successfully!");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="bg-[#F8F8F4] min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 md:mb-10 bg-white p-6 md:p-8 rounded-3xl shadow-sm text-center md:text-left">
          {userProfile.photoURL ? (
            <img src={userProfile.photoURL} alt="Profile" className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-md border-4 border-white" />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl md:text-3xl shadow-md border-4 border-white">
              {userProfile.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{userProfile.name}</h1>
            <p className="text-gray-500 text-sm md:text-base">{userProfile.email}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            <button
              onClick={() => setActiveTab("details")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-medium transition ${activeTab === "details" ? "bg-green-700 text-white shadow-md" : "bg-white hover:bg-green-50 text-gray-700"}`}
            >
              <FiUser /> My Details
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-medium transition ${activeTab === "address" ? "bg-green-700 text-white shadow-md" : "bg-white hover:bg-green-50 text-gray-700"}`}
            >
              <FiMapPin /> Saved Address
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-medium transition ${activeTab === "orders" ? "bg-green-700 text-white shadow-md" : "bg-white hover:bg-green-50 text-gray-700"}`}
            >
              <FiShoppingBag /> Order History
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-xl font-medium text-red-600 bg-white hover:bg-red-50 transition mt-4"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm min-h-[400px]">
            
            {activeTab === "details" && (
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-6">My Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" value={userProfile.name} disabled className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value={userProfile.email} disabled className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition" />
                  </div>
                  <button onClick={handleSaveDetails} disabled={savingDetails} className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-70 mt-4 flex items-center gap-2">
                    {savingDetails ? "Saving..." : <><FiEdit3 /> Save Details</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-6">Default Shipping Address</h2>
                <p className="text-gray-500 mb-6 text-sm">This address will automatically fill in during checkout.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="123 Main St, Apt 4B" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="Mumbai" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} placeholder="MH" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input type="text" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} placeholder="400001" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition" />
                  </div>
                  <button onClick={handleSaveAddress} disabled={savingAddress} className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-70 mt-4 flex items-center gap-2">
                    {savingAddress ? "Saving..." : <><FiMapPin /> Save Address</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Order History</h2>
                {loadingOrders ? (
                  <div className="py-10 flex justify-center">
                    <div className="w-8 h-8 border-3 border-green-200 border-t-green-700 rounded-full animate-spin"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                    <FiShoppingBag className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-4">
                          <div>
                            <p className="text-sm text-gray-500">Order Placed</p>
                            <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-bold text-green-700">₹{order.total?.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-gray-100 flex-shrink-0">
                                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center"><FiShoppingBag className="text-gray-300" /></div>}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ""}</p>
                              </div>
                              <div className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
