import React, { useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin";
import CandidateCard from "./CandidateCard";

export default function PositionVoteCard({ electionId, user, onClose }) {
  const { get, post } = useAdmin();
  const [positions, setPositions] = useState([]);
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPositions() {
      setLoading(true);
      try {
        const res = await get(`positions?electionId=${electionId}`);
        setPositions(res.positions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPositions();
  }, [electionId]);

  const handleVoteSelect = (positionId, candidateId) => {
    setVotes({ ...votes, [positionId]: candidateId });
  };

  const handleSubmit = async () => {
    if (Object.keys(votes).length !== positions.length) {
      return setError("Vote for all positions before submitting.");
    }

    setSubmitting(true);
    setError("");

    try {
      const results = await Promise.all(
        Object.entries(votes).map(([positionId, candidateId]) =>
          post("/vote/submit-vote", {
            matricNo: user.matricNo,
            deviceId: user.deviceId,
            biometricType: user.biometricType,
            biometricPayload: user.biometricPayload,
            positionId,
            candidateId,
          }),
        ),
      );

      const failed = results.find((r) => r.error);
      if (failed) setError(failed.error);
      else {
        alert("Votes submitted successfully!");
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit votes. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mr-3"></div>
        Loading positions...
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Vote for Positions</h2>
      {error && <p className="text-red-600">{error}</p>}
      {positions.map((pos) => (
        <div key={pos.id} className="border-b pb-4">
          <h3 className="text-lg font-semibold">{pos.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {pos.candidates?.map((cand) => (
              <CandidateCard
                key={cand.id}
                candidate={cand}
                selected={votes[pos.id] === cand.id}
                onSelect={() => handleVoteSelect(pos.id, cand.id)}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-6 px-6 py-2 rounded-lg text-white ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {submitting ? "Submitting..." : "Submit Votes"}
      </button>
    </div>
  );
}
