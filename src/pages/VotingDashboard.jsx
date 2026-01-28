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
        Please check back later for upcoming elections.
      </p>
    </div>
  );
}

export default function VotingDashboard() {
  const { getOpen } = useAdmin();

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("loading"); // loading | upcoming | live | ended
  const [countdown, setCountdown] = useState("");

  // -----------------------------
  // Fetch election
  // -----------------------------
  useEffect(() => {
    async function fetchElection() {
      setLoading(true);
      try {
        const res = await getOpen("vote/active-election");
        setElection(res?.election ?? null);
      } catch (err) {
        console.error("Failed to fetch election", err);
        setElection(null);
      } finally {
        setLoading(false);
      }
    }

    fetchElection();
  }, []);

  // -----------------------------
  // Phase + countdown controller
  // -----------------------------
  useEffect(() => {
    if (!election) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(election.startTime);
      const end = new Date(election.endTime);

      if (now < start) {
        setPhase("upcoming");

        const diff = start - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        setCountdown(
          `Starts in ${String(h).padStart(2, "0")}h : ${String(m).padStart(
            2,
            "0",
          )}m : ${String(s).padStart(2, "0")}s`,
        );
      } else if (now >= start && now < end) {
        setPhase("live");

        const diff = end - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        setCountdown(
          `${String(h).padStart(2, "0")}h : ${String(m).padStart(
            2,
            "0",
          )}m : ${String(s).padStart(2, "0")}s`,
        );
      } else {
        setPhase("ended");
        setCountdown("Election ended");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [election]);

  // -----------------------------
  // Loading state
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-bounce bg-blue-600 p-4 rounded-full shadow-xl">
          <Vote className="text-white" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <Navbar />

      <main className="max-w-6xl mx-auto p-8">
        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-none">
            Digital <span className="text-indigo-600">Ballot</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-xl font-medium">
            Verified identity-based voting system. Your selection is anonymous
            and cryptographically sealed.
          </p>
        </header>

        {!election && <EmptyState />}

        {election && (
          <div className="group relative">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25" />

            <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center shadow-2xl overflow-hidden">
              <div className="flex-1 space-y-6">
                {/* STATUS BADGE */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                  ${
                    phase === "live"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : phase === "upcoming"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                        : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  {phase === "live" && "Live Election"}
                  {phase === "upcoming" && "Upcoming Election"}
                  {phase === "ended" && "Election Ended"}
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  {election.title}
                </h2>

                {/* COUNTDOWN */}
                <div className="flex items-center gap-6 py-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                      {phase === "upcoming"
                        ? "Election Starts"
                        : "Election Ends"}
                    </span>
                    <span className="font-mono text-lg font-bold text-slate-700 flex items-center gap-2">
                      <Timer size={18} className="text-indigo-500" />
                      {countdown}
                    </span>
                  </div>
                </div>

                {/* PHASE MESSAGE */}
                {phase === "upcoming" && (
                  <p className="text-yellow-600 font-bold text-sm">
                    Voting has not started yet.
                  </p>
                )}

                {phase === "ended" && (
                  <p className="text-red-600 font-bold text-sm">
                    Voting period has closed.
                  </p>
                )}

                {/* CTA */}
                <div className="pt-4">
                  <ElectionCard
                    election={election}
                    variant="hero"
                    disabled={phase !== "live"}
                  />
                </div>
              </div>

              <div className="hidden md:block w-1/3 opacity-5">
                <Vote size={300} strokeWidth={1} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
