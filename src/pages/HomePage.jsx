import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import CandidatesSection from "../components/CandidatesSection";
import useAdmin from "../hooks/useAdmin";

export default function HomePage() {
  const { getOpen } = useAdmin();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [noElection, setNoElection] = useState(false);

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
    <div className="min-h-screen w-full bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-white">
      <Navbar className="border-b border-white/5 bg-slate-950/20 backdrop-blur-xl" />

      <HeroSection
        election={election}
        noElection={noElection}
        loading={loading}
        scrollToCandidates={scrollToCandidates}
        positions={positions}
      />

      <CandidatesSection
        positions={positions}
        election={election}
        loading={loading}
        noElection={noElection}
        candidatesRef={candidatesRef}
      />

      <Footer />
    </div>
  );
}
