import React, { useState } from "react";
import VoteModal from "./VoteModal";
import {
  ChevronRight,
  Calendar,
  Lock,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function ElectionCard({
  election,
  variant = "compact",
  disabled = false, // 🔐 controlled by VotingDashboard phase
}) {
  const [open, setOpen] = useState(false);

  // HARD BLOCK — do not allow modal open if disabled
  const handleOpen = () => {
    if (disabled) return;
    setOpen(true);
  };

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

  // -----------------------------
  // HERO VARIANT
  // -----------------------------
  if (variant === "hero") {
    return (
      <>
        <button
          onClick={handleOpen}
          disabled={disabled}
          className={`group relative flex items-center gap-4 px-8 py-5 rounded-2xl font-black uppercase tracking-tighter text-lg shadow-xl transition-all duration-300
            ${
              disabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-white text-indigo-600 shadow-indigo-900/20 hover:bg-slate-50 hover:-translate-y-1"
            }`}
        >
          <span>
            {disabled ? "Voting Not Available" : "Enter Secure Voting Booth"}
          </span>
          {!disabled && (
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          )}
        </button>

        <VoteModal
          election={open ? election : null}
          onClose={() => setOpen(false)}
        />
      </>
    );
  }

  // -----------------------------
  // COMPACT VARIANT
  // -----------------------------
  return (
    <>
      <div className="group bg-white border border-slate-200 p-6 rounded-4xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500 flex flex-col justify-between min-h-70">
        <div>
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                ${
                  disabled
                    ? "bg-red-50 text-red-700 border-red-100"
                    : "bg-green-50 text-green-700 border-green-100"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  disabled ? "bg-red-400" : "bg-green-500 animate-pulse"
                }`}
              />
              {disabled ? "Closed" : "Live"}
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
          {!disabled ? (
            <button
              onClick={handleOpen}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95"
            >
              Cast Ballot
            </button>
          ) : (
            <div className="w-full bg-slate-50 text-slate-400 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border border-slate-100">
              <CheckCircle2 size={14} />
              Voting Closed
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
