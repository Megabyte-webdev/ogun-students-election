import React, { useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import {
  Activity,
  ChevronRight,
  Users,
  Vote,
  Info,
  Loader2,
} from "lucide-react";
import HeroSkeleton from "./HeroSkeleton";
import useLiveVotes from "../hooks/useLiveVotes";

export default function HeroSection({
  election,
  noElection,
  loading,
  scrollToCandidates,
  positions = [],
}) {
  // Get data and loading status from our hook
  const { voteSummary, isSocketLoading } = useLiveVotes();

  // Calculate Total Votes
  const totalVotes = useMemo(() => {
    return Object.values(voteSummary).reduce((acc, posVotes) => {
      return (
        acc + Object.values(posVotes).reduce((sum, val) => sum + (val || 0), 0)
      );
    }, 0);
  }, [voteSummary]);

  return (
    <section className="relative pt-12 md:pt-20 pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[70%] bg-indigo-600/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[60%] bg-blue-600/8 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* LEFT COLUMN: CTA */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 w-fit"
          >
            <div
              className={`w-2 h-2 rounded-full ${noElection ? "bg-red-500" : "bg-indigo-400 animate-pulse"}`}
            />
            {noElection ? "Polls are closed" : "Polls are live"}
          </motion.div>

          {loading ? (
            <HeroSkeleton />
          ) : noElection ? (
            <div className="text-left p-10 border border-dashed border-white/10 rounded-[2.5rem] bg-slate-900/30 backdrop-blur-md">
              <p className="text-2xl font-black text-white uppercase tracking-widest mb-4">
                🚫 System Standby
              </p>
              <p className="text-slate-400 max-w-md leading-relaxed">
                The voting gateway is currently locked. Please check the
                official schedule.
              </p>
            </div>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl md:text-8xl lg:text-[100px] font-black text-white tracking-tighter mb-8 uppercase italic leading-[0.9] wrap-break-word"
              >
                {election?.title?.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={i % 2 !== 0 ? "text-indigo-500" : ""}
                  >
                    {word}{" "}
                  </span>
                )) || "Election"}
              </motion.h1>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="/vote"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-4 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-600/20"
                >
                  Enter Voting Booth <ChevronRight size={18} />
                </motion.a>
                <button
                  onClick={scrollToCandidates}
                  className="px-10 py-5 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-colors"
                >
                  Meet Candidates
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN: SCOREBOARD */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative flex flex-col h-150"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 flex items-center gap-3">
                  <Activity size={14} className="animate-pulse" /> Live
                  Scoreboard
                </h4>
                <div className="flex items-baseline gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isSocketLoading ? "loading" : totalVotes}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-black text-white tabular-nums"
                    >
                      {isSocketLoading ? "---" : totalVotes.toLocaleString()}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                    Total Ballots
                  </span>
                </div>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-500">
                <Vote size={24} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
              {isSocketLoading ? (
                /* LOADING STATE */
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                  <Loader2 size={32} className="animate-spin text-indigo-500" />
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black">
                    Connecting to Data Stream...
                  </p>
                </div>
              ) : (
                <LayoutGroup>
                  {positions?.length > 0 ? (
                    positions.map((pos) => {
                      const posVotes = voteSummary[pos.id] || {};
                      const totalPosVotes = Object.values(posVotes).reduce(
                        (sum, val) => sum + (val || 0),
                        0,
                      );

                      return (
                        <motion.div layout key={pos.id} className="group">
                          <div className="flex justify-between items-end mb-2">
                            <p className="text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                              <span className="w-1 h-3 bg-indigo-500 rounded-full" />{" "}
                              {pos.name}
                            </p>
                            <span className="text-slate-500 text-[9px] font-mono">
                              {totalPosVotes} votes
                            </span>
                          </div>

                          <div className="space-y-4 bg-white/2 p-4 rounded-2xl border border-white/5">
                            {pos.candidates.map((cand) => {
                              const candVotes = posVotes[cand.id] || 0;
                              const percentage = totalPosVotes
                                ? (candVotes / totalPosVotes) * 100
                                : 0;

                              return (
                                <div key={cand.id} className="relative">
                                  <div className="flex justify-between text-[10px] text-slate-300 mb-1.5 px-1">
                                    <span>{cand.name}</span>
                                    <span className="text-white font-bold">
                                      {candVotes}
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 40,
                                        damping: 15,
                                      }}
                                      className="h-full bg-linear-to-r from-indigo-600 to-blue-400 rounded-full"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
                      <Info size={32} className="mb-4 opacity-20" />
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
                        No live data available
                      </p>
                    </div>
                  )}
                </LayoutGroup>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4">
              <div className="min-w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Users size={18} />
              </div>
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                "
                {election?.description ||
                  "Empowering the student body through transparent digital governance."}
                "
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
