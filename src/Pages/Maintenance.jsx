import React from "react";
import { FaTools, FaLeaf } from "react-icons/fa";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f0d] via-[#111a14] to-[#0d1510] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-[#161e19]/80 backdrop-blur-xl border border-green-900/30 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl shadow-black/50">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-green-900/30 rounded-3xl mx-auto flex items-center justify-center mb-8 border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
          <FaTools className="text-4xl md:text-5xl text-green-400" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
          We'll be back soon!
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Our website is currently undergoing scheduled maintenance to improve your shopping experience. Please check back later.
        </p>

        <div className="inline-flex items-center gap-3 bg-[#0d1510] px-6 py-3 rounded-full border border-green-900/50 text-gray-300">
          <FaLeaf className="text-green-500" />
          <span className="font-medium tracking-wide">DB Fashion Team</span>
        </div>
      </div>
    </div>
  );
}
