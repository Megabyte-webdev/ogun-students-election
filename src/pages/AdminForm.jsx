import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      const res = await fetch(`http://localhost:5000/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          `Server Protocol Error: Received ${res.status} status.`,
        );
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Administrative credentials rejected.");
      }

      // Save both Token and the User Object returned from your backend
      login(data.token, data.admin);

      setStatus({
        loading: false,
        error: "",
        success: `Welcome back, ${data.admin.name}. Initializing Terminal...`,
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setStatus({
        loading: false,
        error:
          err.message === "Unexpected end of JSON input"
            ? "Remote server returned an empty response. Please try again."
            : err.message,
        success: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs to match HomePage */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-8 transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Voting Portal
        </Link>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-4xl shadow-2xl">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="text-indigo-400" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
              Admin <span className="text-indigo-500">Access</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>

          {status.error && <StatusMsg type="error">{status.error}</StatusMsg>}
          {status.success && (
            <StatusMsg type="success">{status.success}</StatusMsg>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                size={18}
              />
              <input
                type="email"
                placeholder="Institutional Email"
                value={form.email}
                onChange={handleChange("email")}
                required
                className="w-full bg-slate-950/50 border border-white/5 p-4 pl-12 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                size={18}
              />
              <input
                type="password"
                placeholder="Access Key"
                value={form.password}
                onChange={handleChange("password")}
                required
                className="w-full bg-slate-950/50 border border-white/5 p-4 pl-12 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-indigo-500/10 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {status.loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Establish Connection"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em]">
          E2E Encrypted Terminal &bull; SEC v2.0.4
        </p>
      </motion.div>
    </div>
  );
}

const StatusMsg = ({ type, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`p-4 rounded-xl flex items-center text-[11px] font-bold uppercase tracking-wider mb-6 ${
      type === "error"
        ? "bg-red-500/10 border border-red-500/20 text-red-400"
        : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
    }`}
  >
    {type === "error" ? (
      <AlertCircle size={16} className="mr-3 shrink-0" />
    ) : (
      <CheckCircle2 size={16} className="mr-3 shrink-0" />
    )}
    {children}
  </motion.div>
);
