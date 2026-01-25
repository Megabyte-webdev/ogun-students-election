import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Vote, ChevronRight, Fingerprint, Users } from "lucide-react";
import useAdmin from "../hooks/useAdmin";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
  const { getOpen } = useAdmin();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [electionTitle, setElectionTitle] = useState("");
  const [noElection, setNoElection] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const activeRes = await getOpen("vote/active-election");
        if (!activeRes?.election) {
          setElectionTitle("No Active Election");
          setNoElection(true);
          return;
        }

        setElectionTitle(activeRes.election.title);

        const positionsRes = await getOpen("vote/positionsWithCandidate", {
          electionId: activeRes.election.id,
        });
        setPositions(positionsRes.positions || []);
      } catch (err) {
        console.error(err);
        setElectionTitle("Error Loading Election");
        setNoElection(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-white">
      <Navbar className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl" />

      {/* --- HERO --- */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-indigo-600/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-blue-600/10 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10"
          >
            <Fingerprint size={14} className="animate-pulse" /> Encrypted
            Identity Verification Active
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Hero */}
            <div className="text-left">
              {loading ? (
                <div className="space-y-6">
                  <div className="h-16 bg-slate-700/40 rounded-lg animate-pulse w-3/4" />
                  <div className="h-6 bg-slate-700/40 rounded-lg animate-pulse w-2/3" />
                  <div className="h-6 bg-slate-700/40 rounded-lg animate-pulse w-1/2" />
                </div>
              ) : (
                <>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 uppercase italic leading-[0.85]"
                  >
                    {electionTitle.split(" ").map((word, i) => (
                      <span
                        key={i}
                        className={i % 2 !== 0 ? "text-indigo-500" : ""}
                      >
                        {word}{" "}
                      </span>
                    ))}
                  </motion.h1>

                  {!noElection && (
                    <motion.a
                      href="/vote"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-4 bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:bg-indigo-500 hover:text-white shadow-[0_20px_50px_rgba(79,70,229,0.2)] active:scale-95"
                    >
                      Enter Voting Booth <ChevronRight size={18} />
                    </motion.a>
                  )}
                  {noElection && (
                    <p className="text-slate-400 mt-4">
                      Currently, there is no active election. Please check back
                      later.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Right Hero: Student Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:flex items-center justify-center bg-slate-900/40 border border-slate-800 backdrop-blur-3xl p-12 rounded-[3rem] shadow-2xl"
            >
              <div className="relative w-full h-64 flex flex-col items-center justify-center">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500/20 rounded-full animate-pulse" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full animate-pulse delay-200" />
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-bounce" />
                <div className="absolute bottom-4 right-6 w-16 h-16 bg-white/20 rounded-full animate-bounce delay-150" />

                <div className="flex gap-4 mt-4">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full animate-bounce" />
                  <div className="w-8 h-8 bg-purple-500 rounded-full animate-bounce delay-100" />
                  <div className="w-8 h-8 bg-pink-500 rounded-full animate-bounce delay-200" />
                  <div className="w-8 h-8 bg-green-400 rounded-full animate-bounce delay-300" />
                </div>

                {!loading && (
                  <p className="text-slate-400 text-center text-sm mt-6 max-w-xs">
                    Students actively participating in the election process,
                    reviewing candidates, and engaging in a safe and secure
                    voting experience.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CANDIDATES --- */}
      <section className="max-w-7xl mx-auto py-32 px-8">
        <div className="flex items-center gap-6 mb-20">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.5em] whitespace-nowrap">
            Official Aspirants
          </h2>
          <div className="grow h-px bg-slate-800/50" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-112.5 bg-slate-900/50 rounded-[2.5rem] animate-pulse"
              />
            ))}
          </div>
        ) : noElection ? (
          <p className="text-center text-slate-500 font-bold py-16">
            There is no active election at the moment.
          </p>
        ) : (
          <div className="space-y-32">
            {positions.map((position) => (
              <div
                key={position.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-1000"
              >
                <div className="flex justify-between items-end mb-12">
                  <h3 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                    {position.name}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    {position.candidates.length} Candidates
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                  {position.candidates.map((cand) => (
                    <CandidateGridCard key={cand.id} cand={cand} />
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

function CandidateGridCard({ cand }) {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      className="group relative flex flex-col"
    >
      <div className="aspect-3/4 w-full rounded-4xl overflow-hidden bg-slate-900 border border-slate-800/50 relative mb-6 transition-colors group-hover:border-indigo-500/50">
        <img
          src={cand.photo || "/placeholder.jpg"}
          alt={cand.name}
          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
        <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <button className="w-full py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Read Manifesto
          </button>
        </div>
      </div>
      <div className="px-2">
        <h4 className="text-2xl font-black text-white leading-none tracking-tighter uppercase italic mb-2">
          {cand.name}
        </h4>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
          {cand.manifesto?.slice(0, 60) || "Integrity in Leadership"}...
        </p>
      </div>
    </motion.div>
  );
}
