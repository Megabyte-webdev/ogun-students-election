import { useState, useEffect } from "react";
import { axiosClient } from "../services/axios-client";

export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");

  // Replace with actual position ID
  const positionId = "POSITION_UUID_HERE";

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axiosClient.get(`/admin/candidates/${positionId}`);
        setCandidates(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCandidates();
  }, []);

  const castVote = async (candidateId) => {
    try {
      await axiosClient.post("/vote", { positionId, candidateId });
      setMessage("Vote cast successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Voting failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          Cast Your Vote
        </h2>

        {message && (
          <p className="mb-4 text-center text-green-600 font-semibold">
            {message}
          </p>
        )}

        <div className="space-y-4">
          {candidates.length === 0 && (
            <p className="text-gray-500 text-center">Loading candidates...</p>
          )}

          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-800">{candidate.name}</p>
                {candidate.manifesto && (
                  <p className="text-gray-600 text-sm">{candidate.manifesto}</p>
                )}
              </div>

              <button
                onClick={() => castVote(candidate.id)}
                className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
