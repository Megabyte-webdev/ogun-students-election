import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Shield, User, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const user = auth?.user;

  const handleLogout = () => {
    logout();
    navigate("/secure/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* --- CLEAN WHITE NAVIGATION BAR --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none">
                SEC <span className="text-indigo-600">Terminal</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                Administrative Suite
              </p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-slate-200">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-none uppercase">
                  {user?.name || "Super Admin"}
                </p>
                <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
                  {user?.role || "Administrator"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <User size={18} />
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-red-600 transition-all text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 group"
            >
              <LogOut
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="w-full max-w-7xl mx-auto flex">
        <main className="flex-1 p-8 md:p-12">
          {/* Breadcrumb Info */}
          <div className="flex items-center gap-2 mb-10">
            <div className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm">
              <LayoutDashboard size={12} className="text-indigo-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
              System Control /{" "}
              <span className="text-slate-900">Live Dashboard</span>
            </span>
          </div>

          {/* Page Content Container */}
          <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="p-12 text-center border-t border-slate-200 bg-white">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">
          SEC v2.0.4 &bull; Electoral Management Authority &bull;{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
