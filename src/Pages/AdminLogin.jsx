import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "ambesh7704";
      if (password === adminPass) {
        sessionStorage.setItem("ecostyle_admin", "true");
        navigate("/admin");
      } else {
        setError("Invalid password. Access denied.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f0d] via-[#111a14] to-[#0d1510] flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-900/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <FaLeaf className="text-4xl text-green-500" />
            <h1 className="text-4xl font-serif font-bold text-white">EcoStyle</h1>
          </div>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#161e19]/80 backdrop-blur-xl border border-green-900/30 rounded-3xl p-8 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-900/40">
              <FiShield className="text-2xl text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-8 text-sm">Enter your admin password to continue</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FiLock className="inline mr-2" />
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-[#0d1510] border border-green-900/40 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3 text-red-400 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-green-900/30 hover:shadow-green-800/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiLock />
                  Access Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
