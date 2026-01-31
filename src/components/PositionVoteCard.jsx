// PositionVoteCard.jsx
import React, { useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin";
import CandidateCard from "./CandidateCard";
import { Check, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { extractErrorMessage } from "../utils/formatters";
import { axiosClient } from "../services/axios-client";

export default function PositionVoteCard({ electionId, user, onClose }) {
  const { getOpen } = useAdmin();
  const [positions, setPositions] = useState([]);
  const [votes, setVotes] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [failedPositions, setFailedPositions] = useState([]);

  useEffect(() => {
    async function fetchPositions() {
      setLoading(true);
      try {
        const res = await getOpen(`vote/positionsWithCandidate`);
        setPositions(res.positions || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load positions. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchPositions();
  }, [electionId]);

  const currentPos = positions[currentIndex];

  const handleSelect = (candId) => {
    setVotes((prev) => ({ ...prev, [currentPos.id]: candId }));
    setError("");
    setSuccessMsg("");
    setFailedPositions((prev) => prev.filter((id) => id !== currentPos.id));
  };

  const handleNext = () => {
    if (!votes[currentPos.id]) {
      setError("Selection required to proceed.");
      return;
    }
    if (currentIndex < positions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsReviewing(true);
    }
  };

  const handleSubmit = async () => {
  if (Object.keys(votes).length !== positions.length) {
    setError("Please vote for all positions before submitting.");
    return;
  }

  setSubmitting(true);
  setError("");
  setSuccessMsg("");
  const failedVotes = [];
  const succeededVotes = [];

  for (const [positionId, candidateId] of Object.entries(votes)) {
    try {
      const { data } = await axiosClient.post("vote/submit-vote", {
        matricNo: user.matricNo,
        deviceId: user.deviceId,
        biometricType: user.biometricType || "none",
        biometricPayload:
          user.biometricType && user.biometricType !== "none"
            ? user.biometricPayload
            : null,
        positionId,
        candidateId,
      });

      //  Robust success check
      if (data?.success === true || data?.success === "true") {
        succeededVotes.push({ positionId, message: data.message });
      } else {
        failedVotes.push({
          positionId,
          error: data?.message || "Vote rejected",
        });
      }
    } catch (err) {
      failedVotes.push({
        positionId,
        error: extractErrorMessage(err) || "Vote rejected",
      });
    }
  }

  setFailedPositions(failedVotes.map((f) => f.positionId));

  // Build per-position messages
  const errorMsg = failedVotes
    .map((f) => {
      const pos = positions.find((p) => p.id === f.positionId);
      return `${pos?.name}: ${f.error}`;
    })
    .join("\n");

  setError(errorMsg);

  // Success messages per position
  const successMsgStr = succeededVotes
    .map((s) => {
      const pos = positions.find((p) => p.id === s.positionId);
      return `${pos?.name}: ${s.message}`;
    })
    .join("\n");

  setSuccessMsg(successMsgStr);

  setSubmitting(false);
};

  
  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-mono text-blue-600">
        AUTHENTICATING BALLOT...
      </div>
    );

  // --- REVIEW SCREEN ---
if (isReviewing) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <ShieldCheck className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 uppercase">
          Review Your Ballot
        </h2>
        <p className="text-gray-500 text-sm">
          Please confirm your selections before final encryption.
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-200 divide-y divide-gray-200">
        {positions.map((pos) => {
          const selectedCand = pos.candidates.find(
            (c) => c.id === votes[pos.id]
          );
          const isFailed = failedPositions.includes(pos.id);
          const isSuccess = !isFailed && selectedCand;

          return (
            <div
              key={pos.id}
              className={`p-4 flex justify-between items-center ${
                isFailed
                  ? "bg-red-50"
                  : isSuccess
                  ? "bg-green-50"
                  : ""
              }`}
            >
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {pos.name}
                </p>
                <p
                  className={`font-bold ${
                    isFailed
                      ? "text-red-600"
                      : isSuccess
                      ? "text-green-700"
                      : "text-gray-800"
                  }`}
                >
                  {selectedCand?.name || "No Selection"}
                </p>
                {isFailed && (
                  <p className="text-red-500 text-xs font-bold">
                    {error
                      .split("\n")
                      .find((line) => line.startsWith(pos.name)) ||
                      "Submission failed. Retry."}
                  </p>
                )}
                {isSuccess && (
                  <p className="text-green-600 text-xs font-bold">
                    {successMsg
                      .split("\n")
                      .find((line) => line.startsWith(pos.name))}
                  </p>
                )}
              </div>

              {isFailed && (
                <button
                  onClick={() => {
                    setIsReviewing(false);
                    setCurrentIndex(positions.indexOf(pos));
                  }}
                  className="text-blue-600 text-xs font-bold hover:underline"
                >
                  Change
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setIsReviewing(false)}
          className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all"
        >
          Edit
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || failedPositions.length === 0}
          className="grow bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-tight shadow-lg hover:bg-green-700 disabled:bg-gray-400 transition-all"
        >
          {submitting ? "Processing..." : "Confirm & Cast Ballot"}
        </button>
      </div>
    </div>
  );
}
  
  
  // VOTING SCREEN
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / positions.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase">
          {currentIndex + 1} / {positions.length}
        </span>
      </div>

      <div className="animate-in slide-in-from-right-8 duration-300">
        <h2 className="text-3xl font-black text-gray-900 leading-none mb-2 uppercase tracking-tighter">
          {currentPos.name}
        </h2>
        <p className="text-gray-500 font-medium text-sm mb-6">
          Select one candidate for this position.
        </p>

        {error && (
          <p className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 mb-4 whitespace-pre-wrap">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="p-3 bg-green-50 text-green-600 text-xs font-bold rounded-lg border border-green-100 mb-4">
            {successMsg}
          </p>
        )}

        <div className="grid gap-3">
          {currentPos.candidates?.map((cand) => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              selected={votes[currentPos.id] === cand.id}
              onSelect={() => handleSelect(cand.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-100">
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="p-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <button
          onClick={handleNext}
          className="grow bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          {currentIndex === positions.length - 1
            ? "Review Selections"
            : "Next Position"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
