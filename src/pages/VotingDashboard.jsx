import { useState, useEffect } from "react";
import { Vote, Timer } from "lucide-react";
import useAdmin from "../hooks/useAdmin";
import ElectionCard from "../components/ElectionCard";
import Navbar from "../components/Navbar";

function EmptyState() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-black text-slate-900">
        No active elections
      </h2>
      <p className="text-slate-500 mt-2">
        Please check back later for upcoming election.
      </p>
    </div>
  );
}

export default function VotingDashboard() {
  const [election, setElection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");

  const { getOpen } = useAdmin();

  useEffect(() => {
    async function fetchElections() {
      setLoading(true);
      try {
        const res = await getOpen("vote/active-election");
        setElection(res.election || []);
      } catch (err) {
        console.error("Failed to fetch elections", err);
      } finally {
        setLoading(false);
      }
    }
    fetchElections();
  }, []);

  useEffect(() => {
    if (!election) return;

    function updateCountdown() {
      const now = new Date();
      const end = new Date(election.endTime);
      const diff = end - now;

      if (diff <= 0) {
        setCountdown("Election ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${String(hours).padStart(2, "0")}h : ${String(minutes).padStart(
          2,
          "0",
        )}m : ${String(seconds).padStart(2, "0")}s`,
      );
    }

    updateCountdown(); // initial call
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [election]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-bounce bg-blue-600 p-4 rounded-full shadow-xl">
          <Vote className="text-white" size={32} />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* --- TOP NAV --- */}
      <Navbar />

      <main className="max-w-6xl mx-auto p-8">
        {/* --- HEADER --- */}
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-none">
            Digital <span className="text-indigo-600">Ballot</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-xl font-medium">
            Verified identity-based voting system. Your selection is anonymous
            and cryptographically sealed.
          </p>
        </header>

        {/* --- HERO (ACTIVE ELECTION) --- */}
        {election ? (
          <div className="group relative">
            {/* Background Decor */}
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

            <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center shadow-2xl overflow-hidden">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                  Live Event
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  {election.title}
                </h2>

                <div className="flex items-center gap-6 py-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                      Election Ends
                    </span>
                    <span className="font-mono text-lg font-bold text-slate-700 flex items-center gap-2">
                      <Timer size={18} className="text-indigo-500" />{" "}
                      {countdown}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <ElectionCard election={election} variant="hero" />
                </div>
              </div>

              {/* Decorative Iconography */}
              <div className="hidden md:block w-1/3 opacity-5">
                <Vote size={300} strokeWidth={1} />
              </div>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
