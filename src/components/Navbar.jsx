import { Gavel, ShieldCheck } from "lucide-react";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Gavel className="text-white" size={20} />
        </div>
        <span className="font-black tracking-tighter text-xl uppercase">
          SecureVote
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck size={14} className="text-green-500" /> AES-256 Encrypted
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
