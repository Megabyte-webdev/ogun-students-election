import { useEffect, useState, useRef } from "react";
import { ChevronRight, Fingerprint, Users, Vote } from "lucide-react";
import useAdmin from "../hooks/useAdmin";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CandidateGridCard from "../components/CandidateGridCard";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { getCurrentSession } from "../utils/formatters";

export default function HomePage() {
  const { getOpen } = useAdmin();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [noElection, setNoElection] = useState(false);

  // Ref for scrolling
  const candidatesRef = useRef(null);

  const scrollToCandidates = () => {
    candidatesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const activeRes = await getOpen("vote/active-election");
        if (!activeRes?.election) {
          setNoElection(true);
          return;
        }

        setElection(activeRes.election);

        const positionsRes = await getOpen("vote/positionsWithCandidate", {
          electionId: activeRes.election.id,
        });
        setPositions(positionsRes.positions || []);
      } catch (err) {
        console.error(err);
        setNoElection(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-white">
      <Navbar className="border-b border-white/5 bg-slate-950/20 backdrop-blur-xl" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[70%] bg-indigo-600/[0.07] blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[60%] bg-blue-600/[0.07] blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Polls are currently open
              </motion.div>

              {loading ? (
                <HeroSkeleton />
              ) : (
                <>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-6xl md:text-[100px] font-black text-white tracking-tighter mb-8 uppercase italic leading-[0.85] wrap-break-word"
                  >
                    {election?.title?.split(" ").map((word, i) => (
                      <span
                        key={i}
                        className={i % 2 !== 0 ? "text-indigo-500" : ""}
                      >
                        {word}{" "}
                      </span>
                    )) || "Active Election"}
                  </motion.h1>

                  <div className="flex flex-wrap gap-4 mt-12">
                    {!noElection && (
                      <motion.a
                        href="/vote"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "#6366f1",
                          color: "#fff",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_20px_50px_rgba(99,102,241,0.2)]"
                      >
                        Cast Your Ballot <ChevronRight size={18} />
                      </motion.a>
                    )}
                    <button
                      onClick={scrollToCandidates}
                      className="px-10 py-5 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-colors"
                    >
                      View Candidates
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative group"
              >
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-3xl group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-white/10 rounded-br-3xl group-hover:scale-105 transition-transform duration-500" />

                <div className="bg-slate-900/20 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/5">
                  <h4 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                    <div className="w-8 h-px bg-indigo-500/50" />
                    Election Vision
                  </h4>

                  <p className="text-2xl font-medium text-slate-200 leading-relaxed italic">
                    "
                    {election?.description ||
                      "Empowering students through transparent leadership and digital-first governance."}
                    "
                  </p>

                  <div className="mt-10 space-y-4">
                    <div className="flex items-center gap-4 text-slate-400">
                      <Users size={18} className="text-indigo-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        Verified Student Access
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <Vote size={18} className="text-indigo-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        Secure Ballot Protocol
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CANDIDATES SECTION --- */}
      <section
        ref={candidatesRef}
        className="max-w-7xl mx-auto py-32 px-8 scroll-mt-20"
      >
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-px bg-indigo-500" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">
              Ballot Registry
            </span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
            Official <span className="text-indigo-500">Aspirants</span>
          </h2>
          <p className="text-slate-500 mt-6 font-bold uppercase tracking-widest text-xs">
            {getCurrentSession()}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-3/4 bg-slate-900/50 rounded-[2.5rem] animate-pulse"
              />
            ))}
          </div>
        ) : noElection ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-500 font-black uppercase tracking-widest">
              No candidates found for this session.
            </p>
          </div>
        ) : (
          <div className="space-y-40">
            {positions.map((position) => (
              <div key={position.id} className="group">
                <div className="flex justify-between  gap-2 items-end mb-16 border-b border-white/5 pb-8">
                  <h3 className="text-2xl md:text-4xl lg:text-6xl font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-500 transition-colors">
                    {position.name}
                  </h3>
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {position.candidates.length} Registered
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                  {position.candidates.map((cand) => (
                    <CandidateGridCard
                      key={cand.id}
                      cand={{ ...cand, positionName: position.name }}
                      election={election?.title || ""}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-24 bg-slate-800/40 rounded-3xl animate-pulse w-full" />
      <div className="h-24 bg-slate-800/40 rounded-3xl animate-pulse w-3/4" />
      <div className="h-10 bg-slate-800/40 rounded-xl animate-pulse w-1/3" />
    </div>
  );
}
