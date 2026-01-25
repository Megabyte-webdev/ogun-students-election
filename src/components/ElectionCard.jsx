import React, { useState } from "react";
import VoteModal from "./VoteModal";
import {
  ChevronRight,
  Calendar,
  Lock,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function ElectionCard({ election, variant = "compact" }) {
  const [open, setOpen] = useState(false);

  // Formatting Dates
  const startDate = new Date(election.startTime).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const startTime = new Date(election.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isActive = election.status === "active";

  // --- HERO VARIANT (Main Dashboard Feature) ---
  if (variant === "hero") {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="group relative flex items-center gap-4 bg-white text-indigo-600 px-8 py-5 rounded-2xl font-black uppercase tracking-tighter text-lg shadow-xl shadow-indigo-900/20 hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300"
        >
          <span>Enter Secure Voting Booth</span>
          <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </button>

        <VoteModal
          election={open ? election : null}
          onClose={() => setOpen(false)}
        />
      </>
    );
  }

  // --- COMPACT VARIANT (List/Registry View) ---
  return (
    <>
      <div className="group bg-white border border-slate-200 p-6 rounded-4xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500 flex flex-col justify-between min-h-70">
        <div>
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                isActive
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-slate-50 text-slate-400 border-slate-100"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-slate-300"}`}
              />
              {election.status}
            </div>
            <Lock size={14} className="text-slate-300" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
            {election.title}
          </h2>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={14} className="text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wide">
                {startDate}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Globe size={14} />
              <span className="text-[10px] font-medium uppercase tracking-widest">
                {startTime} Local Time
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {isActive ? (
            <button
              onClick={() => setOpen(true)}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95"
            >
              Cast Ballot
            </button>
          ) : (
            <div className="w-full bg-slate-50 text-slate-400 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border border-slate-100">
              <CheckCircle2 size={14} /> Election Closed
            </div>
          )}
        </div>
      </div>

      <VoteModal
        election={open ? election : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
