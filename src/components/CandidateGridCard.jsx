// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, X, Quote, ShieldCheck, Award } from "lucide-react";
import { useState } from "react";

function CandidateGridCard({ cand, election }) {
  const [showManifesto, setShowManifesto] = useState(false);

  return (
    <>
      {/* --- GRID CARD --- */}
      <motion.div
        whileHover={{ y: -8 }}
        onClick={() => setShowManifesto(true)}
        className="group flex flex-col cursor-pointer"
      >
        <div className="aspect-3/4 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative mb-5 transition-all duration-500 group-hover:border-indigo-500/50 shadow-2xl">
          <img
            src={cand.photo || "/placeholder.jpg"}
            alt={cand.name}
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <BookOpen size={14} /> View Registry
            </div>
          </div>
        </div>
        <div className="px-1">
          <h4 className="text-2xl font-black text-white leading-none tracking-tight uppercase italic mb-1 group-hover:text-indigo-400 transition-colors">
            {cand.name}
          </h4>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">
            {cand.positionName}
          </p>
        </div>
      </motion.div>

      {/* --- REFINED MODAL --- */}
      <AnimatePresence>
        {showManifesto && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManifesto(false)}
              className="absolute inset-0 bg-[#020617]/98 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative z-10"
            >
              {/* LEFT: Candidate Visuals */}
              <div className="md:w-5/12 relative bg-slate-900 overflow-hidden">
                <img
                  src={cand.photo || "/placeholder.jpg"}
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                  alt={cand.name}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

                <div className="relative h-full flex flex-col justify-end p-10 md:p-14">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-md mb-6 w-fit">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                      Verified by Electoral Body
                    </span>
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-4">
                    {cand.name}
                  </h3>
                  <div className="h-1 w-20 bg-indigo-500 mb-4" />
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.3em]">
                    Candidate for {cand.positionName}
                  </p>
                </div>
              </div>

              {/* RIGHT: Reading Area */}
              <div className="flex-1 flex flex-col bg-[#fcfcfc]">
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <Award className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        Session Document
                      </p>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight line-clamp-1">
                        {election || "Academic Governance Election"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowManifesto(false)}
                    className="p-3 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-10 md:p-16 overflow-y-auto">
                  <div className="max-w-2xl mx-auto">
                    <Quote size={40} className="text-indigo-600/10 mb-8" />

                    <div className="text-lg md:text-xl leading-[1.7] font-medium text-slate-700 whitespace-pre-line font-serif">
                      {cand.manifesto ||
                        "The official manifesto for this candidate is undergoing final review by the electoral body."}
                    </div>

                    <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Official Endorsement
                        </p>
                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tighter">
                          Student Electoral Commission (SEC)
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-30 grayscale">
                        <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300" />
                        <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CandidateGridCard;
