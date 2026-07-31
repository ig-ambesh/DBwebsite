import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiLogOut,
  FiPackage, FiImage, FiSave, FiX, FiUpload, FiGrid, FiAlertTriangle,
} from "react-icons/fi";
import { db, storage } from "../firebase";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  
  // Product States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", price: "", originalPrice: "", description: "", category: "Men",
    stock: "", sizes: [], images: [""],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Banner States
  const [banners, setBanners] = useState([]);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: "", badge: "", desc: "", btn: "", productId: ""
  });
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("ecostyle_admin") !== "true") {
      navigate("/admin/login");
      return;
    }
    fetchProducts();
    fetchBanners();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      const q = query(collection(db, "heroBanners"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setBanners(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  };

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setImageFiles((prev) => [...prev, ...files]);
      setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    }
  };

  const removeImagePreview = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    const fileName = `products/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const resetForm = () => {
    setForm({
      name: "", price: "", originalPrice: "", description: "", category: "Men",
      stock: "", sizes: [], images: [""],
    });
    setImageFiles([]);
    setImagePreviews([]);
    setEditingId(null);
    setShowForm(false);
  };

  const addImageUrlField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  const updateImageUrl = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
  };

  const removeImageUrl = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const toggleSize = (size) => {
    setForm((prev) => {
      const exists = prev.sizes.find(s => (typeof s === 'string' ? s : s.size) === size);
      if (exists) {
        return { ...prev, sizes: prev.sizes.filter(s => (typeof s === 'string' ? s : s.size) !== size) };
      } else {
        return { ...prev, sizes: [...prev.sizes, { size, stock: 0 }] };
      }
    });
  };

  const updateSizeStock = (size, stockStr) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => {
        const sName = typeof s === 'string' ? s : s.size;
        return sName === size ? { size: sName, stock: stockStr === "" ? "" : parseInt(stockStr) || 0 } : (typeof s === 'string' ? { size: s, stock: 0 } : s);
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Gather all image URLs
      let allImages = form.images.filter((url) => url.trim() !== "");

      // Upload new files
      if (imageFiles.length > 0) {
        setUploading(true);
        const uploadPromises = imageFiles.map((file) => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        allImages = [...allImages, ...uploadedUrls];
        setUploading(false);
      }

      // Calculate total stock if sizes exist
      let totalStock = form.stock !== "" ? parseInt(form.stock) : null;
      if (form.sizes.length > 0) {
        totalStock = form.sizes.reduce((sum, s) => sum + (parseInt(s.stock) || 0), 0);
      }

      // Ensure sizes are objects before saving
      const formattedSizes = form.sizes.map(s => typeof s === 'string' ? { size: s, stock: 0 } : s);

      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        description: form.description,
        category: form.category,
        stock: totalStock,
        sizes: formattedSizes,
        images: allImages,
        imageUrl: allImages[0] || "",
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), {
          ...productData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    const mappedSizes = (product.sizes || []).map(s => typeof s === 'string' ? { size: s, stock: 0 } : s);
    setForm({
      name: product.name,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      description: product.description || "",
      category: product.category || "Men",
      stock: product.stock != null ? String(product.stock) : "",
      sizes: mappedSizes,
      images: product.images?.length ? product.images : [product.imageUrl || ""],
    });
    setImagePreviews([]);
    setImageFiles([]);
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ecostyle_admin");
    navigate("/admin/login");
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const soldOutCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock != null && p.stock > 0 && p.stock <= 5).length;

  // Banner Handlers
  const handleBannerImageChange = (e) => {
    if (e.target.files[0]) {
      setBannerImageFile(e.target.files[0]);
      setBannerImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const resetBannerForm = () => {
    setBannerForm({ title: "", badge: "", desc: "", btn: "", productId: "" });
    setBannerImageFile(null);
    setBannerImagePreview("");
    setEditingBannerId(null);
    setShowBannerForm(false);
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let productTile = null;
      if (bannerForm.productId) {
        const selectedProduct = products.find(p => p.id === bannerForm.productId);
        if (selectedProduct) {
          productTile = {
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: Number(selectedProduct.price),
            img: selectedProduct.images?.[0] || selectedProduct.imageUrl || ""
          };
        }
      }

      const bannerData = {
        title: bannerForm.title,
        badge: bannerForm.badge,
        desc: bannerForm.desc,
        btn: bannerForm.btn,
        img: bannerForm.img,
        productTile,
        updatedAt: serverTimestamp(),
      };

      if (editingBannerId) {
        await updateDoc(doc(db, "heroBanners", editingBannerId), bannerData);
      } else {
        bannerData.createdAt = serverTimestamp();
        await addDoc(collection(db, "heroBanners"), bannerData);
      }

      resetBannerForm();
      fetchBanners();
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Error saving banner.");
    } finally {
      setSaving(false);
    }
  };

  const handleBannerEdit = (banner) => {
    setBannerForm({
      title: banner.title || "",
      badge: banner.badge || "",
      desc: banner.desc || "",
      btn: banner.btn || "",
      img: banner.img || "",
      productId: banner.productTile?.id || "",
    });
    setBannerImageFile(null);
    setBannerImagePreview(banner.img || "");
    setEditingBannerId(banner.id);
    setShowBannerForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBannerDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteDoc(doc(db, "heroBanners", id));
      fetchBanners();
    } catch (err) {
      console.error("Error deleting banner:", err);
    }
  };

  const seedDefaultBanners = async () => {
    const defaultSlides = [
      {
        title: "Wear Better.\nLive Better.",
        badge: "SUSTAINABLE FASHION",
        desc: "Discover eco-friendly fashion made from sustainable materials. Good for you, good for the planet.",
        btn: "Shop Collection",
        img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
      },
      {
        title: "Modern.\nMinimal Style.",
        badge: "NEW COLLECTION",
        desc: "Premium essentials crafted for everyday comfort.",
        btn: "Explore Now",
        img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900",
      },
      {
        title: "Organic.\nPremium Wear.",
        badge: "SUMMER DROP",
        desc: "Ethically made clothing with timeless design.",
        btn: "View Collection",
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900",
      }
    ];

    setSaving(true);
    try {
      for (const slide of defaultSlides) {
        await addDoc(collection(db, "heroBanners"), {
          ...slide,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      fetchBanners();
    } catch (err) {
      console.error("Error seeding banners:", err);
      alert("Error loading default banners.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f0d] via-[#111a14] to-[#0d1510]">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Bar */}
      <header className="relative border-b border-green-900/30 bg-[#111a14]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <FaLeaf className="text-2xl text-green-500" />
            <div>
              <h1 className="text-xl font-serif font-bold text-white">EcoStyle</h1>
              <p className="text-xs text-gray-500 tracking-widest uppercase">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/5">
              View Store →
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition px-4 py-2 rounded-lg hover:bg-red-900/10">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-green-900/30 pb-2">
          <button 
            onClick={() => setActiveTab("products")} 
            className={`pb-2 px-2 text-lg font-semibold transition ${activeTab === "products" ? "text-green-400 border-b-2 border-green-400" : "text-gray-500 hover:text-gray-300"}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab("banners")} 
            className={`pb-2 px-2 text-lg font-semibold transition ${activeTab === "banners" ? "text-green-400 border-b-2 border-green-400" : "text-gray-500 hover:text-gray-300"}`}
          >
            Hero Banners
          </button>
        </div>

        {activeTab === "products" ? (
          <>
            {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: products.length, icon: <FiPackage />, color: "green" },
            { label: "In Stock", value: products.filter((p) => p.stock == null || p.stock > 0).length, icon: <FiGrid />, color: "green" },
            { label: "Low Stock (≤5)", value: lowStockCount, icon: <FiAlertTriangle />, color: lowStockCount > 0 ? "yellow" : "green" },
            { label: "Sold Out", value: soldOutCount, icon: <FiX />, color: soldOutCount > 0 ? "red" : "green" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#161e19]/80 backdrop-blur border border-green-900/20 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  stat.color === "red" ? "bg-red-900/30 text-red-400" :
                  stat.color === "yellow" ? "bg-yellow-900/30 text-yellow-400" :
                  "bg-green-900/30 text-green-400"
                }`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 bg-[#161e19]/80 backdrop-blur border border-green-900/20 rounded-xl px-4 py-3 w-full md:w-80">
            <FiSearch className="text-gray-500" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="bg-transparent text-white placeholder:text-gray-600 outline-none w-full" />
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-900/30">
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="mb-8 bg-[#161e19]/90 backdrop-blur-xl border border-green-900/30 rounded-3xl p-8 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-white transition p-2"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name & Category */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Organic Cotton Hoodie" className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Price, Original Price, Stock */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Selling Price (₹) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1999" className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Original Price (₹) <span className="text-gray-600 text-xs">optional</span></label>
                  <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="2999" className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Stock Quantity {form.sizes.length > 0 && <span className="text-gray-500 text-xs font-normal">(Auto-calculated)</span>}</label>
                  <input type="number" min="0" value={form.sizes.length > 0 ? form.sizes.reduce((sum, s) => sum + (parseInt(s.stock) || 0), 0) : form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="e.g. 10" className={`w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition ${form.sizes.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`} required={form.sizes.length === 0} disabled={form.sizes.length > 0} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." rows={3} className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition resize-none" />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((size) => {
                    const selectedSize = form.sizes.find(s => (typeof s === 'string' ? s : s.size) === size);
                    const isSelected = !!selectedSize;
                    return (
                      <div key={size} className="flex flex-col gap-2">
                        <button type="button" onClick={() => toggleSize(size)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-green-600 text-white shadow-lg shadow-green-900/30"
                            : "bg-[#0d1510] border border-green-900/40 text-gray-400 hover:text-white hover:border-green-500"
                        }`}>
                          {size}
                        </button>
                        {isSelected && (
                          <input 
                            type="number" 
                            min="0"
                            value={selectedSize.stock !== undefined ? selectedSize.stock : 0} 
                            onChange={(e) => updateSizeStock(size, e.target.value)} 
                            placeholder="Qty" 
                            className="w-16 bg-[#0d1510] border border-green-900/40 rounded-lg px-2 py-1 text-center text-sm text-white outline-none focus:border-green-500 transition mx-auto" 
                            required 
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Multi Image URLs */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URLs</label>
                <div className="space-y-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input type="url" value={url} onChange={(e) => updateImageUrl(i, e.target.value)} placeholder={`Image URL ${i + 1}`} className="flex-1 bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition" />
                      {form.images.length > 1 && (
                        <button type="button" onClick={() => removeImageUrl(i)} className="p-2 text-red-400 hover:text-red-300 transition"><FiX /></button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addImageUrlField} className="mt-2 flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition">
                  <FiPlus /> Add another URL
                </button>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Images</label>
                <label className="flex items-center gap-2 cursor-pointer bg-[#0d1510] border border-green-900/40 hover:border-green-500 rounded-xl px-5 py-3 text-gray-400 hover:text-white transition w-fit">
                  <FiUpload /> Choose Files
                  <input type="file" accept="image/*" multiple onChange={handleImageFilesChange} className="hidden" />
                </label>
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt={`Upload ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border border-green-900/30" />
                        <button type="button" onClick={() => removeImagePreview(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Existing image previews from URLs */}
              {form.images.filter((u) => u.trim()).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">URL Previews</label>
                  <div className="flex flex-wrap gap-3">
                    {form.images.filter((u) => u.trim()).map((url, i) => (
                      <img key={i} src={url} alt={`Preview ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border border-green-900/30" onError={(e) => (e.target.style.display = "none")} />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg disabled:opacity-50">
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{uploading ? "Uploading..." : "Saving..."}</>
                  ) : (
                    <><FiSave /> {editingId ? "Update Product" : "Save Product"}</>
                  )}
                </button>
                <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white px-6 py-3 transition">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-[#161e19]/80 backdrop-blur border border-green-900/20 rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-green-900/20">
            <h2 className="text-lg font-semibold text-white">All Products ({filtered.length})</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FiPackage className="mx-auto text-4xl text-gray-600 mb-4" />
              <p className="text-gray-500">No products found.</p>
              <p className="text-gray-600 text-sm mt-1">Click "Add Product" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-green-900/20">
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Sizes</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const isSoldOut = product.stock === 0;
                    const isLowStock = product.stock != null && product.stock > 0 && product.stock <= 5;
                    return (
                      <tr key={product.id} className={`border-b border-green-900/10 hover:bg-green-900/5 transition ${isSoldOut ? "opacity-60" : ""}`}>
                        <td className="px-6 py-4">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-green-900/20 flex items-center justify-center text-gray-600"><FiImage /></div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{product.name}</p>
                          {product.description && <p className="text-gray-500 text-sm mt-1 line-clamp-1">{product.description}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-semibold">₹{product.price?.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-gray-600 text-sm line-through ml-2">₹{product.originalPrice.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isSoldOut ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-900/30 text-red-400">SOLD OUT</span>
                          ) : isLowStock ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-900/30 text-yellow-400">Low: {product.stock}</span>
                          ) : product.stock != null ? (
                            <span className="text-gray-300">{product.stock}</span>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {product.sizes?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.sizes.map((s) => {
                                const sName = typeof s === 'string' ? s : s.size;
                                const sStock = typeof s === 'string' ? 0 : s.stock;
                                return (
                                  <span key={sName} className={`px-2 py-0.5 rounded text-xs ${sStock > 0 ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'}`}>
                                    {sName} {sStock > 0 ? `(${sStock})` : '(0)'}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-300">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-green-900/20 transition"><FiEdit2 size={16} /></button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition"><FiTrash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          </div>
          </>
        ) : (
          /* BANNERS VIEW */
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Manage Hero Banners</h2>
              <button onClick={() => { resetBannerForm(); setShowBannerForm(true); }} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-900/30">
                <FiPlus /> Add Banner
              </button>
            </div>

            {/* Banner Form */}
            {showBannerForm && (
              <div className="mb-8 bg-[#161e19]/90 backdrop-blur-xl border border-green-900/30 rounded-3xl p-8 shadow-2xl shadow-black/30">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">{editingBannerId ? "Edit Banner" : "Add New Banner"}</h2>
                  <button onClick={resetBannerForm} className="text-gray-500 hover:text-white transition p-2"><FiX size={20} /></button>
                </div>
                <form onSubmit={handleBannerSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title * (Use \n for new lines)</label>
                      <textarea value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Wear Better.\nLive Better." rows="2" className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                      <textarea value={bannerForm.desc} onChange={(e) => setBannerForm({ ...bannerForm, desc: e.target.value })} placeholder="Discover eco-friendly fashion..." rows="2" className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition" required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Badge Text</label>
                      <input type="text" value={bannerForm.badge} onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })} placeholder="SUSTAINABLE FASHION" className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Button Text *</label>
                      <input type="text" value={bannerForm.btn} onChange={(e) => setBannerForm({ ...bannerForm, btn: e.target.value })} placeholder="Shop Collection" className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Banner Image URL *</label>
                    <input type="url" value={bannerForm.img} onChange={(e) => setBannerForm({ ...bannerForm, img: e.target.value })} placeholder="https://images.unsplash.com/photo-1524504388940-b1c1722653e1" className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500 transition" required />
                    
                    {bannerForm.img && (
                      <div className="mt-4 relative w-full max-w-[200px] h-24 rounded-lg overflow-hidden border border-green-900/40">
                        <img src={bannerForm.img} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Featured Product Tile <span className="text-gray-600 text-xs">optional</span></label>
                    <select value={bannerForm.productId} onChange={(e) => setBannerForm({ ...bannerForm, productId: e.target.value })} className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition">
                      <option value="">-- No Featured Product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-green-900/30">
                    <button type="button" onClick={resetBannerForm} className="px-6 py-3 text-gray-400 hover:text-white transition">Cancel</button>
                    <button type="submit" disabled={saving || !bannerForm.img} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-xl transition-all disabled:opacity-50">
                      {saving ? "Saving..." : "Save Banner"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Banners List */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-[#161e19]/80 backdrop-blur border border-green-900/20 rounded-3xl overflow-hidden shadow-lg group">
                  <div className="relative h-48 w-full bg-gray-900">
                    <img src={banner.img} alt={banner.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => handleBannerEdit(banner)} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleBannerDelete(banner.id)} className="w-10 h-10 rounded-xl bg-red-500/20 backdrop-blur hover:bg-red-500/40 text-red-200 flex items-center justify-center transition border border-red-500/20">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {banner.badge && <span className="text-[10px] uppercase font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded mb-2 inline-block">{banner.badge}</span>}
                    <h3 className="text-xl font-bold text-white mb-2 whitespace-pre-line">{banner.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{banner.desc}</p>
                  </div>
                </div>
              ))}
              {banners.length === 0 && (
                <div className="col-span-full py-12 text-center border border-dashed border-green-900/30 rounded-3xl">
                  <FiImage className="mx-auto text-4xl text-green-900/50 mb-3" />
                  <p className="text-gray-500 mb-4">No banners found. Add some to display on the homepage!</p>
                  <button 
                    onClick={seedDefaultBanners} 
                    disabled={saving}
                    className="bg-green-900/30 hover:bg-green-900/50 text-green-400 px-6 py-2 rounded-xl transition font-medium border border-green-900/50 disabled:opacity-50"
                  >
                    {saving ? "Loading..." : "Load Default Banners"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
