import { Vote } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
            <Vote size={20} />
          </div>
          <span className="font-black uppercase tracking-[0.4em] text-sm text-white">
            SecureVote.
          </span>
        </div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] text-center max-w-sm leading-relaxed">
          Immutable audit architecture. Built by Association Governance.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
